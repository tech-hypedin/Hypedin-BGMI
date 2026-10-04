/**
 * BGMI Campus MVP — program content
 * Single source of truth for the public site, ported verbatim from the
 * "BGMI Campus MVP — Ambassador Program · SOP" deck.
 * Icon fields are lucide-react component names (no emoji as icons).
 */

export const PROGRAM_NAME = "BGMI Campus MVP";
/** First prominent on-page use carries the ® mark (brand legal guidelines). */
export const PROGRAM_NAME_TM = "BGMI® Campus MVP";
export const LEGAL_LINE =
	"BGMI is a registered trademark or service mark of KRAFTON, Inc.";
export const COPYRIGHT_LINE = "© 2026 KRAFTON, Inc. All rights reserved.";

/** Hero HUD readouts */
export const HERO_STATS = [
	{ value: 50, label: "Campuses" },
	{ value: 150, label: "Ambassadors" },
	{ value: 90, label: "Days" },
	{ value: 3, label: "Phases" },
] as const;

export const HERO_TAGLINE = "YOUR CAMPUS · YOUR COMMUNITY · YOUR GAME";

/** Mission-brief stat block */
export const BRIEF_STATS = [
	{ value: 15, label: "Players in your community" },
	{ value: 90, label: "Days to build" },
	{ value: 8, label: "Rank tiers to climb" },
	{ value: 9175, label: "RP to earn" },
] as const;

/** Section 01 — Why You're Here (deck Objectives) */
export const OBJECTIVES = [
	{ icon: "Users", title: "Build Your Community", detail: "Grow an active BGMI community on your campus." },
	{ icon: "Swords", title: "Keep It Active", detail: "Keep the games and content flowing all season." },
	{ icon: "TrendingUp", title: "Climb The Ranks", detail: "Earn RP and rank up on merit, phase by phase." },
	{ icon: "Flame", title: "Grow The Scene", detail: "Make BGMI part of everyday campus culture." },
	{ icon: "Trophy", title: "Lead Nationally", detail: "Top members join BGMI for the long run." },
] as const;

/** Section 02 — What You Do (deck Duties) */
export const DUTIES = [
	{ icon: "Users", title: "Grow the Community", detail: "Build & look after your players all season." },
	{ icon: "ScanLine", title: "Collect UIDs", detail: "Submit every player BGMI UID to the POC." },
	{ icon: "Swords", title: "Host the Games", detail: "Organise Classic, TDM & offline sessions." },
	{ icon: "Video", title: "Make Content", detail: "Create in-game reels every phase." },
	{ icon: "Camera", title: "Submit Proof", detail: "Screenshots & evidence for every RP claim." },
	{ icon: "MapPin", title: "Meet in Person", detail: "Host one on-ground meetup in Phase 2." },
	{ icon: "Trophy", title: "Host the Cup", detail: "Run the inter-department tournament in Phase 3." },
	{ icon: "ShieldCheck", title: "Play Fair", detail: "Hold the line on the Code of Conduct." },
] as const;

/** Section 02 — Code of Conduct */
export const CONDUCT = {
	do: [
		"Interact with all community members.",
		"Encourage squads & healthy rivalries.",
		"Keep the WhatsApp group inclusive.",
		"Zero tolerance for hacks or mods.",
		"Follow all POC communication guidelines.",
	],
	dont: [
		"Misuse channels for self-promotion.",
		"Exclude registered participants.",
		"Show favouritism in selection.",
		"Submit fake screenshots or numbers.",
		"Trash-talk other campuses.",
	],
	enforce:
		"Breaking the code means RP deduction, rank freeze, or disqualification — at the authorities' discretion.",
} as const;

/** The Season — 90 days, three phases */
export const TIMELINE = [
	{
		phase: "Phase 1",
		name: "Foundation",
		dates: "15 Jul – 14 Aug",
		detail:
			"Bring players together, settle into a gameplay rhythm, and create your first wave of campus content.",
		chips: ["Community", "Classic Matches", "Content"],
	},
	{
		phase: "Phase 2",
		name: "Expansion",
		dates: "15 Aug – 14 Sep",
		detail:
			"Faster TDM, a push to keep players around, and your community's biggest in-person meetup — through mid-terms.",
		chips: ["TDM", "Retention", "Meetup"],
	},
	{
		phase: "Phase 3",
		name: "Championship",
		dates: "15 Sep – 14 Oct",
		detail:
			"Run the tournament and go campus-vs-campus. Highest RP, biggest rewards.",
		chips: ["Shoutout", "Tournament", "Rivalry"],
	},
] as const;

