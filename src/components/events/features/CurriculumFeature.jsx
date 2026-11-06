import { Award, Video, FileCheck, CheckCircle2, Clock } from "lucide-react";

export function CurriculumFeature({ event, details }) {
  const curriculum = details?.curriculum || [
    { week: "Module 1", title: "Foundations & Architectural Principles", duration: "2 Hours", topics: ["Core fundamentals", "Environment setup", "Mental models & design patterns"] },
    { week: "Module 2", title: "Advanced Implementations & Hands-On Workshop", duration: "3 Hours", topics: ["Live coding session", "Debugging strategies", "Real-world production case study"] },
    { week: "Module 3", title: "Scalability, Security & Production Deployment", duration: "2.5 Hours", topics: ["Performance optimization", "Security audits", "CI/CD integration"] },
    { week: "Module 4", title: "Live Q&A, Project Review & Certification", duration: "1.5 Hours", topics: ["Interactive code review", "Portfolio feedback", "Certification award"] },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/6 pb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
            Curriculum & Learning Outcomes
          </h3>
          <p className="text-xs text-[#8C8C9E] mt-0.5">
            Structured step-by-step masterclass syllabus with practical exercises.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          <span>Accredited Course</span>
        </span>
      </div>

      {/* Highlights banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="bg-neutral-50 border border-black/6 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-pink-50 text-[#FF4E7A] flex items-center justify-center flex-shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-xs text-[#1B1B23]">Lifetime Replay Access</p>
            <p className="text-[11px] text-[#8C8C9E]">Full HD recordings + slide decks</p>
          </div>
        </div>

        <div className="bg-neutral-50 border border-black/6 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-xs text-[#1B1B23]">Digital Verified Certificate</p>
            <p className="text-[11px] text-[#8C8C9E]">Shareable on LinkedIn & CV</p>
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-3 pt-2">
        {curriculum.map((mod, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-black/6 bg-neutral-50/50 hover:bg-neutral-50 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#FF4E7A] bg-pink-50 px-2 py-0.5 rounded-md">
                {mod.week}
              </span>
              <span className="text-xs text-[#8C8C9E] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {mod.duration}
              </span>
            </div>

            <h4 className="font-bold text-sm sm:text-base text-[#1B1B23]">
              {mod.title}
            </h4>

            {mod.topics && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {mod.topics.map((t, tIdx) => (
                  <li key={tIdx} className="text-xs text-[#6E6969] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurriculumFeature;

