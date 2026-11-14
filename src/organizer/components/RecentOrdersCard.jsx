import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function RecentOrdersCard({ onViewAll }) {
  const navigate = useNavigate();

  const orders = [
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
  ];

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/organizer/tickets");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
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

      {/* Orders List with Person Name, Event Name, and Event Cover Photo */}
      <div className="space-y-3.5 pt-4 flex-1">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="flex items-center justify-between gap-3.5 p-2.5 hover:bg-slate-50/80 rounded-xl transition-all border border-transparent hover:border-[#e2e8f0]/80"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Event Cover Photo (Ticket symbol removed per user request) */}
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-[#e2e8f0] shadow-2xs flex-shrink-0">
                <img
                  src={ord.eventImage}
                  alt={ord.eventName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/figma-sample/goa/goa-hero.png";
                  }}
                />
              </div>

              {/* Person Name & Event Name Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] truncate">
                    {ord.buyer}
                  </h4>
                  <span className="text-[10px] text-[#94a3b8] font-mono hidden sm:inline">
                    {ord.orderNo}
                  </span>
                </div>
                <p className="text-xs font-semibold text-blue-600 truncate mt-0.5">
                  {ord.eventName}
                </p>
                <p className="text-[11px] text-[#64748b] font-medium truncate mt-0.5">
                  {ord.tickets} • {ord.time}
                </p>
              </div>
            </div>

            {/* Price & Status Pill */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs sm:text-sm font-bold text-[#0f172a]">
                {ord.price}
              </p>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${ord.statusColor}`}
              >
                {ord.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentOrdersCard;