/** The 90-Day Engine — phase tasks (RP shown is the phase minimum) */
export interface Task {
	tk: string;
	name: string;
	unit: string;
	rp: number;
	max: number;
	detail: string;
	params: [string, string, boolean?][];
}
export interface Phase {
	min: string;
	cum: number;
	dates: string;
	label: string;
	bonus?: [string, string][];
	tasks: Task[];
}

export const PHASES: Phase[] = [
	{
		min: "2,175", cum: 2175, dates: "15 Jul – 14 Aug", label: "P1 · Foundation",
		tasks: [
			{ tk: "1.1", name: "Community Building", unit: "25 RP / player", rp: 375, max: 1000, detail: "15 players into a WhatsApp squad — collect & submit UIDs to POC.", params: [["Target", "15 players"], ["Campus total", "45 players"], ["Submit", "UIDs to POC"], ["Reward", "25 RP / player", true]] },
			{ tk: "1.2", name: "Classic Matches", unit: "50 RP / match", rp: 1000, max: 1000, detail: "5 Classic / week on Nusa (custom rooms), 20+ in the phase. Screenshot each.", params: [["Weekly", "5 matches"], ["Phase", "20 matches"], ["Map", "Nusa · custom"], ["Reward", "50 RP / match", true], ["Win", "Best team → E-Vouchers"]] },
			{ tk: "1.3", name: "Content Creation", unit: "400 RP / reel", rp: 800, max: 1000, detail: "2 original in-game reels. Featured on the official page = big bonus.", params: [["Phase", "2 reels"], ["Submit", "400 RP / reel", true], ["Featured", "+1,000 RP", true], ["Review", "POC rates & elevates"]] },
		],
	},
	{
		min: "3,000", cum: 5175, dates: "15 Aug – 14 Sep", label: "P2 · Expansion",
		bonus: [["+25", "Per ongoing Classic"], ["+75", "Per ongoing reel"]],
		tasks: [
			{ tk: "2.1", name: "TDM Battleground", unit: "25 RP / match", rp: 750, max: 2000, detail: "30 TDM matches (phase min — mid-terms friendly). 2-squad face-offs.", params: [["Phase", "30 TDM matches"], ["Format", "2-squad"], ["Eligible", "Verified UIDs"], ["Reward", "25 RP / match", true], ["Win", "Best team → chicken dinner"]] },
			{ tk: "2.2", name: "Retention Drive", unit: "50 RP / player", rp: 250, max: 2000, detail: "Grow the squad 15 → 20+. Five new verified players, UIDs in 48h.", params: [["Baseline", "15 players"], ["Target", "20+ players"], ["New", "5 minimum"], ["Reward", "50 RP / player", true]] },
			{ tk: "2.3", name: "Offline Activation", unit: "400 RP / match", rp: 2000, max: 2000, detail: "One on-ground event — 5 TDM matches, 20+ different players.", params: [["Matches", "5 TDM · 20+ players"], ["Reward", "400 RP / match", true], ["Content", "Event reels welcome"], ["Win", "Best team → Vouchers"]] },
		],
	},
	{
		min: "4,000", cum: 9175, dates: "15 Sep – 14 Oct", label: "P3 · Championship",
		tasks: [
			{ tk: "3.1", name: "Creator Shoutout", unit: "100 RP / comment", rp: 2000, max: 2000, detail: "Rally 20+ teammates to drop the keyword on a creator's (Scout/Mortal) live stream.", params: [["Activity", "Creator live stream"], ["Keyword", "“BGMI Campus MVP” + ID"], ["Target", "20+ comments"], ["Reward", "100 RP / comment", true]] },
			{ tk: "3.2", name: "Inter-Dept Tournament", unit: "400 RP / team", rp: 2000, max: 2000, detail: "Register & run 5+ teams (15 / campus) in a verified-Classic knockout.", params: [["Teams", "5 (15 / campus)"], ["Format", "Knockout · Classic"], ["Reward", "400 RP / team", true], ["Win", "BGMI Hamper"]] },
			{ tk: "3.3", name: "Inter-Institute Rivalry", unit: "+1,000 / fixture", rp: 1000, max: 2000, detail: "Campus vs campus, POC fixtures, best-of-5 TDM. Crown vs Ace decider.", params: [["Fixtures", "POC-issued"], ["Squads", "3 / campus"], ["Format", "Best of 5"], ["Match win", "100 RP", true], ["Fixture win", "+1,000 RP", true]] },
		],
	},
];

