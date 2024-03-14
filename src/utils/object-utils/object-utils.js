import { snakeCase } from '../string-utils';
import { isArray, isDate, isFunction, isObject, isPrimitive, isString } from '../type-utils';
import { identity } from '../function-utils';

export function toSafeObject(data) {
	let newData = data;
	if(isFunction(data)) {
		newData = undefined;
	} else if(isArray(data)) {
		newData = data.map(toSafeObject);
	} else if(isObject(data)) {
		newData = {};
		let keys = Object.keys(data);
		// if there are no enumerable keys, try non-enumerable ones
		if(!keys.length) keys = Object.getOwnPropertyNames(data);
		keys.forEach((k) => {
			newData[k] = toSafeObject(data[k]);
		});
	}
	return newData;
}

/**
 * Returns an object with all cyclical references replaced with `«cyclical value»`
 * @param {*} data - Any value
 * @param {Set} foundObjects - A set of already found objects when recursing
 * @returns {*} A copy of the data without any cycles
 */
export function toNonCyclicalObject(data, foundObjects = new Set()) {
	let result;
	if(foundObjects.has(data)) {
		result = '«cyclical value»';
	} else if(isArray(data)) {
		foundObjects.add(data);
		result = data.map(v => toNonCyclicalObject(v, foundObjects));
		foundObjects.delete(data);
	} else if(isObject(data)) {
		foundObjects.add(data);
		const newObj = {};
		Object.keys(data).forEach(k => {
			newObj[k] = toNonCyclicalObject(data[k], foundObjects);
		});
		result = newObj;
		foundObjects.delete(data);
	} else {
		result = data;
	}
	return result;
}

/**
 * Returns a copy of the data safe for Sentry logging
 * @param {*} data - Any data we want to send to Sentry
 * @param {number} maxDepth - The maximum depth before we render the data as a JSON string (so it isn't lost)
 * @returns {*} A copy of the data safe to log to Sentry
 */
export function toSentrySafeObject(data, maxDepth = 2) {
	const newObj = {};
	Object.keys(data).forEach(k => {
		const v = data[k];
		if(isPrimitive(v)) {
			newObj[k] = v;
		} else if(isArray(v)) {
			if(maxDepth > 0) {
				newObj[k] = v.map(v => toSentrySafeObject(v, maxDepth - 1));
			} else {
				newObj[k] = JSON.stringify(toNonCyclicalObject(v));
			}
		} else if(isObject(v)) {
			if(maxDepth > 0) {
				newObj[k] = toSentrySafeObject(v, maxDepth - 1);
			} else {
				newObj[k] = JSON.stringify(toNonCyclicalObject(v));
			}
		}
	});
	return newObj;
}

// returns an object with a get method, that when called
// will either return the existing value or set the value to a new object.
// This is very useful for creating keyed state objects that can be shared via a service instance.
// i.e. objectCache.get('some value') // returns {} on first call.
export function createKeyedObjectCache() {
	return {
		get(key) {
			if(!this[key]) {
				this[key] = {};
			}

			return this[key];
		},
	};
}

export function defineValue(parent, key, value) {
	Object.defineProperty(parent, key, {
		value,
		enumerable: false,
		configurable: true,
	});
}

export function lazyProperty(parent, key, getter) {
	let prop;
	Object.defineProperty(parent, key, {
		get() {
			if(prop === undefined) {
				prop = getter.call(parent, key);
			}
			return prop;
		},
		enumerable: false,
		configurable: true,
	});
}

export function query(q, comparator, obj) {
	if(obj === undefined) {
		obj = comparator;
		comparator = false;
	}
	if(['', null, undefined].indexOf(q) > -1) return true;
	if(obj === null || obj === undefined) return false;
	return createQueryFilter(q, comparator)(obj);
}

/**
 * Takes in an object and returns a new object with all the object's keys snake_cased
 * @param {object} obj The object to modify
 * @returns {{}} The new object with snake_cased keys
 */
export function snakeCasedKeys(obj) {
	return Object.keys(obj).reduce((newObj, key) => {
		return angular.extend(newObj, {
			[snakeCase(key)]: obj[key],
		});
	}, {});
}

/**
 * Flattens an object so that all nested objects are namespaced into a single object.
 * i.e. {a: 1, b: {c: 2}} would turn into {a: 1, b_c: 2}
 * @param {object} obj The object to flatten
 * @param {boolean} snakeCased True if the actual key names should be snake cased. Regardless of this param, snake casing will be used to combine keys
 * @returns {{}} The new flattened object
 */
export function flattenObject(obj, snakeCased) {
	const flattened = {};
	if(obj && isObject(obj)) {
		const casedKey = key => snakeCased ? snakeCase(key) : key;

		Object.keys(obj).forEach(key => {
			let val = obj[key];
			if(isObject(val)) {
				val = flattenObject(val);
				Object.keys(val).forEach(subKey => {
					flattened[casedKey(`${key}_${subKey}`)] = val[subKey];
				});
			} else {
				flattened[casedKey(key)] = val;
			}
		});
	}

	return flattened;
}

