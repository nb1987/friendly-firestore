
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

    select() {
        this._select = Array.from(arguments);
        return this;
    }

    where(field, operator, value) {
        this._where = (this._where || []).concat({
            field: field,
            operator: operator,
            value: value
        });
        return this;
    }

    orderBy(field, direction) {
        this._orderBy = (this._orderBy || []).concat({
            field: field,
            direction: direction === 'desc' ? 'DESCENDING' : 'ASCENDING'
        });
        return this;
    }

    limit(num) {
        this._limit = num;
        return this;
    }
    
    offset(num) {
        this._offset = num;
        return this;
    }

    startAt() {
        this._startAt = {
            values: Array.from(arguments),
            before: true
        };
        return this;
    }
    
    startAfter() {
        this._startAt = {
            values: Array.from(arguments),
            before: false
        };
        return this;
    }

    endAt() {
        this._endAt = {
            values: Array.from(arguments),
            before: false
        };
        return this;
    }
    
    endBefore() {
        this._endAt = {
            values: Array.from(arguments),
            before: true
        };
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