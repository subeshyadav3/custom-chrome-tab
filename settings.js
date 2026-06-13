const SK = "custom-tab-settings";

const SEARCH_ENGINES = {
  google:     { name: "Google",     action: "https://www.google.com/search",       param: "q" },
  duckduckgo: { name: "DuckDuckGo", action: "https://duckduckgo.com/",             param: "q" },
  bing:       { name: "Bing",       action: "https://www.bing.com/search",         param: "q" },
  brave:      { name: "Brave",      action: "https://search.brave.com/search",     param: "q" },
  yandex:     { name: "Yandex",     action: "https://yandex.com/search/",          param: "text" },
  ecosia:     { name: "Ecosia",     action: "https://www.ecosia.org/search",       param: "q" },
};

function defaultFamousSites() {
  return [
    { name: "YouTube", url: "https://www.youtube.com/", category: "Social" },
    { name: "Reddit", url: "https://www.reddit.com/", category: "Social" },
    { name: "Twitter / X", url: "https://x.com/", category: "Social" },
    { name: "Instagram", url: "https://www.instagram.com/", category: "Social" },
    { name: "LinkedIn", url: "https://www.linkedin.com/", category: "Social" },
    { name: "WhatsApp", url: "https://web.whatsapp.com/", category: "Social" },
    { name: "Discord", url: "https://discord.com/channels/@me", category: "Social" },
    { name: "Telegram", url: "https://web.telegram.org/", category: "Social" },
    { name: "Hamro Patro", url: "https://hamropatro.com/", category: "Nepali" },
    { name: "Khalti", url: "https://khalti.com/", category: "Nepali" },
    { name: "eSewa", url: "https://esewa.com.np/", category: "Nepali" },
    { name: "SastoDeal", url: "https://www.sastodeal.com/", category: "Nepali" },
    { name: "Daraz", url: "https://www.daraz.com.np/", category: "Nepali" },
    { name: "ChatGPT", url: "https://chat.openai.com", category: "AI" },
    { name: "Claude", url: "https://claude.ai/", category: "AI" },
    { name: "Perplexity", url: "https://www.perplexity.ai/", category: "AI" },
    { name: "Gmail", url: "https://mail.google.com/", category: "Productivity" },
    { name: "Google Drive", url: "https://drive.google.com/", category: "Productivity" },
    { name: "Calendar", url: "https://calendar.google.com/", category: "Productivity" },
    { name: "Notion", url: "https://www.notion.so/", category: "Productivity" },
    { name: "Google Keep", url: "https://keep.google.com/", category: "Productivity" },
    { name: "Outlook", url: "https://outlook.live.com/", category: "Productivity" },
    { name: "Netflix", url: "https://www.netflix.com/", category: "Entertainment" },
    { name: "Spotify", url: "https://open.spotify.com/", category: "Entertainment" },
    { name: "Twitch", url: "https://www.twitch.tv/", category: "Entertainment" },
    { name: "GitHub", url: "https://github.com/{input}", category: "Dev", prompt: "GitHub username", placeholder: "e.g. subeshyadav3" },
    { name: "Stack Overflow", url: "https://stackoverflow.com/", category: "Dev" },
    { name: "CodePen", url: "https://codepen.io/", category: "Dev" },
    { name: "Hacker News", url: "https://news.ycombinator.com/", category: "Dev" },
    { name: "Dev.to", url: "https://dev.to/", category: "Dev" },
    { name: "GitLab", url: "https://gitlab.com/", category: "Dev" },
    { name: "Amazon", url: "https://www.amazon.com/", category: "Shopping" },
    { name: "eBay", url: "https://www.ebay.com/", category: "Shopping" },
    { name: "Figma", url: "https://www.figma.com/", category: "Design" },
    { name: "Canva", url: "https://www.canva.com/", category: "Design" },
    { name: "Wikipedia", url: "https://en.wikipedia.org/", category: "Reference" },
    { name: "Medium", url: "https://medium.com/", category: "Reading" },
  ];
}

function defaultSettings() {
  const cfg = typeof ENV_CONFIG !== "undefined" && ENV_CONFIG ? ENV_CONFIG : {};
  return {
    version: 1,
    theme: {
      mode: "dark",
      accent: "#3b82f6",
      background: { type: "solid", value: "#020617" },
      font: "'JetBrains Mono', monospace",
    },
    layout: {
      showGreeting: true,
      showTime: true,
      showDate: false,
      showQuote: true,
      showSearch: true,
      showTopBar: true,
      showShortcuts: true,
      showTodo: true,
      showPomodoro: false,
      lockLayout: false,
      iconSize: 32,
    },
    search: {
      engine: "google",
      customAction: "",
      customParam: "q",
      showSuggestions: true,
    },
    greeting: {
      name: cfg.userName || "Your Name",
      dynamic: true,
      subtitle: "",
    },
    widgets: {
      date: false,
      dateFormat: "full",
      weather: false,
      weatherLocation: "",
      weatherUnit: "celsius",
    },
    pomodoro: {
      work: 25,
      break: 5,
    },
    positions: {},
    advanced: {
      customCSS: "",
    },
    quotes: cfg.quotes && cfg.quotes.length ? cfg.quotes : [
      "Stay hungry, stay foolish.",
      "Discipline beats motivation.",
      "Code is read more than it is written.",
      "Consistency compounds.",
      "First make it work, then make it right.",
      "Small progress is still progress.",
      "Think deeply. Build simply.",
      "Debugging is twice as hard as writing the code.",
    ],
    faviconService: cfg.faviconService || "https://www.google.com/s2/favicons?domain={domain}&sz=64",
    suggestAPI: cfg.suggestAPI || "https://suggestqueries.google.com/complete/search?client=firefox&q=",
    famousSites: cfg.famousSites && cfg.famousSites.length ? cfg.famousSites : defaultFamousSites(),
    topBarLinks: cfg.topBarLinks || [],
    userName: cfg.userName || "Your Name",
  };
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SK);
    if (raw) {
      const saved = JSON.parse(raw);
      const merged = deepMerge(defaultSettings(), saved);
      // Merge famousSites items so new fields (e.g. prompt) from code updates are picked up
      const def = defaultSettings();
      if (def.famousSites) {
        const siteMap = {};
        def.famousSites.forEach((s, i) => { siteMap[s.name + "|" + i] = s; });
        merged.famousSites = def.famousSites.map((defItem, i) => {
          const savedIdx = saved.famousSites ? saved.famousSites.findIndex((x) => x.name === defItem.name) : -1;
          if (savedIdx !== -1) {
            const savedItem = saved.famousSites[savedIdx];
            saved.famousSites.splice(savedIdx, 1);
            return Object.assign({}, savedItem, defItem);
          }
          return defItem;
        });
        // Append any user-added sites that don't exist in defaults
        if (saved.famousSites) merged.famousSites = merged.famousSites.concat(saved.famousSites);
      }
      return merged;
    }
  } catch (_) {}
  return defaultSettings();
}

