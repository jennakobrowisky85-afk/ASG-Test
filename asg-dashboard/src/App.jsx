import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  Compass, TrendingUp, TrendingDown, Users, Target, DollarSign,
  ChevronDown, ChevronRight, ArrowUpRight, Radio, Sparkles, RefreshCw,
  CheckCircle2, Circle, Clock, ExternalLink, Gauge,
} from "lucide-react";

// ---------- design tokens ----------
const T = {
  bg: "#15120D",
  bgRaised: "#1D1912",
  bgCard: "#211C15",
  line: "#332C20",
  gold: "#C9A24B",
  goldDim: "#8A7440",
  tan: "#E4D4AE",
  rust: "#B5601F",
  sage: "#7C9070",
  textHi: "#F3ECDD",
  textMid: "#B9AC90",
  textLo: "#7C7360",
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

const decisions = [
  { title: "Digital Performance Lead hire spec", status: "done" },
  { title: "Horizon 1 budget envelope — Meta test spend, nurture tooling", status: "done" },
  { title: "Referral programme incentive mechanics", status: "progress" },
  { title: "First tranche of domains — authority-site buildout", status: "pending" },
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
    </div>
  );
}

function ConsultantsTab() {
  const sorted = [...consultants].sort((a, b) => b.revenue - a.revenue);
  const maxRev = sorted[0].revenue;
  return (
    <div>
      <SectionLabel sub="Stage conversion and revenue, split by lead source — separates a consultant problem from a lead-quality problem">Consultant Performance</SectionLabel>
      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.6fr 0.7fr 0.7fr 1fr 1.2fr 1fr",
          padding: "10px 18px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em",
          color: T.textLo, borderBottom: `1px solid ${T.line}`, fontFamily: "Inter",
        }}>
          <span>Consultant</span><span>Leads</span><span>Bookings</span><span>Conv. Rate</span><span>Revenue</span><span>Top Source</span>
        </div>
        {sorted.map((c, i) => (
          <div key={c.name} style={{
            display: "grid", gridTemplateColumns: "1.6fr 0.7fr 0.7fr 1fr 1.2fr 1fr",
            padding: "13px 18px", fontSize: 13, fontFamily: "Inter", color: T.textHi,
            alignItems: "center", borderBottom: i < sorted.length - 1 ? `1px solid ${T.line}` : "none",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: T.goldDim, fontFamily: "IBM Plex Mono", fontSize: 11, width: 16 }}>{i + 1}</span>
              {c.name}
            </span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{c.leads}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{c.bookings}</span>
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
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{fmt(c.revenue)}</span>
            </span>
            <span style={{ fontSize: 12, color: T.textMid }}>{c.top}</span>
          </div>
        ))}
      </div>
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
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{c.leads}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{c.bookings}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 60, height: 5, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${c.bookRate * 5}%`, height: "100%", background: c.bookRate >= 12 ? T.sage : T.rust }} />
              </div>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{c.bookRate}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DecisionsTab() {
  const icon = (s) => s === "done" ? <CheckCircle2 size={16} color={T.sage} /> : s === "progress" ? <Clock size={16} color={T.gold} /> : <Circle size={16} color={T.textLo} />;
  return (
    <div>
      <SectionLabel sub="Live status of Horizon 1 approvals">Decisions Needed Now</SectionLabel>
      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden", marginBottom: 28 }}>
        {decisions.map((d, i) => (
          <div key={d.title} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
            borderBottom: i < decisions.length - 1 ? `1px solid ${T.line}` : "none",
          }}>
            {icon(d.status)}
            <span style={{ fontFamily: "Inter", fontSize: 13.5, color: d.status === "pending" ? T.textMid : T.textHi }}>{d.title}</span>
            <span style={{
              marginLeft: "auto", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.05em",
              color: d.status === "done" ? T.sage : d.status === "progress" ? T.gold : T.textLo, fontFamily: "Inter",
            }}>{d.status === "progress" ? "in progress" : d.status}</span>
          </div>
        ))}
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: 6, padding: 22 }}>
        <SectionLabel sub="Approved envelope vs. actual, Horizon 1">Budget Pacing</SectionLabel>
        {[
          { name: "Meta test spend", approved: 200000, actual: 184000 },
          { name: "Nurture tooling", approved: 45000, actual: 41000 },
          { name: "DV360 pilot", approved: 80000, actual: 62000 },
        ].map((b) => (
          <div key={b.name} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5, fontFamily: "Inter", color: T.textHi }}>
              <span>{b.name}</span>
              <span style={{ fontFamily: "IBM Plex Mono", color: T.textMid }}>{fmt(b.actual)} / {fmt(b.approved)}</span>
            </div>
            <div style={{ height: 7, background: T.bgRaised, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(b.actual / b.approved) * 100}%`, height: "100%", background: b.actual > b.approved ? T.rust : T.gold, borderRadius: 3 }} />
            </div>
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

// ---------- app ----------
export default function App() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "channels", label: "Channels & Attribution" },
    { id: "consultants", label: "Consultants" },
    { id: "activity", label: "Activity & Targets" },
    { id: "audience", label: "Audience & Retargeting" },
    { id: "decisions", label: "Decisions & Budget" },
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
        {tab === "audience" && <AudienceTab />}
        {tab === "decisions" && <DecisionsTab />}

        <div style={{ marginTop: 40, paddingTop: 16, borderTop: `1px solid ${T.line}`, display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textLo, fontFamily: "Inter" }}>
          <span>ASG Growth Dashboard — Example</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>Built for proposal walkthrough <ExternalLink size={11} /></span>
        </div>
      </div>
    </div>
  );
}
