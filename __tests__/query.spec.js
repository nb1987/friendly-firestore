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

test('invoking where adds a _where property to the query', () => {
    const query = (new Query('test')).where('field1', '==', 'test-value');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._where).toEqual([
        {field: 'field1', operator: '==', value: 'test-value'}
    ]);
});

test('invoking orderBy adds a default ASCENDING _orderBy property to the query', () => {
    const query = (new Query('test')).orderBy('some-field');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._orderBy).toEqual([
        {field: 'some-field', direction: 'ASCENDING'}
    ]);
});

test('invoking orderBy adds an explicit ASCENDING _orderBy property to the query', () => {
    const query = (new Query('test')).orderBy('some-field', 'asc');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._orderBy).toEqual([
        {field: 'some-field', direction: 'ASCENDING'}
    ]);
});

test('invoking orderBy adds a DESCENDING _orderBy property to the query', () => {
    const query = (new Query('test')).orderBy('some-field', 'desc');
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._orderBy).toEqual([
        {field: 'some-field', direction: 'DESCENDING'}
    ]);
});

test('invoking limit adds a _limit property to the query', () => {
    const query = (new Query('test')).orderBy('some-field', 'desc').limit(5);
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._limit).toBe(5);
});

test('invoking startAt adds a _startAt property to the query', () => {
    const query = (new Query('test')).orderBy('some-field', 'desc').startAt(10);
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._startAt).toEqual({values: [10], before: true});
});

test('invoking startAfter adds a _startAt property with a before property of false to the query', () => {
    const query = (new Query('test')).orderBy('some-field', 'desc').startAfter(10);
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._startAt).toEqual({values: [10], before: false});
});

test('invoking endAt adds an _endAt property with a before property of false to the query', () => {
    const query = (new Query('test')).orderBy('some-field', 'desc').endAt(10);
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._endAt).toEqual({values: [10], before: false});
});

test('invoking endBefore adds an _endAt property with a before property of true to the query', () => {
    const query = (new Query('test')).orderBy('some-field', 'desc').endBefore(10);
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._endAt).toEqual({values: [10], before: true});
});

test('invoking offset adds an _offset property to the query', () => {
    const query = (new Query('test')).limit(10).offset(20);
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._limit).toBe(10);
    expect(query._offset).toBe(20);
});

test('invoking select adds a _select property to the query', () => {
    const query = (new Query('test')).select('field1', 'field2', 'field3')
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([
        {type: 'collection', name: 'test'}
    ]);
    expect(query._select).toEqual(['field1', 'field2', 'field3']);
});