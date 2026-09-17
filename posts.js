// Each piece of writing lives in its own folder under writing/posts/.
// This file just collects them and splits published vs. draft.
import introPost from "./writing/posts/intro-post/post.js";
import sikfanPost from "./writing/posts/sikfan-lets-eat/post.js";
import sikfanUxPost from "./writing/posts/sikfan-ux/post.js";

// Newest first.
const ALL_WRITING = [
  sikfanUxPost,
  sikfanPost,
  introPost
];

export const POSTS = ALL_WRITING.filter((post) => post.published);
export const DRAFTS = ALL_WRITING.filter((post) => !post.published);
