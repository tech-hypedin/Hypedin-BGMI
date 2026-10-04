# Executive Summary — Applicant Screening System

**Built:** 2026-06-18 · **Location:** `~/Desktop/applicant-screening-system/` (separate from the BGMI website repo) · **Rounds:** 2 (build → Atlas audit → fix → re-verify)

## What it is
A zero-cost engine that screens BGMI campus-ambassador applicants from their form data and returns
a **0–100 score + tier** (`TOP-TIER SHORTLIST → REJECT`) you can sort on. It scores structured
fields (rank, reach, commitment, experience) and the four essay questions, applies fraud/low-effort
red flags, and enforces hard gates.

## Approach (and why)
The applicants already flow into a Google Sheet, so the best fit is to score *where the data lives*
— delivered as **two interchangeable engines sharing one rubric** (`rubric.json`):
- **`score.py`** — Python, standard-library only (nothing to install), for batch-scoring a CSV.
- **`apps_script/Code.gs`** — Google Apps Script, auto-scores rows inside the live Sheet and writes
  Score/Tier/Flags back, on Google's free quota.

**Cost = $0.** Essays score via a measurable heuristic by default; adding a free Google AI Studio
(Gemini) key upgrades essay scoring to LLM quality — still free, and it fails closed to the
heuristic if absent, so it never breaks or bills.

## How quality is achieved
- 35 pts structured + 65 pts essays, minus penalties, with hard gates (rubric from screening
  best-practice via a research pass).
- Fraud/effort defense: short-essay, low-average-length, **generic-filler phrases**,
  **cross-essay copy-paste** (cosine similarity), and "no-numbers" plan penalties.
- Hard gate: `hasTime = No` → auto-REJECT regardless of essay quality; score < 30 → REJECT.
- Every score carries a flag/penalty trail, so a human can trust the shortlist and spot-check.

## Verification (actually run, not claimed)
- `score.py --selftest` → **ALL PASS** (strong > spam; no-time gated; copy-paste flagged; strong → shortlist tier).
- **Python ↔ Apps Script parity → IDENTICAL** on all samples (a Node harness scores the Apps Script's
  own functions and compares to Python). After the audit, both round to integers with one shared
  rule, so they can't diverge.
- Sample output (`scored.csv`): Aarav Strong **80 TOP-TIER**, Bhavya 15 REJECT, Copy-Paste Karan 6
  REJECT (dup flagged), Spammy 0 REJECT (filler), No-Time Nina 0 REJECT (gated despite good essays).

## Independent audit (Atlas) — resolved
FIX-FIRST issues found and fixed, then re-verified: (1) Python/Apps-Script **rounding divergence**
→ unified to integer round-half-up; (2) stale committed output → regenerated; (3) min-score was an
advisory flag → made a **true gate**; (4) per-row Sheet reads → batched to one call.

## Known limitations (honest)
- Heuristic mode rewards specificity/effort, not truth — keyword-stuffing can game it; the free LLM
  mode mitigates, and a human reviews the SHORTLIST/REVIEW bands.
- Duplicate detection is within one applicant (not cross-applicant plagiarism).
- Rubric weights are a strong default — calibrate against a few hand-scored apps before a big cohort.

## Next step
Export the applications Sheet to CSV and run `python3 score.py --in your.csv --out scored.csv`, or
paste `Code.gs` into the Sheet's Apps Script and run **🎯 Screening → Score ALL rows**. Add a free
Gemini key when you want LLM-grade essay judgement.
