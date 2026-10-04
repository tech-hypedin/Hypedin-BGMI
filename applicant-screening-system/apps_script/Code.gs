/**
 * BGMI Campus MVP — Applicant Screening (Google Apps Script)
 * ----------------------------------------------------------
 * Bind this to the Google Sheet your applications land in (Extensions → Apps Script).
 * It scores each applicant row against the same rubric as score.py and writes three columns
 * back to the sheet: "Screen Score", "Tier", "Flags".
 *
 * COST: $0. Runs on Google's free Apps Script quota. Essay scoring uses a free heuristic by
 * default; add a free Google AI Studio (Gemini) key as a Script Property named GEMINI_API_KEY
 * to upgrade essay scoring to LLM quality — still free within the AI Studio free tier.
 *
 * SETUP: see README.md. Key thing — set COL_START_INDEX to the column your data starts in and
 * make sure SHEET_COLUMNS matches your sheet's column order (defaults match the BGMI worker).
 */


var CONFIG = {
  SHEET_NAME: '',          // '' = active/first sheet; or set a specific tab name
  HAS_HEADER_ROW: false,   // the BGMI worker appends headerless rows; set true if you added headers
  USE_LLM: true            // if a GEMINI_API_KEY Script Property exists, score essays with Gemini
};

// Column order the BGMI applications worker writes (Sheet1!A1 append).
var SHEET_COLUMNS = [
  'Timestamp','name','IGN','UID','email','phoneNo','college','course','currentYear','accountRank',
  'hasExperience','experienceDetails','groups','hasAccessTo','tournamentExp','newPlayers','convert',
  'campusPopularity','hasTime','reasoning','status'
];

var ESSAY_FIELDS = ['convert', 'newPlayers', 'campusPopularity', 'reasoning'];

// Mirror of rubric.json (keep in sync with the Python copy).
var RUBRIC = {
  structured: {
    accountRank_points: { Bronze:2, Silver:3, Gold:4, Platinum:5, Diamond:6, Crown:7, Ace:8, 'Ace Master':9, 'Ace Dominator':9, Conqueror:10 },
    accessChannels_points_by_count: [0, 2, 5, 8, 10],
    tournamentExp_yes_points: 4,
    hasExperience_yes_points: 3,
    hasTime_yes_points: 8
  },
  essays: { convert:{max_points:17}, newPlayers:{max_points:17}, campusPopularity:{max_points:16}, reasoning:{max_points:15} },
  essays_meta: {
    convert: 'You must bring 100 players for a BGMI event. What EXACT steps will you take? Score planning, specific channels, quantified targets, realistic timeline, risk-awareness.',
    newPlayers: 'How will you convert NON-BGMI players into players? Score understanding of barriers, persuasion strategy, scalability.',
    campusPopularity: 'BGMI is losing campus popularity. How to bring hype back? Score root-cause analysis, creative/novel solution, stakeholder buy-in.',
    reasoning: 'Why should we recruit you? Score self-awareness, concrete fit to role, genuine (non-generic) motivation.'
  },
  heuristic: {
    weights: { length:0.30, specificity:0.40, concreteness:0.20, structure:0.10 },
    length_words_to_score: [[0,0],[20,2],[40,4],[80,6],[150,8],[250,9],[400,10]],
    specificity_signals: ['whatsapp','instagram','discord','telegram','hostel','society','societies','club','fest','festival','poster','posters','reel','reels','story','stories','scrim','scrims','tournament','tournaments','lan','prize','prizes','giveaway','registration','register','signup','sign-up','booth','stall','email','emails','dm','dms','collaborat','partner','sponsor','mentor','bootcamp','trial','demo','week','weeks','day','days','month','months','phase','timeline','schedule','deadline','follow up','follow-up','retention','convert','onboard'],
    specificity_full_at: 8,
    concreteness_full_at: 3
  },
  red_flags: {
    short_essay_words: 40, short_essay_penalty: 2,
    low_avg_words: 60, low_avg_penalty: 5,
    cross_essay_similarity_flag: 0.85, cross_essay_similarity_penalty: 8,
    generic_phrases: ['i am hardworking','i love bgmi','i will do my best','i am passionate','i am a team player','i will bring changes','i will work hard','i believe in myself','i am committed','trust me','i promise','i am confident','everything is possible','i will never give up','bgmi is my life'],
    generic_phrase_penalty: 1, generic_phrase_cap: 2,
    no_numbers_in_convert_penalty: 4
  },
  gates: { hasTime_no_is_reject: true, min_total_score_to_pass: 30 },
  tiers: [ {min:80,label:'TOP-TIER SHORTLIST'}, {min:70,label:'STRONG SHORTLIST'}, {min:50,label:'SHORTLIST'}, {min:30,label:'REVIEW'}, {min:0,label:'REJECT'} ]
};

// ----- Menu --------------------------------------------------------------------------------------
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎯 Screening')
    .addItem('Score ALL applicant rows', 'scoreAllRows')
    .addItem('Score only UNSCORED rows', 'scoreNewRows')
    .addSeparator()
    .addItem('About / cost', 'showAbout')
    .addToUi();
}

