import { POSTS, DRAFTS } from "./posts.js";

const RECENT_COUNT = 3;

let route = "home"; // "home" | "writing" | "post"
let postIndex = 0;

function pathForRoute(r) {
  if (r === "writing") return "/writings";
  if (r === "post") {
    const post = POSTS[postIndex];
    return post && post.slug ? `/writings/${post.slug}` : "/writings";
  }
  return "/";
}

function routeForPath(path) {
  if (path === "/writings" || path === "/writing") return { route: "writing" };
  const postMatch = path.match(/^\/writings?\/([^/]+)\/?$/);
  if (postMatch) {
    const index = POSTS.findIndex((p) => p.slug === postMatch[1]);
    if (index >= 0) return { route: "post", index };
  }
  return { route: "home" };
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function postRowHtml(post, index) {
  return `
    <a href="#" class="post-row" data-route="post" data-index="${index}">
      <span class="title">${escapeHtml(post.title)}</span>
    </a>`;
}

function recentMonthGroupHtml(meta, rows) {
  return `
    <div class="recent-month-group">
      <div class="recent-month-label">${escapeHtml(meta)}</div>
      ${rows}
    </div>`;
}

function writingRowHtml(post, index) {
  return `
    <a href="#" class="writing-row" data-route="post" data-index="${index}">
      <span class="title">${escapeHtml(post.title)}</span>
      <span class="dek">${escapeHtml(post.dek)}</span>
    </a>`;
}

function writingMonthGroupHtml(meta, rows) {
  return `
    <div class="writing-year-group">
      <div class="section-label">${escapeHtml(meta)}</div>
      ${rows}
    </div>`;
}

function renderHome() {
  const hasPosts = POSTS.length > 0;
  const count = Math.max(1, Math.min(POSTS.length, RECENT_COUNT));
  const recent = POSTS.slice(0, count);

  const groups = [];
  recent.forEach((post, i) => {
    const meta = post.meta || post.year;
    const group = groups[groups.length - 1];
    if (group && group.meta === meta) {
      group.rows.push(postRowHtml(post, i));
    } else {
      groups.push({ meta, rows: [postRowHtml(post, i)] });
    }
  });

  return `
    <div class="home">
      <div class="hero">
        <h1>Documenting my journey to understand the complete picture of my health by building tech.</h1>
      </div>

      ${hasPosts ? `
      <div class="recent">
        <div class="section-label">The project, so far</div>
        ${groups.map((g) => recentMonthGroupHtml(g.meta, g.rows.join(""))).join("")}
        <div class="list-end"></div>
        <a href="#" class="all-writing" data-route="writing">All writing →</a>
      </div>` : ""}

      <div class="elsewhere">
        <div class="section-label">Elsewhere</div>
        <div class="social-links">
          <a href="https://www.linkedin.com/in/nicole-hui/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05A4.2 4.2 0 0 1 16.6 8.7c3.2 0 4.4 2 4.4 5.2V21h-4v-6c0-1.5-.5-2.5-1.9-2.5s-2.1 1-2.1 2.5V21H9z"/></svg>
          </a>
          <a href="https://github.com/nicolejhui" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.35 4.7-4.58 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
          </a>
          <a href="mailto:huin148j@gmail.com" aria-label="Email">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="2.5" y="4.75" width="19" height="14.5"/><path d="M3.2 6l8.8 6.9L20.8 6"/></svg>
          </a>
        </div>
        <p class="ai-note">Note: while Claude code helped me build my apps and this website, all my writing is 100% written by me</p>
      </div>
    </div>`;
}

function renderWriting() {
  const groups = [];
  POSTS.forEach((post, i) => {
    const meta = post.meta || post.year;
    const group = groups[groups.length - 1];
    if (group && group.meta === meta) {
      group.rows.push(writingRowHtml(post, i));
    } else {
      groups.push({ meta, rows: [writingRowHtml(post, i)] });
    }
  });

  return `
    <div class="writing">
      <div class="writing-list">
        ${groups.map((g) => writingMonthGroupHtml(g.meta, g.rows.join(""))).join("")}
        <div class="list-end"></div>
      </div>
    </div>`;
}

function numberedListHtml(items) {
  return `
    <div class="req-list">
      ${items.map((text, i) => `
        <div class="req-row">
          <span class="req-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="req-text">${escapeHtml(text)}</span>
        </div>`).join("")}
    </div>`;
}

function bulletedListHtml(items) {
  return `
    <div class="dot-list">
      ${items.map((item) => {
        const text = typeof item === "string" ? item : item.text;
        const sub = typeof item === "object" && item.sub ? item.sub : null;
        return `
        <div class="dot-row">
          <span class="dot-text">${escapeHtml(text)}</span>
          ${sub ? `
          <div class="dot-sublist">
            ${sub.map((s) => `<span class="dot-text">${escapeHtml(s)}</span>`).join("")}
          </div>` : ""}
        </div>`;
      }).join("")}
    </div>`;
}

function labelCardHtml(labels) {
  return `
    <div class="label-card">
      ${labels.map(({ label, def }) => `
        <div class="label-row">
          <span class="label-name">${escapeHtml(label)}</span>
          <span class="label-def">${escapeHtml(def)}</span>
        </div>`).join("")}
    </div>`;
}

// Screenshot sources as named constants, keyed by figure type, so real
// images can be dropped in later without touching post data or markup.
const FIGURE_SRC = {
  glucose: "/writing/screenshots/glucose.png",
  captureSnap: "/writing/screenshots/capture.png",
  captureDish: "/writing/screenshots/glucose.png",
  editName: "/writing/screenshots/edit-name.png",
  editMacros: "/writing/screenshots/edit.png",
  log: "/writing/screenshots/log.png",
  videoDemo: "/writing/screenshots/demo.mp4",
  tirRollercoaster: "/writing/screenshots/rollercoaster.png",
  tirSteady: "/writing/screenshots/stable-glucose.png",
  tirComparison: "/writing/screenshots/time-in-range-dexcom.jpeg",
};

function phoneFrameHtml(src, alt, size) {
  return `
    <div class="phone-frame size-${size}">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" onerror="this.classList.add('is-missing')">
    </div>`;
}

function graphFrameHtml(src, alt) {
  return `
    <div class="graph-frame">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" onerror="this.classList.add('is-missing')">
    </div>`;
}

function photoFrameHtml(src, alt) {
  return `
    <div class="photo-frame">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" onerror="this.classList.add('is-missing')">
    </div>`;
}

function phoneFrameVideoHtml(src, size) {
  return `
    <div class="phone-frame size-${size}">
      <video src="${escapeHtml(src)}" controls playsinline preload="metadata" onerror="this.classList.add('is-missing')"></video>
    </div>`;
}

function figureHtml(kind) {
  if (kind === "glucose") {
    return `
      <div class="figure">
        <div class="screens-plinth plinth-single">
          ${phoneFrameHtml(FIGURE_SRC.glucose, "Impact label + glucose curve", "large")}
        </div>
        <p class="screens-caption">A quick glance at the results screen shows blood glucose impact with the model's forecast beneath it.</p>
      </div>`;
  }
  if (kind === "capture") {
    return `
      <div class="figure">
        <div class="screens-plinth plinth-pair">
          <div class="phone">
            ${phoneFrameHtml(FIGURE_SRC.captureSnap, "Camera / capture", "small")}
            <span class="phone-caption">Meal scan</span>
          </div>
          <div class="phone">
            ${phoneFrameHtml(FIGURE_SRC.captureDish, "Detected dish + components", "small")}
            <span class="phone-caption">Detected dish</span>
          </div>
        </div>
        <p class="screens-caption">Users are able to take a picture to receive blood glucose impact and nutritional information</p>
      </div>`;
  }
  if (kind === "edit") {
    return `
      <div class="figure">
        <div class="screens-plinth plinth-pair">
          <div class="phone">
            ${phoneFrameHtml(FIGURE_SRC.editName, "Correcting the identified dish name", "small")}
            <span class="phone-caption">Correct dish</span>
          </div>
          <div class="phone">
            ${phoneFrameHtml(FIGURE_SRC.editMacros, "Editing macros and confidence score", "small")}
            <span class="phone-caption">Correct ingredients and adjust portion</span>
          </div>
        </div>
        <p class="screens-caption">Vision model confidence score is displayed so users can judge and correct ingredient compositoin or portions as needed</p>
      </div>`;
  }
  if (kind === "log") {
    return `
      <div class="figure">
        <div class="screens-plinth plinth-single">
          ${phoneFrameHtml(FIGURE_SRC.log, "Meal log", "large")}
        </div>
        <p class="screens-caption">The meal log provides a visual library of past meals and their glucose impact at a glance. Users can click on a previous meal to view full details</p>
      </div>`;
  }
  if (kind === "tir") {
    return `
      <div class="figure">
        <div class="screens-plinth plinth-pair">
          <div class="graph">
            ${graphFrameHtml(FIGURE_SRC.tirRollercoaster, "Glucose graph showing a volatile, rollercoaster-like pattern")}
            <span class="graph-caption">Rollercoaster glucose range</span>
          </div>
          <div class="graph">
            ${graphFrameHtml(FIGURE_SRC.tirSteady, "Glucose graph showing 80% time-in-range")}
            <span class="graph-caption">Consistent time in range</span>
          </div>
        </div>
      </div>`;
  }
  if (kind === "tir-comparison") {
    return `
      <div class="figure">
        <div class="screens-plinth plinth-single">
          ${photoFrameHtml(FIGURE_SRC.tirComparison, "Dexcom's Trends section showing time-in-range")}
        </div>
        <p class="screens-caption">Dexcom's trends section showing time in range</p>
      </div>`;
  }
  if (kind === "video-demo") {
    return `
      <div class="figure">
        <div class="screens-plinth plinth-single">
          ${phoneFrameVideoHtml(FIGURE_SRC.videoDemo, "large")}
        </div>
        <p class="screens-caption">End-to-end demo of SikFan in action</p>
      </div>`;
  }
  return "";
}

function noteHtml(block) {
  const linkIndex = block.linkSlug ? POSTS.findIndex((p) => p.slug === block.linkSlug) : -1;
  const link = linkIndex >= 0
    ? `<a href="#" data-route="post" data-index="${linkIndex}">${escapeHtml(block.linkText)}</a>`
    : escapeHtml(block.linkText || "");
  return `<p class="pull-note">${escapeHtml(block.note)}${link}${escapeHtml(block.after || "")}</p>`;
}

function postBodyBlockHtml(block) {
  if (typeof block === "string") return `<p>${escapeHtml(block)}</p>`;
  if (block.heading) return `<h2 class="post-heading">${escapeHtml(block.heading)}</h2>`;
  if (block.subheading) return `<h3 class="post-subheading">${escapeHtml(block.subheading)}</h3>`;
  if (block.numbered) return numberedListHtml(block.numbered);
  if (block.bulleted) return bulletedListHtml(block.bulleted);
  if (block.labels) return labelCardHtml(block.labels);
  if (block.note) return noteHtml(block);
  if (block.figure) return figureHtml(block.figure);
  return "";
}

function renderPost() {
  const post = POSTS[postIndex] || POSTS[0];
  if (!post) return "";

  return `
    <div class="post-page">
      <a href="#" class="back-link" data-route="writing">← Writing</a>
      <div class="post-head">
        <div class="post-date">
          <span>${escapeHtml(post.meta || post.year)}</span>${post.readTime ? `<span class="sep">/</span><span class="read-time">${escapeHtml(post.readTime)}</span>` : ""}
        </div>
        <h1 class="post-title">${escapeHtml(post.title)}</h1>
        <p class="post-dek">${escapeHtml(post.dek)}</p>
      </div>
      <div class="post-body">
        ${post.body.map(postBodyBlockHtml).join("")}
      </div>
      <div class="post-footer">
        <span class="post-footer-note">Thoughts? <a href="mailto:huin148j@gmail.com">huin148j@gmail.com</a><span class="ai-note">Note: while Claude code helped me build my apps and this website, all my writing is 100% written by me</span></span>
        <a href="#" class="all-writing" data-route="writing">All writing →</a>
      </div>
    </div>`;
}

function render() {
  const main = document.getElementById("main");
  if (route === "writing") main.innerHTML = renderWriting();
  else if (route === "post") main.innerHTML = renderPost();
  else main.innerHTML = renderHome();
}

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-route]");
  if (!el) return;
  e.preventDefault();
  const idxAttr = el.getAttribute("data-index");
  route = el.getAttribute("data-route");
  if (idxAttr !== null) postIndex = Number(idxAttr);
  window.scrollTo(0, 0);
  const path = pathForRoute(route);
  if (path !== window.location.pathname) {
    history.pushState({ route, postIndex }, "", path);
  }
  render();
});

window.addEventListener("popstate", () => {
  const resolved = routeForPath(window.location.pathname);
  route = resolved.route;
  if (resolved.index !== undefined) postIndex = resolved.index;
  render();
});

const initialRoute = routeForPath(window.location.pathname);
route = initialRoute.route;
if (initialRoute.index !== undefined) postIndex = initialRoute.index;
render();
