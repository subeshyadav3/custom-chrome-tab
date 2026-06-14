// ─── Constants ────────────────────────────────────────────
const STORAGE_KEY_SHORTCUTS = "custom-tab-shortcuts";
const STORAGE_KEY_TOPBAR = "custom-tab-topbar";
const STORAGE_KEY_HABITS = "custom-tab-habits";
const HABIT_LOG_KEY = "custom-tab-habit-log";

// ─── Helpers ──────────────────────────────────────────────
function getSettings() {
  return typeof loadSettings === "function" ? loadSettings() : {};
}

function iconUrl(domain) {
  const s = getSettings();
  return (s.faviconService || "https://www.google.com/s2/favicons?domain={domain}&sz=64").replace("{domain}", encodeURIComponent(domain));
}

function extractDomain(url) {
  try { return new URL(url).hostname; } catch { return ""; }
}

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

// ─── Toast Notifications ──────────────────────────────────
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastOut 0.25s ease forwards";
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

// ─── DOM Refs ─────────────────────────────────────────────
const timeEl = document.getElementById("time");
const quoteEl = document.getElementById("quote");
const container = document.getElementById("quick-links");
const overlay = document.getElementById("overlay");
const dialog = document.getElementById("dialog");
const dialogTitle = document.getElementById("dialog-title");
const nameInput = document.getElementById("dialog-name");
const urlInput = document.getElementById("dialog-url");
const cancelBtn = document.getElementById("dialog-cancel");
const doneBtn = document.getElementById("dialog-done");

// ─── Shortcuts Storage ────────────────────────────────────
function getShortcuts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHORTCUTS);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveShortcuts(list) {
  localStorage.setItem(STORAGE_KEY_SHORTCUTS, JSON.stringify(list));
}

let editingIndex = -1;
let promptCallback = null;

function openDialog(index) {
  editingIndex = index;
  const s = getSettings();
  if (index === -1) {
    dialogTitle.textContent = "Add shortcut";
    nameInput.value = "";
    urlInput.value = "";
  } else {
    dialogTitle.textContent = "Edit shortcut";
    const list = getShortcuts() || [
      { name: "YouTube", url: "https://www.youtube.com/" },
      { name: "GitHub", url: "https://github.com/" },
      { name: "ChatGPT", url: "https://chat.openai.com" },
    ];
    nameInput.value = list[index].name;
    urlInput.value = list[index].url;
  }
  overlay.classList.add("show");
  dialog.classList.add("show");
  nameInput.focus();
}

function closeDialog() {
  overlay.classList.remove("show");
  dialog.classList.remove("show");
  editingIndex = -1;
  promptCallback = null;
  nameInput.style.display = "";
  const nameLbl = document.querySelector("#dialog label[for='dialog-name']");
  if (nameLbl) nameLbl.style.display = "";
  const urlLbl = document.querySelector("#dialog label[for='dialog-url']");
  if (urlLbl) urlLbl.textContent = "URL";
  urlInput.placeholder = "https://example.com";
}

function showPrompt(title, label, placeholder, defaultValue, callback) {
  promptCallback = callback;
  dialogTitle.textContent = title;
  const nameLbl = document.querySelector("#dialog label[for='dialog-name']");
  if (nameLbl) nameLbl.style.display = "none";
  nameInput.style.display = "none";
  const urlLbl = document.querySelector("#dialog label[for='dialog-url']");
  if (urlLbl) urlLbl.textContent = label;
  urlInput.placeholder = placeholder;
  urlInput.value = defaultValue || "";
  overlay.classList.add("show");
  dialog.classList.add("show");
  urlInput.focus();
}

function openMenu(wrapper) {
  closeAllMenus();
  const menu = wrapper.querySelector(".menu-dropdown");
  if (menu) menu.classList.add("show");
}

function closeAllMenus() {
  document.querySelectorAll(".menu-dropdown.show").forEach((m) => m.classList.remove("show"));
}

