import { isArray, isObject } from './type-utils';
import { identity } from './function-utils';

const separatedWords = /([a-z0-9])[^a-z0-9]([a-z0-9])/gi;
const camelCasedWords = /([a-z0-9])([A-Z])/g;

const htmlSymbols = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
};

export const toString = String;

const pastTenseExceptions = {
	'are': 'were',
	'eat': 'ate',
	'go': 'went',
	'have': 'had',
	'inherit': 'inherited',
	'is': 'was',
	'run': 'ran',
	'sit': 'sat',
	'visit': 'visited',
};

const specialOrdinalSuffixes = {
	1: 'st',
	2: 'nd',
	3: 'rd',
	11: 'th',
	12: 'th',
	13: 'th',
};

// taken from https://gist.github.com/letsgetrandy/1e05a68ea74ba6736eb5
export function pastTense(verb) {
	// if already past tensed
	if((/ed$/).test(verb)) {
		return verb;
	}
	if(pastTenseExceptions[verb]) {
		return pastTenseExceptions[verb];
	}
	if((/e$/i).test(verb)) {
		return verb + 'd';
	}
	if((/[aeiou]c$/i).test(verb)) {
		return verb + 'ked';
	}
	if((/el$/i).test(verb)) {
		return verb + 'ed';
	}
	if((/[aeio][aeiou][dlmnprst]$/).test(verb)) {
		return verb + 'ed';
	}
	if((/[aeiou][b-df-hj-np-tv-z]+[aeiou][bdglmnprst]$/i).test(verb)) {
		return verb + 'ed';
	}
	if((/[aeiou][bdglmnprst]$/i).test(verb)) {
		return verb.replace(/(.+[aeiou])([bdglmnprst])/, '$1$2$2ed');
	}
	return verb + 'ed';
}

export function upperCaseWords(str) {
	return toString(str).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

export function fieldToLabel(field) {
	return upperCaseWords(trim(snakeCase(field).replace(/_/g, ' ')));
}

export function snakeCase(str) {
	return _replaceCase(str, '$1_$2').toLowerCase();
}

export function kebabCase(str) {
	return _replaceCase(str, '$1-$2').toLowerCase();
}

export function pascalCase(str) {
	return ucFirst(toString(str).replace(separatedWords, (m, l1, l2) => l1 + l2.toUpperCase()));
}

export function camelCase(str) {
	return lcFirst(pascalCase(str));
}

export function ucFirst(str) {
	str = toString(str);
	return str.length === 0 ? str : str[0].toUpperCase() + str.slice(1);
}

export function lcFirst(str) {
	str = toString(str);
	return str.length === 0 ? str : str[0].toLowerCase() + str.slice(1);
}

export function compare(a, b) {
	a = toStringEmpty(a);
	b = toStringEmpty(b);
	return a === b ? 0 : (a < b ? -1 : 1);
}

export function compareIgnoreCase(a, b) {
	return compare(toStringEmpty(a).toUpperCase(), toStringEmpty(b).toUpperCase());
}

export function compareEmptyLast(a, b) {
	if(!a && b) {
		return 1;
	} else if(!b && a) {
		return -1;
	} else {
		return compare(a, b);
	}
}

export function compareEmptyLastIgnoreCase(a, b) {
	return compareEmptyLast(toStringEmpty(a).toUpperCase(), toStringEmpty(b).toUpperCase());
}

export function escapeHTML(str) {
	return toString(str)
		.replace(/&amp;/g, '&')
		.replace(/[&<>]/g, (m) => htmlSymbols[m]);
}

export function escapeRegex(str) {
	return toString(str).replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
}

export function caseInsensitiveTest(haystack, needle) {
	try {
		return new RegExp(needle, 'i').test(haystack);
	} catch(e) {
		return false;
	}
}

export function removeCopyText(str) {
	return toString(str).replace(/ \(copy( \d+)?\)$/i, '');
}

export function addCopyText(str) {
	str = toString(str);
	if(/ \(copy\)$/i.test(str)) {
		return str.replace(/\(copy\)$/i, '(Copy 1)');
	} else if(/ \(copy \d+\)$/i.test(str)) {
		return str.replace(/\d+(?=\)$)/, (m) => 1 + (+m));
	} else {
		return str + ' (Copy)';
	}
}

export function addFollowUpTest(str) {
	str = toString(str);
	if(/(Part|Step|Phase|Stage|Chapter|Unit) \d+\)?$/i.test(str)) {
		return str.replace(/\d+(?=\)?$)/, (m) => 1 + (+m));
	} else {
		return str + ': Part 2';
	}
}

export function slugify(str) {
	return toString(str).replace(/^\W+|\W+$/g, '').replace(/\W+/g, '-').toLowerCase();
}

export function encodeForFirebaseRef(str) {
	return encodeURIComponent(toString(str)).replace(/\./g, '%46');
}

// returns a simplified string, good for fuzzy comparisons
export function simplify(str) {
	return toString(str).replace(/\W+/g, '').toLowerCase();
}

export function toStringEmpty(str) {
	if(str === null || str === undefined) {
		return '';
	} else {
		return toString(str);
	}
}

