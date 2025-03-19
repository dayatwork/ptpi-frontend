import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Laptop,
  Loader2,
  LogOut,
  QrCodeIcon,
  ShieldCheck,
  ShieldOff,
  Smartphone,
  StopCircle,
} from "lucide-react";
import { UAParser } from "ua-parser-js";
import QRCode from "react-qr-code";
import { authClient, signOut } from "@/auth/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@/components/ui/input-otp";
import { EditUserDialog } from "./edit-user-dialog";
import {
  invalidateListSessions,
  invalidateUserSession,
  useListSessions,
  useUserSession,
} from "../auth.query";
import { AddPasskeyDialog } from "./add-passkey-dialog";
import { ListPasskeys } from "./list-passkeys";
import { ChangePasswordDialog } from "./change-password-dialog";

export function UserCard({ noCard }: { noCard?: boolean }) {
  const navigate = useNavigate();
  const router = useRouter();
  const { data: activeSessions = [] } = useListSessions();
  const { data: session, isPending } = useUserSession();
  const [isTerminating, setIsTerminating] = useState<string>();
  const [isPendingTwoFa, setIsPendingTwoFa] = useState<boolean>(false);
  const [twoFaPassword, setTwoFaPassword] = useState<string>("");
  const [twoFactorDialog, setTwoFactorDialog] = useState<boolean>(false);
  const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState<string>("");
  const [isSignOut, setIsSignOut] = useState<boolean>(false);
  const [emailVerificationPending, setEmailVerificationPending] =
    useState<boolean>(false);
  const [terminatingOthers, setTerminatingOthers] = useState(false);

  if (isPending) return null;

  const content = (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex ">
              <AvatarImage
                src={session?.user.image || undefined}
                alt="Avatar"
                className="object-cover"
              />
              <AvatarFallback className="font-semibold text-background bg-foreground">
                {session?.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user.name}
                </p>
              </div>
              <p className="text-sm">{session?.user.email}</p>
            </div>
          </div>
          <EditUserDialog />
        </div>
      </div>

      {session?.user.emailVerified ? null : (
        <Alert>
          <AlertTitle>Verify Your Email Address</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Please verify your email address. Check your inbox for the
            verification email. If you haven't received the email, click the
            button below to resend.
          </AlertDescription>
          <Button
            size="sm"
            variant="secondary"
            className="mt-2"
            onClick={async () => {
              await authClient.sendVerificationEmail(
                {
                  email: session?.user.email || "",
                },
                {
                  onRequest() {
                    setEmailVerificationPending(true);
                  },
                  onError(context) {
                    toast.error(context.error.message);
                    setEmailVerificationPending(false);
                  },
                  onSuccess() {
                    toast.success("Verification email sent successfully");
                    setEmailVerificationPending(false);
                  },
                }
              );
            }}
          >
            {emailVerificationPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </Alert>
      )}

      <div className="border-l-2 px-2 w-max gap-1 flex flex-col">
        <p className="text-xs font-medium ">Active Sessions</p>
        {activeSessions
          .filter((activeSession) => activeSession.userAgent)
          .map((activeSession) => {
            return (
              <div key={activeSession.id}>
                <div className="flex items-center gap-2 text-sm  text-black font-medium dark:text-white">
                  {new UAParser(activeSession.userAgent || "").getDevice()
                    .type === "mobile" ? (
                    <Smartphone size={16} />
                  ) : (
                    <Laptop size={16} />
                  )}
                  {new UAParser(activeSession.userAgent || "").getOS().name},{" "}
                  {
                    new UAParser(activeSession.userAgent || "").getBrowser()
                      .name
                  }
                  <button
                    className="text-red-500 opacity-80  cursor-pointer text-xs border-red-600  hover:underline"
                    onClick={async () => {
                      setIsTerminating(activeSession.id);
                      const res = await authClient.revokeSession({
                        token: activeSession.token,
                      });

                      if (res.error) {
                        toast.error(res.error.message);
                      } else {
                        toast.success("Session terminated successfully");
                      }

                      await invalidateListSessions();

                      if (activeSession.id === session?.session.id) {
                        await invalidateUserSession();
                        router.invalidate();
                        window.location.href = "/sign-in";
                      }

                      router.invalidate();
                      setIsTerminating(undefined);
                    }}
                  >
                    {isTerminating === activeSession.id ||
                    (terminatingOthers &&
                      session?.session.id !== activeSession.id) ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : activeSession.id === session?.session.id ? (
                      "Sign Out"
                    ) : (
                      "Terminate"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      {activeSessions.length > 1 && (
        <button
          className="text-red-500 opacity-80  cursor-pointer text-xs border-red-600  hover:underline"
          onClick={async () => {
            setTerminatingOthers(true);
            const res = await authClient.revokeOtherSessions();

            if (res.error) {
              toast.error(res.error.message);
            } else {
              toast.success("Other sessions terminated successfully");
            }
            await invalidateListSessions();
            // router.refresh();
            router.invalidate();
            setIsTerminating(undefined);
          }}
        >
          {isTerminating ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            "Terminate all other sessions"
          )}
        </button>
      )}
      <div className="border-y py-4 flex items-center flex-wrap justify-between gap-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm">Passkeys</p>
          <div className="flex gap-2 flex-wrap">
            <AddPasskeyDialog />
            <ListPasskeys />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">Two Factor</p>
          <div className="flex gap-2">
            {!!session?.user.twoFactorEnabled && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <QrCodeIcon size={16} />
                    <span className="md:text-sm text-xs">Scan QR Code</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-11/12">
                  <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                    <DialogDescription>
                      Scan the QR code with your TOTP app
                    </DialogDescription>
                  </DialogHeader>

                  {twoFactorVerifyURI ? (
                    <>
                      <div className="flex items-center justify-center">
                        <QRCode value={twoFactorVerifyURI} />
                      </div>
                      <div className="flex gap-2 items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          Copy URI to clipboard
                        </p>
                        <CopyButton textToCopy={twoFactorVerifyURI} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <PasswordInput
                        value={twoFaPassword}
                        onChange={(e) => setTwoFaPassword(e.target.value)}
                        placeholder="Enter Password"
                      />
                      <Button
                        onClick={async () => {
                          if (twoFaPassword.length < 8) {
                            toast.error(
                              "Password must be at least 8 characters"
                            );
                            return;
                          }
                          await authClient.twoFactor.getTotpUri(
                            {
                              password: twoFaPassword,
                            },
                            {
                              onSuccess(context) {
                                setTwoFactorVerifyURI(context.data.totpURI);
                              },
                            }
                          );
                          setTwoFaPassword("");
                        }}
                      >
                        Show QR Code
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )}
            <Dialog open={twoFactorDialog} onOpenChange={setTwoFactorDialog}>
              <DialogTrigger asChild>
                <Button
                  variant={
                    session?.user.twoFactorEnabled ? "destructive" : "outline"
                  }
                  className="gap-2"
                >
                  {session?.user.twoFactorEnabled ? (
                    <ShieldOff size={16} />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                  <span className="md:text-sm text-xs">
                    {session?.user.twoFactorEnabled
                      ? "Disable 2FA"
                      : "Enable 2FA"}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-11/12">
                <DialogHeader>
                  <DialogTitle>
                    {session?.user.twoFactorEnabled
                      ? "Disable 2FA"
                      : "Enable 2FA"}
                  </DialogTitle>
                  <DialogDescription>
                    {session?.user.twoFactorEnabled
                      ? "Disable the second factor authentication from your account"
                      : "Enable 2FA to secure your account"}
                  </DialogDescription>
                </DialogHeader>

                {twoFactorVerifyURI ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center">
                      <QRCode value={twoFactorVerifyURI} />
                    </div>
                    <Label
                      htmlFor="password"
                      className="mt-2 w-full justify-center"
                    >
                      Scan the QR code with your TOTP app
                    </Label>
                    {/* <Input
                        value={twoFaPassword}
                        onChange={(e) => setTwoFaPassword(e.target.value)}
                        placeholder="Enter OTP"
                      /> */}
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={twoFaPassword}
                        onChange={(value) => setTwoFaPassword(value)}
                        pattern={REGEXP_ONLY_DIGITS}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="text-2xl font-semibold size-[46px]"
                          />
                          <InputOTPSlot
                            index={1}
                            className="text-2xl font-semibold size-[46px]"
                          />
                          <InputOTPSlot
                            index={2}
                            className="text-2xl font-semibold size-[46px]"
                          />
                          <InputOTPSlot
                            index={3}
                            className="text-2xl font-semibold size-[46px]"
                          />
                          <InputOTPSlot
                            index={4}
                            className="text-2xl font-semibold size-[46px]"
                          />
                          <InputOTPSlot
                            index={5}
                            className="text-2xl font-semibold size-[46px]"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                      id="password"
                      placeholder="Password"
                      value={twoFaPassword}
                      onChange={(e) => setTwoFaPassword(e.target.value)}
                    />
                  </div>
                )}
                <DialogFooter>
                  <Button
                    disabled={isPendingTwoFa}
                    onClick={async () => {
                      if (twoFaPassword.length < 8 && !twoFactorVerifyURI) {
                        toast.error("Password must be at least 8 characters");
                        return;
                      }
                      setIsPendingTwoFa(true);
                      if (session?.user.twoFactorEnabled) {
                        await authClient.twoFactor.disable({
                          password: twoFaPassword,
                          fetchOptions: {
                            onError(context) {
                              toast.error(context.error.message);
                            },
                            async onSuccess() {
                              toast("2FA disabled successfully");
                              await invalidateUserSession();
                              setTwoFactorDialog(false);
                            },
                          },
                        });
                      } else {
                        if (twoFactorVerifyURI) {
                          await authClient.twoFactor.verifyTotp({
                            code: twoFaPassword,
                            fetchOptions: {
                              onError(context) {
                                setIsPendingTwoFa(false);
                                setTwoFaPassword("");
                                toast.error(context.error.message);
                              },
                              async onSuccess() {
                                toast("2FA enabled successfully");
                                await invalidateUserSession();
                                setTwoFactorVerifyURI("");
                                setIsPendingTwoFa(false);
                                setTwoFaPassword("");
                                setTwoFactorDialog(false);
                              },
                            },
                          });
                          return;
                        }
                        await authClient.twoFactor.enable({
                          password: twoFaPassword,
                          fetchOptions: {
                            onError(context) {
                              toast.error(context.error.message);
                            },
                            async onSuccess(ctx) {
                              setTwoFactorVerifyURI(ctx.data.totpURI);
                              await invalidateUserSession();
                              // toast.success("2FA enabled successfully");
                              // setTwoFactorDialog(false);
                            },
                          },
                        });
                      }
                      setIsPendingTwoFa(false);
                      setTwoFaPassword("");
                    }}
                  >
                    {isPendingTwoFa ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : session?.user.twoFactorEnabled ? (
                      "Disable 2FA"
                    ) : (
                      "Enable 2FA"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );

  const footer = (
    <>
      <ChangePasswordDialog />
      {session?.session.impersonatedBy ? (
        <Button
          className="gap-2 z-10"
          variant="secondary"
          onClick={async () => {
            setIsSignOut(true);
            await authClient.admin.stopImpersonating();
            setIsSignOut(false);
            toast.info("Impersonation stopped successfully");
            // router.push("/admin");
            navigate({ to: "/admin/dashboard" });
          }}
          disabled={isSignOut}
        >
          <span className="text-sm">
            {isSignOut ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <StopCircle size={16} color="red" />
                Stop Impersonation
              </div>
            )}
          </span>
        </Button>
      ) : (
        <Button
          className="gap-2 z-10"
          variant="secondary"
          onClick={async () => {
            setIsSignOut(true);
            await signOut({
              fetchOptions: {
                onSuccess: async () => {
                  await invalidateUserSession();
                  router.invalidate();
                  window.location.href = "/sign-in";
                },
              },
            });
            setIsSignOut(false);
          }}
          disabled={isSignOut}
        >
          <span className="text-sm">
            {isSignOut ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <LogOut size={16} />
                Sign Out
              </div>
            )}
          </span>
        </Button>
      )}
    </>
  );

  if (noCard) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <div className="grid gap-8 grid-cols-1">{content}</div>
        <div className="gap-2 flex justify-between items-center">{footer}</div>
      </div>
    );
  }

  return (
    <Card className="max-w-5xl bg-muted">
      <CardHeader>
        <CardTitle>User</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 grid-cols-1">{content}</CardContent>
      <CardFooter className="gap-2 justify-between items-center">
        {footer}
      </CardFooter>
    </Card>
  );
}