// ─── Render Quick Links ───────────────────────────────────
function render() {
  let list = getShortcuts();
  if (!list) {
    list = [
      { name: "YouTube", url: "https://www.youtube.com/" },
      { name: "GitHub", url: "https://github.com/" },
      { name: "ChatGPT", url: "https://chat.openai.com" },
    ];
    saveShortcuts(list);
  }

  container.innerHTML = "";

  list.slice(0, 10).forEach((s, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "tile-wrapper";
    wrapper.style.animationDelay = (i * 0.05 + 0.38) + "s";

    const a = document.createElement("a");
    a.href = s.url;
    a.className = "link-card";
    a.target = "_self";
    a.title = s.name;

    const img = document.createElement("img");
    img.src = iconUrl(extractDomain(s.url));
    img.alt = s.name;
    img.loading = "lazy";
    img.onerror = function () {
      this.src =
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'><rect width='24' height='24' rx='4'/><text x='12' y='16' text-anchor='middle' font-size='12' fill='%23020617'>" +
        (s.name[0] || "?") +
        "</text></svg>";
    };

    const span = document.createElement("span");
    span.textContent = s.name;

    a.appendChild(img);
    a.appendChild(span);
    wrapper.appendChild(a);

    const menuBtn = document.createElement("button");
    menuBtn.className = "menu-btn";
    menuBtn.textContent = "⋮";
    menuBtn.setAttribute("aria-label", "More actions");
    menuBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openMenu(wrapper);
    });
    wrapper.appendChild(menuBtn);

    const dropdown = document.createElement("div");
    dropdown.className = "menu-dropdown";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏ Edit";
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllMenus();
      openDialog(i);
    });
    dropdown.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "🗑 Remove";
    removeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllMenus();
      list.splice(i, 1);
      saveShortcuts(list);
      render();
      showToast("Shortcut removed", "info");
    });
    dropdown.appendChild(removeBtn);

    wrapper.appendChild(dropdown);
    container.appendChild(wrapper);
  });

  const addBtn = document.createElement("button");
  addBtn.id = "add-shortcut";
  addBtn.innerHTML = '<span class="plus">+</span><span>Add shortcut</span>';
  addBtn.addEventListener("click", function () { openDialog(-1); });
  container.appendChild(addBtn);
}

// ─── Dialog Actions ───────────────────────────────────────
doneBtn.addEventListener("click", function () {
  if (promptCallback) {
    const val = urlInput.value.trim();
    if (!val) return;
    const fn = promptCallback;
    promptCallback = null;
    fn(val);
    closeDialog();
    return;
  }
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  if (!name || !url) return;

  let list = getShortcuts() || [
    { name: "YouTube", url: "https://www.youtube.com/" },
    { name: "GitHub", url: "https://github.com/" },
    { name: "ChatGPT", url: "https://chat.openai.com" },
  ];

  if (editingIndex === -1) {
    list.push({ name, url });
    showToast("Shortcut added!", "success");
  } else {
    list[editingIndex] = { name, url };
    showToast("Shortcut updated!", "success");
  }

  saveShortcuts(list);
  closeDialog();
  render();
});

cancelBtn.addEventListener("click", function () {
  promptCallback = null;
  closeDialog();
});
overlay.addEventListener("click", function () {
  promptCallback = null;
  closeDialog();
});

// ─── Time & Quote ─────────────────────────────────────────
function updateTime() {
  const now = new Date();
  const s = getSettings();
  const use12 = (s.timeFormat === "12h");

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  let ampm = "";

  if (use12) {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
  }

  const h = String(hours).padStart(2, "0");
  timeEl.innerHTML =
    `${h}<span style="opacity:0.6">:</span>${minutes}<span id="time-seconds" style="font-size:0.55em;opacity:0.5;vertical-align:baseline;margin-left:2px">${seconds}</span>` +
    (use12 ? `<span id="time-ampm" style="font-size:0.25em;opacity:0.6;margin-left:8px;vertical-align:middle">${ampm}</span>` : "");
}

function setRandomQuote() {
  const s = getSettings();
  const q = s.quotes || [
    "Stay hungry, stay foolish.",
    "Discipline beats motivation.",
    "Small progress is still progress.",
  ];
  const idx = Math.floor(Math.random() * q.length);
  quoteEl.textContent = '"' + q[idx] + '"';
}

