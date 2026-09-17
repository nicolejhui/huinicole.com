// Standalone page script — scoped to this page only, not wired into script.js/posts.js.
// Screenshot sources are named constants so the actual images can be dropped in later
// without touching markup. Frames keep their fixed size via CSS even if the file is missing.
const SCREENSHOTS = {
  impactCurve: "screenshots/impact-curve.png",
  snap: "screenshots/snap.png",
  detectedDish: "screenshots/detected-dish.png",
  confidenceEdit: "screenshots/confidence-edit.png",
  mealLog: "screenshots/meal-log.png",
};

function mountScreenshot(el) {
  const key = el.getAttribute("data-screenshot");
  const src = SCREENSHOTS[key];
  if (!src) return;
  el.src = src;
  el.addEventListener("error", () => {
    el.classList.add("is-missing");
  }, { once: true });
}

document.querySelectorAll("img[data-screenshot]").forEach(mountScreenshot);
