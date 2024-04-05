import { AbstractEmbed } from "./abstract-embed";
import { QUALIFIED_EMBED_BASE_URL } from "./constants";
import { concatUrl } from "./utils/string-utils";
import { obfuscateId } from "./id-obfuscation";

/**
 * Represents a single embedded full assessment. [See Embedding Assessments tutorial for usage.]{@tutorial assessments}
 *
 * @class
 * @extends AbstractEmbed
 * @tutorial assessments
 */
export class QualifiedEmbeddedAssessment extends AbstractEmbed {
  /**
   * Creates a new embedded assessment.
   *
   * If this assessment is created with `config.node` being an `IFRAME`, then that IFRAME is used directly.
   * Otherwise, the assessment will inject a new IFRAME as a child of the `node` passed in.
   *
   * @param {Object} config
   * @param {HTMLElement} config.node - DOM node to use as basis for the injection. Will be used directly if an iFrame, otherwise an iFrame will get appended to this node.
   * @param {AssessmentOptions} config.options - Options for this editor.
   *
   * @constructor
   */
  constructor({ node, options }) {
    super({ node });

    if (!options || !options.invitePath || !options.authToken) {
      throw new Error(
        "Unable to load an assessment without invitePath and authToken",
      );
    }

    this._type = "assessment";

    /**
     * Options on the current editor
     * @type AssessmentOptions
     */
    this.options = Object.assign({}, options);

    this._updateIframe();

    /**
     * Contains information about the loaded assessment, set after {@link AssessmentOptions#onLoaded}.
     * @type AssessmentOptions~LoadData
     */
    this.assessmentData = {};

    this._initPenpal([
      "ready",
      "error",
      "loaded",
      "updated",
      "solutionUpdated",
      "submitted",
    ]);
  }

  /**
   * Goes to the next challenge or review screen (if possible)
   */
  next() {
    return this._post("next");
  }

  /**
   * Goes to the previous challenge or welcome screen (if possible)
   */
  previous() {
    return this._post("previous");
  }

  /**
   * Goes to the welcome screen if possible.
   */
  welcome() {
    return this.switchChallenge("welcome");
  }

  /**
   * Goes to the review screen if possible.
   */
  review() {
    return this.switchChallenge("review");
  }

  /**
   * Submits the assessment. Will automatically switch to the review screen.
   */
  submit() {
    return this._post("submit");
  }

  /**
   * Switches to a specific challenge, challenge index, welcome screen, or review screen, if possible.
   *
   * If passed in a number, `0` means the welcome screen, `1...n` is a given challenge, and `n+1` is the review screen.
   *
   * You can pass in `'welcome'` or `'review'` to go to those screens directly, or any challenge ID to go to that challenge.
   *
   * @param {string|number} challengeId - If a number, switches to that screen or challenge by index. If a string, attempts to switch by ID.
   * @returns {Promise} The promise will reject if unable to find a matching stage.
   */
  switchChallenge(challengeId) {
    return this._post("switchChallenge", challengeId);
  }

  /**
   * Updates the iframe with new options, or reloads the iframe if the challenge ID has changed.
   *
   * @param {Object} config
   * @param {AssessmentOptions?} config.options - Update the options for this editor (mixed in with the current ones).
   * @param {boolean?} config.reload - If true, force a reload even if the challenge ID hasn't changed.
   */
  update({ options = null, reload = false } = {}) {
    if (this.$$destroyed) return;
    let changed = false;
    if (options) {
      changed =
        options.invitePath && options.invitePath !== this.options.invitePath;
      Object.assign(this.options, options);
    }
    if (reload || changed) {
      // trigger a full reload of the iframe
      this._updateIframe();
    } else {
      this._sendOptions();
    }
  }

  /**
   * Reloads the editor. This could result in a loss of data.
   */
  reload() {
    this._updateIframe();
  }

  //// Protected Methods

  /**
   * An internally used handler to configure a newly loaded iframe.
   *
   * @protected
   * @ignore
   */
  onReady() {
    this._sendOptions();
  }

  /**
   * An internally used handler to configure a newly loaded iframe.
   *
   * @protected
   * @ignore
   */
  onLoaded({ data }) {
    this.assessmentData = data;
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

    const baseURL = this.options.baseURL || QUALIFIED_EMBED_BASE_URL;

    // obfuscate invite path to prevent it from being opened outside the embed
    const embedPath = this.options.invitePath.replace(
      /^(\/assess\/)([a-fA-F0-9]{24})/,
      (_, path, assessmentId) => {
        const embedId = "QE" + obfuscateId(assessmentId);
        return `${path}${embedId}`;
      },
    );

    this.iframe.src = concatUrl(baseURL, embedPath);
  }
}