function initGreeting() {
  const s = getSettings();
  const g = s.greeting || {};
  const name = g.name || "Your Name";
  const el = document.getElementById("greeting");
  if (!el) return;
  if (g.dynamic) {
    const h = new Date().getHours();
    let prefix = "";
    if (h < 12) prefix = "Good morning,";
    else if (h < 17) prefix = "Good afternoon,";
    else prefix = "Good evening,";
    el.innerHTML = `<span class="greeting-prefix">${prefix}</span> <span class="greeting-name">&lt;${name} /&gt;</span>`;
  } else {
    el.innerHTML = `<span class="greeting-name">&lt;${name} /&gt;</span>`;
  }
}

// ─── Search Engine Switcher ───────────────────────────────
const ENGINES_LIST = [
  { key: "google", name: "Google", icon: "🔵" },
  { key: "duckduckgo", name: "DuckDuckGo", icon: "🦆" },
  { key: "bing", name: "Bing", icon: "🔷" },
  { key: "brave", name: "Brave", icon: "🦁" },
  { key: "ecosia", name: "Ecosia", icon: "🌿" },
];

const ENGINES_MAP = {
  google: { action: "https://www.google.com/search", param: "q" },
  duckduckgo: { action: "https://duckduckgo.com/", param: "q" },
  bing: { action: "https://www.bing.com/search", param: "q" },
  brave: { action: "https://search.brave.com/search", param: "q" },
  ecosia: { action: "https://www.ecosia.org/search", param: "q" },
  yandex: { action: "https://yandex.com/search/", param: "text" },
  custom: { action: "", param: "q" },
};

function initEngineSwitcher() {
  const switcher = document.getElementById("engine-switcher");
  if (!switcher) return;
  const s = getSettings();
  const currentEngine = s.search?.engine || "google";

  switcher.innerHTML = "";
  ENGINES_LIST.forEach(eng => {
    const pill = document.createElement("button");
    pill.className = "engine-pill" + (currentEngine === eng.key ? " active" : "");
    pill.textContent = eng.name;
    pill.title = eng.name;
    pill.addEventListener("click", () => {
      const st = loadSettings();
      st.search.engine = eng.key;
      saveSettings(st);
      applySettings();
      initEngineSwitcher();
      updateSearchIcon(eng.key);
      showToast(`Switched to ${eng.name}`, "info");
    });
    switcher.appendChild(pill);
  });
}

function updateSearchIcon(engineKey) {
  const iconEl = document.getElementById("search-engine-icon");
  const eng = ENGINES_LIST.find(e => e.key === engineKey);
  if (iconEl) iconEl.textContent = eng ? eng.icon : "🔍";
}

// Cycle engine on icon click
const engineIconEl = document.getElementById("search-engine-icon");
if (engineIconEl) {
  engineIconEl.addEventListener("click", () => {
    const s = getSettings();
    const currentIdx = ENGINES_LIST.findIndex(e => e.key === s.search?.engine);
    const nextIdx = (currentIdx + 1) % ENGINES_LIST.length;
    const nextEngine = ENGINES_LIST[nextIdx];
    const st = loadSettings();
    st.search.engine = nextEngine.key;
    saveSettings(st);
    applySettings();
    initEngineSwitcher();
    updateSearchIcon(nextEngine.key);
    showToast(`Switched to ${nextEngine.name}`, "info");
  });
}

// ─── Top Bar ──────────────────────────────────────────────
function createTopBarLink(item, index) {
  const wrapper = document.createElement("div");
  wrapper.className = "top-bar-item";

  const a = document.createElement("a");
  a.href = item.url;
  a.target = "_self";
  a.dataset.idx = index;
  a.draggable = true;

  a.addEventListener("dragstart", function (e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
    setTimeout(() => this.classList.add("dragging"), 0);
  });
  a.addEventListener("dragend", function () {
    this.classList.remove("dragging");
    document.querySelectorAll("#top-bar a.drag-over").forEach((el) => el.classList.remove("drag-over"));
  });

  const img = document.createElement("img");
  img.src = item.icon || iconUrl(extractDomain(item.url));
  img.alt = item.name;
  img.onerror = function () { this.src = iconUrl(extractDomain(item.url)); };
  const span = document.createElement("span");
  span.textContent = item.name;
  a.appendChild(img);
  a.appendChild(span);
  wrapper.appendChild(a);

  const removeBtn = document.createElement("button");
  removeBtn.className = "top-bar-remove";
  removeBtn.textContent = "×";
  removeBtn.title = "Remove " + item.name;
  removeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    let links = getTopBarLinks();
    if (!links) return;
    links.splice(index, 1);
    saveTopBarLinks(links);
    renderTopBar();
  });
  wrapper.appendChild(removeBtn);

  return wrapper;
}

