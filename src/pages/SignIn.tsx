import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currentUser, getSnapshot, resetDemoData, signIn } from "@/lib/store";
import { showError, showSuccess } from "@/utils/toast";
import { MockBadge } from "@/components/MockBadge";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e?: React.FormEvent, creds?: { email: string; password: string }) => {
    e?.preventDefault();
    const res = signIn(creds?.email ?? email, creds?.password ?? password);
    if (!res.ok) {
      showError(res.error!);
      return;
    }
    const user = currentUser(getSnapshot())!;
    showSuccess(`Welcome back, ${user.name.split(" ")[0]}.`);
    navigate(user.role === "tenant" ? (user.onboarded ? "/app" : "/onboarding") : "/landlord");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <Link to="/" className="mb-8">
        <BrandLogo className="h-16 w-auto" />
      </Link>

      <h1 className="font-display text-2xl">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Renters and landlords use the same sign-in.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            className="rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full rounded-xl">
          Sign in
        </Button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="font-semibold text-primary underline">
          Create an account
        </Link>
      </p>

      <div className="mt-8 space-y-3">
        <MockBadge>Prototype auth stored locally in your browser.</MockBadge>
        <div className="grid gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => submit(undefined, { email: "tenant@demo.ca", password: "demo1234" })}
          >
            Enter as demo renter
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => submit(undefined, { email: "landlord@demo.ca", password: "demo1234" })}
          >
            Enter as demo landlord
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl text-xs"
            onClick={() => {
              resetDemoData();
              showSuccess("Demo data reset.");
            }}
          >
            Reset demo data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;