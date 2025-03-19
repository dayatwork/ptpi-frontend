import { useCallback, useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { authClient } from "@/auth/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/components/form";
import { FormErrors } from "@/components/form/form-errors";
import { ensureUserSessionData } from "@/modules/auth/auth.query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Key } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const signInInputSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});
type SignInInput = z.infer<typeof signInInputSchema>;

const signInSearchSchema = z.object({
  message: z.string().optional(),
});

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
  validateSearch: signInSearchSchema,
  beforeLoad: async ({ search, context }) => {
    const session = await ensureUserSessionData(context.queryClient);
    if (session) {
      throw redirect({ to: "/app" });
    }
    // await requireNoAuth({ context });
    if (search.message === "account-activated") {
      toast.success("Your account is activated!", { richColors: true });
    }
  },
});

function RouteComponent() {
  const [formError, setFormError] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !PublicKeyCredential.isConditionalMediationAvailable ||
      !PublicKeyCredential.isConditionalMediationAvailable()
    ) {
      return;
    }

    void authClient.signIn.passkey({
      autoFill: true,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Success log in with passkey");
          window.location.href = "/dashboard";
        },
        onError: ({ error }) => {
          toast.error(`Failed. ${error.message}`);
        },
      },
    });
  }, [navigate]);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    } as SignInInput,
    validators: {
      onSubmit: signInInputSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await authClient.signIn.email({
        email: value.email,
        password: value.password,
        rememberMe: value.rememberMe,
        callbackURL: "/app",
        fetchOptions: import.meta.env.PROD
          ? {
              headers: {
                "x-captcha-response": token,
              },
            }
          : undefined,
      });

      if (res.error) {
        setFormError(res.error.message || "");
        toast.error(res.error.message, { richColors: true });
      }
    },
  });

  const handleSignInWithPasskey = useCallback(async () => {
    await authClient.signIn.passkey({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Success log in with passkey");
          window.location.href = "/app";
        },
        onError: ({ error }) => {
          toast.error(`Failed. ${error.message}`);
        },
      },
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px] bg-muted/40">
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="sign-in-form"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FormErrors error={formError} />
            <form.AppField
              name="email"
              children={(field) => <field.EmailField label="Email" />}
            />
            <form.AppField
              name="password"
              children={(field) => <field.PasswordField label="Password" />}
            />
            <form.AppField
              name="rememberMe"
              children={(field) => <field.CheckboxField label="Remember Me" />}
            />
            <form.AppForm>
              <form.SubmitButton
                fullWidth
                text="Sign in"
                submittingText="Signing in..."
              />
            </form.AppForm>
          </form>
          {import.meta.env.PROD ? (
            <Turnstile
              siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY}
              onSuccess={setToken}
            />
          ) : null}
          <div className="w-full relative py-4 flex items-center">
            <Separator />
            <p className="absolute text-center left-1/2 translate-x-[-50%] px-1.5 bg-muted rounded-full text-muted-foreground top-1.5 text-sm">
              or
            </p>
          </div>
          <Button
            variant="outline"
            className={cn("w-full gap-2")}
            onClick={async () => {
              await authClient.signIn.social({
                provider: "github",
                callbackURL: "/dashboard",
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              ></path>
            </svg>
            Sign in with Github
          </Button>
          <Button
            variant="outline"
            className="gap-2 w-full"
            onClick={handleSignInWithPasskey}
          >
            <Key size={16} />
            Sign-in with Passkey
          </Button>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/sign-up" className="underline hover:text-foreground">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
