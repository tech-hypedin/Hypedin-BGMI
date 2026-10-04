#!/usr/bin/env python3
"""
BGMI Campus MVP Applicant Scorer.

Scores applicants using rubric.json and outputs ranked tiers.

Modes:
- Heuristic (default)
- Gemini LLM (optional via GEMINI_API_KEY)

Usage:
  python score.py --in applicants.csv --out scored.csv
  python score.py --in applicants.csv --out scored.csv --llm
  python score.py --in applicants.csv --selftest

Input:
  CSV file with applicant data. Supports header and no-header formats.
"""
import argparse
import csv
import json
import math
import os
import re
import sys
import urllib.request
import urllib.error
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ESSAY_FIELDS = ["convert", "newPlayers", "campusPopularity", "reasoning"]



def load_rubric(path=None):
    with open(path or os.path.join(HERE, "rubric.json"), encoding="utf-8") as f:
        return json.load(f)


def words(text):
    return re.findall(r"[A-Za-z0-9']+", (text or "").lower())


def yes(v):
    return str(v or "").strip().lower() in ("yes", "true", "1", "y")


def parse_access_count(v):
    """hasAccessTo is stored as a '; '-joined string (or a list). Count the channels."""
    if isinstance(v, list):
        return len([x for x in v if str(x).strip()])
    s = str(v or "").strip()
    if not s:
        return 0
    parts = re.split(r"[;,|]", s)
    return len([p for p in parts if p.strip()])


#structured scoring 
def score_structured(app, rubric):
    s = rubric["structured"]
    breakdown = {}

    breakdown["rank"] = s["accountRank_points"].get(str(app.get("accountRank", "")).strip(), 0)

    count = min(parse_access_count(app.get("hasAccessTo")), len(s["accessChannels_points_by_count"]) - 1)
    breakdown["reach"] = s["accessChannels_points_by_count"][count]

    breakdown["tournament"] = s["tournamentExp_yes_points"] if yes(app.get("tournamentExp")) else 0
    breakdown["experience"] = s["hasExperience_yes_points"] if yes(app.get("hasExperience")) else 0
    breakdown["commitment"] = s["hasTime_yes_points"] if yes(app.get("hasTime")) else 0

    return sum(breakdown.values()), breakdown



# Essay scoring 

def _piecewise(value, table):
    """Linear interpolation over a [[x,y],...] table sorted by x."""
    if value <= table[0][0]:
        return table[0][1]
    for (x0, y0), (x1, y1) in zip(table, table[1:]):
        if value <= x1:
            if x1 == x0:
                return y1
            return y0 + (y1 - y0) * (value - x0) / (x1 - x0)
    return table[-1][1]


def heuristic_essay_score(text, rubric):
    h = rubric["heuristic_essay"]
    w = words(text)
    n = len(w)
    if n == 0:
        return 0.0

    length = _piecewise(n, h["length_words_to_score"])

    blob = " ".join(w)
    sig_hits = sum(1 for s in h["specificity_signals"] if s in blob)
    specificity = min(sig_hits / h["specificity_full_at"], 1.0) * 10

    numbers = len(re.findall(r"\d+", text or ""))
    concreteness = min(numbers / h["concreteness_full_at"], 1.0) * 10

    # structure: rewards multi-sentence / multi-step answers (line breaks, list markers, sentences)
    sentences = len(re.findall(r"[.!?\n]", text or "")) + len(re.findall(r"(?m)^\s*[-*\d]", text or ""))
    structure = min(sentences / 6.0, 1.0) * 10

    wt = h["weights"]
    score = (length * wt["length"] + specificity * wt["specificity"]
             + concreteness * wt["concreteness"] + structure * wt["structure"])
    return max(0.0, min(10.0, score))

#essay scoring using gemini llm
def gemini_essay_score(field, text, rubric, api_key, model="gemini-1.5-flash"):
    """Return (score_0_10, rationale) or None on any failure (caller falls back to heuristic)."""
    meta = rubric["essays"][field]
    prompt = (
        "You are screening campus brand-ambassador applicants for a mobile-esports (BGMI) program.\n"
        f"Question asked: {meta['prompt']}\n"
        f"Score the answer 0-10 on: {meta['focus']}.\n"
        "0-3 = generic/empty, 4-6 = adequate, 7-8 = strong & specific, 9-10 = exceptional & concrete.\n"
        "Reward concrete tactics, numbers, timelines, realism; penalise generic filler.\n"
        'Reply ONLY as compact JSON: {"score": <int 0-10>, "why": "<<=14 words>"}\n\n'
        f"ANSWER:\n{text[:4000]}"
    )
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0, "maxOutputTokens": 80},
    }).encode()
    try:
        req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read().decode())
        raw = data["candidates"][0]["content"]["parts"][0]["text"]
        m = re.search(r"\{.*\}", raw, re.S)
        obj = json.loads(m.group(0))
        return max(0, min(10, int(round(float(obj["score"]))))), str(obj.get("why", ""))[:80]
    except (urllib.error.URLError, KeyError, ValueError, TypeError, json.JSONDecodeError):
        return None


