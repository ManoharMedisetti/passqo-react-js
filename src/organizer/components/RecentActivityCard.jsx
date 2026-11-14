import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  UserCheck,
} from "lucide-react";

export function RecentActivityCard({ onViewAll }) {
  const navigate = useNavigate();

  const activities = [
    {
      id: "act-1",
      icon: ShoppingBag,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      title: "New ticket purchase",
      description: "Sarah Johnson bought 2 VIP tickets",
      badge: "+€70.00",
      badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      time: "2m ago",
    },
    {
      id: "act-2",
      icon: Calendar,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      title: "Event published",
      description: "Food Carnival 2025 went live",
      badge: "Live",
      badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
      time: "15m ago",
    },
    {
      id: "act-3",
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      title: "Capacity warning",
      description: "Tech Summit is 89% full",
      badge: "89% Full",
      badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
      time: "1h ago",
    },
    {
      id: "act-4",
      icon: CheckCircle2,
      iconBg: "bg-teal-50 text-teal-600 border border-teal-100",
      title: "Payment processed",
      description: "€2,150 payout completed via Stripe",
      badge: "Completed",
      badgeClass: "bg-teal-50 text-teal-700 border border-teal-200",
      time: "2h ago",
    },
    {
      id: "act-5",
      icon: UserCheck,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
      title: "VIP attendee check-in",
      description: "Marcus Vance scanned in at Gate B",
      badge: "Gate B",
      badgeClass: "bg-purple-50 text-purple-700 border border-purple-200",
      time: "2h ago",
    },
    {
      id: "act-6",
      icon: RotateCcw,
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
      title: "Refund requested",
      description: "Order #12342 requested cancellation",
      badge: "Review",
      badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",
      time: "3h ago",
    },
  ];

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/organizer/analytics");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
        <div>
          <h3 className="text-[#0f172a] text-lg font-semibold">
            Recent Activity
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Real-time event & attendee operations
          </p>
        </div>
        <button
          type="button"
          onClick={handleViewAllClick}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Activity List without broken trailing lines */}
      <div className="py-2 flex-1 flex flex-col justify-between gap-1.5">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 border border-transparent hover:border-[#e2e8f0]/70 transition-all duration-150"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div
                  className={`w-8 h-8 rounded-lg ${act.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#0f172a] leading-tight truncate">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-[#64748b] mt-0.5 truncate">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 flex flex-col items-end">
                <span className="text-[10px] font-medium text-[#94a3b8]">
                  {act.time}
                </span>
                <span
                  className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-0.5 border ${act.badgeClass}`}
                >
                  {act.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grounded Live Sync Footer */}
      <div className="pt-3 mt-1 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium text-[#64748b]">
            Live operational feed
          </span>
        </div>
        <span className="text-[10px] font-medium text-[#64748b] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#e2e8f0]">
          Auto-sync
        </span>
      </div>
    </div>
  );
}