export function uuid() {
	// taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	let d = new Date().getTime();
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}

/**
 * Very basic token templating. Useful for replacing {{ }} tokens within data
 */
export function template(tmpl, data) {
	return tmpl.replace(/{{([\w.]+)}}/g, (_, token) => data[token]);
}

/**
 * Based on Java's String hash method, converts a string to a 32-bit integer hash
 * @param data Anything, will be converted to a string if it isn't already
 * @returns {number}
 */
export function hashCode(data) {
	data = toString(data);
	// from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
	let hash = 0;
	for(let i = 0; i < data.length; i++) {
		hash = ((hash << 5) - hash) + data.charCodeAt(i);
		hash = hash & hash;
	}
	return hash;
}

let objectIdCounter = Math.floor(Math.random() * 100000);

export function generateObjectId() {
	return padNum(Math.floor(Date.now() / 1000).toString(16), 8) + uuid().slice(-10) + padNum((++objectIdCounter).toString(16), 6);
}

export function ordinalSuffix(n) {
	let nString = toString(n);
	return specialOrdinalSuffixes[nString.slice(-2)] || specialOrdinalSuffixes[nString.slice(-1)] || 'th';
}

export function trim(any) {
	if(any === null || any === undefined) any = '';
	return toString(any).trim();
}

/**
 * Adds enough leading '0' to ensure the string is the expected width
 * @param {*} n - Number to pad
 * @param {number} len - Minimum length of the new string (defaults to 2)
 * @returns {string}
 */
export function padNum(n, len = 2) {
	const s = toStringEmpty(n);
	return '0'.repeat(Math.max(0, len - s.length)) + s;
}

export function indent(s, i = '  ') {
	return toString(s).replace(/^/gm, i);
}

export function limit(str, len = 100, append = '…', trimAtNewlines = true) {
	str = trim(str);
	if(trimAtNewlines && /\n/.test(str)) {
		str = str.match(/^[^\n]+/) + append;
	}
	return str.length <= len ? str : str.slice(0, len - append.length) + append;
}

/**
 * Ensures the string starts with a leading slash
 * @param {string} str
 * @returns {string}
 */
export function ensureLeadingSlash(str) {
	if(str[0] !== '/') str = '/' + str;
	return str;
}

export function concatUrl(...parts) {
	const slashes = /^\/+|\/+$/g;
	return parts.map(p => toStringEmpty(p).replace(slashes, '')).filter(identity).join('/');
}

export function toQueryParams(params) {
	return Object.keys(params)
		.filter(k => params[k])
		.map(k => `${k}=${encodeURIComponent(params[k])}`)
		.join('&');
}

export function absoluteUrl(path) {
	const link = document.createElement('a');
	link.href = path;
	return link.protocol + '//' + link.host + link.pathname + link.search + link.hash;
}

export function commaList(items) {
	if(items.length < 3) {
		return items.join(' and ');
	} else {
		return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
	}
}

const MAILTO_EMAIL_REGEX = /^mailto:([^?]+)(\?.*)?$/;
const SIMPLIFY_EMAIL_REGEX = /^.*<(.+)>$/;
const DEQUOTE_EMAIL_REGEX = /^"(.*)"$/;

// tries to find an email in the provided text
export function extractEmail(input) {
	// clean up the provided email, based on some common formats
	let email = (input || '').trim();
	if(MAILTO_EMAIL_REGEX.test(email)) {
		// strips leading `mailto:` protocol and trailing subject=, etc
		email = decodeURIComponent(email.replace(MAILTO_EMAIL_REGEX, '$1')).trim();
	}
	if(DEQUOTE_EMAIL_REGEX.test(email)) {
		email = email.replace(DEQUOTE_EMAIL_REGEX, '$1').trim();
	}
	if(SIMPLIFY_EMAIL_REGEX.test(email)) {
		// replaces `"Bob Smith" <bob.smith@example.com>` with just the email
		email = email.replace(SIMPLIFY_EMAIL_REGEX, '$1');
	}
	return email;
}


//// Lightweight console data renderer

function _consoleIndent(s, wrapper = '') {
	if(s) {
		return wrapper + indent(s, '  ') + wrapper;
	} else {
		return ' ';
	}
}

let JS_KEWORDS;

export function toSafeKey(k) {
	if(!JS_KEWORDS) {
		JS_KEWORDS = 'abstract|arguments|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield'.split('|');
	}
	return /^[_$a-z]\w*$/.test(k) && !JS_KEWORDS.includes(k) ? k : JSON.stringify(k);
}

export function prettyPrint(o, includeType = true, references = []) {
	o = _assignRefs(o, references);
	return _prettyPrint(o, includeType);
}

function _assignRefs(o, references, recursed = new Set()) {
	if(!recursed.has(o)) {
		recursed.add(o);
		if(isObject(o)) {
			if(o['@r']) {
				return _assignRefs(references[o['@r']], references, recursed);
			} else {
				Object.keys(o).forEach(k => {
					o[k] = _assignRefs(o[k], references, recursed);
				});
			}
		} else if(isArray(o)) {
			return o.map(v => _assignRefs(v, references, recursed));
		}
	}
	return o;
}
