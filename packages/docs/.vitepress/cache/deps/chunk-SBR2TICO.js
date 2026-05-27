import {
  Tracker
} from "./chunk-NWLGNSX4.js";
import {
  require_react
} from "./chunk-2YX7DZXR.js";
import {
  __commonJS,
  __toESM
} from "./chunk-5WRI5ZAA.js";

// ../../node_modules/.pnpm/react-is@16.13.1/node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS({
  "../../node_modules/.pnpm/react-is@16.13.1/node_modules/react-is/cjs/react-is.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var hasSymbol = typeof Symbol === "function" && Symbol.for;
        var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
        var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
        var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
        var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
        var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
        var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
        var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
        var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
        var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
        var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
        var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
        var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
        var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
        var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
        var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
        var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
        var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
        var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
        function isValidElementType(type) {
          return typeof type === "string" || typeof type === "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
          type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
        }
        function typeOf(object) {
          if (typeof object === "object" && object !== null) {
            var $$typeof = object.$$typeof;
            switch ($$typeof) {
              case REACT_ELEMENT_TYPE:
                var type = object.type;
                switch (type) {
                  case REACT_ASYNC_MODE_TYPE:
                  case REACT_CONCURRENT_MODE_TYPE:
                  case REACT_FRAGMENT_TYPE:
                  case REACT_PROFILER_TYPE:
                  case REACT_STRICT_MODE_TYPE:
                  case REACT_SUSPENSE_TYPE:
                    return type;
                  default:
                    var $$typeofType = type && type.$$typeof;
                    switch ($$typeofType) {
                      case REACT_CONTEXT_TYPE:
                      case REACT_FORWARD_REF_TYPE:
                      case REACT_LAZY_TYPE:
                      case REACT_MEMO_TYPE:
                      case REACT_PROVIDER_TYPE:
                        return $$typeofType;
                      default:
                        return $$typeof;
                    }
                }
              case REACT_PORTAL_TYPE:
                return $$typeof;
            }
          }
          return void 0;
        }
        var AsyncMode = REACT_ASYNC_MODE_TYPE;
        var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment2 = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false;
        function isAsyncMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsAsyncMode) {
              hasWarnedAboutDeprecatedIsAsyncMode = true;
              console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
            }
          }
          return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
        }
        function isConcurrentMode(object) {
          return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
        }
        function isContextConsumer(object) {
          return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        function isContextProvider(object) {
          return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        function isElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function isForwardRef(object) {
          return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        function isFragment(object) {
          return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        function isLazy(object) {
          return typeOf(object) === REACT_LAZY_TYPE;
        }
        function isMemo(object) {
          return typeOf(object) === REACT_MEMO_TYPE;
        }
        function isPortal(object) {
          return typeOf(object) === REACT_PORTAL_TYPE;
        }
        function isProfiler(object) {
          return typeOf(object) === REACT_PROFILER_TYPE;
        }
        function isStrictMode(object) {
          return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        function isSuspense(object) {
          return typeOf(object) === REACT_SUSPENSE_TYPE;
        }
        exports.AsyncMode = AsyncMode;
        exports.ConcurrentMode = ConcurrentMode;
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment2;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
        exports.isValidElementType = isValidElementType;
        exports.typeOf = typeOf;
      })();
    }
  }
});

// ../../node_modules/.pnpm/react-is@16.13.1/node_modules/react-is/index.js
var require_react_is = __commonJS({
  "../../node_modules/.pnpm/react-is@16.13.1/node_modules/react-is/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_is_development();
    }
  }
});

