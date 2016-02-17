import { matchRoute, getRouteHandler } from './route';
import modes from './modes';

const mocker = { };

mocker.unmock = (uhr) => {
  uhr.request = uhr._mocker.originalRequest;
  uhr._mocker = null;
};


const routes = [];

function request(method, url, result) {
  routes.push({
    method,
    url,
    result
  });
}

mocker.get = request.bind(null, 'GET');
mocker.post = request.bind(null, 'POST');
mocker.put = request.bind(null, 'PUT');
mocker.patch = request.bind(null, 'PATCH');
mocker.delete = request.bind(null, 'DELETE');
mocker.request = request.bind(null);


export default function(uhr, mode = 'dryrun') {
  if (uhr._mocker) {
    return uhr._mocker;
  }

  const mocked = Object.assign({}, mocker, {
    mode: mode,
    originalRequest: uhr.request
  });

  uhr.request = (parameters) => {
    const matchedRoute = routes.find(route => matchRoute(route, parameters));
    if ((mocked.mode === 'dryrun') && matchedRoute) {
      return getRouteHandler(matchedRoute, parameters);
    }
    // return Promise.resolve({ content: { id: 'mockedGet' } });
    return mocked.originalRequest();
  };

  uhr._mocker = mocked;
  return mocked;
}
