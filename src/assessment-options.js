/* eslint-disable no-unused-vars */
/**
 * The available options for an assessment options hash.
 * @type Object
 * @interface
 */
export const AssessmentOptions = {
  /**
   * Unique `invitePath` for this assessment retrieved from the
   * [AssessmentInvitation API](https://docs.qualified.io/integrations/custom-integrations/api/#assessment-invitations).
   *
   * Note: The invite path will be modified to provide a more secure integration to the embedded assessment. If the
   * candidate attempts to open the iframe in a new tab, it will not work as a standalone assessment.
   *
   * @name AssessmentOptions#invitePath
   * @type {string|undefined}
   */
  invitePath: undefined,

  /**
   * The `authToken` value from an [AssessmentInvitation](https://docs.qualified.io/integrations/custom-integrations/api/#assessment-invitations). This token is required
   * to enable to candidate to gain access to the embedded assessment.
   *
   * @name AssessmentOptions#authToken
   * @type {string|undefined}
   */
  authToken: undefined,

  /**
   * The unique embed client key value set on your team.
   *
   * @name AssessmentOptions#embedClientKey
   * @type {string|undefined}
   */
  embedClientKey: undefined,

  /**
   * Override the base URL for testing and debugging.
   *
   * @name AssessmentOptions#baseURL
   * @type {string|null}
   */
  baseURL: null,

  /**
   * Enables setting up the editor in different read-only modes.
   *
   * * `null` or `"normal"` The default, normal mode with full editing and saving.
   * * `"restricted"` Means you can edit the code, but changes will never be saved, or sent back to the parent
   *   window.
   * * `"readonly"` Means you cannot edit the code at all. Useful for reviewing-only, without making changes.
   *   This also disables running code.
   *
   * **Note 1:** This feature works in conjunction with the property `editMode` set on the assessment itself via the API.
   * If this property is set, the embedded editor can only make the assessment _more_ restricted, it cannot make it
   * editable again.
   *
   * **Note 2:** If the assessment is normally editable, this feature only prevents saving changes at the client-level.
   * It's still possible for a very clever user to make changes by accessing the API directly. It should not be
   * considered a security feature.
   *
   * @name AssessmentOptions#mode
   * @type {null|"normal"|"readonly"|"restricted"|"runonly"}
   */
  mode: undefined,

  /**
   * The entire assessment navigation sidebar will not be shown. This also includes timer information.
   *
   * Not recommended unless you are planning on recreating the built-in navigation externally.
   *
   * @name AssessmentOptions#hideSidebar
   * @type {boolean|undefined}
   */
  hideSidebar: undefined,

  /**
   * If true, the welcome screen is not shown at the beginning, and the assessment is auto-started immediately upon
   * loading.
   *
   * @name AssessmentOptions#hideWelcome
   * @type {boolean|undefined}
   */
  hideWelcome: undefined,

  /**
   * If true, the review screen is not shown in the sidebar. It will still be shown after submission, or if the
   * assessment becomes non-editable (post-submission or timeout).
   *
   * **NOTE:** The assessment will not be submittable within the assessment editor! You must submit the assessment
   * via {@link QualifiedEmbeddedAssessment.submit()}, an API call, or using timed assessments.
   *
   * @name AssessmentOptions#hideReview
   * @type {boolean|undefined}
   */
  hideReview: undefined,

  /**
   * Callback for when the editor has loaded.
   *
   * This callback is always called at least once, and can be called multiple times.
   *
   * * Before an assessment result is found, it will be called with `started` set to `false`.
   * * It will always be called when the assessment is ready to solve, with `started` set to `true`.
   *
   * @method AssessmentOptions#onLoaded
   *
   * @param {Object} eventData
   * @param {QualifiedEmbeddedAssessment} eventData.assessment - Embedded Assessment for this event
   * @param {AssessmentOptions.LoadData} eventData.data - Information about the assessment, will also be stored in {@link QualifiedEmbeddedAssessment#assessmentData} for future access.
   */
  onLoaded(eventData) {},

  /**
   * Callback whenever the assessment result is updated (active challenge changed, score updated, etc).
   *
   * @method AssessmentOptions#onUpdated
   *
   * @param {Object} eventData
   * @param {QualifiedEmbeddedAssessment} eventData.assessment - Embedded Assessment for this event
   * @param {AssessmentOptions.LoadData} eventData.data - Information about the assessment, will also be stored in {@link QualifiedEmbeddedAssessment#assessmentData} for future access.
   */
  onUpdated(eventData) {},

  /**
   * Callback as the candidate makes changes to a solution (runs code, answers questions, etc)
   *
   * @method AssessmentOptions#onSolutionUpdated
   *
   * @param {Object} eventData
   * @param {QualifiedEmbeddedAssessment} eventData.assessment - Embedded Assessment for this event
   * @param {AssessmentOptions.ChallengeData} eventData.data - Information about the current challenge & solution
   */
  onSolutionUpdated(eventData) {},

  /**
   * Callback with the results once the assessment has been submitted.
   *
   * @method AssessmentOptions#onSubmitted
   *
   * @param {Object} eventData
   * @param {QualifiedEmbeddedAssessment} eventData.assessment - Embedded Assessment for this event
   * @param {AssessmentOptions.SubmissionResult} eventData.data Results of the submission
   */
  onSubmitted(eventData) {},

  /**
   * Callback when there is an unrecoverable error.
   *
   * @method AssessmentOptions#onError
   *
   * @param {Object} eventData
   * @param {QualifiedEmbeddedAssessment} eventData.assessment - Embedded Assessment for this event
   * @param {AssessmentOptions.ErrorData} eventData.data - Information about the error.
   */
  onError(eventData) {},
};