function renderTopBar() {
  const bar = document.getElementById("top-bar");
  const s = getSettings();

  let links = getTopBarLinks();
  if (!links) {
    links = s.topBarLinks || [];
    if (links.length) saveTopBarLinks(links);
  }

  // Ensure Account link always exists
  const hasAccount = links.some(
    (l) => l.name === "Account" || (l.url && l.url.includes("myaccount.google.com"))
  );
  if (!hasAccount) {
    const fromDefaults = s.topBarLinks ? s.topBarLinks.find((l) => l.name === "Account" || (l.url && l.url.includes("myaccount.google.com"))) : null;
    const accountLink = fromDefaults || { name: "Account", url: "https://myaccount.google.com/" };
    links.push(accountLink);
    saveTopBarLinks(links);
  }

  bar.innerHTML = "";

  const accIdx = links.findIndex(
    (l) => l.name === "Account" || (l.url && l.url.includes("myaccount.google.com"))
  );

  links.forEach((item, i) => {
    if (i === accIdx) return;
    const wrapper = createTopBarLink(item, i);
    bar.appendChild(wrapper);
  });

  const addBtn = document.createElement("button");
  addBtn.id = "add-topbar-btn";
  addBtn.textContent = "+";
  addBtn.setAttribute("aria-label", "Add site");
  addBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const menu = document.getElementById("add-menu");
    if (menu) menu.classList.toggle("show");
  });
  bar.appendChild(addBtn);

  if (accIdx !== -1) {
    const wrapper = createTopBarLink(links[accIdx], accIdx);
    const a = wrapper.querySelector("a");
    a.draggable = false;
    const rb = wrapper.querySelector(".top-bar-remove");
    if (rb) rb.remove();
    bar.appendChild(wrapper);
  }

  bar.querySelectorAll("a[draggable=true]").forEach((a) => {
    a.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      this.classList.add("drag-over");
    });
    a.addEventListener("dragleave", function () { this.classList.remove("drag-over"); });
    a.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("drag-over");
      const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
      const toIdx = parseInt(this.dataset.idx);
      if (isNaN(fromIdx) || isNaN(toIdx) || fromIdx === toIdx) return;
      let currentLinks = getTopBarLinks();
      if (!currentLinks) return;
      const [moved] = currentLinks.splice(fromIdx, 1);
      const adjustedTo = toIdx > fromIdx ? toIdx - 1 : toIdx;
      currentLinks.splice(adjustedTo, 0, moved);
      saveTopBarLinks(currentLinks);
      renderTopBar();
    });
  });

  renderAddMenu();
}

function getTopBarLinks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOPBAR);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveTopBarLinks(list) {
  localStorage.setItem(STORAGE_KEY_TOPBAR, JSON.stringify(list));
}

