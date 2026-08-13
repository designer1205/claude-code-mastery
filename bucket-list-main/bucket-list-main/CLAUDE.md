# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"나의 버킷 리스트" — a bucket-list tracker. Pure client-side vanilla JavaScript app with no build step, no package manager, and no backend. All state lives in the browser's `localStorage`.

## Running the app

There is no build/lint/test tooling in this repo (no `package.json`). To run it, just serve/open `index.html`:

- Simplest: double-click `index.html` to open it directly in a browser.
- VS Code: right-click `index.html` → "Open with Live Server".
- Python: `python -m http.server 8000` then visit `http://localhost:8000`.

Tailwind CSS is loaded via the CDN `<script>` tag in `index.html` (`https://cdn.tailwindcss.com`) — there is no Tailwind build/config file. `css/styles.css` only holds hand-written CSS that supplements Tailwind's utility classes (animations, filter-button active state, dark-mode overrides, mobile layout tweaks).

There is no test suite and no linter configured.

## Architecture

Two-module split, loaded in this order from `index.html`: `js/storage.js` then `js/app.js`.

- **`js/storage.js` — `BucketStorage`**: a plain object acting as the data/persistence layer. Every method reads the *entire* list from `localStorage` (key `bucketList`), mutates it, and writes it back — there is no in-memory cache between calls. Responsible for CRUD (`addItem`, `updateItem`, `deleteItem`, `toggleComplete`), stats (`getStats`), and filtering (`getFilteredList`).

- **`js/app.js` — `BucketListApp`**: a class instantiated once as the global `app` (created in the `DOMContentLoaded` listener at the bottom of the file). Handles DOM caching, event binding, and rendering. It calls into `BucketStorage` for all data operations and then calls `this.render()` to redraw.

- **Rendering model**: no virtual DOM / diffing. `render()` regenerates the *entire* list's HTML via `createBucketItemHTML()` + `innerHTML` on every state change (add/edit/delete/toggle/filter). This is intentional given the app's small scale — keep this pattern when extending rather than introducing partial-update logic.

- **List item buttons use inline `onclick="app.xxx(...)"` handlers** that call back into the global `app` instance (e.g. `app.handleToggle('${item.id}')`, `app.openEditModal(...)`, `app.handleDelete(...)`). Any new per-item action button should follow this same inline-handler-calling-into-`app` convention rather than switching to `addEventListener`-based delegation.

- **Data shape** (one item in the array stored under `localStorage['bucketList']`):
  ```javascript
  {
    id: "1730880000000",        // Date.now().toString(), no external UUID lib
    title: "세계 일주하기",
    completed: false,
    createdAt: "2025-11-06T...",  // ISO string
    completedAt: null            // ISO string once completed, else null
  }
  ```
  New items are unshifted (added to the front) so the list is newest-first.

- **XSS handling**: `escapeHtml()` in `app.js` escapes item titles before they're interpolated into template strings for `innerHTML`. When inserting any new user-controlled string into rendered HTML, escape it the same way — do not assume Tailwind/DOM APIs handle this for you.

- **Edit flow**: a single hidden modal (`#editModal` in `index.html`) is reused for all edits; `app.editingId` tracks which item is currently being edited. Closing/canceling clears `editingId` and the input.

- **Filtering**: `currentFilter` (`'all' | 'active' | 'completed'`) is tracked on the `BucketListApp` instance and passed to `BucketStorage.getFilteredList()` on every render; the active filter button's styling is toggled via the `.active` CSS class (see `css/styles.css`).