/**
 * Returns true if both objects are null or undefined, or if both objects exists and have the same value for prop
 * @param {*} o1
 * @param {*} o2
 * @param {string?} prop
 * @return {boolean}
 */
export function idEquals(o1, o2, prop = 'id') {
	const o2Null = isNullOrUndefined(o2);
	return isNullOrUndefined(o1) ? o2Null : (!o2Null && o1[prop] === o2[prop]);
}

/**
 * Returns true if the values are different, with special cases for `null` and `undefined`
 * @param {*} originalVal The original value
 * @param {*} updatedVal The updated value
 * @param {String?} k Optional key being used. If the key is `$$hasKey`, we ignore it
 * @returns {boolean}
 */
export function isDiff(originalVal, updatedVal, k) {
	return k !== '$$hashKey' && !angular.equals(originalVal, updatedVal) && updatedVal !== undefined && !(updatedVal === null && originalVal === undefined);
}

/**
 * Can be used to return the differences between an existing object and another one.
 * Does NOT identify removed properties on the updated object (instead, set them to null).
 * @param original {Object} Existing model
 * @param updated {Object} Updated model or changes
 * @param skipProperty {Function} If provided, use to filter out properties
 * @returns {{$empty}} Hash of changes, plus a param $empty which is true if there are no changes
 */
export function diff(original, updated, skipProperty = angular.noop) {
	const changes = original ? {} : angular.extend({}, updated);
	if(original) {
		angular.forEach(updated, function(v, k) {
			if(!skipProperty(k, v) && isDiff(original[k], v, k)) {
				changes[k] = v;
			}
		});
	}
	defineValue(changes, '$empty', !Object.keys(changes).length);
	return changes;
}

export function isNullOrUndefined(o) {
	return o === null || o === undefined;
}

export function empty(o) {
	for(let k in o) {
		if(o.hasOwnProperty(k)) delete o[k];
	}
}

export function isEmpty(o) {
	return JSON.stringify(o) === '{}';
}

export function pluck(k, o) {
	if(o === undefined) {
		return pluck.bind(null, k);
	}
	if(k.indexOf('.')) {
		k = k.split('.');
		for(let i = 0; i < k.length; i++) {
			o = o[k[i]];
			if(o === undefined || o === null) return o;
		}
		return o;
	} else {
		return o[k];
	}
}


export const stripIdRecursively = (obj) => {
	if(Array.isArray(obj)) {
		obj.forEach(stripIdRecursively);
	} else if(angular.isObject(obj)) {
		delete obj.id;
		delete obj._id;
		angular.forEach(obj, stripIdRecursively);
	}
	return obj;
};

/**
 * Returns a flattened object with all of the prototype chain properties merged in.
 *
 * Stops at one of the following prototypes:
 *  - non-Object (e.g., null)
 *  - Object
 *  - if provided, the base class
 *
 *  The final object is not included in the assigned model.
 *
 *  NOTE: the returned model is a SHALLOW copy of the properties using Object.assign! Modifying nested objects
 *    *will* modify the original data.
 *
 * @param {*} object - Object we want to flatten
 * @param {*?} baseClass - Optional class for stopping
 * @returns {null|Object} If object is not an Object, is exactly Object or is the baseClass prototype, returns null.
 *   Otherwise returns a new object containing the flattened prototype chain.
 */
export function flattenPrototypeChain(object, baseClass) {
	if(!isObject(object) || object === Object || (baseClass && object === baseClass.prototype)) {
		return null;
	}
	return Object.assign(flattenPrototypeChain(Object.getPrototypeOf(object), baseClass) || {}, object);
}

// copied from AngularJS's filterFilter, but modified in the following ways:
// - Returns the predicate function directly, NOT the modified array
// - Enables the expression to be or contain an array, so we can match against any or all items in the array
// - Allows regular expressions as well as strings for query values
// - Converts Dates to strings to allow comparing on date values
// - Allows passing in a function that returns a string (for dynamically updated filters)
// - Allows for circular references
// - Allows for additional, non-hasOwnProperty keys on the object via a $relations property
export function createQueryFilter(expression, comparator = false) {
	let predicateFn = identity;
	let matchAgainstAnyProp;

	//noinspection FallThroughInSwitchStatementJS
	switch(typeof expression) {
		case 'function':
			if(isString(expression(''))) {
				predicateFn = _createPredicateFn(expression, comparator);
			} else {
				predicateFn = expression;
			}
			break;
		case 'boolean':
		case 'number':
		case 'string': // eslint-disable-line no-fallthrough
			matchAgainstAnyProp = true;
		case 'object': // eslint-disable-line no-fallthrough
			if(expression.test) matchAgainstAnyProp = true;
			predicateFn = _createPredicateFn(expression, comparator, matchAgainstAnyProp);
			break;
	}

	return predicateFn;
}

