const ff = require('../index');
const Query = require('../query');

test('it returns a new Query with an initialized path', () => {
    const query = ff.collection('test');    
    expect(query).toBeInstanceOf(Query);
    expect(query.path).toEqual([{type: 'collection', name: 'test'}]);
});