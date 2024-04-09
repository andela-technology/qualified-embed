import { AbstractEmbed } from "./abstract-embed";
import {
  QUALIFIED_EMBED_BASE_URL,
  QUALIFIED_EMBED_DATA_PROPERTY,
} from "./constants";
import { concatUrl, toQueryParams } from "./utils/string-utils";

/**
 * Retrieves parsed data from localStorage. If challengeId is provided,
 * retrieves data specifically for that challenge; otherwise, retrieves
 * global data.
 * @param {*} id - The identifier for the data in localStorage
 * @param {string?} [challengeId] - Optional identifier for the challenge data to retrieve
 * @returns {*} - The retrieved data, either for the specified challenge or globally
 */
function _getStorageData(id, challengeId) {
  let savedData;
  try {
    const jsonData = window.localStorage[id];
    savedData = JSON.parse(jsonData || "{}");
  } catch (err) {
    /* ignore errors */
  }
  if (challengeId) {
    return (savedData || {})[challengeId];
  } else {
    return savedData || {};
  }
}

let didAlert = false;

/**
 * Saves data to localStorage, optionally namespaced by challengeId.
 * @param {*} id - The identifier for the data in localStorage
 * @param {string} challengeId - The identifier for the challenge data
 * @param {*} data - The data to save
 */
function _setStorageData(id, challengeId, data) {
  const savedData = _getStorageData(id);
  savedData[challengeId] = data;
  try {
    window.localStorage[id] = JSON.stringify(savedData);
  } catch (err) {
    if (didAlert) {
      console.error("[QualifiedEmbed] Error saving editor data", err);
    }
  }
}

/**
 * Represents a single embedded editor. [See Embedding Challenges tutorial for usage.]{@tutorial challenges}
 *
 * Can be created via {@link QualifiedEmbedManager#createEditor}, through automatic editor creation, or directly
 * if there's no need for shared embed management.
 *
 * @class
 * @extends AbstractEmbed
 * @tutorial challenges
 */
export class QualifiedEmbeddedChallenge extends AbstractEmbed {
  /**
   * Creates a new embedded editor.
   *
   * If this editor is created with `config.node` being an `IFRAME`, then that IFRAME is used directly as the editor.
   * Otherwise, the editor will inject a new IFRAME as a child of the `node` passed in.
   *
   * @param {Object} config
   * @param {HTMLElement} config.node - DOM node to use as basis for the injection. Will be used directly if an iFrame, otherwise an iFrame will get appended to this node.
   * @param {string?} config.challengeId - Challenge ID for this editor. If not provided, will attempt to be found via the node's <code>data-qualified-embed</code> attribute.
   * @param {ChallengeOptions?} config.options - Options and listeners for this editor, mixed with challenge-specific and shared options on the manager object.
   * @param {QualifiedEmbedManager?} config.manager - Parent manager for this editor.
   *
   * @constructor
   */
  constructor({ node, challengeId, options = {}, manager }) {
    super({ manager, node });

    if (manager) {
      if (manager.$$destroyed) {
        throw new Error("Cannot create an embed on a destroyed manager object");
      }
      /**
       * Manager for this editor.
       * @type QualifiedEmbedManager
       * @public
       */
      this.manager = manager;
      manager.editors.push(this);
    }

    if (!challengeId) {
      challengeId = node.dataset[QUALIFIED_EMBED_DATA_PROPERTY];
    }
    if (!challengeId) {
      throw new Error(
        "Unable to determine challenge ID from node: no value for data-qualified-embed",
      );
    }

    /**
     * ID of the challenge in the this editor
     * @type string
     */
    this.challengeId = challengeId;

    /**
     * Options on the current editor
     * @type ChallengeOptions
     */
    this.options = Object.assign(
      {},
      manager && manager.options,
      (manager && manager.challengeOptions[challengeId]) || {},
      options,
    );

    this._updateIframe();

    /**
     * Contains information about the loaded challenge, set after {@link ChallengeOptions#onLoaded}.
     * @type ChallengeOptions~LoadData
     */
    this.challengeData = {};

    this._initPenpal(
      ["ready", "loaded", "change", "runStart", "run"],
      ["challengeId", "manager"],
    );
  }

  /**
   * Updates the iframe with new options, or reloads the iframe if the challenge ID has changed.
   *
   * @param {Object} config
   * @param {string?} config.challengeId - Change the challenge ID. Automatically Triggers a reload if the challenge ID is different.
   * @param {ChallengeOptions?} config.options - Update the options for this editor (mixed in with the current ones).
   * @param {boolean?} config.reload - If true, force a reload even if the challenge ID hasn't changed.
   */
  update({
    challengeId = this.challengeId,
    options = null,
    reload = false,
  } = {}) {
    if (this.$$destroyed) return;
    if (options) {
      Object.assign(this.options, options);
    }
    if (reload || (challengeId && this.challengeId !== challengeId)) {
      this.challengeId = challengeId;
      // trigger a full reload of the iframe
      this._updateIframe();
    } else {
      this._sendOptions();
    }
  }

