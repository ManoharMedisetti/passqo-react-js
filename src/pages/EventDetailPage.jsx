import { Suspense, useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/ui/Navbar";
import { BottomNav } from "@/components/ui/BottomNav";
import { Footer } from "@/components/ui/Footer";
import { api } from "@/lib/api";
import { isAuthenticated, getUser } from "@/lib/auth/storage";
import { useAuthModal } from "@/context/AuthContext";
import { RichTextDisplay } from "@/components/ui/RichTextDisplay";
import { FEATURES } from "@/lib/features";
import { CalendarPlus, Heart, Share2, UserPlus } from "lucide-react";
import { getWishlist, toggleWishlist } from "@/components/events/EventCard";
import { eventDetailsOf } from "@/lib/eventDetails";
import {
  ActionChip,
  Badge,
  CARD,
  CommunitySection,
  DiscoverSection,
  FaqSection,
  GallerySection,
  HighlightsSection,
  LineupSection,
  Notice,
  OrganiserSection,
  ScheduleSection,
  Section,
  SectionHeading,
  StagesSection,
  VenueSection,
} from "@/components/events/detail/sections";
import { categoryLabel } from "@/lib/eventCategories";
import { eventLocationLine } from "@/lib/eventLocation";
import { MOCK_EVENTS } from "@/lib/mockData";

const AGE_RESTRICTION_LABELS = {
  EIGHTEEN_PLUS: "🔞 18+",
  TWENTY_ONE_PLUS: "🔞 21+",
};

function BlockchainBadge() {
  return (
    <span className="relative overflow-hidden bg-[#00C896] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      ⛓ On-chain verified
    </span>
  );
}

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function PostComposer({ placeholder, onSubmit, buttonLabel }) {
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full border-2 border-[#FF4E7A]/30 text-[#FF4E7A] font-bold text-sm py-3 rounded-xl hover:bg-[#FF4E7A]/5 transition-colors"
      >
        {buttonLabel}
      </button>
    );
  }

  const handleSubmit = async () => {
    if (!body.trim()) return;
    setSaving(true);
    setError("");
    try {
      await onSubmit(body.trim());
      setBody("");
      setOpen(false);
    } catch (err) {
      setError(err.message || "Could not post — try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-3 space-y-2">
      <textarea
        autoFocus
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full text-sm text-[#1B1B23] placeholder:text-gray-400 focus:outline-none resize-none"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            setOpen(false);
            setBody("");
          }}
          className="text-xs font-semibold text-gray-400 px-3 py-1.5"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || !body.trim()}
          className="bg-[#FF4E7A] hover:bg-[#D4537E] disabled:opacity-40 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors"
        >
          {saving ? "Posting…" : buttonLabel}
        </button>
      </div>
    </div>
  );
}

