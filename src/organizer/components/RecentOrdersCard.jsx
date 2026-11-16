import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

const DEFAULT_ORDERS = [
  {
    id: "ord-12345",
    orderNo: "Order #12345",
    buyer: "Sarah Johnson",
    eventName: "Cultural Fusion Fest 2025",
    eventImage: "/images/figma-sample/goa/goa-hero.png",
    tickets: "2x VIP Tickets",
    time: "2 mins ago",
    price: "$150.00",
    status: "Paid",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: "ord-12344",
    orderNo: "Order #12344",
    buyer: "Mike Chen",
    eventName: "Tech Innovation Summit",
    eventImage: "/images/figma-sample/goa/performance.png",
    tickets: "1x General Pass",
    time: "18 mins ago",
    price: "$89.00",
    status: "Pending",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    id: "ord-12343",
    orderNo: "Order #12343",
    buyer: "Emma Wilson",
    eventName: "Visionary Vibes 2025",
    eventImage: "/images/figma-sample/goa/gallery-1.png",
    tickets: "2x Early Bird",
    time: "1 hour ago",
    price: "$120.00",
    status: "Paid",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: "ord-12342",
    orderNo: "Order #12342",
    buyer: "David Brown",
    eventName: "Food Carnival 2025",
    eventImage: "/images/figma-sample/f9-karting.webp",
    tickets: "3x Festival Passes",
    time: "3 hours ago",
    price: "$75.00",
    status: "Refunded",
    statusColor: "text-rose-700 bg-rose-50 border-rose-200",
  },
  {
    id: "ord-12341",
    orderNo: "Order #12341",
    buyer: "Jessica Taylor",
    eventName: "Electronic Beat 2026",
    eventImage: "/images/figma-sample/goa/stage-a.png",
    tickets: "2x General Passes",
    time: "4 hours ago",
    price: "$98.00",
    status: "Paid",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: "ord-12340",
    orderNo: "Order #12340",
    buyer: "Liam O'Connor",
    eventName: "Dublin Bay Music Fest",
    eventImage: "/images/figma-sample/goa/gallery-2.png",
    tickets: "1x VIP Deck Pass",
    time: "5 hours ago",
    price: "$129.00",
    status: "Paid",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
];

export function RecentOrdersCard({ orders: propOrders, onViewAll, maxItems = null }) {
  const navigate = useNavigate();
  const allOrders = propOrders !== undefined ? propOrders : DEFAULT_ORDERS;
  const orders = maxItems ? allOrders.slice(0, maxItems) : allOrders;

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/organizer/tickets");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs flex flex-col justify-between h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#e2e8f0] flex-shrink-0">
        <div>
          <h3 className="text-[#0f172a] text-lg font-semibold">
            Recent Orders
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Latest ticket transactions across all events
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

      {/* Orders List or Graceful Empty State if no data available */}
      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-2xs">
            <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h4 className="text-sm font-bold text-[#0f172a]">
            No recent orders yet
          </h4>
          <p className="text-xs text-[#64748b] max-w-xs mt-1 leading-relaxed">
            When attendees purchase tickets to your published events, new transactions will appear here in real-time.
          </p>
          <button
            type="button"
            onClick={() => navigate("/organizer/events")}
            className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] transition-colors cursor-pointer"
          >
            Manage Events
          </button>
        </div>
      ) : (
        <div className="pt-2 space-y-1 flex-1 overflow-y-auto scrollbar-minimal pr-1">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-all border border-transparent hover:border-[#e2e8f0]/70"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Event Cover Photo */}
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-[#e2e8f0] shadow-2xs flex-shrink-0">
                  <img
                    src={ord.eventImage || "/images/figma-sample/goa/goa-hero.png"}
                    alt={ord.eventName || "Event"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/figma-sample/goa/goa-hero.png";
                    }}
                  />
                </div>

                {/* Person Name & Event Name Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#0f172a] truncate">
                      {ord.buyer || "Anonymous Attendee"}
                    </h4>
                    {ord.orderNo && (
                      <span className="text-[10px] text-[#94a3b8] font-mono hidden sm:inline">
                        {ord.orderNo}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-blue-600 truncate mt-0.5">
                    {ord.eventName || "Event"}
                  </p>
                  <p className="text-[10px] text-[#64748b] font-medium truncate mt-0.5">
                    {ord.tickets || "1x Ticket"} • {ord.time || "Just now"}
                  </p>
                </div>
              </div>

              {/* Price & Status Pill */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-[#0f172a]">
                  {ord.price || "$0.00"}
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${
                    ord.statusColor || "text-emerald-700 bg-emerald-50 border-emerald-200"
                  }`}
                >
                  {ord.status || "Paid"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentOrdersCard;
