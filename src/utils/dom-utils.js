const doc = window.document;

export function docReady(fn) {
	// see if DOM is already available
	if(doc.readyState === 'complete' || doc.readyState === 'interactive') {
		// call on next available tick
		window.setTimeout(fn, 1);
	} else {
		doc.addEventListener('DOMContentLoaded', fn);
	}
}
