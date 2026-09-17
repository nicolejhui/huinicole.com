// Each piece of writing lives in its own file under writing/.
// This file just collects them and splits published vs. draft.
import introPost from "./writing/2026-09-09-intro-post.js";
import sikfanPost from "./writing/2026-sikfan-lets-eat.js";
import sikfanUxPost from "./writing/2026-sikfan-ux.js";

// Newest first.
const ALL_WRITING = [
  sikfanUxPost,
  sikfanPost,
  introPost
];

export const POSTS = ALL_WRITING.filter((post) => post.published);
export const DRAFTS = ALL_WRITING.filter((post) => !post.published);
