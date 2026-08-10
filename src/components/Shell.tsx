import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, LogOut, type LucideIcon } from "lucide-react";
import { currentUser, markNotificationsRead, signOut, usePact } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const Shell = ({
  items,
  title,
  notificationsPath,
}: {
  items: NavItem[];
  title: string;
  notificationsPath: string;
}) => {
  const db = usePact();
  const user = currentUser(db);
  const navigate = useNavigate();
  const unread = db.notifications.filter((n) => n.userId === user?.id && !n.read).length;

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-sidebar p-5 text-sidebar-foreground md:flex">
        <div>
          <NavLink to="/" className="mb-8 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary font-display text-lg font-semibold text-sidebar-primary-foreground">
              P
            </span>
            <span className="font-display text-xl">Pact</span>
          </NavLink>
          <p className="mb-3 px-2 text-xs uppercase tracking-wider text-sidebar-foreground/50">
            {title}
          </p>
          <nav className="space-y-1">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to.split("/").length <= 2}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="space-y-3 border-t border-sidebar-border pt-4">
          <div className="px-1">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-sidebar-foreground/75 hover:bg-sidebar-accent/60"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-display text-primary-foreground">
              P
            </span>
            <span className="font-display text-lg">Pact</span>
          </div>
          <p className="hidden text-sm text-muted-foreground md:block">
            Hi {user?.name?.split(" ")[0]} — {title}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              onClick={() => {
                navigate(notificationsPath);
                if (user) markNotificationsRead(user.id);
              }}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              onClick={() => {
                signOut();
                navigate("/");
              }}
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5 md:max-w-4xl md:px-8 md:pb-12">
          <Outlet />
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-flow-col border-t bg-card/95 backdrop-blur md:hidden">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.split("/").length <= 2}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};