import { padNum } from "./utils/string-utils";

// Because base64 encoding includes URL-unfriendly characters (/, +, and =), we map them
// to URL-safe characters _, -, and ~ (tilde).
// This means we don't have to escape the characters. We also get the benefit of slightly better obfuscation,
// since the value doesn't look as much like a base64 encoding.

/**
 * Maps characters for Base64 encoding.
 * @type {Object.<string, string>}
 */
const base64Map = { "/": "_", "+": "-", "=": "~" };

/**
 * Maps characters for Base64 encoding in reverse.
 * @type {Object.<string, string>}
 */
const base64MapReverse = Object.fromEntries(
  Object.entries(base64Map).map(e => e.reverse())
);

/**
 * Obfuscates a Mongo-DB ObjectID in several steps:
 * 1. The hex string is converted into a binary string by taking 2 hex characters, converting them to an integer,
 *    and getting the charCode for that integer
 * 2. The resulting binary string is base64 encoded using btoa
 * 3. We swap out the unsafe base 64 characters (/, +, =) with URL-safe ones.
 *
 * WARNING: this is only designed to work on ObjectID strings--it expects the string to match /[a-fA-F0-9]/ and have
 * an even number of characters. Odd character counts _will_ break. This input is NOT validated.
 *
 * @param {string} objectID - ObjectID as a string to convert. Should match /[a-fA-F0-9]{24}/. This input is NOT
 * validated.
 *
 * @returns {string} Obfuscated ID.
 */
export function obfuscateId(objectID) {
  return btoa(
    objectID.replace(/.{2}/g, (v) => String.fromCharCode(parseInt(v, 16))),
  ).replace(/[/=+]/g, (v) => base64Map[v]);
}

/**
 * Reverses an obfuscation performed by obfuscateId.
 *
 * @param {string} obfuscatedId - Obfuscated string. Should match /^[-_~a-zA-Z0-9]+$/. The input is not validated,
 * and could throw if it contains invalid characters.
 *
 * @returns {string} Original ID as a hexadecimal string
 */
export function deobfuscateId(obfuscatedId) {
  return atob(obfuscatedId.replace(/[-_~]/g, (v) => base64MapReverse[v]))
    .split("")
    .map((c) => padNum(c.charCodeAt(0).toString(16)))
    .join("");
}
