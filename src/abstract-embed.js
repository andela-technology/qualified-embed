import { ucFirst } from "./utils/string-utils";
import { connectToChild } from "penpal";
import { remove } from "./utils/array-utils";
import { toSafeObject } from "./utils/object-utils";

/**
 * @typedef {import('./manager').QualifiedEmbedManager} QualifiedEmbedManager
 */

/**
 * Base class for embedded challenges and assessments
 * @class
 * @abstract
 * @ignore
 */
export class AbstractEmbed {
  /**
   * @param {{ node: (HTMLElement | HTMLIFrameElement | null) & { QualifiedEmbed?: any } }} options
   */
  constructor({ node }) {
    if (!node) {
      throw new Error("Cannot create an embedded editor without a node");
    }
    /**
     * Node assigned to this editor. As a convenience, this node will have the property `QualifiedEmbed` set to
     * this editor, so you can reference this editor via `node.QualifiedEmbed`.
     *
     * @type {HTMLElement|null}
     * @public
     */
    this.node = node;

    try {
      // enable direct access via the node object
      node.QualifiedEmbed = this;
    } catch (err) {
      /* ignore errors */
    }

    /** @type {QualifiedEmbedManager|null} */
    this.manager = null;

    /**
     * @typedef {Object} Methods
     * @property {Function} [loaded] - Function to be called when the abstract embed is loaded.
     * @param {Object} data - Data object passed when the embed is loaded.
     * @returns {void}
     */

    /** @type {Methods|null} */
    this.childMethods = null;

    /** @type {"assessment"|null} */
    this._type = null;

    if (node.nodeName === "IFRAME") {
      /**
       * IFRAME node for this editor. May be the same as `node`
       * @type {HTMLIFrameElement|null}
       * @public
       */
      this.iframe = node;
    } else {
      this.iframe = document.createElement("iframe");
      node.appendChild(this.iframe);
    }

    if (this.iframe) {
      this.iframe.classList.add("qualified-embedded");
    }
  }

  /**
   * Destroys this embed and cleans up any resources associated with it.
   * @public
   */
  destroy() {
    if (this.$$destroyed) return;

    this.$$destroyed = true;

    if (this.manager?.editors) {
      remove(this.manager.editors, this);
    }
    if (this.iframe) {
      // clear src, in case this was the same node
      this.iframe.src = "";
      if (this.iframe !== this.node && this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
      }
    }
    if (this.node) {
      try {
        this.node.QualifiedEmbed = null;
      } catch (err) {
        /* ignore errors */
      }
    }
    if (this.connection) {
      try {
        this.connection.destroy();
      } catch (err) {
        /* ignore errors */
      }
    }
    this.iframe =
      this.node =
      this.manager =
      this.options =
      this.connection =
      this.childMethods =
        null;
  }

  //// Protected Methods

  /**
   * Configures Penpal for cross-frame communication
   * @param {Array<string>} methodNames
   * @param {Array<string>} otherProps
   *
   * @protected
   * @ignore
   */
  _initPenpal(methodNames, otherProps = []) {
    const manager = this.manager;
    /** @type {Methods} */
    const methods = {};
    methodNames.forEach((method) => {
      /**
       * Creates event handlers for method names.
       * @param {*} data - The data to be passed to the method
       * @returns {undefined}
       */
      methods[method] = (data) => {
        const handler = `on` + ucFirst(method);
        const eventProps = {
          [this._type || "editor"]: this,
          data,
        };

        otherProps.forEach((prop) => {
          if (prop in this) {
            const key = /** @type {keyof AbstractEmbed} */ (prop);
            eventProps[prop] = this[key];
          }
        });
        [this, this.options, manager].forEach((obj) => {
          if (obj && typeof obj[handler] === "function") {
            obj[handler](eventProps);
          }
        });
      };
    });

    this.connection = connectToChild({
      iframe: this.iframe,
      timeout: 300_000, // wait for 5 minutes for the connection, then throw an error
      methods,
    });
    this.connection.promise
      .then((/** @type {Methods} */ childMethods) => {
        this.childMethods = childMethods;
      })
      .catch((err) => {
        if (!this.$$destroyed) {
          // Notify of loading errors
          methods.loaded({
            error: err ? err.toString() : "Unknown Connection Error",
            started: false,
          });
        }
      });
  }

  /**
   * Posts to the iframe
   * @param {string} method - Method to call
   * @param {*} [data] - Optional data to pass
   * @returns Promise<any>
   *
   * @protected
   * @ignore
   */
  _post(method, data) {
    if (this.$$destroyed) {
      return Promise.reject(Error("Editor has been destroyed"));
    }
    if (!this.childMethods || !this.childMethods[method]) {
      return Promise.reject(
        Error(`Unable to call method "${method}" on iframe`),
      );
    }
    return this.childMethods[method](toSafeObject(data));
  }
}