function renderAddMenu() {
  const old = document.getElementById("add-menu");
  if (old) old.remove();

  const s = getSettings();
  const currentLinks = getTopBarLinks() || s.topBarLinks || [];
  const currentUrls = new Set(currentLinks.map((l) => l.url.replace(/\/$/, "")));

  const menu = document.createElement("div");
  menu.id = "add-menu";
  menu.className = "add-menu";

  const cats = {};
  const sites = s.famousSites || [];
  sites.forEach((site) => {
    if (!cats[site.category]) cats[site.category] = [];
    cats[site.category].push(site);
  });

  Object.keys(cats).forEach((cat) => {
    const h = document.createElement("div");
    h.className = "add-menu-category";
    h.textContent = cat;
    menu.appendChild(h);

    const items = document.createElement("div");
    items.className = "add-menu-items";

    cats[cat].forEach((site) => {
      const el = document.createElement("div");
      const cleanUrl = site.url.replace(/\/$/, "");
      const isAdded = currentUrls.has(cleanUrl);
      el.className = "add-menu-item" + (isAdded ? " added" : "");

      const img = document.createElement("img");
      img.src = iconUrl(extractDomain(site.url));
      img.alt = site.name;
      img.onerror = function () { this.remove(); };

      const span = document.createElement("span");
      span.textContent = site.name;

      el.appendChild(img);
      el.appendChild(span);

      el.addEventListener("click", function (e) {
        e.stopPropagation();
        if (isAdded) {
          let links = getTopBarLinks() || s.topBarLinks || [];
          links = links.filter((l) => l.url.replace(/\/$/, "") !== cleanUrl);
          saveTopBarLinks(links);
          renderTopBar();
          return;
        }
        if (site.prompt) {
          const menuEl = document.getElementById("add-menu");
          if (menuEl) menuEl.classList.remove("show");
          showPrompt(site.name, site.prompt, site.placeholder || "Enter value...", "", function (val) {
            if (!val) return;
            let links = getTopBarLinks() || s.topBarLinks || [];
            links.push({ name: site.name, url: site.url.replace("{input}", encodeURIComponent(val)) });
            saveTopBarLinks(links);
            renderTopBar();
          });
          return;
        }
        let links = getTopBarLinks() || s.topBarLinks || [];
        links.push({ name: site.name, url: site.url });
        saveTopBarLinks(links);
        renderTopBar();
        showToast(site.name + " added to top bar", "success");
      });

      items.appendChild(el);
    });

    menu.appendChild(items);
  });

  document.getElementById("top-bar").appendChild(menu);
  if (!sites.length) menu.style.display = "none";
}

document.addEventListener("click", function (e) {
  if (!e.target.closest("#add-topbar-btn") && !e.target.closest("#add-menu")) {
    const menu = document.getElementById("add-menu");
    if (menu) menu.classList.remove("show");
  }
});

// ─── Search ───────────────────────────────────────────────
const searchInput = document.getElementById("search-input");
const suggestionsEl = document.getElementById("suggestions");

function initSearch() {
  const s = getSettings();
  const se = s.search || {};
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  if (se.engine === "custom") {
    form.action = se.customAction || "https://www.google.com/search";
    input.name = se.customParam || "q";
  } else {
    const e = ENGINES_MAP[se.engine] || ENGINES_MAP.google;
    form.action = e.action;
    input.name = e.param;
  }

  const eng = ENGINES_LIST.find(e => e.key === se.engine);
  input.placeholder = "Search " + (eng?.name || "Google") + "...";
  updateSearchIcon(se.engine || "google");
}

searchInput.addEventListener("input", async () => {
  const s = getSettings();
  const query = searchInput.value.trim();
  if (!query || !s.suggestAPI) {
    suggestionsEl.style.display = "none";
    return;
  }
  try {
    const res = await fetch(s.suggestAPI + encodeURIComponent(query));
    const data = await res.json();
    const suggestions = data[1];
    suggestionsEl.innerHTML = "";
    suggestions.forEach((sug) => {
      const li = document.createElement("li");
      li.textContent = sug;
      li.addEventListener("click", () => {
        searchInput.value = sug;
        document.getElementById("search-form").submit();
      });
      suggestionsEl.appendChild(li);
    });
    suggestionsEl.style.display = suggestions.length ? "block" : "none";
  } catch (err) {
    suggestionsEl.style.display = "none";
  }
});

// Tab in search cycles engine
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && searchInput.value === "") {
    e.preventDefault();
    const s = getSettings();
    const currentIdx = ENGINES_LIST.findIndex(eng => eng.key === s.search?.engine);
    const nextIdx = (currentIdx + 1) % ENGINES_LIST.length;
    const nextEngine = ENGINES_LIST[nextIdx];
    const st = loadSettings();
    st.search.engine = nextEngine.key;
    saveSettings(st);
    applySettings();
    initEngineSwitcher();
    updateSearchIcon(nextEngine.key);
    showToast(`Switched to ${nextEngine.name}`, "info");
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#google-search")) {
    suggestionsEl.style.display = "none";
  }
});

