# Applicant Screening System — BGMI Campus MVP

A **zero-cost, high-quality screening engine** that ranks campus-ambassador applicants from their
form responses. It scores the structured fields (rank, reach, commitment, experience) **and** the
four free-text essays, applies fraud/low-effort red flags and hard gates, and outputs a 0–100
score + tier (`TOP-TIER SHORTLIST → REJECT`) you can sort on.

It is **separate from the BGMI website repo** by design — drop-in, no coupling.

## Why this design
The applicants already flow into a **Google Sheet** (the site's worker appends each application as
a row). So screening lives where the data already is, and there are **two interchangeable engines
sharing one rubric** (`rubric.json`):

| Engine | Use it when | Cost | Verified |
|---|---|---|---|
| **`score.py`** (Python, stdlib-only) | Batch-score a CSV export; run locally; integrate in a pipeline | $0, nothing to install | ✅ runs + self-test here |
| **`apps_script/`** (Google Apps Script) | Auto-score rows *inside* the live Google Sheet, write results back | $0, Google-hosted | ✅ scores **identical** to Python (parity-tested) |

Both score **identically** (proven by a Python↔JS parity test). Pick one or use both.

## Cost model — genuinely $0, upgradeable for free
- **Default (heuristic) mode:** essays are scored by measurable proxies (length, specificity
  signals, concrete numbers, structure) minus red-flag penalties. No API, no key, no cost. Great
  for triage and catching low-effort/spam/duplicate submissions.
- **LLM mode (optional, still free):** add a **Google AI Studio (Gemini) API key** — free tier, no
  credit card — and essays are scored by a rubric-driven LLM prompt for human-grade judgement of
  *feasibility, originality, and insight*. If the key is missing or a call fails, it silently falls
  back to heuristic mode, so it never breaks and never bills you.

---

## Quickstart A — Python (batch, runs anywhere)
```bash
cd ~/Desktop/applicant-screening-system

# 1) Export your applications Google Sheet to CSV (File → Download → CSV), or use the sample.
# 2) Score it ($0 heuristic mode):
python3 score.py --in sample_applicants.csv --out scored.csv

# 3) (Optional) higher quality with the free Gemini tier:
export GEMINI_API_KEY="your_free_aistudio_key"
python3 score.py --in applicants.csv --out scored.csv --llm
```
`scored.csv` is sorted best→worst with: rank, score, tier, name, IGN, college, accountRank,
structured_pts, essay_pts, penalty, flags, rationale. A ranked summary also prints to the terminal.

If your CSV is a raw headerless Sheet export, add `--no-header` (columns are read positionally in
the order listed in `rubric.json → sheet_columns_in_order`).

## Quickstart B — Google Apps Script (auto-score inside the Sheet)
1. Open your applications Google Sheet → **Extensions → Apps Script**.
2. Paste `apps_script/Code.gs` into `Code.gs`; set the manifest (`appsscript.json`) if asked.
3. Reload the Sheet → a **🎯 Screening** menu appears → **Score ALL applicant rows**.
4. Three columns are written to the right of your data: **Screen Score / Tier / Flags**.
5. *(Optional, free LLM):* **Project Settings → Script Properties → Add** `GEMINI_API_KEY` = your
   free key. Re-run to score essays with Gemini.
- Defaults assume the BGMI worker's headerless 21-column layout. If you added a header row, set
  `CONFIG.HAS_HEADER_ROW = true`. If your columns differ, edit `SHEET_COLUMNS`.

## Get a free Gemini key (optional)
[aistudio.google.com](https://aistudio.google.com/app/apikey) → **Create API key**. Free tier, no
billing. Used by both engines for essay scoring only.

---

## The rubric (`rubric.json` — single source of truth)
100 points: **35 structured + 65 essays**, minus penalties, with hard gates.
- **Structured (35):** rank (2–10), reach by # access channels (0–10), tournament exp (4),
  event-organising exp (3), time commitment (8).
- **Essays (65):** convert 17, newPlayers 17, campusPopularity 16, reasoning 15 — each scored
  0–10 then scaled.
- **Hard gates:** `hasTime = No` → auto **REJECT** (can't commit → can't execute), regardless of
  how good the essays are. Score `< 30` → REJECT.
- **Red flags / penalties:** essays under 40 words, low average length, **copy-paste across essays**
  (cosine similarity ≥ 0.85), **generic filler phrases** ("i love bgmi", "trust me"…), and a
  "convert" plan with no numbers.
- **Tiers:** 80+ TOP-TIER · 70+ STRONG SHORTLIST · 50+ SHORTLIST · 30+ REVIEW · else REJECT.

**Tune it** by editing `rubric.json` (weights, thresholds, phrase list, tiers). The Python engine
reads it directly; if you change it, mirror the values in `apps_script/Code.gs`'s `RUBRIC` object
(a parity test in `.scratch/parity.js` checks the two stay in sync).

## What "high quality" means here
- **Structured signals are objective** and instant.
- **Essays are where candidates differentiate** — the heuristic catches effort/spam/duplication
  reliably; the optional free LLM adds judgement of *strategy quality* (feasibility, originality,
  stakeholder thinking) that keyword heuristics can't.
- **Defensible & auditable:** every score has a flag/penalty trail, and gates are explicit — so a
  human reviewer can trust the shortlist and spot-check the REVIEW band.

## Files
- `rubric.json` — the scoring spec (edit to tune).
- `score.py` — Python engine + `--selftest` sanity checks. Stdlib only.
- `apps_script/Code.gs`, `apps_script/appsscript.json` — the in-Sheet engine.
- `sample_applicants.csv` — 5 synthetic applicants (strong / mediocre / spam / no-time / copy-paste).
- `scored.csv` — example output from the sample.
- `.scratch/` — parity-test harness + intermediates (safe to ignore/delete).

## Honest limitations
- Heuristic essay scoring rewards specificity/effort, not truth — a well-written but dishonest plan
  scores well. The free LLM mode narrows this; a human still reviews the SHORTLIST/REVIEW bands.
- Cross-essay duplicate detection is within one applicant. Cross-*applicant* plagiarism detection
  isn't built in (possible add-on).
- LLM mode depends on the AI Studio free-tier quota and network; it auto-degrades to heuristic if
  unavailable, so a run never fails — but a fully-offline batch is heuristic-only.
- Rubric weights are a strong default from screening best-practice, not gospel — calibrate against
  a few hand-scored applications before a high-stakes cohort.
