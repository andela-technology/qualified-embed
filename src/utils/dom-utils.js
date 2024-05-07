const doc = window.document;

/**
 * Executes the provided function when the DOM is ready.
 * @param {EventListener} fn - The function to execute when the DOM is ready
 * @returns {undefined}
 */
export function docReady(fn) {
  // see if DOM is already available
  if (doc.readyState === "complete" || doc.readyState === "interactive") {
    // call on next available tick
    window.setTimeout(fn, 1);
  } else {
    doc.addEventListener("DOMContentLoaded", fn);
  }
}
