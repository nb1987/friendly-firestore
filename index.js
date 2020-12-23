const Query = require('./query');

module.exports = {
    collection: function (collectionName) {
        return new Query(collectionName);
    }
};