// ─── Focus Mode ───────────────────────────────────────────
let focusMode = false;

function toggleFocusMode() {
  focusMode = !focusMode;
  document.body.classList.toggle("focus-mode", focusMode);
  if (focusMode) {
    showToast("Focus Mode ON — Press F to exit", "info");
  }
}

// ─── Keyboard Shortcuts ───────────────────────────────────
document.addEventListener("keydown", function (e) {
  const tag = e.target.tagName.toLowerCase();
  const isTyping = (tag === "input" || tag === "textarea" || e.target.isContentEditable);

  if (e.key === "Escape") {
    closeDialog();
    closeAllMenus();
    document.getElementById("shortcuts-modal").classList.remove("show");
    if (focusMode) toggleFocusMode();
    return;
  }

  if (isTyping) return;

  if (e.key === "/" || e.key === "f" && e.ctrlKey === false && e.metaKey === false && e.key !== "F") {
    if (e.key === "/") {
      e.preventDefault();
      searchInput.focus();
    }
  }

  switch (e.key.toLowerCase()) {
    case "/":
      e.preventDefault();
      searchInput.focus();
      break;
    case "f":
      toggleFocusMode();
      break;
    case "s":
      if (typeof openSettings === "function") openSettings();
      break;
    case "?":
      document.getElementById("shortcuts-modal").classList.add("show");
      break;
    case "p":
      togglePomodoro();
      break;
    case "n":
      openDialog(-1);
      break;
  }
});

// Shortcuts modal close
document.getElementById("shortcuts-close")?.addEventListener("click", () => {
  document.getElementById("shortcuts-modal").classList.remove("show");
});
document.getElementById("shortcuts-modal")?.addEventListener("click", function (e) {
  if (e.target === this) this.classList.remove("show");
});

// ─── Notes Widget ─────────────────────────────────────────
function initNotes() {
  const widget = document.getElementById("widget-notes");
  if (!widget) return;
  const textarea = widget.querySelector(".notes-textarea");
  if (!textarea) return;
  const NOTES_KEY = "custom-tab-notes";
  textarea.value = localStorage.getItem(NOTES_KEY) || "";
  textarea.addEventListener("input", () => {
    localStorage.setItem(NOTES_KEY, textarea.value);
  });
}

// ─── Battery Widget ───────────────────────────────────────
// ─── Habit Tracker ────────────────────────────────────────
function getHabits() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_HABITS)) || []; } catch { return []; }
}

function saveHabits(list) {
  localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(list));
}

function getHabitLog() {
  try { return JSON.parse(localStorage.getItem(HABIT_LOG_KEY)) || {}; } catch { return {}; }
}

function saveHabitLog(log) {
  localStorage.setItem(HABIT_LOG_KEY, JSON.stringify(log));
}

function getHabitStreak(habitId) {
  const log = getHabitLog();
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
    if (log[key] && log[key][habitId]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      if (key === todayKey()) { d.setDate(d.getDate() - 1); continue; }
      break;
    }
    if (streak > 365) break;
  }
  return streak;
}

function initHabits() {
  const widget = document.getElementById("widget-habits");
  if (!widget) return;

  const dateEl = document.getElementById("habits-date");
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  renderHabits();

  const input = document.getElementById("habit-input");
  const addBtn = document.getElementById("habit-add-btn");

  function addHabit() {
    const text = input?.value.trim();
    if (!text) return;
    const habits = getHabits();
    habits.push({ id: Date.now().toString(), name: text });
    saveHabits(habits);
    if (input) input.value = "";
    renderHabits();
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addHabit();
    });
  }
  if (addBtn) {
    addBtn.addEventListener("click", addHabit);
  }
}

