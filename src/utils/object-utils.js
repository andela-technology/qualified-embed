/**
 * Recursively creates a safe version of an object by removing
 * functions and recursively transforming arrays and objects
 * into safe versions.
 * @param {*} data - The data to make safe
 * @returns {*} - The safe version of the data
 */
export function toSafeObject(data) {
  let newData = data;
  if (typeof data === "function") {
    newData = undefined;
  } else if (Array.isArray(data)) {
    newData = data.map(toSafeObject);
  } else if (typeof data === "object") {
    newData = {};
    let keys = Object.keys(data);
    // if there are no enumerable keys, try non-enumerable ones
    if (!keys.length) keys = Object.getOwnPropertyNames(data);
    keys.forEach((k) => {
      newData[k] = toSafeObject(data[k]);
    });
  }
  return newData;
}
