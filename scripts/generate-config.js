/**
 * generate-config.js
 * Reads .env and generates env-config.js
 * Usage: node scripts/generate-config.js
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
const outputPath = path.join(root, "env-config.js");

const DEFAULTS = {
  USER_NAME: "Your Name",
  SEARCH_ACTION: "https://www.google.com/search",
  SEARCH_QUERY_PARAM: "q",
  SEARCH_PLACEHOLDER: "Search Google...",
  SUGGEST_API: "https://suggestqueries.google.com/complete/search?client=firefox&q=",
  FAVICON_SERVICE: "https://www.google.com/s2/favicons?domain={domain}&sz=64",
  TOP_BAR_LINKS: "Gmail|https://mail.google.com/,Facebook|https://www.facebook.com/,Account|https://myaccount.google.com/",
  DEFAULT_SHORTCUTS: '[{"name":"YouTube","url":"https://www.youtube.com/"},{"name":"GitHub","url":"https://github.com/"}]',
};

function parseEnv(text) {
  const vars = {};
  text.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith("#")) return;
    const eq = line.indexOf("=");
    if (eq === -1) return;
    let key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  });
  return vars;
}

function get(k) {
  return env[k] || DEFAULTS[k];
}

function parseTopBarLinks(str) {
  return str.split(",").map((pair) => {
    const [name, url] = pair.split("|");
    return { name: name.trim(), url: url.trim() };
  });
}

const env = fs.existsSync(envPath) ? parseEnv(fs.readFileSync(envPath, "utf8")) : {};

const cfg = {
  userName: get("USER_NAME"),
  topBarLinks: parseTopBarLinks(get("TOP_BAR_LINKS")),
  searchEngine: {
    action: get("SEARCH_ACTION"),
    queryParam: get("SEARCH_QUERY_PARAM"),
    placeholder: get("SEARCH_PLACEHOLDER"),
  },
  suggestAPI: get("SUGGEST_API"),
  faviconService: get("FAVICON_SERVICE"),
  defaultShortcuts: JSON.parse(get("DEFAULT_SHORTCUTS")),
};

const output = `const ENV_CONFIG = ${JSON.stringify(cfg, null, 2)};
`;

fs.writeFileSync(outputPath, output, "utf8");
console.log("Generated env-config.js from .env");
