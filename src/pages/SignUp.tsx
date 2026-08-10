import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUp } from "@/lib/store";
import { COUNTRIES, type Country, type Role } from "@/lib/types";
import { showError, showSuccess } from "@/utils/toast";
import { cn } from "@/lib/utils";

const SignUp = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState<Role>((params.get("role") as Role) || "tenant");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState<Country>("CA");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || password.length < 6) {
      showError("Add your name, email, and a password of at least 6 characters.");
      return;
    }
    const res = signUp({ name, email, password, role, country, company: company || undefined });
    if (!res.ok) {
      showError(res.error!);
      return;
    }
    showSuccess("Account created.");
    navigate(role === "tenant" ? "/onboarding" : "/landlord");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <Link to="/" className="mb-8">
        <BrandLogo className="h-16 w-auto" />
      </Link>

      <h1 className="font-display text-2xl">Create your account</h1>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {(["tenant", "landlord"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "rounded-2xl border p-3 text-left text-sm transition-all",
              role === r ? "border-primary ring-2 ring-primary/25" : "hover:border-primary/40",
            )}
          >
            <span className="block font-semibold">
              {r === "tenant" ? "I rent a home" : "I'm a landlord"}
            </span>
            <span className="block text-xs text-muted-foreground">
              {r === "tenant" ? "Build credit with rent" : "Confirm tenant payments"}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" className="rounded-xl" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        {role === "landlord" && (
          <div className="grid gap-2">
            <Label htmlFor="company">Company or building name (optional)</Label>
            <Input
              id="company"
              className="rounded-xl"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        )}
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
        <div className="grid gap-2">
          <Label>Country</Label>
          <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code} disabled={!c.active}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full rounded-xl">
          Create account
        </Button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-primary underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;