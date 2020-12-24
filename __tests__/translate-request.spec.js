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

test('it translates a request containing multiple orderBy clauses', () => {
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

test('it translates a request containing a limit clause', () => {
    const query = (new Query('cities')).orderBy('population', 'desc').limit(5);
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
                ],
                limit: 5
            }
        }
    });
});

// TODO: Look into https://github.com/googleapis/nodejs-firestore/issues/59#issuecomment-342619570

test('it translates a request containing a startAt clause', () => {
    const query = (new Query('cities')).orderBy('population', 'desc').startAt(100000);
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
                ],
                startAt: {
                    values: [
                        {doubleValue: 100000}
                    ],
                    before: true
                }
            }
        }
    });
});

test('it translates a request containing a startAfter clause', () => {
    const query = (new Query('cities')).orderBy('population', 'desc').startAfter(100000);
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
                ],
                startAt: {
                    values: [
                        {doubleValue: 100000}
                    ],
                    before: false
                }
            }
        }
    });
});

test('it translates a request containing multiple startAt clauses', () => {
    const query = (new Query('cities')).orderBy('name').orderBy('state').startAt('Springfield', 'Missouri');
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
                            fieldPath: 'name'
                        },
                        direction: 'ASCENDING'
                    },
                    {
                        field: {
                            fieldPath: 'state'
                        },
                        direction: 'ASCENDING'
                    }
                ],
                startAt: {
                    values: [
                        {stringValue: 'Springfield'},
                        {stringValue: 'Missouri'}
                    ],
                    before: true
                }
            }
        }
    });
});

test('it translates a request containing an endAt clause', () => {
    const query = (new Query('cities')).orderBy('population', 'desc').endAt(100000);
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
                ],
                endAt: {
                    values: [
                        {doubleValue: 100000}
                    ],
                    before: false
                }
            }
        }
    });
});

test('it translates a request containing an endBefore clause', () => {
    const query = (new Query('cities')).orderBy('population', 'desc').endBefore(100000);
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
                ],
                endAt: {
                    values: [
                        {doubleValue: 100000}
                    ],
                    before: true
                }
            }
        }
    });
});

test('it translates a request containing an offset clause', () => {
    const query = (new Query('cities')).limit(10).offset(20);
    const translatedQuery = translateRequest(query);
    expect(translatedQuery).toEqual({
        method: 'post',
        uri: '/documents:runQuery',
        body: {
            structuredQuery: {
                from: [
                    {collectionId: 'cities'}
                ],
                limit: 10,
                offset: 20
            }
        }
    });
});

