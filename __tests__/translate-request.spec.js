const translateRequest = require('../translate-request');
const Query = require('../query');

test('it translates a simple document get', () => {
    const query = (new Query('cities')).doc('Seoul');
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'get',
        uri: '/documents/cities/Seoul',
        body: null
    });
});

test('it translates a simple fetch of a sub-collection\'s documents', () => {
    const query = (new Query('cities')).doc('Seoul').collection('districts');
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'get',
        uri: '/documents/cities/Seoul/districts',
        body: null
    });
});

test('it translates a simple fetch of a sub-collection\'s individual document', () => {
    const query = (new Query('cities')).doc('Seoul').collection('districts').doc('Gangnam-gu');
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'get',
        uri: '/documents/cities/Seoul/districts/Gangnam-gu',
        body: null
    });
});

test('it translates a request containing a where clause with a single condition', () => {
    const query = (new Query('cities')).where('name', '==', 'Chicago');
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'post',
        uri: '/documents:runQuery',
        body: {
            structuredQuery: {
                from: [
                    {collectionId: 'cities'}
                ],
                where: {
                    fieldFilter: {
                        field: {
                            fieldPath: 'name'
                        },
                        op: 'EQUAL',
                        value: {
                            stringValue: 'Chicago'
                        }
                    }
                }
            }
        }
    });
});

test('it translates a request containing a where clause with multiple conditions', () => {
    const query = (new Query('cities')).where('country', '==', 'South Korea').where('population', '>=', 1000000);
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'post',
        uri: '/documents:runQuery',
        body: {
            structuredQuery: {
                from: [
                    {collectionId: 'cities'}
                ],
                where: {
                    compositeFilter: {
                        op: 'AND',
                        filters: [
                            {
                                fieldFilter: {
                                    field: {
                                        fieldPath: 'country'
                                    },
                                    op: 'EQUAL',
                                    value: {
                                        stringValue: 'South Korea'
                                    }
                                }
                            },
                            {
                                fieldFilter: {
                                    field: {
                                        fieldPath: 'population'
                                    },
                                    op: 'GREATER_THAN_OR_EQUAL',
                                    value: {
                                        doubleValue: 1000000
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    });
});

test('it translates a request querying a sub-collection and containing a where clause with a single condition', () => {
    const query = (new Query('cities')).doc('Seoul').collection('districts').where('name', '==', 'Gangnam-gu');
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'post',
        uri: '/documents/cities/Seoul:runQuery',
        body: {
            structuredQuery: {
                from: [
                    {collectionId: 'districts'}
                ],
                where: {
                    fieldFilter: {
                        field: {
                            fieldPath: 'name'
                        },
                        op: 'EQUAL',
                        value: {
                            stringValue: 'Gangnam-gu'
                        }
                    }
                }
            }
        }
    });
});

test('it translates a request containing a (default ascending) orderBy clause', () => {
    const query = (new Query('cities')).orderBy('population');
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'post',
        uri: '/documents:runQuery',
        body: {
            structuredQuery: {
                from: [
                    {collectionId: 'cities'}
                ],
                orderBy: [
                    {
                        field: {
                            fieldPath: 'population'
                        },
                        direction: 'ASCENDING'
                    }
                ]
            }
        }
    });
});

test('it translates a request containing a descending orderBy clause', () => {
    const query = (new Query('cities')).orderBy('population', 'desc');
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'post',
        uri: '/documents:runQuery',
        body: {
            structuredQuery: {
                from: [
                    {collectionId: 'cities'}
                ],
                orderBy: [
                    {
                        field: {
                            fieldPath: 'population'
                        },
                        direction: 'DESCENDING'
                    }
                ]
            }
        }
    });
});

test('it translates a request containing multiple orderBy clause', () => {
    const query = (new Query('cities')).orderBy('population', 'desc').orderBy('name');
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'post',
        uri: '/documents:runQuery',
        body: {
            structuredQuery: {
                from: [
                    {collectionId: 'cities'}
                ],
                orderBy: [
                    {
                        field: {
                            fieldPath: 'population'
                        },
                        direction: 'DESCENDING'
                    },
                    {
                        field: {
                            fieldPath: 'name'
                        },
                        direction: 'ASCENDING'
                    }
                ]
            }
        }
    });
});