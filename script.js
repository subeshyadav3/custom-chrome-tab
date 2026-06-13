const STORAGE_KEY_SHORTCUTS = "custom-tab-shortcuts";
const STORAGE_KEY_TOPBAR = "custom-tab-topbar";

function getSettings() {
  return typeof loadSettings === "function" ? loadSettings() : {};
}

function iconUrl(domain) {
  const s = getSettings();
  return (s.faviconService || "https://www.google.com/s2/favicons?domain={domain}&sz=64").replace("{domain}", encodeURIComponent(domain));
}

function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

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
  document.querySelector("#dialog label[for='dialog-name']").style.display = "";
  document.querySelector("#dialog label[for='dialog-url']").textContent = "URL";
  urlInput.placeholder = "https://example.com";
}

function showPrompt(title, label, placeholder, defaultValue, callback) {
  promptCallback = callback;
  dialogTitle.textContent = title;
  document.querySelector("#dialog label[for='dialog-name']").style.display = "none";
  nameInput.style.display = "none";
  document.querySelector("#dialog label[for='dialog-url']").textContent = label;
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

  list.forEach((s, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "tile-wrapper";

    const a = document.createElement("a");
    a.href = s.url;
    a.className = "link-card";
    a.target = "_self";

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
    menuBtn.textContent = "\u22EE";
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
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllMenus();
      openDialog(i);
    });
    dropdown.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllMenus();
      list.splice(i, 1);
      saveShortcuts(list);
      render();
    });
    dropdown.appendChild(removeBtn);

    wrapper.appendChild(dropdown);
    container.appendChild(wrapper);
  });

  const addBtn = document.createElement("button");
  addBtn.id = "add-shortcut";
  addBtn.innerHTML = '<span class="plus">+</span><span>Add shortcut</span>';
  addBtn.addEventListener("click", function () {
    openDialog(-1);
  });
  container.appendChild(addBtn);
}

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
  } else {
    list[editingIndex] = { name, url };
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

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeDialog();
    closeAllMenus();
  }
});

document.addEventListener("click", function (e) {
  if (!e.target.closest(".menu-dropdown") && !e.target.closest(".menu-btn")) {
    closeAllMenus();
  }
});

function updateTime() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString("en-GB");
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
  if (g.dynamic) {
    const h = new Date().getHours();
    let prefix = "Good ";
    if (h < 12) prefix += "morning";
    else if (h < 17) prefix += "afternoon";
    else prefix += "evening";
    document.getElementById("greeting").innerHTML = prefix + ", &lt;" + name + " /&gt;";
  } else {
    document.getElementById("greeting").innerHTML = "&lt;" + name + " /&gt;";
  }
}

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
  img.onerror = function () {
    this.src = iconUrl(extractDomain(item.url));
  };
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
    wrapper.querySelector(".top-bar-remove").remove();
    bar.appendChild(wrapper);
  }

  // Drag-drop reorder on all draggable links (excluding Account)
  bar.querySelectorAll("a[draggable=true]").forEach((a) => {
    a.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      this.classList.add("drag-over");
    });
    a.addEventListener("dragleave", function () {
      this.classList.remove("drag-over");
    });
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
          showPrompt(
            site.name,
            site.prompt,
            site.placeholder || "Enter value...",
            "",
            function (val) {
              if (!val) return;
              let links = getTopBarLinks() || s.topBarLinks || [];
              links.push({ name: site.name, url: site.url.replace("{input}", encodeURIComponent(val)) });
              saveTopBarLinks(links);
              renderTopBar();
            }
          );
          return;
        }
        let links = getTopBarLinks() || s.topBarLinks || [];
        links.push({ name: site.name, url: site.url });
        saveTopBarLinks(links);
        renderTopBar();
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
    const engines = {
      google: { action: "https://www.google.com/search", param: "q" },
      duckduckgo: { action: "https://duckduckgo.com/", param: "q" },
      bing: { action: "https://www.bing.com/search", param: "q" },
      brave: { action: "https://search.brave.com/search", param: "q" },
      yandex: { action: "https://yandex.com/search/", param: "text" },
      ecosia: { action: "https://www.ecosia.org/search", param: "q" },
    };
    const e = engines[se.engine] || engines.google;
    form.action = e.action;
    input.name = e.param;
  }

  const names = { google: "Google", duckduckgo: "DuckDuckGo", bing: "Bing", brave: "Brave", yandex: "Yandex", ecosia: "Ecosia" };
  input.placeholder = "Search " + (names[se.engine] || "Custom") + "...";
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
    console.error(err);
    suggestionsEl.style.display = "none";
  }
});

document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target)) {
    suggestionsEl.style.display = "none";
  }
});

// ─── Init ───
setRandomQuote();
updateTime();
setInterval(updateTime, 1000);
initGreeting();
initSearch();
render();
renderTopBar();

if (typeof applySettings === "function") {
  applySettings();
  initGreeting();
}

if (typeof initTodo === "function") initTodo();
if (typeof initPomodoro === "function") initPomodoro();
if (typeof initWeather === "function") initWeather();
if (typeof updateDateWidget === "function") updateDateWidget();

// Wire up settings button via event delegation
document.body.addEventListener("click", function (e) {
  const btn = e.target.closest("#settings-btn");
  if (btn && typeof openSettings === "function") openSettings();
});

const preferDark = window.matchMedia("(prefers-color-scheme: dark)");
preferDark.addEventListener("change", function () {
  if (typeof applySettings === "function") applySettings();
});