function saveSettings(s) {
  localStorage.setItem(SK, JSON.stringify(s));
}

function deepMerge(base, override) {
  const out = {};
  for (const k of Object.keys(base)) {
    if (override && k in override) {
      if (typeof base[k] === "object" && base[k] !== null && !Array.isArray(base[k])) {
        out[k] = deepMerge(base[k], override[k]);
      } else {
        out[k] = override[k];
      }
    } else {
      out[k] = base[k];
    }
  }
  return out;
}

function resetSettings() {
  const d = defaultSettings();
  saveSettings(d);
  return d;
}

const S = loadSettings();

// ─── Theme Engine ────────────────────────────────────────

function applyTheme(theme) {
  const root = document.documentElement;

  if (theme.mode === "auto") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyPalette(prefersDark ? "dark" : "light");
    root.style.setProperty("--theme-mode", "auto");
  } else {
    applyPalette(theme.mode);
    root.style.setProperty("--theme-mode", theme.mode);
  }

  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-hover", adjustBrightness(theme.accent, -20));
  root.style.setProperty("--font", theme.font);

  const existingVideo = document.getElementById("bg-video-container");
  if (existingVideo) existingVideo.remove();

  if (theme.background.type === "solid") {
    root.style.setProperty("--bg-image", "none");
    root.style.setProperty("--bg-color", theme.background.value);
  } else if (theme.background.type === "gradient") {
    root.style.setProperty("--bg-image", theme.background.value);
    root.style.setProperty("--bg-color", "transparent");
  } else if (theme.background.type === "image") {
    root.style.setProperty("--bg-image", "url(" + theme.background.value + ")");
    root.style.setProperty("--bg-color", "transparent");
  } else if (theme.background.type === "video") {
    root.style.setProperty("--bg-image", "none");
    root.style.setProperty("--bg-color", "transparent");
    const video = document.createElement("video");
    video.id = "bg-video";
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsinline = true;
    video.src = theme.background.value;
    const container = document.createElement("div");
    container.id = "bg-video-container";
    container.appendChild(video);
    document.body.prepend(container);
  }
}

function applyPalette(mode) {
  const root = document.documentElement;
  if (mode === "dark") {
    root.style.setProperty("--bg", "#020617");
    root.style.setProperty("--bg-card", "#0f172a");
    root.style.setProperty("--bg-hover", "#1e293b");
    root.style.setProperty("--fg", "#e5e7eb");
    root.style.setProperty("--fg-muted", "#94a3b8");
    root.style.setProperty("--fg-dim", "#64748b");
    root.style.setProperty("--border", "#1e293b");
    root.style.setProperty("--overlay", "rgba(0,0,0,0.6)");
  } else {
    root.style.setProperty("--bg", "#ffffff");
    root.style.setProperty("--bg-card", "#f8fafc");
    root.style.setProperty("--bg-hover", "#f1f5f9");
    root.style.setProperty("--fg", "#0f172a");
    root.style.setProperty("--fg-muted", "#64748b");
    root.style.setProperty("--fg-dim", "#94a3b8");
    root.style.setProperty("--border", "#e2e8f0");
    root.style.setProperty("--overlay", "rgba(0,0,0,0.3)");
  }
}

function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 255) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + percent));
  const b = Math.min(255, Math.max(0, (num & 255) + percent));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ─── Apply settings ─────────────────────────────────────

function applySettings() {
  const s = loadSettings();
  applyTheme(s.theme);
  applyLayout(s.layout);
  applyGreeting(s.greeting);
  applySearch(s.search);
  applyAdvanced(s.advanced);
  applyWidgets(s);
  applyPositions(s);
  initDraggable();
}

function applyLayout(layout) {
  document.getElementById("greeting").style.display = layout.showGreeting ? "" : "none";
  document.getElementById("time").style.display = layout.showTime ? "" : "none";
  document.getElementById("quote").style.display = layout.showQuote ? "" : "none";
  document.getElementById("google-search").style.display = layout.showSearch ? "" : "none";
  document.getElementById("top-bar").style.display = layout.showTopBar ? "" : "none";
  document.getElementById("quick-links").style.display = layout.showShortcuts ? "" : "none";

  const dateEl = document.getElementById("widget-date");
  if (dateEl) dateEl.style.display = layout.showDate ? "" : "none";

  const todoEl = document.getElementById("widget-todo");
  if (todoEl) todoEl.style.display = layout.showTodo ? "" : "none";

  const pomoEl = document.getElementById("widget-pomo");
  if (pomoEl) pomoEl.style.display = layout.showPomodoro ? "" : "none";

  const cards = document.querySelectorAll(".link-card img");
  cards.forEach((img) => {
    img.style.width = layout.iconSize + "px";
    img.style.height = layout.iconSize + "px";
  });
}

