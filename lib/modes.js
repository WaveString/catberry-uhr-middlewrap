// all requests go out to the internet,
// dont replay anything, doesnt record anything
const wild = {
  request: (routeHandler, originalRequest) => {
    return originalRequest;
  }
};

// use recorded nocks, allow http calls,
// doesnt record anything, useful for writing new tests (default)
const dryrun = {
  request: (routeHandler, originalRequest) => {
    if (routeHandler) {
      return routeHandler;
    }
    return originalRequest;
  }
};

// use recorded nocks, record new nocks
const record = {
  request: (routeHandler, originalRequest, parameters) => {
    if (routeHandler) {
      return routeHandler;
    }
    return originalRequest;
  }
};

// use recorded nocks, disables all http calls, doesnt record
const lockdown = {
  request: (routeHandler, originalRequest, parameters) => {
    if (routeHandler) {
      return routeHandler;
    }
    return () => Promise.reject('no fixture for lockdown mode');
  }
};

export default {
  wild,
  dryrun,
  record,
  lockdown
};
