/**
 * ============================================
 * Custom New Tab - Configuration
 * ============================================
 * Copy this file to env-config.js and edit the values.
 * env-config.js is gitignored (keeps your personal data safe).
 *
 * Usage: const ENV_CONFIG = { ... };
 *         Then set your values and save.
 * ============================================
 */

const ENV_CONFIG = {
  // ─── Display ─────────────────────────────────────────
  userName: "Your Name",

  // ─── Top Bar Links ───────────────────────────────────
  // Items shown in the top-right corner.
  // Each needs: name, url. Optional: icon (favicon auto-fetched if omitted)
  topBarLinks: [
    { name: "Gmail",    url: "https://mail.google.com/" },
    { name: "Facebook", url: "https://www.facebook.com/" },
    { name: "Account",  url: "https://myaccount.google.com/" }
  ],

  // ─── Search Engine ────────────────────────────────────
  searchEngine: {
    action:      "https://www.google.com/search",
    queryParam:  "q",
    placeholder: "Search Google..."
  },

  // ─── Autocomplete API ─────────────────────────────────
  // Leave empty string "" to disable search suggestions
  suggestAPI: "https://suggestqueries.google.com/complete/search?client=firefox&q=",

  // ─── Favicon Service ──────────────────────────────────
  // {domain} will be replaced with the site's hostname
  faviconService: "https://www.google.com/s2/favicons?domain={domain}&sz=64",

  // ─── Default Shortcuts ────────────────────────────────
  // Shown on first visit (before any are added or edited)
  // These can be customized later via the UI
  defaultShortcuts: [
    { name: "YouTube", url: "https://www.youtube.com/" },
    { name: "GitHub",  url: "https://github.com/" },
    { name: "ChatGPT", url: "https://chat.openai.com" },
    { name: "Reddit",  url: "https://www.reddit.com/" }
  ],

  // ─── Quotes ───────────────────────────────────────────
  // A random quote is shown each time you open a new tab
  quotes: [
    "Stay hungry, stay foolish.",
    "Discipline beats motivation.",
    "Code is read more than it is written.",
    "Consistency compounds.",
    "First make it work, then make it right.",
    "Small progress is still progress.",
    "Think deeply. Build simply.",
    "Debugging is twice as hard as writing the code."
  ],

  // ─── Famous Sites (for the + Add menu) ────────────────
  // Click the "+" button in the top-right to quickly add
  // any of these to your top bar. Items are grouped by category.
  famousSites: [
    // ── Social ──
    { name: "YouTube",       url: "https://www.youtube.com/",     category: "Social" },
    { name: "Reddit",        url: "https://www.reddit.com/",      category: "Social" },
    { name: "Twitter / X",   url: "https://x.com/",              category: "Social" },
    { name: "Instagram",     url: "https://www.instagram.com/",   category: "Social" },
    { name: "LinkedIn",      url: "https://www.linkedin.com/",    category: "Social" },
    { name: "WhatsApp",      url: "https://web.whatsapp.com/",    category: "Social" },
    { name: "Discord",       url: "https://discord.com/channels/@me", category: "Social" },
    { name: "Telegram",      url: "https://web.telegram.org/",    category: "Social" },
    // ── Dev ──
    { name: "GitHub",        url: "https://github.com/{input}",   category: "Dev", prompt: "GitHub username" },
    { name: "Stack Overflow",url: "https://stackoverflow.com/",   category: "Dev" },
    { name: "CodePen",       url: "https://codepen.io/",          category: "Dev" },
    { name: "Hacker News",   url: "https://news.ycombinator.com/",category: "Dev" },
    { name: "Dev.to",        url: "https://dev.to/",              category: "Dev" },
    { name: "GitLab",        url: "https://gitlab.com/",          category: "Dev" },
    // ── AI ──
    { name: "ChatGPT",       url: "https://chat.openai.com",      category: "AI" },
    { name: "Claude",        url: "https://claude.ai/",           category: "AI" },
    { name: "Perplexity",    url: "https://www.perplexity.ai/",   category: "AI" },
    // ── Productivity ──
    { name: "Gmail",         url: "https://mail.google.com/",     category: "Productivity" },
    { name: "Google Drive",  url: "https://drive.google.com/",    category: "Productivity" },
    { name: "Calendar",      url: "https://calendar.google.com/", category: "Productivity" },
    { name: "Notion",        url: "https://www.notion.so/",       category: "Productivity" },
    { name: "Google Keep",   url: "https://keep.google.com/",     category: "Productivity" },
    { name: "Outlook",       url: "https://outlook.live.com/",    category: "Productivity" },
    // ── Entertainment ──
    { name: "Netflix",       url: "https://www.netflix.com/",     category: "Entertainment" },
    { name: "Spotify",       url: "https://open.spotify.com/",    category: "Entertainment" },
    { name: "Twitch",        url: "https://www.twitch.tv/",       category: "Entertainment" },
    // ── Shopping ──
    { name: "Amazon",        url: "https://www.amazon.com/",      category: "Shopping" },
    { name: "eBay",          url: "https://www.ebay.com/",        category: "Shopping" },
    // ── Design ──
    { name: "Figma",         url: "https://www.figma.com/",       category: "Design" },
    { name: "Canva",         url: "https://www.canva.com/",       category: "Design" },
    // ── Reference ──
    { name: "Wikipedia",     url: "https://en.wikipedia.org/",    category: "Reference" },
    { name: "Medium",        url: "https://medium.com/",          category: "Reading" },
    // ── Nepali ──
    { name: "Hamro Patro",   url: "https://hamropatro.com/",      category: "Nepali" },
    { name: "Khalti",        url: "https://khalti.com/",         category: "Nepali" },
    { name: "eSewa",         url: "https://esewa.com.np/",       category: "Nepali" },
    { name: "SastoDeal",     url: "https://www.sastodeal.com/",   category: "Nepali" },
    { name: "Daraz",         url: "https://www.daraz.com.np/",    category: "Nepali" },
  ]
};
