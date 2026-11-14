import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function ConversionAndTopEvents({
  conversionRate = "73.5%",
  conversionGrowth = "+2.3% from last month",
}) {
  const topEvents = [
    {
      rank: 1,
      badgeColor: "bg-[#2563EB]",
      name: "Cultural Fusion Fest 2025",
      sold: "789 / 1200 sold",
      revenue: "$35K",
    },
    {
      rank: 2,
      badgeColor: "bg-[#10B981]",
      name: "Tech Innovation Summit",
      sold: "602 / 1000 sold",
      revenue: "$44K",
    },
    {
      rank: 3,
      badgeColor: "bg-[#9333EA]",
      name: "Visionary Vibes 2025",
      sold: "456 / 800 sold",
      revenue: "$18K",
    },
  ];

  const pieData = [
    { name: "Converted", value: 73.5 },
    { name: "Remaining", value: 26.5 },
  ];
  const PIE_COLORS = ["#3B82F6", "#E2E8F0"];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between h-full space-y-6">
      {/* ── TOP: Conversion Rate ── */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#0f172a] text-sm sm:text-base font-semibold">
            Conversion Rate
          </h3>
          <span className="text-[#0f172a] text-lg sm:text-xl font-bold">
            {conversionRate}
          </span>
        </div>

        {/* Real Recharts Pie */}
        <div className="w-full h-28 flex items-center justify-center my-2">
          <ResponsiveContainer width={120} height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={0}
                outerRadius={48}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center">
          <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
            {conversionGrowth}
          </span>
        </div>
      </div>

      {/* ── BOTTOM: Top Events ── */}
      <div className="pt-4 border-t border-[#e2e8f0]">
        <h4 className="text-sm font-semibold text-[#0f172a] mb-3">
          Top Events
        </h4>

        <div className="space-y-3">
          {topEvents.map((evt) => (
            <div
              key={evt.rank}
              className="flex items-center justify-between gap-3 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-6 h-6 rounded-md ${evt.badgeColor} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs`}
                >
                  {evt.rank}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#0f172a] truncate">
                    {evt.name}
                  </p>
                  <p className="text-[11px] text-[#64748b] font-medium truncate">
                    {evt.sold}
                  </p>
                </div>
              </div>

              <span className="text-xs sm:text-sm font-bold text-[#0f172a] flex-shrink-0">
                {evt.revenue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConversionAndTopEvents;
