const fs = require('fs');
// Stub the Google Apps Script globals so Code.gs loads in plain Node.
global.SpreadsheetApp = { getUi(){return{createMenu(){return{addItem(){return this;},addSeparator(){return this;},addToUi(){}};}};} };
global.PropertiesService = { getScriptProperties(){return{getProperty(){return null;}};} };
global.UrlFetchApp = {}; global.Logger = { log(){} };
// Load Code.gs into this scope (top-level var/function become locals via indirect eval into global).
const src = fs.readFileSync('apps_script/Code.gs','utf8');
eval(src);
const data = JSON.parse(fs.readFileSync('.scratch/applicants.json','utf8'));
let allMatch = true;
console.log('NAME                 PY     GS    MATCH');
for (const row of data) {
  const res = scoreApplicant_(row.app, null);   // null key → heuristic, never calls Gemini
  const match = Math.abs(res.score - row.py) < 0.05;
  allMatch = allMatch && match;
  console.log(`${row.name.padEnd(20)} ${String(row.py).padStart(5)}  ${String(res.score).padStart(5)}   ${match?'✓':'✗  ('+res.tier+')'}`);
}
console.log('\nPARITY:', allMatch ? 'IDENTICAL — Apps Script == Python' : 'MISMATCH');
process.exit(allMatch?0:1);