function applyGreeting(g) {
  const el = document.getElementById("greeting");
  if (g.dynamic) {
    const h = new Date().getHours();
    let prefix = "";
    if (h < 12) prefix = "Good morning, ";
    else if (h < 17) prefix = "Good afternoon, ";
    else prefix = "Good evening, ";
    el.innerHTML = prefix + "&lt;" + g.name + " /&gt;";
  } else {
    el.innerHTML = "&lt;" + g.name + " /&gt;";
  }
  document.getElementById("greeting-subtitle").textContent = g.subtitle;
}

function applySearch(s) {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const suggEl = document.getElementById("suggestions");

  if (s.engine === "custom") {
    form.action = s.customAction;
    input.name = s.customParam;
  } else if (SEARCH_ENGINES[s.engine]) {
    form.action = SEARCH_ENGINES[s.engine].action;
    input.name = SEARCH_ENGINES[s.engine].param;
  } else {
    form.action = "https://www.google.com/search";
    input.name = "q";
  }

  const engines = { google: "Google", duckduckgo: "DuckDuckGo", bing: "Bing", brave: "Brave", yandex: "Yandex", ecosia: "Ecosia" };
  input.placeholder = "Search " + (engines[s.engine] || "Custom") + "...";
  suggEl.style.display = "none";
}

function applyAdvanced(a) {
  const styleEl = document.getElementById("custom-css-style") || (function () {
    const el = document.createElement("style");
    el.id = "custom-css-style";
    document.head.appendChild(el);
    return el;
  })();
  styleEl.textContent = a.customCSS || "";
}

// ─── Widgets ─────────────────────────────────────────────

function applyWidgets(s) {
  const layout = s.layout;
  const w = s.widgets;

  const dateEl = document.getElementById("widget-date");
  if (dateEl) {
    dateEl.style.display = layout.showDate ? "" : "none";
    if (layout.showDate) updateDateWidget(w.dateFormat);
  }

  const todoEl = document.getElementById("widget-todo");
  if (todoEl) todoEl.style.display = layout.showTodo ? "" : "none";
}

function updateDateWidget(format) {
  const el = document.getElementById("widget-date");
  if (!el) return;
  const now = new Date();
  const opts = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  if (format === "short") {
    el.textContent = now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } else if (format === "weekday") {
    el.textContent = now.toLocaleDateString(undefined, { weekday: "long" });
  } else {
    el.textContent = now.toLocaleDateString(undefined, opts);
  }
}

// ─── Pomodoro ────────────────────────────────────────────

let pomoInterval = null;
let pomoState = { running: false, type: "work", remaining: 0 };

function pomoFormatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function pomoUpdateDisplay() {
  const el = document.getElementById("widget-pomo");
  if (!el) return;
  const timer = el.querySelector(".pomo-timer");
  const btn = el.querySelector(".pomo-btn");
  const label = el.querySelector(".pomo-label");
  if (timer) timer.textContent = pomoFormatTime(pomoState.remaining);
  if (btn) btn.textContent = pomoState.running ? "Pause" : "Start";
  if (label) label.textContent = pomoState.type === "work" ? "Focus" : "Break";
}

function pomoTick() {
  if (pomoState.remaining <= 0) {
    clearInterval(pomoInterval);
    pomoInterval = null;
    pomoState.running = false;
    pomoState.type = pomoState.type === "work" ? "break" : "work";
    const s = loadSettings();
    pomoState.remaining = (pomoState.type === "work" ? s.pomodoro.work : s.pomodoro.break) * 60;
    pomoUpdateDisplay();
    return;
  }
  pomoState.remaining--;
  pomoUpdateDisplay();
}

function resetPomo() {
  if (pomoInterval) { clearInterval(pomoInterval); pomoInterval = null; }
  const s = loadSettings();
  pomoState = { running: false, type: "work", remaining: s.pomodoro.work * 60 };
  pomoUpdateDisplay();
}

function initPomodoro() {
  const el = document.getElementById("widget-pomo");
  if (!el) return;
  const btn = el.querySelector(".pomo-btn");
  const resetBtn = el.querySelector(".pomo-reset");
  if (!btn || !resetBtn) return;

  if (!pomoState._initialized) {
    const s = loadSettings();
    pomoState.remaining = s.pomodoro.work * 60;
    pomoUpdateDisplay();

    btn.addEventListener("click", function () {
      if (pomoState.running) {
        clearInterval(pomoInterval);
        pomoInterval = null;
        pomoState.running = false;
        pomoUpdateDisplay();
      } else {
        pomoState.running = true;
        pomoInterval = setInterval(pomoTick, 1000);
        pomoUpdateDisplay();
      }
    });

    resetBtn.addEventListener("click", resetPomo);
    pomoState._initialized = true;
  }
}

// ─── Todo ─────────────────────────────────────────────────

const TODO_KEY = "custom-tab-todos";

function loadTodos() {
  try { return JSON.parse(localStorage.getItem(TODO_KEY)) || []; } catch { return []; }
}

function saveTodos(list) {
  localStorage.setItem(TODO_KEY, JSON.stringify(list));
}

