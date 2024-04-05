import { identity } from "./function-utils";

export function ucFirst(str) {
  str = String(str);
  return str.length === 0 ? str : str[0].toUpperCase() + str.slice(1);
}

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

export function concatUrl(...parts) {
  const slashes = /^\/+|\/+$/g;
  return parts
    .map((p) => toStringEmpty(p).replace(slashes, ""))
    .filter(identity)
    .join("/");
}

export function toQueryParams(params) {
  return Object.keys(params)
    .filter((k) => params[k])
    .map((k) => `${k}=${encodeURIComponent(params[k])}`)
    .join("&");
}
