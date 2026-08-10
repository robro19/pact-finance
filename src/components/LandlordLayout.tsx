import { Users, Bell, HelpCircle } from "lucide-react";
import { Shell } from "./Shell";

const items = [
  { to: "/landlord", label: "Tenants", icon: Users },
  { to: "/landlord/notifications", label: "Requests", icon: Bell },
  { to: "/landlord/about", label: "About", icon: HelpCircle },
];

const LandlordLayout = () => (
  <Shell
    items={items}
    title="Landlord / property manager"
    notificationsPath="/landlord/notifications"
  />
);

export default LandlordLayout;