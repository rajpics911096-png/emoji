import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Smile, Users, Eye, Download } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Total Emojis", value: "1,250", icon: Smile, change: "+20.1% from last month" },
    { title: "Total Users", value: "23,456", icon: Users, change: "+180.1% from last month" },
    { title: "Page Views", value: "5,231,890", icon: Eye, change: "+19% from last month" },
    { title: "Total Downloads", value: "1,234,567", icon: Download, change: "+22% from last month" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">More detailed analytics and charts will be available here soon.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
