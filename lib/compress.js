const lzma = require("lzma");
const luamin = require("luamin");
const luaparse = require("luaparse");

/**
 * Binary to Ascii
 * @param {*} data
 * @return {string} output
 */
function btoa(data) {
	return Buffer.from(data).toString('base64');
}

/**
 * Ascii to Binary
 * @param {string} data
 * @return {Buffer} output
 */
function atob(data) {
	return Buffer.from(data, 'base64')
}

/**
 * Compress long strings using LZMA. Output a b64 string
 * @param {string} input
 * @return {string} output - Base 64 encoded
 */
function compress(input) {
	return btoa(lzma.compress(input));
}

/**
 * Decompress long base64 strings using LZMA.
 * @param {string} input - Base 64 encode
 * @return {string} output
 */
function decompress(input) {
	return lzma.decompress(atob(input));
}

/**
 * Compress and minify code for LuaJIT
 * @param {string} code
 * @return {string} compressed
 */
function packer(code) {
	return compress(luamin.minify(luaparse.parse(code, {
		scope: true,
		comments: false,
		luaVersion: 'LuaJIT',
		extendedIdentifiers: true
	})))
}

module.exports = {
	compress,
	decompress,
	packer
}
