const Query = require('../query');

test('it can add a doc to its path', () => {
    const query = (new Query('test')).doc('doc1');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'},
        {type: 'document', name: 'doc1'}
    ]);
});

test('it can add a sub-collection to its path', () => {
    const query = (new Query('test')).doc('doc1').collection('sub');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'},
        {type: 'document', name: 'doc1'},
        {type: 'collection', name: 'sub'}
    ]);
});

test('invoking where adds a where clause to its path', () => {
    const query = (new Query('test')).where('field1', '==', 'test-value');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'},
        {type: 'where', field: 'field1', operator: '==', value: 'test-value'}
    ]);
});

test('invoking orderBy adds a default ASCENDING orderBy clause to its path', () => {
    const query = (new Query('test')).orderBy('some-field');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'},
        {type: 'orderBy', field: 'some-field', direction: 'ASCENDING'}
    ]);
});

test('invoking orderBy adds an explicit ASCENDING orderBy clause to its path', () => {
    const query = (new Query('test')).orderBy('some-field', 'asc');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'},
        {type: 'orderBy', field: 'some-field', direction: 'ASCENDING'}
    ]);
});

test('invoking orderBy adds a DESCENDING orderBy clause to its path', () => {
    const query = (new Query('test')).orderBy('some-field', 'desc');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'},
        {type: 'orderBy', field: 'some-field', direction: 'DESCENDING'}
    ]);
});