export const MAX_RP = 9175;

/** §III.A — Rank & Progression. Rewards stack as you climb. */
export interface RankTier {
	name: string;
	stage: string;
	detail: string;
	threshold: number | null;
	label: string;
	reward: string;
	color: string;
}

export const RANK_LADDER: RankTier[] = [
	{ name: "Bronze", stage: "Entry Point", detail: "Entry rank — the climb begins.", threshold: 0, label: "0 RP · Start", reward: "Entry rank — the climb begins.", color: "#B07A48" },
	{ name: "Silver", stage: "Mid-Tier", detail: "Advancement unlocks merchandise exclusivity.", threshold: 500, label: "500 RP", reward: "Small Vouchers (Food / E-commerce)", color: "#C9CDD2" },
	{ name: "Gold", stage: "Mid-Tier", detail: "Growing recognition with localized assets.", threshold: 1200, label: "1,200 RP", reward: "200 UC + Welcome Kit", color: "#E9B14C" },
	{ name: "Platinum", stage: "Mid-Tier", detail: "Top of the development band — visible leadership.", threshold: 2500, label: "2,500 RP", reward: "300 UC + Elite Pass", color: "#5FC9C3" },
	{ name: "Diamond", stage: "Elite", detail: "Sustained high performance; premium digital assets.", threshold: 4000, label: "4,000 RP", reward: "600 UC + Gaming Trigger Set", color: "#6FA8E6" },
	{ name: "Crown", stage: "Elite", detail: "Elevated physical rewards for proven leaders.", threshold: 6000, label: "6,000 RP", reward: "900 UC + Premium Headphones", color: "#E0B24A" },
	{ name: "Ace", stage: "Summit", detail: "One step from the national apex.", threshold: 8500, label: "8,500 RP", reward: "Level 3 Backpack + Special BGMI Apparel", color: "#E8814B" },
	{ name: "Conqueror", stage: "Apex", detail: "Top-performing ambassadors on a national scale.", threshold: null, label: "Top 5 Nationally", reward: "National Leaderboard · Prizes worth ₹15,000", color: "#F9423A" },
];

export const LADDER_NOTE =
	"Rewards stack as you climb — reach a tier, keep everything below it. Progression is governed by accumulated RP (Recognition Points).";

/** Section 07 — Rank Drop & RP Reset */
export const TRAJECTORY = [
	{ mark: "↑", title: "Climb.", detail: "Complete missions and RP rises through the tiers, mid-phase." },
	{ mark: "↓", title: "Drop.", detail: "At each phase-end your rank falls one tier — RP resets to that tier's base." },
	{ mark: "✦", title: "Repeat.", detail: "No coasting on a big Phase 1 — sustained play out-ranks a fast fade." },
] as const;

export const TRAJECTORY_NOTE =
	"On the minimum path: Gold → Platinum → Diamond. Bronze is the floor — you never drop below it.";

/** Section 08 — Loot for your community */
export const LOOT = [
	{ icon: "Ticket", phase: "Phase 1 · Weekly", title: "Small E-Vouchers", detail: "Best Classic team, every week." },
	{ icon: "Drumstick", phase: "Phase 2 · Monthly", title: "Chicken Dinner", detail: "Best TDM campus team of the month." },
	{ icon: "Award", phase: "Phase 2 · Event", title: "Premium Vouchers", detail: "Best team at the offline activation." },
	{ icon: "Gift", phase: "Phase 3 · Finals", title: "BGMI Hamper", detail: "Tournament winners — tees, keychains & vouchers." },
] as const;

/** Section 09 — Submission & verification flow */
export const FLOW = [
	{ icon: "Play", title: "Play", detail: "Run mandated matches with verified UIDs." },
	{ icon: "Camera", title: "Capture", detail: "Screenshot results — UIDs must be visible." },
	{ icon: "Upload", title: "Submit", detail: "Send via the POC portal within the deadline." },
	{ icon: "CircleCheck", title: "Earn RP", detail: "POC verifies → RP lands on the leaderboard." },
] as const;

export const DISQUALIFIERS = [
	"Fabricated screenshots",
	"Fake match results",
	"Inflated attendance",
	"Hacks / third-party tools",
	"Leaderboard manipulation",
] as const;