// ../../node_modules/.pnpm/hoist-non-react-statics@3.3.2/node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
var require_hoist_non_react_statics_cjs = __commonJS({
  "../../node_modules/.pnpm/hoist-non-react-statics@3.3.2/node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"(exports, module) {
    "use strict";
    var reactIs = require_react_is();
    var REACT_STATICS = {
      childContextTypes: true,
      contextType: true,
      contextTypes: true,
      defaultProps: true,
      displayName: true,
      getDefaultProps: true,
      getDerivedStateFromError: true,
      getDerivedStateFromProps: true,
      mixins: true,
      propTypes: true,
      type: true
    };
    var KNOWN_STATICS = {
      name: true,
      length: true,
      prototype: true,
      caller: true,
      callee: true,
      arguments: true,
      arity: true
    };
    var FORWARD_REF_STATICS = {
      "$$typeof": true,
      render: true,
      defaultProps: true,
      displayName: true,
      propTypes: true
    };
    var MEMO_STATICS = {
      "$$typeof": true,
      compare: true,
      defaultProps: true,
      displayName: true,
      propTypes: true,
      type: true
    };
    var TYPE_STATICS = {};
    TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
    TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
    function getStatics(component) {
      if (reactIs.isMemo(component)) {
        return MEMO_STATICS;
      }
      return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
    }
    var defineProperty = Object.defineProperty;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var getPrototypeOf = Object.getPrototypeOf;
    var objectPrototype = Object.prototype;
    function hoistNonReactStatics2(targetComponent, sourceComponent, blacklist) {
      if (typeof sourceComponent !== "string") {
        if (objectPrototype) {
          var inheritedComponent = getPrototypeOf(sourceComponent);
          if (inheritedComponent && inheritedComponent !== objectPrototype) {
            hoistNonReactStatics2(targetComponent, inheritedComponent, blacklist);
          }
        }
        var keys = getOwnPropertyNames(sourceComponent);
        if (getOwnPropertySymbols) {
          keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }
        var targetStatics = getStatics(targetComponent);
        var sourceStatics = getStatics(sourceComponent);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
            var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
            try {
              defineProperty(targetComponent, key, descriptor);
            } catch (e) {
            }
          }
        }
      }
      return targetComponent;
    }
    module.exports = hoistNonReactStatics2;
  }
});

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/observer.js
var import_react6 = __toESM(require_react());
var import_hoist_non_react_statics = __toESM(require_hoist_non_react_statics_cjs());

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/useForceUpdate.js
var import_react3 = __toESM(require_react());

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/useLayoutEffect.js
var import_react = __toESM(require_react());
var useLayoutEffect = typeof document !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/useDidUpdate.js
var import_react2 = __toESM(require_react());

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/shared/global.js
function globalSelf() {
  try {
    if (typeof self !== "undefined") {
      return self;
    }
  } catch (e) {
  }
  try {
    if (typeof window !== "undefined") {
      return window;
    }
  } catch (e) {
  }
  try {
    if (typeof global !== "undefined") {
      return global;
    }
  } catch (e) {
  }
  return Function("return this")();
}
var globalThisPolyfill = globalSelf();

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/shared/gc.js
var registry = globalThisPolyfill["FinalizationRegistry"] && new globalThisPolyfill["FinalizationRegistry"](function(token) {
  var _a;
  return (_a = token === null || token === void 0 ? void 0 : token.clean) === null || _a === void 0 ? void 0 : _a.call(token);
});
var GarbageCollector = (
  /** @class */
  function() {
    function GarbageCollector2(clean, expireTime) {
      if (expireTime === void 0) {
        expireTime = 1e4;
      }
      this.token = {
        clean
      };
      this.expireTime = expireTime;
    }
    GarbageCollector2.prototype.open = function(target) {
      var _this = this;
      if (registry) {
        registry.register(target, this.token, this.token);
      } else {
        this.request = setTimeout(function() {
          var _a, _b;
          (_b = (_a = _this.token) === null || _a === void 0 ? void 0 : _a.clean) === null || _b === void 0 ? void 0 : _b.call(_a);
        }, this.expireTime);
      }
    };
    GarbageCollector2.prototype.close = function() {
      if (registry) {
        registry.unregister(this.token);
      } else {
        clearTimeout(this.request);
      }
    };
    return GarbageCollector2;
  }()
);

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/shared/immediate.js
var immediate = function(callback) {
  var disposed = false;
  Promise.resolve(0).then(function() {
    if (disposed) {
      disposed = false;
      return;
    }
    callback();
  });
  return function() {
    disposed = true;
  };
};

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/useDidUpdate.js
var useDidUpdate = function(callback) {
  var request = (0, import_react2.useRef)(null);
  request.current = immediate(callback);
  useLayoutEffect(function() {
    request.current();
    callback();
  });
};

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/useForceUpdate.js
var __read = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var EMPTY_ARRAY = [];
var RENDER_COUNT = { value: 0 };
var RENDER_QUEUE = /* @__PURE__ */ new Set();
function useForceUpdate() {
  var _a = __read((0, import_react3.useState)([]), 2), setState = _a[1];
  var firstRenderedRef = (0, import_react3.useRef)(false);
  var needUpdateRef = (0, import_react3.useRef)(false);
  useLayoutEffect(function() {
    firstRenderedRef.current = true;
    if (needUpdateRef.current) {
      setState([]);
      needUpdateRef.current = false;
    }
    return function() {
      firstRenderedRef.current = false;
    };
  }, EMPTY_ARRAY);
  var update = (0, import_react3.useCallback)(function() {
    setState([]);
  }, EMPTY_ARRAY);
  var scheduler = (0, import_react3.useCallback)(function() {
    if (!firstRenderedRef.current) {
      needUpdateRef.current = true;
      return;
    }
    if (RENDER_COUNT.value === 0) {
      update();
    } else {
      RENDER_QUEUE.add(update);
    }
  }, EMPTY_ARRAY);
  RENDER_COUNT.value++;
  useDidUpdate(function() {
    if (RENDER_COUNT.value > 0) {
      RENDER_COUNT.value--;
    }
    if (RENDER_COUNT.value === 0) {
      RENDER_QUEUE.forEach(function(update2) {
        RENDER_QUEUE.delete(update2);
        update2();
      });
    }
  });
  return scheduler;
}

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/useCompatFactory.js
var import_react5 = __toESM(require_react());

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/useCompatEffect.js
var import_react4 = __toESM(require_react());
var isArr = Array.isArray;
var isEqualDeps = function(target, source) {
  var arrA = isArr(target);
  var arrB = isArr(source);
  if (arrA !== arrB)
    return false;
  if (arrA) {
    if (target.length !== source.length)
      return false;
    return target.every(function(val, index) {
      return val === source[index];
    });
  }
  return target === source;
};
var useCompatEffect = function(effect, deps) {
  var depsRef = (0, import_react4.useRef)(null);
  var mountedRef = (0, import_react4.useRef)(false);
  (0, import_react4.useEffect)(function() {
    mountedRef.current = true;
    var dispose = effect();
    return function() {
      mountedRef.current = false;
      if (!isEqualDeps(depsRef.current, deps)) {
        if (dispose)
          dispose();
        return;
      }
      immediate(function() {
        if (mountedRef.current)
          return;
        if (dispose)
          dispose();
      });
    };
  }, deps);
  depsRef.current = deps;
};

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/useCompatFactory.js
var __read2 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var ObjectToBeRetainedByReact = (
  /** @class */
  /* @__PURE__ */ function() {
    function ObjectToBeRetainedByReact2() {
    }
    return ObjectToBeRetainedByReact2;
  }()
);
function objectToBeRetainedByReactFactory() {
  return new ObjectToBeRetainedByReact();
}
var useCompatFactory = function(factory) {
  var instRef = import_react5.default.useRef(null);
  var gcRef = import_react5.default.useRef();
  var _a = __read2(import_react5.default.useState(objectToBeRetainedByReactFactory), 1), objectRetainedByReact = _a[0];
  if (!instRef.current) {
    instRef.current = factory();
  }
  if (!gcRef.current) {
    gcRef.current = new GarbageCollector(function() {
      if (instRef.current) {
        instRef.current.dispose();
      }
    });
    gcRef.current.open(objectRetainedByReact);
  }
  useCompatEffect(function() {
    gcRef.current.close();
    return function() {
      if (instRef.current) {
        instRef.current.dispose();
        instRef.current = null;
      }
    };
  }, []);
  return instRef.current;
};

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/useObserver.js
var useObserver = function(view, options) {
  var forceUpdate = useForceUpdate();
  var tracker = useCompatFactory(function() {
    return new Tracker(function() {
      if (typeof (options === null || options === void 0 ? void 0 : options.scheduler) === "function") {
        options.scheduler(forceUpdate);
      } else {
        forceUpdate();
      }
    }, options === null || options === void 0 ? void 0 : options.displayName);
  });
  return tracker.track(view);
};

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/observer.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function observer(component, options) {
  var realOptions = __assign({ forwardRef: false }, options);
  var wrappedComponent = realOptions.forwardRef ? (0, import_react6.forwardRef)(function(props, ref) {
    return useObserver(function() {
      return component(__assign(__assign({}, props), { ref }));
    }, realOptions);
  }) : function(props) {
    return useObserver(function() {
      return component(props);
    }, realOptions);
  };
  var memoComponent = (0, import_react6.memo)(wrappedComponent);
  (0, import_hoist_non_react_statics.default)(memoComponent, component);
  if (realOptions.displayName) {
    memoComponent.displayName = realOptions.displayName;
  }
  return memoComponent;
}
var Observer = observer(function(props) {
  var children = typeof props.children === "function" ? props.children() : props.children;
  return import_react6.default.createElement(import_react6.Fragment, {}, children);
});

// ../../node_modules/.pnpm/@formily+reactive-react@2.3.7_fmqnd34xo2h2ici5ffxzbquo6m/node_modules/@formily/reactive-react/esm/hooks/index.js
var unstable_useForceUpdate = useForceUpdate;
var unstable_useCompatEffect = useCompatEffect;
var unstable_useCompatFactory = useCompatFactory;
var unstable_useDidUpdate = useDidUpdate;
var unstable_useLayoutEffect = useLayoutEffect;
var unstable_useObserver = useObserver;

export {
  require_hoist_non_react_statics_cjs,
  observer,
  Observer,
  unstable_useForceUpdate,
  unstable_useCompatEffect,
  unstable_useCompatFactory,
  unstable_useDidUpdate,
  unstable_useLayoutEffect,
  unstable_useObserver
};
/*! Bundled license information:

react-is/cjs/react-is.development.js:
  (** @license React v16.13.1
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=chunk-SBR2TICO.js.map
