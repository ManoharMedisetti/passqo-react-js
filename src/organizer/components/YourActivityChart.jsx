import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", value: 15 },
  { day: "Tue", value: 20 },
  { day: "Wed", value: 12 },
  { day: "Thu", value: 16 },
  { day: "Fri", value: 21 },
  { day: "Sat", value: 18 },
  { day: "Sun", value: 25 },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md">
        <span>{label}: </span>
        <span className="text-blue-400 font-bold">{payload[0].value} tickets</span>
      </div>
    );
  }
  return null;
}

export function YourActivityChart() {
  const totalThisWeek = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header: Clean & Concise */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-[#0f172a] text-lg font-semibold">
            Tickets Sold
          </h3>
          <p className="text-xs text-[#64748b]">This week</p>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
          {totalThisWeek} total
        </span>
      </div>

      {/* Chart: Expands to match GreetingBanner height */}
      <div className="w-full flex-1 min-h-[170px] pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="venueActivityGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 10.5, fontWeight: 500 }}
              dy={5}
            />
            <YAxis
              domain={[0, 25]}
              ticks={[0, 5, 10, 15, 20, 25]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 500 }}
              dx={-2}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#venueActivityGlow)"
              dot={{ r: 3.5, fill: "#2563eb", stroke: "#FFFFFF", strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: "#2563eb", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default YourActivityChart;
