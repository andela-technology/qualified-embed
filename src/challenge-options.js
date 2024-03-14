/* eslint-disable no-unused-vars */
/**
 * The available options for a challenge options hash.
 * @type Object
 * @interface
 */
export const ChallengeOptions = {
	/**
	 * The `authToken` value from an [AssessmentInvitation](https://docs.qualified.io/integrations/custom-integrations/api/#assessment-invitations). This token allows a
	 * candidate to solve an embedded challenge and save the results back as a normal assessment.
	 *
	 * This property is not used if the challenge is not storing the results back on an assessment result.
	 *
	 * @name ChallengeOptions#authToken
	 * @type string
	 */
	authToken: undefined,

	/**
	 * The unique embed client key value set on your team.
	 *
	 * @name ChallengeOptions#embedClientKey
	 * @type string
	 */
	embedClientKey: undefined,

	/**
	 * For embedded challenges with an [authToken]{@linkcode ChallengeOptions#authToken}, this automatically starts the
	 * assessment and creates the solution when the embedded editor loads.
	 *
	 * When `false` (the default), the user will need to click a button to start the challenge. This is recommended
	 * on pages with multiple embedded challenges, otherwise start times won't be very useful.
	 *
	 * When the `mode` is `readonly` or `restricted`, this option is ignored.
	 *
	 * @name ChallengeOptions#autoStart
	 * @type boolean
	 */
	autoStart: false,

	/**
	 * Enables setting up the editor in different read-only modes.
	 *
	 * * `null` The default, normal mode with full editing and saving.
	 * * `"restricted"` Means you can edit the code, but changes will never be saved, or sent back to the parent
	 *   window.
	 * * `"readonly"` Means you cannot edit the code at all. Useful for reviewing-only, without making changes.
	 *   This also disables running code.
	 * * `"runonly"` is identical to `"readonly"`, except that tests can be run, either programmatically with `runTests()` and `attempt()`, or through the Run and Submit buttons in the Embed UI (the UI buttons can be hidden with the `"hideActions"` option).
	 *
	 * @name ChallengeOptions#mode
	 * @type (null|"readonly"|"restricted"|"runonly")
	 */
	mode: undefined,

	/**
	 * Language to use on classic code challenges. This is recommended for multi-language challenges, as the user
	 * is not provided a way to change the language within the editor.
	 *
	 * You can provide your own list of available languages using the results from the
	 * {@link ChallengeOptions#onLoaded} callback event.
	 *
	 * @name ChallengeOptions#language
	 * @type string
	 */
	language: undefined,

	/**
	 * Force the theme for this editor (one of `light` or `dark`). Leave unset to let the user select their own theme
	 * from the `idesettings` tab.
	 *
	 * @name ChallengeOptions#theme
	 * @type (null|"light"|"dark")
	 * @default "light"
	 */
	theme: undefined,

	/**
	 * Comma-delimited list of tabs to hide by tab ID or file path, overrides {@link ChallengeOptions#showTabs}.
	 *
	 * @see {@link TAB_IDS} for a list of common tab IDs.
	 *
	 * @name ChallengeOptions#hideTabs
	 * @type string
	 */
	hideTabs: '',

	/**
	 * Comma-delimited list of tabs to show by tab ID or file path. When this is set, the default state is to show
	 * _no_ tabs at all.
	 *
	 * @see {@link TAB_IDS} for a list of common tab IDs.
	 *
	 * @name ChallengeOptions#showTabs
	 * @type string
	 */
	showTabs: '',

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
	 * or set the value of `hideActions` to `runTests`. Simply hiding the tab will not disable the button, which could
	 * be used if you want to configure an external editor.
	 *
	 * @name ChallengeOptions#hideActions
	 * @type (boolean|"attempt"|"runTests")
	 * @default false
	 */
	hideActions: false,

	/**
	 * Override the default layout for the challenge. This does not replace {@link ChallengeOptions#hideTabs} or
	 * {@link ChallengeOptions#showTabs}, which are still used to define tab visibility. Visible tabs that are not
	 * listed in `initialLayout` are left in their default positions.
	 *
	 * The first tab in each section will be the "active" tab when the editor loads.
	 *
	 * @see {@link TAB_IDS} for a list of common tab IDs.
	 *
	 * @name ChallengeOptions#initialLayout
	 * @type Object
	 * @property {string[]} topLeft - List of tab IDs or file paths for the top left section of the editor. <br/>Defaults to any editable files.
	 * @property {string[]} topRight - List of tab IDs or file paths for the top right section of the editor. <br/>Defaults to all other tabs.
	 * @property {string[]} bottomLeft - List of tab IDs or file paths for the bottom left section of the editor. <br/>Defaults to empty, and not recommended for smaller challenges.
	 * @property {string[]} bottomRight - List of tab IDs or file paths for the bottom right section of the editor. <br/>Defaults to empty, and not recommended for smaller challenges.
	 */
	initialLayout: {
		topLeft: [],
		topRight: [],
		bottomLeft: [],
		bottomRight: [],
	},

	/**
	 * Sets the initial solution values on the challenge. Note that this will only be processed when the challenge
	 * is first loaded, and if there isn't an existing solution.
	 *
	 * To change the solution content later, please use {@link QualifiedEmbeddedChallenge#setFileContents}.
	 *
	 * @name ChallengeOptions#initialFiles
	 * @type Object
	 * @property {string} (path) Contents of each file. Use the file path as the key for project challenges, or `code` and `testcases` for classic challenges.
	 */
	initialFiles: {},

	/**
	 * Sets the initial cursor position. Note that this will only be processed when the challenge
	 * is first loaded, and if there isn't an existing solution.
	 *
	 * To change the cursor position later, please use {@link QualifiedEmbeddedChallenge#setFileContents}.
	 *
	 * @name ChallengeOptions#initialCursor
	 * @type ChallengeOptions~Cursor
	 */
	initialCursor: null,

	/**
	 * Provides an initial run result, which should be the `eventData.data` returned from
	 * {@link ChallengeOptions#onRun}, {@link QualifiedEmbeddedChallenge#runTests}, or
	 * {@link QualifiedEmbeddedChallenge#attempt}.
	 *
	 * This can include the `fileData` property, which will configure the entire solution at once. If
	 * {@link ChallengeOptions#initialFiles} or {@link ChallengeOptions#initialCursor} are provided, they will
	 *  overwrite the values in `fileData`.
	 *
	 *  @name ChallengeOptions#initialRunResult
	 *  @type ChallengeOptions~RunResult
	 */
	initialRunResult: null,

	/**
	 * If provided, automatically saves and restores the contents of the challenge in `localStorage` using the given
	 * id as a key. This will also restore the last cursor position.
	 *
	 * The data will automatically be serialized using the `challengeId` so you can use the same `localStorageId` value
	 * for the entire page of challenges (or even across multiple pages).
	 *
	 * **Note 1:** Using this feature will override anything set in {@link ChallengeOptions#initialFiles}. If you want to
	 * replace the localStorage contents, you"ll need to call {@link QualifiedEmbeddedChallenge#setFileContents} using
	 * the {@link ChallengeOptions#onLoaded} event callback.
	 *
	 * **Note 2:** The solution data will be stored on the domain of the parent frame, _not_ on qualified.io. Also, the
	 * embed will **never delete** this data, so it is up to the outer page to manage it's `localStorage`.
	 *
	 * @name ChallengeOptions#localStorageId
	 * @type string
	 */
	localStorageId: '',

	/**
	 * Override the base URL for testing and debugging.
	 *
	 * @name ChallengeOptions#baseURL
	 * @type string
	 */
	baseURL: null,

	/**
	 * Callback for when the editor has loaded.
	 *
	 * This callback is always called at least once, and can be called multiple times.
	 *
	 * * Before a solution is created (when provided an `authToken`), it will be called with `started` set to `false`.
	 * * It will always be called when the editor is ready to solve, with `started` set to `true`. This may be the
	 *   first time it's called.
	 * * It will also be called again if there are changes that affect the challenge details, such as changing the
	 *   `challengeId`, or the solution language.
	 *
	 * @method ChallengeOptions#onLoaded
	 *
	 * @param {Object} eventData
	 * @param {QualifiedEmbedManager} eventData.manager - Manager for this event
	 * @param {QualifiedEmbeddedChallenge} eventData.editor - Editor for this event
	 * @param {string} eventData.challengeId - Challenge ID of the editor for this event
	 * @param {ChallengeOptions~LoadData} eventData.data - Information about the challenge, will also be stored in {@link QualifiedEmbeddedChallenge#challengeData} for future access.
	 */
	onLoaded(eventData) {},

	/**
	 * Callback with changes any time an embedded challenge solution is modified. It is also called when the solution
	 * is initially set up.
	 *
	 * When the `mode` is `readonly`, `runonly` or `restricted`, this callback is not triggered.
	 *
	 * @method ChallengeOptions#onChange
	 *
	 * @param {Object} eventData
	 * @param {QualifiedEmbedManager} eventData.manager - Manager for this event
	 * @param {QualifiedEmbeddedChallenge} eventData.editor - Editor for this event
	 * @param {string} eventData.challengeId - Challenge ID of the editor for this event
	 * @param {ChallengeOptions~FileContentsData} eventData.data - File Change Data
	 */
	onChange(eventData) {},

	/**
	 * Called when a run is started (internally or externally).
	 *
	 * Note: if you want to better link run start to run results, it might be easier to use
	 * {@link QualifiedEmbeddedChallenge#runTests} and {@link QualifiedEmbeddedChallenge#attempt} directly, and disable the
	 * internal buttons. This allows you to link the start with the result, as those methods return a
	 * promise on completion.
	 *
	 *
	 * @method ChallengeOptions#onRunStart
	 *
	 * @param {Object} eventData
	 * @param {QualifiedEmbedManager} eventData.manager - Manager for this event
	 * @param {QualifiedEmbeddedChallenge} eventData.editor - Editor for this event
	 * @param {string} eventData.challengeId - Challenge ID of the editor for this event
	 * @param {"test"|"attempt"} eventData.data.type - Type of run
	 * @param {ChallengeOptions~FileContentsData} eventData.data.fileData - File data at beginning of run
	 */
	onRunStart(eventData) {},

	/**
	 * Callback with the results when any embedded challenge is run against tests, or classic code is attempted.
	 *
	 * @method ChallengeOptions#onRun
	 *
	 * @param {Object} eventData
	 * @param {QualifiedEmbedManager} eventData.manager - Manager for this event
	 * @param {QualifiedEmbeddedChallenge} eventData.editor - Editor for this event
	 * @param {string} eventData.challengeId - Challenge ID of the editor for this event
	 * @param {ChallengeOptions~RunResult} eventData.data Results of the code run
	 */
	onRun(eventData) {},
};

