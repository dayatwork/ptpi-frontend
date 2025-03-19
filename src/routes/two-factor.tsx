import { authClient } from "@/auth/auth-client";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { ensureUserSessionData } from "@/modules/auth/auth.query";

export const Route = createFileRoute("/two-factor")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const session = await ensureUserSessionData(context.queryClient);
    if (session) {
      throw redirect({ to: "/app" });
    }
  },
});

function RouteComponent() {
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6 || !/^\d+$/.test(totpCode)) {
      setError("TOTP code must be 6 digits");
      return;
    }
    authClient.twoFactor.verifyTotp({
      code: totpCode,
      fetchOptions: {
        onSuccess: () => {
          setError("");
          window.location.href = "/app";
        },
        onError: () => {
          setError("Invalid TOTP code");
        },
      },
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-[350px] bg-muted/40">
        <CardHeader>
          <CardTitle>TOTP Verification</CardTitle>
          <CardDescription>
            Enter your 6-digit TOTP code to authenticate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="totp">TOTP Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={totpCode}
                  onChange={(value) => setTotpCode(value)}
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
            {error && (
              <div className="flex items-center mt-2 text-red-500">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={totpCode.length !== 6}
            >
              Verify
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground gap-2">
          <Link to="/two-factor/otp">
            <Button variant="link" size="sm">
              Switch to Email Verification
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
