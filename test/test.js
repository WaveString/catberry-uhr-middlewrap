import test from 'ava';
import uhr from 'catberry-uhr';

import mock from '../index.js';

test('should setup mocker', assert => {
  const $uhr = new uhr.UHR();
  assert.notOk($uhr._mocker);
  mock($uhr);

  assert.ok($uhr._mocker);
});

test('should mock for get', async assert => {
  const $uhr = new uhr.UHR();
  const mocker = mock($uhr);

  mocker.get('http://jsonplaceholder.typicode.com/posts/:id', () => {
    return Promise.resolve({
      content: { id: 'mockedGet' }
    });
  });

  const result = await $uhr.get('http://jsonplaceholder.typicode.com/posts/42');
  assert.is(result.content.id, 'mockedGet');
});

test('should mock for post', async assert => {
  const $uhr = new uhr.UHR();
  const mocker = mock($uhr);

  mocker.post('http://jsonplaceholder.typicode.com/posts', {
    content: { id: 'mockedPost' }
  });

  const result = await $uhr.post('http://jsonplaceholder.typicode.com/posts');
  assert.is(result.content.id, 'mockedPost');
});
