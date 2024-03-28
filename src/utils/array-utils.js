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
