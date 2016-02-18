import { findRouteHandlers } from './route';

import type { Route, RouteResult, HttpMethodGroup } from './types';

function request(
  routes: Array<Route>, method: string, url: string, result: RouteResult
): void {
  routes.push({
    method,
    url,
    result
  });
}

function getHttpMethodGroup(routes: Array<Route>): HttpMethodGroup {
  return {
    get: request.bind(null, routes, 'GET'),
    post: request.bind(null, routes, 'POST'),
    put: request.bind(null, routes, 'PUT'),
    patch: request.bind(null, routes, 'PATCH'),
    delete: request.bind(null, routes, 'DELETE'),
    request: request.bind(null, routes)
  };
}

export default function (uhr) {
  if (uhr._middlewrap) {
    return uhr;
  }

  const routesBefore: Array<Route> = [];
  const routesAfter: Array<Route> = [];
  const originalRequest = uhr.request.bind(uhr);

  const wrappedUhr = Object.create(uhr);
  wrappedUhr._middlewrap = true;

  wrappedUhr.before = getHttpMethodGroup(routesBefore);
  wrappedUhr.after = getHttpMethodGroup(routesAfter);

  wrappedUhr.request = (parameters) => {
    const routeHandlers = findRouteHandlers(routesBefore, parameters);
    const middles = [...routeHandlers, originalRequest];

    let index = -1;
    function next(result) {
      index++;
      return middles[index](result, next);
    }

    return next(parameters);
  };

  return wrappedUhr;
}
