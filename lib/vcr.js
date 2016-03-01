import { matchRoute } from './route';

function getFixturedRoute(routes, { method, url }) {
  const matchedRoutes = routes.filter(matchRoute(method, url));
  if (!matchedRoutes.length) {
    return null;
  }
  // find the most specific route
  const specificReducer = (pr, cr) => (pr.url.length > cr.url.length) ? pr : cr;
  const result = matchedRoutes.reduce(specificReducer).result;
  return Object.assign({}, result, {
    fixtured: true
  });
}

export const modes = {
  wild: {},
  dryrun: {
    before({ routes }, params, next) {
      const result = getFixturedRoute(routes, params);
      return result ? Promise.resolve(result) : next(params);
    }
  },
  record: {
    before({ routes }, params, next) {
      const result = getFixturedRoute(routes, params);
      return result ? Promise.resolve(result) : next(params);
    },

    after(fixture, result, next, recordCb) {
      const { method, url } = result.params;
      if (!result.fixtured && !fixture.routes.some(route => route.url === url)) {
        fixture.routes.push({
          methods: method,
          url,
          result: Object.assign({}, result, { params: null })
        });
        recordCb(fixture);
      }
      return next(result);
    }
  },
  lockdown: {
    before({ routes }, params) {
      const result = getFixturedRoute(routes, params);
      return result ? Promise.resolve(result) :
        Promise.reject('no fixture for lockdown mode');
    }
  }
};

export function registerVcr(mode, fixture, recordCb, $uhr) {
  if (!$uhr._middlewrap) {
    throw new Error('Whoops! Wrong middlewrap');
  }
  if ($uhr._middlewrap.plugins.includes('vcr')) {
    return;
  }
  $uhr._middlewrap.plugins.push('vcr');

  // fixtures.forEach(fixture => {

  const callback = (middle) => (params, next) => middle(fixture, params, next, recordCb);

  const { methods, url } = fixture;
  if (mode.before) {
    $uhr.before.request(methods, url, callback(mode.before));
  }
  if (mode.after) {
    $uhr.after.request(methods, url, callback(mode.after));
  }
  // });
}
