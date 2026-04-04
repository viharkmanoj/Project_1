import { Database, Users, TrendingUp } from "lucide-react";

interface ExampleQueriesProps {
  onSelect: (query: string) => void;
}

const examples = [
  { icon: TrendingUp, text: "Top 5 highest paid employees" },
  { icon: Database, text: "Average salary by department" },
  { icon: Users, text: "Employees with their managers" },
  { icon: TrendingUp, text: "Total headcount per department" },
];

const ExampleQueries = ({ onSelect }: ExampleQueriesProps) => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20">
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
        <Database className="h-7 w-7 text-primary" />
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">Employee Management</h1>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
        Ask questions about your employees in plain English. I'll query the database and show you the results.
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {examples.map((ex) => (
          <button
            key={ex.text}
            onClick={() => onSelect(ex.text)}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left text-sm text-foreground transition-all hover:border-primary/40 hover:bg-surface-hover"
          >
            <ex.icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            {ex.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleQueries;
