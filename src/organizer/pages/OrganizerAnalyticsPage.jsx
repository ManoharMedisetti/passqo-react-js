import { useState } from "react";
import { getUser } from "@/lib/auth/storage";
import {
  Download,
  Calendar as CalendarIcon,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  RotateCw,
  Sparkles,
  Music,
  Briefcase,
  Palette,
  Utensils,
  Flame,
  Radio,
  FileText,
  Users,
  CalendarCheck,
  Megaphone,
  Globe,
  Sliders,
  DollarSign,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  Eye,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

// ── Circular SVG Ring Component for Top Metric Cards ──
function CircularProgressRing({
  percent = 0,
  color,
  textColor,
  bgTrack = "#f1f5f9",
  size = 46,
}) {
  const safePercent = Math.min(100, Math.max(0, Number(percent) || 0));
  const strokeWidth = 3.5;
  const center = size / 2;
  const radius = center - strokeWidth - 0.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safePercent / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        className="w-full h-full -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-[12px] font-bold leading-none select-none"
          style={{ color: textColor || color }}
        >
          {safePercent}%
        </span>
      </div>
    </div>
  );
}

// ── Sales Performance Dataset matching exact curves in reference image ──
const SALES_PERFORMANCE_DATA = [
  { date: "Oct 1", revenue: 5100, tickets: 4600, events: 5 },
  { date: "Oct 3", revenue: 6180, tickets: 4700, events: 8 },
  { date: "Oct 5", revenue: 5600, tickets: 5500, events: 7 },
  { date: "Oct 7", revenue: 5800, tickets: 5700, events: 9 },
  { date: "Oct 9", revenue: 4600, tickets: 4650, events: 4 },
  { date: "Oct 11", revenue: 6100, tickets: 4750, events: 8 },
  { date: "Oct 13", revenue: 6200, tickets: 4850, events: 10 },
  { date: "Oct 15", revenue: 5700, tickets: 4950, events: 7 },
  { date: "Oct 17", revenue: 6450, tickets: 5050, events: 12 },
  { date: "Oct 19", revenue: 5700, tickets: 4900, events: 8 },
  { date: "Oct 21", revenue: 6400, tickets: 6200, events: 11 },
  { date: "Oct 23", revenue: 5750, tickets: 6450, events: 9 },
  { date: "Oct 25", revenue: 5400, tickets: 5900, events: 7 },
  { date: "Oct 27", revenue: 6250, tickets: 5400, events: 10 },
  { date: "Oct 29", revenue: 4700, tickets: 4400, events: 5 },
  { date: "Oct 31", revenue: 6200, tickets: 5100, events: 9 },
  { date: "Nov 2", revenue: 5700, tickets: 5700, events: 8 },
  { date: "Nov 4", revenue: 6050, tickets: 4800, events: 9 },
  { date: "Nov 6", revenue: 5050, tickets: 4900, events: 6 },
];

function SalesTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const rev = payload.find((p) => p.dataKey === "revenue")?.value || 0;
    const tix = payload.find((p) => p.dataKey === "tickets")?.value || 0;
    const evts = payload.find((p) => p.dataKey === "events")?.value || 0;

    return (
      <div className="bg-[#0f172a] text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-xl border border-white/10 space-y-1.5">
        <p className="text-[#94a3b8] text-[10px] uppercase font-bold tracking-wider">
          {label}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Revenue
            </span>
            <span className="font-bold text-white">${rev.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Tickets
            </span>
            <span className="font-bold text-white">{tix.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Events
            </span>
            <span className="font-bold text-white">{evts.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ── Traffic Sources Pie Data ──
const TRAFFIC_DATA = [
  { name: "Direct", value: 42.5, visits: "10,441 visits", color: "#2563eb" },
  { name: "Social Media", value: 28.7, visits: "7,051 visits", color: "#10b981" },
  { name: "Search Engines", value: 18.3, visits: "4,496 visits", color: "#8b5cf6" },
  { name: "Referral", value: 10.5, visits: "2,579 visits", color: "#f97316" },
];

export function OrganizerAnalyticsPage() {
  const [user] = useState(
    () => getUser() || { name: "manoharprasadmedisetti", email: "manohar@passqo.com" }
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Last 30 days");
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [funnelRange, setFunnelRange] = useState("Last 30 days");
  const [isFunnelRangeOpen, setIsFunnelRangeOpen] = useState(false);
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState("Saturday");
  const [isHeatmapDropdownOpen, setIsHeatmapDropdownOpen] = useState(false);
  const [selectedHeatmapHour, setSelectedHeatmapHour] = useState(12);
  const [exportedNotice, setExportedNotice] = useState(false);

  // Top Metrics matching exact user reference image
  const topMetrics = [
    {
      id: "revenue",
      title: "Total Revenue",
      icon: DollarSign,
      iconColor: "text-emerald-500",
      value: "$234,567",
      trend: "+23.5%",
      trendType: "up",
      trendColor: "text-emerald-600",
      percent: 75,
      ringColor: "#10b981",
      textColor: "#10b981",
    },
    {
      id: "conversion",
      title: "Conversion Rate",
      icon: Target,
      iconColor: "text-blue-500",
      value: "3.2%",
      trend: "+0.8%",
      trendType: "up",
      trendColor: "text-blue-600",
      percent: 32,
      ringColor: "#2563eb",
      textColor: "#2563eb",
    },
    {
      id: "aov",
      title: "Avg Order Value",
      icon: CreditCard,
      iconColor: "text-purple-500",
      value: "$89.50",
      trend: "+12.3%",
      trendType: "up",
      trendColor: "text-purple-600",
      percent: 58,
      ringColor: "#8b5cf6",
      textColor: "#8b5cf6",
    },
    {
      id: "retention",
      title: "Retention Rate",
      icon: RotateCw,
      iconColor: "text-amber-500",
      value: "68.4%",
      trend: "-2.1%",
      trendType: "down",
      trendColor: "text-rose-600",
      percent: 68,
      ringColor: "#f59e0b",
      textColor: "#f59e0b",
    },
  ];

  // Conversion Funnel Stages
  const funnelStages = [
    {
      id: "pageviews",
      name: "Page Views",
      subtitle: "Users who viewed event pages",
      count: "24,567",
      percentage: "100%",
      bgClass: "bg-[#2563eb]",
    },
    {
      id: "cart",
      name: "Add to Cart",
      subtitle: "Users who added tickets to cart",
      count: "8,234",
      percentage: "33.5%",
      bgClass: "bg-[#10b981]",
    },
    {
      id: "checkout",
      name: "Checkout Started",
      subtitle: "Users who began checkout process",
      count: "4,892",
      percentage: "19.9%",
      bgClass: "bg-[#8b5cf6]",
    },
    {
      id: "payment",
      name: "Payment Info",
      subtitle: "Users who entered payment details",
      count: "3,156",
      percentage: "12.8%",
      bgClass: "bg-[#eab308]",
    },
    {
      id: "purchase",
      name: "Purchase Complete",
      subtitle: "Users who completed purchase",
      count: "2,847",
      percentage: "11.6%",
      bgClass: "bg-[#ef4444]",
    },
  ];

  // Top Events List
  const topEvents = [
    {
      id: "te-1",
      title: "Summer Music Festival",
      date: "July 15, 2024 • 1,234 sold",
      tickets: "1,234",
      percent: 92,
      icon: Music,
      iconBg: "bg-blue-600 text-white",
      barColor: "bg-blue-600",
    },
    {
      id: "te-2",
      title: "Neon Horizon Festival",
      date: "July 28, 2024 • 1,120 sold",
      tickets: "1,120",
      percent: 85,
      icon: Music,
      iconBg: "bg-blue-600 text-white",
      barColor: "bg-blue-600",
    },
    {
      id: "te-3",
      title: "Tech Conference 2024",
      date: "Aug 20, 2024 • 890 sold",
      tickets: "890",
      percent: 74,
      icon: Briefcase,
      iconBg: "bg-emerald-500 text-white",
      barColor: "bg-emerald-500",
    },
    {
      id: "te-4",
      title: "Art Gallery Opening",
      date: "Sept 5, 2024 • 450 sold",
      tickets: "450",
      percent: 58,
      icon: Palette,
      iconBg: "bg-purple-600 text-white",
      barColor: "bg-purple-600",
    },
    {
      id: "te-5",
      title: "Food Carnival 2024",
      date: "Sept 18, 2024 • 670 sold",
      tickets: "670",
      percent: 68,
      icon: Utensils,
      iconBg: "bg-amber-500 text-white",
      barColor: "bg-amber-500",
    },
    {
      id: "te-6",
      title: "Electronic Dance Night",
      date: "Oct 2, 2024 • 1,050 sold",
      tickets: "1,050",
      percent: 79,
      icon: Radio,
      iconBg: "bg-blue-600 text-white",
      barColor: "bg-blue-600",
    },
    {
      id: "te-7",
      title: "Sunset Acoustic Session",
      date: "Oct 14, 2024 • 980 sold",
      tickets: "980",
      percent: 71,
      icon: Flame,
      iconBg: "bg-orange-500 text-white",
      barColor: "bg-orange-500",
    },
  ];

  // 24 Hour Heatmap Data
  const heatmapHours = [
    { hour: 0, level: 42, color: "bg-rose-100 text-rose-800" },
    { hour: 2, level: 18, color: "bg-rose-50 text-rose-800" },
    { hour: 4, level: 12, color: "bg-rose-50 text-rose-800" },
    { hour: 6, level: 65, color: "bg-rose-100 text-rose-800" },
    { hour: 8, level: 140, color: "bg-rose-200 text-rose-900" },
    { hour: 10, level: 245, color: "bg-rose-300 text-rose-900" },
    { hour: 12, level: 345, color: "bg-rose-500 text-white font-bold" },
    { hour: 14, level: 290, color: "bg-rose-400 text-white" },
    { hour: 16, level: 310, color: "bg-rose-500 text-white" },
    { hour: 18, level: 380, color: "bg-rose-600 text-white font-bold" },
    { hour: 20, level: 360, color: "bg-rose-500 text-white" },
    { hour: 22, level: 190, color: "bg-rose-200 text-rose-900" },
  ];

  // Detailed Reports Grid
  const detailedReports = [
    {
      id: "rep-revenue",
      title: "Revenue Report",
      subtitle: "Financial performance",
      icon: DollarSign,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      btnClass:
        "border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100",
      stats: [
        { label: "Total Revenue", value: "$234,567" },
        { label: "Net Profit", value: "$189,234" },
        { label: "Total Fees", value: "$12,345" },
      ],
    },
    {
      id: "rep-customer",
      title: "Customer Report",
      subtitle: "Audience insights",
      icon: Users,
      iconColor: "text-blue-600 bg-blue-50 border-blue-100",
      btnClass:
        "border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100",
      stats: [
        { label: "Total Customers", value: "8,234" },
        { label: "New Customers", value: "1,456" },
        { label: "Repeat Rate", value: "58.4%" },
      ],
    },
    {
      id: "rep-event",
      title: "Event Performance",
      subtitle: "Event-level analytics",
      icon: CalendarCheck,
      iconColor: "text-purple-600 bg-purple-50 border-purple-100",
      btnClass:
        "border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100",
      stats: [
        { label: "Total Events", value: "24" },
        { label: "Avg Attendance", value: "78.5%" },
        { label: "Top Category", value: "Music" },
      ],
    },
    {
      id: "rep-marketing",
      title: "Marketing Report",
      subtitle: "Campaign effectiveness",
      icon: Megaphone,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
      btnClass:
        "border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100",
      stats: [
        { label: "Campaigns", value: "12" },
        { label: "Conversion", value: "4.2%" },
        { label: "ROI", value: "325%" },
      ],
    },
    {
      id: "rep-traffic",
      title: "Traffic Analysis",
      subtitle: "Visitor acquisition",
      icon: Globe,
      iconColor: "text-rose-600 bg-rose-50 border-rose-100",
      btnClass:
        "border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100",
      stats: [
        { label: "Total Visits", value: "24,567" },
        { label: "Unique Visitors", value: "18,234" },
        { label: "Bounce Rate", value: "34.2%" },
      ],
    },
    {
      id: "rep-custom",
      title: "Custom Report",
      subtitle: "Build your own report",
      icon: Sliders,
      iconColor: "text-slate-600 bg-slate-50 border-slate-200",
      btnClass:
        "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100",
      isCustom: true,
      description: "Tailor metrics and filters to your needs",
    },
  ];

  const handleExport = () => {
    setExportedNotice(true);
    setTimeout(() => setExportedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="analytics"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Analytics"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-14 space-y-6 max-w-7xl mx-auto">
        {/* ── SECTION 1: Page Header with Export & Date Range ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
              Analytics & Reports
            </h1>
            <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
              Track performance, analyze trends, and optimize your events
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Export Button */}
            <button
              type="button"
              onClick={handleExport}
              className="h-9 px-3.5 rounded-lg border border-[#e2e8f0] bg-white text-xs font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              {exportedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Exported</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#64748b]" />
                  <span>Export</span>
                </>
              )}
            </button>

            {/* Date Range Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRangeOpen(!isRangeOpen)}
                className="h-9 px-3.5 rounded-lg border border-[#e2e8f0] bg-white text-xs font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors inline-flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-[#64748b]" />
                <span>{selectedRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
              </button>

              {isRangeOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-[#e2e8f0] rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                  {["Last 7 days", "Last 30 days", "Last 90 days", "This Year"].map(
                    (range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => {
                          setSelectedRange(range);
                          setIsRangeOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                          selectedRange === range
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-[#0f172a] hover:bg-slate-50"
                        }`}
                      >
                        {range}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Top 4 Metric Cards with Circular Rings matching exact reference image ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {topMetrics.map((metric) => {
            const Icon = metric.icon;
            const TrendIcon =
              metric.trendType === "up" ? TrendingUp : TrendingDown;
            return (
              <div
                key={metric.id}
                className="bg-white rounded-2xl border border-[#eef2f6] p-5 sm:p-6 shadow-xs flex flex-col justify-between"
              >
                {/* Top Header: Icon + Title */}
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${metric.iconColor} stroke-[2.2]`} />
                  <span className="text-sm font-medium text-[#64748b]">
                    {metric.title}
                  </span>
                </div>

                {/* Value & Trend on Left, Circular Progress Ring on Right */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl sm:text-[26px] font-bold text-[#0f172a] tracking-tight leading-tight">
                      {metric.value}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <TrendIcon
                        className={`w-3.5 h-3.5 ${
                          metric.trendType === "up"
                            ? metric.iconColor
                            : "text-rose-500"
                        } stroke-[2.5]`}
                      />
                      <span
                        className={`text-xs font-semibold ${metric.trendColor}`}
                      >
                        {metric.trend}
                      </span>
                    </div>
                  </div>

                  <CircularProgressRing
                    percent={metric.percent}
                    color={metric.ringColor}
                    textColor={metric.textColor}
                    size={46}
                  />
                </div>
              </div>
            );
          })}
        </section>

        {/* ── SECTION 3: Sales Performance Area & Line Chart ── */}
        <section className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6">
            <div>
              <h2 className="text-[#0f172a] text-lg font-semibold tracking-tight">
                Sales Performance
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Revenue and ticket sales over time
              </p>
            </div>

            {/* Legend Pills matching exact reference image */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 text-[#0f172a]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                Revenue
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#0f172a]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                Tickets
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#0f172a]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                Events
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={SALES_PERFORMANCE_DATA}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f8fafc"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  dy={6}
                />
                <YAxis
                  domain={[4500, 6800]}
                  ticks={[5000, 5500, 6000, 6500]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                />
                <Tooltip content={<SalesTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2.4}
                  fill="url(#revenueGradient)"
                  dot={{ r: 2.5, fill: "#2563eb", strokeWidth: 1.5, stroke: "#fff" }}
                  activeDot={{ r: 5, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  stroke="#10b981"
                  strokeWidth={2.4}
                  fill="url(#ticketsGradient)"
                  dot={{ r: 2.5, fill: "#10b981", strokeWidth: 1.5, stroke: "#fff" }}
                  activeDot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── SECTION 4: Conversion Funnel (2/3) + Top Events (1/3) ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left: Conversion Funnel Card */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#f1f5f9]">
                <div>
                  <h2 className="text-[#0f172a] text-lg font-semibold tracking-tight">
                    Conversion Funnel
                  </h2>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Customer journey from visit to purchase
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFunnelRangeOpen(!isFunnelRangeOpen)}
                    className="h-8 px-3 rounded-lg border border-[#e2e8f0] bg-white text-xs font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{funnelRange}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                  </button>

                  {isFunnelRangeOpen && (
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-[#e2e8f0] rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                      {["Last 7 days", "Last 30 days", "Last 90 days"].map(
                        (item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setFunnelRange(item);
                              setIsFunnelRangeOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs font-medium cursor-pointer ${
                              funnelRange === item
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-[#0f172a] hover:bg-slate-50"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 5 Funnel Stages */}
              <div className="space-y-3 pt-5">
                {funnelStages.map((stage) => (
                  <div
                    key={stage.id}
                    className={`${stage.bgClass} text-white rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs transition-transform hover:scale-[1.005] duration-150`}
                  >
                    <div>
                      <h3 className="text-sm font-bold tracking-tight">
                        {stage.name}
                      </h3>
                      <p className="text-xs text-white/80 mt-0.5">
                        {stage.subtitle}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 pl-3">
                      <span className="text-base sm:text-lg font-extrabold tracking-tight block">
                        {stage.count}
                      </span>
                      <span className="text-xs text-white/90 font-medium">
                        {stage.percentage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insights Box */}
            <div className="mt-6 pt-4 border-t border-[#f1f5f9]">
              <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2.5">
                Key Insights
              </h4>
              <ul className="space-y-2 text-xs text-[#64748b]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    Highest drop-off between{" "}
                    <strong className="text-[#0f172a]">Add to Cart</strong> and{" "}
                    <strong className="text-[#0f172a]">Checkout Started</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>
                    Payment completion rate improved by{" "}
                    <strong className="text-[#0f172a]">2.3%</strong> this month
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span>
                    Overall conversion rate:{" "}
                    <strong className="text-[#0f172a]">11.6%</strong> (Industry
                    avg: 8.2%)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Top Events Card */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-[#f1f5f9]">
                <h2 className="text-[#0f172a] text-lg font-semibold tracking-tight">
                  Top Events
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Best performing events by tickets
                </p>
              </div>

              {/* Events List */}
              <div className="divide-y divide-[#f1f5f9] pt-1">
                {topEvents.map((evt) => {
                  const Icon = evt.icon;
                  return (
                    <div
                      key={evt.id}
                      className="py-3 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl ${evt.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0f172a] truncate group-hover:text-blue-600 transition-colors">
                            {evt.title}
                          </p>
                          <p className="text-[11px] text-[#64748b] mt-0.5 truncate">
                            {evt.date}
                          </p>
                          <div className="w-24 bg-[#f1f5f9] h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div
                              className={`h-full ${evt.barColor} rounded-full`}
                              style={{ width: `${evt.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-bold text-[#0f172a] block">
                          {evt.tickets}
                        </span>
                        <span className="text-[10px] text-[#94a3b8] font-medium">
                          tickets
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: Traffic Sources (1/2) + Activity Heatmap (1/2) ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Traffic Sources */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
                <div>
                  <h2 className="text-[#0f172a] text-lg font-semibold tracking-tight">
                    Traffic Sources
                  </h2>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Breakdown of user acquisition channels
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#64748b] bg-slate-50 px-2.5 py-1 rounded-lg border border-[#e2e8f0]">
                  Last 30 days
                </span>
              </div>

              {/* Donut Chart */}
              <div className="h-56 w-full flex items-center justify-center pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TRAFFIC_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {TRAFFIC_DATA.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name, item) => [
                        `${val}% (${item.payload.visits})`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Donut Legend */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#f1f5f9]">
                {TRAFFIC_DATA.map((item) => (
                  <div key={item.name} className="flex items-start gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#0f172a]">
                        {item.name}{" "}
                        <span className="text-[#64748b] font-normal">
                          ({item.value}%)
                        </span>
                      </p>
                      <p className="text-[11px] text-[#94a3b8]">{item.visits}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
                <div>
                  <h2 className="text-[#0f172a] text-lg font-semibold tracking-tight">
                    Activity Heatmap
                  </h2>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    User engagement by hour
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsHeatmapDropdownOpen(!isHeatmapDropdownOpen)
                    }
                    className="h-8 px-3 rounded-lg border border-[#e2e8f0] bg-white text-xs font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{selectedHeatmapDay}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                  </button>

                  {isHeatmapDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-[#e2e8f0] rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setSelectedHeatmapDay(day);
                            setIsHeatmapDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium cursor-pointer ${
                            selectedHeatmapDay === day
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "text-[#0f172a] hover:bg-slate-50"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Active level readout */}
              <div className="py-4 text-center">
                <span className="text-xs font-semibold text-[#0f172a] bg-[#f8fafc] px-3 py-1.5 rounded-full border border-[#e2e8f0] inline-block shadow-2xs">
                  {selectedHeatmapHour}:00 - Activity Level:{" "}
                  <strong className="text-rose-600">
                    {heatmapHours.find((h) => h.hour === selectedHeatmapHour)
                      ?.level || 345}
                  </strong>
                </span>
              </div>

              {/* 24h Heatmap Timeline Blocks */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-2">
                {heatmapHours.map((slot) => {
                  const isSelected = slot.hour === selectedHeatmapHour;
                  return (
                    <button
                      key={slot.hour}
                      type="button"
                      onClick={() => setSelectedHeatmapHour(slot.hour)}
                      className={`h-11 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                        slot.color
                      } ${
                        isSelected
                          ? "ring-2 ring-[#0f172a] scale-105 shadow-md"
                          : "hover:opacity-90"
                      }`}
                    >
                      <span className="text-xs font-bold leading-none">
                        {slot.hour}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mini day tabs */}
              <div className="flex items-center justify-center gap-1.5 pt-5 pb-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setSelectedHeatmapDay(
                        d === "Sat"
                          ? "Saturday"
                          : d === "Sun"
                          ? "Sunday"
                          : `${d}day`
                      )
                    }
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                      selectedHeatmapDay.startsWith(d)
                        ? "bg-[#0f172a] text-white"
                        : "text-[#64748b] hover:bg-slate-100"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Legend */}
            <div className="flex items-center justify-between text-xs text-[#64748b] pt-4 border-t border-[#f1f5f9]">
              <span className="text-[11px] font-medium">Less Activity</span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded bg-rose-50 border border-rose-100" />
                <span className="w-3.5 h-3.5 rounded bg-rose-100" />
                <span className="w-3.5 h-3.5 rounded bg-rose-200" />
                <span className="w-3.5 h-3.5 rounded bg-rose-300" />
                <span className="w-3.5 h-3.5 rounded bg-rose-400" />
                <span className="w-3.5 h-3.5 rounded bg-rose-500" />
                <span className="w-3.5 h-3.5 rounded bg-rose-600" />
              </div>
              <span className="text-[11px] font-medium">More Activity</span>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: Detailed Reports (3x2 Grid) ── */}
        <section className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-5">
          <div className="border-b border-[#f1f5f9] pb-4">
            <h2 className="text-[#0f172a] text-lg font-semibold tracking-tight">
              Detailed Reports
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Generate and export in-depth reports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {detailedReports.map((rep) => {
              const Icon = rep.icon;
              return (
                <div
                  key={rep.id}
                  className="rounded-xl border border-[#e2e8f0] p-5 bg-[#fbfcfd] hover:bg-white hover:border-slate-300 transition-all duration-150 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl border ${rep.iconColor} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0f172a]">
                          {rep.title}
                        </h3>
                        <p className="text-xs text-[#64748b] mt-0.5">
                          {rep.subtitle}
                        </p>
                      </div>
                    </div>

                    {rep.isCustom ? (
                      <div className="py-6 text-center">
                        <p className="text-xs text-[#64748b]">
                          {rep.description}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4 text-xs">
                        {rep.stats.map((s) => (
                          <div
                            key={s.label}
                            className="flex items-center justify-between"
                          >
                            <span className="text-[#64748b]">{s.label}</span>
                            <span className="font-bold text-[#0f172a]">
                              {s.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleExport}
                    className={`w-full py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer mt-2 ${rep.btnClass}`}
                  >
                    {rep.isCustom ? "Build Report" : "Generate Report"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 7: Quick Insights (1/2) + AI Recommendations (1/2) ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Quick Insights */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-[#f1f5f9]">
                <h2 className="text-[#0f172a] text-lg font-semibold tracking-tight">
                  Quick Insights
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Automated intelligence summaries
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {/* Insight 1: Revenue Growth */}
                <div className="border-l-4 border-l-emerald-500 bg-emerald-50/40 rounded-r-xl p-3.5 border border-y-[#e2e8f0]/60 border-r-[#e2e8f0]/60">
                  <h3 className="text-xs font-bold text-emerald-950">
                    Revenue Growth
                  </h3>
                  <p className="text-xs text-emerald-900/80 mt-1 leading-relaxed">
                    Weekend revenue increased by{" "}
                    <strong>23% compared to last month</strong>, driven by
                    higher general admission sales.
                  </p>
                </div>

                {/* Insight 2: New Customer Acquisition */}
                <div className="border-l-4 border-l-blue-500 bg-blue-50/40 rounded-r-xl p-3.5 border border-y-[#e2e8f0]/60 border-r-[#e2e8f0]/60">
                  <h3 className="text-xs font-bold text-blue-950">
                    New Customers Acquisition
                  </h3>
                  <p className="text-xs text-blue-900/80 mt-1 leading-relaxed">
                    <strong>1,456 new customers</strong> joined this month, with
                    45% coming from social media campaigns.
                  </p>
                </div>

                {/* Insight 3: Peak Activity Hours */}
                <div className="border-l-4 border-l-amber-500 bg-amber-50/40 rounded-r-xl p-3.5 border border-y-[#e2e8f0]/60 border-r-[#e2e8f0]/60">
                  <h3 className="text-xs font-bold text-amber-950">
                    Peak Activity Hours
                  </h3>
                  <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                    Most ticket purchases occur between{" "}
                    <strong>6:00 PM and 9:00 PM</strong> on Thursdays and
                    Fridays.
                  </p>
                </div>

                {/* Insight 4: Conversion Optimization */}
                <div className="border-l-4 border-l-purple-500 bg-purple-50/40 rounded-r-xl p-3.5 border border-y-[#e2e8f0]/60 border-r-[#e2e8f0]/60">
                  <h3 className="text-xs font-bold text-purple-950">
                    Conversion Optimization
                  </h3>
                  <p className="text-xs text-purple-900/80 mt-1 leading-relaxed">
                    Checkout abandonment dropped by{" "}
                    <strong>4.2%</strong> after implementing Apple Pay/Google
                    Pay.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-[#f1f5f9]">
                <h2 className="text-[#0f172a] text-lg font-semibold tracking-tight">
                  AI Recommendations
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Strategic growth suggestions for your events
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {/* Recommendation 1 */}
                <div className="rounded-xl border border-[#e2e8f0] p-3.5 bg-[#fbfcfd] hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold text-[#0f172a]">
                        Optimize Marketing Spend
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      High
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                    Reallocate budget to social media campaigns which have 35%
                    higher ROI than search ads.
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-600 mt-2">
                    Est. revenue: +$14.2k revenue
                  </p>
                </div>

                {/* Recommendation 2 */}
                <div className="rounded-xl border border-[#e2e8f0] p-3.5 bg-[#fbfcfd] hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-bold text-[#0f172a]">
                        Schedule Events Better
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Medium
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                    Schedule your next event announcements on Wednesday
                    mornings at 10 AM for optimal engagement.
                  </p>
                  <p className="text-[11px] font-semibold text-blue-600 mt-2">
                    Est. ticket sales: +18% ticket sales
                  </p>
                </div>

                {/* Recommendation 3 */}
                <div className="rounded-xl border border-[#e2e8f0] p-3.5 bg-[#fbfcfd] hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <h3 className="text-xs font-bold text-[#0f172a]">
                        Dynamic Pricing
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      Low
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                    Implement early bird and tier pricing for upcoming events to
                    drive faster initial bookings.
                  </p>
                  <p className="text-[11px] font-semibold text-purple-600 mt-2">
                    Est. revenue: +8% early sales
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full py-2.5 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 border border-dashed border-[#cbd5e1] hover:border-slate-400 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              + Generate More Recommendations
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrganizerAnalyticsPage;
