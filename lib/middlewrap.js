import { findRouteHandlers } from './route';
import { modes, registerVcr } from './vcr.js';

import type { Route, RouteResult, HttpMethodGroup } from './types';

function request(
  routes: Array<Route>, method: string, url: string, result: RouteResult
): void {
  routes.push({ method, url, result });
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

export default function (uhr: Object): Object {
  if (uhr._middlewrap) {
    return uhr;
  }

  const routesBefore: Array<Route> = [];
  const routesAfter: Array<Route> = [];
  const originalRequest = uhr.request.bind(uhr);

  const wrappedUhr = Object.create(uhr);
  wrappedUhr._middlewrap = { plugins: [] };

  wrappedUhr.before = getHttpMethodGroup(routesBefore);
  wrappedUhr.after = getHttpMethodGroup(routesAfter);

  wrappedUhr.request = parameters => {
    const befores = [
      ...findRouteHandlers(routesBefore, parameters),
      originalRequest
    ];

    const afters = [
      (result, passNext) => passNext(Object.assign({}, result, {
        params: parameters
      })),
      ...findRouteHandlers(routesAfter, parameters),
      result => Promise.resolve(result)
    ];

    function next(collection, index, result) {
      return collection[index](result, next.bind(null, collection, index + 1));
    }

    return new Promise((resolve, reject) => {
      next(befores, 0, parameters).then((result) => {
        resolve(next(afters, 0, result));
      }).catch(reject);
    });
  };

  return wrappedUhr;
}