function renderHabits() {
  const listEl = document.getElementById("habit-list");
  const progressEl = document.getElementById("habits-progress");
  const summaryEl = document.getElementById("habits-summary");
  if (!listEl) return;

  const habits = getHabits();
  const log = getHabitLog();
  const today = todayKey();
  if (!log[today]) log[today] = {};

  listEl.innerHTML = "";

  habits.forEach(habit => {
    const done = !!log[today][habit.id];
    const streak = getHabitStreak(habit.id);

    const item = document.createElement("div");
    item.className = "habit-item";

    const check = document.createElement("div");
    check.className = "habit-check" + (done ? " done" : "");
    check.textContent = done ? "✓" : "";
    check.title = done ? "Mark incomplete" : "Mark complete";
    check.addEventListener("click", () => {
      const l = getHabitLog();
      const t = todayKey();
      if (!l[t]) l[t] = {};
      l[t][habit.id] = !l[t][habit.id];
      saveHabitLog(l);
      renderHabits();
    });

    const name = document.createElement("span");
    name.className = "habit-name" + (done ? " done" : "");
    name.textContent = habit.name;

    const streakEl = document.createElement("span");
    streakEl.className = "habit-streak";
    if (streak > 0) streakEl.textContent = "🔥" + streak;

    const del = document.createElement("button");
    del.className = "habit-del";
    del.textContent = "✕";
    del.title = "Delete habit";
    del.addEventListener("click", () => {
      const habits = getHabits().filter(h => h.id !== habit.id);
      saveHabits(habits);
      renderHabits();
    });

    item.appendChild(check);
    item.appendChild(name);
    item.appendChild(streakEl);
    item.appendChild(del);
    listEl.appendChild(item);
  });

  // Update progress
  const total = habits.length;
  const doneCount = habits.filter(h => !!log[today][h.id]).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  if (progressEl) progressEl.style.width = pct + "%";
  if (summaryEl) summaryEl.textContent = total ? `${doneCount}/${total} completed (${pct}%)` : "Add your first habit!";
}

