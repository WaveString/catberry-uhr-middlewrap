import { findRouteHandler } from './route';
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
    originalRequest: uhr.request.bind(uhr),
    unmock: mocker.unmock.bind(null, uhr)
  });

  uhr._mocker = mocked;

  uhr.request = (parameters) => {
    const routeHandler = findRouteHandler(routes, parameters);
    const originalRequest = mocked.originalRequest;
    return modes[mode].request(routeHandler, originalRequest)(parameters);
  };

  return mocked;
}
