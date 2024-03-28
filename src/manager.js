import { noop } from './utils/function-utils';
import { QualifiedEmbeddedChallenge } from './embedded-challenge';
import { docReady } from './utils/dom-utils';
import { QUALIFIED_EMBED_DEFAULT_SELECTOR } from './constants';

function _checkDestroyed(manager) {
	if(manager.$$destroyed) {
		throw new Error('This manager has been destroyed, please create a new one');
	}
}

/**
 * Manager for working with multiple embedded Qualified challenges. [See Embedding Challenges tutorial for usage.]{@tutorial challenges}
 *
 * If you are only creating a single challenge, it might be easier to use
 * [new QualifiedEmbeddedChallenge()]{@linkcode QualifiedEmbeddedChallenge} directly.
 *
 * @class
 * @tutorial challenges
 */
export class QualifiedEmbedManager {

	/**
	 * Creates a new Qualified Embed Manager.
	 * @param {*} config Configuration to pass into the manager. See the {@link QualifiedEmbedManager} constructor
	 * for configuration options.
	 *
	 * @returns {QualifiedEmbedManager} Object that can be used to create, update, and destroy embedded challenges.
	 */
	static init(config) {
		return new QualifiedEmbedManager(config);
	}

	/**
	 * Creates a new Qualified Embed Manager.
	 * @param {Object} config
	 * @param {Function?} config.onLoaded - Callback for when the editor has loaded and is ready for solving. See {@link ChallengeOptions#onLoaded} for callback arguments.
	 * @param {Function?} config.onChange - Callback with changes any time an embedded challenge solution is modified. See {@link ChallengeOptions#onChange} for callback arguments.
	 * @param {Function?} config.onRunStart - Called when a run is started (internally or externally). See {@link ChallengeOptions#onRunStart} for callback arguments.
	 * @param {Function?} config.onRun - Callback with the results when any embedded challenge is run against tests. See {@link ChallengeOptions#onRun} for callback arguments.
	 * @param {(boolean|string)?} config.autoCreate - If truthy, automatically configure any nodes matching the provided selector or [data-qualified-embed] if not a string.
	 *        When using autoCreate, the challenge ID is found via the node property data-qualified-embed. Additional options can be passed in via challengeOptions.
	 * @param {(ChallengeOptions)?} config.options - Default options for new embedded challenges.
	 * @param {Object?} config.challengeOptions - Hash of options to be passed in when injecting an editor. The key should be the challenge ID.
	 * @param {ChallengeOptions} config.challengeOptions. - Unique options for each challenge.
	 *
	 * @constructor
	 */
	constructor({
		onLoaded = noop,
		onRun = noop,
		onRunStart = noop,
		onChange = noop,
		autoCreate = false,
		options = {},
		challengeOptions = {},
	} = {}) {
		this.onLoaded = onLoaded;
		this.onRun = onRun;
		this.onRunStart = onRunStart;
		this.onChange = onChange;
		/**
		 * List of editors created on this manager.
		 * @type Array.<QualifiedEmbeddedChallenge>
		 */
		this.editors = [];
		/**
		 * Shared options for new editors
		 * @type ChallengeOptions
		 */
		this.options = options;

		/**
		 * Challenge-specific options for new embedded challenge editors.
		 * @type Object
		 * @property {ChallengeOptions} challengeId - Options to be set when creating an editor using <code>challengeId</code> as a key.
		 */
		this.challengeOptions = challengeOptions;

		if(autoCreate) {
			docReady(() => {
				const selector = typeof autoCreate === 'string' ? autoCreate : QUALIFIED_EMBED_DEFAULT_SELECTOR;
				Array.from(document.querySelectorAll(selector)).forEach(node => {
					this.createEditor({ node });
				});
			});
		}
	}

	/**
	 * Returns an existing editor via the node OR the challenge ID. If no editor is found, returns `false`.
	 * @param {Object} searchKeys
	 * @param {HTMLElement?} searchKeys.node - Node the editor was created on (preferred).
	 * @param {string?} searchKeys.challengeId - Challenge ID currently in use within an editor.
	 *
	 * @returns {(QualifiedEmbeddedEditor|boolean)} Challenge editor, or false if no editor was found.
	 */
	findEditor({ node, challengeId } = {}) {
		_checkDestroyed(this);

		// Note: we are looking via node separately to prioritize matching the node over challenge ID.
		return (node && this.editors.find(editor => editor.node === node)) ||
			(challengeId && this.editors.find(editor => editor.challengeId === challengeId)) ||
			false;
	}

	/**
	 * Creates or updates a challenge editor. If an existing editor is found via node or challenge ID, then that
	 * editor is returned after updating it with any new options and/or the different challenge ID.
	 *
	 * @param {Object} config
	 * @param {HTMLElement} config.node - DOM node to use as basis for the injection. Will be used directly if an iFrame, otherwise an iFrame will get appended to this node.
	 * @param {string?} config.challengeId - Challenge ID for this editor. If not provided, will attempt to be found via the node's <code>data-qualified-embed</code> attribute.
	 * @param {ChallengeOptions?} config.options - Additional options for this editor, mixed with challenge-specific and shared options on the manager object.
	 * @returns {QualifiedEmbeddedChallenge} Existing or newly created challenge editor
	 */
	createEditor({ node, challengeId = null, options = {} } = {}) {
		_checkDestroyed(this);

		const editor = this.updateEditor({ node, challengeId, options });

		return editor || new QualifiedEmbeddedChallenge({
			manager: this,
			node,
			challengeId,
			options,
		});
	}

	/**
	 * Updates an existing challenge editor, looking it up via node or challenge ID.
	 *
	 * @param {Object} config
	 * @param {HTMLElement?} config.node - DOM node to use as basis for the injection.
	 * @param {string?} config.challengeId - Challenge ID currently used on the editor.
	 * @param {ChallengeOptions?} config.options - Updated options to set on the editor.
	 * @returns {(QualifiedEmbeddedChallenge|boolean)} Challenge editor, or false if no editor was found.
	 */
	updateEditor({ node, challengeId = null, options = {} } = {}) {
		_checkDestroyed(this);

		const editor = this.findEditor({ node, challengeId });
		if(editor) {
			editor.update({ challengeId, options });
		}
		return editor || false;
	}

	/**
	 * Destroy this manager and all embedded challenges and event listeners created through it.
	 */
	destroy() {
		if(this.$$destroyed) return;

		this.$$destroyed = true;

		this.editors.forEach(editor => {
			editor.destroy();
		});
		this.editors = null;
	}
}
