import test from 'ava';
import uhr from 'catberry-uhr';

import middlewrap from '../lib/middlewrap.js';

const testApi = 'http://jsonplaceholder.typicode.com';

test('should wrap uhr', assert => {
  let $uhr = new uhr.UHR();
  assert.notOk($uhr._middlewrap);

  $uhr = middlewrap($uhr);
  assert.ok($uhr._middlewrap);
});

test('should mock with object', async assert => {
  const $uhr = middlewrap(new uhr.UHR());

  $uhr.before.get(`${testApi}/posts/:id`, {
    content: { id: 'mockedObject' }
  });

  const result = await $uhr.get(`${testApi}/posts/42`);
  assert.is(result.content.id, 'mockedObject');
});

test('should mock with function', async assert => {
  const $uhr = middlewrap(new uhr.UHR());

  $uhr.before.get(`${testApi}/posts/:id`, () => {
    return Promise.resolve({
      content: { id: 'mockedFunction' }
    });
  });

  const result = await $uhr.get(`${testApi}/posts/42`);
  assert.is(result.content.id, 'mockedFunction');
});

test('should chain middlewares', async assert => {
  const $uhr = middlewrap(new uhr.UHR());
  assert.plan(4);

  $uhr.before.get(`${testApi}/posts/:id`, (parameters, next) => {
    // called first
    assert.pass();
    return next(parameters);
  });

  $uhr.before.get(`${testApi}/posts/:id`, () => {
    // called second
    assert.pass();
    return Promise.resolve({
      content: { id: 'mockedMiddlewares' }
    });
  });

  $uhr.after.get(`${testApi}/posts/:id`, (result, next) => {
    // called last
    assert.pass();
    const transformedResult = Object.assign({}, result);
    transformedResult.content.id = 'mockedTransMiddlewares';
    return next(result);
  });

  const result = await $uhr.get(`${testApi}/posts/42`);
  assert.is(result.content.id, 'mockedTransMiddlewares');
});


test('should mock post', async assert => {
  const $uhr = middlewrap(new uhr.UHR());

  $uhr.before.post('http://jsonplaceholder.typicode.com/posts', {
    content: { id: 'mockedPost' }
  });

  const result = await $uhr.post('http://jsonplaceholder.typicode.com/posts');
  assert.is(result.content.id, 'mockedPost');
});
