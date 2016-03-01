export type RouteResult = Function|Object;

export type Route = {
  methods: string;
  url: string;
  result: RouteResult;
};

export type HttpMethodGroup = {
  get: Function,
  post: Function,
  put: Function,
  patch: Function,
  delete: Function,
  request: Function
}
