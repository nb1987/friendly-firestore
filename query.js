
class Query {

    constructor(rootCollection) {
        this.path = [{type: 'collection', name: rootCollection}]
    }

    doc(documentId) {
        this.path = this.path.concat({
            type: 'document',
            name: documentId
        });
        return this;
    }

    collection(collectionName) {
        this.path = this.path.concat({
            type: 'collection',
            name: collectionName
        });
        return this;
    }

    where(field, operator, value) {
        this.path = this.path.concat({
            type: 'where',
            field: field,
            operator: operator,
            value: value
        });
        return this;
    }

    orderBy(field, direction) {
        this.path = this.path.concat({
            type: 'orderBy',
            field: field,
            direction: direction === 'desc' ? 'DESCENDING' : 'ASCENDING'
        });
        return this;
    }

    get() {
        if (this.path.some(x => x.type === 'where')) {
            return new Promise((resolve, reject) => {

            });
        }
    }

}

module.exports = Query;