function initTodo() {
  const el = document.getElementById("widget-todo");
  if (!el) return;
  const input = el.querySelector(".todo-input");
  const list = el.querySelector(".todo-list");
  const count = el.querySelector(".todo-count");

  function render() {
    const items = loadTodos();
    list.innerHTML = "";
    items.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "todo-item" + (item.done ? " done" : "");

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = item.done;
      cb.addEventListener("change", function () {
        const t = loadTodos();
        t[i].done = cb.checked;
        saveTodos(t);
        render();
      });

      const span = document.createElement("span");
      span.textContent = item.text;

      const del = document.createElement("button");
      del.textContent = "✕";
      del.className = "todo-del";
      del.addEventListener("click", function () {
        const t = loadTodos();
        t.splice(i, 1);
        saveTodos(t);
        render();
      });

      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });

    const done = items.filter((t) => t.done).length;
    count.textContent = done + " / " + items.length + " done";
  }

  if (!el._todoInit) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && input.value.trim()) {
        const items = loadTodos();
        items.push({ text: input.value.trim(), done: false });
        saveTodos(items);
        input.value = "";
        render();
      }
    });
    el._todoInit = true;
  }
  render();
}

// ─── Weather ──────────────────────────────────────────────

function initWeather() {
  const el = document.getElementById("widget-weather");
  if (!el) return;
  const s = loadSettings();
  if (!s.widgets.weather || !s.widgets.weatherLocation) return;

  const city = s.widgets.weatherLocation;

  fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1")
    .then((r) => r.json())
    .then((data) => {
      if (!data.results || !data.results.length) {
        el.textContent = "Weather: location not found";
        return;
      }
      const { latitude, longitude, name } = data.results[0];
      const unit = s.widgets.weatherUnit === "celsius" ? "celsius" : "fahrenheit";
      return fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
          latitude + "&longitude=" + longitude +
          "&current_weather=true&daily=temperature_max,temperature_min&temperature_unit=" + unit
      );
    })
    .then((r) => r && r.json())
    .then((data) => {
      if (!data) return;
      const cur = data.current_weather;
      const temp = Math.round(cur.temperature);
      const unit = s.widgets.weatherUnit === "celsius" ? "°C" : "°F";
      const wmo = cur.weathercode;
      const desc = weatherDescription(wmo);
      el.innerHTML =
        '<span class="weather-temp">' + temp + unit + "</span> " +
        '<span class="weather-desc">' + desc + "</span>";
    })
    .catch(() => {
      el.textContent = "Weather unavailable";
    });
}

function weatherDescription(code) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

// ─── Draggable Layout ─────────────────────────────────────

let dragState = null;

const DRAGGABLE_SELECTORS = [
  "#widget-pomo",
  "#widget-date",
  "#widget-todo",
  "#widget-weather",
  "#time",
  "#settings-btn",
];

function applyPositions(s) {
  const pos = s.positions || {};
  DRAGGABLE_SELECTORS.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const p = pos[sel];
    if (p) {
      el.style.position = p.position || "fixed";
      if (p.left !== undefined) el.style.left = p.left;
      if (p.top !== undefined) el.style.top = p.top;
      if (p.right !== undefined) el.style.right = p.right;
      if (p.bottom !== undefined) el.style.bottom = p.bottom;
    }
  });
}

function startDragElement(el, sel, e) {
  e.preventDefault();
  el.style.transition = "none";
  const rect = el.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  function onMove(ev) {
    let x = ev.clientX - offsetX;
    let y = ev.clientY - offsetY;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.position = "fixed";
    el.classList.add("dragging");
  }

  function onUp() {
    el.classList.remove("dragging");
    el.style.transition = "";
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    const s = loadSettings();
    if (!s.positions) s.positions = {};
    s.positions[sel] = {
      position: "fixed",
      left: el.style.left,
      top: el.style.top,
    };
    saveSettings(s);
  }

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}

function makeDraggable(sel) {
  const el = document.querySelector(sel);
  if (!el || el.dataset.draggableInit) return;
  el.dataset.draggableInit = "1";

  const hasHandle = sel === "#widget-pomo" || sel === "#widget-todo";
  const isDblClick = !hasHandle;

  if (hasHandle) {
    const handle = document.createElement("div");
    handle.className = "drag-handle hamburger";
    handle.innerHTML = "&#x2630;";
    handle.title = "Drag to reposition";
    el.insertBefore(handle, el.firstChild);
    handle.addEventListener("mousedown", function (e) {
      if (loadSettings().layout.lockLayout) return;
      startDragElement(el, sel, e);
    });
  }

  if (isDblClick) {
    el.addEventListener("dblclick", function (e) {
      if (loadSettings().layout.lockLayout) return;
      e.preventDefault();
      el.classList.add("move-mode");

      const onMousedown = function (ev) {
        el.classList.remove("move-mode");
        el.removeEventListener("mousedown", onMousedown);
        document.removeEventListener("mousedown", onCancel, true);
        document.removeEventListener("keydown", onCancel);
        startDragElement(el, sel, ev);
      };

      const onCancel = function (ev) {
        if (ev.type === "keydown" && ev.key !== "Escape") return;
        if (ev.type === "mousedown" && el.contains(ev.target)) return;
        el.classList.remove("move-mode");
        el.removeEventListener("mousedown", onMousedown);
        document.removeEventListener("mousedown", onCancel, true);
        document.removeEventListener("keydown", onCancel);
      };

      el.addEventListener("mousedown", onMousedown, { once: true });
      document.addEventListener("mousedown", onCancel, true);
      document.addEventListener("keydown", onCancel);
    });
  }
}

