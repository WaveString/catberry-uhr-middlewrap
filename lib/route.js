import pathToRegexp from 'path-to-regexp';

export function matchRoute(route, parameters) {
  if (route.method !== parameters.method) {
    return false;
  }

  route.regexp = pathToRegexp(route.url, []);

  return route.regexp.exec(parameters.url);
}

export function getRouteHandler(route, parameters) {
  if (typeof route.result === 'function') {
    return route.result(parameters);
  }
  return Promise.resolve(route.result);
}