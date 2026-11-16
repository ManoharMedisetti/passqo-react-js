import { useState } from "react";
import { ChevronDown, RotateCw } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DATASETS = {
  "Last 30 Days": [
    { date: "Dec 18", revenue: 2400, tickets: 36 },
    { date: "Dec 19", revenue: 2750, tickets: 42 },
    { date: "Dec 20", revenue: 3100, tickets: 48 },
    { date: "Dec 21", revenue: 2800, tickets: 44 },
    { date: "Dec 22", revenue: 3200, tickets: 52 },
    { date: "Dec 23", revenue: 3450, tickets: 56 },
    { date: "Dec 24", revenue: 3600, tickets: 59 },
  ],
  "Last 7 Days": [
    { date: "Mon", revenue: 2500, tickets: 38 },
    { date: "Tue", revenue: 2900, tickets: 45 },
    { date: "Wed", revenue: 3050, tickets: 47 },
    { date: "Thu", revenue: 3300, tickets: 53 },
    { date: "Fri", revenue: 3500, tickets: 58 },
    { date: "Sat", revenue: 3550, tickets: 57 },
    { date: "Sun", revenue: 3600, tickets: 60 },
  ],
  "Last 90 Days": [
    { date: "Oct", revenue: 2300, tickets: 35 },
    { date: "Nov", revenue: 2900, tickets: 46 },
    { date: "Dec", revenue: 3400, tickets: 55 },
    { date: "Jan", revenue: 3600, tickets: 59 },
  ],
};

function AnalyticsTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const rev = payload.find((p) => p.dataKey === "revenue")?.value || 0;
    const tix = payload.find((p) => p.dataKey === "tickets")?.value || 0;

    return (
      <div className="bg-[#0f172a] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xl border border-white/10 space-y-1">
        <p className="text-[#94a3b8] text-[10px] uppercase font-bold tracking-wider">{label}</p>
        <div className="flex items-center gap-3">
          <span className="text-blue-400 font-bold">${rev.toLocaleString()}</span>
          <span className="text-emerald-400 font-bold">{tix} tickets</span>
        </div>
      </div>
    );
  }
  return null;
}

export function SalesAnalyticsCard({ data: propData }) {
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const chartData =
    propData && propData.length > 0
      ? propData
      : DATASETS[timeRange] || DATASETS["Last 30 Days"];

  const maxRev = Math.max(...chartData.map((d) => d.revenue || 0), 1000);
  const maxTix = Math.max(...chartData.map((d) => d.tickets || 0), 20);
  const totalRevenue = chartData.reduce((sum, d) => sum + (d.revenue || 0), 0);

  const handleRefresh = () => {
    setTimeRange((prev) => (prev === "Last 30 Days" ? "Last 7 Days" : "Last 30 Days"));
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div>
          <h3 className="text-[#0f172a] text-lg font-semibold">
            Sales Analytics
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Revenue and ticket sales over time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs font-medium mr-2">
            <span className="inline-flex items-center gap-1.5 text-[#0f172a]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
              Revenue
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#0f172a]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              Tickets Sold
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-8 px-3 rounded-lg bg-white border border-[#e2e8f0] text-xs font-medium text-[#0f172a] flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>{timeRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-10 w-36 bg-white rounded-xl border border-[#e2e8f0] shadow-xl p-1.5 z-20 space-y-0.5 animate-in fade-in zoom-in-95">
                {Object.keys(DATASETS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setTimeRange(key);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      timeRange === key
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-[#475569] hover:bg-gray-50"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="w-8 h-8 rounded-lg bg-white border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 transition-colors cursor-pointer active:rotate-180"
            title="Refresh Analytics"
          >
            <RotateCw className="w-3.5 h-3.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Real Recharts Canvas - Expands to fill full card height */}
      <div className="w-full flex-1 min-h-[260px] sm:min-h-[290px] pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="realRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 500 }}
              dy={6}
            />
            {/* Left Y Axis (Revenue) */}
            <YAxis
              yAxisId="left"
              domain={[0, Math.ceil(maxRev * 1.1)]}
              tickFormatter={(val) =>
                val >= 1000 ? `$${(val / 1000).toFixed(1)}K` : `$${val}`
              }
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 9.5, fontWeight: 500 }}
              dx={-4}
            />
            {/* Right Y Axis (Tickets) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, Math.ceil(maxTix * 1.2)]}
              tickFormatter={(val) => `${val}`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 9.5, fontWeight: 500 }}
              dx={4}
            />
            <Tooltip content={<AnalyticsTooltip />} />
            {/* Revenue Area */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#realRevenueGradient)"
              dot={{ r: 3.5, fill: "#2563eb", stroke: "#FFFFFF", strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: "#2563eb", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
            {/* Tickets Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tickets"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "#22c55e", stroke: "#FFFFFF", strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: "#22c55e", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesAnalyticsCard;