function initDraggable() {
  DRAGGABLE_SELECTORS.forEach((sel) => {
    if (document.querySelector(sel)) makeDraggable(sel);
  });
}

// ─── Settings Panel ───────────────────────────────────────

function openSettings() {
  document.getElementById("settings-overlay").classList.add("show");
  document.getElementById("settings-panel").classList.add("show");
  renderSettingsForm();
}

function closeSettings() {
  document.getElementById("settings-overlay").classList.remove("show");
  document.getElementById("settings-panel").classList.remove("show");
}

function renderSettingsForm() {
  const s = loadSettings();
  const container = document.getElementById("settings-form");
  container.innerHTML = "";

  // ── Theme ──
  container.appendChild(sectionTitle("Theme"));

  const modeRow = labelRow("Mode");
  ["dark", "light", "auto"].forEach((m) => {
    const btn = document.createElement("button");
    btn.className = "set-btn" + (s.theme.mode === m ? " active" : "");
    btn.textContent = m.charAt(0).toUpperCase() + m.slice(1);
    btn.addEventListener("click", function () {
      const st = loadSettings();
      st.theme.mode = m;
      saveSettings(st);
      applySettings();
      renderSettingsForm();
    });
    modeRow.appendChild(btn);
  });
  container.appendChild(modeRow);

  const accentRow = labelRow("Accent");
  const accentInput = document.createElement("input");
  accentInput.type = "color";
  accentInput.className = "set-color";
  accentInput.value = s.theme.accent;
  accentInput.addEventListener("input", function () {
    const st = loadSettings();
    st.theme.accent = this.value;
    saveSettings(st);
    applySettings();
  });
  accentRow.appendChild(accentInput);
  container.appendChild(accentRow);

  const bgRow = labelRow("Background");
  const bgBtn = document.createElement("button");
  bgBtn.className = "set-btn";
  bgBtn.textContent = "Open Gallery";
  bgBtn.addEventListener("click", openBackgroundGallery);
  bgRow.appendChild(bgBtn);

  const bgPreview = document.createElement("div");
  bgPreview.className = "bg-preview";
  if (s.theme.background.type === "solid") {
    bgPreview.style.background = s.theme.background.value;
  } else {
    bgPreview.style.background = s.theme.background.value;
  }
  bgRow.appendChild(bgPreview);
  container.appendChild(bgRow);

  // ── Layout ──
  container.appendChild(sectionTitle("Layout"));

  const toggles = [
    ["showGreeting", "Greeting"],
    ["showTime", "Time"],
    ["showDate", "Date"],
    ["showQuote", "Quote"],
    ["showSearch", "Search Bar"],
    ["showTopBar", "Top Bar"],
    ["showShortcuts", "Shortcuts"],
    ["showTodo", "Todo List"],
    ["showPomodoro", "Pomodoro"],
  ];

  toggles.forEach(([key, label]) => {
    const row = labelRow("");
    row.style.border = "none";
    row.style.padding = "2px 0";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "set-cb";
    cb.checked = s.layout[key];
    cb.id = "cb-" + key;
    const lbl = document.createElement("label");
    lbl.htmlFor = "cb-" + key;
    lbl.textContent = label;
    cb.addEventListener("change", function () {
      const st = loadSettings();
      st.layout[key] = this.checked;
      saveSettings(st);
      applySettings();
      if (this.checked) {
        if (key === "showTodo" && typeof initTodo === "function") initTodo();
        if (key === "showPomodoro" && typeof initPomodoro === "function") initPomodoro();
        if (key === "showDate" && typeof updateDateWidget === "function") updateDateWidget();
        if (key === "showDate" || key === "showWeather") {
          const ws = loadSettings();
          if (typeof initWeather === "function") initWeather();
          if (typeof updateDateWidget === "function") updateDateWidget(ws.widgets.dateFormat);
        }
      }
    });
    row.appendChild(cb);
    row.appendChild(lbl);
    container.appendChild(row);
  });

  // Lock layout toggle
  const lockRow = labelRow("");
  lockRow.style.border = "none";
  lockRow.style.padding = "2px 0";
  const lockCb = document.createElement("input");
  lockCb.type = "checkbox";
  lockCb.className = "set-cb";
  lockCb.checked = s.layout.lockLayout;
  lockCb.id = "cb-lockLayout";
  const lockLbl = document.createElement("label");
  lockLbl.htmlFor = "cb-lockLayout";
  lockLbl.textContent = "Lock layout (disable drag)";
  lockCb.addEventListener("change", function () {
    const st = loadSettings();
    st.layout.lockLayout = this.checked;
    saveSettings(st);
    applySettings();
  });
  lockRow.appendChild(lockCb);
  lockRow.appendChild(lockLbl);
  container.appendChild(lockRow);

  // ── Search ──
  container.appendChild(sectionTitle("Search"));

  const engRow = labelRow("Engine");
  const engSelect = document.createElement("select");
  engSelect.className = "set-select";
  Object.keys(SEARCH_ENGINES).forEach((k) => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = SEARCH_ENGINES[k].name;
    if (s.search.engine === k) opt.selected = true;
    engSelect.appendChild(opt);
  });
  const customOpt = document.createElement("option");
  customOpt.value = "custom";
  customOpt.textContent = "Custom";

  // Check if current engine isn't in predefined list
  if (!SEARCH_ENGINES[s.search.engine]) {
    customOpt.selected = true;
  }
  engSelect.appendChild(customOpt);

  engSelect.addEventListener("change", function () {
    const st = loadSettings();
    st.search.engine = this.value;
    saveSettings(st);
    applySettings();
    renderSettingsForm();
  });
  engRow.appendChild(engSelect);
  container.appendChild(engRow);

  if (s.search.engine === "custom") {
    const custRow = labelRow("Custom URL");
    const custAction = document.createElement("input");
    custAction.type = "text";
    custAction.className = "set-input";
    custAction.style.flex = "1";
    custAction.value = s.search.customAction;
    custAction.placeholder = "https://example.com/search";
    custAction.addEventListener("input", function () {
      const st = loadSettings();
      st.search.customAction = this.value;
      saveSettings(st);
      applySettings();
    });
    custRow.appendChild(custAction);
    container.appendChild(custRow);

    const custParam = labelRow("Query param");
    const custP = document.createElement("input");
    custP.type = "text";
    custP.className = "set-input";
    custP.style.flex = "1";
    custP.value = s.search.customParam;
    custP.placeholder = "q";
    custP.addEventListener("input", function () {
      const st = loadSettings();
      st.search.customParam = this.value;
      saveSettings(st);
      applySettings();
    });
    custParam.appendChild(custP);
    container.appendChild(custParam);
  }

  // ── Greeting ──
  container.appendChild(sectionTitle("Greeting"));

  const nameRow = labelRow("Name");
  const nameInp = document.createElement("input");
  nameInp.type = "text";
  nameInp.className = "set-input";
  nameInp.style.flex = "1";
  nameInp.value = s.greeting.name;
  nameInp.addEventListener("input", function () {
    const st = loadSettings();
    st.greeting.name = this.value || "Your Name";
    saveSettings(st);
    applySettings();
  });
  nameRow.appendChild(nameInp);
  container.appendChild(nameRow);

  const dynRow = labelRow("");
  dynRow.style.border = "none";
  dynRow.style.padding = "2px 0";
  const dynCb = document.createElement("input");
  dynCb.type = "checkbox";
  dynCb.className = "set-cb";
  dynCb.checked = s.greeting.dynamic;
  dynCb.id = "cb-dynamic";
  const dynLbl = document.createElement("label");
  dynLbl.htmlFor = "cb-dynamic";
  dynLbl.textContent = "Dynamic greeting (Good morning/afternoon/evening)";
  dynCb.addEventListener("change", function () {
    const st = loadSettings();
    st.greeting.dynamic = this.checked;
    saveSettings(st);
    applySettings();
  });
  dynRow.appendChild(dynCb);
  dynRow.appendChild(dynLbl);
  container.appendChild(dynRow);

  const subRow = labelRow("Subtitle");
  const subInp = document.createElement("input");
  subInp.type = "text";
  subInp.className = "set-input";
  subInp.style.flex = "1";
  subInp.value = s.greeting.subtitle;
  subInp.placeholder = "Optional subtitle below name";
  subInp.addEventListener("input", function () {
    const st = loadSettings();
    st.greeting.subtitle = this.value;
    saveSettings(st);
    applySettings();
  });
  subRow.appendChild(subInp);
  container.appendChild(subRow);

  // ── Widgets ──
  container.appendChild(sectionTitle("Widgets"));

  const dateRow = labelRow("Date format");
  const dateFmt = document.createElement("select");
  dateFmt.className = "set-select";
  [
    ["full", "Full (Monday, June 13, 2026)"],
    ["short", "Short (6/13/2026)"],
    ["weekday", "Weekday only"],
  ].forEach(([v, l]) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = l;
    if (s.widgets.dateFormat === v) opt.selected = true;
    dateFmt.appendChild(opt);
  });
  dateFmt.addEventListener("change", function () {
    const st = loadSettings();
    st.widgets.dateFormat = this.value;
    saveSettings(st);
    applySettings();
  });
  dateRow.appendChild(dateFmt);
  container.appendChild(dateRow);

  const weatherRow = labelRow("Weather location");
  const weatherInp = document.createElement("input");
  weatherInp.type = "text";
  weatherInp.className = "set-input";
  weatherInp.style.flex = "1";
  weatherInp.value = s.widgets.weatherLocation;
  weatherInp.placeholder = "City name (e.g. London)";
  weatherInp.addEventListener("change", function () {
    const st = loadSettings();
    st.widgets.weatherLocation = this.value;
    saveSettings(st);
    initWeather();
  });
  weatherRow.appendChild(weatherInp);

  const weatherUnit = document.createElement("select");
  weatherUnit.className = "set-select";
  weatherUnit.style.width = "auto";
  [["celsius", "°C"], ["fahrenheit", "°F"]].forEach(([v, l]) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = l;
    if (s.widgets.weatherUnit === v) opt.selected = true;
    weatherUnit.appendChild(opt);
  });
  weatherUnit.addEventListener("change", function () {
    const st = loadSettings();
    st.widgets.weatherUnit = this.value;
    saveSettings(st);
    initWeather();
  });
  weatherRow.appendChild(weatherUnit);
  container.appendChild(weatherRow);

  // Pomodoro settings
  const pomoWorkRow = labelRow("Pomodoro work (min)");
  const pomoWork = document.createElement("input");
  pomoWork.type = "number";
  pomoWork.className = "set-input";
  pomoWork.style.width = "80px";
  pomoWork.value = s.pomodoro.work;
  pomoWork.min = 1;
  pomoWork.max = 120;
  pomoWork.addEventListener("change", function () {
    const st = loadSettings();
    st.pomodoro.work = parseInt(this.value) || 25;
    saveSettings(st);
    if (typeof resetPomo === "function") resetPomo();
  });
  pomoWorkRow.appendChild(pomoWork);
  container.appendChild(pomoWorkRow);

  const pomoBreakRow = labelRow("Pomodoro break (min)");
  const pomoBreak = document.createElement("input");
  pomoBreak.type = "number";
  pomoBreak.className = "set-input";
  pomoBreak.style.width = "80px";
  pomoBreak.value = s.pomodoro.break;
  pomoBreak.min = 1;
  pomoBreak.max = 60;
  pomoBreak.addEventListener("change", function () {
    const st = loadSettings();
    st.pomodoro.break = parseInt(this.value) || 5;
    saveSettings(st);
    if (typeof resetPomo === "function") resetPomo();
  });
  pomoBreakRow.appendChild(pomoBreak);
  container.appendChild(pomoBreakRow);

  // ── Advanced ──
  container.appendChild(sectionTitle("Advanced"));

  const cssRow = labelRow("Custom CSS");
  const cssText = document.createElement("textarea");
  cssText.className = "set-textarea";
  cssText.rows = 4;
  cssText.placeholder = "body { background: red !important; }";
  cssText.value = s.advanced.customCSS;
  cssText.addEventListener("input", function () {
    const st = loadSettings();
    st.advanced.customCSS = this.value;
    saveSettings(st);
    applySettings();
  });
  cssRow.appendChild(cssText);
  container.appendChild(cssRow);

  const btnRow = document.createElement("div");
  btnRow.className = "settings-btn-row";

  const exportBtn = document.createElement("button");
  exportBtn.className = "set-btn";
  exportBtn.textContent = "Export Settings";
  exportBtn.addEventListener("click", function () {
    const json = JSON.stringify(loadSettings(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom-tab-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  btnRow.appendChild(exportBtn);

  const importBtn = document.createElement("button");
  importBtn.className = "set-btn";
  importBtn.textContent = "Import Settings";
  importBtn.addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", function () {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const data = JSON.parse(e.target.result);
          const merged = deepMerge(defaultSettings(), data);
          saveSettings(merged);
          applySettings();
          renderSettingsForm();
        } catch {
          alert("Invalid settings file");
        }
      };
      reader.readAsText(input.files[0]);
    });
    input.click();
  });
  btnRow.appendChild(importBtn);

  const resetBtn = document.createElement("button");
  resetBtn.className = "set-btn reset";
  resetBtn.textContent = "Reset to Defaults";
  resetBtn.addEventListener("click", function () {
    if (confirm("Reset all settings to defaults?")) {
      resetSettings();
      applySettings();
      renderSettingsForm();
    }
  });
  btnRow.appendChild(resetBtn);

  container.appendChild(btnRow);
}

