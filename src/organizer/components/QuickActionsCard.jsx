import { CalendarPlus, UserPlus, FileSpreadsheet, Settings } from "lucide-react";

export function QuickActionsCard({
  onCreateEvent,
  onAddTeam,
  onGenerateReport,
  onOpenSettings,
}) {
  const actions = [
    {
      id: "create-event",
      label: "Create Event",
      icon: CalendarPlus,
      iconBg: "bg-[#2563EB]",
      onClick: onCreateEvent,
    },
    {
      id: "add-team",
      label: "Add Team",
      icon: UserPlus,
      iconBg: "bg-[#10B981]",
      onClick: onAddTeam,
    },
    {
      id: "generate-report",
      label: "Generate Report",
      icon: FileSpreadsheet,
      iconBg: "bg-[#9333EA]",
      onClick: onGenerateReport,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      iconBg: "bg-[#64748B]",
      onClick: onOpenSettings,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between h-full">
      <div className="pb-4 border-b border-[#e2e8f0]">
        <h3 className="text-[#0f172a] text-lg font-semibold">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 flex-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className="p-4 rounded-lg bg-[#fbfcfd] border border-[#e2e8f0] hover:border-blue-300 hover:bg-white hover:shadow-xs transition-all flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-lg ${act.iconBg} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-[#0f172a] group-hover:text-blue-600 transition-colors">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActionsCard;