// ─── Aurora Background ────────────────────────────────────
function initAurora() {
  const canvas = document.getElementById("aurora-canvas");
  if (!canvas) return;

  const s = getSettings();
  if (s.theme?.background?.type !== "aurora") return;

  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const blobs = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 200 + Math.random() * 300,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    hue: 180 + i * 40 + Math.random() * 40,
    speed: 0.001 + Math.random() * 0.002,
    phase: Math.random() * Math.PI * 2,
  }));

  let animFrame;
  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blobs.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -b.r) b.x = canvas.width + b.r;
      if (b.x > canvas.width + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = canvas.height + b.r;
      if (b.y > canvas.height + b.r) b.y = -b.r;

      const pulse = Math.sin(t * b.speed * 1000 + b.phase) * 0.15 + 0.25;
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, `hsla(${b.hue}, 80%, 55%, ${pulse})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    animFrame = requestAnimationFrame(draw);
  }

  animFrame = requestAnimationFrame(draw);
  canvas._stopAurora = () => cancelAnimationFrame(animFrame);
}

function stopAurora() {
  const canvas = document.getElementById("aurora-canvas");
  if (canvas?._stopAurora) {
    canvas._stopAurora();
    canvas.style.display = "none";
  }
}

// ─── Pomodoro Ring ────────────────────────────────────────
let pomoInterval = null;
let pomoState = { running: false, type: "work", remaining: 0, total: 0 };

function pomoFormatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function updatePomoRing() {
  const el = document.getElementById("widget-pomo");
  if (!el) return;

  const fill = el.querySelector(".pomo-ring-fill");
  const timeText = el.querySelector(".pomo-ring-time");
  const badge = el.querySelector(".pomo-type-badge");
  const btn = el.querySelector(".pomo-btn");

  const circumference = 2 * Math.PI * 35; // r=35
  const progress = pomoState.total > 0 ? (pomoState.remaining / pomoState.total) : 1;
  const offset = circumference * (1 - progress);

  if (fill) {
    fill.style.strokeDasharray = circumference;
    fill.style.strokeDashoffset = offset;
    fill.className = "pomo-ring-fill" + (pomoState.type === "break" ? " break" : "");
  }
  if (timeText) timeText.textContent = pomoFormatTime(pomoState.remaining);
  if (badge) {
    badge.textContent = pomoState.type === "work" ? "Focus" : "Break";
    badge.className = "pomo-type-badge" + (pomoState.type === "break" ? " break" : "");
  }
  if (btn) {
    btn.textContent = pomoState.running ? "Pause" : "Start";
    btn.className = "pomo-btn" + (pomoState.running ? " running" : "");
  }
}

function pomoTick() {
  if (pomoState.remaining <= 0) {
    clearInterval(pomoInterval);
    pomoInterval = null;
    pomoState.running = false;
    const wasWork = pomoState.type === "work";
    pomoState.type = wasWork ? "break" : "work";
    const s = loadSettings();
    pomoState.total = (pomoState.type === "work" ? s.pomodoro.work : s.pomodoro.break) * 60;
    pomoState.remaining = pomoState.total;
    showToast(wasWork ? "🎉 Time for a break!" : "💪 Back to work!", wasWork ? "success" : "info");
    // Browser notification
    if (Notification?.permission === "granted") {
      new Notification(wasWork ? "Pomodoro complete! Take a break." : "Break over! Time to focus.", { icon: "logo.svg" });
    }
    updatePomoRing();
    return;
  }
  pomoState.remaining--;
  updatePomoRing();
}

function togglePomodoro() {
  const el = document.getElementById("widget-pomo");
  if (!el || el.style.display === "none") return;

  if (pomoState.running) {
    clearInterval(pomoInterval);
    pomoInterval = null;
    pomoState.running = false;
  } else {
    pomoState.running = true;
    pomoInterval = setInterval(pomoTick, 1000);
    // Request notification permission
    if (Notification?.permission === "default") {
      Notification.requestPermission();
    }
  }
  updatePomoRing();
}

function resetPomo() {
  if (pomoInterval) { clearInterval(pomoInterval); pomoInterval = null; }
  const s = loadSettings();
  pomoState = { running: false, type: "work", remaining: s.pomodoro.work * 60, total: s.pomodoro.work * 60 };
  updatePomoRing();
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
    pomoState.total = s.pomodoro.work * 60;
    updatePomoRing();

    btn.addEventListener("click", togglePomodoro);
    resetBtn.addEventListener("click", resetPomo);
    pomoState._initialized = true;
  }
}

// ─── Date Widget ──────────────────────────────────────────
function updateDateWidget(format) {
  const el = document.getElementById("widget-date-content") || document.getElementById("widget-date");
  if (!el) return;
  const now = new Date();
  if (format === "short") {
    el.textContent = now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } else if (format === "weekday") {
    el.textContent = now.toLocaleDateString(undefined, { weekday: "long" });
  } else {
    el.textContent = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }
}

// ─── Main Init ────────────────────────────────────────────
setRandomQuote();
updateTime();
setInterval(updateTime, 1000);
initGreeting();
initSearch();
initEngineSwitcher();
render();
renderTopBar();
initNotes();
initHabits();

if (typeof applySettings === "function") {
  applySettings();
  initGreeting();
  initEngineSwitcher();
}

if (typeof initTodo === "function") initTodo();
if (typeof initPomodoro === "function") initPomodoro();
if (typeof initWeather === "function") initWeather();
if (typeof updateDateWidget === "function") updateDateWidget();
if (typeof initDraggable === "function") initDraggable();

// Wire up settings button
document.body.addEventListener("click", function (e) {
  const btn = e.target.closest("#settings-btn");
  if (btn && typeof openSettings === "function") openSettings();
});

document.addEventListener("click", function (e) {
  if (!e.target.closest(".menu-dropdown") && !e.target.closest(".menu-btn")) {
    closeAllMenus();
  }
});

const preferDark = window.matchMedia("(prefers-color-scheme: dark)");
preferDark.addEventListener("change", function () {
  if (typeof applySettings === "function") applySettings();
});

// ─── Aurora integration with settings ────────────────────
// Called by settings.js after theme apply
function onThemeApplied() {
  stopAurora();
  const s = getSettings();
  if (s.theme?.background?.type === "aurora") {
    initAurora();
  }
}