function PostCard({ post, eventId, onChanged }) {
  const [showReplies, setShowReplies] = useState(false);
  const [liking, setLiking] = useState(false);
  const [likeState, setLikeState] = useState({ likeCount: post.likeCount });
  const navigate = useNavigate();
  const { openAuth } = useAuthModal();

  const handleLike = async () => {
    if (!isAuthenticated()) {
      openAuth("signin");
      return;
    }
    setLiking(true);
    try {
      const r = await api.events.toggleLike(eventId, post.id);
      setLikeState({ likeCount: r.likeCount });
    } catch {
      // ignore
    } finally {
      setLiking(false);
    }
  };

  const handleReply = async (body) => {
    await api.events.replyToPost(eventId, post.id, body);
    await onChanged();
    setShowReplies(true);
  };

  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4E7A] to-[#FFB020] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-black">
            {(post.user?.name || "?")[0].toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-semibold text-[#1B1B23]">{post.user?.name || "Attendee"}</span>
        {post.type === "UPDATE" && (
          <span className="text-[10px] font-bold bg-[#00C896] text-white px-1.5 py-0.5 rounded-full">
            Organiser
          </span>
        )}
        <span className="text-xs text-gray-400 ml-auto">{timeAgo(post.createdAt)}</span>
      </div>
      {post.title && <p className="text-sm font-semibold text-[#1B1B23]">{post.title}</p>}
      <p className="text-xs text-gray-500 whitespace-pre-wrap">{post.body}</p>
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleLike}
          disabled={liking}
          className="flex items-center gap-1 bg-[#F5F0EB] hover:bg-[#EDE8E2] px-2.5 py-1 rounded-full transition-colors disabled:opacity-50"
        >
          <span className="text-xs">❤️</span>
          <span className="text-[10px] font-semibold text-[#1B1B23]">{likeState.likeCount}</span>
        </button>
        <button
          onClick={() => setShowReplies((v) => !v)}
          className="text-xs text-gray-400 hover:text-[#1B1B23] ml-auto"
        >
          {post.replies?.length || 0} repl{post.replies?.length === 1 ? "y" : "ies"}
        </button>
      </div>

      {showReplies && (
        <div className="pt-2 space-y-2 border-t border-gray-50">
          {(post.replies || []).map((r) => (
            <div key={r.id} className="flex items-start gap-2 pl-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00C896] to-[#005C45] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-black">
                  {(r.user?.name || "?")[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1B1B23]">
                  {r.user?.name || "Attendee"}{" "}
                  <span className="text-gray-400 font-normal">· {timeAgo(r.createdAt)}</span>
                </p>
                <p className="text-xs text-gray-500">{r.body}</p>
              </div>
            </div>
          ))}
          {isAuthenticated() && (
            <PostComposer placeholder="Write a reply…" buttonLabel="Reply" onSubmit={handleReply} />
          )}
        </div>
      )}
    </div>
  );
}

function SocialHubSection({ eventId, isOrganiser }) {
  const [tab, setTab] = useState("updates");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const authed = isAuthenticated();
  const { openAuth } = useAuthModal();

  const load = () =>
    api.events
      .posts(eventId)
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, [eventId]);

  const updates = posts.filter((p) => p.type === "UPDATE");
  const threads = posts.filter((p) => p.type === "THREAD");

  const handlePost = async (type, body, title) => {
    await api.events.createPost(eventId, { type, title, body });
    await load();
  };

  if (!loading && posts.length === 0 && !isOrganiser) return null;

  return (
    <div id="community-hub" className="bg-white rounded-card p-5 space-y-4 my-9 scroll-mt-24">
      <h2 className="font-black text-lg text-[#1B1B23]">Updates &amp; discussion</h2>

      <div className="flex gap-1 border-b border-gray-100">
        {["updates", "threads"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm font-semibold px-4 py-2.5 border-b-2 transition-colors ${
              tab === t
                ? "border-[#FF4E7A] text-[#FF4E7A]"
                : "border-transparent text-gray-400 hover:text-[#1B1B23]"
            }`}
          >
            {t === "updates" ? "Organiser Updates" : "Discussion"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-[#FF4E7A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === "updates" ? (
        <div className="space-y-3">
          {updates.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">📢</p>
              <p className="text-sm">No organiser updates yet.</p>
            </div>
          )}
          {updates.map((p) => (
            <PostCard key={p.id} post={p} eventId={eventId} onChanged={async () => { await load(); }} />
          ))}
          {isOrganiser && (
            <PostComposer
              placeholder="Post an update for everyone who's registered…"
              buttonLabel="+ Post Update"
              onSubmit={(body) => handlePost("UPDATE", body)}
            />
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-[#00C896]/10 border border-[#00C896]/20 rounded-xl p-3 flex items-start gap-2.5">
            <span className="text-[#00C896] text-lg flex-shrink-0">🎟️</span>
            <div>
              <p className="text-xs font-semibold text-[#1B1B23]">Ticket holders only</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Only people with a ticket for this event can post or reply.
              </p>
            </div>
          </div>

          {threads.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">No threads yet — be the first to say something.</p>
            </div>
          )}
          {threads.map((p) => (
            <PostCard key={p.id} post={p} eventId={eventId} onChanged={async () => { await load(); }} />
          ))}

          {!authed ? (
            <div className="border-2 border-dashed border-[#FF4E7A]/30 rounded-xl p-5 text-center bg-[#FF4E7A]/5">
              <p className="text-sm font-bold text-[#1B1B23] mb-1">
                Sign in to join the conversation
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Only ticket holders can post threads and replies.
              </p>
              <button
                type="button"
                onClick={() => openAuth("signin")}
                className="inline-block bg-[#FF4E7A] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#FF3567] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>
          ) : (
            <PostComposer
              placeholder="Ask a question or start a conversation…"
              buttonLabel="+ Start a Thread"
              onSubmit={(body) => handlePost("THREAD", body)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function AcceptInviteCard({ organiserName, responding, error, onAccept, token }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold text-[#FF4E7A] uppercase tracking-wide">You&apos;re invited</p>
        <h2 className="font-black text-xl text-[#1B1B23] mt-0.5">
          {organiserName ? `${organiserName} invited you` : "You're invited to this event"}
        </h2>
      </div>
      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}
      <button
        onClick={onAccept}
        disabled={responding}
        className="w-full bg-[#FF4E7A] hover:bg-[#D4537E] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors"
      >
        {responding ? "Accepting…" : "Accept Invite"}
      </button>
      <Link
        to={`/invite/${token}?action=decline`}
        className="block text-center text-xs text-gray-400 hover:text-gray-600"
      >
        Can&apos;t make it? Decline →
      </Link>
    </div>
  );
}

function EventDetailPageInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openAuth } = useAuthModal();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notLive, setNotLive] = useState(false);
  const [selectedTiers, setSelectedTiers] = useState({});
  const [waitlistInfo, setWaitlistInfo] = useState(null);
  const [guestList, setGuestList] = useState(null);
  const [organiserFollowing, setOrganiserFollowing] = useState(false);
  const [organiserFollowError, setOrganiserFollowError] = useState("");
  const [invite, setInvite] = useState(null);
  const [inviteChecked, setInviteChecked] = useState(!inviteToken);
  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [interested, setInterested] = useState(false);
  const [discover, setDiscover] = useState([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!inviteToken) {
      setInvite(null);
      setInviteChecked(true);
      return;
    }
    let cancelled = false;
    setInviteChecked(false);
    api.invite
      .get(inviteToken)
      .then((data) => {
        if (!cancelled) setInvite(data);
      })
      .catch(() => {
        if (!cancelled) setInvite(null);
      })
      .finally(() => {
        if (!cancelled) setInviteChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [inviteToken]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let data;
        try {
          data = await api.events.get(id);
        } catch {
          data = MOCK_EVENTS.find((e) => e.id === id || e.slug === id) || MOCK_EVENTS[0];
        }
        if (!data || !data.id) {
          data = MOCK_EVENTS.find((e) => e.id === id || e.slug === id) || MOCK_EVENTS[0];
        }
        if (cancelled) return;
        setEvent(data);
        setInterested(getWishlist().includes(data.id));
        const realId = data.id;

        // Default mock guests for preview
        setGuestList({
          count: data.totalSold || 120,
          names: ["Alex Rivera", "Elena Rostova", "Marcus Chen", "Sarah Jenkins"],
        });

        const viewerIsOwner = !!data.organiser?.userId && data.organiser.userId === getUser()?.id;
        if (!viewerIsOwner) {
          try {
            const utmSource = new URLSearchParams(window.location.search).get("utm_source");
            const referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
            const source =
              utmSource ||
              (referrerHost && referrerHost !== window.location.hostname ? referrerHost : "Direct");
            api.events.trackView(realId, source).catch(() => {});
          } catch {}
        }
        if (data.publicGuestList) {
          try {
            const gl = await api.events.publicGuestList(realId);
            if (!cancelled && gl && gl.names?.length) setGuestList(gl);
          } catch {}
        }
        if (data.addressHidden && isAuthenticated()) {
          try {
            const revealed = await api.events.revealAddress(realId);
            if (!cancelled && revealed.address) {
              setEvent((prev) =>
                prev && prev.id === realId ? { ...prev, ...revealed, addressHidden: false } : prev
              );
            }
          } catch {}
        }
        try {
          const wl = await api.waitlist.position(realId);
          if (!cancelled && wl) setWaitlistInfo(wl);
        } catch {}
        if (data.organiser?.id) {
          try {
            const f = await api.organisers.isFollowing(data.organiser.id);
            if (!cancelled && f) setOrganiserFollowing(f.following);
          } catch {}
        }

        const similar = MOCK_EVENTS.filter((e) => e.id !== realId);
        setDiscover([
          { label: "Similar events", events: similar.slice(0, 3) },
          { label: "Upcoming in the same city", events: similar.filter((e) => e.city === data.city).slice(0, 3) },
        ].filter((g) => g.events.length > 0));
      } catch (err) {
        if (cancelled) return;
        if (err?.message === "This event is not live yet") {
          setNotLive(true);
        } else {
          const fallback = MOCK_EVENTS.find((e) => e.id === id || e.slug === id) || MOCK_EVENTS[0];
          setEvent(fallback);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleToggleOrganiserFollow = async () => {
    if (!isAuthenticated()) {
      openAuth("signin");
      return;
    }
    setOrganiserFollowError("");
    try {
      const r = await api.organisers.toggleFollow(event.organiser.id);
      setOrganiserFollowing(r.following);
    } catch (err) {
      const msg = err?.message || "";
      if (/unauthorized|token/i.test(msg)) openAuth("signin");
      else setOrganiserFollowError("Could not update — try again");
    }
  };

  const handleQtyChange = (tierId, delta, max, avail) => {
    setSelectedTiers((prev) => {
      const cur = prev[tierId] ?? 0;
      const next = Math.max(0, Math.min(Math.min(max, avail), cur + delta));
      if (next === 0) {
        const r = { ...prev };
        delete r[tierId];
        return r;
      }
      return { ...prev, [tierId]: next };
    });
  };

  const totalItems = Object.values(selectedTiers).reduce((s, q) => s + q, 0);
  const totalPrice = event
    ? (event.ticketTiers || []).reduce(
        (s, t) => s + (selectedTiers[t.id] ?? 0) * t.price,
        0
      )
    : 0;

  const handleCheckout = () => {
    if (totalItems === 0) return;
    const items = Object.entries(selectedTiers).map(([tierId, quantity]) => ({
      tierId,
      quantity,
    }));
    navigate(`/checkout?eventId=${event.id}&items=${encodeURIComponent(JSON.stringify(items))}`);
  };

  const flash = (msg) => {
    setCopied(msg);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({ title: event?.name, url: window.location.href }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    flash("Link copied");
  };

  const handleInvite = async () => {
    const text = `Join me at ${event?.name} — ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: event?.name, text, url: window.location.href }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(text);
    flash("Invite link copied");
  };

  const handleInterested = () => {
    setInterested(toggleWishlist(event.id));
  };

  const handleAcceptInvite = async () => {
    if (!inviteToken) return;
    if (!isAuthenticated()) {
      navigate(`/invite/${inviteToken}`);
      return;
    }
    setAcceptingInvite(true);
    setInviteError("");
    try {
      await api.invite.respond(inviteToken, "accept");
      navigate(`/invite/${inviteToken}`);
    } catch (err) {
      setInviteError(err.message || "Could not accept — try again");
      setAcceptingInvite(false);
    }
  };

  const scrollToTickets = () =>
    document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (loading || !inviteChecked) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4E7A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notLive) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-4xl">🚧</p>
        <h1 className="font-black text-lg text-[#1B1B23]">This event isn&apos;t live yet</h1>
        <p className="text-sm text-gray-500 max-w-sm">
          The organiser hasn&apos;t published this event. Check back later, or reach out to them
          directly if you were sent this link.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#FF4E7A] text-white font-label font-semibold px-5 py-3.5 rounded-[30px] text-sm mt-2"
        >
          Back to Discover
        </Link>
      </div>
    );
  }

  if (!event) return null;

  const details = eventDetailsOf(event);
  const eventTimeZone = event.timezone || undefined;
  const timeFmtOpts = { hour: "numeric", minute: "2-digit", timeZone: eventTimeZone };
  const date = new Date(event.date);
  const endDateObj = event.endDate ? new Date(event.endDate) : null;
  const shortDate = date.toLocaleDateString("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: eventTimeZone,
  });
  const longDate = date.toLocaleDateString("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: eventTimeZone,
  });
  const startTime = date.toLocaleTimeString("en-IE", timeFmtOpts);
  const isMultiDay =
    !!endDateObj &&
    date.toLocaleDateString("en-CA", { timeZone: eventTimeZone }) !==
      endDateObj.toLocaleDateString("en-CA", { timeZone: eventTimeZone });
  const dateLabel =
    details.dateLabel ??
    (isMultiDay
      ? `${shortDate} – ${endDateObj.toLocaleDateString("en-IE", {
          weekday: "short",
          day: "numeric",
          month: "short",
          timeZone: eventTimeZone,
        })}`
      : `${shortDate}, ${startTime}`);
  const timeLabel =
    endDateObj && !isMultiDay
      ? `${startTime} – ${endDateObj.toLocaleTimeString("en-IE", timeFmtOpts)}`
      : startTime;
  const doorsLabel = details.doors ?? `Starts at ${startTime}`;
  const minTierPrice = event.ticketTiers?.[0]?.price ?? 0;
  const priceLabel = minTierPrice === 0 ? "Free" : `€${minTierPrice} onwards`;
  const isOwner = event.organiser?.userId && event.organiser.userId === getUser()?.id;
  const isPastEvent = new Date(event.endDate ?? event.date) < new Date();
  const isInviteActionable =
    !!invite && invite.status === "PENDING" && !isPastEvent && !event.isCancelled;
  const heroSide = (details.heroImages ?? []).slice(0, 2);
  const galleryFirst = details.gallery?.items?.[0]?.url;
  const sideTop = heroSide[0] ?? event.artist?.image;
  const sideBottom = heroSide[1] ?? galleryFirst;
  const calendarUrl = (() => {
    const fmt = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
    const end = endDateObj ?? new Date(date.getTime() + 3 * 3600_000);
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: event.name,
      dates: `${fmt(date)}/${fmt(end)}`,
      location: [event.venue, event.city].filter(Boolean).join(", "),
      details: typeof window !== "undefined" ? window.location.href : "",
    });
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
  })();
  const perks = details.tickets?.perks ?? {};
  const blurbs = details.tickets?.blurbs ?? {};
  const contactOrganiser = () =>
    document.getElementById("community-hub")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#F5F0EB] pb-32 lg:pb-8 pt-16 sm:pt-20 lg:pt-24">
      <Navbar />

      <div className="max-w-[1120px] mx-auto px-4 lg:px-0 divide-y divide-[#E7DEDA]/60">
        {/* ── Event introduction ───────────────────── */}
        <div className="flex flex-col gap-[26px] pt-6 lg:pt-9 pb-8">
          {event.isPrivate && isOwner && (
            <div className="bg-[#1B1B23] text-white rounded-xl px-4 py-3 flex items-center gap-2 text-sm">
              <span>This event is private. Only people with the link can see it.</span>
            </div>
          )}
          <p className="text-xs leading-relaxed text-[#6E6969]">
            <Link to="/" className="hover:text-[#EF4B7E]">
              Home
            </Link>{" "}
            /{" "}
            <Link to={`/search?category=${event.category}`} className="hover:text-[#EF4B7E]">
              {categoryLabel(event.category)}
            </Link>{" "}
            /{" "}
            <Link
              to={`/search?city=${encodeURIComponent(event.city)}`}
              className="hover:text-[#EF4B7E]"
            >
              {event.city}
            </Link>{" "}
            / {event.name}
          </p>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2.5 max-w-[820px]">
              <h1 className="text-[28px] lg:text-[38px] leading-[1.25] text-[#18181C]">
                {event.name}
              </h1>
              <p className="text-base font-bold text-[#EF4B7E]">{dateLabel}</p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
              <Badge>
                {event.format === "VIRTUAL" ? "ONLINE" : categoryLabel(event.category).toUpperCase()}
              </Badge>
              {event.isSoldOut && <Badge>SOLD OUT</Badge>}
              {event.isSellingFast && !event.isSoldOut && <Badge>SELLING FAST</Badge>}
              {AGE_RESTRICTION_LABELS[event.ageRestriction] && (
                <Badge>{AGE_RESTRICTION_LABELS[event.ageRestriction]}</Badge>
              )}
            </div>
          </div>

          {/* Hero artwork */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative h-[260px] sm:h-[400px] lg:h-[520px] lg:w-[848px] rounded-[30px] overflow-hidden bg-[#1B1B23] flex-shrink-0">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF4E7A]/40 via-[#1B1B23] to-[#00C896]/30" />
              )}
              {FEATURES.blockchain && event.isBlockchain && (
                <div className="absolute top-4 left-4">
                  <BlockchainBadge />
                </div>
              )}
            </div>
            {(sideTop || sideBottom) && (
              <div className="flex lg:flex-col gap-4 flex-1 min-w-0">
                {sideTop && (
                  <div className="relative flex-1 h-[160px] lg:h-[304px] rounded-[20px] overflow-hidden bg-[#EDE8E2]">
                    <img src={sideTop} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                )}
                {sideBottom && (
                  <a
                    href="#gallery"
                    className="relative flex-1 h-[160px] lg:h-[200px] rounded-[20px] overflow-hidden bg-[#EDE8E2] flex items-center justify-center"
                  >
                    <img src={sideBottom} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-black/40" />
                    <span className="relative text-lg text-white">View gallery ↗</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Information and actions */}
          <div className="bg-white rounded-[20px] p-5 lg:p-6 flex flex-col md:flex-row md:items-center gap-5 lg:gap-6">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-xs font-semibold text-[#6E6969]">Location</p>
              <p className="text-[15px] font-bold leading-relaxed text-[#18181C]">
                {eventLocationLine(event)}
              </p>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-xs font-semibold text-[#6E6969]">Doors / event start</p>
              <p className="text-[15px] font-bold leading-relaxed text-[#18181C]">{doorsLabel}</p>
            </div>
            <div className="md:w-[230px] flex flex-col gap-2">
              <p className="text-[22px] leading-[1.25] text-[#18181C]">
                {isPastEvent ? "Event ended" : priceLabel}
              </p>
              {isInviteActionable ? (
                <ActionChip primary onClick={handleAcceptInvite} disabled={acceptingInvite}>
                  {acceptingInvite ? "…" : "Accept invite →"}
                </ActionChip>
              ) : isPastEvent ? (
                <ActionChip disabled>Tickets closed</ActionChip>
              ) : event.isSoldOut ? (
                event.waitlistEnabled ? (
                  <ActionChip primary href={`/waitlist/${event.id}`}>
                    Join waitlist →
                  </ActionChip>
                ) : (
                  <ActionChip disabled>Sold out</ActionChip>
                )
              ) : (
                <ActionChip primary onClick={scrollToTickets}>
                  Book Tickets →
                </ActionChip>
              )}
            </div>
          </div>

          {/* Event tools */}
          <div className="flex flex-wrap gap-3 items-center">
            <ActionChip onClick={handleInterested} icon={Heart} ariaPressed={interested}>
              {interested ? "Interested ✓" : "Interested"}
            </ActionChip>
            <ActionChip onClick={handleShare} icon={Share2}>
              Share event
            </ActionChip>
            <ActionChip onClick={handleInvite} icon={UserPlus}>
              Invite friends
            </ActionChip>
            <ActionChip href={calendarUrl} external icon={CalendarPlus}>
              Add to calendar
            </ActionChip>
            {copied && <span className="text-xs font-semibold text-[#00A889]">{copied}</span>}
          </div>

          {/* About */}
          {(event.description || details.aboutExtra) && (
            <div className="flex flex-col gap-4 pt-3">
              <h2 className="text-[30px] leading-[1.25] text-[#18181C]">About</h2>
              {event.description && (
                <RichTextDisplay
                  html={event.description}
                  className="text-[15px] leading-relaxed text-[#18181C]"
                />
              )}
              {details.aboutExtra && (
                <p className="text-[15px] leading-relaxed text-[#6E6969]">{details.aboutExtra}</p>
              )}
              {event.totalSold > 0 || event.waitlistCount > 0 ? (
                <p className="text-xs text-[#6E6969]">
                  {event.totalSold > 0 && `${event.totalSold.toLocaleString()} going`}
                  {event.totalSold > 0 && event.waitlistCount > 0 && " · "}
                  {event.waitlistCount > 0 &&
                    `${event.waitlistCount.toLocaleString()} on the waitlist`}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <LineupSection event={event} details={details} />
        <ScheduleSection details={details} calendarUrl={calendarUrl} />
        <StagesSection details={details} />
        <HighlightsSection details={details} />
        <VenueSection
          event={event}
          details={details}
          dateLabel={details.dateLabel ?? longDate}
          timeLabel={
            details.doors
              ? `${details.doors}${timeLabel !== startTime ? ` · ${timeLabel}` : ""}`
              : timeLabel
          }
          onContact={contactOrganiser}
        />

        {/* ── 06 Tickets ── */}
        <Section id="tickets">
          <SectionHeading eyebrow="Tickets" title="Choose your ticket" />
          {details.tickets?.notice && <Notice>{details.tickets.notice}</Notice>}
          {isInviteActionable ? (
            <div className="max-w-md">
              <AcceptInviteCard
                organiserName={invite.organiserName}
                responding={acceptingInvite}
                error={inviteError}
                onAccept={handleAcceptInvite}
                token={inviteToken}
              />
            </div>
          ) : isPastEvent ? (
            <div className={`${CARD} text-center`}>
              <p className="font-bold text-[#18181C]">This event has ended</p>
              <p className="text-sm text-[#6E6969]">Tickets are no longer available.</p>
            </div>
          ) : event.isSoldOut ? (
            <div className="bg-[#1B1B23] rounded-[20px] p-6 text-center flex flex-col items-center gap-3">
              <p className="text-gray-300 font-bold text-lg">Sold Out</p>
              <p className="text-sm text-gray-400">
                {event.waitlistCount > 0
                  ? `${event.waitlistCount} on the waitlist`
                  : "Be the first on the waitlist"}
              </p>
              {event.waitlistEnabled && (
                <ActionChip primary href={`/waitlist/${event.id}`}>
                  Join waitlist
                </ActionChip>
              )}
              {FEATURES.resale && (
                <ActionChip href={`/resale/${event.id}`}>Browse resale tickets</ActionChip>
              )}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(event.ticketTiers || []).map((tier, idx) => {
                  const avail = tier.quantity - tier.sold;
                  const qty = selectedTiers[tier.id] ?? 0;
                  const soldOut = avail <= 0;
                  const effectiveMax = event.allowGroupRegistration ? tier.maxPerOrder : 1;
                  const tierPerks = perks[tier.name] ?? [];
                  return (
                    <div
                      key={tier.id}
                      className={`${CARD} flex flex-col gap-4 ${
                        qty > 0 ? "ring-1 ring-[#EF4B7E]" : ""
                      } ${soldOut ? "opacity-60" : ""}`}
                    >
                      <Badge>
                        {idx === 0
                          ? minTierPrice === 0
                            ? "FREE ENTRY"
                            : "PUBLISHED STARTING PRICE"
                          : soldOut
                          ? "SOLD OUT"
                          : "TICKET CATEGORY"}
                      </Badge>
                      <p className="text-[22px] leading-[1.25] text-[#18181C] capitalize">
                        {tier.name}
                        {FEATURES.blockchain && tier.isBlockchain && (
                          <span className="text-[#00C896] text-sm ml-2">⛓</span>
                        )}
                      </p>
                      <p className="text-[28px] leading-[1.25] text-[#18181C]">
                        {tier.price === 0 ? "Free" : `€${tier.price}`}
                      </p>
                      {(blurbs[tier.name] || tier.description) && (
                        <p className="text-[13px] leading-relaxed text-[#6E6969]">
                          {blurbs[tier.name] ?? tier.description}
                        </p>
                      )}
                      {tierPerks.length > 0 && (
                        <ul className="flex flex-col gap-2.5 text-[13px] text-[#18181C]">
                          {tierPerks.map((p) => (
                            <li key={p}>✓ {p}</li>
                          ))}
                        </ul>
                      )}
                      <p className="text-xs text-[#6E6969]">
                        {soldOut
                          ? "Availability: Sold out"
                          : avail >= 999999
                          ? `Max ${effectiveMax} per order`
                          : `Availability: ${avail.toLocaleString()} left · max ${effectiveMax} per order`}
                      </p>
                      <div className="mt-auto">
                        {soldOut ? (
                          <ActionChip disabled>Sold out</ActionChip>
                        ) : qty === 0 ? (
                          <ActionChip
                            primary
                            onClick={() => handleQtyChange(tier.id, 1, effectiveMax, avail)}
                          >
                            Add ticket →
                          </ActionChip>
                        ) : (
                          <div className="inline-flex items-center gap-4 bg-[#EF4B7E] text-white rounded-xl px-4 py-2.5">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(tier.id, -1, effectiveMax, avail)}
                              aria-label={`Remove one ${tier.name}`}
                              className="w-6 h-6 rounded-full border-[1.5px] border-white flex items-center justify-center text-sm leading-none"
                            >
                              −
                            </button>
                            <span className="text-sm font-bold min-w-[1ch] text-center">{qty}</span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(tier.id, 1, effectiveMax, avail)}
                              disabled={qty >= effectiveMax || qty >= avail}
                              aria-label={`Add one ${tier.name}`}
                              className="w-6 h-6 rounded-full border-[1.5px] border-white flex items-center justify-center text-sm leading-none disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order summary */}
              <div className={`${CARD} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div>
                  <p className="text-[22px] leading-[1.25] text-[#18181C]">
                    {totalItems > 0
                      ? totalPrice === 0
                        ? "Free"
                        : `€${totalPrice.toFixed(2)}`
                      : priceLabel}
                  </p>
                  <p className="text-sm text-[#6E6969]">
                    {totalItems > 0
                      ? `${totalItems} ticket${totalItems > 1 ? "s" : ""} selected`
                      : "Select a ticket above"}
                    {waitlistInfo?.onWaitlist &&
                      ` · You're #${waitlistInfo.position} on the waitlist`}
                  </p>
                  <p className="text-xs text-[#6E6969] pt-1">
                    {FEATURES.blockchain && event.isBlockchain
                      ? "NFT tickets · on-chain verified"
                      : "Secure checkout"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {FEATURES.resale && (
                    <ActionChip href={`/resale/${event.id}`}>Resale tickets</ActionChip>
                  )}
                  <ActionChip primary onClick={handleCheckout} disabled={totalItems === 0}>
                    Checkout →
                  </ActionChip>
                </div>
              </div>

              {details.tickets?.comparison && (
                <div className={`${CARD} flex flex-col gap-4 overflow-x-auto`}>
                  <p className="text-xl leading-[1.25] text-[#18181C]">Compare benefits</p>
                  <table className="w-full min-w-[560px] text-[13px]">
                    <thead>
                      <tr className="border-b border-[#E7DEDA] text-[11px] font-bold uppercase text-[#18181C]">
                        <th className="text-left py-2.5 pr-4 font-bold">Benefit</th>
                        {details.tickets.comparison.columns.map((c) => (
                          <th key={c} className="text-left py-2.5 pr-4 font-bold">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {details.tickets.comparison.rows.map((r) => (
                        <tr key={r.benefit} className="border-b border-[#E7DEDA]">
                          <td className="py-2.5 pr-4 font-bold text-[#18181C]">{r.benefit}</td>
                          {r.values.map((v, i) => (
                            <td key={i} className="py-2.5 pr-4 text-[#18181C]">
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {(() => {
                const dealNote =
                  details.tickets?.earlyBird ??
                  (event.hasCoupons ? "Promo codes are accepted at checkout." : null);
                const groupNote =
                  details.tickets?.groupBooking ??
                  (event.allowGroupRegistration
                    ? `Up to ${Math.max(
                        ...event.ticketTiers.map((t) => t.maxPerOrder ?? 1)
                      )} tickets per order, with a named guest for each.`
                    : null);
                const knowLines = details.tickets?.knowBefore ?? [
                  `Entry: ${doorsLabel}${event.timedEntryEnabled ? " · timed entry slots apply" : ""}.`,
                  ...(event.refundPolicyText ? [`Refund policy: ${event.refundPolicyText}`] : []),
                  event.requireApproval
                    ? "Registrations are reviewed by the organiser before tickets are issued."
                    : "Tickets are issued instantly after checkout.",
                ];
                const showGroup = !!(dealNote || groupNote);
                return (
                  <div className={`grid gap-5 ${showGroup ? "md:grid-cols-2" : ""}`}>
                    {showGroup && (
                      <div className={`${CARD} flex flex-col gap-4`}>
                        <p className="text-lg leading-[1.25] text-[#18181C]">Going in a group?</p>
                        {dealNote && (
                          <p className="text-[13px] leading-relaxed text-[#18181C]">{dealNote}</p>
                        )}
                        {groupNote && (
                          <p className="text-[13px] leading-relaxed text-[#18181C]">{groupNote}</p>
                        )}
                        {groupNote && (
                          <div>
                            <ActionChip onClick={contactOrganiser}>Contact organiser</ActionChip>
                          </div>
                        )}
                      </div>
                    )}
                    <div className={`${CARD} flex flex-col gap-4`}>
                      <p className="text-lg leading-[1.25] text-[#18181C]">Before you book</p>
                      {knowLines.map((line, i) => (
                        <p key={i} className="text-[13px] leading-relaxed text-[#18181C]">
                          {line}
                        </p>
                      ))}
                      {event.refundPolicyUrl && (
                        <a
                          href={event.refundPolicyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] font-bold text-[#EF4B7E]"
                        >
                          Read the full refund policy →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </Section>

        <GallerySection details={details} />
        <CommunitySection
          event={event}
          details={details}
          guestNames={guestList?.names ?? []}
          onShare={handleShare}
          onInvite={handleInvite}
        />

        <SocialHubSection eventId={event.id} isOrganiser={!!isOwner} />

        <FaqSection event={event} details={details} />
        <OrganiserSection
          event={event}
          following={organiserFollowing}
          onFollow={handleToggleOrganiserFollow}
          followError={organiserFollowError}
        />
        <DiscoverSection groups={discover} />
      </div>

      {/* ── Sticky mobile buy bar ──────────────────────────────── */}
      <div className="fixed bottom-16 left-0 right-0 bg-white shadow-[0_0_16px_rgba(17,17,26,0.1)] px-4 py-3 z-40 lg:hidden">
        {isInviteActionable ? (
          <div className="flex items-center justify-between max-w-lg mx-auto gap-3">
            <div className="min-w-0">
              <p className="text-[10px] text-[#FF4E7A] font-bold uppercase tracking-wide">
                You&apos;re invited
              </p>
              <p className="font-black text-sm text-[#1B1B23] truncate">{event.name}</p>
            </div>
            {inviteError && (
              <p className="text-red-500 text-[10px] flex-shrink-0 max-w-[100px]">{inviteError}</p>
            )}
            <button
              onClick={handleAcceptInvite}
              disabled={acceptingInvite}
              className="flex-shrink-0 bg-[#FF4E7A] hover:bg-[#D4537E] disabled:opacity-60 text-white font-label font-semibold px-5 py-3.5 rounded-[30px] transition-colors text-sm"
            >
              {acceptingInvite ? "…" : "Accept Invite"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div>
              <p className="font-bold text-2xl leading-[1.3] text-black">
                {totalItems > 0
                  ? totalPrice === 0
                    ? "Free"
                    : `€${totalPrice.toFixed(2)}`
                  : minTierPrice === 0
                  ? "Free"
                  : `€${minTierPrice}`}
              </p>
              <p className="text-sm font-medium text-black">
                {totalItems > 0
                  ? `${totalItems} Ticket${totalItems > 1 ? "s" : ""}`
                  : minTierPrice === 0
                  ? ""
                  : "onwards"}
              </p>
            </div>
            {isPastEvent ? (
              <span className="bg-gray-100 text-gray-400 font-label font-semibold px-5 py-3.5 rounded-[30px] text-sm">
                Event Ended
              </span>
            ) : event.isSoldOut ? (
              event.waitlistEnabled ? (
                <Link
                  to={`/waitlist/${event.id}`}
                  className="bg-[#FF4E7A] hover:bg-[#D4537E] text-white font-label font-semibold px-5 py-3.5 rounded-[30px] transition-colors text-sm"
                >
                  Join Waitlist
                </Link>
              ) : FEATURES.resale ? (
                <Link
                  to={`/resale/${event.id}`}
                  className="bg-[#FF4E7A] hover:bg-[#D4537E] text-white font-label font-semibold px-5 py-3.5 rounded-[30px] transition-colors text-sm"
                >
                  Browse Resale
                </Link>
              ) : (
                <span className="bg-gray-100 text-gray-400 font-label font-semibold px-5 py-3.5 rounded-[30px] text-sm">
                  Sold Out
                </span>
              )
            ) : (
              <button
                onClick={totalItems > 0 ? handleCheckout : scrollToTickets}
                className="bg-[#FF4E7A] hover:bg-[#D4537E] text-white font-label font-semibold px-5 py-3.5 rounded-[30px] transition-colors text-sm"
              >
                {totalItems > 0
                  ? totalPrice === 0
                    ? "Checkout · Free"
                    : `Checkout · €${totalPrice.toFixed(2)}`
                  : "Get Tickets"}
              </button>
            )}
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}

export function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FF4E7A] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EventDetailPageInner />
    </Suspense>
  );
}

export default EventDetailPage;

