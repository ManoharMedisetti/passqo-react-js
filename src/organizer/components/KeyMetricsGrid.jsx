import { DollarSign, Ticket, Calendar, Users, TrendingUp } from "lucide-react";

export function KeyMetricsGrid({
  revenue = "$89,245",
  revenueGrowth = "+12.5%",
  ticketsSold = "2,847",
  ticketsGrowth = "+8.2%",
  activeEvents = "23",
  eventsBadge = "5 this week",
  totalCustomers = "8,734",
  customersGrowth = "+15.3%",
}) {
  const metrics = [
    {
      id: "revenue",
      icon: DollarSign,
      iconBg: "bg-blue-500",
      value: revenue || "$0.00",
      growth: revenueGrowth || "+0.0%",
      growthType: "positive",
      title: "Total Revenue",
      subtitle: "vs last 30 days",
    },
    {
      id: "tickets",
      icon: Ticket,
      iconBg: "bg-green-500",
      value: ticketsSold || "0",
      growth: ticketsGrowth || "+0.0%",
      growthType: "positive",
      title: "Tickets Sold",
      subtitle: "234 sold today",
    },
    {
      id: "events",
      icon: Calendar,
      iconBg: "bg-purple-500",
      value: activeEvents || "0",
      growth: eventsBadge || "0 this week",
      growthType: "badge",
      title: "Active Events",
      subtitle: "12 upcoming",
    },
    {
      id: "customers",
      icon: Users,
      iconBg: "bg-orange-500",
      value: totalCustomers || "0",
      growth: customersGrowth || "+0.0%",
      growthType: "positive",
      title: "Total Customers",
      subtitle: "0 new this month",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all"
          >
            {/* Top row: Icon + Value & Growth */}
            <div className="flex items-start justify-between gap-3">
              <div
                className={`w-12 h-12 rounded-xl ${m.iconBg} flex items-center justify-center text-white shadow-2xs flex-shrink-0`}
              >
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div className="text-right">
                <span className="text-2xl md:text-3xl font-bold text-[#0f172a] tracking-tight block">
                  {m.value}
                </span>
                {m.growthType === "badge" ? (
                  <span className="text-xs font-semibold text-blue-600 inline-block mt-0.5">
                    {m.growth}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-0.5 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    {m.growth}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom row: Title & Subtitle */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-[#0f172a]">
                {m.title}
              </h4>
              <p className="text-xs text-[#64748b] mt-0.5">
                {m.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KeyMetricsGrid;
