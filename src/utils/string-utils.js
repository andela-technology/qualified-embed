import { identity } from "./function-utils";

/**
 * Uppercases the first letter of a string
 * @param {string} str - The string to uppercase the first letter of
 * @returns {string}
 */
export function ucFirst(str) {
  str = String(str);
  return str.length === 0 ? str : str[0].toUpperCase() + str.slice(1);
}

/**
 * A wrapper on String() that coalesces null and undefined values to "" first
 * @param {*} str - The value to call String() on
 * @returns {string}
 */
export function toStringEmpty(str) {
  if (str === null || str === undefined) {
    return "";
  } else {
    return String(str);
  }
}

/**
 * Adds enough leading '0' to ensure the string is the expected width
 * @param {*} n - Number to pad
 * @param {number} len - Minimum length of the new string (defaults to 2)
 * @returns {string}
 */
export function padNum(n, len = 2) {
  const s = toStringEmpty(n);
  return "0".repeat(Math.max(0, len - s.length)) + s;
}

/**
 * Joins `parts` on slashes, stripping leading and trailing
 * slashes from each part and coalescing null and undefined
 * values to "" before doing the final join
 * @param {...any} parts - the values to join
 * @returns {string}
 */
export function concatUrl(...parts) {
  const leadingTrailingSlashes = /^\/+|\/+$/g;
  return parts
    .map((p) => toStringEmpty(p).replace(leadingTrailingSlashes, ""))
    .filter(identity)
    .join("/");
}

/**
 * Converts an object to key1=value1&key2=value2 encoded URI pairs.
 * Omits any entries with falsey values.
 * @param {Object.<string, *>} params - The object containing key-value pairs
 * @returns {string} - The encoded URI pairs
 */
export function toQueryParams(params) {
  return Object.keys(params)
    .filter((k) => params[k])
    .map((k) => `${k}=${encodeURIComponent(params[k])}`)
    .join("&");
}
