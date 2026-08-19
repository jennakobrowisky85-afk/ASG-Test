import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  Compass, TrendingUp, TrendingDown, Users, Target, DollarSign,
  ChevronDown, ChevronRight, ArrowUpRight, Radio, Sparkles, RefreshCw,
  CheckCircle2, Circle, Clock, ExternalLink, Gauge, Globe, CalendarDays,
  Timer, MapPin, Repeat, PhoneCall, AlertTriangle, Search, XCircle,
} from "lucide-react";

// ---------- design tokens ----------
const T = {
  bg: "#FBFAF7",
  bgRaised: "#F1EEE6",
  bgCard: "#FFFFFF",
  line: "#E4E0D3",
  gold: "#A9812E",
  goldDim: "#B08D42",
  tan: "#EDE1C3",
  rust: "#B5451F",
  sage: "#5F7A56",
  textHi: "#1C1810",
  textMid: "#5B5344",
  textLo: "#8B8271",
};

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

// ---------- mock data ----------
const channels = [
  { name: "Meta", campaign: "ASG_Prospecting_BigFive_Q3", adgroup: "Cold_LAL_1%_ZA", ad: "Video_LionCub_15s", spend: 184000, leads: 620, bookings: 71, revenue: 3120000, share: 31 },
  { name: "Google Search", campaign: "ASG_Search_Brand+Generic", adgroup: "Generic_LuxurySafari", ad: "RSA_LuxurySafari_01", spend: 241000, leads: 780, bookings: 96, revenue: 4310000, share: 39 },
  { name: "Organic / SEO", campaign: "n/a", adgroup: "n/a", ad: "n/a", spend: 0, leads: 190, bookings: 14, revenue: 612000, share: 10 },
  { name: "DV360", campaign: "ASG_Inbound_AirportGeofence", adgroup: "CPT_JNB_Arrivals", ad: "Display_SkylineFade", spend: 62000, leads: 84, bookings: 6, revenue: 267000, share: 4 },
  { name: "YouTube", campaign: "ASG_Discovery_DestinationFilms", adgroup: "InMarket_Travel_Luxury", ad: "PreRoll_Serengeti_30s", spend: 38000, leads: 51, bookings: 3, revenue: 141000, share: 3 },
  { name: "Referral", campaign: "n/a", adgroup: "n/a", ad: "n/a", spend: 0, leads: 138, bookings: 22, revenue: 980000, share: 7 },
  { name: "Pinterest", campaign: "ASG_Inspiration_Honeymoon", adgroup: "Interest_LuxuryTravel", ad: "IdeaPin_Zanzibar", spend: 19000, leads: 44, bookings: 2, revenue: 88000, share: 2 },
  { name: "Bing", campaign: "ASG_Search_HighIntent", adgroup: "Exact_LuxurySafariPackages", ad: "RSA_Bing_02", spend: 11000, leads: 21, bookings: 2, revenue: 94000, share: 1 },
];

const trend = [
  { m: "Mar", spend: 380, revenue: 5.1 }, { m: "Apr", spend: 402, revenue: 5.6 },
  { m: "May", spend: 411, revenue: 6.0 }, { m: "Jun", spend: 498, revenue: 7.4 },
  { m: "Jul", spend: 512, revenue: 8.1 }, { m: "Aug", spend: 555, revenue: 9.6 },
];

const consultants = [
  { name: "Hanel Botha", leads: 96, bookings: 18, rate: 18.8, revenue: 812000, top: "Meta" },
  { name: "Roxanne B.", leads: 88, bookings: 16, rate: 18.2, revenue: 744000, top: "Google Search" },
  { name: "Stewart K.", leads: 101, bookings: 15, rate: 14.9, revenue: 615000, top: "Google Search" },
  { name: "Annerie P.", leads: 79, bookings: 13, rate: 16.5, revenue: 588000, top: "Referral" },
  { name: "Janine M.", leads: 84, bookings: 11, rate: 13.1, revenue: 501000, top: "Meta" },
  { name: "Tracy-Lee S.", leads: 71, bookings: 9, rate: 12.7, revenue: 402000, top: "Organic / SEO" },
  { name: "Gaynor F.", leads: 66, bookings: 8, rate: 12.1, revenue: 366000, top: "Meta" },
  { name: "Ashly D.", leads: 58, bookings: 6, rate: 10.3, revenue: 271000, top: "Google Search" },
];

const segments = [
  { name: "Booked Customers", desc: "Confirmed bookings — lookalike seed", size: 2210, match: 94, platforms: ["Meta", "Google"] },
  { name: "High-Value Bookers", desc: "Top quartile by booking value", size: 552, match: 91, platforms: ["Meta", "Google"] },
  { name: "Engaged, Not Booked", desc: "Reached mid-funnel stage, no booking", size: 1840, match: 88, platforms: ["Meta", "Google", "Pinterest"] },
  { name: "Stalled 14+ Days", desc: "No stage movement in 2+ weeks", size: 640, match: 85, platforms: ["Meta"] },
  { name: "Past Customers", desc: "Travelled 12–36 months ago", size: 3105, match: 96, platforms: ["Meta", "Google"] },
];

const creatives = [
  { ad: "Video_LionCub_15s", platform: "Meta", leads: 210, bookings: 34, bookRate: 16.2 },
  { ad: "RSA_LuxurySafari_01", platform: "Google Search", leads: 340, bookings: 51, bookRate: 15.0 },
  { ad: "IdeaPin_Zanzibar", platform: "Pinterest", leads: 44, bookings: 2, bookRate: 4.5 },
  { ad: "PreRoll_Serengeti_30s", platform: "YouTube", leads: 51, bookings: 3, bookRate: 5.9 },
  { ad: "Display_SkylineFade", platform: "DV360", leads: 84, bookings: 6, bookRate: 7.1 },
];

const fmt = (n) => n >= 1000000 ? `R${(n / 1000000).toFixed(2)}M` : n >= 1000 ? `R${(n / 1000).toFixed(0)}K` : `R${n}`;
const pct = (n) => `${n}%`;

// ---------- activity & targets: daily activity report roll-up ----------
// Targets are per-consultant, per working day. "Leads Accepted" target is an assumption
// (not specified) — flagged for confirmation, easy to change in one place below.
const METRICS = [
  { key: "leadsAccepted", label: "Leads Accepted", short: "Leads", daily: 3, currency: false },
  { key: "contactsMade", label: "Contacts Made", short: "Contacts", daily: 2, currency: false },
  { key: "quotesGenerated", label: "Quotes Generated", short: "Quotes", daily: 2, currency: false },
  { key: "quoteValue", label: "Quote Value", short: "Quote R", daily: 25000, currency: true },
  { key: "dealsClosed", label: "Deals Closed", short: "Deals", daily: 1, currency: false },
  { key: "dealsValue", label: "Deals Value", short: "Deals R", daily: 50000, currency: true },
  { key: "followUps", label: "Follow-Ups", short: "Follow-Ups", daily: 3, currency: false },
];

const PERIOD_MULT = { day: 1, week: 5, month: 22 }; // 5-day week, ~22 working days/month

// "Now" reference for pacing — Wednesday, 3:00pm, week-day 3 of 5, month working-day 12 of 22.
// Pace re-derives from elapsed working days (+ today's partial day), not a flat calendar check.
const DAY_FRAC = 6 / 8;                    // 6 of 8 working hours elapsed today
const WEEK_FRAC = (2 + DAY_FRAC) / 5;      // 2 completed days + today's fraction, of a 5-day week
const MONTH_FRAC = (11 + DAY_FRAC) / 22;   // 11 completed working days + today's fraction, of 22
const PERIOD_FRAC = { day: DAY_FRAC, week: WEEK_FRAC, month: MONTH_FRAC };

const STATUS_COLOR = { green: T.sage, amber: T.gold, red: T.rust };
const STATUS_LABEL = { green: "Target met / exceeded", amber: "On pace", red: "Behind pace" };