  /**
   * Triggers the editor to start the challenge if not already started.
   *
   * When the `mode` is `readOnly` or `restricted`, this action is ignored.
   * @returns {Promise} A promise that resolves once the challenge is started, or rejects if an error occurs.
   */
  start() {
    return this._post("start");
  }

  /**
   * Triggers the editor to run candidate tests. The runnerframe tab must be visible.
   *
   * Candidate tests can be run with this method even if actions or the testcases tab are hidden.
   *
   * When the `mode` is `readOnly`, this action is ignored.
   *
   * @returns {Promise<ChallengeOptions~RunResult>} A promise that resolves with the results of the run, or rejects if an error occurs.
   */
  runTests() {
    return this._post("runTests");
  }

  /**
   * Triggers the editor to run the submission tests for Classic Code Challenges. The runnerframe tab must be visible.
   *
   * Submission tests can be run with this method even if actions or the code tab are hidden.
   *
   * When the `mode` is `readOnly`, this action is ignored. This action is also ignored for Project Code Challenges.
   *
   * @returns {Promise<ChallengeOptions~RunResult>} A promise that resolves with the results of the run, or rejects if an error occurs.
   */
  attempt() {
    return this._post("attempt");
  }

  /**
   * Triggers the editor to reset the solution code to the initial state.
   *
   * When the `mode` is `readOnly`, this action is ignored.
   *
   * When the `mode` is `restricted`, this action reverts the code to the last saved version.
   *
   * @returns {Promise<ChallengeOptions~FileContentsData>} A promise that resolves with the current files, or rejects if an error occurs.
   */
  reset() {
    return this._post("reset");
  }

  /**
   * Reloads the editor. This could result in a loss of data.
   */
  reload() {
    this._updateIframe();
  }

  /**
   * Sets the file contents for the challenge. You move the cursor without changes by not passing any files.
   *
   * @param {Object} files - Hash of file name or path to file contents to be set on the challenge solution.
   * @param {string} files.(path) - Contents of each file. Use the file path as the key for project challenges, or `code` and `testcases` for classic challenges.
   * @param {ChallengeOptions~Cursor?} cursor - Optional value to move the cursor to a specific file, line, and character. Note: this will move focus to the iframe, so use with caution.
   *
   * @returns {Promise<ChallengeOptions~FileContentsData>} A promise that resolves with the current files, or rejects if an error occurs.
   */
  setFileContents(files, cursor) {
    return this._post("setFileContents", {
      files,
      cursor,
    });
  }

  /**
   * Sets the run result for the challenge, which should be the `eventData.data` returned from
   * {@link ChallengeOptions#onRun}, {@link QualifiedEmbeddedChallenge#runTests}, or
   * {@link QualifiedEmbeddedChallenge#attempt}.
   *
   * This can include the `fileData` property, which will configure the entire solution at once.
   *
   * @param {ChallengeOptions~RunResult} runResult
   * @returns {Promise} A promise resolved after the result has been set, or rejects if an error occurs.
   */
  setRunResult(runResult) {
    return this._post("setRunResult", runResult);
  }

  //// Protected Methods

  /**
   * An internally used handler to configure a newly loaded iframe.
   *
   * @protected
   * @ignore
   */
  onReady() {
    if (this.options.localStorageId) {
      const savedData = _getStorageData(
        this.options.localStorageId,
        this.challengeId,
      );
      if (savedData && savedData.files) {
        this.options.initialFiles = Object.assign(
          {},
          this.options.initialFiles,
          savedData.files,
        );
        if (savedData.cursor) {
          this.options.initialCursor = savedData.cursor;
        }
      }
    }
    this._sendOptions();
  }

  /**
   * An internally used handler to configure a newly loaded iframe.
   *
   * @protected
   * @ignore
   */
  onLoaded({ data }) {
    this.challengeData = data;
  }

  /**
   * Handles changes in the data and updates localStorage if enabled.
   * @param {Object} root0 - The object containing the data
   * @param {*} root0.data - The data being changed
   */
  onChange({ data }) {
    if (this.options.localStorageId) {
      _setStorageData(this.options.localStorageId, this.challengeId, data);
    }
  }

  //// Private Methods

  /**
   * Sends any options over to the iframe to be handled there
   * @private
   */
  _sendOptions() {
    this._post("setOptions", this.options);
  }

  /**
   * Updates or reloads the iframe with the current options
   * @private
   */
  _updateIframe() {
    if (this.$$destroyed) return;
    const params = {
      hasAuthToken: !!this.options.authToken,
      theme: this.options.theme,
    };
    const baseURL = this.options.baseURL || QUALIFIED_EMBED_BASE_URL;
    this.iframe.src =
      concatUrl(baseURL, "embed", this.challengeId) +
      "?" +
      toQueryParams(params);
  }
}
