import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Armchair,
  CalendarPlus,
  Camera,
  Disc3,
  Download,
  Hand,
  Layers,
  MapPin,
  Mic,
  Music2,
  Navigation,
  Play,
  Share2,
  Sparkles,
  Star,
  UserPlus,
  Utensils,
} from "lucide-react";
import { EventCard } from "@/components/events/EventCard";

export const CARD = "bg-white rounded-[20px] p-5 lg:p-6";

export function SectionHeading({ eyebrow, title }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-extrabold tracking-wide text-[#EF4B7E] uppercase">{eyebrow}</p>
      <h2 className="text-[26px] lg:text-[30px] leading-[1.25] text-[#18181C]">{title}</h2>
    </div>
  );
}

export function Notice({ children }) {
  return <p className="bg-[#FFF0F4] rounded-[10px] px-3.5 py-2.5 text-xs leading-relaxed text-[#8B5E20]">{children}</p>;
}

export function Badge({ children }) {
  return <span className="inline-flex bg-[#FFF0F4] text-[#EF4B7E] text-xs font-bold rounded-full px-3 py-1.5 w-fit">{children}</span>;
}

export function ActionChip({
  children,
  primary,
  href,
  onClick,
  icon: Icon,
  external,
  disabled,
  ariaPressed,
}) {
  const cls = `inline-flex items-center gap-2 px-[18px] py-3 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors ${
    primary
      ? "bg-[#EF4B7E] border border-[#EF4B7E] text-white hover:bg-[#D4537E]"
      : "bg-white border border-[#E7DEDA] text-[#18181C] hover:border-[#EF4B7E]"
  } ${disabled ? "opacity-50 pointer-events-none" : ""}`;
  const inner = (
    <>
      {Icon && <Icon className="w-[18px] h-[18px]" />}
      {children}
    </>
  );
  if (href) {
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    ) : (
      <Link to={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={ariaPressed} className={cls}>
      {inner}
    </button>
  );
}

export function Section({ id, children }) {
  return <section id={id} className="flex flex-col gap-6 py-9 scroll-mt-24">{children}</section>;
}

// ── 01 Lineup ─────────────────────────────────────────────────────────────────

function ArtistLinks({ a }) {
  if (a.links?.length) {
    return (
      <p className="text-xs text-[#18181C]">
        {a.links.map((l, i) => (
          <span key={l.url}>
            {i > 0 && "  ·  "}
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#EF4B7E]">
              {l.label} ↗
            </a>
          </span>
        ))}
      </p>
    );
  }
  return a.linksNote ? <p className="text-xs text-[#18181C] whitespace-pre-wrap">{a.linksNote}</p> : null;
}

export function LineupSection({ event, details }) {
  const d = details.lineup;
  const headliner = d?.headliner ?? (event.artist
    ? {
        name: event.artist.name,
        role: event.artist.genres?.slice(0, 3).join(" / "),
        image: event.artist.image,
        profileUrl: `/artists/${event.artist.slug}`,
        tag: "HEADLINER / FEATURED ARTIST",
      }
    : undefined);
  const supporting = d?.supporting ?? (event.lineup ?? [])
    .filter((l) => l.role !== "HEADLINER")
    .map((l) => ({
      name: l.name,
      image: l.image,
      tag: l.role === "SUPPORT" ? "Supporting artist" : l.role === "SPECIAL_GUEST" ? "Special guest" : "Lineup",
    }));
  if (!headliner && supporting.length === 0) return null;
  const count = (headliner ? 1 : 0) + supporting.length;

  return (
    <Section id="lineup">
      <SectionHeading eyebrow="Lineup" title={count === 1 ? "Artist" : "Artists"} />
      {headliner && (
        <div className={`${CARD} flex flex-col sm:flex-row gap-6`}>
          <div className="relative w-full sm:w-[200px] h-[240px] rounded-2xl overflow-hidden bg-[#EDE8E2] flex-shrink-0">
            {headliner.image && (
              <img src={headliner.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <Badge>{headliner.tag ?? "HEADLINER / FEATURED ARTIST"}</Badge>
            <p className="text-[28px] leading-[1.25] text-[#18181C]">{headliner.name}</p>
            {headliner.role && <p className="text-[15px] text-[#6E6969]">{headliner.role}</p>}
            {headliner.bio && <p className="text-[15px] leading-relaxed text-[#18181C]">{headliner.bio}</p>}
            {headliner.slot && <p className="text-[15px] font-bold text-[#18181C]">{headliner.slot}</p>}
            <div className="flex flex-wrap gap-2">
              {headliner.profileUrl && <ActionChip href={headliner.profileUrl}>View artist ↗</ActionChip>}
              {headliner.links?.[0] && <ActionChip href={headliner.links[0].url} external>Social links ↗</ActionChip>}
            </div>
            {!headliner.links?.length && headliner.linksNote && <p className="text-[11px] text-[#6E6969]">{headliner.linksNote}</p>}
          </div>
        </div>
      )}
      {d?.notice && <Notice>{d.notice}</Notice>}
      {supporting.length > 0 && (
        <div className="grid md:grid-cols-2 gap-5">
          {supporting.map((a) => (
            <div key={a.name} className={`${CARD} flex gap-[18px]`}>
              <div className="relative w-[116px] h-[148px] rounded-2xl overflow-hidden bg-[#EDE8E2] flex-shrink-0">
                {a.image && <img src={a.image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                {a.tag && <p className="text-[11px] text-[#6E6969]">{a.tag}</p>}
                <p className="text-xl leading-[1.25] text-[#18181C]">{a.name}</p>
                {a.role && <p className="text-[13px] text-[#18181C]">{a.role}</p>}
                {a.bio && <p className="text-[13px] text-[#6E6969]">{a.bio}</p>}
                <ArtistLinks a={a} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ── 03 Schedule ───────────────────────────────────────────────────────────────

export function ScheduleSection({ details, calendarUrl }) {
  const d = details.schedule;
  const [day, setDay] = useState(0);
  if (!d?.days?.length) return null;
  const rows = d.days[day]?.rows ?? [];
  return (
    <Section id="schedule">
      <SectionHeading eyebrow="Schedule" title="Running order" />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {d.days.map((dd, i) => (
            <ActionChip key={dd.label} primary={i === day} onClick={() => setDay(i)} ariaPressed={i === day}>
              {dd.label}
            </ActionChip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {calendarUrl && <ActionChip href={calendarUrl} external icon={CalendarPlus}>Add to calendar</ActionChip>}
          {d.downloadUrl && <ActionChip href={d.downloadUrl} external icon={Download}>Download schedule</ActionChip>}
        </div>
      </div>
      {d.notice && <Notice>{d.notice}</Notice>}
      <div className={`${CARD} flex flex-col gap-4`}>
        <div className="hidden sm:flex gap-6 text-[11px] uppercase text-[#6E6969]">
          <span className="w-[100px]">Time</span><span className="flex-1">Session / artist</span><span className="w-[240px]">Stage / duration</span>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-[#6E6969]">No sessions announced for this date yet.</p>
        ) : (
          rows.map((r, i) => (
            <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 rounded-xl px-3 py-3.5 ${r.highlight ? "bg-[#FFF0F4]" : "bg-[#FAF7F4]"}`}>
              <p className="sm:w-[88px] text-sm font-bold text-[#EF4B7E]">{r.time}</p>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[#18181C]">{r.title}</p>
                {r.subtitle && <p className="text-xs text-[#6E6969]">{r.subtitle}</p>}
              </div>
              <div className="sm:w-[228px]">
                {r.stage && <p className="text-[13px] text-[#18181C]">{r.stage}</p>}
                {r.duration && <p className="text-xs text-[#6E6969]">{r.duration}</p>}
              </div>
            </div>
          ))
        )}
      </div>
      {d.footnote && <p className="text-xs text-[#6E6969]">{d.footnote}</p>}
    </Section>
  );
}

// ── 02/07 Stages ──────────────────────────────────────────────────────────────

export function StagesSection({ details }) {
  const d = details.stages;
  const [active, setActive] = useState(0);
  if (!d?.items?.length) return null;
  const ordered = [d.items[active], ...d.items.filter((_, i) => i !== active)];
  return (
    <Section id="stages">
      <SectionHeading eyebrow="Stages" title="Where to go" />
      {d.notice && <Notice>{d.notice}</Notice>}
      <div className="flex flex-wrap items-center gap-2.5">
        {d.items.map((s, i) => (
          <ActionChip key={s.name} primary={i === active} onClick={() => setActive(i)} ariaPressed={i === active}>
            {s.name}{s.zone ? ` · ${s.zone.split(" ")[0]}` : ""}
          </ActionChip>
        ))}
        {d.actualStageNote && <Badge>{d.actualStageNote}</Badge>}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {ordered.slice(0, 2).map((s) => (
          <div key={s.name} className={`${CARD} flex flex-col gap-4`}>
            <div className="relative h-[180px] rounded-2xl overflow-hidden bg-[#EDE8E2]">
              {s.image && <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
            </div>
            <p className="text-[22px] leading-[1.25] text-[#18181C]">{s.name}{s.zone ? ` · ${s.zone}` : ""}</p>
            {s.description && <p className="text-[13px] text-[#6E6969]">{s.description}</p>}
            {s.status && <Badge>{s.status}</Badge>}
            {s.now && <p className="text-[15px] font-bold text-[#18181C]">{s.now}</p>}
            {s.nowDetail && <p className="text-[13px] text-[#18181C]">{s.nowDetail}</p>}
            {s.next && <p className="text-xs text-[#6E6969]">{s.next}</p>}
          </div>
        ))}
      </div>
      {d.schematic && (
        <div className="bg-[#EEE6DC] rounded-[20px] p-5 lg:p-6 flex flex-col gap-3.5">
          {d.schematic.title && <p className="text-xs font-bold text-[#18181C]">{d.schematic.title}</p>}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(1, d.schematic.stages.length)}, minmax(0, 1fr))` }}>
            {d.schematic.stages.map((z) => (
              <div key={z.label} className={`h-[100px] rounded-xl flex items-center justify-center text-base text-white ${z.tone === "pink" ? "bg-[#EF4B7E]" : "bg-[#242125]"}`}>{z.label}</div>
            ))}
          </div>
          {d.schematic.audience.length > 0 && (
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${d.schematic.audience.length}, minmax(0, 1fr))` }}>
              {d.schematic.audience.map((a) => <div key={a} className="h-[65px] rounded-[10px] bg-white flex items-center justify-center text-[13px] text-[#18181C] text-center px-2">{a}</div>)}
            </div>
          )}
          {d.schematic.facilities && <p className="text-xs text-[#18181C] whitespace-pre-wrap">{d.schematic.facilities}</p>}
          {d.schematic.note && <p className="text-[11px] text-[#6E6969]">{d.schematic.note}</p>}
        </div>
      )}
    </Section>
  );
}

// ── 04 Highlights ─────────────────────────────────────────────────────────────

const HIGHLIGHT_ICONS = {
  music: Music2,
  sparkles: Sparkles,
  disc: Disc3,
  hand: Hand,
  utensils: Utensils,
  armchair: Armchair,
  star: Star,
  camera: Camera,
  mic: Mic,
};

export function HighlightsSection({ details }) {
  const d = details.highlights;
  if (!d?.items?.length) return null;
  return (
    <Section id="highlights">
      <SectionHeading eyebrow="Highlights" title="What to expect" />
      {(d.image || d.headline || d.intro) && (
        <div className="flex flex-col lg:flex-row gap-6">
          {d.image && (
            <div className="relative w-full lg:w-[520px] h-[230px] rounded-2xl overflow-hidden bg-[#EDE8E2] flex-shrink-0">
              <img src={d.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 flex flex-col gap-4">
            {d.headline && <p className="text-[26px] leading-[1.25] text-[#18181C] whitespace-pre-line">{d.headline}</p>}
            {d.intro && <p className="text-[15px] leading-relaxed text-[#18181C]">{d.intro}</p>}
            {d.notice && <Notice>{d.notice}</Notice>}
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {d.items.map((h) => {
          const Icon = HIGHLIGHT_ICONS[h.icon ?? "sparkles"] || Sparkles;
          return (
            <div key={h.title} className={`${CARD} flex flex-col gap-4`}>
              <Icon className="w-7 h-7 text-[#EF4B7E]" />
              <p className="text-lg leading-[1.25] text-[#18181C]">{h.title}</p>
              {h.description && <p className="text-[13px] text-[#6E6969]">{h.description}</p>}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ── 05 Venue & essentials ─────────────────────────────────────────────────────

export function VenueSection({ event, details, dateLabel, timeLabel, onContact }) {
  const venueName = event.venueHidden ? "Venue shared once you register" : event.venue || "Venue to be announced";
  const mapsUrl = event.lat && event.lng
    ? `https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(`${event.venue ?? ""} ${event.city}`)}`;
  const hasAddress = !!event.address && !event.addressHidden;
  const essentials = details.essentials ?? [];
  return (
    <Section id="venue">
      <SectionHeading eyebrow="Venue" title={venueName} />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`${CARD} flex-1 flex flex-col gap-5`}>
          {[
            ["Address", hasAddress ? `${event.address}, ${event.city}` : event.addressHidden ? "Shared once your registration is confirmed" : `${event.city} · address to be announced`],
            ["Date", dateLabel],
            ["Time", timeLabel],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xs font-semibold text-[#6E6969]">{k}</p>
              <p className="text-[15px] font-bold text-[#18181C] leading-relaxed">{v}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            {(hasAddress || (event.lat && event.lng)) && <ActionChip href={mapsUrl} external icon={Navigation}>Get directions</ActionChip>}
            {onContact && <ActionChip onClick={onContact}>Contact organiser</ActionChip>}
          </div>
        </div>
        {(hasAddress || (event.lat && event.lng)) && (
          <div className="w-full lg:w-[360px] flex-shrink-0 bg-[#EEE6DC] rounded-[20px] p-5 lg:p-6 flex flex-col justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-[#EF4B7E]" /></span>
              <p className="text-[15px] font-bold text-[#18181C] leading-relaxed">{venueName}</p>
            </div>
            <ActionChip href={mapsUrl} external icon={Layers}>Open in Google Maps</ActionChip>
          </div>
        )}
      </div>
      {essentials.length > 0 && (
        <>
          <p className="text-[22px] leading-[1.25] text-[#18181C]">Before you go</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {essentials.map((e) => (
              <div key={e.title} className={`${CARD} flex flex-col gap-4`}>
                <p className="text-base leading-[1.25] text-[#18181C]">{e.title}</p>
                <p className="text-xs leading-relaxed text-[#6E6969]">{e.body}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

// ── 08 Gallery ────────────────────────────────────────────────────────────────

export function GallerySection({ details }) {
  const d = details.gallery;
  const [filter, setFilter] = useState(null);
  const [open, setOpen] = useState(null);
  if (!d?.items?.length) return null;
  const groups = Array.from(new Set(d.items.map((i) => i.group).filter(Boolean)));
  const shown = filter ? d.items.filter((i) => i.group === filter) : d.items;
  return (
    <Section id="gallery">
      <SectionHeading eyebrow="Gallery" title="Photos & video" />
      {d.notice && <Notice>{d.notice}</Notice>}
      {groups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <ActionChip primary={!filter} onClick={() => setFilter(null)} ariaPressed={!filter}>All media</ActionChip>
          {groups.map((g) => <ActionChip key={g} primary={filter === g} onClick={() => setFilter(g)} ariaPressed={filter === g}>{g}</ActionChip>)}
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((it, i) => (
          <figure key={`${it.url}-${i}`} className="flex flex-col gap-2.5">
            <button type="button" onClick={() => setOpen(it)} className="relative h-[260px] rounded-2xl overflow-hidden bg-[#EDE8E2] block w-full text-left">
              <img src={it.url} alt={it.caption ?? ""} className="absolute inset-0 w-full h-full object-cover" />
              {it.kind === "video" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white rounded-full p-4"><Play className="w-6 h-6 text-[#18181C]" /></span>
                </span>
              )}
            </button>
            {it.caption && <figcaption className="text-xs text-[#6E6969]">{it.caption}</figcaption>}
          </figure>
        ))}
      </div>
      {d.moreUrl && <ActionChip href={d.moreUrl} external>View all imagery ↗</ActionChip>}
      {open && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          {open.kind === "video" && open.videoUrl ? (
            <iframe src={open.videoUrl} title={open.caption ?? "Video"} className="w-full max-w-4xl aspect-video rounded-2xl" allow="autoplay; fullscreen" />
          ) : (
            <img src={open.url} alt={open.caption ?? ""} className="max-w-full max-h-full rounded-2xl object-contain" />
          )}
        </div>
      )}
    </Section>
  );
}

// ── 09 Community ──────────────────────────────────────────────────────────────

export function CommunitySection({ event, details, guestNames = [], onShare, onInvite }) {
  const attending = event.totalSold ?? 0;
  const interested = details.community?.interestedCount ?? event.waitlistCount ?? 0;
  const fb = event.feedbackSummary;
  const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const avatars = guestNames.slice(0, 4);
  const rest = Math.max(0, attending - avatars.length);
  const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : n.toLocaleString());
  return (
    <Section id="community">
      <SectionHeading eyebrow="Community" title="Who's going" />
      {details.community?.notice && <Notice>{details.community.notice}</Notice>}
      <div className={`grid gap-5 ${fb ? "md:grid-cols-2" : ""}`}>
        <div className={`${CARD} flex flex-col gap-4`}>
          <div className="flex gap-6">
            <div className="flex-1"><p className="text-[30px] leading-[1.25] text-[#18181C]">{fmt(attending)}</p><p className="text-xs text-[#6E6969]">Attending</p></div>
            {(interested > 0 || details.community?.interestedCount != null) && (
              <div className="flex-1"><p className="text-[30px] leading-[1.25] text-[#18181C]">{fmt(interested)}</p><p className="text-xs text-[#6E6969]">{details.community?.interestedCount != null ? "Interested" : "On the waitlist"}</p></div>
            )}
          </div>
          {avatars.length > 0 && (
            <div className="flex">
              {avatars.map((n, i) => (
                <span key={i} className="w-[42px] h-[42px] rounded-full bg-[#EEE6DC] border-[3px] border-white -mr-1.5 flex items-center justify-center text-[11px] font-bold text-[#18181C]">{initials(n)}</span>
              ))}
              {rest > 0 && <span className="w-[42px] h-[42px] rounded-full bg-[#FFF0F4] border-[3px] border-white flex items-center justify-center text-[11px] font-bold text-[#18181C]">+{fmt(rest)}</span>}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <ActionChip primary onClick={onShare} icon={Share2}>Share event</ActionChip>
            <ActionChip onClick={onInvite} icon={UserPlus}>Invite friends</ActionChip>
          </div>
        </div>
        {fb && (
          <div className={`${CARD} flex flex-col gap-4`}>
            <Badge>Attendee reviews</Badge>
            <p className="text-[30px] leading-[1.25] text-[#18181C]">{fb.average} / 5</p>
            <p className="text-[13px] text-[#18181C]">{"★".repeat(Math.round(fb.average))}{"☆".repeat(5 - Math.round(fb.average))} · {fb.count} {fb.count === 1 ? "review" : "reviews"}</p>
            {fb.highlight && (
              <>
                <p className="text-[15px] leading-relaxed text-[#18181C]">“{fb.highlight.comment}”</p>
                <p className="text-xs text-[#6E6969]">— {fb.highlight.name ?? "Verified attendee"}</p>
              </>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}

// ── FAQ + organiser ───────────────────────────────────────────────────────────

export function FaqSection({ event, details }) {
  const faqs = details.faqs ?? [];
  const [openIdx, setOpenIdx] = useState(0);
  const termsHref = event.termsUrl || (event.termsText ? "#terms" : "/terms");
  if (faqs.length === 0 && !event.termsText && !event.termsUrl) return null;
  return (
    <Section id="faqs">
      <SectionHeading eyebrow="FAQ" title="Questions" />
      <div className={`${CARD} flex flex-col gap-4`}>
        {faqs.map((f, i) => {
          const open = i === openIdx;
          return (
            <div key={f.q} className="border-b border-[#E7DEDA] py-3 flex flex-col gap-2.5">
              <button type="button" onClick={() => setOpenIdx(open ? -1 : i)} aria-expanded={open} className="flex items-start justify-between gap-4 text-left w-full">
                <span className="text-lg leading-[1.25] text-[#18181C]">{f.q}</span>
                <span className="text-[22px] leading-none text-[#EF4B7E]">{open ? "−" : "+"}</span>
              </button>
              {open && <p className="text-sm leading-relaxed text-[#6E6969]">{f.a}</p>}
            </div>
          );
        })}
        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-xl leading-[1.25] text-[#18181C]">Terms and Conditions</p>
          <ActionChip href={termsHref} external={!!event.termsUrl}>View terms →</ActionChip>
        </div>
        {event.termsText && <p id="terms" className="text-sm text-[#6E6969] whitespace-pre-line pt-2">{event.termsText}</p>}
      </div>
    </Section>
  );
}

export function OrganiserSection({ event, following, onFollow, followError }) {
  const o = event.organiser;
  if (!o) return null;
  return (
    <Section id="organiser">
      <SectionHeading eyebrow="Meet the organizer" title={`Brought to you by ${o.businessName}`} />
      <div className={`${CARD} flex flex-col sm:flex-row sm:items-center gap-6`}>
        <div className="relative w-[84px] h-[84px] rounded-full overflow-hidden bg-[#55D9C7] flex items-center justify-center flex-shrink-0">
          {o.image ? (
            <img src={o.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <span className="text-[40px] text-[#18181C]">{o.businessName?.[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <p className="text-2xl leading-[1.25] text-[#18181C]">
            {o.businessName}
            {o.verified && <span className="text-[#00A889] text-sm font-bold ml-2">✓ Verified</span>}
          </p>
          <p className="text-[15px] text-[#6E6969]">Event organiser</p>
          {followError && <p className="text-xs text-red-500">{followError}</p>}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <ActionChip primary={!following} onClick={onFollow}>{following ? "Following" : "Follow"}</ActionChip>
          {o.slug && <ActionChip href={`/organizers/${o.slug}`}>View profile →</ActionChip>}
        </div>
      </div>
    </Section>
  );
}

// ── 10 Keep discovering ───────────────────────────────────────────────────────

export function DiscoverSection({ groups }) {
  const cards = groups.flatMap((g) => g.events.slice(0, 2).map((e) => ({ label: g.label, e })));
  if (cards.length === 0) return null;
  return (
    <Section id="discover">
      <SectionHeading eyebrow="More events" title="You might also like" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.slice(0, 6).map(({ label, e }) => (
          <div key={`${label}-${e.id}`} className="flex flex-col gap-2.5">
            <p className="text-xs font-bold text-[#18181C]">{label}</p>
            <EventCard
              id={e.id}
              slug={e.slug}
              name={e.name}
              date={e.date}
              venue={e.venue}
              city={e.city}
              minPrice={e.minPrice ?? e.ticketTiers?.[0]?.price ?? 0}
              image={e.image}
              category={e.category}
              organiser={e.organiser}
              timezone={e.timezone}
              isSoldOut={e.isSoldOut}
              isSellingFast={e.isSellingFast}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}