function paceStatus(actual, target, frac) {
  if (actual >= target) return "green";
  if (actual >= target * frac) return "amber";
  return "red";
}
function worstStatus(list) {
  if (list.includes("red")) return "red";
  if (list.includes("amber")) return "amber";
  return "green";
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MANAGER_NAMES = ["Riaan v/d Merwe", "Charlene Adams", "Deon Retief", "Simone Naidoo", "Werner Botes", "Palesa Khumalo"];
const FIRST_NAMES = ["Hanel", "Roxanne", "Stewart", "Annerie", "Janine", "Tracy-Lee", "Gaynor", "Ashly", "Lucy", "Trevor", "Beverley", "Adriana", "Stephany", "Lynda", "Sheila", "Tamara", "Maria", "Chantelle", "Werner", "Pieter", "Michelle", "Devon", "Kayla", "Ruan", "Nadia", "Bianca", "Cornel", "Elmarie", "Francois", "Gideon", "Zanele", "Kabelo", "Thandiwe", "Johan"];
const LAST_NAMES = ["Botha", "B.", "K.", "P.", "M.", "S.", "F.", "D.", "Nel", "Pretorius", "van Wyk", "Joubert", "Kruger", "de Beer", "Meyer", "Coetzee", "Fourie", "Steyn", "Marais", "Human"];
const CONSULTANTS_PER_MANAGER = 17;

const activityConsultants = Array.from({ length: MANAGER_NAMES.length * CONSULTANTS_PER_MANAGER }, (_, i) => {
  const rng = mulberry32(2000 + i * 131);
  const perf = 0.55 + rng() * 1.25; // spread of performers, roughly 0.55x to 1.8x pace
  const metrics = {};
  METRICS.forEach((m) => {
    const round = (v) => (m.currency ? Math.round(v / 100) * 100 : Math.round(v));
    metrics[m.key] = {
      day: Math.max(0, round(m.daily * DAY_FRAC * perf * (0.65 + rng() * 0.7))),
      week: Math.max(0, round(m.daily * 5 * WEEK_FRAC * perf * (0.7 + rng() * 0.6))),
      month: Math.max(0, round(m.daily * 22 * MONTH_FRAC * perf * (0.75 + rng() * 0.5))),
    };
  });
  return {
    id: i,
    name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length]}`,
    managerIndex: Math.floor(i / CONSULTANTS_PER_MANAGER),
    metrics,
  };
});

// ---------- markets: CRM pipeline, trip detail & seasonality ----------
const MARKETS = [
  { key: "asia", label: "Asia" },
  { key: "australasia", label: "Australasia" },
  { key: "middleEast", label: "Middle East" },
  { key: "uk", label: "UK" },
  { key: "eu", label: "EU" },
  { key: "usa", label: "USA" },
  { key: "southAmerica", label: "South America" },
];

const TRIP_TYPES = ["Big Five Safari", "Migration Safari", "Honeymoon Safari", "Family Safari", "Safari & Beach", "Gorilla Trekking", "Rail Journey", "Luxury Fly-In"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Peak = 1 Nov–end Mar, Off-Peak = 1 May–end Aug, Shoulder = Apr & Sep (as briefed).
// October wasn't specified in the brief — shown here as Shoulder, bridging Sep and Nov. Flag if it should sit elsewhere.
const SEASON_BAND = { Jan: "peak", Feb: "peak", Mar: "peak", Apr: "shoulder", May: "off", Jun: "off", Jul: "off", Aug: "off", Sep: "shoulder", Oct: "shoulder", Nov: "peak", Dec: "peak" };
const SEASON_COLOR = { peak: T.gold, shoulder: T.tan, off: T.textLo };
const SEASON_LABEL = { peak: "Peak · Nov–Mar", shoulder: "Shoulder · Apr, Sep (+ Oct*)", off: "Off-Peak · May–Aug" };

// Rough per-market shape for the mock — lead volume scale and typical sales-cycle length
const MARKET_PROFILE = {
  asia: { leadFactor: 0.9, closeDaysBase: 34 },
  australasia: { leadFactor: 0.55, closeDaysBase: 30 },
  middleEast: { leadFactor: 0.7, closeDaysBase: 40 },
  uk: { leadFactor: 1.6, closeDaysBase: 18 },
  eu: { leadFactor: 1.3, closeDaysBase: 20 },
  usa: { leadFactor: 1.9, closeDaysBase: 24 },
  southAmerica: { leadFactor: 0.45, closeDaysBase: 32 },
};
const CHANNEL_NAMES = ["Meta", "Google Search", "Organic / SEO", "DV360", "YouTube", "Referral", "Pinterest", "Bing"];
const CHANNEL_WEIGHTS = [0.30, 0.34, 0.12, 0.08, 0.05, 0.06, 0.03, 0.02];

function buildMarket(marketKey, idx) {
  const profile = MARKET_PROFILE[marketKey];
  const rng = mulberry32(5000 + idx * 733);

  const channelMix = CHANNEL_NAMES.map((name, ci) => {
    const w = CHANNEL_WEIGHTS[ci] * (0.7 + rng() * 0.6);
    const leads = Math.max(3, Math.round(190 * profile.leadFactor * w));
    const bookRate = 0.08 + rng() * 0.14;
    const bookings = Math.max(0, Math.round(leads * bookRate));
    const avgVal = 32000 + rng() * 45000;
    const revenue = Math.round(bookings * avgVal);
    const spend = name === "Organic / SEO" || name === "Referral" ? 0 : Math.round(revenue / (3.5 + rng() * 9));
    return { name, spend, leads, bookings, revenue };
  });

  const totalLeads = channelMix.reduce((a, c) => a + c.leads, 0);
  const totalBookings = channelMix.reduce((a, c) => a + c.bookings, 0);
  const totalRevenue = channelMix.reduce((a, c) => a + c.revenue, 0);
  const totalSpend = channelMix.reduce((a, c) => a + c.spend, 0);

  // open pipeline snapshot — current count sitting in each stage right now
  const newLead = Math.round(totalLeads * (0.10 + rng() * 0.06));
  const contacted = Math.round(totalLeads * (0.14 + rng() * 0.06));
  const quoteSent = Math.round(totalLeads * (0.10 + rng() * 0.05));
  const negotiating = Math.round(totalLeads * (0.06 + rng() * 0.04));
  const closedLost = Math.round(totalLeads * (0.08 + rng() * 0.05));
  const openLeads = newLead + contacted + quoteSent + negotiating;

  // individual trip records — consultant-entered detail (trip type, nights, stops, pax, travel month)
  const tripCount = Math.min(totalBookings, 60);
  const trips = [];
  for (let i = 0; i < tripCount; i++) {
    const tr = mulberry32(5000 + idx * 733 + 900 + i * 17);
    const tripType = TRIP_TYPES[Math.floor(tr() * TRIP_TYPES.length)];
    const nights = 5 + Math.floor(tr() * 10);
    const stops = 1 + Math.floor(tr() * 4);
    const pax = 1 + Math.floor(tr() * 5);
    const seasonRoll = tr();
    const month = seasonRoll < 0.5
      ? ["Nov", "Dec", "Jan", "Feb", "Mar"][Math.floor(tr() * 5)]
      : seasonRoll < 0.75
      ? ["Apr", "Sep", "Oct"][Math.floor(tr() * 3)]
      : ["May", "Jun", "Jul", "Aug"][Math.floor(tr() * 4)];
    const daysToClose = Math.max(5, Math.round(profile.closeDaysBase * (0.6 + tr() * 0.9)));
    const consultantId = Math.floor(tr() * activityConsultants.length);
    const revenue = Math.round((30000 + tr() * 55000) * pax);
    trips.push({ tripType, nights, stops, pax, month, daysToClose, consultantId, revenue });
  }

  const sumPax = trips.reduce((a, t) => a + t.pax, 0);
  const sumNights = trips.reduce((a, t) => a + t.nights, 0);
  const sumStops = trips.reduce((a, t) => a + t.stops, 0);
  const sumDays = trips.reduce((a, t) => a + t.daysToClose, 0);
  const tripRevenue = trips.reduce((a, t) => a + t.revenue, 0);
  const seasonCounts = { peak: 0, shoulder: 0, off: 0 };
  const monthCounts = MONTHS.reduce((o, m) => ((o[m] = 0), o), {});
  trips.forEach((t) => { seasonCounts[SEASON_BAND[t.month]]++; monthCounts[t.month]++; });

  return {
    key: marketKey, channelMix, totalLeads, totalBookings, totalRevenue, totalSpend,
    newLead, contacted, quoteSent, negotiating, closedLost, openLeads, trips,
    avgPax: trips.length ? sumPax / trips.length : 0,
    avgNights: trips.length ? sumNights / trips.length : 0,
    avgStops: trips.length ? sumStops / trips.length : 0,
    avgDaysToClose: trips.length ? sumDays / trips.length : 0,
    avgValuePerTraveller: sumPax ? tripRevenue / sumPax : 0,
    seasonCounts, monthCounts,
  };
}

const marketData = {};
MARKETS.forEach((m, idx) => { marketData[m.key] = buildMarket(m.key, idx); });

function aggregateAllMarkets() {
  const channelMap = {};
  let totalLeads = 0, totalBookings = 0, totalRevenue = 0, totalSpend = 0;
  let newLead = 0, contacted = 0, quoteSent = 0, negotiating = 0, closedLost = 0;
  let trips = [];
  MARKETS.forEach((m) => {
    const d = marketData[m.key];
    d.channelMix.forEach((c) => {
      channelMap[c.name] = channelMap[c.name] || { name: c.name, spend: 0, leads: 0, bookings: 0, revenue: 0 };
      channelMap[c.name].spend += c.spend;
      channelMap[c.name].leads += c.leads;
      channelMap[c.name].bookings += c.bookings;
      channelMap[c.name].revenue += c.revenue;
    });
    totalLeads += d.totalLeads; totalBookings += d.totalBookings; totalRevenue += d.totalRevenue; totalSpend += d.totalSpend;
    newLead += d.newLead; contacted += d.contacted; quoteSent += d.quoteSent; negotiating += d.negotiating; closedLost += d.closedLost;
    trips = trips.concat(d.trips);
  });
  const openLeads = newLead + contacted + quoteSent + negotiating;
  const sumPax = trips.reduce((a, t) => a + t.pax, 0);
  const sumNights = trips.reduce((a, t) => a + t.nights, 0);
  const sumStops = trips.reduce((a, t) => a + t.stops, 0);
  const sumDays = trips.reduce((a, t) => a + t.daysToClose, 0);
  const tripRevenue = trips.reduce((a, t) => a + t.revenue, 0);
  const seasonCounts = { peak: 0, shoulder: 0, off: 0 };
  const monthCounts = MONTHS.reduce((o, m) => ((o[m] = 0), o), {});
  trips.forEach((t) => { seasonCounts[SEASON_BAND[t.month]]++; monthCounts[t.month]++; });
  return {
    key: "all", channelMix: Object.values(channelMap), totalLeads, totalBookings, totalRevenue, totalSpend,
    newLead, contacted, quoteSent, negotiating, closedLost, openLeads, trips,
    avgPax: trips.length ? sumPax / trips.length : 0,
    avgNights: trips.length ? sumNights / trips.length : 0,
    avgStops: trips.length ? sumStops / trips.length : 0,
    avgDaysToClose: trips.length ? sumDays / trips.length : 0,
    avgValuePerTraveller: sumPax ? tripRevenue / sumPax : 0,
    seasonCounts, monthCounts,
  };
}
const allMarketsData = aggregateAllMarkets();

function topConsultantsForMarket(market) {
  const map = {};
  market.trips.forEach((t) => {
    map[t.consultantId] = map[t.consultantId] || { bookings: 0, revenue: 0, pax: 0 };
    map[t.consultantId].bookings += 1;
    map[t.consultantId].revenue += t.revenue;
    map[t.consultantId].pax += t.pax;
  });
  return Object.entries(map)
    .map(([id, v]) => ({ name: activityConsultants[+id].name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function tripTypeBreakdown(market) {
  const map = {};
  market.trips.forEach((t) => {
    map[t.tripType] = (map[t.tripType] || 0) + 1;
  });
  return Object.entries(map).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
}

// ---------- consultant deep-dive: pipeline, repeat rate, unconverted leads, low-quality leads ----------
const LOW_QUALITY_REASONS = ["Unqualified budget", "Wrong market fit", "Spam / bot enquiry", "Duplicate lead", "Non-responsive after 3 attempts", "Outside service area", "Price-shopping only"];

// Repeat-customer traffic light: benchmark is a 20–30% band. Read as: 20%+ meets the benchmark
// floor (green), 12–20% is approaching it (amber), below 12% is well off (red). This threshold
// choice is an assumption worth confirming — the brief gave a target band, not red/amber cutoffs.
function repeatStatus(rate) {
  if (rate >= 20) return "green";
  if (rate >= 12) return "amber";
  return "red";
}
// Unconverted-consultation traffic light: the higher the share of unconverted leads that already
// got a quote/consultation before stalling, the worse — leads are being worked but not closed.
// No benchmark was specified for this one either — thresholds below are a starting assumption.
function unconvertedStatus(ratio) {
  if (ratio >= 0.45) return "red";
  if (ratio >= 0.28) return "amber";
  return "green";
}

function buildConsultantExtras(id) {
  const rng = mulberry32(9000 + id * 271);

  // pipeline snapshot — this consultant's own portfolio, same 6-stage shape as Markets
  const totalPortfolio = 12 + Math.floor(rng() * 30);
  const newLead = Math.round(totalPortfolio * (0.12 + rng() * 0.08));
  const contacted = Math.round(totalPortfolio * (0.16 + rng() * 0.08));
  const quoteSent = Math.round(totalPortfolio * (0.12 + rng() * 0.06));
  const negotiating = Math.round(totalPortfolio * (0.08 + rng() * 0.05));
  const closedWon = Math.round(totalPortfolio * (0.15 + rng() * 0.1));
  const closedLost = Math.max(0, totalPortfolio - newLead - contacted - quoteSent - negotiating - closedWon);

  // repeat customer share of closed-won bookings
  const repeatShare = 0.05 + rng() * 0.35;
  const repeat = Math.round(closedWon * repeatShare);

  // unconverted leads by period — total still-open-or-lost, and the subset that had a
  // consultation (quote sent / negotiating) before stalling
  const unconverted = {};
  ["day", "week", "month"].forEach((period) => {
    const scale = period === "day" ? 1 : period === "week" ? 5 : 22;
    const totalU = Math.max(0, Math.round(totalPortfolio * 0.06 * scale * (0.5 + rng() * 0.9)));
    const consultShare = 0.15 + rng() * 0.45;
    unconverted[period] = { total: totalU, consultations: Math.round(totalU * consultShare) };
  });

  // low-quality leads this consultant has flagged, with reason / campaign / market
  const lqCount = Math.floor(rng() * 7);
  const lowQuality = Array.from({ length: lqCount }, () => ({
    reason: LOW_QUALITY_REASONS[Math.floor(rng() * LOW_QUALITY_REASONS.length)],
    campaign: channels[Math.floor(rng() * channels.length)].campaign,
    market: MARKETS[Math.floor(rng() * MARKETS.length)].label,
  }));

  return {
    pipeline: { newLead, contacted, quoteSent, negotiating, closedWon, closedLost },
    repeat: { closedWon, repeat },
    unconverted,
    lowQuality,
  };
}

const consultantExtras = activityConsultants.map((c) => buildConsultantExtras(c.id));

function pipelineSum(ids) {
  return ids.reduce((acc, id) => {
    const p = consultantExtras[id].pipeline;
    acc.newLead += p.newLead; acc.contacted += p.contacted; acc.quoteSent += p.quoteSent;
    acc.negotiating += p.negotiating; acc.closedWon += p.closedWon; acc.closedLost += p.closedLost;
    return acc;
  }, { newLead: 0, contacted: 0, quoteSent: 0, negotiating: 0, closedWon: 0, closedLost: 0 });
}
function repeatSum(ids) {
  return ids.reduce((acc, id) => {
    acc.closedWon += consultantExtras[id].repeat.closedWon;
    acc.repeat += consultantExtras[id].repeat.repeat;
    return acc;
  }, { closedWon: 0, repeat: 0 });
}
function unconvertedSum(ids, period) {
  return ids.reduce((acc, id) => {
    const u = consultantExtras[id].unconverted[period];
    acc.total += u.total; acc.consultations += u.consultations;
    return acc;
  }, { total: 0, consultations: 0 });
}

// ---------- AI / GEO visibility: mock pull from GA4 + Search Console ----------
const AI_ENGINES = [
  { name: "Google AI Overviews", source: "Search Console", sessions: 1240, delta: 34 },
  { name: "ChatGPT", source: "GA4 referral", sessions: 410, delta: 61 },
  { name: "Perplexity", source: "GA4 referral", sessions: 185, delta: 88 },
  { name: "Copilot", source: "GA4 referral", sessions: 96, delta: 42 },
  { name: "Gemini", source: "GA4 referral", sessions: 74, delta: 29 },
];
const AI_KEYWORDS = [
  { query: "best time to see the great migration", impressions: 8400, clicks: 310, avgPosition: 2.1 },
  { query: "luxury safari lodges south africa", impressions: 6100, clicks: 265, avgPosition: 1.8 },
  { query: "kruger vs sabi sands safari", impressions: 4200, clicks: 190, avgPosition: 2.6 },
  { query: "how much does a private safari cost", impressions: 3900, clicks: 172, avgPosition: 3.1 },
  { query: "gorilla trekking rwanda vs uganda", impressions: 2650, clicks: 118, avgPosition: 2.4 },
  { query: "family safari itinerary 10 days", impressions: 2200, clicks: 94, avgPosition: 3.4 },
  { query: "honeymoon safari and beach combo", impressions: 1950, clicks: 88, avgPosition: 2.9 },
  { query: "best safari lodges for photography", impressions: 1600, clicks: 61, avgPosition: 4.0 },
];
const AI_LOCATIONS = [
  { location: "London, UK", sessions: 320, topEngine: "Google AI Overviews" },
  { location: "New York, USA", sessions: 285, topEngine: "ChatGPT" },
  { location: "Dubai, UAE", sessions: 210, topEngine: "Google AI Overviews" },
  { location: "Sydney, Australia", sessions: 165, topEngine: "Perplexity" },
  { location: "Singapore", sessions: 140, topEngine: "ChatGPT" },
  { location: "Toronto, Canada", sessions: 118, topEngine: "Google AI Overviews" },
  { location: "Cape Town, South Africa", sessions: 96, topEngine: "Copilot" },
  { location: "Mumbai, India", sessions: 74, topEngine: "Gemini" },
];

// ---------- small UI atoms ----------
function UtmChip({ platform, campaign, adgroup, ad }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
      {[platform, campaign, adgroup, ad].map((v, i) => (
        <span key={i} style={{
          background: T.bgRaised, border: `1px solid ${T.line}`, color: i === 0 ? T.gold : T.textMid,
          padding: "2px 7px", borderRadius: 3,
        }}>{v}</span>
      ))}
    </div>
  );
}

function KpiCard({ label, value, delta, deltaGood, icon: Icon }) {
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: "18px 20px",
      display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ color: T.textLo, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "Inter" }}>{label}</span>
        <Icon size={15} color={T.goldDim} />
      </div>
      <div style={{ fontFamily: "Fraunces", fontSize: 28, color: T.textHi, fontWeight: 500 }}>{value}</div>
      {delta && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: deltaGood ? T.sage : T.rust, fontFamily: "Inter" }}>
          {deltaGood ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {delta}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: "Fraunces", fontSize: 19, color: T.textHi, fontWeight: 500 }}>{children}</div>
      {sub && <div style={{ fontFamily: "Inter", fontSize: 12.5, color: T.textLo, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ---------- tabs ----------
function OverviewTab() {
  const totalSpend = channels.reduce((a, c) => a + c.spend, 0);
  const totalRevenue = channels.reduce((a, c) => a + c.revenue, 0);
  const totalLeads = channels.reduce((a, c) => a + c.leads, 0);
  const totalBookings = channels.reduce((a, c) => a + c.bookings, 0);
  const maxShare = Math.max(...channels.map((c) => c.share));
  const over10 = channels.filter((c) => c.share >= 10).length;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 30 }}>
        <KpiCard label="Total Leads (30d)" value={totalLeads.toLocaleString()} delta="+12% vs prior period" deltaGood icon={Users} />
        <KpiCard label="Confirmed Bookings" value={totalBookings} delta="+8% vs prior period" deltaGood icon={CheckCircle2} />
        <KpiCard label="Blended ROAS" value={`${(totalRevenue / totalSpend).toFixed(1)}x`} delta="+0.3x vs prior period" deltaGood icon={TrendingUp} />
        <KpiCard label="Blended CAC" value={fmt(totalSpend / totalBookings)} delta="−R1.4K vs prior period" deltaGood icon={DollarSign} />
        <KpiCard label="Lead → Booking Rate" value={`${((totalBookings / totalLeads) * 100).toFixed(1)}%`} icon={Target} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 30 }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub="Monthly spend vs. revenue, R'000s">Spend &amp; Revenue Trend</SectionLabel>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={trend} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.gold} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={T.gold} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.textLo} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={T.textLo} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={T.line} vertical={false} />
              <XAxis dataKey="m" stroke={T.textLo} fontSize={11} tickLine={false} axisLine={{ stroke: T.line }} fontFamily="Inter" />
              <YAxis stroke={T.textLo} fontSize={11} tickLine={false} axisLine={false} fontFamily="Inter" />
              <Tooltip contentStyle={{ background: T.bgRaised, border: `1px solid ${T.line}`, borderRadius: 4, fontFamily: "Inter", fontSize: 12 }} labelStyle={{ color: T.textHi }} />
              <Area type="monotone" dataKey="revenue" stroke={T.gold} fill="url(#rev)" strokeWidth={2} name="Revenue (R'M)" />
              <Area type="monotone" dataKey="spend" stroke={T.textMid} fill="url(#spd)" strokeWidth={1.5} name="Spend (R'K)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub="Target: ≤60% max, 3+ channels at 10%+">Channel Share vs. Target</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
            {channels.filter(c => c.share >= 5).map((c) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, fontFamily: "Inter" }}>
                  <span style={{ color: T.textHi }}>{c.name}</span>
                  <span style={{ color: c.share >= 10 ? T.sage : T.textLo, fontFamily: "IBM Plex Mono" }}>{c.share}%</span>
                </div>
                <div style={{ height: 6, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${c.share}%`, height: "100%", background: c.share > 55 ? T.rust : c.share >= 10 ? T.gold : T.goldDim, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.line}`, fontSize: 12, fontFamily: "Inter", color: T.textMid, display: "flex", justifyContent: "space-between" }}>
            <span>Max single-channel share</span>
            <span style={{ color: maxShare <= 60 ? T.sage : T.rust, fontFamily: "IBM Plex Mono" }}>{maxShare}% / ≤60%</span>
          </div>
          <div style={{ fontSize: 12, fontFamily: "Inter", color: T.textMid, display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span>Channels ≥10% share</span>
            <span style={{ color: over10 >= 3 ? T.sage : T.rust, fontFamily: "IBM Plex Mono" }}>{over10} / 3 target</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelsTab() {
  const [open, setOpen] = useState(channels[0].name);
  return (
    <div>
      <SectionLabel sub="platform → campaign → adgroup → ad, joined to confirmed bookings">Channel &amp; Attribution Drill-Down</SectionLabel>
      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.8fr 0.9fr 0.9fr 0.9fr 0.9fr 0.9fr",
          padding: "10px 18px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em",
          color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter",
        }}>
          <span>Channel</span><span>Spend</span><span>Leads</span><span>Bookings</span><span>CAC</span><span>ROAS</span>
        </div>
        {channels.map((c) => {
          const isOpen = open === c.name;
          const cac = c.bookings ? c.spend / c.bookings : 0;
          const roas = c.spend ? c.revenue / c.spend : null;
          return (
            <div key={c.name} style={{ borderBottom: `1px solid ${T.line}` }}>
              <div
                onClick={() => setOpen(isOpen ? null : c.name)}
                style={{
                  display: "grid", gridTemplateColumns: "1.8fr 0.9fr 0.9fr 0.9fr 0.9fr 0.9fr",
                  padding: "13px 18px", fontSize: 13, fontFamily: "Inter", color: T.textHi,
                  cursor: "pointer", alignItems: "center",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {isOpen ? <ChevronDown size={14} color={T.textLo} /> : <ChevronRight size={14} color={T.textLo} />}
                  {c.name}
                </span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{c.spend ? fmt(c.spend) : "—"}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{c.leads}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{c.bookings}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{cac ? fmt(cac) : "—"}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: roas && roas >= 15 ? T.sage : T.textMid }}>{roas ? `${roas.toFixed(1)}x` : "—"}</span>
              </div>
              {isOpen && c.campaign !== "n/a" && (
                <div style={{ padding: "4px 18px 16px 38px" }}>
                  <UtmChip platform={c.name} campaign={c.campaign} adgroup={c.adgroup} ad={c.ad} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 26, background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
        <SectionLabel sub="Which creative actually produces bookings, not just clicks">ROAS by Channel</SectionLabel>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={channels.filter(c => c.spend > 0)} margin={{ left: -20, right: 10 }}>
            <CartesianGrid stroke={T.line} vertical={false} />
            <XAxis dataKey="name" stroke={T.textLo} fontSize={11} tickLine={false} axisLine={{ stroke: T.line }} fontFamily="Inter" />
            <YAxis stroke={T.textLo} fontSize={11} tickLine={false} axisLine={false} fontFamily="Inter" />
            <Tooltip contentStyle={{ background: T.bgRaised, border: `1px solid ${T.line}`, borderRadius: 4, fontFamily: "Inter", fontSize: 12 }} labelStyle={{ color: T.textHi }} />
            <Bar dataKey={(d) => +(d.revenue / d.spend).toFixed(1)} name="ROAS" radius={[3, 3, 0, 0]}>
              {channels.filter(c => c.spend > 0).map((c, i) => (
                <Cell key={i} fill={c.revenue / c.spend >= 15 ? T.gold : T.goldDim} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 26 }}>
        <SectionLabel sub="Pulled from GA4 (AI referral sessions) and Search Console (AI Overview impressions/clicks)">AI / GEO Visibility</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
          {AI_ENGINES.map((e) => (
            <div key={e.name} style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ color: T.textLo, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "Inter" }}>{e.name}</span>
                <Search size={13} color={T.goldDim} />
              </div>
              <div style={{ fontFamily: "Fraunces", fontSize: 20, color: T.textHi }}>{e.sessions.toLocaleString()}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, fontFamily: "Inter", color: T.textLo, marginTop: 4 }}>
                <span>{e.source}</span>
                <span style={{ color: T.sage }}>+{e.delta}%</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
            <SectionLabel sub="Search Console · queries surfacing ASG in AI Overviews">Top Keywords</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1.8fr 0.8fr 0.7fr 0.8fr", padding: "8px 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
              <span>Query</span><span>Impr.</span><span>Clicks</span><span>Avg Pos.</span>
            </div>
            {AI_KEYWORDS.map((k, i, arr) => (
              <div key={k.query} style={{ display: "grid", gridTemplateColumns: "1.8fr 0.8fr 0.7fr 0.8fr", padding: "9px 4px", alignItems: "center", borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : "none" }}>
                <span style={{ fontFamily: "Inter", fontSize: 12, color: T.textHi }}>{k.query}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11.5, color: T.textHi }}>{k.impressions.toLocaleString()}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11.5, color: T.textHi }}>{k.clicks}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11.5, color: T.textHi }}>{k.avgPosition}</span>
              </div>
            ))}
          </div>
          <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
            <SectionLabel sub="GA4 geography · where AI-referred sessions are coming from">Top Locations</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 1.2fr", padding: "8px 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
              <span>Location</span><span>Sessions</span><span>Top Engine</span>
            </div>
            {AI_LOCATIONS.map((l, i, arr) => (
              <div key={l.location} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 1.2fr", padding: "9px 4px", alignItems: "center", borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : "none" }}>
                <span style={{ fontFamily: "Inter", fontSize: 12, color: T.textHi, display: "flex", alignItems: "center", gap: 5 }}><MapPin size={11} color={T.textLo} />{l.location}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11.5, color: T.textHi }}>{l.sessions}</span>
                <span style={{ fontFamily: "Inter", fontSize: 11.5, color: T.textMid }}>{l.topEngine}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value, sub, status }) {
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ color: T.textLo, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "Inter" }}>{label}</span>
        {status && <span style={{ width: 9, height: 9, borderRadius: "50%", background: STATUS_COLOR[status] }} />}
      </div>
      <div style={{ fontFamily: "Fraunces", fontSize: 22, color: T.textHi, marginBottom: 2 }}>{value}</div>
      {sub && <div style={{ fontFamily: "Inter", fontSize: 11, color: T.textLo }}>{sub}</div>}
    </div>
  );
}

function RepeatRateBar({ rate, status, height = 10 }) {
  const scaleMax = 40;
  const pct = Math.min(100, (rate / scaleMax) * 100);
  const bandStart = (20 / scaleMax) * 100;
  const bandEnd = (30 / scaleMax) * 100;
  return (
    <div style={{ position: "relative", height, background: T.bgRaised, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: `${bandStart}%`, width: `${bandEnd - bandStart}%`, top: 0, bottom: 0, background: T.tan, opacity: 0.7 }} title="Benchmark band 20–30%" />
      <div style={{ position: "relative", width: `${pct}%`, height: "100%", background: STATUS_COLOR[status], borderRadius: 4 }} />
    </div>
  );
}

const PILL = (active) => ({
  background: active ? T.bgRaised : "transparent",
  border: `1px solid ${active ? T.gold : T.line}`,
  color: active ? T.textHi : T.textMid,
  borderRadius: 4, padding: "6px 13px", fontFamily: "Inter", fontSize: 12.5, cursor: "pointer",
});

function LeaderboardSection() {
  const sorted = [...consultants].sort((a, b) => b.revenue - a.revenue);
  const maxRev = sorted[0].revenue;
  const openLeadsFor = (c) => Math.round(c.leads * 0.13) + (c.name.length % 4);
  return (
    <div>
      <SectionLabel sub="Top performers by revenue — stage conversion, split by lead source">Leaderboard</SectionLabel>
      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.5fr 0.6fr 0.7fr 0.7fr 1fr 1.1fr 1fr",
          padding: "10px 18px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em",
          color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter",
        }}>
          <span>Consultant</span><span>Leads</span><span>Open</span><span>Bookings</span><span>Conv. Rate</span><span>Revenue</span><span>Top Source</span>
        </div>
        {sorted.map((c, i) => (
          <div key={c.name} style={{
            display: "grid", gridTemplateColumns: "1.5fr 0.6fr 0.7fr 0.7fr 1fr 1.1fr 1fr",
            padding: "13px 18px", fontSize: 13, fontFamily: "Inter", color: T.textHi,
            alignItems: "center", borderBottom: i < sorted.length - 1 ? `1px solid ${T.line}` : "none",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: T.goldDim, fontFamily: "IBM Plex Mono", fontSize: 11, width: 16 }}>{i + 1}</span>
              {c.name}
            </span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.leads}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.gold }}>{openLeadsFor(c)}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.bookings}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 50, height: 5, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${c.rate * 4}%`, height: "100%", background: T.gold }} />
              </div>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textMid }}>{c.rate}%</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 70, height: 5, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${(c.revenue / maxRev) * 100}%`, height: "100%", background: T.sage }} />
              </div>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{fmt(c.revenue)}</span>
            </span>
            <span style={{ fontSize: 12, color: T.textMid }}>{c.top}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineSection() {
  const [sel, setSel] = useState("all");
  const teamIds = sel === "all"
    ? activityConsultants.map((c) => c.id)
    : activityConsultants.filter((c) => MANAGER_NAMES[c.managerIndex] === sel).map((c) => c.id);
  const agg = pipelineSum(teamIds);
  const managerSummaries = MANAGER_NAMES.map((name, mi) => {
    const ids = activityConsultants.filter((c) => c.managerIndex === mi).map((c) => c.id);
    const p = pipelineSum(ids);
    return { name, ...p, open: p.newLead + p.contacted + p.quoteSent + p.negotiating };
  });
  const selTeam = sel === "all" ? [] : activityConsultants.filter((c) => MANAGER_NAMES[c.managerIndex] === sel);

  return (
    <div>
      <SectionLabel sub="Lead comes in → assigned to consultant → worked through stages → closed">Pipeline Snapshot</SectionLabel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
        {["all", ...MANAGER_NAMES].map((m) => (
          <button key={m} onClick={() => setSel(m)} style={PILL(sel === m)}>{m === "all" ? "All Managers (Company)" : m}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub={sel === "all" ? "Company-wide" : sel}>Snapshot</SectionLabel>
          <PipelineFunnel data={agg} />
        </div>
        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub="6 sales managers · open pipeline vs. closed">Manager Comparison</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.8fr 0.8fr", padding: "6px 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
            <span>Manager</span><span>Open</span><span>Won</span><span>Lost</span>
          </div>
          {managerSummaries.map((m, i, arr) => (
            <div key={m.name} onClick={() => setSel(m.name)} style={{
              display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.8fr 0.8fr", padding: "9px 4px", alignItems: "center",
              cursor: "pointer", background: sel === m.name ? T.bgRaised : "transparent",
              borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : "none",
            }}>
              <span style={{ fontFamily: "Inter", fontSize: 12.5, color: T.textHi }}>{m.name}</span>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.gold }}>{m.open}</span>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.sage }}>{m.closedWon}</span>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.rust }}>{m.closedLost}</span>
            </div>
          ))}
        </div>
      </div>

      {sel !== "all" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub={`${sel} · ${selTeam.length} consultants`}>Pipeline by Consultant</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(6, 0.8fr)", padding: "6px 4px", fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
            <span>Consultant</span><span>New</span><span>Contact</span><span>Quote</span><span>Negot.</span><span>Won</span><span>Lost</span>
          </div>
          {selTeam.map((c, i, arr) => {
            const p = consultantExtras[c.id].pipeline;
            return (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(6, 0.8fr)", padding: "8px 4px", alignItems: "center", borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : "none" }}>
                <span style={{ fontFamily: "Inter", fontSize: 12.5, color: T.textHi }}>{c.name}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{p.newLead}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{p.contacted}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{p.quoteSent}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{p.negotiating}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.sage }}>{p.closedWon}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.rust }}>{p.closedLost}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RepeatCustomersSection() {
  const [openManager, setOpenManager] = useState(null);
  const allIds = activityConsultants.map((c) => c.id);
  const company = repeatSum(allIds);
  const companyRate = company.closedWon ? (company.repeat / company.closedWon) * 100 : 0;
  const companyStatus = repeatStatus(companyRate);

  const managerRows = MANAGER_NAMES.map((name, mi) => {
    const team = activityConsultants.filter((c) => c.managerIndex === mi);
    const r = repeatSum(team.map((c) => c.id));
    const rate = r.closedWon ? (r.repeat / r.closedWon) * 100 : 0;
    return { name, team, ...r, rate, status: repeatStatus(rate) };
  });

  return (
    <div>
      <SectionLabel sub="Share of closed-won bookings from returning customers · benchmark 20–30%">Repeat Customer Rate</SectionLabel>

      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "Fraunces", fontSize: 30, color: T.textHi }}>{companyRate.toFixed(1)}%</div>
            <div style={{ fontFamily: "Inter", fontSize: 11.5, color: T.textLo }}>Company-wide · {company.repeat.toLocaleString()} repeat of {company.closedWon.toLocaleString()} closed-won</div>
          </div>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: STATUS_COLOR[companyStatus], marginTop: 6 }} />
        </div>
        <RepeatRateBar rate={companyRate} status={companyStatus} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, fontFamily: "Inter", color: T.textLo, marginTop: 6 }}>
          <span>0%</span><span>Benchmark band 20–30%</span><span>40%+</span>
        </div>
      </div>

      <SectionLabel sub="Expand a manager to see their consultants">Sales Manager Rollup</SectionLabel>
      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.4fr 1.6fr 1fr 1fr", padding: "10px 16px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
          <span></span><span>Manager</span><span>Repeat / Closed</span><span>Rate</span>
        </div>
        {managerRows.map((r, i) => {
          const isOpen = openManager === r.name;
          return (
            <div key={r.name} style={{ borderBottom: i < managerRows.length - 1 ? `1px solid ${T.line}` : "none" }}>
              <div onClick={() => setOpenManager(isOpen ? null : r.name)} style={{ display: "grid", gridTemplateColumns: "0.4fr 1.6fr 1fr 1fr", padding: "13px 16px", alignItems: "center", cursor: "pointer" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLOR[r.status] }} />
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 13, color: T.textHi }}>
                  {isOpen ? <ChevronDown size={13} color={T.textLo} /> : <ChevronRight size={13} color={T.textLo} />}
                  {r.name}<span style={{ color: T.textLo, fontSize: 11 }}>({r.team.length})</span>
                </span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{r.repeat} / {r.closedWon}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{r.rate.toFixed(1)}%</span>
              </div>
              {isOpen && (
                <div style={{ padding: "0 16px 14px 46px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", padding: "6px 4px", fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, fontFamily: "Inter" }}>
                    <span>Consultant</span><span>Repeat / Closed</span><span>Rate</span>
                  </div>
                  {r.team.map((c) => {
                    const rr = consultantExtras[c.id].repeat;
                    const rate = rr.closedWon ? (rr.repeat / rr.closedWon) * 100 : 0;
                    const status = repeatStatus(rate);
                    return (
                      <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", padding: "8px 4px", alignItems: "center", borderTop: `1px solid ${T.line}` }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 12.5, color: T.textHi }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[status] }} />{c.name}
                        </span>
                        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{rr.repeat} / {rr.closedWon}</span>
                        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{rate.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaceSection() {
  const [period, setPeriod] = useState("day");
  const [openFU, setOpenFU] = useState(null);
  const [openUC, setOpenUC] = useState(null);
  const frac = PERIOD_FRAC[period];
  const mult = PERIOD_MULT[period];
  const fuMetric = METRICS.find((m) => m.key === "followUps");

  const fuCompanyActual = activityConsultants.reduce((a, c) => a + c.metrics.followUps[period], 0);
  const fuCompanyTarget = fuMetric.daily * mult * activityConsultants.length;
  const fuManagerRows = MANAGER_NAMES.map((name, mi) => {
    const team = activityConsultants.filter((c) => c.managerIndex === mi);
    const actual = team.reduce((a, c) => a + c.metrics.followUps[period], 0);
    const target = fuMetric.daily * mult * team.length;
    return { name, team, actual, target, status: paceStatus(actual, target, frac) };
  });

  const allIds = activityConsultants.map((c) => c.id);
  const ucCompany = unconvertedSum(allIds, period);
  const ucCompanyRatio = ucCompany.total ? ucCompany.consultations / ucCompany.total : 0;
  const ucManagerRows = MANAGER_NAMES.map((name, mi) => {
    const team = activityConsultants.filter((c) => c.managerIndex === mi);
    const u = unconvertedSum(team.map((c) => c.id), period);
    const ratio = u.total ? u.consultations / u.total : 0;
    return { name, team, ...u, ratio, status: unconvertedStatus(ratio) };
  });

  const paceCaption = {
    day: "Today · 6 of 8 working hours elapsed (75%)",
    week: "This week · Wed, working day 3 of 5 (55% elapsed)",
    month: "This month · working day 12 of 22 (53% elapsed)",
  }[period];

  return (
    <div>
      <SectionLabel sub="Minimum 3 follow-ups/day per portfolio, and how many unconverted leads already had a consultation">Follow-Ups &amp; Unconverted Leads</SectionLabel>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["day", "Daily"], ["week", "Weekly"], ["month", "Monthly"]].map(([id, label]) => (
            <button key={id} onClick={() => setPeriod(id)} style={PILL(period === id)}>{label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 11.5, fontFamily: "Inter", color: T.textMid, alignItems: "center", flexWrap: "wrap" }}>
          {["green", "amber", "red"].map((s) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[s] }} />{STATUS_LABEL[s]}
            </span>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: T.textLo, fontFamily: "Inter", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
        <Gauge size={12} /> {paceCaption}
      </div>

      <div style={{ marginBottom: 12 }}>
        <SectionLabel sub="Target: 3 follow-ups/day per consultant's portfolio">Follow-Up Compliance</SectionLabel>
      </div>
      <div style={{ marginBottom: 24 }}>
        <ExecMetricCard metric={fuMetric} actual={fuCompanyActual} target={fuCompanyTarget} frac={frac} />
      </div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden", marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.4fr 1.6fr 1fr", padding: "10px 16px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
          <span></span><span>Manager</span><span>Follow-Ups</span>
        </div>
        {fuManagerRows.map((r, i) => {
          const isOpen = openFU === r.name;
          return (
            <div key={r.name} style={{ borderBottom: i < fuManagerRows.length - 1 ? `1px solid ${T.line}` : "none" }}>
              <div onClick={() => setOpenFU(isOpen ? null : r.name)} style={{ display: "grid", gridTemplateColumns: "0.4fr 1.6fr 1fr", padding: "13px 16px", alignItems: "center", cursor: "pointer" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLOR[r.status] }} />
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 13, color: T.textHi }}>
                  {isOpen ? <ChevronDown size={13} color={T.textLo} /> : <ChevronRight size={13} color={T.textLo} />}
                  {r.name}<span style={{ color: T.textLo, fontSize: 11 }}>({r.team.length})</span>
                </span>
                <MetricCell metric={fuMetric} actual={r.actual} target={r.target} frac={frac} />
              </div>
              {isOpen && (
                <div style={{ padding: "0 16px 14px 46px" }}>
                  {r.team.map((c) => (
                    <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", padding: "6px 4px", alignItems: "center", borderTop: `1px solid ${T.line}` }}>
                      <span style={{ fontFamily: "Inter", fontSize: 12.5, color: T.textHi }}>{c.name}</span>
                      <MetricCell metric={fuMetric} actual={c.metrics.followUps[period]} target={fuMetric.daily * mult} frac={frac} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 12 }}>
        <SectionLabel sub="How many unconverted leads already had a quote/consultation before stalling">Unconverted Leads</SectionLabel>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 24 }}>
        <StatusCard label="Total Unconverted" value={ucCompany.total.toLocaleString()} sub="Open or closed-lost, this period" />
        <StatusCard label="Unconverted After Consultation" value={ucCompany.consultations.toLocaleString()} sub="Quote sent or negotiating, then stalled" />
        <StatusCard label="Stall Ratio" value={`${(ucCompanyRatio * 100).toFixed(0)}%`} sub="Share of unconverted that got a consultation" status={unconvertedStatus(ucCompanyRatio)} />
      </div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.4fr 1.6fr 1fr 1fr 1fr", padding: "10px 16px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
          <span></span><span>Manager</span><span>Unconverted</span><span>After Consult</span><span>Ratio</span>
        </div>
        {ucManagerRows.map((r, i) => {
          const isOpen = openUC === r.name;
          return (
            <div key={r.name} style={{ borderBottom: i < ucManagerRows.length - 1 ? `1px solid ${T.line}` : "none" }}>
              <div onClick={() => setOpenUC(isOpen ? null : r.name)} style={{ display: "grid", gridTemplateColumns: "0.4fr 1.6fr 1fr 1fr 1fr", padding: "13px 16px", alignItems: "center", cursor: "pointer" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLOR[r.status] }} />
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 13, color: T.textHi }}>
                  {isOpen ? <ChevronDown size={13} color={T.textLo} /> : <ChevronRight size={13} color={T.textLo} />}
                  {r.name}<span style={{ color: T.textLo, fontSize: 11 }}>({r.team.length})</span>
                </span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{r.total}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{r.consultations}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{(r.ratio * 100).toFixed(0)}%</span>
              </div>
              {isOpen && (
                <div style={{ padding: "0 16px 14px 46px" }}>
                  {r.team.map((c) => {
                    const u = consultantExtras[c.id].unconverted[period];
                    const ratio = u.total ? u.consultations / u.total : 0;
                    return (
                      <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", padding: "6px 4px", alignItems: "center", borderTop: `1px solid ${T.line}` }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 12.5, color: T.textHi }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[unconvertedStatus(ratio)] }} />{c.name}
                        </span>
                        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{u.total}</span>
                        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{u.consultations}</span>
                        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{(ratio * 100).toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LowQualitySection() {
  const allFlags = activityConsultants.flatMap((c) => consultantExtras[c.id].lowQuality.map((lq) => ({ ...lq, consultant: c.name })));
  const reasonCounts = {};
  allFlags.forEach((f) => { reasonCounts[f.reason] = (reasonCounts[f.reason] || 0) + 1; });
  const reasonList = Object.entries(reasonCounts).map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
  const maxReason = Math.max(...reasonList.map((r) => r.count), 1);

  const topOf = (tally) => Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
  const perConsultant = activityConsultants.map((c) => {
    const flags = consultantExtras[c.id].lowQuality;
    if (!flags.length) return null;
    const reasonTally = {}, campaignTally = {}, marketTally = {};
    flags.forEach((f) => {
      reasonTally[f.reason] = (reasonTally[f.reason] || 0) + 1;
      campaignTally[f.campaign] = (campaignTally[f.campaign] || 0) + 1;
      marketTally[f.market] = (marketTally[f.market] || 0) + 1;
    });
    return { name: c.name, count: flags.length, topReason: topOf(reasonTally), topCampaign: topOf(campaignTally), topMarket: topOf(marketTally) };
  }).filter(Boolean).sort((a, b) => b.count - a.count);
  const shown = perConsultant.slice(0, 20);

  return (
    <div>
      <SectionLabel sub="Leads consultants have flagged as low quality, with reason, campaign (UTM), and market">Low Quality Leads</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub={`${allFlags.length} flagged leads, company-wide`}>By Reason</SectionLabel>
          {reasonList.map((r) => (
            <div key={r.reason} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, fontFamily: "Inter", color: T.textHi }}>
                <span>{r.reason}</span><span style={{ fontFamily: "IBM Plex Mono", color: T.textMid }}>{r.count}</span>
              </div>
              <div style={{ height: 6, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${(r.count / maxReason) * 100}%`, height: "100%", background: T.rust }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          <StatusCard label="Total Flagged" value={allFlags.length.toLocaleString()} sub={`Across ${perConsultant.length} of ${activityConsultants.length} consultants`} />
          <StatusCard label="Top Reason" value={reasonList[0] ? reasonList[0].reason : "—"} sub={reasonList[0] ? `${reasonList[0].count} leads` : ""} />
        </div>
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
        <SectionLabel sub={`Top ${shown.length} of ${perConsultant.length} consultants with flagged leads, by count`}>By Consultant</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr 1.4fr 1.3fr 1fr", padding: "8px 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
          <span>Consultant</span><span>Count</span><span>Top Reason</span><span>Top Campaign (UTM)</span><span>Top Market</span>
        </div>
        {shown.map((c, i, arr) => (
          <div key={c.name} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr 1.4fr 1.3fr 1fr", padding: "10px 4px", alignItems: "center", borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : "none" }}>
            <span style={{ fontFamily: "Inter", fontSize: 12.5, color: T.textHi }}>{c.name}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.rust }}>{c.count}</span>
            <span style={{ fontFamily: "Inter", fontSize: 12, color: T.textMid }}>{c.topReason}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: T.textMid }}>{c.topCampaign}</span>
            <span style={{ fontFamily: "Inter", fontSize: 12, color: T.textMid }}>{c.topMarket}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsultantsTab() {
  const [view, setView] = useState("leaderboard");
  const views = [
    { id: "leaderboard", label: "Leaderboard" },
    { id: "pipeline", label: "Pipeline" },
    { id: "repeat", label: "Repeat Customers" },
    { id: "pace", label: "Follow-Ups & Unconverted" },
    { id: "lowquality", label: "Low Quality Leads" },
  ];
  return (
    <div>
      <SectionLabel sub="Everything tracked at the consultant level — performance, pipeline, and lead quality">Consultants</SectionLabel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 26 }}>
        {views.map((v) => (
          <button key={v.id} onClick={() => setView(v.id)} style={PILL(view === v.id)}>{v.label}</button>
        ))}
      </div>
      {view === "leaderboard" && <LeaderboardSection />}
      {view === "pipeline" && <PipelineSection />}
      {view === "repeat" && <RepeatCustomersSection />}
      {view === "pace" && <PaceSection />}
      {view === "lowquality" && <LowQualitySection />}
    </div>
  );
}

