var CHARS = 'ABCDEFGHIJKMLNOPQRSTUVWXZY123456789*&^%#$@DFSVDSFHSADFSVJHFDASGFSAEDFDSGFASDFADSF$#%$#'.split('');

function fake(size) {
    size = size || 256 * 1024;    
    return new Array(size).fill().map( () => CHARS[Math.random() * CHARS.length | 0] ).join('');
}

module.exports = fake;