import test from 'ava';
import uhr from 'catberry-uhr';

import middlewrap from '../index.js';

test('should wrap uhr', assert => {
  let $uhr = new uhr.UHR();
  assert.notOk($uhr._middlewrap);

  $uhr = middlewrap($uhr);
  assert.ok($uhr._middlewrap);
});

test('should mock with object', async assert => {
  const $uhr = middlewrap(new uhr.UHR());

  $uhr.before.get('http://jsonplaceholder.typicode.com/posts/:id', {
    content: { id: 'mockedObject' }
  });

  const result = await $uhr.get('http://jsonplaceholder.typicode.com/posts/42');
  assert.is(result.content.id, 'mockedObject');
});

test('should mock with function', async assert => {
  const $uhr = middlewrap(new uhr.UHR());

  $uhr.before.get('http://jsonplaceholder.typicode.com/posts/:id', () => {
    return Promise.resolve({
      content: { id: 'mockedFunction' }
    });
  });

  const result = await $uhr.get('http://jsonplaceholder.typicode.com/posts/42');
  assert.is(result.content.id, 'mockedFunction');
});

test('should stack middlewares', async assert => {
  const $uhr = middlewrap(new uhr.UHR());
  assert.plan(3);

  $uhr.before.get('http://jsonplaceholder.typicode.com/posts/:id', (parameters, next) => {
    // called first
    assert.pass();
    return next(parameters);
  });

  $uhr.before.get('http://jsonplaceholder.typicode.com/posts/:id', () => {
    // called second
    assert.pass();
    return Promise.resolve({
      content: { id: 'mockedMiddlewares' }
    });
  });

  const result = await $uhr.get('http://jsonplaceholder.typicode.com/posts/42');
  assert.is(result.content.id, 'mockedMiddlewares');
});


test('should mock post', async assert => {
  const $uhr = middlewrap(new uhr.UHR());

  $uhr.before.post('http://jsonplaceholder.typicode.com/posts', {
    content: { id: 'mockedPost' }
  });

  const result = await $uhr.post('http://jsonplaceholder.typicode.com/posts');
  assert.is(result.content.id, 'mockedPost');
});
