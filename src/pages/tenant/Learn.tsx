import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ComplianceNote } from "@/components/ComplianceNote";
import { currentUser, usePact } from "@/lib/store";
import { monthLabel } from "@/lib/format";

const TOPICS = [
  {
    q: "What is a credit file?",
    a: "It's a record kept by credit bureaus (in Canada, Equifax and TransUnion) of how you handle money you owe — loans, credit cards, and now rent when it's reported. Lenders, and sometimes landlords or phone companies, look at it to decide whether to trust you with payments over time.",
  },
  {
    q: "I'm new to Canada — why is my file empty?",
    a: "Credit history usually doesn't travel between countries. Even with a perfect record abroad, Canadian lenders start with nothing to look at. An empty file isn't a bad file. Reported rent gives it something real to show.",
  },
  {
    q: "What does 'reported' actually mean here?",
    a: "It means one verified month of rent left Pact and went to our licensed rent-reporting partner, who includes it in the file they send to the credit bureaus. Bureaus update on their own schedule, so there is usually a delay of a few weeks before it appears.",
  },
  {
    q: "Does it matter how I verified my payment?",
    a: "No. A payment verified from a bank match, confirmed by your landlord, or entered by you with a receipt is reported exactly the same way. There is no 'better' path.",
  },
  {
    q: "Will my score go up?",
    a: "Nobody can honestly promise that — not Pact, and not any rent-reporting service. What we can say is what generally helps: a longer record of on-time payments, and no missed months. The bureaus calculate scores using their own models, and lenders read them their own way.",
  },
  {
    q: "What happens if I pay late or miss a month?",
    a: "Rent reporting shows the real picture. A late or missed payment can be reported too, and that can work against you. If money is tight in a given month, talk to your landlord early — and know you can pause reporting.",
  },
  {
    q: "What does Pact never do?",
    a: "Pact does not lend you money, does not hold or move your rent, and is not a credit bureau. Your rent goes straight to your landlord the way it always has. We only verify that it happened, and hand that verification to a licensed reporting partner.",
  },
  {
    q: "Beyond rent, what else builds credit?",
    a: "Using a secured or beginner credit card and paying the full balance every month, keeping balances well below your limit, keeping accounts open over time, and applying for new credit only when you need it. Rent reporting is one piece, not the whole picture.",
  },
];

const Learn = () => {
  const db = usePact();
  const user = currentUser(db)!;
  const lease = db.leases.find((l) => l.tenantId === user.id);
  const reported = db.reports
    .filter((r) => r.leaseId === lease?.id && r.status === "reported")
    .sort((a, b) => a.periodMonth.localeCompare(b.periodMonth));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Understanding your credit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Short, jargon-free answers you can come back to any time.
        </p>
      </div>

      <section className="rounded-3xl border bg-card p-5">
        <h2 className="mb-2 font-semibold">Where you are right now</h2>
        {reported.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nothing has been reported yet. Once your first verified month reaches our reporting
            partner, this is where you'll see what's building.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong>{reported.length} month{reported.length === 1 ? "" : "s"}</strong> of rent
            have been reported, from {monthLabel(reported[0].periodMonth)} to{" "}
            {monthLabel(reported[reported.length - 1].periodMonth)}. Lenders generally want to
            see several months of consistent payments, so the value of this grows the longer you
            keep it up. What the bureaus do with it is up to them, not Pact.
          </p>
        )}
      </section>

      <Accordion type="single" collapsible className="space-y-2">
        {TOPICS.map((t) => (
          <AccordionItem key={t.q} value={t.q} className="rounded-2xl border bg-card px-4">
            <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
              {t.q}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
              {t.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <ComplianceNote />
    </div>
  );
};

export default Learn;