/**
 * Data about the loaded assessment, challenges, and more.
 *
 * @typedef AssessmentOptions.LoadData
 * @property {AssessmentOptions.ErrorData} error - If set, there was an error loading the challenge (invalid ID or restrictions)
 * @property {string} assessmentId - ID of the loaded assessment
 * @property {string} title - Title of assessment
 * @property {string} summary - Summary text on assessment, in Markdown
 * @property {string|null} assessmentResultId - ID of the current assessment result, or `null` if no assessment result
 * @property {boolean} started - True if the assessment is being solved.
 * @property {boolean} submitted - True if the assessment has been submitted.
 * @property {string} startedAt - Time when assessment was started as an ISO string. Can be used to set up an external timer.
 * @property {number} timeLimit - If a number greater than `0`, strict time limit in seconds. Otherwise, no time limit.
 * @property {string} cutOffTime - If there's a time limit, the ISO string for when that time will end.
 * @property {number} score - current score on the assessment (as seen by the candidate)
 * @property {Array<AssessmentOptions.ChallengeData>} challenges - Array of challenge details on the assessment
 * @property {number} stageIndex - Number of the active challenge, or -1 if not on a challenge
 * @property {string} stageId - ID of the active challenge if on a challenge
 */

/**
 * Data about a specific challenge
 *
 * @typedef AssessmentOptions.ChallengeData
 * @property {string} id - Challenge or Stage ID
 * @property {number} index - Index of challenge or stage
 * @property {string} title - Challenge or Stage title
 * @property {string} type - Challenge type
 * @property {string} summary - Challenge summary
 * @property {boolean} started - True if the challenge has been started
 * @property {boolean} attempted - True if the candidate has answered a question or attempted to run their code
 * @property {boolean} completed - True if the candidate has answered all questions or passed all example tests
 * @property {number} score - Current score for this challenge as seen by the candidate. This is not the actual
 *     score used to evaluate the candidate.
 * @property {string} solutionId - ID of solution if we have one
 * @property {string} solutionLanguage - If a code challenge, the language being used to solve
 */

/**
 * Data about the submission. This is only the same data visible to the candidate, so it does not include detailed
 * scoring or detailed results.
 *
 * If you want to see the actual scored results, you'll want to use the API or WebHooks to receive this data.
 *
 * @typedef AssessmentOptions.SubmissionResult
 * @property {string} assessmentId - ID of the loaded assessment
 * @property {string} assessmentResultId - ID of the current assessment result
 * @property {number} score - Current "score" on the assessment as seen by the candidate. This is not the actual
 *     score used to evaluate the candidate.
 * @property {Array<AssessmentOptions.ChallengeData>} challenges - Array of challenge details on the assessment
 * @property {boolean} timerRanOut - If true, the timer ran out (causing automatic submission)
 * @property {number} solutionsStarted - Number of solutions started
 * @property {number} solutionsAttempted - Number of solutions attempted (submitted at least once)
 * @property {number} solutionsCompleted - Number of solutions that were fully completed (passed all example tests or answered all questions)
 */

/**
 * Information about errors that may occur, including unhandled JavaScript errors or network errors.
 *
 * @typedef AssessmentOptions.ErrorData
 * @property {ERROR_CONTEXTS} context - Provides a context for the error
 * @property {string} message - For JavaScript errors, the message of the error
 * @property {string} status - For network errors, the status code
 * @property {string} statusText - For network errors, the status text
 * @property {string} data - For network errors, the returned network data
 * @property {string} data.reason - For 40x errors, the reason provided by the server for the error
 */

/**
 * Error Contexts
 * @readonly
 * @enum {string}
 */
const ERROR_CONTEXTS = {
  /** An error that occurred before the candidate can start the assessment */
  load: "load",
  /** A repeated error saving the solution */
  saveSolution: "saveSolution",
  /** A repeated error submitting a project challenge solution */
  submitSolution: "submitSolution",
  /** A repeated error submitting the entire assessment */
  submitAssessment: "submitAssessment",
};

// Note: JSDoc cannot handle exporting an enum directly, so it has to be separate like this.
export const ERROR_CONTEXT = ERROR_CONTEXTS;
