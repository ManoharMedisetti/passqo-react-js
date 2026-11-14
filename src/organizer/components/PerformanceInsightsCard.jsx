import { DollarSign, RotateCw, Target, TrendingUp, TrendingDown } from "lucide-react";

export function PerformanceInsightsCard({
  avgOrderValue = "$65.50",
  avgOrderGrowth = "+5.2% from last month",
  retention = "68%",
  retentionGrowth = "+2.1% from last month",
  successRate = "89%",
  successRateGrowth = "-1.3% from last month",
}) {
  const insights = [
    {
      id: "aov",
      icon: DollarSign,
      iconBg: "bg-[#2563EB]",
      value: avgOrderValue,
      label: "Average Order Value",
      growth: avgOrderGrowth,
      isPositive: true,
    },
    {
      id: "retention",
      icon: RotateCw,
      iconBg: "bg-[#10B981]",
      value: retention,
      label: "Customer Retention",
      growth: retentionGrowth,
      isPositive: true,
    },
    {
      id: "success",
      icon: Target,
      iconBg: "bg-[#9333EA]",
      value: successRate,
      label: "Event Success Rate",
      growth: successRateGrowth,
      isPositive: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
      <div className="border-b border-[#e2e8f0] pb-4">
        <h3 className="text-[#0f172a] text-lg font-semibold">
          Performance Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
        {insights.map((ins) => {
          const Icon = ins.icon;
          return (
            <div
              key={ins.id}
              className="flex flex-col items-center text-center p-5 rounded-lg bg-[#fbfcfd] border border-[#e2e8f0] hover:border-blue-300 transition-all space-y-2.5"
            >
              <div
                className={`w-12 h-12 rounded-full ${ins.iconBg} text-white flex items-center justify-center shadow-2xs`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div>
                <p className="text-2xl font-bold text-[#0f172a] tracking-tight">
                  {ins.value}
                </p>
                <p className="text-xs font-semibold text-[#64748b] mt-0.5">
                  {ins.label}
                </p>
              </div>

              <div className="pt-1">
                {ins.isPositive ? (
                  <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    {ins.growth}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-500 inline-flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    {ins.growth}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PerformanceInsightsCard;

