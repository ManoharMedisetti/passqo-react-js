import { getAccessToken, clearAuth } from "./auth/storage";
import { MOCK_EVENTS, MOCK_TRENDING } from "./mockData";

const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:3002";

let redirectingToLogin = false;

function redirectToLogin() {
  if (redirectingToLogin || typeof window === "undefined") return;
  clearAuth();
  if (window.location.pathname.startsWith("/auth/login")) return;
  redirectingToLogin = true;
  const returnTo = `${window.location.pathname}${window.location.search}`;
  window.location.href = `/auth/login?redirect=${encodeURIComponent(returnTo)}`;
}

async function request(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && token) {
    redirectToLogin();
    return new Promise(() => {});
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

async function downloadFile(path, filename) {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: "include",
  });
  if (res.status === 401 && token) {
    redirectToLogin();
    return new Promise(() => {});
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Download failed");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function uploadFile(path, file) {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
    credentials: "include",
  });
  if (res.status === 401 && token) {
    redirectToLogin();
    return new Promise(() => {});
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
}

export const api = {
  auth: {
    login: (email, password) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (email, name, password, referralCode, role = "CUSTOMER") =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, name, password, role, referralCode }),
      }),
    verifyEmail: (token, email) =>
      request(`/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`),
    resendVerification: (email) =>
      request("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    forgotPassword: (email) =>
      request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    verifyResetToken: (token, email) =>
      request(`/auth/reset-password/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`),
    resetPassword: (token, email, password) =>
      request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, email, password }),
      }),
    me: () => request("/auth/me"),
    logout: () => request("/auth/logout", { method: "POST" }),
    changePassword: (currentPassword, newPassword) =>
      request("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  events: {
    entrySlots: (eventId, all = false) => request(`/events/${eventId}/entry-slots${all ? "?all=true" : ""}`),
    list: async (params) => {
      try {
        const qs = new URLSearchParams(
          Object.entries(params ?? {})
            .filter(([, v]) => v !== undefined && v !== null && v !== "")
            .map(([k, v]) => [k, String(v)]),
        ).toString();
        const data = await request(`/events${qs ? `?${qs}` : ""}`);
        if (Array.isArray(data) && data.length > 0) return data;
        return MOCK_EVENTS;
      } catch {
        return MOCK_EVENTS;
      }
    },
    recommended: async () => {
      try {
        const data = await request(`/events/recommended`);
        if (data && data.events && data.events.length > 0) return data;
        return { events: MOCK_EVENTS.slice(1, 5), basedOn: { categories: ["MUSIC_ENTERTAINMENT"], organisers: 2, city: "Dublin" } };
      } catch {
        return { events: MOCK_EVENTS.slice(1, 5), basedOn: { categories: ["MUSIC_ENTERTAINMENT"], organisers: 2, city: "Dublin" } };
      }
    },
    get: async (id) => {
      try {
        const data = await request(`/events/${id}`);
        if (data && data.id) return data;
        return MOCK_EVENTS.find((e) => e.id === id || e.slug === id) || MOCK_EVENTS[0];
      } catch {
        return MOCK_EVENTS.find((e) => e.id === id || e.slug === id) || MOCK_EVENTS[0];
      }
    },
    revealAddress: (id) => request(`/events/${id}/reveal-address`),
    trending: async (params) => {
      try {
        const qs = params ? new URLSearchParams(params).toString() : "";
        const data = await request(`/events/trending${qs ? `?${qs}` : ""}`);
        if (Array.isArray(data) && data.length > 0) return data;
        return MOCK_TRENDING;
      } catch {
        return MOCK_TRENDING;
      }
    },
    nearby: (params) => {
      const qs = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(([k, v]) => [k, String(v)]),
      ).toString();
      return request(`/events/nearby?${qs}`);
    },
    publicGuestList: (id) => request(`/events/${id}/guest-list`),
    getBroadcast: (id, broadcastId) => request(`/events/${id}/broadcasts/${broadcastId}`),
    trackView: (id, source) =>
      request(`/events/${id}/track-view`, { method: "POST", body: JSON.stringify({ source }) }),
    posts: (id) => request(`/events/${id}/posts`),
    createPost: (id, body) =>
      request(`/events/${id}/posts`, { method: "POST", body: JSON.stringify(body) }),
    replyToPost: (id, postId, body) =>
      request(`/events/${id}/posts/${postId}/replies`, { method: "POST", body: JSON.stringify({ body }) }),
    toggleLike: (id, postId) =>
      request(`/events/${id}/posts/${postId}/like`, { method: "POST" }),
    submitFeedback: (id, body) =>
      request(`/events/${id}/feedback`, { method: "POST", body: JSON.stringify(body) }),
  },

  orders: {
    create: (body) => request("/orders", { method: "POST", body: JSON.stringify(body) }),
    mine: () => request("/orders/mine"),
    pendingApprovals: () => request("/orders/organiser/pending"),
    approve: (orderId, reason) => request(`/orders/${orderId}/approve`, { method: "PATCH", body: JSON.stringify({ reason }) }),
    decline: (orderId, reason) => request(`/orders/${orderId}/decline`, { method: "PATCH", body: JSON.stringify({ reason }) }),
    waitlistOrder: (orderId) => request(`/orders/${orderId}/waitlist`, { method: "PATCH" }),
    withdraw: (orderId) => request(`/orders/${orderId}/withdraw`, { method: "PATCH" }),
    downloadReceipt: (orderId) => downloadFile(`/orders/${orderId}/receipt`, `passqo-receipt-${orderId}.pdf`),
    addGuest: (eventId, body) =>
      request("/orders/organiser/add-guest", { method: "POST", body: JSON.stringify({ eventId, ...body }) }),
    updateOrderAnswers: (orderId, answers) =>
      request(`/orders/organiser/${orderId}/answers`, { method: "PATCH", body: JSON.stringify({ answers }) }),
    changeTicketTier: (ticketId, tierId) =>
      request(`/orders/organiser/tickets/${ticketId}/tier`, { method: "PATCH", body: JSON.stringify({ tierId }) }),
    cancelGuestTicket: (ticketId) =>
      request(`/orders/organiser/tickets/${ticketId}/cancel`, { method: "PATCH" }),
    bulkUpdateGuestStatus: (eventId, emails, status, message, notify) =>
      request("/orders/organiser/guests/bulk-status", { method: "PATCH", body: JSON.stringify({ eventId, emails, status, message, notify }) }),
    bulkCancelTickets: (ticketIds) =>
      request("/orders/organiser/tickets/bulk-cancel", { method: "PATCH", body: JSON.stringify({ ticketIds }) }),
    bulkApprove: (orderIds, reason) =>
      request("/orders/organiser/bulk-approve", { method: "PATCH", body: JSON.stringify({ orderIds, reason }) }),
    bulkDecline: (orderIds, reason) =>
      request("/orders/organiser/bulk-decline", { method: "PATCH", body: JSON.stringify({ orderIds, reason }) }),
  },

  payments: {
    createIntent: (orderId) =>
      request("/payments/intent", {
        method: "POST",
        body: JSON.stringify({ orderId }),
      }),
    getStatus: (orderId) => request(`/payments/orders/${orderId}/status`),
    completeOrder: (orderId) => request(`/payments/orders/${orderId}/complete`, { method: "POST" }),
    connectOnboard: () => request("/payments/connect/onboard", { method: "POST" }),
    connectStatus: () => request("/payments/connect/status"),
  },

  tickets: {
    myTickets: () => request("/users/me/tickets"),
  },

  users: {
    me: () => request("/users/me"),
    update: (data) =>
      request("/users/me", { method: "PATCH", body: JSON.stringify(data) }),
    uploadAvatar: (file) => uploadFile("/users/me/avatar", file),
    removeAvatar: () => request("/users/me/avatar", { method: "DELETE" }),
    preferences: () => request("/users/me/preferences"),
    updatePreferences: (data) =>
      request("/users/me/preferences", { method: "PATCH", body: JSON.stringify(data) }),
    becomeOrganiser: (businessName) =>
      request("/users/me/become-organiser", { method: "POST", body: JSON.stringify({ businessName }) }),
    organiserProfile: () => request("/users/me/organiser-profile"),
    updateOrganiserProfile: (data) =>
      request("/users/me/organiser-profile", { method: "PATCH", body: JSON.stringify(data) }),
    updateOrganiserSlug: (slug) =>
      request("/users/me/organiser-profile/slug", { method: "PATCH", body: JSON.stringify({ slug }) }),
    uploadOrganiserLogo: (file) => uploadFile("/users/me/organiser-profile/logo", file),
    removeOrganiserLogo: () => request("/users/me/organiser-profile/logo", { method: "DELETE" }),
    uploadOrganiserBanner: (file) => uploadFile("/users/me/organiser-profile/banner", file),
    removeOrganiserBanner: () => request("/users/me/organiser-profile/banner", { method: "DELETE" }),
  },

  artists: {
    list: (genre) => {
      const qs = genre ? `?genre=${encodeURIComponent(genre)}` : "";
      return request(`/artists${qs}`);
    },
    get: (slug) => request(`/artists/${slug}`),
    toggleFollow: (id) =>
      request(`/artists/${id}/follow`, { method: "POST" }),
    isFollowing: (id) => request(`/artists/${id}/following`),
    myFollowing: () => request("/artists/me/following"),
  },

  organisers: {
    get: (slug) => request(`/organisers/${slug}`),
    toggleFollow: (id) =>
      request(`/organisers/${id}/follow`, { method: "POST" }),
    isFollowing: (id) => request(`/organisers/${id}/following`),
    myFollowing: () => request("/organisers/me/following"),
    adminListVerificationRequests: () => request("/organisers/admin/verification-requests"),
    adminApproveVerification: (id) =>
      request(`/organisers/admin/verification-requests/${id}/approve`, { method: "PATCH" }),
    adminRejectVerification: (id, note) =>
      request(`/organisers/admin/verification-requests/${id}/reject`, { method: "PATCH", body: JSON.stringify({ note }) }),
  },

  waitlist: {
    join: (eventId, tierId) =>
      request(`/waitlist/${eventId}`, { method: "POST", body: JSON.stringify({ tierId }) }),
    leave: (eventId) =>
      request(`/waitlist/${eventId}`, { method: "DELETE" }),
    position: (eventId) => request(`/waitlist/${eventId}/position`),
    mine: () => request("/waitlist/me"),
    forEvent: (eventId) => request(`/waitlist/organiser/${eventId}`),
    notifyNext: (eventId, count, entryIds) =>
      request(`/waitlist/organiser/${eventId}/notify`, { method: "POST", body: JSON.stringify({ count, entryIds }) }),
    claimSpot: (eventId) =>
      request(`/waitlist/${eventId}/claim`, { method: "POST" }),
  },

  hostInvite: {
    get: (token) => request(`/events/host-invites/${encodeURIComponent(token)}`),
  },
  invite: {
    get: (token) => request(`/events/invites/${token}`),
    respond: (token, action, name, answers) =>
      request(`/events/invites/${token}/respond`, { method: "POST", body: JSON.stringify({ action, name, answers }) }),
  },

  gamification: {
    myProfile: () => request("/gamification/profile"),
    leaderboard: (limit) =>
      request(`/gamification/leaderboard${limit ? `?limit=${limit}` : ""}`),
    badges: () => request("/gamification/badges"),
  },

  notifications: {
    list: (page) =>
      request(`/notifications${page ? `?page=${page}` : ""}`),
    unreadCount: () => request("/notifications/unread-count"),
    markRead: (id) =>
      request(`/notifications/${id}/read`, { method: "PATCH" }),
    markAllRead: () =>
      request("/notifications/read-all", { method: "PATCH" }),
  },

  organizer: {
    myEvents: () => request("/events/mine"),
    stats: () => request("/events/mine/stats"),
    getEvent: (id) => request(`/events/mine/${id}`),
    createEvent: (body) => request("/events", { method: "POST", body: JSON.stringify(body) }),
    updateEvent: (id, body) => request(`/events/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    uploadEventImage: (id, file) => uploadFile(`/events/${id}/image`, file),
    removeEventImage: (id) => request(`/events/${id}/image`, { method: "DELETE" }),
    togglePublish: (id) => request(`/events/${id}/publish`, { method: "PATCH" }),
    updateSlug: (id, slug) => request(`/events/${id}/slug`, { method: "PATCH", body: JSON.stringify({ slug }) }),
    deleteEvent: (id) => request(`/events/${id}`, { method: "DELETE" }),
    cancelEvent: (id) => request(`/events/${id}/cancel`, { method: "POST" }),
    cloneEvent: (id, dates) =>
      request(`/events/${id}/clone`, { method: "POST", body: JSON.stringify(dates ?? {}) }),
    analytics: () => request("/orders/analytics"),
    allTickets: () => request("/events/mine/tickets"),
    allPeople: () => request("/events/mine/people"),
    createContact: (body) =>
      request("/events/mine/people", { method: "POST", body: JSON.stringify(body) }),
    importContacts: (contacts) =>
      request("/events/mine/people/import", { method: "POST", body: JSON.stringify({ contacts }) }),
    updateContact: (contactId, body) =>
      request(`/events/mine/people/${contactId}`, { method: "PATCH", body: JSON.stringify(body) }),
    deleteContact: (contactId) =>
      request(`/events/mine/people/${contactId}`, { method: "DELETE" }),
    getVerificationStatus: () => request("/organisers/me/verification"),
    submitVerification: (file) => uploadFile("/organisers/me/verification", file),
    scanTicket: (qrCode) =>
      request("/events/scan", { method: "POST", body: JSON.stringify({ qrCode }) }),
    scanStats: (eventId) => request(`/events/scan/stats/${eventId}`),
    recentScans: (limit) => request(`/events/scan/logs/mine${limit ? `?limit=${limit}` : ""}`),
    inviteGuests: (eventId, emails, message) =>
      request(`/events/${eventId}/invite`, { method: "POST", body: JSON.stringify({ emails, message }) }),
    invites: (eventId) => request(`/events/${eventId}/invites`),
    resendInvite: (eventId, inviteId) =>
      request(`/events/${eventId}/invites/${inviteId}/resend`, { method: "POST" }),
    bulkResendInvites: (eventId, inviteIds) =>
      request(`/events/${eventId}/invites/bulk-resend`, { method: "POST", body: JSON.stringify({ inviteIds }) }),
    bulkCheckIn: (eventId, emails) =>
      request(`/events/${eventId}/bulk-checkin`, { method: "POST", body: JSON.stringify({ emails }) }),
    sendBroadcast: (eventId, body) =>
      request(`/events/${eventId}/broadcast`, { method: "POST", body: JSON.stringify(body) }),
    getBroadcasts: (eventId) => request(`/events/${eventId}/broadcasts`),
    guestTimeline: (eventId, email) =>
      request(`/events/${eventId}/guests/${encodeURIComponent(email)}/timeline`),
    pageViewStats: (eventId, range) =>
      request(`/events/${eventId}/pageviews?range=${range}`),
    getHosts: (eventId) => request(`/events/${eventId}/hosts`),
    searchHosts: (eventId, q) =>
      request(`/events/${eventId}/hosts/search?q=${encodeURIComponent(q)}`),
    addHost: (eventId, userId, role = "DISPLAY") =>
      request(`/events/${eventId}/hosts`, { method: "POST", body: JSON.stringify({ userId, role }) }),
    updateHostRole: (eventId, hostId, role) =>
      request(`/events/${eventId}/hosts/${hostId}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
    removeHost: (eventId, hostId) =>
      request(`/events/${eventId}/hosts/${hostId}`, { method: "DELETE" }),
    inviteHost: (eventId, email, role) =>
      request(`/events/${eventId}/hosts/invite`, { method: "POST", body: JSON.stringify({ email, role }) }),
    getHostInvites: (eventId) => request(`/events/${eventId}/hosts/invites`),
    resendHostInvite: (eventId, inviteId) =>
      request(`/events/${eventId}/hosts/invites/${inviteId}/resend`, { method: "POST" }),
    revokeHostInvite: (eventId, inviteId) =>
      request(`/events/${eventId}/hosts/invites/${inviteId}`, { method: "DELETE" }),
    createEntrySlots: (eventId, slots) =>
      request(`/events/${eventId}/entry-slots`, { method: "POST", body: JSON.stringify({ slots }) }),
    updateEntrySlot: (eventId, slotId, body) =>
      request(`/events/${eventId}/entry-slots/${slotId}`, { method: "PATCH", body: JSON.stringify(body) }),
    deleteEntrySlot: (eventId, slotId) =>
      request(`/events/${eventId}/entry-slots/${slotId}`, { method: "DELETE" }),
    myHostRoles: () => request("/events/mine/host-roles"),
    systemMessages: (eventId) => request(`/events/${eventId}/system-messages`),
    feedbackResponses: (eventId) => request(`/events/${eventId}/feedback`),
    updateReminders: (eventId, enabled) =>
      request(`/events/${eventId}/reminders`, { method: "PATCH", body: JSON.stringify({ enabled }) }),
    updateFeedbackSchedule: (eventId, body) =>
      request(`/events/${eventId}/feedback-schedule`, { method: "PATCH", body: JSON.stringify(body) }),
    getAutoApprovalRules: (eventId) => request(`/events/${eventId}/auto-approval-rules`),
    createAutoApprovalRule: (eventId, body) =>
      request(`/events/${eventId}/auto-approval-rules`, { method: "POST", body: JSON.stringify(body) }),
    updateAutoApprovalRule: (eventId, ruleId, body) =>
      request(`/events/${eventId}/auto-approval-rules/${ruleId}`, { method: "PATCH", body: JSON.stringify(body) }),
    deleteAutoApprovalRule: (eventId, ruleId) =>
      request(`/events/${eventId}/auto-approval-rules/${ruleId}`, { method: "DELETE" }),
    getBlockedEmails: (eventId) => request(`/events/${eventId}/blocked-emails`),
    createBlockedEmail: (eventId, body) =>
      request(`/events/${eventId}/blocked-emails`, { method: "POST", body: JSON.stringify(body) }),
    deleteBlockedEmail: (eventId, blockId) =>
      request(`/events/${eventId}/blocked-emails/${blockId}`, { method: "DELETE" }),
    getBlockedDomains: (eventId) => request(`/events/${eventId}/blocked-domains`),
    createBlockedDomain: (eventId, body) =>
      request(`/events/${eventId}/blocked-domains`, { method: "POST", body: JSON.stringify(body) }),
    deleteBlockedDomain: (eventId, blockId) =>
      request(`/events/${eventId}/blocked-domains/${blockId}`, { method: "DELETE" }),
    getAuditLog: (eventId) => request(`/events/${eventId}/audit-log`),
  },

  refunds: {
    request: (orderId, reason) =>
      request("/refunds", { method: "POST", body: JSON.stringify({ orderId, reason }) }),
    mine: () => request("/refunds/mine"),
    organiserList: () => request("/refunds/organiser"),
    approve: (id, reviewNote) =>
      request(`/refunds/${id}/approve`, { method: "PATCH", body: JSON.stringify({ reviewNote }) }),
    deny: (id, reviewNote) =>
      request(`/refunds/${id}/deny`, { method: "PATCH", body: JSON.stringify({ reviewNote }) }),
  },

  resale: {
    listByEvent: (eventId) => request(`/resale/event/${eventId}`),
    mine: () => request("/resale/mine"),
    create: (ticketId, askPrice) =>
      request("/resale", { method: "POST", body: JSON.stringify({ ticketId, askPrice }) }),
    buy: (listingId) =>
      request(`/resale/${listingId}/buy`, { method: "POST" }),
    updatePrice: (listingId, askPrice) =>
      request(`/resale/${listingId}`, { method: "PATCH", body: JSON.stringify({ askPrice }) }),
    cancel: (listingId) =>
      request(`/resale/${listingId}`, { method: "DELETE" }),
  },

  referral: {
    myCode: () => request("/referral/my-code"),
    myReferrals: () => request("/referral/my-referrals"),
    apply: (code) =>
      request("/referral/apply", { method: "POST", body: JSON.stringify({ code }) }),
    validate: (code) =>
      request(`/referral/validate/${encodeURIComponent(code)}`),
  },

  coupons: {
    create: (body) => request("/coupons", { method: "POST", body: JSON.stringify(body) }),
    findAll: () => request("/coupons"),
    findOne: (id) => request(`/coupons/${id}`),
    update: (id, body) => request(`/coupons/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id) => request(`/coupons/${id}`, { method: "DELETE" }),
    getEventCoupons: (eventId) => request(`/coupons/event/${eventId}`),
    assignToEvent: (eventId, couponId) =>
      request(`/coupons/event/${eventId}/assign/${couponId}`, { method: "POST" }),
    unassignFromEvent: (eventId, couponId) =>
      request(`/coupons/event/${eventId}/unassign/${couponId}`, { method: "DELETE" }),
    validate: (eventId, code, orderAmount) =>
      request("/coupons/validate", { method: "POST", body: JSON.stringify({ eventId, code, orderAmount }) }),
  },
};

