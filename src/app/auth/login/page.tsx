"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { SignInForm } from "./_components/sign-in-form";
import { SignUpForm } from "./_components/sign-up-form";
import { SocialAuthButtons } from "./_components/social-auth-buttons";
import { EmailVerification } from "./_components/email-verification";
import { ForgotPasswordForm } from "./_components/forgot-password-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");
  const router = useRouter();
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data !== null) router.push("/");
    });
  }, [router]);

  const openEmailVerificationTab = (email: string) => {
    setEmail(email);
    setSelectedTab("email-verification");
  };

  return (
    <section className="animate-fade-up">
      <Tabs
        value={selectedTab}
        onValueChange={(t) => setSelectedTab(t as Tab)}
        className="mx-auto w-full max-w-xl px-4 animate-fade-up"
      >
        <TabsContent value="signin">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle className="mb-4">Sign In</CardTitle>
              <SocialAuthButtons />
            </CardHeader>
            <Separator className="relative my-2">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-muted-foreground bg-card px-4">
                or
              </span>
            </Separator>
            <CardContent>
              <SignInForm
                openEmailVerificationTab={openEmailVerificationTab}
                openForgotPasswordTab={() => setSelectedTab("forgot-password")}
              />
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-sm font-normal hover:underline"
                onClick={() => setSelectedTab("signup")}
              >
                Don&apos;t have an account?
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle className="mb-4">Sign Up</CardTitle>
              <SocialAuthButtons />
            </CardHeader>
            <Separator className="relative my-2">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-muted-foreground bg-card px-4">
                or
              </span>
            </Separator>
            <CardContent>
              <SignUpForm openEmailVerificationTab={openEmailVerificationTab} />
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                variant="link"
                size="sm"
                className="text-sm font-normal hover:underline"
                onClick={() => setSelectedTab("signin")}
              >
                Already have an account?
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="email-verification">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle>Verify your email</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailVerification email={email} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="forgot-password">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle>Forgot password</CardTitle>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm
                openSignInTab={() => setSelectedTab("signin")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
