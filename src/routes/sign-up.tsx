import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
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

const signUpInputSchema = z.object({
  name: z.string().min(3, "Minimum 3 characters"),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, "Minimum 8 characters"),
});

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const session = await ensureUserSessionData(context.queryClient);
    if (session) {
      throw redirect({ to: "/app" });
    }
  },
});

function RouteComponent() {
  const [formError, setFormError] = useState("");
  const [token, setToken] = useState("");

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signUpInputSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const res = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        callbackURL: `${import.meta.env.VITE_APP_URL}/sign-in?message=account-activated`,
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

      if (res.data) {
        toast.success("You are signed up! Check your email for verification!", {
          richColors: true,
        });
        formApi.reset();
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px] bg-muted/40">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Create new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="sign-in-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FormErrors error={formError} />
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Name" />}
            />
            <form.AppField
              name="email"
              children={(field) => <field.EmailField label="Email" />}
            />
            <form.AppField
              name="password"
              children={(field) => <field.PasswordField label="Password" />}
            />
            <form.AppForm>
              <form.SubmitButton
                fullWidth
                text="Sign up"
                submittingText="Signing up..."
              />
            </form.AppForm>
          </form>
          {import.meta.env.PROD ? (
            <Turnstile
              siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY}
              onSuccess={setToken}
            />
          ) : null}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="underline hover:text-foreground">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
