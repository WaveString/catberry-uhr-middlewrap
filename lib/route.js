import pathToRegexp from 'path-to-regexp';

import type { Route } from './types';

export function matchRoute(route: Route, method: string, url: string): boolean {
  if (route.method !== method) {
    return false;
  }

  return Boolean(pathToRegexp(route.url, []).exec(url));
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
  const matchedRoutes = routes.filter(route => matchRoute(route, method, url));
  return matchedRoutes.map(getRouteHandler);
}
