// all requests go out to the internet,
// dont replay anything, doesnt record anything
const wild = {
  setup: () => {
  },

  start: () => {
  },

  finish: () => {
  }
};

// use recorded nocks, allow http calls,
// doesnt record anything, useful for writing new tests (default)
const dryrun = {
  setup: () => {
  },

  start: () => {
    // load fixtures
  },

  finish: () => {
  }
};

// use recorded nocks, record new nocks
const record = {
  setup: () => {
  },

  start: () => {
    // load fixtures
  },

  finish: () => {
  }
};

// use recorded nocks, disables all http calls, doesnt record
const lockdown = {
  setup: () => {
  },

  start: () => {
    // load fixtures
  },

  finish: () => {
  }
};

export default {
  wild,
  dryrun,
  record,
  lockdown
};
