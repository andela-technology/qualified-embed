/* eslint-disable no-unused-vars */
/**
 * You can directly embed a challenge editor without the Manager library. Note that the outer page will not be able to interact with the embedded challenge. This could, however, be useful as a way to show simple examples with static site generators.
 *
 * The base URL will be `https://www.qualified.io/embed/[challengeId]`.
 *
 * The following parameters are supported to be set via query parameters for simple embedding. For example, if you'd like to inject a javascript challenge with dark-mode, you might use the following code:
 *
 * ```xml
 * <iframe src="https://www.qualified.io/embed/abcd12340001?language=javascript&theme=dark"></iframe>
 * ```
 *
 * @type Object
 * @interface
 */
export const UrlParams = {
  /**
   * Enables setting up the editor in different read-only modes.
   *
   * * `null` The default, normal mode with full editing and saving.
   * * `"restricted"` Means you can edit the code, but changes will never be saved, or sent back to the parent
   *   window.
   * * `"readonly"` Means you cannot edit the code at all. Useful for reviewing-only, without making changes.
   *   This also disables running code.
   *
   * @name UrlParams#mode
   * @type {undefined|"readonly"|"restricted"}
   */
  mode: undefined,

  /**
   * Language to use on classic code challenges. This is recommended for multi-language challenges, as the user
   * is not provided a way to change the language within the editor.
   *
   * You can provide your own list of available languages using the results from the
   * {@link ChallengeOptions#onLoaded} callback event.
   *
   * @name UrlParams#language
   * @type {undefined|string}
   */
  language: undefined,

  /**
   * Force the theme for this editor (one of `light` or `dark`). Leave unset to let the user select their own theme
   * from the `idesettings` tab.
   *
   * @name UrlParams#theme
   * @type {undefined|"light"|"dark"}
   * @default "light"
   */
  theme: undefined,

  /**
   * Comma-delimited list of tabs to hide by tab ID or file path, overrides {@link ChallengeOptions#showTabs}.
   *
   * @see {@link TAB_IDS} for a list of common tab IDs.
   *
   * @name UrlParams#hideTabs
   * @type {string}
   */
  hideTabs: "",

  /**
   * Comma-delimited list of tabs to show by tab ID or file path. When this is set, the default state is to show
   * _no_ tabs at all.
   *
   * @see {@link TAB_IDS} for a list of common tab IDs.
   *
   * @name UrlParams#showTabs
   * @type {string}
   */
  showTabs: "",

  /**
   * If `true`, hides the list of actions in the upper left. This could be useful if you are wrapping this in your
   * own interface.
   *
   * The user will still be able to run the code using the shortcut keys (`CMD/CTRL + '` or `CMD/CTRL + Enter`).
   *
   * For Classic Code challenges, you can choose to only show RUN TESTS. Set the value of `hideActions` to
   * `"attempt"`. This hides the SUBMIT button, and disables running the code against the final submission tests.
   * This could be useful for practice code or simple demo code.
   *
   * To achieve the reverse (only allowing hidden tests), either configure the challenge without Sample Test Cases,
   * or hide the `testcases` tab using `hideTabs`.
   *
   * @name UrlParams#hideActions
   * @type {boolean|"attempt"}
   * @default false
   */
  hideActions: false,
};
