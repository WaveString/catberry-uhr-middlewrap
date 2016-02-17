import pathToRegexp from 'path-to-regexp';

export function matchRoute(route, parameters) {
  if (route.method !== parameters.method) {
    return false;
  }

  route.regexp = pathToRegexp(route.url, []);

  return route.regexp.exec(parameters.url);
}

export function getRouteHandler(route) {
  if (typeof route.result === 'function') {
    return route.result;
  }
  return () => Promise.resolve(route.result);
}

export function findRouteHandler(routes, parameters) {
  const matchedRoute = routes.find(route => matchRoute(route, parameters));
  if (matchedRoute) {
    return getRouteHandler(matchedRoute);
  }
  return null;
}
