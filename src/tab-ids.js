/* eslint-disable no-unused-vars */
/**
 * List of common tab names. For project challenges, this will also include all readwrite enabled file paths.
 * @readonly
 * @enum {string}
 */
const TAB_IDS = {
  /** Solution code. Only used for classic code challenges, use file paths for project challenges. */
  code: "code",
  /** Editable test cases for the candidate. Only used for classic code challenges, use file paths for project challenges. Hiding this also disables candidate tests. */
  testcases: "testcases",
  /** The instructions created within the challenge editor. */
  instructions: "instructions",
  /** The results from running the challenge. Hiding this tab disables running any sort of code. */
  runnerframe: "runnerframe",
  /** Shows a real-time, embedded web preview for project challenges with web previews enabled. */
  webpreview: "webpreview",
  /** The console for the web preview. By default, this will not open unless the console logs button is clicked
   * in the web preview. If you want to force it to be opened when the embed is loaded, use `initialLayout` to
   * position it.
   */
  webpreviewconsole: "webpreviewconsole",
  /** Enables the code solver to modify the editor. Changes will be synced across embeds on the page. */
  idesettings: "idesettings",
};