function AudienceTab() {
  return (
    <div>
      <SectionLabel sub="First-party contacts, segmented from confirmed CRM data and synced to ad platforms daily">Audience &amp; Retargeting</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 28 }}>
        {segments.map((s) => (
          <div key={s.name} style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 18 }}>
            <div style={{ fontFamily: "Fraunces", fontSize: 15, color: T.textHi, marginBottom: 4 }}>{s.name}</div>
            <div style={{ fontSize: 11.5, color: T.textLo, fontFamily: "Inter", marginBottom: 14, lineHeight: 1.4 }}>{s.desc}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "IBM Plex Mono", fontSize: 20, color: T.gold }}>{s.size.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: T.textLo, fontFamily: "Inter", textTransform: "uppercase", letterSpacing: "0.04em" }}>contacts</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "IBM Plex Mono", fontSize: 13, color: T.textMid }}>{s.match}%</div>
                <div style={{ fontSize: 10, color: T.textLo, fontFamily: "Inter" }}>match rate</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {s.platforms.map((p) => (
                <span key={p} style={{
                  fontSize: 10.5, padding: "2px 7px", borderRadius: 3, fontFamily: "Inter",
                  background: T.bgRaised, border: `1px solid ${T.line}`, color: T.textMid,
                  display: "flex", alignItems: "center", gap: 4,
                }}><RefreshCw size={9} /> {p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
        <SectionLabel sub="Creative linked to the contact it acquired — ranked by booking rate, not lead volume">Creative Winners</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.8fr 0.8fr 1fr", padding: "8px 4px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
          <span>Ad</span><span>Platform</span><span>Leads</span><span>Bookings</span><span>Booking Rate</span>
        </div>
        {[...creatives].sort((a, b) => b.bookRate - a.bookRate).map((c, i, arr) => (
          <div key={c.ad} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.8fr 0.8fr 1fr", padding: "12px 4px", alignItems: "center", borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : "none" }}>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.ad}</span>
            <span style={{ fontFamily: "Inter", fontSize: 12.5, color: T.textMid }}>{c.platform}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.leads}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.bookings}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 60, height: 5, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${c.bookRate * 5}%`, height: "100%", background: c.bookRate >= 12 ? T.sage : T.rust }} />
              </div>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.bookRate}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCell({ metric, actual, target, frac }) {
  const status = paceStatus(actual, target, frac);
  const display = metric.currency ? fmt(actual) : actual.toLocaleString();
  const displayTarget = metric.currency ? fmt(target) : target.toLocaleString();
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[status], flexShrink: 0 }} />
      <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{display}</span>
      <span style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: T.textLo }}>/{displayTarget}</span>
    </span>
  );
}

function ExecMetricCard({ metric, actual, target, frac }) {
  const status = paceStatus(actual, target, frac);
  const pctToTarget = Math.min(100, (actual / target) * 100);
  const expectedPct = Math.min(100, frac * 100);
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ color: T.textLo, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "Inter" }}>{metric.label}</span>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: STATUS_COLOR[status] }} />
      </div>
      <div style={{ fontFamily: "Fraunces", fontSize: 22, color: T.textHi, marginBottom: 2 }}>
        {metric.currency ? fmt(actual) : actual.toLocaleString()}
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 11, color: T.textLo, marginBottom: 10 }}>
        of {metric.currency ? fmt(target) : target.toLocaleString()} target
      </div>
      <div style={{ position: "relative", height: 6, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pctToTarget}%`, height: "100%", background: STATUS_COLOR[status], borderRadius: 3 }} />
        <div style={{ position: "absolute", left: `${expectedPct}%`, top: -2, width: 2, height: 10, background: T.textHi, opacity: 0.55 }} title="Expected-to-date pace" />
      </div>
    </div>
  );
}

function ActivityTab() {
  const [period, setPeriod] = useState("day");
  const [openManager, setOpenManager] = useState(null);
  const frac = PERIOD_FRAC[period];
  const mult = PERIOD_MULT[period];

  const paceCaption = {
    day: "Today · 6 of 8 working hours elapsed (75%)",
    week: "This week · Wed, working day 3 of 5 (55% elapsed)",
    month: "This month · working day 12 of 22 (53% elapsed)",
  }[period];

  const companyMetrics = METRICS.map((m) => {
    const actual = activityConsultants.reduce((a, c) => a + c.metrics[m.key][period], 0);
    const target = m.daily * mult * activityConsultants.length;
    return { ...m, actual, target };
  });

  const managerRows = MANAGER_NAMES.map((name, mi) => {
    const team = activityConsultants.filter((c) => c.managerIndex === mi);
    const metricsAgg = METRICS.map((m) => {
      const actual = team.reduce((a, c) => a + c.metrics[m.key][period], 0);
      const target = m.daily * mult * team.length;
      return { ...m, actual, target, status: paceStatus(actual, target, frac) };
    });
    return { name, team, metricsAgg, overall: worstStatus(metricsAgg.map((x) => x.status)) };
  });

  return (
    <div>
      <SectionLabel sub="Daily activity reports, rolled up by consultant, sales manager, and company-wide">Consultant Activity &amp; Targets</SectionLabel>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["day", "Daily"], ["week", "Weekly"], ["month", "Monthly"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              style={{
                background: period === id ? T.bgRaised : "transparent",
                border: `1px solid ${period === id ? T.gold : T.line}`,
                color: period === id ? T.textHi : T.textMid,
                borderRadius: 4, padding: "6px 14px", fontFamily: "Inter", fontSize: 12.5, cursor: "pointer",
              }}
            >{label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 11.5, fontFamily: "Inter", color: T.textMid, alignItems: "center", flexWrap: "wrap" }}>
          {["green", "amber", "red"].map((s) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[s] }} />
              {STATUS_LABEL[s]}
            </span>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: T.textLo, fontFamily: "Inter", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
        <Gauge size={12} /> {paceCaption} — expected-to-date pace recalculates daily off working days in the period
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 34 }}>
        {companyMetrics.map((m) => (
          <ExecMetricCard key={m.key} metric={m} actual={m.actual} target={m.target} frac={frac} />
        ))}
      </div>

      <SectionLabel sub={`6 sales managers · ${CONSULTANTS_PER_MANAGER} consultants each · ${activityConsultants.length} total`}>Sales Manager Rollup</SectionLabel>
      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "0.4fr 1.6fr repeat(6, 1fr)",
          padding: "10px 16px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em",
          color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter",
        }}>
          <span></span><span>Manager</span>
          {METRICS.map((m) => <span key={m.key}>{m.short}</span>)}
        </div>
        {managerRows.map((r, i) => {
          const isOpen = openManager === r.name;
          return (
            <div key={r.name} style={{ borderBottom: i < managerRows.length - 1 ? `1px solid ${T.line}` : "none" }}>
              <div
                onClick={() => setOpenManager(isOpen ? null : r.name)}
                style={{
                  display: "grid", gridTemplateColumns: "0.4fr 1.6fr repeat(6, 1fr)",
                  padding: "13px 16px", alignItems: "center", cursor: "pointer",
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLOR[r.overall] }} />
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 13, color: T.textHi }}>
                  {isOpen ? <ChevronDown size={13} color={T.textLo} /> : <ChevronRight size={13} color={T.textLo} />}
                  {r.name}
                  <span style={{ color: T.textLo, fontSize: 11 }}>({r.team.length})</span>
                </span>
                {r.metricsAgg.map((m) => <MetricCell key={m.key} metric={m} actual={m.actual} target={m.target} frac={frac} />)}
              </div>
              {isOpen && (
                <div style={{ padding: "0 16px 14px 46px" }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1.5fr repeat(6, 1fr)",
                    padding: "6px 4px", fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.04em",
                    color: T.textLo, fontFamily: "Inter",
                  }}>
                    <span>Consultant</span>
                    {METRICS.map((m) => <span key={m.key}>{m.short}</span>)}
                  </div>
                  {r.team.map((c) => {
                    const rowMetrics = METRICS.map((m) => ({ ...m, actual: c.metrics[m.key][period], target: m.daily * mult }));
                    return (
                      <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(6, 1fr)", padding: "8px 4px", alignItems: "center", borderTop: `1px solid ${T.line}` }}>
                        <span style={{ fontFamily: "Inter", fontSize: 12.5, color: T.textHi }}>{c.name}</span>
                        {rowMetrics.map((m) => <MetricCell key={m.key} metric={m} actual={m.actual} target={m.target} frac={frac} />)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipelineFunnel({ data, lostLabel = "Closed Lost (this period)" }) {
  const stages = [
    { label: "New Lead", count: data.newLead },
    { label: "Contacted", count: data.contacted },
    { label: "Quote Sent", count: data.quoteSent },
    { label: "Negotiating", count: data.negotiating },
    { label: "Closed Won", count: data.closedWon },
  ];
  const max = Math.max(...stages.map((s) => s.count), 1);
  return (
    <div>
      {stages.map((s, i) => (
        <div key={s.label} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, fontFamily: "Inter" }}>
            <span style={{ color: T.textHi }}>{s.label}</span>
            <span style={{ fontFamily: "IBM Plex Mono", color: T.textMid }}>{s.count.toLocaleString()}</span>
          </div>
          <div style={{ height: 8, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              width: `${(s.count / max) * 100}%`, height: "100%", borderRadius: 3,
              background: i === stages.length - 1 ? T.sage : T.gold,
            }} />
          </div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontFamily: "Inter", color: T.rust, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.line}` }}>
        <span>{lostLabel}</span>
        <span style={{ fontFamily: "IBM Plex Mono" }}>{data.closedLost.toLocaleString()}</span>
      </div>
    </div>
  );
}

function SeasonalityChart({ market }) {
  const data = MONTHS.map((m) => ({ month: m, count: market.monthCounts[m] || 0 }));
  return (
    <div>
      <div style={{ display: "flex", gap: 14, fontSize: 11, fontFamily: "Inter", color: T.textMid, marginBottom: 10, flexWrap: "wrap" }}>
        {["peak", "shoulder", "off"].map((s) => (
          <span key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: SEASON_COLOR[s] }} />
            {SEASON_LABEL[s]}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={data} margin={{ left: -20, right: 10 }}>
          <CartesianGrid stroke={T.line} vertical={false} />
          <XAxis dataKey="month" stroke={T.textLo} fontSize={10.5} tickLine={false} axisLine={{ stroke: T.line }} fontFamily="Inter" />
          <YAxis stroke={T.textLo} fontSize={10.5} tickLine={false} axisLine={false} fontFamily="Inter" />
          <Tooltip contentStyle={{ background: T.bgRaised, border: `1px solid ${T.line}`, borderRadius: 4, fontFamily: "Inter", fontSize: 12 }} labelStyle={{ color: T.textHi }} />
          <Bar dataKey="count" name="Trips" radius={[3, 3, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={SEASON_COLOR[SEASON_BAND[d.month]]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ fontSize: 10.5, color: T.textLo, fontFamily: "Inter", marginTop: 8, fontStyle: "italic" }}>
        * October wasn't specified in the brief (Peak Nov–Mar, Off-Peak May–Aug, Shoulder Apr &amp; Sep) — shown here as Shoulder. Flag if it should sit elsewhere.
      </div>
    </div>
  );
}

function MarketsTab() {
  const [selected, setSelected] = useState("all");
  const market = selected === "all" ? allMarketsData : marketData[selected];
  const label = selected === "all" ? "All Markets" : MARKETS.find((m) => m.key === selected).label;
  const cac = market.totalBookings ? market.totalSpend / market.totalBookings : 0;
  const roas = market.totalSpend ? market.totalRevenue / market.totalSpend : null;
  const avgDeal = market.totalBookings ? market.totalRevenue / market.totalBookings : 0;
  const topConsultants = topConsultantsForMarket(market);
  const tripTypes = tripTypeBreakdown(market);
  const maxTripType = Math.max(...tripTypes.map((t) => t.count), 1);

  return (
    <div>
      <SectionLabel sub="Everything already in the dashboard, sliced by market — plus pipeline, trip detail, and seasonality">Markets</SectionLabel>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
        {[{ key: "all", label: "All Markets" }, ...MARKETS].map((m) => (
          <button
            key={m.key}
            onClick={() => setSelected(m.key)}
            style={{
              background: selected === m.key ? T.bgRaised : "transparent",
              border: `1px solid ${selected === m.key ? T.gold : T.line}`,
              color: selected === m.key ? T.textHi : T.textMid,
              borderRadius: 4, padding: "6px 13px", fontFamily: "Inter", fontSize: 12.5, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            {m.key === "all" && <Globe size={12} />} {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
        <KpiCard label="Leads" value={market.totalLeads.toLocaleString()} icon={Users} />
        <KpiCard label="Open Leads" value={market.openLeads.toLocaleString()} icon={Radio} />
        <KpiCard label="Bookings" value={market.totalBookings.toLocaleString()} icon={CheckCircle2} />
        <KpiCard label="Revenue" value={fmt(market.totalRevenue)} icon={DollarSign} />
        <KpiCard label="Blended CAC" value={fmt(cac)} icon={Target} />
        <KpiCard label="Blended ROAS" value={roas ? `${roas.toFixed(1)}x` : "—"} icon={TrendingUp} />
        <KpiCard label="Avg Deal Value" value={fmt(avgDeal)} icon={DollarSign} />
        <KpiCard label="Avg Value / Traveller" value={fmt(market.avgValuePerTraveller)} icon={Users} />
        <KpiCard label="Avg Days to Close" value={`${market.avgDaysToClose.toFixed(0)}d`} icon={Timer} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub={`${label} · spend, leads, bookings by channel`}>Channel Mix</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr 0.7fr 0.7fr 0.8fr", padding: "8px 4px", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
            <span>Channel</span><span>Spend</span><span>Leads</span><span>Bookings</span><span>ROAS</span>
          </div>
          {market.channelMix.map((c, i, arr) => {
            const cRoas = c.spend ? c.revenue / c.spend : null;
            return (
              <div key={c.name} style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr 0.7fr 0.7fr 0.8fr", padding: "10px 4px", alignItems: "center", borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : "none" }}>
                <span style={{ fontFamily: "Inter", fontSize: 12.5, color: T.textHi }}>{c.name}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.spend ? fmt(c.spend) : "—"}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.leads}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.bookings}</span>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: cRoas && cRoas >= 8 ? T.sage : T.textMid }}>{cRoas ? `${cRoas.toFixed(1)}x` : "—"}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub={`${label} · lead comes in → assigned → worked → closed`}>Pipeline Snapshot</SectionLabel>
          <PipelineFunnel data={{ newLead: market.newLead, contacted: market.contacted, quoteSent: market.quoteSent, negotiating: market.negotiating, closedWon: market.totalBookings, closedLost: market.closedLost }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub={`${label} · travel month distribution, from consultant-entered trip dates`}>Seasonality</SectionLabel>
          <SeasonalityChart market={market} />
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
          <SectionLabel sub={`${label} · from consultant-entered trip type, nights, stops, PAX`}>Trip Profile</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "Fraunces", fontSize: 20, color: T.textHi }}>{market.avgNights.toFixed(1)}</div>
              <div style={{ fontSize: 10.5, color: T.textLo, fontFamily: "Inter", textTransform: "uppercase", letterSpacing: "0.04em" }}>Avg Nights</div>
            </div>
            <div>
              <div style={{ fontFamily: "Fraunces", fontSize: 20, color: T.textHi }}>{market.avgStops.toFixed(1)}</div>
              <div style={{ fontSize: 10.5, color: T.textLo, fontFamily: "Inter", textTransform: "uppercase", letterSpacing: "0.04em" }}>Avg Stops</div>
            </div>
            <div>
              <div style={{ fontFamily: "Fraunces", fontSize: 20, color: T.textHi }}>{market.avgPax.toFixed(1)}</div>
              <div style={{ fontSize: 10.5, color: T.textLo, fontFamily: "Inter", textTransform: "uppercase", letterSpacing: "0.04em" }}>Avg PAX</div>
            </div>
            <div>
              <div style={{ fontFamily: "Fraunces", fontSize: 20, color: T.textHi }}>{market.trips.length}</div>
              <div style={{ fontSize: 10.5, color: T.textLo, fontFamily: "Inter", textTransform: "uppercase", letterSpacing: "0.04em" }}>Trips Logged</div>
            </div>
          </div>
          <div style={{ fontSize: 10.5, color: T.textLo, fontFamily: "Inter", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Trip Type Mix</div>
          {tripTypes.map((t) => (
            <div key={t.type} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontFamily: "Inter", color: T.textMid, marginBottom: 3 }}>
                <span>{t.type}</span><span style={{ fontFamily: "IBM Plex Mono" }}>{t.count}</span>
              </div>
              <div style={{ height: 5, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${(t.count / maxTripType) * 100}%`, height: "100%", background: T.goldDim }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
        <SectionLabel sub={`${label} · ranked by revenue closed in this market`}>Top Consultants</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 1fr 0.8fr", padding: "8px 4px", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.04em", color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter" }}>
          <span>Consultant</span><span>Bookings</span><span>Revenue</span><span>Total PAX</span>
        </div>
        {topConsultants.length === 0 ? (
          <div style={{ padding: "16px 4px", fontSize: 12.5, color: T.textLo, fontFamily: "Inter" }}>No closed bookings logged for this market yet.</div>
        ) : topConsultants.map((c, i, arr) => (
          <div key={c.name} style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 1fr 0.8fr", padding: "10px 4px", alignItems: "center", borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : "none" }}>
            <span style={{ fontFamily: "Inter", fontSize: 12.5, color: T.textHi }}>{c.name}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.bookings}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{fmt(c.revenue)}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.textHi }}>{c.pax}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- app ----------
export default function App() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "channels", label: "Channels & Attribution" },
    { id: "consultants", label: "Consultants" },
    { id: "activity", label: "Activity & Targets" },
    { id: "markets", label: "Markets" },
    { id: "audience", label: "Audience & Retargeting" },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{fontImport}</style>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 60px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", border: `1px solid ${T.gold}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Compass size={18} color={T.gold} />
            </div>
            <div>
              <div style={{ fontFamily: "Fraunces", fontSize: 21, color: T.textHi, letterSpacing: "0.01em" }}>ASG Growth Dashboard</div>
              <div style={{ fontFamily: "Inter", fontSize: 11.5, color: T.textLo }}>Full-funnel attribution · consultants · audiences</div>
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "Inter",
            color: T.rust, border: `1px solid ${T.rust}`, borderRadius: 3, padding: "5px 10px",
          }}>
            <Sparkles size={12} /> Example build — illustrative data
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${T.line}`, marginTop: 24, marginBottom: 28, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "10px 16px", fontFamily: "Inter", fontSize: 13,
                color: tab === t.id ? T.textHi : T.textLo,
                borderBottom: tab === t.id ? `2px solid ${T.gold}` : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab />}
        {tab === "channels" && <ChannelsTab />}
        {tab === "consultants" && <ConsultantsTab />}
        {tab === "activity" && <ActivityTab />}
        {tab === "markets" && <MarketsTab />}
        {tab === "audience" && <AudienceTab />}

        <div style={{ marginTop: 40, paddingTop: 16, borderTop: `1px solid ${T.line}`, display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textLo, fontFamily: "Inter" }}>
          <span>ASG Growth Dashboard — Example</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>Built for proposal walkthrough <ExternalLink size={11} /></span>
        </div>
      </div>
    </div>
  );
}