/** Section 11 — Quick reference earn map */
export const RP_TABLE: [string, string, string, string, string][] = [
	["P1", "Community Building", "25 / player", "15 players", "375"],
	["P1", "Classic Matches", "50 / match", "20 matches", "1,000"],
	["P1", "Content Reels", "400 / reel", "2 reels", "800"],
	["P1", "Reel · featured", "1,000 / reel", "bonus", "—"],
	["P2", "TDM Battleground", "25 / match", "30 matches", "750"],
	["P2", "Retention Drive", "50 / player", "5 players", "250"],
	["P2", "Offline Activation", "400 / match", "5 matches", "2,000"],
	["P3", "Creator Shoutout", "100 / comment", "20 comments", "2,000"],
	["P3", "Inter-Dept Tournament", "400 / team", "5 teams", "2,000"],
	["P3", "Rivalry · fixture win", "1,000 bonus", "bonus", "—"],
];

export const RP_SEGMENTS = [
	{ label: "P1", value: 2175, color: "#FF7A1A" },
	{ label: "P2", value: 3000, color: "#34E0E8" },
	{ label: "P3", value: 4000, color: "#F9423A" },
] as const;

/** Marquee — deck ticker + iconic in-game phrases */
export const TICKER = [
	"Campus MVP", "50 Campuses", "150 Ambassadors", "9,175 RP",
	"Bronze → Conqueror", "Chicken Dinner", "July – October 2026",
] as const;

export const GAME_PHRASES = [
	"Scope hain kya?",
	"IGL banega tu?",
	"1HP Bro!",
	"Rank Push Ho Jaye?",
	"Cover De!",
	"1v1 Aaja",
	"TDM mein Aaja",
	"Phatt Se Headshot",
	"Winner Winner Chicken Dinner",
	"India Ki Heartbeat",
] as const;

/* ───────── Back-compat aliases (existing section imports) ───────── */

/** §I — Core strategic pillars */
export const PILLARS = [
	{ title: "Community Development", detail: "Build a sustained network of players and enthusiasts on campus." },
	{ title: "Brand Visibility", detail: "Be the official, certified face of BGMI within your institution." },
	{ title: "Competitive Growth", detail: "Run localized, structured competitive play — scrims and tournaments." },
] as const;

/** Why join — advantages of participation */
export const VALUE_PROPS = [
	{ title: "Official Recognition", detail: "BGMI Partner status — a verifiable leadership role with campus-wide visibility." },
	{ title: "Run the Scene", detail: "Authority to plan and execute official matches, meetups and tournaments." },
	{ title: "Real Loot", detail: "UC, vouchers, hampers and gear flow to you and your community every phase." },
	{ title: "National Stage", detail: "Top the leaderboard and earn national recognition among BGMI stakeholders." },
] as const;

/** Seasonal cycle summary */
export const SEASONAL_CYCLE = [
	{ title: "Three Phases", detail: "Foundation, Expansion and Championship across 90 structured days." },
	{ title: "RP On Merit", detail: "Every match, reel and meetup accrues Recognition Points — earned, never given." },
	{ title: "Stacking Rewards", detail: "Climb Bronze → Conqueror; reach a tier and keep everything below it." },
] as const;

/** Community management & activation */
export const RESPONSIBILITIES = [
	{ title: "Event Coordination", detail: "Plan and host regular on-campus Classic, TDM and offline sessions." },
	{ title: "Engagement Hosting", detail: "Drive watch parties and creator shoutouts during official activity." },
	{ title: "Digital Hub", detail: "Build and manage the MVP squad and channels." },
] as const;

/** Program execution roadmap */
export const ROADMAP = [
	{ step: "Build", title: "Foundation", detail: "Bring players together and settle into a gameplay rhythm." },
	{ step: "Expand", title: "Expansion", detail: "Grow retention and host your biggest in-person meetup." },
	{ step: "Compete", title: "Championship", detail: "Run the tournament and go campus-vs-campus for the top." },
	{ step: "Rank Up", title: "National Ranking", detail: "Climb the national leaderboard from Bronze to Conqueror." },
] as const;

/** §V — Recognition & resource allocation (perks) */
export const PERKS = [
	{ title: "UC & Elite Pass", detail: "In-game currency and passes scale with your rank, from Gold upward." },
	{ title: "Gear & Hardware", detail: "Trigger sets, premium headphones and a Level 3 Backpack for proven leaders." },
	{ title: "Exclusive Merch", detail: "Special BGMI Apparel and a hamper of tees, keychains and vouchers." },
	{ title: "National Visibility", detail: "Feature on official channels and prizes worth ₹15,000 at the apex." },
] as const;
