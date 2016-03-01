import pathToRegexp from 'path-to-regexp';

import type { Route } from './types';

export function matchMethod(methods: string, mth: string): boolean {
  const methodList = (methods !== '*') ? methods.split(',') : [
    'GET', 'HEAD', 'POST', 'PUT', 'DELETE',
    'TRACE', 'OPTIONS', 'CONNECT', 'PATCH'
  ];

  return methodList.includes(mth);
}

function matchRouteUnbound(method: string, url: string, route: Route): boolean {
  if (!matchMethod(route.methods, method)) {
    return false;
  }

  return Boolean(pathToRegexp(route.url, []).exec(url));
}

export function matchRoute(method: string, url: string): Function {
  return matchRouteUnbound.bind(null, method, url);
}

export function getRouteHandler(route: Route): Function {
  if (typeof route.result === 'function') {
    return route.result;
  }
  return () => Promise.resolve(route.result);
}

export function findRouteHandlers(
  routes: Array<Route>, { method, url }: { method: string, url: string }
): Array<Function> {
  return routes.filter(matchRoute(method, url)).map(getRouteHandler);
}