// ─── Background Gallery ─────────────────────────────────

const BG_PRESETS = {
  solids: [
    { name: "Dark Navy",   value: "#020617" },
    { name: "Slate",       value: "#0f172a" },
    { name: "Dark Indigo", value: "#1e1b4b" },
    { name: "Dark Warm",   value: "#1c1917" },
    { name: "Pure Black",  value: "#000000" },
    { name: "Near Black",  value: "#171717" },
    { name: "Deep Purple", value: "#1a1a2e" },
    { name: "Dark Blue",   value: "#16213e" },
    { name: "Charcoal",    value: "#111827" },
    { name: "Slate 800",   value: "#1e293b" },
    { name: "Slate 700",   value: "#334155" },
    { name: "Dark Gray",   value: "#2d2d2d" },
  ],
  gradients: [
    { name: "Midnight",    value: "linear-gradient(135deg, #020617, #0f172a)" },
    { name: "Ocean",       value: "linear-gradient(135deg, #0f172a, #1e3a5f)" },
    { name: "Sunset",      value: "linear-gradient(135deg, #1e1b4b, #7c3aed)" },
    { name: "Forest",      value: "linear-gradient(135deg, #020617, #065f46)" },
    { name: "Fire",        value: "linear-gradient(135deg, #1c1917, #78350f)" },
    { name: "Aurora",      value: "linear-gradient(135deg, #020617, #1e3a5f, #065f46)" },
    { name: "Neon",        value: "linear-gradient(135deg, #020617, #7c3aed)" },
    { name: "Cyber",       value: "linear-gradient(135deg, #020617, #0ea5e9)" },
    { name: "Deep Purple", value: "linear-gradient(135deg, #160b1e, #2d1b3d)" },
    { name: "Blood",       value: "linear-gradient(135deg, #1a0a0a, #7f1d1d)" },
    { name: "Deep Space",  value: "linear-gradient(135deg, #020617, #1e1b4b)" },
    { name: "Mint",        value: "linear-gradient(135deg, #020617, #065f46, #0d9488)" },
    { name: "Warm",        value: "linear-gradient(135deg, #1c1917, #78350f)" },
    { name: "Ice",         value: "linear-gradient(135deg, #020617, #1e3a8f)" },
    { name: "Rose",        value: "linear-gradient(135deg, #1a0a0a, #9d174d)" },
    { name: "Crimson",     value: "linear-gradient(135deg, #020617, #be123c)" },
    { name: "Twilight",    value: "linear-gradient(135deg, #0f172a, #7c3aed, #ec4899)" },
    { name: "Emerald",     value: "linear-gradient(135deg, #020617, #047857)" },
  ],
};

