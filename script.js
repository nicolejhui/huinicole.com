import { POSTS, DRAFTS } from "./posts.js";

const RECENT_COUNT = 3;

let route = "home"; // "home" | "writing" | "post"
let postIndex = 0;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function postRowHtml(post, index) {
  return `
    <a href="#" class="post-row" data-route="post" data-index="${index}">
      <span class="title">${escapeHtml(post.title)}</span>
      <span class="date">${escapeHtml(post.short)}</span>
    </a>`;
}

function writingRowHtml(post, index) {
  return `
    <a href="#" class="writing-row" data-route="post" data-index="${index}">
      <div class="row-top">
        <span class="title">${escapeHtml(post.title)}</span>
        <span class="date">${escapeHtml(post.short)}</span>
      </div>
      <span class="dek">${escapeHtml(post.dek)}</span>
    </a>`;
}

function renderHome() {
  const hasPosts = POSTS.length > 0;
  const count = Math.max(1, Math.min(POSTS.length, RECENT_COUNT));
  const recent = POSTS.slice(0, count);

  return `
    <div class="home">
      <div class="hero">
        <h1>Documenting my journey to understand the complete picture of my health by building tech.</h1>
      </div>

      ${hasPosts ? `
      <div class="recent">
        <div class="section-label">The project, so far</div>
        ${recent.map((post, i) => postRowHtml(post, i)).join("")}
        <div class="list-end"></div>
        <a href="#" class="all-writing" data-route="writing">All writing →</a>
      </div>` : ""}

      <div class="elsewhere">
        <div class="section-label">Elsewhere</div>
        <div class="social-links">
          <a href="https://www.linkedin.com/in/nicole-hui/" aria-label="LinkedIn">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05A4.2 4.2 0 0 1 16.6 8.7c3.2 0 4.4 2 4.4 5.2V21h-4v-6c0-1.5-.5-2.5-1.9-2.5s-2.1 1-2.1 2.5V21H9z"/></svg>
          </a>
          <a href="https://github.com/nicolejhui" aria-label="GitHub">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.35 4.7-4.58 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
          </a>
          <a href="mailto:huin148j@gmail.com" aria-label="Email">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="2.5" y="4.75" width="19" height="14.5"/><path d="M3.2 6l8.8 6.9L20.8 6"/></svg>
          </a>
        </div>
      </div>
    </div>`;
}

function renderWriting() {
  return `
    <div class="writing">
      <div class="writing-list">
        ${POSTS.map((post, i) => writingRowHtml(post, i)).join("")}
        <div class="list-end"></div>
      </div>
    </div>`;
}

function renderPost() {
  const post = POSTS[postIndex] || POSTS[0];
  if (!post) return "";

  return `
    <div class="post-page">
      <a href="#" class="back-link" data-route="writing">← Writing</a>
      <div class="post-head">
        <div class="post-date">${escapeHtml(post.date)}</div>
        <h1 class="post-title">${escapeHtml(post.title)}</h1>
        <p class="post-dek">${escapeHtml(post.dek)}</p>
      </div>
      <div class="post-body">
        ${post.body.map((para) => `<p>${escapeHtml(para)}</p>`).join("")}
      </div>
      <div class="post-footer">
        <span class="post-footer-note">Thoughts? <a href="mailto:huin148j@gmail.com">huin148j@gmail.com</a></span>
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
  render();
});

render();
