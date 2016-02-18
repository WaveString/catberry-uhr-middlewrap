'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (uhr) {
  if (uhr._middlewrap) {
    return uhr;
  }

  var routesBefore = [];

  if (!(Array.isArray(routesBefore) && routesBefore.every(function (item) {
    return Route(item);
  }))) {
    throw new TypeError('Value of variable "routesBefore" violates contract.\n\nExpected:\nArray<Route>\n\nGot:\n' + _inspect(routesBefore));
  }

  var routesAfter = [];

  if (!(Array.isArray(routesAfter) && routesAfter.every(function (item) {
    return Route(item);
  }))) {
    throw new TypeError('Value of variable "routesAfter" violates contract.\n\nExpected:\nArray<Route>\n\nGot:\n' + _inspect(routesAfter));
  }

  var originalRequest = uhr.request.bind(uhr);

  var wrappedUhr = Object.create(uhr);
  wrappedUhr._middlewrap = true;

  wrappedUhr.before = getHttpMethodGroup(routesBefore);
  wrappedUhr.after = getHttpMethodGroup(routesAfter);

  wrappedUhr.request = function (parameters) {
    var routeHandlers = (0, _route.findRouteHandlers)(routesBefore, parameters);
    var middles = [].concat(_toConsumableArray(routeHandlers), [originalRequest]);

    var index = -1;
    function next(result) {
      index++;
      return middles[index](result, next);
    }

    return next(parameters);
  };

  return wrappedUhr;
};

var _route = require('./route');

var _types = require('./types');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Route = _types.Route,
    RouteResult = _types.RouteResult,
    HttpMethodGroup = _types.HttpMethodGroup;


function request(routes, method, url, result) {
  if (!(Array.isArray(routes) && routes.every(function (item) {
    return Route(item);
  }))) {
    throw new TypeError('Value of argument "routes" violates contract.\n\nExpected:\nArray<Route>\n\nGot:\n' + _inspect(routes));
  }

  if (!(typeof method === 'string')) {
    throw new TypeError('Value of argument "method" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(method));
  }

  if (!(typeof url === 'string')) {
    throw new TypeError('Value of argument "url" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(url));
  }

  if (!RouteResult(result)) {
    throw new TypeError('Value of argument "result" violates contract.\n\nExpected:\nRouteResult\n\nGot:\n' + _inspect(result));
  }

  routes.push({
    method: method,
    url: url,
    result: result
  });
}

function getHttpMethodGroup(routes) {
  function _ref2(_id2) {
    if (!HttpMethodGroup(_id2)) {
      throw new TypeError('Function "getHttpMethodGroup" return value violates contract.\n\nExpected:\nHttpMethodGroup\n\nGot:\n' + _inspect(_id2));
    }

    return _id2;
  }

  if (!(Array.isArray(routes) && routes.every(function (item) {
    return Route(item);
  }))) {
    throw new TypeError('Value of argument "routes" violates contract.\n\nExpected:\nArray<Route>\n\nGot:\n' + _inspect(routes));
  }

  return _ref2({
    get: request.bind(null, routes, 'GET'),
    post: request.bind(null, routes, 'POST'),
    put: request.bind(null, routes, 'PUT'),
    patch: request.bind(null, routes, 'PATCH'),
    delete: request.bind(null, routes, 'DELETE'),
    request: request.bind(null, routes)
  });
}

function _inspect(input) {
  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      var first = _inspect(input[0]);

      if (input.every(function (item) {
        return _inspect(item) === first;
      })) {
        return first.trim() + '[]';
      } else {
        return '[' + input.map(_inspect).join(', ') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    var keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    var entries = keys.map(function (key) {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }).join('\n  ');

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + entries + '\n}';
    } else {
      return '{ ' + entries + '\n}';
    }
  }
}
