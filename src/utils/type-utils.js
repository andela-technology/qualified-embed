export function isPrimitive(v) {
	return !isFunction(v) && !isObject(v);
}

export function isString(s) {
	return typeof s === 'string';
}

export function isObject(value) {
	return value !== null && typeof value === 'object';
}

export function isFunction(v) {
	return typeof v === 'function';
}

export function isNumber(v) {
	return typeof v === 'number';
}

export function isBoolean(v) {
	return typeof v === 'boolean';
}

export const isArray = Array.isArray;

export function isDate(v) {
	return Object.prototype.toString.call(v) === '[object Date]';
}