# Similarity
def cosine(a, b):
    ca, cb = Counter(words(a)), Counter(words(b))
    if not ca or not cb:
        return 0.0
    common = set(ca) & set(cb)
    dot = sum(ca[t] * cb[t] for t in common)
    na = math.sqrt(sum(v * v for v in ca.values()))
    nb = math.sqrt(sum(v * v for v in cb.values()))
    return dot / (na * nb) if na and nb else 0.0



# Red flags / penalties

def red_flags(app, rubric):
    rf = rubric["red_flags"]
    flags, penalty = [], 0
    counts = {f: len(words(app.get(f))) for f in ESSAY_FIELDS}

    for f in ESSAY_FIELDS:
        if counts[f] < rf["short_essay_words"]:
            penalty += rf["short_essay_penalty"]
            flags.append(f"short:{f}")

    if sum(counts.values()) / len(ESSAY_FIELDS) < rf["low_avg_words"]:
        penalty += rf["low_avg_penalty"]
        flags.append("low-avg-length")

    # generic filler
    generic_total = 0
    for f in ESSAY_FIELDS:
        blob = " ".join(words(app.get(f)))
        hits = sum(1 for p in rf["generic_phrases"] if p in blob)
        if hits:
            generic_total += min(hits * rf["generic_phrase_penalty"], rf["generic_phrase_cap"])
    if generic_total:
        penalty += generic_total
        flags.append(f"generic-filler(-{generic_total})")

    # copy-paste across essays
    worst = 0.0
    for i in range(len(ESSAY_FIELDS)):
        for j in range(i + 1, len(ESSAY_FIELDS)):
            worst = max(worst, cosine(app.get(ESSAY_FIELDS[i]), app.get(ESSAY_FIELDS[j])))
    if worst >= rf["cross_essay_similarity_flag"]:
        penalty += rf["cross_essay_similarity_penalty"]
        flags.append(f"dup-essays({worst:.2f})")

    # vague convert plan
    if not re.search(r"\d", app.get("convert") or ""):
        penalty += rf["no_numbers_in_convert_penalty"]
        flags.append("convert-no-numbers")

    return penalty, flags


def tier_for(score, rubric):
    for t in rubric["tiers"]:
        if score >= t["min"]:
            return t["label"]
    return rubric["tiers"][-1]["label"]


#score_applicant
def score_applicant(app, rubric, api_key=None):
    struct, struct_bd = score_structured(app, rubric)

    essay_pts, essay_bd, rationales = 0.0, {}, []
    for f in ESSAY_FIELDS:
        maxp = rubric["essays"][f]["max_points"]
        s10, why = None, ""
        if api_key:
            r = gemini_essay_score(f, app.get(f) or "", rubric, api_key)
            if r:
                s10, why = r
        if s10 is None:
            s10 = heuristic_essay_score(app.get(f) or "", rubric)
        pts = s10 / 10.0 * maxp          # accumulate raw; round only the final total (matches Code.gs)
        essay_pts += pts
        essay_bd[f] = round(pts, 1)
        if why:
            rationales.append(f"{f}:{why}")

    penalty, flags = red_flags(app, rubric)


    raw = struct + essay_pts - penalty
    total = max(0, min(100, int(math.floor(raw + 0.5))))

    # hard gates
    gated = False
    if rubric["gates"]["hasTime_no_is_reject"] and not yes(app.get("hasTime")):
        total, gated = 0, True
        flags.insert(0, "GATE:no-time")
    below_min = total < rubric["gates"]["min_total_score_to_pass"]
    if below_min and not gated:
        flags.append("below-min")

    # min-score is a TRUE gate (forces REJECT), not just a flag — matches the documented behavior
    # even if the tier table is later re-tuned.
    tier = "REJECT" if (gated or below_min) else tier_for(total, rubric)

    return {
        "score": total,
        "tier": tier,
        "structured_pts": round(struct, 1),
        "essay_pts": round(essay_pts, 1),
        "penalty": penalty,
        "breakdown": {**{f"struct_{k}": v for k, v in struct_bd.items()},
                      **{f"essay_{k}": v for k, v in essay_bd.items()}},
        "flags": "; ".join(flags),
        "rationale": " | ".join(rationales),
    }