function openBackgroundGallery() {
  const existing = document.getElementById("bg-gallery");
  if (existing) existing.remove();
  renderBackgroundGallery();
  document.getElementById("bg-gallery").classList.add("show");
}

function closeBackgroundGallery() {
  const el = document.getElementById("bg-gallery");
  if (el) el.classList.remove("show");
}

function renderBackgroundGallery() {
  const s = loadSettings();

  const overlay = document.createElement("div");
  overlay.id = "bg-gallery";
  overlay.className = "bg-gallery";

  const panel = document.createElement("div");
  panel.className = "bg-gallery-panel";

  const header = document.createElement("div");
  header.className = "bg-gallery-header";
  const title = document.createElement("h3");
  title.textContent = "Choose Background";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "\u2715";
  closeBtn.addEventListener("click", closeBackgroundGallery);
  header.appendChild(title);
  header.appendChild(closeBtn);
  panel.appendChild(header);

  const content = document.createElement("div");
  content.className = "bg-gallery-content";

  function addSection(sectionTitleKey, items, type) {
    const secTitle = document.createElement("div");
    secTitle.className = "bg-gallery-section-title";
    secTitle.textContent = sectionTitleKey;
    content.appendChild(secTitle);

    const grid = document.createElement("div");
    grid.className = "bg-gallery-grid";

    items.forEach((item) => {
      const swatch = document.createElement("div");
      swatch.className = "bg-gallery-swatch" + (s.theme.background.type === type && s.theme.background.value === item.value ? " active" : "");
      swatch.style.background = item.value;
      swatch.title = item.name;

      const label = document.createElement("span");
      label.className = "bg-gallery-label";
      label.textContent = item.name;

      swatch.appendChild(label);
      swatch.addEventListener("click", function () {
        const st = loadSettings();
        st.theme.background.type = type;
        st.theme.background.value = item.value;
        saveSettings(st);
        applySettings();
        closeBackgroundGallery();
      });

      grid.appendChild(swatch);
    });

    content.appendChild(grid);
  }

  addSection("Solid Colors", BG_PRESETS.solids, "solid");
  addSection("Gradients", BG_PRESETS.gradients, "gradient");

  // Custom section
  const custTitle = document.createElement("div");
  custTitle.className = "bg-gallery-section-title";
  custTitle.textContent = "Custom";
  content.appendChild(custTitle);

  const custRow = document.createElement("div");
  custRow.className = "bg-gallery-custom";

  const custType = document.createElement("select");
  custType.className = "set-select";
  ["solid", "gradient", "image"].forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    if (s.theme.background.type === t) opt.selected = true;
    custType.appendChild(opt);
  });

  const custVal = document.createElement("input");
  custVal.type = "text";
  custVal.className = "set-input";
  custVal.style.flex = "1";
  custVal.value = s.theme.background.value;
  custVal.placeholder = "#color, linear-gradient(...), or image URL";

  const applyBtn = document.createElement("button");
  applyBtn.className = "set-btn";
  applyBtn.textContent = "Apply";
  applyBtn.addEventListener("click", function () {
    const st = loadSettings();
    st.theme.background.type = custType.value;
    st.theme.background.value = custVal.value;
    saveSettings(st);
    applySettings();
    closeBackgroundGallery();
  });

  custRow.appendChild(custType);
  custRow.appendChild(custVal);
  custRow.appendChild(applyBtn);
  content.appendChild(custRow);

  // File upload buttons
  const fileRow = document.createElement("div");
  fileRow.className = "bg-gallery-custom";
  fileRow.style.marginTop = "8px";
  fileRow.style.gap = "8px";

  const uploadImgBtn = document.createElement("button");
  uploadImgBtn.className = "set-btn";
  uploadImgBtn.textContent = "Upload Image";
  const imgFileInput = document.createElement("input");
  imgFileInput.type = "file";
  imgFileInput.accept = "image/*";
  imgFileInput.style.display = "none";
  imgFileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const url = URL.createObjectURL(this.files[0]);
      const st = loadSettings();
      st.theme.background.type = "image";
      st.theme.background.value = url;
      saveSettings(st);
      applySettings();
      closeBackgroundGallery();
    }
  });
  uploadImgBtn.addEventListener("click", function () { imgFileInput.click(); });

  const uploadVidBtn = document.createElement("button");
  uploadVidBtn.className = "set-btn";
  uploadVidBtn.textContent = "Upload Video";
  const vidFileInput = document.createElement("input");
  vidFileInput.type = "file";
  vidFileInput.accept = "video/*";
  vidFileInput.style.display = "none";
  vidFileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const url = URL.createObjectURL(this.files[0]);
      const st = loadSettings();
      st.theme.background.type = "video";
      st.theme.background.value = url;
      saveSettings(st);
      applySettings();
      closeBackgroundGallery();
    }
  });
  uploadVidBtn.addEventListener("click", function () { vidFileInput.click(); });

  fileRow.appendChild(uploadImgBtn);
  fileRow.appendChild(uploadVidBtn);
  fileRow.appendChild(imgFileInput);
  fileRow.appendChild(vidFileInput);
  content.appendChild(fileRow);

  panel.appendChild(content);
  overlay.appendChild(panel);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeBackgroundGallery();
  });

  document.body.appendChild(overlay);
}

function sectionTitle(text) {
  const el = document.createElement("div");
  el.className = "settings-section-title";
  el.textContent = text;
  return el;
}

function labelRow(text) {
  const row = document.createElement("div");
  row.className = "settings-row";
  if (text) {
    const label = document.createElement("span");
    label.className = "settings-label";
    label.textContent = text;
    row.appendChild(label);
  }
  return row;
}

// ─── Event listeners ────────────────────────────────────

const closeBtn = document.getElementById("settings-close-btn");
if (closeBtn) closeBtn.addEventListener("click", closeSettings);

const overlayEl = document.getElementById("settings-overlay");
if (overlayEl) overlayEl.addEventListener("click", closeSettings);
