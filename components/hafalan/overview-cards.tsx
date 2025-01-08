import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, Timer } from "lucide-react";

interface OverviewCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  unit: string;
}

function OverviewCard({ icon, title, value, unit }: OverviewCardProps) {
  return (
    <Card className="bg-card hover:bg-primary/5 transition-colors duration-300">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-2">
          {icon}
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{unit}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <OverviewCard
        icon={<LayoutGrid className="h-6 w-6 text-primary" />}
        title="Total Hafalan"
        value={12}
        unit="Halaman"
      />
      <OverviewCard
        icon={<Timer className="h-6 w-6 text-primary" />}
        title="Streak"
        value={7}
        unit="Hari"
      />
    </div>
  );
}
