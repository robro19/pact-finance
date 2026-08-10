import { Home, ShieldCheck, FileText, GraduationCap, Building2 } from "lucide-react";
import { Shell } from "./Shell";

const items = [
  { to: "/app", label: "Home", icon: Home },
  { to: "/app/verify", label: "Verify", icon: ShieldCheck },
  { to: "/app/history", label: "History", icon: FileText },
  { to: "/app/lease", label: "Rental", icon: Building2 },
  { to: "/app/learn", label: "Learn", icon: GraduationCap },
];

const TenantLayout = () => (
  <Shell items={items} title="Renter account" notificationsPath="/app/notifications" />
);

export default TenantLayout;