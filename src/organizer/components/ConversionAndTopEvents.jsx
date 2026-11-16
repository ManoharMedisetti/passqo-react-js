import { TrendingUp, Award } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DEFAULT_TOP_EVENTS = [
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

export function ConversionAndTopEvents({
  conversionRate = "73.5%",
  conversionGrowth = "+2.3% from last month",
  topEvents: propTopEvents,
}) {
  const topEvents = propTopEvents !== undefined ? propTopEvents : DEFAULT_TOP_EVENTS;

  const numericRate = parseFloat(conversionRate) || 0;
  const pieData =
    numericRate > 0
      ? [
          { name: "Converted", value: Math.min(100, numericRate) },
          { name: "Remaining", value: Math.max(0, 100 - numericRate) },
        ]
      : [{ name: "Remaining", value: 100 }];

  const PIE_COLORS = numericRate > 0 ? ["#3B82F6", "#E2E8F0"] : ["#E2E8F0"];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between h-full space-y-6">
      {/* ── TOP: Conversion Rate ── */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#0f172a] text-sm sm:text-base font-semibold">
            Conversion Rate
          </h3>
          <span className="text-[#0f172a] text-lg sm:text-xl font-bold">
            {conversionRate || "0.0%"}
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
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center">
          <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
            {conversionGrowth || "+0.0% from last month"}
          </span>
        </div>
      </div>

      {/* ── BOTTOM: Top Events ── */}
      <div className="pt-4 border-t border-[#e2e8f0]">
        <h4 className="text-sm font-semibold text-[#0f172a] mb-3">
          Top Events
        </h4>

        {topEvents.length === 0 ? (
          <div className="py-6 text-center space-y-1.5">
            <Award className="w-6 h-6 text-[#94a3b8] mx-auto" />
            <p className="text-xs font-medium text-[#64748b]">
              No event rankings available yet
            </p>
            <p className="text-[11px] text-[#94a3b8]">
              Top performing events will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topEvents.map((evt) => (
              <div
                key={evt.rank}
                className="flex items-center justify-between gap-3 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md ${
                      evt.badgeColor || "bg-blue-600"
                    } text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs`}
                  >
                    {evt.rank}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#0f172a] truncate">
                      {evt.name || "Event"}
                    </p>
                    <p className="text-[11px] text-[#64748b] font-medium truncate">
                      {evt.sold || "0 sold"}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#0f172a] flex-shrink-0">
                  {evt.revenue || "$0"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversionAndTopEvents;
