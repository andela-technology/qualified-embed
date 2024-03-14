import { identity } from './function-utils';
import { isArray, isString } from './type-utils';
import * as StringUtils from './string-utils';

/**
 * Adds an item to an array if it doesn't already exist.
 * @param {Array} array
 * @param {*} item
 */
export function addUnique(array, item) {
	if(!array.includes(item)) {
		array.push(item);
	}
}

/**
 * Adds or removes an item from an array.
 * @param {Array} array
 * @param {*} item - Item to be removed or added. If the item already exists, it will not be added.
 * @param {boolean} add - If truthy, uniquely adds the item to the array.
 */
export function toggle(array, item, add) {
	if(add) {
		addUnique(array, item);
	} else {
		remove(array, item);
	}
}

/**
 * Removes an item from an array if that item is found.
 * @param {Array} array
 * @param {*} item
 * @returns {boolean} True if the item is found.
 */
export function remove(array, item) {
	const i = array.indexOf(item);
	const found = i >= 0;
	if(found) array.splice(i, 1);
	return found;
}

/**
 * Removes any items in an array based on a matcher function. If the matcher function returns true, the item is
 * removed from the array.
 * @param {Array} array
 * @param {Function} matcher - Receives the item, index, and original array. If it returns `true`, the
 *   item is removed from the array.
 */
export function removeMatching(array, matcher) {
	for(let i = array.length - 1; i >= 0; i--) {
		if(matcher(array[i], i, array)) {
			array.splice(i, 1);
		}
	}
}

/**
 * Sorts array value objects by the key or function provided.
 * @param {array} values - Array of values to be sorted
 * @param {function|string} field - First field to sort by
 * @param {function|string?} field2 - Optional second field to sort by
 * @return {array}
 */
export function sortBy(values, field, field2) {
	return Array.from(values).sort((a, b) => {
		const result = sortValue(a, b, field);
		return field2 ? (result || sortValue(a, b, field2)) : result;
	});
}

function sortValue(aObj, bObj, field) {
	let a = aObj && aObj[field];
	let b = bObj && bObj[field];
	if(typeof field === 'function') {
		a = field(aObj);
		b = field(bObj);
	}

	if(typeof a === 'string' || typeof b === 'string') {
		if(a === b) return 0;
		return a < b ? -1 : 1;
	} else {
		return a - b;
	}
}

/**
 * Safely returns a new array without any null or undefined items in it.
 * @param {*} array
 * @return {Array} New array without any null or undefined items in it.
 */
export function compact(array) {
	return empty(array) ? [] : array.filter(v => v !== undefined || v !== null);
}

/**
 * Safely returns a new array without any falsy items in it.
 * @param {*} array
 * @returns {Array} New array without any falsy items in it.
 */
export function compactFalsy(array) {
	return empty(array) ? [] : array.filter(identity);
}

/**
 * Returns true if any of the items in one array occur in another array
 * @param {Array} array - Array 1
 * @param {Array} items - Array 2
 * @returns {boolean} True if an item from Array 2 is in Array 1
 */
export function containsAny(array, items) {
	return items.some(item => array.includes(item));
}

/**
 * Converts an array of values into a comma-delimited, English-correct string
 * @param {Array} array
 * @param {String?} conjunction - Optional text to put between the last two words (defaults to 'and')
 * @returns {string} Sentence
 */
export function toStringSentence(array, conjunction = 'and') {
	if(array.length === 1) {
		return array[0];
	} else if(array.length === 2) {
		return array.join(` ${conjunction} `);
	} else {
		const last = array.pop();
		return `${array.join(', ')} ${conjunction} ${last}`;
	}
}

/**
 * Flattens an array of sub-arrays. Only works 1 level deep by default, pass true as 2nd param to
 * recursively dig deep
 * @param {Array} array
 * @param {boolean} deep - If true, flattens deeply nested arrays
 * @returns {Array} New, flattened array
 */
export function flatten(array, deep) {
	return array.reduce((a, b) => {
		if(isArray(b)) {
			if(b.length > 0) {
				if(deep) {
					b = this.flatten(b);
				}
				return a.concat(b);
			}
		} else {
			a.push(b);
		}
		return a;
	}, []);
}

/**
 * In-place shuffle the values of an array
 * @param {Array} array - Array to shuffle
 * @returns {Array} The now-shuffled array
 */
export function shuffle(array) {
	for(let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const t = array[i];
		array[i] = array[j];
		array[j] = t;
	}
	return array;
}

/**
 * Removes any duplicates from an array, returning a new array.
 * @param {Array} array
 * @param {Function?} finder - Optional function for identifier
 * @returns {Array} New array without duplicates
 */
export function unique(array, finder = identity) {
	const found = {};
	array.forEach(v => {
		const k = finder(v);
		if(!(k in found)) {
			found[k] = v;
		}
	});

	return Object.values(found);
}

export function isIn(val, array) {
	if(!array || !array.length) return true;
	if(!val || !val.length) return false;
	return array.some(v => val.indexOf(v) > -1);
}

export function hasAll(val, array) {
	if(!array || !array.length) return true;
	if(!val || !val.length) return false;
	return array.every(v => val.indexOf(v) > -1);
}

export function sortedIdJoin(array, idKey = 'id', joinChar = ',') {
	return array.map(v => isString(v) ? v : v && v[idKey]).sort().join(joinChar);
}

export function equalById(a, b, idKey = 'id') {
	return sortedIdJoin(a, idKey) === sortedIdJoin(b, idKey);
}

/**
 * Returns true if the provided object is not array-like or has a length of 0
 * @param {*} array
 * @returns {boolean}
 */
export function empty(array) {
	return !array || array.length === 0;
}

/**
 * Inserts new items before an existing element in the provided array, or at the beginning if the item doesn't exist.
 *
 * @param {Array} array
 * @param {*} existing - Element to use as a reference
 * @param {*} newItems - New items to insert
 */
export function insertBefore(array, existing, ...newItems) {
	const idx = array.indexOf(existing);
	if(idx === -1) {
		array.unshift(...newItems);
	} else {
		array.splice(idx, 0, ...newItems);
	}
}

/**
 * Inserts new items after an existing element in the provided array, or at the end if the item doesn't exist.
 *
 * @param {Array} array
 * @param {*} existing - Element to use as a reference
 * @param {*} newItems - New items to insert
 */
export function insertAfter(array, existing, ...newItems) {
	const idx = array.indexOf(existing);
	if(idx === -1) {
		array.push(...newItems);
	} else {
		array.splice(idx + 1, 0, ...newItems);
	}
}

/**
 * Searches an array of strings, and returns the items that match, ordered by how close to the first letter
 * the query was found
 * @param {Array} strings
 * @param {String} query
 * @returns {Array} Sorted, filtered array of strings
 */
export function queryStrings(strings, query) {
	return strings
		// map to array of [tag, index]
		.map(tag => ({ tag, match: tag.toLowerCase().indexOf(query.toLowerCase()) }))
		// remove any unmatched items
		.filter(ta => ta.match !== -1)
		// sort by match location, then alphabetical
		.sort((a, b) => a.match - b.match || StringUtils.compareIgnoreCase(a.tag, b.tag))
		// extract original tags
		.map(ta => ta.tag);
}
