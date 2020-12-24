const OPERATOR_MAP = {
    '==': 'EQUAL',
    '!=': 'NOT_EQUAL',
    '<': 'LESS_THAN',
    '<=': 'LESS_THAN_OR_EQUAL',
    '>': 'GREATER_THAN',
    '>=': 'GREATER_THAN_OR_EQUAL',
    'array-contains': 'ARRAY_CONTAINS',
    'array-contains-any': 'ARRAY_CONTAINS_ANY',
    'in': 'IN',
    'not-in': 'NOT_IN'
};

function getValueType(value) {
    if (value === null) return {nullValue: null};
    
    switch (typeof value) {
        case 'boolean':
            return {booleanValue: value};
        case 'number':
            return {doubleValue: value};
        case 'string': 
            return {stringValue: value};
    }
}

function extractMethod(query) {
    return ['where', 'orderBy', 'startAt', 'endAt', 'offset', 'limit'].some(prop => query.hasOwnProperty('_' + prop)) ? 'post' : 'get'
}

function extractUri(query) {
    if (extractMethod(query) === 'post') {
        // ignore the last collection in the request
        const purePath = query.path.filter(x => x.type === 'document' || x.type === 'collection');
        const truncatedPath = purePath.filter((x, i) => i < purePath.length - 1).map(x => x.name);
        return `/documents${truncatedPath.length > 0 ? '/' : ''}${truncatedPath.join('/')}:runQuery`;
    } else {
        return '/documents/' + 
            query.path.filter(x => x.type === 'document' || x.type === 'collection')
            .map(x => x.name)
            .join('/');
    }
}

function extractBody(query) {
    const body = {
            structuredQuery: {
            from: [
                // only select the very last
                {collectionId: query.path.filter(x => x.type === 'collection').reverse()[0].name}
            ]
        }
    };

    if (query._select) {
        body.structuredQuery.select =  { 
            fields: query._select.map(field => {
                return {fieldPath: field};
            })
        };
    }

    if (query._where) {
        if (query._where.length > 1) {
            body.structuredQuery.where = {
                compositeFilter: {
                    op: 'AND',
                    filters: query._where.map(clause => {
                        return {
                            fieldFilter: {
                                field: {
                                    fieldPath: clause.field
                                },
                                op: OPERATOR_MAP[clause.operator],
                                value: getValueType(clause.value)
                            }
                        };
                    })
                }
            };
        } else {
            body.structuredQuery.where = {
                fieldFilter: {
                    field: {
                        fieldPath: query._where[0].field
                    },
                    op: OPERATOR_MAP[query._where[0].operator],
                    value: getValueType(query._where[0].value)
                }
            };
        }
    }

    if (query._orderBy) {
        body.structuredQuery.orderBy = query._orderBy.map(clause => {
            return {
                field: {
                    fieldPath: clause.field
                },
                direction: clause.direction
            }
        })
    }

    if (query._limit) body.structuredQuery.limit = query._limit;
    if (query._offset) body.structuredQuery.offset = query._offset;
    if (query._startAt) {
        body.structuredQuery.startAt = {
            values: query._startAt.values.map(v => getValueType(v)),
            before: query._startAt.before
        };
    }
    if (query._endAt) {
        body.structuredQuery.endAt = {
            values: query._endAt.values.map(v => getValueType(v)),
            before: query._endAt.before
        };
    }

    return body;
}

module.exports = function translateRequest(query) {
    return {
        method: extractMethod(query),
        uri: extractUri(query),
        body: extractMethod(query) === 'get' ? null : extractBody(query)
    }
};