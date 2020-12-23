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
    return query.path.some(x => ['where', 'orderBy', 'startAt', 'endAt', 'offset', 'limit'].indexOf(x.type) >= 0) ? 'post' : 'get'
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
    const whereClauses = query.path.filter(x => x.type === 'where')
    const orderByClauses = query.path.filter(x => x.type === 'orderBy')

    const body = {
            structuredQuery: {
            from: [
                // only select the very last
                {collectionId: query.path.filter(x => x.type === 'collection').reverse()[0].name}
            ]
        }
    };

    if (whereClauses.length > 1) {
        body.structuredQuery.where = {
            compositeFilter: {
                op: 'AND',
                filters: whereClauses.map(clause => {
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
    } else if (whereClauses.length > 0) {
        body.structuredQuery.where = {
            fieldFilter: {
                field: {
                    fieldPath: whereClauses[0].field
                },
                op: OPERATOR_MAP[whereClauses[0].operator],
                value: getValueType(whereClauses[0].value)
            }
        };
    }

    if (orderByClauses.length > 0) {
        body.structuredQuery.orderBy = orderByClauses.map(clause => {
            return {
                field: {
                    fieldPath: clause.field
                },
                direction: clause.direction
            }
        })
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