function _createPredicateFn(expression, comparator, matchAgainstAnyProp) {
	let expressionIsObject = isObject(expression);
	const shouldMatchPrimitives = expressionIsObject && ('$' in expression);
	let predicateFn;
	let _stringComparator = comparator;

	if(comparator === true) {
		_stringComparator = angular.equals;
	} else if(!isFunction(comparator)) {
		_stringComparator = function(actual, expected) {

			if(actual === expected || expected === '') return true;

			if(isObject(actual) || isObject(expected)) {
				// Prevent an object to be considered equal to a string like `'[object'`
				return false;
			}

			actual = ('' + actual).toLowerCase();
			expected = ('' + expected).toLowerCase();
			return actual.indexOf(expected) !== -1;
		};
	}

	comparator = (actual, expected) => {

		if(isFunction(expected)) {
			expected = expected(actual);
			// allow a function to return a string for comparison, which allows for
			// dynamic (live) content to match against in an expression
			if(isString(expected)) {
				return _stringComparator(actual, expected);
			} else {
				return !!expected;
			}
		} else if(isObject(expected) && expected.test) {
			// enable regex comparison
			return expected.test(actual);
		} else {
			return _stringComparator(actual, expected);
		}
	};

	predicateFn = function(item) {
		if(shouldMatchPrimitives && !isObject(item)) {
			return _deepCompare(item, expression.$, comparator, false);
		}
		return _deepCompare(item, expression, comparator, matchAgainstAnyProp);
	};

	return predicateFn;
}

function _deepCompare(actual, expected, comparator, matchAgainstAnyProp, foundObjects, dontMatchWholeObject, matchSome, $relations) {

	if(!foundObjects) {
		foundObjects = [];
	}

	if(isDate(actual)) {
		actual = actual.toString();
	}


	let actualType = (actual !== null) ? typeof actual : 'null';
	let expectedType = (expected !== null) ? typeof expected : 'null';
	if(expectedType === 'object' && expected.test) expectedType = 'regexp';


	if((expectedType === 'string') && (expected.charAt(0) === '!')) {
		return !_deepCompare(actual, expected.substring(1), comparator, matchAgainstAnyProp, foundObjects);
	} else if(isArray(actual)) {
		// enable testing arrays of objects
		if(actual.length === 0) {
			// for empty arrays, we match if the expected array is empty, or if we match against "null"
			if(isArray(expected)) {
				return expected.length === 0;
			} else {
				return _deepCompare(null, expected, comparator, matchAgainstAnyProp, foundObjects);
			}
		} else {
			if(isArray(expected)) {
				// if both actual and expected are arrays, we either try to match at least
				// one expected within at least one actual (matchSome), or
				// we make sure that every expected is within actual
				if(matchSome) {
					return actual.some(function(item) {
						return expected.some(function(exp) {
							return _deepCompare(item, exp, comparator, matchAgainstAnyProp, foundObjects);
						});
					});
				} else {
					return expected.every(function(exp) {
						return actual.some(function(item) {
							return _deepCompare(item, exp, comparator, matchAgainstAnyProp, foundObjects);
						});
					});
				}
			} else {
				return actual.some(function(item) {
					return _deepCompare(item, expected, comparator, matchAgainstAnyProp, foundObjects);
				});
			}
		}
	}

	switch(actualType) {
		case 'object':
			//noinspection ES6ConvertVarToLetConst
			var key;

			if(foundObjects.indexOf(actual) > -1) {
				// bail on circular references
				return false;
			}

			if(matchAgainstAnyProp) {
				foundObjects.push(actual);
				let actualIdx = foundObjects.length - 1;
				for(key in actual) {
					//noinspection JSUnfilteredForInLoop
					if((key.charAt(0) !== '$' && /* skip js-data */ !/^DS/.test(key)) && _deepCompare(actual[key], expected, comparator, true, foundObjects)) {
						return true;
					}
				}
				if($relations) {
					if($relations.some((rel) => actual[rel] && _deepCompare(actual[rel], expected, comparator, true, foundObjects))) {
						return true;
					}
				}
				if(dontMatchWholeObject) {
					return false;
				} else {
					foundObjects.splice(actualIdx, 1);
					return _deepCompare(actual, expected, comparator, false, foundObjects);
				}
			} else if(expectedType === 'object') {
				for(key in expected) {
					//noinspection JSUnfilteredForInLoop
					const expectedVal = expected[key];
					if(!expected.hasOwnProperty(key) || expectedVal === undefined || key === '$relations') {
						continue;
					}

					let nestedMatchSome = isArray(expectedVal) && key[0] === '~';
					if(nestedMatchSome) key = key.slice(1);

					const matchAnyProperty = key === '$';
					const actualVal = matchAnyProperty ? actual : actual[key];
					if(!_deepCompare(actualVal, expectedVal, comparator, matchAnyProperty, foundObjects, matchAnyProperty, nestedMatchSome, $relations || expected.$relations)) {
						return false;
					}
				}
				return true;
			} else {
				return comparator(actual, expected);
			}
		case 'function':
			return false;
		default:
			return comparator(actual, expected);
	}
}
