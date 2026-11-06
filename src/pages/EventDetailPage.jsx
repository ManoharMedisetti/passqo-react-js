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
import { CalendarPlus, Heart, Share2, UserPlus, MapPin, Calendar, Clock, ChevronRight, ChevronDown, ChevronUp, Check, Sparkles, ShieldCheck, X, HelpCircle, FileText, ExternalLink, Navigation } from "lucide-react";
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
import { EventFeatureTabs } from "@/components/events/features/EventFeatureTabs";

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

function UberLogo({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 17.5c-4.14 0-7.5-3.36-7.5-7.5S7.86 4.5 12 4.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5zm-2.5-4h5c.83 0 1.5-.67 1.5-1.5V8h-2.5v5h-3V8H7v6c0 .83.67 1.5 1.5 1.5z" />
    </svg>
  );
}

function BoltLogo({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.2 2.2a1 1 0 00-1.6.4l-7 11a1 1 0 00.8 1.4h4.7l-1.3 6.8a1 1 0 001.7.8l9-12a1 1 0 00-.8-1.6h-5l.5-6.8z" />
    </svg>
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
      .catch(() => { })
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
            className={`text-sm font-semibold px-4 py-2.5 border-b-2 transition-colors ${tab === t
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
  const [showAllAbout, setShowAllAbout] = useState(false);
  const [showAllThingsToKnow, setShowAllThingsToKnow] = useState(false);
  const [showFaqs, setShowFaqs] = useState(false);
  const [showTicketDrawer, setShowTicketDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");
  const [showMoreBio, setShowMoreBio] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'schedule' | 'faqs' | 'terms'
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [openTermsIndex, setOpenTermsIndex] = useState(null);
  const [isScheduleDayOpen, setIsScheduleDayOpen] = useState(true);

  useEffect(() => {
    if (!activeModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeModal]);

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
            api.events.trackView(realId, source).catch(() => { });
          } catch { }
        }
        if (data.publicGuestList) {
          try {
            const gl = await api.events.publicGuestList(realId);
            if (!cancelled && gl && gl.names?.length) setGuestList(gl);
          } catch { }
        }
        if (data.addressHidden && isAuthenticated()) {
          try {
            const revealed = await api.events.revealAddress(realId);
            if (!cancelled && revealed.address) {
              setEvent((prev) =>
                prev && prev.id === realId ? { ...prev, ...revealed, addressHidden: false } : prev
              );
            }
          } catch { }
        }
        try {
          const wl = await api.waitlist.position(realId);
          if (!cancelled && wl) setWaitlistInfo(wl);
        } catch { }
        if (data.organiser?.id) {
          try {
            const f = await api.organisers.isFollowing(data.organiser.id);
            if (!cancelled && f) setOrganiserFollowing(f.following);
          } catch { }
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
      navigator.share({ title: event?.name, url: window.location.href }).catch(() => { });
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    flash("Link copied");
  };

  const handleInvite = async () => {
    const text = `Join me at ${event?.name} — ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: event?.name, text, url: window.location.href }).catch(() => { });
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

  const defaultFaqs = [
    {
      q: "Is there an age restriction for the event?",
      a: event.ageRestriction === "EIGHTEEN_PLUS"
        ? "Yes, entry is strictly restricted to attendees aged 18 and above. A valid government photo ID is mandatory at the gate."
        : "Entry is open for all ages. Children aged 4 and above require a separate ticket for entry.",
    },
    {
      q: "Is parking available?",
      a: "Venue parking is limited and available on a first-come, first-served basis. We strongly recommend taking public transit or carpooling.",
    },
    {
      q: "Can I get a refund if I can't attend the event?",
      a: "Tickets are non-refundable. However, you can transfer or resell your ticket securely through the verified Passqo Resale Marketplace.",
    },
    {
      q: "Is there a designated smoking area?",
      a: "Smoking and vaping are strictly prohibited inside the main performance zones. Designated outdoor smoking areas are available near the exit concourse.",
    },
    {
      q: "Are group bookings available?",
      a: "Yes! Group bookings of 5 or more attendees are eligible for exclusive discounts. Select the group tier or reach out to support for corporate inquiries.",
    },
    ...(details.faqs || []).filter(
      (f) =>
        ![
          "Is there an age restriction for the event?",
          "Is there parking available?",
          "Can I get a refund if I can't attend the event?",
          "Is there a designated smoking area?",
          "Are group bookings available?",
        ].includes(f.q)
    ),
  ];

  const defaultTerms = [
    {
      title: "1. Age & Identification",
      desc: "All attendees must present a valid physical government-issued photo ID (Aadhaar, Passport, Driving License, or Voter ID). Digital photos, photocopies, or student IDs will not be accepted at entry.",
    },
    {
      title: "2. Ticket Validity & Transfer",
      desc: "Each ticket grants one-time entry for a single individual. Tickets purchased through unauthorized third-party platforms are invalid. Official resales must occur exclusively through Passqo.",
    },
    {
      title: "3. Cancellation & Refunds",
      desc: "All ticket sales are final and non-refundable. If the event is officially cancelled by the organizers, refunds will be processed automatically to the original payment source within 7-10 working days.",
    },
    {
      title: "4. Security & Prohibited Items",
      desc: "Mandatory security frisking and bag checks will take place at all entry gates. Strictly prohibited: outside food, alcohol, glassware, knives, weapons, illicit substances, lasers, and professional cameras with detachable lenses.",
    },
    {
      title: "5. Right of Admission & Code of Conduct",
      desc: "Organizers and venue security reserve the absolute right of admission. Any attendee engaging in disorderly, unruly, abusive, or dangerous behavior will be immediately evicted without refund.",
    },
    {
      title: "6. Photography & Recording Consent",
      desc: "By attending the event, attendees grant the organizers irrevocable consent to photograph, film, and record their image and voice for marketing, television broadcasts, and promotional materials worldwide.",
    },
  ];

  const timelineItems =
    details.schedule && details.schedule.length > 0
      ? details.schedule.map((s) => ({
        title: s.title || s.label || s.name,
        time: s.time || s.startTime || "TBD",
      }))
      : [
        {
          title: "Gates open",
          time: doorsLabel.includes("at") ? doorsLabel.split("at")[1].trim() : "4:30 PM",
        },
        { title: "Event starts", time: startTime || "6:00 PM" },
        {
          title: "Event ends",
          time: endDateObj ? endDateObj.toLocaleTimeString("en-IE", timeFmtOpts) : "10:00 PM",
        },
      ];

  const fullAddress = [event.venue, event.address, event.city].filter(Boolean).join(", ") || "Event Location";
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(fullAddress)}`;
  const boltUrl = `https://bolt.onelink.me/iaKi/?af_dp=bolt%3A%2F%2Fdestination%3Faddress%3D${encodeURIComponent(fullAddress)}&af_web_dp=https%3A%2F%2Fbolt.eu`;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="min-h-screen bg-[#F8F5F0] pb-24 lg:pb-16 pt-16 sm:pt-20">
      <Navbar />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 space-y-3.5 sm:space-y-4">
        {/* ── Private Notice (if applicable) ── */}
        {event.isPrivate && isOwner && (
          <div className="bg-[#1B1B23] text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs sm:text-sm shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>This event is private. Only people with the link can see it.</span>
          </div>
        )}

        {/* ── TOP EVENT TITLE & DATE (Matching District Screenshot - NO breadcrumb line) ── */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-semibold text-[#FF4E7A] tracking-wide">
            {dateLabel}
          </p>
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-medium text-[#18181C] tracking-tight leading-tight">
              {event.name}
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
              <Badge>
                {event.format === "VIRTUAL" ? "ONLINE" : categoryLabel(event.category).toUpperCase()}
              </Badge>
              {event.isSoldOut && <Badge>SOLD OUT</Badge>}
            </div>
          </div>
        </div>

        {/* ── HERO ARTWORK SECTION: MAIN BANNER + MEDIA BESIDE (MATCHING IMAGE 1) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
          {/* Main Artwork Banner */}
          <div className="lg:col-span-8 relative min-h-[260px] sm:h-[340px] lg:h-[400px] xl:h-[430px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#121218] shadow-sm group">
            {/* Ambient Blurred Background Glow */}
            {event.image ? (
              <img
                src={event.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-40 scale-125 select-none pointer-events-none"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-pink-900/40 via-purple-900/30 to-black/60 filter blur-xl opacity-50" />
            )}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            {/* Centered Crisp Event Poster Artwork */}
            <img
              src={event.image || "/images/figma-sample/goa/goa-hero.png"}
              alt={event.name}
              className="relative w-full h-full object-contain sm:object-cover mx-auto"
            />

            {/* Quick Action Pills Overlaid on Top Right of Image */}
            <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 flex items-center gap-1.5 sm:gap-2 z-10">
              <button
                type="button"
                onClick={handleInterested}
                className={`
                  text-xs font-semibold py-1.5 px-3 rounded-full border transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer shadow-sm active:scale-95
                  ${interested
                    ? "bg-[#FF4E7A] border-[#FF4E7A] text-white"
                    : "bg-black/50 hover:bg-black/70 border-white/20 text-white"
                  }
                `}
              >
                <Heart className={`w-3.5 h-3.5 ${interested ? "fill-white text-white" : "text-white"}`} />
                <span className="hidden sm:inline">Interested</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="bg-black/50 hover:bg-black/70 border border-white/20 text-white text-xs font-semibold py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm cursor-pointer active:scale-95"
                title="Share event"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                type="button"
                onClick={handleInvite}
                className="bg-black/50 hover:bg-black/70 border border-white/20 text-white text-xs font-semibold py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm cursor-pointer active:scale-95"
                title="Invite friends"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Invite</span>
              </button>

              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/50 hover:bg-black/70 border border-white/20 text-white text-xs font-semibold py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm cursor-pointer active:scale-95"
                title="Add to calendar"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Calendar</span>
              </a>

              {copied && (
                <span className="text-[11px] font-semibold text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-sm animate-fade-in">
                  {copied}
                </span>
              )}
            </div>

            {/* Badges Overlaid on Bottom Left of Image */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
              <span className="text-[10px] sm:text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                {categoryLabel(event.category).toUpperCase()}
              </span>
              {FEATURES.blockchain && event.isBlockchain && (
                <span className="text-[10px] font-semibold text-[#00C896] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15">
                  ⛓ On-Chain
                </span>
              )}
              {event.isSellingFast && !event.isSoldOut && (
                <span className="text-[10px] sm:text-[11px] font-semibold text-white bg-[#FF4E7A] px-2.5 py-0.5 rounded-full shadow-2xs">
                  SELLING FAST
                </span>
              )}
            </div>
          </div>

          {/* Right Side Media Cards (Desktop >= lg, matching Image 1) */}
          <div className="hidden lg:flex lg:col-span-4 lg:h-[400px] xl:h-[430px] flex-col gap-3.5">
            <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden bg-neutral-200 shadow-2xs group">
              <img
                src={sideTop || "/images/figma-sample/goa/headliner.png"}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <a
              href="#gallery"
              className="relative flex-1 min-h-0 rounded-2xl overflow-hidden bg-neutral-900 shadow-2xs flex items-center justify-center group"
            >
              <img
                src={sideBottom || "/images/figma-sample/goa/gallery-1.png"}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-45 transition-opacity duration-300 group-hover:scale-105"
              />
              <span className="relative text-white font-semibold text-base flex items-center gap-1.5 z-10 drop-shadow-md">
                <span>View gallery</span>
                <span className="text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
              </span>
            </a>
          </div>
        </div>

        {/* ── TWO-COLUMN FIRST-FOLD LAYOUT (VISIBLE ON LOAD WITHOUT SCROLLING) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start pt-1 sm:pt-2">

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: ABOUT, DETAILS, AND SECTIONS                       */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-7">

            {/* 1. ABOUT SECTION (Matching District Screenshot) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B1B23] tracking-tight">About</h2>
              <div className={`text-xs sm:text-sm text-[#4A4A58] leading-relaxed ${showAllAbout ? "" : "line-clamp-3 sm:line-clamp-4"}`}>
                {event.description ? (
                  <RichTextDisplay html={event.description} />
                ) : (
                  <p>Join us for an unforgettable experience featuring world-class talent, vibrant community energy, and memories that last a lifetime.</p>
                )}
                {details.aboutExtra && <p className="mt-1.5 text-[#6E6969]">{details.aboutExtra}</p>}
              </div>
              <button
                type="button"
                onClick={() => setShowAllAbout((prev) => !prev)}
                className="text-xs font-bold text-[#FF4E7A] hover:underline inline-flex items-center gap-1 cursor-pointer pt-0.5"
              >
                <span>{showAllAbout ? "Read less" : "Read more"}</span>
                <span className="text-[10px]">{showAllAbout ? "▲" : "▼"}</span>
              </button>
            </div>

            {/* 2. DYNAMIC HORIZONTAL NAVBAR WITH CATEGORY FEATURE TABS */}
            <EventFeatureTabs event={event} details={details} />

            {/* 3. ORGANIZED BY SECTION (Matching District Screenshot) */}
            <div className="space-y-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B1B23] tracking-tight">Organized by</h2>
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/6 shadow-2xs flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1B1B23] flex items-center justify-center text-white flex-shrink-0 shadow-sm p-1 overflow-hidden">
                  {event.organiser?.image && event.organiser.image !== "/icons/organiser.svg" ? (
                    <img src={event.organiser.image} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="font-black text-xs text-center leading-tight tracking-wider text-white">
                      {(event.organiser?.businessName || "HOST").slice(0, 10).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-[#1B1B23] truncate">
                      {event.organiser?.businessName || "SHOWKRAFT STUDIOS LLP"}
                    </h3>
                    {event.organiser?.verified && (
                      <span className="w-4 h-4 rounded-full bg-[#00C896] text-white flex items-center justify-center text-[10px] flex-shrink-0" title="Verified">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#8C8C9E] font-medium mt-1">
                    <span>{event.totalSold ? `${event.totalSold}+ attendees` : "3 events"}</span>
                    <span>•</span>
                    <span>1+ year hosting</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. MORE / FAQS & TERMS SECTION (Matching District Screenshot) */}
            <div className="space-y-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B1B23] tracking-tight">More</h2>
              <div className="bg-white rounded-2xl border border-black/6 shadow-2xs divide-y divide-black/6 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setOpenFaqIndex(null);
                    setActiveModal("faqs");
                  }}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#8C8C9E] group-hover:text-[#1B1B23] transition-colors" />
                    <span className="font-bold text-xs sm:text-sm text-[#1B1B23]">
                      Frequently asked questions
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-[#1B1B23] transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpenTermsIndex(null);
                    setActiveModal("terms");
                  }}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#8C8C9E] group-hover:text-[#1B1B23] transition-colors" />
                    <span className="font-bold text-xs sm:text-sm text-[#1B1B23]">
                      Terms and Conditions
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-[#1B1B23] transition-all" />
                </button>
              </div>
            </div>

            {/* Community Social Hub */}
            <SocialHubSection eventId={event.id} isOrganiser={!!isOwner} />


          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: STICKY BOOK TICKETS & LOCATION CARDS              */}
          {/* (VISIBLE DIRECTLY ON LOAD IN FIRST FOLD WITHOUT SCROLLING)       */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 self-start space-y-3 z-20">

            {/* 1. BOOK TICKETS CARD (Matching District Screenshot: Price onwards & Direct Book tickets button) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/8 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold text-xl sm:text-2xl text-[#1B1B23] tracking-tight">
                    {minTierPrice === 0 ? "Free" : `€${minTierPrice}`}
                    <span className="text-xs font-semibold text-[#8C8C9E] ml-1.5 tracking-normal">
                      onwards
                    </span>
                  </p>
                  {event.isSellingFast && !event.isSoldOut && (
                    <span className="text-[11px] font-bold text-[#FF4E7A] flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E7A] animate-pulse" />
                      Selling fast
                    </span>
                  )}
                </div>

                {isPastEvent ? (
                  <span className="bg-neutral-100 text-neutral-400 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm">
                    Event ended
                  </span>
                ) : event.isSoldOut ? (
                  event.waitlistEnabled ? (
                    <Link
                      to={`/waitlist/${event.id}`}
                      className="bg-[#1B1B23] hover:bg-[#2D2D3A] text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-98"
                    >
                      Join waitlist
                    </Link>
                  ) : (
                    <span className="bg-neutral-100 text-neutral-400 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm">
                      Sold out
                    </span>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/events/${event.id}/book`)}
                    className="bg-[#1B1B23] hover:bg-[#2D2D3A] text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer"
                  >
                    Book tickets
                  </button>
                )}
              </div>
            </div>

            {/* 2. MERGED LOCATION & TAXIS CARD */}
            <div className="bg-white rounded-2xl border border-black/8 shadow-2xs overflow-hidden">
              {/* Clickable Location Row */}
              <div
                onClick={() => setActiveModal("location")}
                className="p-3.5 sm:p-4 hover:bg-neutral-50/80 transition-colors flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-[#1B1B23] group-hover:bg-pink-50 group-hover:text-[#FF4E7A] transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-[#1B1B23] truncate group-hover:text-[#FF4E7A] transition-colors">
                    {event.venue || event.city}
                  </p>
                  <p className="text-[11px] text-[#8C8C9E] font-medium truncate">
                    {event.address ? event.address : `${event.city || "Venue"} · 5.6 km away`}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-[#FF4E7A] transition-all flex-shrink-0" />
              </div>

              {/* Taxis / Ride-hailing Section (Merged seamlessly inside) */}
              <div className="border-t border-black/6 bg-neutral-50/40 p-3.5 sm:p-4 space-y-2.5">
                <p className="text-[11px] sm:text-xs text-[#555] leading-relaxed">
                  Taxis and ride-hailing drop-off at the main entrance. Pre-book your return journey to avoid surge pricing.
                </p>
                <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                  <a
                    href={uberUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs cursor-pointer px-4"
                  >
                    <UberLogo className="w-3.5 h-3.5" />
                    <span>Uber</span>
                  </a>
                  <a
                    href={boltUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 rounded-full bg-[#34D186] hover:bg-[#2ebd78] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-xs cursor-pointer px-4"
                  >
                    <BoltLogo className="w-3.5 h-3.5" />
                    <span>Bolt</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 3. TIME / SCHEDULE PILL CARD (Matching District Screenshot: Gates open at 4:30 PM / View full schedule & timeline >) */}
            <div
              onClick={() => setActiveModal("schedule")}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border border-black/8 shadow-2xs hover:shadow-xs hover:border-black/20 transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-[#1B1B23] group-hover:bg-neutral-200 transition-colors">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs sm:text-sm text-[#1B1B23] truncate">
                  {doorsLabel || "Starts at 6:00 PM"}
                </p>
                <p className="text-[11px] text-[#8C8C9E] font-medium truncate">
                  View full schedule & timeline
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-[#1B1B23] transition-all flex-shrink-0" />
            </div>

          </div>
        </div>
      </div>

      {/* ── STICKY MOBILE BUY BAR (Fixed at bottom on mobile screens) ── */}
      <div className="fixed bottom-16 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/8 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 z-40 lg:hidden">
        <div className="flex items-center justify-between max-w-lg mx-auto gap-3">
          <div>
            <p className="font-extrabold text-xl leading-tight text-[#1B1B23]">
              {totalItems > 0
                ? totalPrice === 0
                  ? "Free"
                  : `€${totalPrice.toFixed(2)}`
                : minTierPrice === 0
                  ? "Free"
                  : `€${minTierPrice}`}
            </p>
            <p className="text-xs font-medium text-[#8C8C9E]">
              {totalItems > 0
                ? `${totalItems} Ticket${totalItems > 1 ? "s" : ""} selected`
                : minTierPrice === 0
                  ? ""
                  : "onwards"}
            </p>
          </div>

          {isPastEvent ? (
            <span className="bg-neutral-100 text-neutral-400 font-bold px-5 py-3 rounded-xl text-xs">
              Event Ended
            </span>
          ) : event.isSoldOut ? (
            event.waitlistEnabled ? (
              <Link
                to={`/waitlist/${event.id}`}
                className="bg-[#1B1B23] hover:bg-[#2D2D3A] text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors shadow-sm"
              >
                Join Waitlist
              </Link>
            ) : (
              <span className="bg-neutral-100 text-neutral-400 font-bold px-5 py-3 rounded-xl text-xs">
                Sold Out
              </span>
            )
          ) : (
            <button
              type="button"
              onClick={() => navigate(`/events/${event.id}/book`)}
              className="bg-[#1B1B23] hover:bg-[#2D2D3A] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm text-xs active:scale-98 cursor-pointer"
            >
              Book tickets
            </button>
          )}
        </div>
      </div>

      {/* ── MODAL POPUPS (Schedule, FAQs, Terms) Matching District Screenshots ── */}
      {activeModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[88vh] flex flex-col border border-black/5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/6 flex-shrink-0">
              <h3 className="font-extrabold text-lg sm:text-xl text-[#1B1B23]">
                {activeModal === "schedule" && "Schedule and timeline"}
                {activeModal === "faqs" && "Frequently asked questions"}
                {activeModal === "terms" && "Terms and Conditions"}
                {activeModal === "location" && "Venue & Directions"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#1B1B23] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto pt-4 space-y-4 pr-1 text-[#1B1B23]">
              {/* SCHEDULE MODAL (Matching District Image 1) */}
              {activeModal === "schedule" && (
                <div className="space-y-4">
                  {/* Calendar Date Subheader */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#1B1B23]">
                    <Calendar className="w-4 h-4 text-[#8C8C9E]" />
                    <span>{longDate}</span>
                  </div>

                  {/* Day Accordion Item */}
                  <div className="border border-black/6 rounded-2xl p-4 bg-neutral-50/50">
                    <button
                      type="button"
                      onClick={() => setIsScheduleDayOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between text-left cursor-pointer group"
                    >
                      <span className="font-bold text-sm text-[#1B1B23]">
                        {shortDate} - {doorsLabel.includes("at") ? doorsLabel.split("at")[1].trim() : startTime}
                      </span>
                      <ChevronUp
                        className={`w-4 h-4 text-neutral-400 group-hover:text-[#1B1B23] transition-transform duration-200 ${isScheduleDayOpen ? "" : "rotate-180"
                          }`}
                      />
                    </button>

                    {isScheduleDayOpen && (
                      <div className="relative pl-7 space-y-6 pt-5 pb-2">
                        {/* Vertical line connecting nodes */}
                        <div className="absolute left-[7px] top-6 bottom-5 w-0.5 bg-neutral-200" />

                        {timelineItems.map((item, idx) => (
                          <div key={idx} className="relative flex items-center justify-between text-xs sm:text-sm">
                            {/* Hollow bullet circle matching screenshot */}
                            <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-neutral-300 bg-white" />
                            <span className="font-medium text-[#1B1B23]">{item.title}</span>
                            <span className="font-bold text-[#1B1B23] tabular-nums">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FAQS MODAL (Matching District Image 2) */}
              {activeModal === "faqs" && (
                <div className="divide-y divide-black/6">
                  {defaultFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="py-3.5 sm:py-4 first:pt-0 last:pb-0">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                        >
                          <span className="font-semibold text-xs sm:text-sm text-[#1B1B23] group-hover:text-[#FF4E7A] transition-colors">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-neutral-400 group-hover:text-[#1B1B23] transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                        {isOpen && (
                          <p className="mt-2.5 text-xs sm:text-sm text-[#6E6969] leading-relaxed">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TERMS AND CONDITIONS MODAL */}
              {activeModal === "terms" && (
                <div className="divide-y divide-black/6">
                  {defaultTerms.map((term, idx) => {
                    const isOpen = openTermsIndex === idx;
                    return (
                      <div key={idx} className="py-3.5 sm:py-4 first:pt-0 last:pb-0">
                        <button
                          type="button"
                          onClick={() => setOpenTermsIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                        >
                          <span className="font-semibold text-xs sm:text-sm text-[#1B1B23] group-hover:text-[#FF4E7A] transition-colors">
                            {term.title}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-neutral-400 group-hover:text-[#1B1B23] transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                        {isOpen && (
                          <p className="mt-2.5 text-xs sm:text-sm text-[#6E6969] leading-relaxed">
                            {term.desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* LOCATION & GETTING THERE MODAL */}
              {activeModal === "location" && (
                <div className="space-y-4">
                  {/* Venue Card */}
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-black/6 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-50 text-[#FF4E7A] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base text-[#1B1B23]">
                          {event.venue || event.city}
                        </h4>
                        <p className="text-xs text-[#8C8C9E] mt-0.5">
                          {event.address ? event.address : `${event.city || "Venue"} · 5.6 km away`}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/6">
                      <a
                        href={gmapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-black/8 text-xs font-bold text-[#1B1B23] hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        <span>Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                      </a>
                      <a
                        href={appleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-black/8 text-xs font-bold text-[#1B1B23] hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        <span>Apple Maps</span>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                      </a>
                    </div>
                  </div>

                  {/* Ride-hailing box matching screenshot */}
                  <div className="border border-black/6 rounded-2xl p-4 bg-white space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-[#8C8C9E]">Ride-hailing & Taxis</h5>
                    <p className="text-xs text-[#555] leading-relaxed">
                      Taxis and ride-hailing drop-off at the main entrance. Pre-book your return journey to avoid surge pricing.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <a
                        href={uberUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-11 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs cursor-pointer px-4"
                      >
                        <UberLogo className="w-4 h-4" />
                        <span>Uber</span>
                      </a>
                      <a
                        href={boltUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-11 rounded-full bg-[#34D186] hover:bg-[#2ebd78] text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-xs cursor-pointer px-4"
                      >
                        <BoltLogo className="w-4 h-4" />
                        <span>Bolt</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