/**
 * Data about the loaded challenge, solution, and more. Can be useful for rendering options for the candidate, such as language selection.
 *
 * @typedef ChallengeOptions~LoadData
 * @property {string} error - If set, there was an error loading the challenge (invalid ID or restrictions)
 * @property {boolean} started - True if the editor is ready to solve.
 * @property {string} solutionId - If there's an assessment result, this will be the ID of the solution for this challenge.
 * @property {string} solutionLanguage - For Classic Code challenges, this is the current language being used for solving.
 * @property {string} type - Type of challenge (<code>"CodeChallenge"</code> or <code>"AdvancedCodeChallenge"</code>)
 * @property {string} title - Title of challenge
 * @property {string} summary - Summary text on challenge, in Markdown
 * @property {Array<string>} languages - List of languages available on the challenge
 * @property {Array<string>} availableTabs - List of [tabs available]{@linkplain TAB_IDS} on the challenge (for hideTabs or showTabs)
 * @property {ChallengeOptions~FileContentsData} fileData - Current file contents (if available)
 */

/**
 * File contents data
 *
 * @typedef ChallengeOptions~FileContentsData
 * @property {Object} files - Hash of file name or path to file contents to be set on the challenge solution.
 * @property {string} files.(path) - Contents of each file. Use the file path as the key for project challenges, or `code` and `testcases` for classic challenges.
 * @property {ChallengeOptions~Cursor} cursor - Contains information about where the cursor is at the time of the event.
 */

/**
 * Cursor tracking data.
 *
 * @typedef ChallengeOptions~Cursor
 * @property {string} path - Path to file. For classic code challenges, this will be <code>code</code> or <code>testcases</code>
 * @property {number} line - Line number
 * @property {number} ch - Character number
 */

/**
 * Result of a code run. This is only a subset of the properties available.
 *
 * @typedef ChallengeOptions~RunResult
 * @property {"test"|"attempt"} type - Type of run (always `"test"` for project challenges)
 * @property {ChallengeOptions~FileContentsData} fileData - The solution files at the time of the attempt
 * @property {Object} flags
 * @property {boolean} flags.success - True if the code was run without error
 * @property {boolean} flags.passed - True if the solution passed all tests
 * @property {boolean} flags.executionFailure - True if unable to run the code
 * @property {boolean} flags.timeout - True if the tests did not run within the allotted time
 * @property {number} wallTime - running time for the code
 * @property {Object} result - Details of the run result
 */
