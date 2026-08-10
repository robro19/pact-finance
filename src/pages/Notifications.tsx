import { Link } from "react-router-dom";
import { BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentUser, markNotificationsRead, usePact } from "@/lib/store";
import { formatDate } from "@/lib/format";

const Notifications = () => {
  const db = usePact();
  const user = currentUser(db)!;
  const items = db.notifications.filter((n) => n.userId === user.id);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Reminders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monthly prompts and updates about your rent reporting.
          </p>
        </div>
        {items.some((n) => !n.read) && (
          <Button variant="ghost" className="rounded-xl" onClick={() => markNotificationsRead(user.id)}>
            Mark all read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border bg-card p-8 text-center text-sm text-muted-foreground">
          <BellOff className="mx-auto mb-3 h-6 w-6" />
          Nothing yet. We'll remind you each month when it's time to verify rent.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl border p-4 ${n.read ? "bg-card" : "bg-accent/50"}`}
            >
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</span>
                {n.actionPath && (
                  <Button asChild size="sm" variant="outline" className="rounded-xl">
                    <Link to={n.actionPath}>{n.actionLabel ?? "Open"}</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;