def read_applicants(path, rubric, has_header=True):
    cols = rubric["sheet_columns_in_order"]
    rows = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        if has_header:
            reader = csv.DictReader(f)
            lower = {(k or "").strip().lower(): k for k in (reader.fieldnames or [])}
            for r in reader:
                app = {}
                for c in cols:
                    key = lower.get(c.lower())
                    app[c] = r.get(key, "") if key else ""
                rows.append(app)
        else:
            for raw in csv.reader(f):
                rows.append({cols[i]: (raw[i] if i < len(raw) else "") for i in range(len(cols))})
    return rows


def write_scored(path, scored):
    fields = ["rank", "score", "tier", "name", "IGN", "college", "accountRank",
              "structured_pts", "essay_pts", "penalty", "flags", "rationale", "email"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for i, (app, res) in enumerate(scored, 1):
            w.writerow({
                "rank": i, "score": res["score"], "tier": res["tier"],
                "name": app.get("name", ""), "IGN": app.get("IGN", ""),
                "college": app.get("college", ""), "accountRank": app.get("accountRank", ""),
                "structured_pts": res["structured_pts"], "essay_pts": res["essay_pts"],
                "penalty": res["penalty"], "flags": res["flags"],
                "rationale": res["rationale"], "email": app.get("email", ""),
            })



def run(in_path, out_path, use_llm, has_header):
    rubric = load_rubric()
    api_key = os.environ.get("GEMINI_API_KEY") if use_llm else None
    if use_llm and not api_key:
        print("[warn] --llm set but GEMINI_API_KEY is empty → using free heuristic mode.", file=sys.stderr)

    apps = read_applicants(in_path, rubric, has_header)
    scored = [(a, score_applicant(a, rubric, api_key)) for a in apps]
    scored.sort(key=lambda x: x[1]["score"], reverse=True)
    write_scored(out_path, scored)

    print(f"\nScored {len(scored)} applicants → {out_path}  "
          f"(mode: {'Gemini LLM' if api_key else 'heuristic / $0'})\n")
    print(f"{'#':>2}  {'SCORE':>5}  {'TIER':<20} {'NAME':<18} {'RANK':<14} FLAGS")
    print("-" * 92)
    for i, (app, res) in enumerate(scored, 1):
        print(f"{i:>2}  {res['score']:>5}  {res['tier']:<20} "
              f"{(app.get('name') or '')[:17]:<18} {(app.get('accountRank') or '')[:13]:<14} {res['flags']}")
    tiers = Counter(res["tier"] for _, res in scored)
    print("\nTier counts:", dict(tiers))


def selftest(in_path):
    """Sanity check: strong applicants must outrank weak/spam, and gates must trigger."""
    rubric = load_rubric()
    apps = read_applicants(in_path, rubric, True)
    by_name = {a["name"]: score_applicant(a, rubric, None) for a in apps}
    ok = True

    def check(cond, msg):
        nonlocal ok
        print(("PASS" if cond else "FAIL"), "-", msg)
        ok = ok and cond

    if "Aarav Strong" in by_name and "Spammy Filler" in by_name:
        check(by_name["Aarav Strong"]["score"] > by_name["Spammy Filler"]["score"],
              "strong applicant outranks low-effort spam")
    if "No Time Nina" in by_name:
        check(by_name["No Time Nina"]["tier"] == "REJECT",
              "hasTime=No is auto-rejected by the hard gate")
    if "Copy Paste Karan" in by_name:
        check("dup-essays" in by_name["Copy Paste Karan"]["flags"],
              "copy-paste across essays is flagged")
    if "Aarav Strong" in by_name:
        check(by_name["Aarav Strong"]["tier"] in ("SHORTLIST", "STRONG SHORTLIST", "TOP-TIER SHORTLIST"),
              "strong applicant lands in a shortlist tier")
    print("\nSELFTEST:", "ALL PASS" if ok else "FAILURES ABOVE")
    return ok


def main():
    ap = argparse.ArgumentParser(description="BGMI applicant screening scorer (zero-dependency).")
    ap.add_argument("--in", dest="in_path", default=os.path.join(HERE, "sample_applicants.csv"))
    ap.add_argument("--out", dest="out_path", default=os.path.join(HERE, "scored.csv"))
    ap.add_argument("--llm", action="store_true", help="use Gemini (needs GEMINI_API_KEY); else heuristic")
    ap.add_argument("--no-header", action="store_true", help="input has no header row (raw Sheet export)")
    ap.add_argument("--selftest", action="store_true", help="run scoring sanity checks on the input")
    args = ap.parse_args()

    if args.selftest:
        sys.exit(0 if selftest(args.in_path) else 1)
    run(args.in_path, args.out_path, args.llm, not args.no_header)


if __name__ == "__main__":
    main()
