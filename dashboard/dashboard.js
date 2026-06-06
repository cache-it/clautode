"use strict";

/* Dashboard page — renders the opened folder's CLAUDE.md + skill/agent analytics.
 * Depends on common.js. */

/* --- minimal Markdown renderer --- */
function inline(text) {
  let out = "";
  for (const part of text.split(/(`[^`]+`)/g)) {
    if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
      out += "<code>" + escapeHtml(part.slice(1, -1)) + "</code>";
      continue;
    }
    let e = escapeHtml(part);
    e = e.replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g, (_m, u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
    e = e.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`);
    e = e.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    e = e.replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>");
    e = e.replace(/(^|[^_])_([^_\s][^_]*?)_/g, "$1<em>$2</em>");
    out += e;
  }
  return out;
}
function renderList(lines) {
  const items = [];
  for (const l of lines) {
    const m = l.match(/^(\s*)([-*]|\d+[.)])\s+(.*)$/);
    if (m) items.push({ indent: m[1].length, ordered: /\d/.test(m[2]), text: m[3] });
    else if (items.length) items[items.length - 1].text += " " + l.trim();
  }
  let html = "";
  const stack = [];
  for (const it of items) {
    while (stack.length && it.indent < stack[stack.length - 1].indent) html += stack.pop().ordered ? "</ol>" : "</ul>";
    if (!stack.length || it.indent > stack[stack.length - 1].indent) {
      html += it.ordered ? "<ol>" : "<ul>";
      stack.push({ indent: it.indent, ordered: it.ordered });
    }
    html += "<li>" + inline(it.text) + "</li>";
  }
  while (stack.length) html += stack.pop().ordered ? "</ol>" : "</ul>";
  return html;
}
function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let i = 0;
  const isList = (l) => /^(\s*)([-*]|\d+[.)])\s+/.test(l);
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      i++;
      let code = "";
      while (i < lines.length && !/^```/.test(lines[i])) { code += lines[i] + "\n"; i++; }
      i++;
      html += "<pre><code>" + escapeHtml(code.replace(/\n$/, "")) + "</code></pre>";
      continue;
    }
    if (/^---+\s*$/.test(line)) { html += "<hr>"; i++; continue; }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { html += `<h${h[1].length}>` + inline(h[2]) + `</h${h[1].length}>`; i++; continue; }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      const alert = buf[0] && buf[0].match(/^\[!(\w+)\]\s*(.*)$/);
      if (alert) {
        buf[0] = alert[2] || "";
        html += `<div class="alert alert-${alert[1].toLowerCase()}"><span class="alert-title">${alert[1]}</span>` +
                renderMarkdown(buf.join("\n")) + "</div>";
      } else {
        html += "<blockquote>" + renderMarkdown(buf.join("\n")) + "</blockquote>";
      }
      continue;
    }
    if (/^\|.*\|/.test(line) && i + 1 < lines.length && /^\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      const rows = [line]; i += 2;
      while (i < lines.length && /^\|.*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const parse = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = parse(rows[0]);
      let t = "<table><thead><tr>" + head.map((c) => "<th>" + inline(c) + "</th>").join("") + "</tr></thead><tbody>";
      for (let r = 1; r < rows.length; r++) t += "<tr>" + parse(rows[r]).map((c) => "<td>" + inline(c) + "</td>").join("") + "</tr>";
      html += t + "</tbody></table>";
      continue;
    }
    if (isList(line)) {
      const buf = [];
      while (i < lines.length && (isList(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && buf.length))) { buf.push(lines[i]); i++; }
      html += renderList(buf);
      continue;
    }
    if (/^\s*$/.test(line)) { i++; continue; }
    const buf = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6})\s/.test(lines[i]) && !/^```/.test(lines[i]) &&
           !/^>/.test(lines[i]) && !/^---+\s*$/.test(lines[i]) && !/^\|.*\|/.test(lines[i]) && !isList(lines[i])) {
      buf.push(lines[i]); i++;
    }
    html += "<p>" + inline(buf.join(" ")) + "</p>";
  }
  return html;
}

/* --- page elements --- */
const claudeView = document.getElementById("claudeView");
const reloadBtn = document.getElementById("reloadBtn");
const analyticsEl = document.getElementById("analytics");

async function loadClaude() {
  if (rootHandle) {
    try {
      const fh = await rootHandle.getFileHandle("CLAUDE.md");
      const text = await (await fh.getFile()).text();
      claudeView.innerHTML = renderMarkdown(text);
      lsSet("cm-claude", text);
      return;
    } catch (e) { /* fall through */ }
  }
  try {
    const res = await fetch("../CLAUDE.md", { cache: "no-store" });
    if (!res.ok) throw 0;
    const text = await res.text();
    claudeView.innerHTML = renderMarkdown(text);
    lsSet("cm-claude", text);
  } catch (e) {
    claudeView.innerHTML = '<p class="hint">Open the repo folder to load its <code>CLAUDE.md</code>.</p>';
  }
}
reloadBtn.addEventListener("click", loadClaude);

function restoreClaude() { const text = lsGet("cm-claude"); if (text) claudeView.innerHTML = renderMarkdown(text); }

function statCard(title, names) {
  const list = names.length
    ? '<ul class="mini">' + names.slice().sort().map((n) => `<li>${escapeHtml(n)}</li>`).join("") + "</ul>"
    : '<p class="hint">none</p>';
  return `<div class="stat"><div class="stat-num">${names.length}</div><div class="stat-label">${title}</div>${list}</div>`;
}
function renderAnalytics(node) {
  const skillsNode = node.skills || {};
  const skills = Object.keys(skillsNode).filter((k) => k !== "__files")
    .filter((n) => (skillsNode[n].__files || []).some((f) => /^SKILL\.md$/i.test(f)));
  const agentsNode = node.agents || {};
  const agents = (agentsNode.__files || [])
    .filter((f) => /\.md$/i.test(f) && !/^README\.md$/i.test(f)).map((f) => f.replace(/\.md$/i, ""));
  analyticsEl.innerHTML = statCard("Skills", skills) + statCard("Agents", agents);
}

/* Called by common.js when the repo opens/reconnects. */
async function onRepoReady() {
  const wrap = await buildTree();
  renderAnalytics(repoNodeOf(wrap).node);
  loadClaude();
}

/* init */
restoreClaude();
const cachedTree = loadTreeCache();
if (cachedTree) renderAnalytics(repoNodeOf(cachedTree).node);
restoreRepo();