function showAbout() {
  var key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  SpreadsheetApp.getUi().alert(
    'Applicant Screening\n\n' +
    'Mode: ' + (CONFIG.USE_LLM && key ? 'Gemini LLM (free tier)' : 'Heuristic ($0, no key)') + '\n\n' +
    'Writes Screen Score / Tier / Flags columns. Add a free GEMINI_API_KEY in ' +
    'Project Settings → Script Properties to upgrade essay scoring. Cost: $0.'
  );
}

// ----- Driver ------------------------------------------------------------------------------------
function scoreAllRows() { run_(false); }
function scoreNewRows() { run_(true); }

function run_(skipScored) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = CONFIG.SHEET_NAME ? ss.getSheetByName(CONFIG.SHEET_NAME) : ss.getSheets()[0];
  if (!sheet) { SpreadsheetApp.getUi().alert('Sheet not found.'); return; }

  var lastRow = sheet.getLastRow();
  var firstDataRow = CONFIG.HAS_HEADER_ROW ? 2 : 1;
  if (lastRow < firstDataRow) { SpreadsheetApp.getUi().alert('No applicant rows found.'); return; }

  var nCols = SHEET_COLUMNS.length;
  var data = sheet.getRange(firstDataRow, 1, lastRow - firstDataRow + 1, nCols).getValues();

  // Output columns start right after the source columns; write a header row above them.
  var outCol = nCols + 2; // leave one spacer column
  sheet.getRange(Math.max(firstDataRow - 1, 1), outCol, 1, 3)
       .setValues([['Screen Score', 'Tier', 'Flags']]).setFontWeight('bold');

  var key = (CONFIG.USE_LLM ? PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY') : null) || null;

  // Read any existing output once (one API call) instead of per-row, to stay well within quota.
  var existing = skipScored ? sheet.getRange(firstDataRow, outCol, data.length, 3).getValues() : null;
  var out = [];
  for (var i = 0; i < data.length; i++) {
    if (skipScored && existing[i][0] !== '' && existing[i][0] !== null) { out.push(existing[i]); continue; }

    var app = {};
    for (var c = 0; c < nCols; c++) app[SHEET_COLUMNS[c]] = data[i][c];
    var res = scoreApplicant_(app, key);
    out.push([res.score, res.tier, res.flags]);
  }
  sheet.getRange(firstDataRow, outCol, out.length, 3).setValues(out);
  SpreadsheetApp.getActiveSpreadsheet().toast('Scored ' + out.length + ' rows.', 'Screening', 5);
}

