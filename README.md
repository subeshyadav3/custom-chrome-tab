# Custom New Tab

A fully customizable Chrome new tab replacement with dynamic theming, widgets, background gallery, and drag-and-drop layout.

## Features

- **Greeting & Time** — Personalized greeting with dynamic time-of-day prefix. 12/24-hour time display.
- **Quote** — Random motivational quote on every new tab. Configurable list.
- **Search Bar** — Multi-engine search (Google, DuckDuckGo, Bing, Brave, Yandex, Ecosia, or custom) with autocomplete suggestions.
- **Quick Links** — Bookmark-style shortcut grid. Add, delete, and reorder.
- **Top Bar** — Social/utility links (Gmail, GitHub, etc.) displayed as pill buttons. Drag-and-drop reorderable. "+" button to add from a categorized site gallery.
- **Todo Widget** — Personal task list. Add, check off, and delete tasks. Persisted in localStorage.
- **Pomodoro Timer** — Focus timer with configurable work/break intervals. Start, pause, and reset.
- **Date Widget** — Shows current date in full, short, or weekday-only format.
- **Weather Widget** — Live weather from Open-Meteo (no API key needed). Supports Celsius/Fahrenheit.
- **Settings Panel** — Full in-page settings panel with theme, layout toggles, search config, greeting customization, widget controls, import/export, and custom CSS.
- **Theme Engine** — Dark/Light/Auto mode, custom accent color, font selection, and background (solid, gradient, image upload, or video upload).
- **Background Gallery** — 12 solid colors + 18 gradient presets, plus custom URL and file upload for images/videos.
- **Drag-and-Drop Layout** — Pomodoro and Todo widgets have visible drag handles; Time, Date, Weather, and Settings button are draggable via double-click. Positions persist. Lock layout option available.
- **Import / Export** — Export your full settings + todo list as a JSON file. Import to restore on another device.

## Installation

1. **Clone or download** this repository.
2. Open **Chrome** and go to `chrome://extensions`.
3. Enable **Developer mode** (toggle in top-right).
4. Click **Load unpacked** and select the root folder (`custom-tab`).
5. The extension replaces your new tab page immediately.

## Configuration

### Quick start (personalize with your own data)

Copy `env-config.example.js` to `env-config.js` and edit:

```js
const ENV_CONFIG = {
  userName: "Your Name",
  topBarLinks: [
    { name: "Gmail", url: "https://mail.google.com/" },
    { name: "Account", url: "https://myaccount.google.com/" }
  ],
  defaultShortcuts: [
    { name: "YouTube", url: "https://www.youtube.com/" },
    { name: "GitHub", url: "https://github.com/" }
  ],
  quotes: [ "Your own quotes here..." ],
  famousSites: [ /* sites shown in + button */ ]
};
```

`env-config.js` is gitignored — your personal data stays private.

### Settings panel (live UI)

Open the **Settings** button (bottom-left corner) for:
- Theme: mode, accent color, background (solid/gradient/image/video with file upload)
- Layout: toggle greeting, time, date, quote, search bar, top bar, shortcuts, todo, pomodoro, and lock layout for drag
- Search: engine selector, custom search URL/param, autocomplete toggle
- Greeting: your name, dynamic prefix, subtitle
- Widgets: date format, weather location/unit, pomodoro work/break minutes
- Advanced: custom CSS injection
- Import/Export/Reset buttons

## File Structure

```
custom-tab/
├── index.html              # Main page: HTML structure + all CSS
├── script.js               # Core app logic: greeting, time, search, top bar, shortcuts
├── settings.js             # Settings engine: defaults, theme, gallery, widgets, drag layout
├── env-config.js           # Your personal config (gitignored)
├── env-config.example.js   # Template for others (committed)
├── manifest.json           # Chrome extension manifest (v3)
├── logo.svg                # Extension icon
├── .gitignore
├── .env.example            # Documents available env config options
├── scripts/
│   └── generate-config.js  # Optional config generator
└── README.md
```

## How It Works

- `env-config.js` provides initial values (name, links, shortcuts, quotes, sites).
- `settings.js` loads these as defaults, overlays any saved settings from localStorage.
- `script.js` renders the page and wires interactivity.
- All user changes (layout toggles, theme, widget state, positions, todos) save to localStorage under key `custom-tab-settings`. Todos save separately under `custom-tab-todos`.

## Extending

- Add new search engines in `settings.js` → `SEARCH_ENGINES` object.
- Add background presets in `settings.js` → `BG_PRESETS` object.
- Add layout toggles in `defaultSettings()` → `layout` object, then add a checkbox in `renderSettingsForm()`.
- Custom CSS via the **Advanced** section in the settings panel — no need to edit files.

## Credits

- Weather data by [Open-Meteo](https://open-meteo.com/) (no API key required)
- Favicons via Google's favicon service
- Search suggestions via Google Suggest (configurable)
