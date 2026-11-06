import { User, Sparkles, Linkedin, Globe } from "lucide-react";

export function ProfilesFeature({ event, details }) {
  // Label dynamic according to sheet:
  // Music: Performer | Business: Speaker | Education: Speaker | Wellness: Instructor | Food: Chef/Host | Exhibitions: Curator
  const category = event?.category || "BUSINESS";
  let sectionTitle = "Featured Speakers";
  let roleBadge = "Speaker";

  if (category === "MUSIC_ENTERTAINMENT") {
    sectionTitle = "Performer Profiles";
    roleBadge = "Performer";
  } else if (category === "HEALTH_WELLNESS") {
    sectionTitle = "Instructor Profiles";
    roleBadge = "Instructor";
  } else if (category === "FOOD_DRINK") {
    sectionTitle = "Chef & Host Profiles";
    roleBadge = "Chef/Host";
  } else if (category === "EXHIBITIONS") {
    sectionTitle = "Curator & Featured Artists";
    roleBadge = "Curator";
  }

  const profiles = details?.speakers || details?.instructors || details?.chefs || details?.curators || details?.lineup?.supporting || [];

  if (profiles.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-black/6 shadow-2xs text-center py-10 text-neutral-400">
        <User className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
        <p className="text-sm font-semibold">{sectionTitle} will be announced soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/6 shadow-2xs space-y-3.5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/6 pb-2.5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1B1B23] tracking-tight">
            {sectionTitle}
          </h3>
          <p className="text-xs text-[#8C8C9E] mt-0.5">
            Learn directly from industry leaders, masters, and recognized pioneers.
          </p>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-[#FF4E7A] bg-pink-50 px-2.5 py-0.5 rounded-full w-fit flex-shrink-0">
          {profiles.length} {roleBadge}s
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {profiles.map((profile, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-black/6 bg-neutral-50/50 hover:bg-neutral-50 hover:border-black/15 transition-all flex items-start gap-3 group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0 shadow-2xs ring-2 ring-white">
              <img
                src={profile.image || "/images/figma-sample/goa/headliner.png"}
                alt={profile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center justify-between gap-1">
                <p className="font-extrabold text-xs sm:text-sm text-[#1B1B23] truncate">
                  {profile.name}
                </p>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {profile.tag || roleBadge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#FF4E7A] font-semibold truncate">
                {profile.role || profile.title}
              </p>
              {profile.company && (
                <p className="text-[10px] sm:text-[11px] text-[#8C8C9E] font-medium truncate">
                  {profile.company}
                </p>
              )}
              {profile.topic && (
                <p className="text-[11px] text-[#4A4A58] line-clamp-2 italic pt-0.5 leading-snug">
                  "{profile.topic}"
                </p>
              )}
              {profile.bio && !profile.topic && (
                <p className="text-[11px] text-[#6E6969] line-clamp-2 pt-0.5 leading-snug">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilesFeature;

