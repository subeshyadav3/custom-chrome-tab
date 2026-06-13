const ENV_CONFIG = {
  userName: "Subesh",

  topBarLinks: [
    { name: "Gmail",    url: "https://mail.google.com/" },
    { name: "Facebook", url: "https://www.facebook.com/" },
    { name: "Account",  url: "https://myaccount.google.com/" }
  ],

  searchEngine: {
    action:      "https://www.google.com/search",
    queryParam:  "q",
    placeholder: "Search Google..."
  },

  suggestAPI: "https://suggestqueries.google.com/complete/search?client=firefox&q=",

  faviconService: "https://www.google.com/s2/favicons?domain={domain}&sz=64",

  defaultShortcuts: [
    { name: "YouTube",    url: "https://www.youtube.com/" },
    { name: "Keep Notes", url: "https://keep.google.com/#NOTE/1Kwcigr9DMjiOaldKl9uqU51tqn_uB3Gl7ShQQiGX8jb1Gc6U7uFSVO4tjSc2Bw" },
    { name: "doh",        url: "https://www.hindwi.org/poets/kabir/dohe" },
    { name: "Discord",    url: "https://discord.com/channels/@me" },
    { name: "disi",       url: "https://github.com/AAreLaa/DISI/" },
    { name: "Doc",        url: "https://docs.google.com/document/d/13grc3U_SYkzMbkzAFdyFlrhi_7f3XmLlSwLhWIDJSTc/edit?tab=t.0" },
    { name: "fast.ai",    url: "https://course.fast.ai/" },
    { name: "ML",         url: "https://developers.google.com/machine-learning/crash-course/linear-regression" },
    { name: "ChatGPT",    url: "https://chat.openai.com" }
  ],

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

  famousSites: [
    { name: "YouTube",       url: "https://www.youtube.com/",     category: "Social" },
    { name: "Reddit",        url: "https://www.reddit.com/",      category: "Social" },
    { name: "Twitter / X",   url: "https://x.com/",              category: "Social" },
    { name: "Instagram",     url: "https://www.instagram.com/",   category: "Social" },
    { name: "LinkedIn",      url: "https://www.linkedin.com/",    category: "Social" },
    { name: "WhatsApp",      url: "https://web.whatsapp.com/",    category: "Social" },
    { name: "Discord",       url: "https://discord.com/channels/@me", category: "Social" },
    { name: "Telegram",      url: "https://web.telegram.org/",    category: "Social" },
    { name: "GitHub",        url: "https://github.com/",          category: "Dev" },
    { name: "Stack Overflow",url: "https://stackoverflow.com/",   category: "Dev" },
    { name: "CodePen",       url: "https://codepen.io/",          category: "Dev" },
    { name: "Hacker News",   url: "https://news.ycombinator.com/",category: "Dev" },
    { name: "Dev.to",        url: "https://dev.to/",              category: "Dev" },
    { name: "GitLab",        url: "https://gitlab.com/",          category: "Dev" },
    { name: "ChatGPT",       url: "https://chat.openai.com",      category: "AI" },
    { name: "Claude",        url: "https://claude.ai/",           category: "AI" },
    { name: "Perplexity",    url: "https://www.perplexity.ai/",   category: "AI" },
    { name: "Gmail",         url: "https://mail.google.com/",     category: "Productivity" },
    { name: "Google Drive",  url: "https://drive.google.com/",    category: "Productivity" },
    { name: "Calendar",      url: "https://calendar.google.com/", category: "Productivity" },
    { name: "Notion",        url: "https://www.notion.so/",       category: "Productivity" },
    { name: "Google Keep",   url: "https://keep.google.com/",     category: "Productivity" },
    { name: "Outlook",       url: "https://outlook.live.com/",    category: "Productivity" },
    { name: "Netflix",       url: "https://www.netflix.com/",     category: "Entertainment" },
    { name: "Spotify",       url: "https://open.spotify.com/",    category: "Entertainment" },
    { name: "Twitch",        url: "https://www.twitch.tv/",       category: "Entertainment" },
    { name: "Amazon",        url: "https://www.amazon.com/",      category: "Shopping" },
    { name: "eBay",          url: "https://www.ebay.com/",        category: "Shopping" },
    { name: "Figma",         url: "https://www.figma.com/",       category: "Design" },
    { name: "Canva",         url: "https://www.canva.com/",       category: "Design" },
    { name: "Wikipedia",     url: "https://en.wikipedia.org/",    category: "Reference" },
    { name: "Medium",        url: "https://medium.com/",          category: "Reading" },
  ]
};
