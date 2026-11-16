import { ArrowUpRight, Ticket } from "lucide-react";

export function GreetingBanner({
  user,
  activeEventsCount = 5,
  upcomingEventsCount = 12,
  todaySales = "$2,340",
  todaySalesGrowth = "+28%",
  ticketsToday = "48",
  ticketsGrowth = "+16%",
}) {
  const displayName = user?.name || "manoharprasadmedisetti";
  const avatarSrc = user?.avatar || "/images/avatar-manohar.png";
  const activeCount = activeEventsCount ?? 0;
  const upcomingCount = upcomingEventsCount ?? 0;
  const salesDisplay = todaySales || "$0.00";
  const salesGrowthDisplay = todaySalesGrowth || "+0%";
  const ticketsDisplay = ticketsToday ?? 0;
  const ticketsGrowthDisplay = ticketsGrowth || "+0%";

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#F0F8FE] to-[#DDF1FD] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 h-full">
      {/* Decorative soft sky-blue ambient glow on the right behind flamingo */}
      <div className="absolute right-0 bottom-0 top-0 w-[55%] bg-gradient-to-l from-[#CDE8FC]/80 via-[#E1F3FE]/40 to-transparent pointer-events-none" />
      <div className="absolute -right-10 -bottom-16 w-80 h-80 rounded-full bg-[#BCE0FB]/40 blur-2xl pointer-events-none" />

      {/* ── LEFT SECTION: User Info + 2 Horizontal Stat Cards Side-by-Side ── */}
      <div className="space-y-5 sm:space-y-6 relative z-10 max-w-xl">
        {/* User Avatar + Greeting */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-4 ring-white shadow-sm flex-shrink-0 bg-slate-900">
            <img
              src={avatarSrc}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80";
              }}
            />
          </div>
          <div>
            <span className="text-sm sm:text-[15px] font-medium text-[#475569] leading-tight block">
              Good morning,
            </span>
            <h2 className="text-xl sm:text-[22px] font-bold text-[#0F172A] tracking-tight leading-snug flex items-center gap-1.5 flex-wrap">
              <span>{displayName}!</span>
              <span className="inline-block select-none text-xl">👋</span>
            </h2>
            <p className="text-xs sm:text-[13px] text-[#64748B] mt-0.5 font-normal whitespace-nowrap">
              You have <span className="font-bold text-[#FF3B70]">{activeCount}</span> active events and{" "}
              <span className="font-bold text-[#FF3B70]">{upcomingCount}</span> upcoming this month.
            </p>
          </div>
        </div>

        {/* ── TWO STAT CARDS SIDE BY SIDE (Matching Reference Image Exactly) ── */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 sm:gap-4 pt-1 sm:pt-2">
          {/* Card 1: Today's Sales */}
          <div className="bg-white rounded-2xl border border-[#FFF0F3] shadow-[0_4px_20px_rgba(255,100,130,0.12)] p-3.5 sm:p-4 flex items-center gap-3.5 min-w-[210px] sm:min-w-[230px]">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFF0F4] border border-[#FFE4E9] flex items-center justify-center text-[#FF3B70] flex-shrink-0">
              {/* Stack of Coins Icon */}
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF3B70]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <ellipse cx="8" cy="6" rx="5" ry="2.2" />
                <path d="M3 6v3.5c0 1.22 2.24 2.2 5 2.2s5-.98 5-2.2V6" />
                <path d="M3 9.5v3.5c0 1.22 2.24 2.2 5 2.2s5-.98 5-2.2v-3.5" />
                <ellipse cx="16" cy="11" rx="5" ry="2.2" />
                <path d="M11 11v3.5c0 1.22 2.24 2.2 5 2.2s5-.98 5-2.2v-3.5" />
                <path d="M11 14.5v3.5c0 1.22 2.24 2.2 5 2.2s5-.98 5-2.2v-3.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                  {salesDisplay}
                </span>
                <span className="text-[11px] font-bold text-[#16A34A] bg-[#E8FAF0] border border-[#D1F7E2] px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  {salesGrowthDisplay}
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-medium mt-0.5 whitespace-nowrap">
                Today's Sales
              </p>
            </div>
          </div>

          {/* Card 2: Tickets Sold Today */}
          <div className="bg-white rounded-2xl border border-[#F5F2FF] shadow-[0_4px_20px_rgba(147,51,234,0.08)] p-3.5 sm:p-4 flex items-center gap-3.5 min-w-[210px] sm:min-w-[230px]">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F6F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED] flex-shrink-0">
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-[#7C3AED] stroke-[2] -rotate-12" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                  {ticketsDisplay}
                </span>
                <span className="text-[11px] font-bold text-[#16A34A] bg-[#E8FAF0] border border-[#D1F7E2] px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  {ticketsGrowthDisplay}
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-medium mt-0.5 whitespace-nowrap">
                Tickets Sold Today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SECTION: Flamingo on Coral Rock ── */}
      <div className="relative z-10 flex-shrink-0 self-center lg:self-end flex items-center justify-center lg:justify-end pb-1 pr-1 lg:pr-2">
        <div className="relative w-64 sm:w-72 md:w-80 lg:w-[320px] h-48 sm:h-52 md:h-56 flex items-center justify-center lg:justify-end">
          <img
            src="/images/illustrations/Flamingo%20with%20Laptop%20on%20Coral%20Rock.png"
            alt="Passqo Organiser Flamingo"
            className="w-full h-full object-contain object-bottom select-none pointer-events-none drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
}

export default GreetingBanner;