// ----- Scoring (mirrors score.py) ----------------------------------------------------------------
function words_(t) { return ((t == null ? '' : String(t)).toLowerCase().match(/[a-z0-9']+/g)) || []; }
function yes_(v) { return ['yes','true','1','y'].indexOf(String(v == null ? '' : v).trim().toLowerCase()) >= 0; }

function accessCount_(v) {
  if (v == null) return 0;
  var s = String(v).trim();
  if (!s) return 0;
  return s.split(/[;,|]/).filter(function (p) { return p.trim(); }).length;
}

function piecewise_(x, table) {
  if (x <= table[0][0]) return table[0][1];
  for (var i = 0; i < table.length - 1; i++) {
    var x0 = table[i][0], y0 = table[i][1], x1 = table[i+1][0], y1 = table[i+1][1];
    if (x <= x1) return x1 === x0 ? y1 : y0 + (y1 - y0) * (x - x0) / (x1 - x0);
  }
  return table[table.length - 1][1];
}

function heuristicEssay_(text) {
  var h = RUBRIC.heuristic, w = words_(text), n = w.length;
  if (n === 0) return 0;
  var length = piecewise_(n, h.length_words_to_score);
  var blob = ' ' + w.join(' ') + ' ';
  var hits = 0;
  for (var i = 0; i < h.specificity_signals.length; i++) if (blob.indexOf(h.specificity_signals[i]) >= 0) hits++;
  var specificity = Math.min(hits / h.specificity_full_at, 1) * 10;
  var nums = (String(text).match(/\d+/g) || []).length;
  var concreteness = Math.min(nums / h.concreteness_full_at, 1) * 10;
  var sentences = (String(text).match(/[.!?\n]/g) || []).length + (String(text).match(/^\s*[-*\d]/gm) || []).length;
  var structure = Math.min(sentences / 6, 1) * 10;
  var wt = h.weights;
  var s = length*wt.length + specificity*wt.specificity + concreteness*wt.concreteness + structure*wt.structure;
  return Math.max(0, Math.min(10, s));
}

function cosine_(a, b) {
  var ca = {}, cb = {}, wa = words_(a), wb = words_(b), i;
  if (!wa.length || !wb.length) return 0;
  for (i = 0; i < wa.length; i++) ca[wa[i]] = (ca[wa[i]] || 0) + 1;
  for (i = 0; i < wb.length; i++) cb[wb[i]] = (cb[wb[i]] || 0) + 1;
  var dot = 0, na = 0, nb = 0, k;
  for (k in ca) { na += ca[k]*ca[k]; if (cb[k]) dot += ca[k]*cb[k]; }
  for (k in cb) nb += cb[k]*cb[k];
  return (na && nb) ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

function geminiScore_(field, text, key) {
  try {
    var prompt = 'You are screening campus brand-ambassador applicants for a mobile-esports (BGMI) program.\n' +
      RUBRIC.essays_meta[field] + '\n' +
      'Score 0-10 (0-3 generic, 4-6 adequate, 7-8 strong, 9-10 exceptional). Reward concrete tactics, numbers, timelines; penalise filler.\n' +
      'Reply ONLY compact JSON: {"score": <int 0-10>, "why": "<<=14 words>"}\n\nANSWER:\n' + String(text).slice(0, 4000);
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key;
    var resp = UrlFetchApp.fetch(url, {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0, maxOutputTokens: 80 } })
    });
    if (resp.getResponseCode() !== 200) return null;
    var raw = JSON.parse(resp.getContentText()).candidates[0].content.parts[0].text;
    var obj = JSON.parse(raw.match(/\{[\s\S]*\}/)[0]);
    var s = Math.round(Number(obj.score));
    return isNaN(s) ? null : Math.max(0, Math.min(10, s));
  } catch (e) { return null; }
}

function scoreApplicant_(app, key) {
  var s = RUBRIC.structured, flags = [];

  // structured
  var struct = 0;
  struct += s.accountRank_points[String(app.accountRank || '').trim()] || 0;
  var cnt = Math.min(accessCount_(app.hasAccessTo), s.accessChannels_points_by_count.length - 1);
  struct += s.accessChannels_points_by_count[cnt];
  struct += yes_(app.tournamentExp) ? s.tournamentExp_yes_points : 0;
  struct += yes_(app.hasExperience) ? s.hasExperience_yes_points : 0;
  struct += yes_(app.hasTime) ? s.hasTime_yes_points : 0;

  // essays
  var essayPts = 0;
  for (var i = 0; i < ESSAY_FIELDS.length; i++) {
    var f = ESSAY_FIELDS[i], maxp = RUBRIC.essays[f].max_points, s10 = null;
    if (key) s10 = geminiScore_(f, app[f] || '', key);
    if (s10 === null) s10 = heuristicEssay_(app[f] || '');
    essayPts += s10 / 10 * maxp;
  }

  // red flags
  var rf = RUBRIC.red_flags, penalty = 0, counts = {}, total = 0;
  for (i = 0; i < ESSAY_FIELDS.length; i++) {
    counts[ESSAY_FIELDS[i]] = words_(app[ESSAY_FIELDS[i]]).length;
    total += counts[ESSAY_FIELDS[i]];
    if (counts[ESSAY_FIELDS[i]] < rf.short_essay_words) { penalty += rf.short_essay_penalty; flags.push('short:' + ESSAY_FIELDS[i]); }
  }
  if (total / ESSAY_FIELDS.length < rf.low_avg_words) { penalty += rf.low_avg_penalty; flags.push('low-avg-length'); }

  var genTotal = 0;
  for (i = 0; i < ESSAY_FIELDS.length; i++) {
    var blob = ' ' + words_(app[ESSAY_FIELDS[i]]).join(' ') + ' ', hits = 0;
    for (var g = 0; g < rf.generic_phrases.length; g++) if (blob.indexOf(rf.generic_phrases[g]) >= 0) hits++;
    if (hits) genTotal += Math.min(hits * rf.generic_phrase_penalty, rf.generic_phrase_cap);
  }
  if (genTotal) { penalty += genTotal; flags.push('generic-filler(-' + genTotal + ')'); }

  var worst = 0;
  for (i = 0; i < ESSAY_FIELDS.length; i++)
    for (var j = i + 1; j < ESSAY_FIELDS.length; j++)
      worst = Math.max(worst, cosine_(app[ESSAY_FIELDS[i]], app[ESSAY_FIELDS[j]]));
  if (worst >= rf.cross_essay_similarity_flag) { penalty += rf.cross_essay_similarity_penalty; flags.push('dup-essays(' + worst.toFixed(2) + ')'); }

  if (!/\d/.test(String(app.convert || ''))) { penalty += rf.no_numbers_in_convert_penalty; flags.push('convert-no-numbers'); }

  // Integer round-half-up — identical rule to score.py, so the two engines never diverge.
  var score = Math.max(0, Math.min(100, Math.round(struct + essayPts - penalty)));
  var gated = false;
  if (RUBRIC.gates.hasTime_no_is_reject && !yes_(app.hasTime)) { score = 0; gated = true; flags.unshift('GATE:no-time'); }
  var belowMin = score < RUBRIC.gates.min_total_score_to_pass;
  if (!gated && belowMin) flags.push('below-min');

  // min-score is a true gate (forces REJECT), not just a flag.
  var tier = (gated || belowMin) ? 'REJECT' : tierFor_(score);
  return { score: score, tier: tier, flags: flags.join('; ') };
}

function tierFor_(score) {
  for (var i = 0; i < RUBRIC.tiers.length; i++) if (score >= RUBRIC.tiers[i].min) return RUBRIC.tiers[i].label;
  return 'REJECT';
}
