#!/usr/bin/env node
import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Pipeable.js
var pipeArguments = (self, args2) => {
  switch (args2.length) {
    case 0:
      return self;
    case 1:
      return args2[0](self);
    case 2:
      return args2[1](args2[0](self));
    case 3:
      return args2[2](args2[1](args2[0](self)));
    case 4:
      return args2[3](args2[2](args2[1](args2[0](self))));
    case 5:
      return args2[4](args2[3](args2[2](args2[1](args2[0](self)))));
    case 6:
      return args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))));
    case 7:
      return args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))));
    case 8:
      return args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))))));
    case 9:
      return args2[8](args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))))));
    default: {
      let ret = self;
      for (let i = 0, len = args2.length; i < len; i++) {
        ret = args2[i](ret);
      }
      return ret;
    }
  }
};
var Prototype = {
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var Class = /* @__PURE__ */ (function() {
  function PipeableBase() {
  }
  PipeableBase.prototype = Prototype;
  return PipeableBase;
})();

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Function.js
var dual = function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      return arity(arguments) ? body.apply(this, arguments) : (self) => body(self, ...arguments);
    };
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self) {
          return body(self, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self) {
          return body(self, a, b);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args2 = arguments;
        return function(self) {
          return body(self, ...args2);
        };
      };
  }
};
var identity = (a) => a;
var constant = (value3) => () => value3;
var constTrue = /* @__PURE__ */ constant(true);
var constFalse = /* @__PURE__ */ constant(false);
var constUndefined = /* @__PURE__ */ constant(void 0);
var constVoid = constUndefined;
function pipe(a, ...args2) {
  return pipeArguments(a, args2);
}
function memoize(f) {
  const cache2 = /* @__PURE__ */ new WeakMap();
  return (a) => {
    const cached2 = cache2.get(a);
    if (cached2 !== void 0) return cached2;
    const result3 = f(a);
    cache2.set(a, result3);
    return result3;
  };
}
function memoizeIdempotent(f) {
  const cache2 = /* @__PURE__ */ new WeakMap();
  return (a) => {
    const cached2 = cache2.get(a);
    if (cached2 !== void 0) return cached2;
    const result3 = f(a);
    cache2.set(a, result3);
    if (result3 !== a) {
      cache2.set(result3, result3);
    }
    return result3;
  };
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/equal.js
var getAllObjectKeys = (obj) => {
  const keys = new Set(Reflect.ownKeys(obj));
  if (obj.constructor === Object) return keys;
  if (obj instanceof Error) {
    keys.delete("stack");
  }
  const proto2 = Object.getPrototypeOf(obj);
  let current = proto2;
  while (current !== null && current !== Object.prototype) {
    const ownKeys = Reflect.ownKeys(current);
    for (let i = 0; i < ownKeys.length; i++) {
      keys.add(ownKeys[i]);
    }
    current = Object.getPrototypeOf(current);
  }
  if (keys.has("constructor") && typeof obj.constructor === "function" && proto2 === obj.constructor.prototype) {
    keys.delete("constructor");
  }
  return keys;
};
var byReferenceInstances = /* @__PURE__ */ new WeakSet();
var viewBytes = (view) => new Uint8Array(view.buffer, view.byteOffset, view.byteLength);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/hash.js
var backEdges = 0;
var addBackEdge = () => {
  backEdges++;
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Predicate.js
function isString(input) {
  return typeof input === "string";
}
function isNumber(input) {
  return typeof input === "number";
}
function isBoolean(input) {
  return typeof input === "boolean";
}
function isSymbol(input) {
  return typeof input === "symbol";
}
function isPropertyKey(u) {
  return isString(u) || isNumber(u) || isSymbol(u);
}
function isFunction(input) {
  return typeof input === "function";
}
function isUndefined(input) {
  return input === void 0;
}
function isNotUndefined(input) {
  return input !== void 0;
}
function isNotNull(input) {
  return input !== null;
}
function isNullish(input) {
  return input === null || input === void 0;
}
function isNotNullish(input) {
  return input != null;
}
function isUnknown(_) {
  return true;
}
function isObject(input) {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}
function isObjectKeyword(input) {
  return typeof input === "object" && input !== null || isFunction(input);
}
var hasProperty = /* @__PURE__ */ dual(2, (self, property) => isObjectKeyword(self) && property in self);
var isTagged = /* @__PURE__ */ dual(2, (self, tag2) => hasProperty(self, "_tag") && self["_tag"] === tag2);
function isError(input) {
  return input instanceof Error;
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Hash.js
var symbol = "~effect/Hash";
var hash = (self) => {
  switch (typeof self) {
    case "number":
      return number(self);
    case "bigint":
      return string(self.toString(10));
    case "string":
      return string(self);
    case "function":
    case "object": {
      if (self === null) {
        break;
      } else if (self instanceof Date) {
        if (Number.isNaN(self.getTime())) {
          return string("Invalid Date");
        }
        return string(self.toISOString());
      } else if (self instanceof RegExp) {
        return string(self.toString());
      } else {
        if (byReferenceInstances.has(self)) {
          return random(self);
        }
        const cached2 = hashCache.get(self);
        if (cached2 !== void 0) {
          return cached2;
        }
        if (visitedObjects.has(self)) {
          addBackEdge();
          return string("[Circular]");
        }
        visitedObjects.add(self);
        const seen = backEdges;
        let h;
        try {
          if (symbol in self) {
            h = self[symbol]();
          } else if (typeof self === "function") {
            h = random(self);
          } else if (self instanceof DataView) {
            h = array(viewBytes(self));
          } else if (Array.isArray(self) || ArrayBuffer.isView(self)) {
            h = array(self);
          } else if (self instanceof Map) {
            h = hashMap(self);
          } else if (self instanceof Set) {
            h = hashSet(self);
          } else {
            h = structure(self);
          }
        } finally {
          visitedObjects.delete(self);
        }
        if (seen === backEdges) {
          hashCache.set(self, h);
        }
        return h;
      }
    }
  }
  return optimize(mix(string(String(self))));
};
var random = (self) => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, optimize(Math.random() * 4294967296 | 0));
  }
  return randomHashCache.get(self);
};
var mix = (h) => {
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  return h ^ h >>> 16;
};
var combine = /* @__PURE__ */ dual(2, (self, b) => mix(Math.imul(self, 2654435761) + Math.imul(b, 2246822507)));
var optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
var float64 = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
var number = (n) => {
  const h = n | 0;
  if (h === n) {
    return optimize(h);
  }
  float64.setFloat64(0, n !== n ? NaN : n);
  return optimize(combine(float64.getInt32(0), float64.getInt32(4)));
};
var string = (str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
var structureKeys = (o, keys) => {
  let h = 12289;
  for (const key of keys) {
    h ^= combine(hash(key), hash(o[key]));
  }
  return optimize(h);
};
var structure = (o) => structureKeys(o, getAllObjectKeys(o));
var unordered = (seed, f) => (iter) => {
  let h = seed;
  for (const element of iter) {
    h ^= f(element);
  }
  return optimize(h);
};
var array = (arr) => {
  let h = 6151;
  for (const element of arr) {
    h = combine(h, hash(element));
  }
  return optimize(h);
};
var hashMap = /* @__PURE__ */ unordered(/* @__PURE__ */ string("Map"), ([k, v]) => combine(hash(k), hash(v)));
var setSeed = /* @__PURE__ */ string("Set");
var hashSet = /* @__PURE__ */ unordered(setSeed, (element) => combine(setSeed, hash(element)));
var randomHashCache = /* @__PURE__ */ new WeakMap();
var hashCache = /* @__PURE__ */ new WeakMap();
var visitedObjects = /* @__PURE__ */ new WeakSet();

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Equal.js
var symbol2 = "~effect/Equal";
function equals() {
  if (arguments.length === 1) {
    return (self) => compareBoth(self, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
  if (self === that) return true;
  if (self == null || that == null) return false;
  const selfType = typeof self;
  if (selfType !== typeof that) {
    return false;
  }
  if (selfType === "number" && self !== self && that !== that) {
    return true;
  }
  if (selfType !== "object" && selfType !== "function") {
    return false;
  }
  if (byReferenceInstances.has(self) || byReferenceInstances.has(that)) {
    return false;
  }
  return compareObjects(self, that);
}
function compareObjects(self, that) {
  const depth = pathLeft.length;
  for (let i = depth; i-- > 0; ) {
    if (pathLeft[i] === self && pathRight[i] === that) return true;
  }
  if (depth) return compareOnPath(self, that);
  let known = results.get(self);
  if (!known) results.set(self, known = /* @__PURE__ */ new WeakMap());
  let result3 = known.get(that);
  if (result3 === void 0) known.set(that, result3 = compareOnPath(self, that));
  return result3;
}
function compareOnPath(self, that) {
  pathLeft.push(self);
  pathRight.push(that);
  try {
    return compareStructure(self, that);
  } finally {
    pathLeft.pop();
    pathRight.pop();
  }
}
var pathLeft = [];
var pathRight = [];
var results = /* @__PURE__ */ new WeakMap();
function compareStructure(self, that) {
  if (hash(self) !== hash(that)) {
    return false;
  } else if (self instanceof Date) {
    if (!(that instanceof Date)) return false;
    const selfTime = self.getTime();
    const thatTime = that.getTime();
    return selfTime === thatTime || Number.isNaN(selfTime) && Number.isNaN(thatTime);
  } else if (self instanceof RegExp) {
    return that instanceof RegExp && self.toString() === that.toString();
  }
  const bothEquals = isEqual(self);
  if (bothEquals !== isEqual(that) || typeof self === "function" && !bothEquals) {
    return false;
  } else if (bothEquals) {
    return self[symbol2](that);
  } else if (Array.isArray(self)) {
    if (!Array.isArray(that) || self.length !== that.length) {
      return false;
    }
    return compareArrays(self, that);
  } else if (ArrayBuffer.isView(self)) {
    const selfIsDataView = self instanceof DataView;
    if (!ArrayBuffer.isView(that) || self.byteLength !== that.byteLength || selfIsDataView !== that instanceof DataView) {
      return false;
    }
    if (selfIsDataView) {
      return compareTypedArrays(viewBytes(self), viewBytes(that));
    }
    return compareTypedArrays(self, that);
  } else if (self instanceof Map) {
    if (!(that instanceof Map) || self.size !== that.size) {
      return false;
    }
    return compareHashed(self, that, entryHash, equalEntries);
  } else if (self instanceof Set) {
    if (!(that instanceof Set) || self.size !== that.size) {
      return false;
    }
    return compareHashed(self, that, hash, compareBoth);
  }
  return compareRecords(self, that);
}
function compareArrays(self, that) {
  for (let i = 0; i < self.length; i++) {
    if (!compareBoth(self[i], that[i])) {
      return false;
    }
  }
  return true;
}
function compareTypedArrays(self, that) {
  if (self.length !== that.length) {
    return false;
  }
  for (let i = 0; i < self.length; i++) {
    if (self[i] !== that[i]) {
      return false;
    }
  }
  return true;
}
function compareRecords(self, that) {
  const selfKeys = getAllObjectKeys(self);
  const thatKeys = getAllObjectKeys(that);
  if (selfKeys.size !== thatKeys.size) {
    return false;
  }
  for (const key of selfKeys) {
    if (!thatKeys.has(key) || !compareBoth(self[key], that[key])) {
      return false;
    }
  }
  return true;
}
function compareHashed(self, that, hashOf, equivalent) {
  const groups = /* @__PURE__ */ new Map();
  let remaining = 0;
  for (const item of that) {
    const h = hashOf(item);
    const group = groups.get(h);
    if (group) group.push(item);
    else groups.set(h, [item]);
    remaining++;
  }
  outer: for (const item of self) {
    const group = groups.get(hashOf(item));
    if (group) {
      for (let i = 0; i < group.length; i++) {
        if (equivalent(item, group[i])) {
          group[i] = group[group.length - 1];
          group.pop();
          remaining--;
          continue outer;
        }
      }
    }
    return false;
  }
  return remaining === 0;
}
var entryHash = (entry) => hash(entry[0]);
var equalEntries = (self, that) => compareBoth(self[0], that[0]) && compareBoth(self[1], that[1]);
var isEqual = (u) => hasProperty(u, symbol2);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Redactable.js
var symbolRedactable = /* @__PURE__ */ Symbol.for("~effect/Redactable");
var isRedactable = (u) => hasProperty(u, symbolRedactable);
function redact(u) {
  if (isRedactable(u)) return getRedacted(u);
  return u;
}
function getRedacted(redactable) {
  return redactable[symbolRedactable](globalThis[currentFiberTypeId]?.context ?? emptyContext);
}
var currentFiberTypeId = "~effect/Fiber/currentFiber";
var emptyMap = /* @__PURE__ */ new Map();
var emptyContext = {
  "~effect/Context": {},
  base: emptyMap,
  depth: 0,
  mapUnsafe: emptyMap,
  pipe() {
    return pipeArguments(this, arguments);
  }
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Formatter.js
function format(input, options) {
  const space = options?.space ?? 0;
  const ancestors = /* @__PURE__ */ new WeakSet();
  const gap = !space ? "" : typeof space === "number" ? " ".repeat(space) : space;
  const ind = (d) => gap.repeat(d);
  const wrap = (v, body) => {
    const ctor = v?.constructor;
    return ctor && ctor !== Object.prototype.constructor && ctor.name ? `${ctor.name}(${body})` : body;
  };
  const ownKeys = (o) => {
    try {
      return Reflect.ownKeys(o);
    } catch {
      return ["[ownKeys threw]"];
    }
  };
  function recur(v, d = 0) {
    try {
      return recurUnsafe(v, d);
    } catch {
      if (typeof v === "object" && v !== null || typeof v === "function") ancestors.delete(v);
      return "[inspection threw]";
    }
  }
  function recurUnsafe(v, d = 0) {
    if (typeof v === "string") return JSON.stringify(v);
    if (typeof v === "number" || v == null || typeof v === "boolean" || typeof v === "symbol") return String(v);
    if (typeof v === "bigint") return String(v) + "n";
    if (typeof v === "object" || typeof v === "function") {
      if (ancestors.has(v)) return CIRCULAR;
      ancestors.add(v);
      let output;
      if (symbolRedactable in v) {
        output = recur(getRedacted(v), d);
      } else if (Array.isArray(v)) {
        output = !gap || v.length <= 1 ? `[${v.map((x) => recur(x, d)).join(",")}]` : `[
${ind(d + 1)}${v.map((x) => recur(x, d + 1)).join(",\n" + ind(d + 1))}
${ind(d)}]`;
      } else if (v instanceof Date) {
        output = formatDate(v);
      } else if (!options?.ignoreToString && hasProperty(v, "toString") && typeof v["toString"] === "function" && v["toString"] !== Object.prototype.toString && v["toString"] !== Array.prototype.toString) {
        const s = safeToString(v);
        output = v instanceof Error && v.cause !== void 0 ? `${s} (cause: ${recur(v.cause, d)})` : s;
      } else if (Symbol.iterator in v) {
        output = `${v.constructor.name}(${recur(Array.from(v), d)})`;
      } else {
        const keys = ownKeys(v);
        if (!gap || keys.length <= 1) {
          const body = `{${keys.map((k) => `${formatPropertyKey(k)}:${recur(safeGet(v, k), d)}`).join(",")}}`;
          output = wrap(v, body);
        } else {
          const body = `{
${keys.map((k) => `${ind(d + 1)}${formatPropertyKey(k)}: ${recur(safeGet(v, k), d + 1)}`).join(",\n")}
${ind(d)}}`;
          output = wrap(v, body);
        }
      }
      ancestors.delete(v);
      return output;
    }
    return String(v);
  }
  return recur(input, 0);
}
var CIRCULAR = "[Circular]";
function formatPropertyKey(name) {
  return typeof name === "string" ? JSON.stringify(name) : String(name);
}
function formatPath(path) {
  return path.map((key) => `[${formatPropertyKey(key)}]`).join("");
}
function formatDate(date) {
  try {
    return date.toISOString();
  } catch {
    return "Invalid Date";
  }
}
function safeToString(input) {
  try {
    const s = input.toString();
    return typeof s === "string" ? s : String(s);
  } catch {
    return "[toString threw]";
  }
}
function safeGet(input, key) {
  try {
    return input[key];
  } catch {
    return "[property access threw]";
  }
}
function formatJson(input, options) {
  const ancestors = [];
  return JSON.stringify(input, function(key, value3) {
    const original = Object.getOwnPropertyDescriptor(this, key)?.value;
    const redacted = hasProperty(original, symbolRedactable) ? redact(original) : redact(value3);
    if (typeof redacted === "bigint") {
      return format(redacted);
    }
    if (typeof redacted !== "object" || redacted === null) {
      return redacted;
    }
    const current = redacted instanceof Error && !hasProperty(redacted, "toJSON") ? {
      ...redacted,
      name: redacted.name,
      message: redacted.message
    } : redacted;
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(redacted)) {
      return void 0;
    }
    ancestors.push(redacted);
    if (current !== redacted) {
      ancestors.push(current);
    }
    if (!hasGetter(current) || isJsonPrimitiveWrapper(current)) {
      return current;
    }
    const serialized = new Proxy(current, {
      get(target, key2) {
        const value4 = Reflect.get(target, key2, target);
        return Object.getOwnPropertyDescriptor(target, key2)?.get !== void 0 ? redact(value4) : value4;
      }
    });
    ancestors.push(serialized);
    return serialized;
  }, options?.space) ?? "null";
}
function hasGetter(object) {
  for (const key of Object.getOwnPropertyNames(object)) {
    if (Object.getOwnPropertyDescriptor(object, key)?.get !== void 0) {
      return true;
    }
  }
  return false;
}
function isJsonPrimitiveWrapper(object) {
  for (const valueOf of [Number.prototype.valueOf, Boolean.prototype.valueOf, String.prototype.valueOf]) {
    try {
      Reflect.apply(valueOf, object, []);
      return true;
    } catch {
    }
  }
  return false;
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Inspectable.js
var NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
var toJson = (input) => {
  try {
    input = redact(input);
    if (hasProperty(input, "toJSON") && isFunction(input["toJSON"]) && input["toJSON"].length === 0) {
      return input.toJSON();
    } else if (Array.isArray(input)) {
      return input.map(toJson);
    }
    return input;
  } catch {
    return "[toJSON threw]";
  }
};
var toStringUnknown = (u, whitespace = 2) => {
  if (typeof u === "string") {
    return u;
  }
  try {
    return typeof u === "object" ? formatJson(u, {
      space: whitespace
    }) : format(u, {
      space: whitespace
    });
  } catch {
    return String(u);
  }
};
var BaseProto = {
  toJSON() {
    return toJson(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var Class2 = class {
  /**
   * Node.js custom inspection method.
   *
   * **When to use**
   *
   * Use to expose the class JSON representation to Node.js inspection.
   *
   * @since 2.0.0
   */
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  /**
   * Returns a formatted string representation of this object.
   *
   * **When to use**
   *
   * Use to format the class JSON representation as a string.
   *
   * @since 2.0.0
   */
  toString() {
    return format(this.toJSON());
  }
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/stackTraceLimit.js
var isStackTraceLimitWritable = () => {
  const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  if (desc === void 0) {
    return Object.isExtensible(Error);
  }
  return Object.hasOwn(desc, "writable") ? desc.writable === true : desc.set !== void 0;
};
var canWriteStackTraceLimit = /* @__PURE__ */ isStackTraceLimitWritable();
var getStackTraceLimit = () => Error.stackTraceLimit;
var setStackTraceLimit = (value3) => {
  if (canWriteStackTraceLimit) {
    ;
    Error.stackTraceLimit = value3;
  }
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Utils.js
var SingleShotGen = class {
  constructor(self) {
    this.value = self;
    this.done = false;
  }
  /**
   * Yields the stored value once, then completes with the value sent back in.
   *
   * **When to use**
   *
   * Use to advance a `SingleShotGen` through its single yield and completion
   * step.
   *
   * @since 2.0.0
   */
  next(a) {
    if (this.done) {
      this.value = a;
      return this;
    }
    this.done = true;
    return {
      value: this.value,
      done: false
    };
  }
};
var pickInternalCall = () => {
  const InternalTypeId = "~effect/Utils/internal";
  const standard = {
    [InternalTypeId]: (body) => {
      return body();
    }
  };
  const forced = {
    [InternalTypeId]: (body) => {
      try {
        return body();
      } finally {
      }
    }
  };
  const isNotOptimizedAway = getStackTraceLimit() !== 0 && standard[InternalTypeId](() => new Error().stack)?.includes(InternalTypeId) === true;
  return isNotOptimizedAway ? standard[InternalTypeId] : forced[InternalTypeId];
};
var internalCall = /* @__PURE__ */ pickInternalCall();

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/record.js
function assignProperty(self, key, value3) {
  if (key === "__proto__") {
    Object.defineProperty(self, key, {
      value: value3,
      writable: true,
      enumerable: true,
      configurable: true
    });
  } else {
    ;
    self[key] = value3;
  }
}
function assignProperties(self, source) {
  for (const key of Reflect.ownKeys(source)) {
    if (Object.prototype.propertyIsEnumerable.call(source, key)) {
      assignProperty(self, key, source[key]);
    }
  }
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/core.js
var EffectTypeId = `~effect/Effect`;
var ExitTypeId = `~effect/Exit`;
var effectVariance = {
  _A: identity,
  _E: identity,
  _R: identity
};
var identifier = `${EffectTypeId}/identifier`;
var args = `${EffectTypeId}/args`;
var evaluate = `${EffectTypeId}/evaluate`;
var contA = `${EffectTypeId}/successCont`;
var contE = `${EffectTypeId}/failureCont`;
var contAll = `${EffectTypeId}/ensureCont`;
var Yield = /* @__PURE__ */ Symbol.for("effect/Effect/Yield");
var PipeInspectableProto = {
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON() {
    return {
      ...this
    };
  },
  toString() {
    return format(this.toJSON(), {
      ignoreToString: true,
      space: 2
    });
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var StructuralProto = {
  [symbol]() {
    return structureKeys(this, Object.keys(this));
  },
  [symbol2](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) return false;
    for (let i = 0; i < selfKeys.length; i++) {
      if (selfKeys[i] !== thatKeys[i] || !equals(this[selfKeys[i]], that[selfKeys[i]])) {
        return false;
      }
    }
    return true;
  }
};
var EffectProto = {
  [EffectTypeId]: effectVariance,
  ...PipeInspectableProto,
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  },
  toJSON() {
    return {
      _id: "Effect",
      op: this[identifier],
      ...args in this ? {
        args: this[args]
      } : void 0
    };
  }
};
var isEffect = (u) => hasProperty(u, EffectTypeId);
var isExit = (u) => hasProperty(u, ExitTypeId);
var CauseTypeId = "~effect/Cause";
var CauseReasonTypeId = "~effect/Cause/Reason";
var isCause = (self) => hasProperty(self, CauseTypeId);
var CauseImpl = class {
  constructor(failures) {
    this[CauseTypeId] = CauseTypeId;
    this.reasons = failures;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Cause",
      failures: this.reasons.map((f) => f.toJSON())
    };
  }
  toString() {
    return `Cause(${format(this.reasons)})`;
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [symbol2](that) {
    return isCause(that) && this.reasons.length === that.reasons.length && this.reasons.every((e, i) => equals(e, that.reasons[i]));
  }
  [symbol]() {
    return array(this.reasons);
  }
};
var annotationsMap = /* @__PURE__ */ new WeakMap();
var ReasonBase = class {
  [CauseReasonTypeId];
  annotations;
  _tag;
  constructor(_tag, annotations, originalError) {
    this[CauseReasonTypeId] = CauseReasonTypeId;
    this._tag = _tag;
    if (annotations !== constEmptyAnnotations && typeof originalError === "object" && originalError !== null && annotations.size > 0) {
      const prevAnnotations = annotationsMap.get(originalError);
      if (prevAnnotations) {
        annotations = new Map([...prevAnnotations, ...annotations]);
      }
      annotationsMap.set(originalError, annotations);
    }
    this.annotations = annotations;
  }
  annotate(annotations, options) {
    if (annotations.mapUnsafe.size === 0) return this;
    const newAnnotations = new Map(this.annotations);
    annotations.mapUnsafe.forEach((value3, key) => {
      if (options?.overwrite !== true && newAnnotations.has(key)) return;
      newAnnotations.set(key, value3);
    });
    const self = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    self.annotations = newAnnotations;
    return self;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toString() {
    return format(this);
  }
  [NodeInspectSymbol]() {
    return this.toString();
  }
};
var constEmptyAnnotations = /* @__PURE__ */ new Map();
var Fail = class extends ReasonBase {
  constructor(error2, annotations = constEmptyAnnotations) {
    super("Fail", annotations, error2);
    this.error = error2;
  }
  toString() {
    return `Fail(${format(this.error)})`;
  }
  toJSON() {
    return {
      _tag: "Fail",
      error: this.error
    };
  }
  [symbol2](that) {
    return isFailReason(that) && equals(this.error, that.error) && equals(this.annotations, that.annotations);
  }
  [symbol]() {
    return combine(string(this._tag))(combine(hash(this.error))(hash(this.annotations)));
  }
};
var causeFromReasons = (reasons) => new CauseImpl(reasons);
var dedupeReasons = (self, that) => {
  const buckets = /* @__PURE__ */ new Map();
  const out = [];
  for (const reason of self.concat(that)) {
    const hash2 = hash(reason);
    const bucket = buckets.get(hash2);
    if (bucket === void 0) {
      buckets.set(hash2, [reason]);
    } else if (bucket.some((previous) => equals(previous, reason))) {
      continue;
    } else {
      bucket.push(reason);
    }
    out.push(reason);
  }
  return out;
};
var causeCombine = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.reasons.length === 0) {
    return that;
  } else if (that.reasons.length === 0) {
    return self;
  }
  const newCause = new CauseImpl(dedupeReasons(self.reasons, that.reasons));
  return equals(self, newCause) ? self : newCause;
});
var causeEmpty = /* @__PURE__ */ new CauseImpl([]);
var causeFail = (error2) => new CauseImpl([new Fail(error2)]);
var Die = class extends ReasonBase {
  constructor(defect, annotations = constEmptyAnnotations) {
    super("Die", annotations, defect);
    this.defect = defect;
  }
  toString() {
    return `Die(${format(this.defect)})`;
  }
  toJSON() {
    return {
      _tag: "Die",
      defect: this.defect
    };
  }
  [symbol2](that) {
    return isDieReason(that) && equals(this.defect, that.defect) && equals(this.annotations, that.annotations);
  }
  [symbol]() {
    return combine(string(this._tag))(combine(hash(this.defect))(hash(this.annotations)));
  }
};
var causeDie = (defect) => new CauseImpl([new Die(defect)]);
var causeAnnotate = /* @__PURE__ */ dual((args2) => isCause(args2[0]), (self, annotations, options) => {
  if (annotations.mapUnsafe.size === 0) return self;
  return new CauseImpl(self.reasons.map((f) => f.annotate(annotations, options)));
});
var isFailReason = (self) => self._tag === "Fail";
var isDieReason = (self) => self._tag === "Die";
var isInterruptReason = (self) => self._tag === "Interrupt";
function defaultEvaluate(_fiber) {
  return exitDie(`Effect.evaluate: Not implemented`);
}
var makePrimitiveProto = (options) => ({
  ...EffectProto,
  [identifier]: options.op,
  [evaluate]: options[evaluate] ?? defaultEvaluate,
  [contA]: options[contA],
  [contE]: options[contE],
  [contAll]: options[contAll]
});
var makePrimitive = (options) => {
  const Proto9 = makePrimitiveProto(options);
  const PrimitiveImpl = function(value3) {
    this[args] = value3;
  };
  PrimitiveImpl.prototype = Proto9;
  return function(value3) {
    return new PrimitiveImpl(value3);
  };
};
var makeExit = (options) => {
  const Proto9 = {
    [ExitTypeId]: ExitTypeId,
    _tag: options.op,
    get [options.prop]() {
      return this[args];
    },
    ...makePrimitiveProto(options),
    toString() {
      return `${options.op}(${format(this[args])})`;
    },
    toJSON() {
      return {
        _id: "Exit",
        _tag: options.op,
        [options.prop]: this[args]
      };
    },
    [symbol2](that) {
      return isExit(that) && that._tag === this._tag && equals(this[args], that[args]);
    },
    [symbol]() {
      return combine(string(options.op), hash(this[args]));
    }
  };
  const ExitPrimitive = function(value3) {
    this[args] = value3;
  };
  ExitPrimitive.prototype = Proto9;
  return function(value3) {
    return new ExitPrimitive(value3);
  };
};
var exitSucceed = /* @__PURE__ */ makeExit({
  op: "Success",
  prop: "value",
  [evaluate](fiber2) {
    const cont = fiber2.getCont(contA);
    return cont ? cont[contA](this[args], fiber2, this) : fiber2.yieldWith(this);
  }
});
var StackTraceKey = {
  key: "effect/Cause/StackTrace"
};
var InterruptorStackTrace = {
  key: "effect/Cause/InterruptorStackTrace"
};
var exitFailCause = /* @__PURE__ */ makeExit({
  op: "Failure",
  prop: "cause",
  [evaluate](fiber2) {
    let cause = this[args];
    let annotated = false;
    if (fiber2.cache.stackFrame) {
      cause = causeAnnotate(cause, {
        mapUnsafe: /* @__PURE__ */ new Map([[StackTraceKey.key, fiber2.cache.stackFrame]])
      });
      annotated = true;
    }
    let cont = fiber2.getCont(contE);
    const interruptedCause = fiber2._interruptedCause;
    if (interruptedCause && fiber2.interruptible) {
      let skippedHandler = false;
      while (cont && fiber2.interruptible) {
        skippedHandler ||= identifier in cont;
        cont = fiber2.getCont(contE);
      }
      if (skippedHandler) {
        cause = causeFromReasons(cause.reasons.filter((reason) => reason._tag !== "Fail"));
      }
      cause = causeCombine(cause, interruptedCause);
      annotated = true;
    }
    return cont ? cont[contE](cause, fiber2, annotated ? void 0 : this) : fiber2.yieldWith(annotated ? exitFailCause(cause) : this);
  }
});
var exitFail = (e) => exitFailCause(causeFail(e));
var exitDie = (defect) => exitFailCause(causeDie(defect));
var withFiber = /* @__PURE__ */ makePrimitive({
  op: "WithFiber",
  [evaluate](fiber2) {
    return this[args](fiber2);
  }
});
var withFiberSucceed = /* @__PURE__ */ makePrimitive({
  op: "WithFiberSucceed",
  [evaluate](fiber2) {
    const value3 = this[args](fiber2);
    const cont = fiber2.getCont(contA);
    return cont ? cont[contA](value3, fiber2) : fiber2.yieldWith(exitSucceed(value3));
  }
});
var YieldableError = /* @__PURE__ */ (function() {
  class YieldableError2 extends globalThis.Error {
  }
  const proto2 = /* @__PURE__ */ makePrimitiveProto({
    op: "YieldableError",
    [evaluate]() {
      return exitFail(this);
    }
  });
  delete proto2.toString;
  Object.assign(YieldableError2.prototype, proto2);
  return YieldableError2;
})();
var Error2 = /* @__PURE__ */ (function() {
  const plainArgsSymbol = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
  return class Base extends YieldableError {
    constructor(args2) {
      super(args2?.message, args2?.cause ? {
        cause: args2.cause
      } : void 0);
      if (args2) {
        assignProperties(this, args2);
        Object.defineProperty(this, plainArgsSymbol, {
          value: args2,
          enumerable: false
        });
      }
    }
    toJSON() {
      return {
        ...this[plainArgsSymbol],
        ...this
      };
    }
  };
})();
var TaggedError = (tag2) => {
  class Base extends Error2 {
    _tag = tag2;
  }
  ;
  Base.prototype.name = tag2;
  return Base;
};
var NoSuchElementErrorTypeId = "~effect/Cause/NoSuchElementError";
var NoSuchElementError = class extends (/* @__PURE__ */ TaggedError("NoSuchElementError")) {
  [NoSuchElementErrorTypeId] = NoSuchElementErrorTypeId;
  constructor(message) {
    super({
      message
    });
  }
};
var DoneTypeId = "~effect/Cause/Done";
var isDone = (u) => hasProperty(u, DoneTypeId);
var DoneVoid = {
  [DoneTypeId]: DoneTypeId,
  _tag: "Done",
  value: void 0
};
var Done = (value3) => {
  if (value3 === void 0) return DoneVoid;
  return {
    [DoneTypeId]: DoneTypeId,
    _tag: "Done",
    value: value3
  };
};
var doneVoid = /* @__PURE__ */ exitFail(DoneVoid);
var done = (value3) => {
  if (value3 === void 0) return doneVoid;
  return exitFail(Done(value3));
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Effectable.js
var Prototype2 = (options) => makePrimitiveProto({
  op: options.label,
  [evaluate]: options.evaluate
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/option.js
var TypeId = "~effect/Option";
var CommonProto = {
  [TypeId]: {
    _A: (_) => _
  },
  ...PipeInspectableProto,
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
};
var SomeProto = /* @__PURE__ */ Object.defineProperty(/* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [symbol2](that) {
    return isOption(that) && isSome(that) && equals(this.value, that.value);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.value));
  },
  toString() {
    return `some(${format(this.value)})`;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJson(this.value)
    };
  }
}), "valueOrUndefined", {
  get() {
    return this.value;
  }
});
var NoneHash = /* @__PURE__ */ hash("None");
var NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  valueOrUndefined: void 0,
  [symbol2](that) {
    return isOption(that) && isNone(that);
  },
  [symbol]() {
    return NoneHash;
  },
  toString() {
    return `none()`;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
var isOption = (input) => hasProperty(input, TypeId);
var isNone = (fa) => fa._tag === "None";
var isSome = (fa) => fa._tag === "Some";
var none = /* @__PURE__ */ Object.create(NoneProto);
var SomeImpl = function(value3) {
  this.value = value3;
};
SomeImpl.prototype = SomeProto;
var some = (value3) => new SomeImpl(value3);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/result.js
var TypeId2 = "~effect/Result";
var CommonProto2 = {
  [TypeId2]: {
    /* v8 ignore next 2 */
    _A: (_) => _,
    _E: (_) => _
  },
  ...PipeInspectableProto,
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
};
var SuccessProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Success",
  _op: "Success",
  [symbol2](that) {
    return isResult(that) && isSuccess(that) && equals(this.success, that.success);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.success));
  },
  toString() {
    return `success(${format(this.success)})`;
  },
  toJSON() {
    return {
      _id: "Result",
      _tag: this._tag,
      value: toJson(this.success)
    };
  }
});
var FailureProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Failure",
  _op: "Failure",
  [symbol2](that) {
    return isResult(that) && isFailure(that) && equals(this.failure, that.failure);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.failure));
  },
  toString() {
    return `failure(${format(this.failure)})`;
  },
  toJSON() {
    return {
      _id: "Result",
      _tag: this._tag,
      failure: toJson(this.failure)
    };
  }
});
var isResult = (input) => hasProperty(input, TypeId2);
var isFailure = (result3) => result3._tag === "Failure";
var isSuccess = (result3) => result3._tag === "Success";
var FailureImpl = function(failure) {
  this.failure = failure;
};
FailureImpl.prototype = FailureProto;
var fail = (failure) => new FailureImpl(failure);
var SuccessImpl = function(success) {
  this.success = success;
};
SuccessImpl.prototype = SuccessProto;
var succeed = (success) => new SuccessImpl(success);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Order.js
function make(compare) {
  return (self, that) => self === that ? 0 : compare(self, that);
}
var Number2 = /* @__PURE__ */ make((self, that) => {
  if (globalThis.Number.isNaN(self) && globalThis.Number.isNaN(that)) return 0;
  if (globalThis.Number.isNaN(self)) return -1;
  if (globalThis.Number.isNaN(that)) return 1;
  return self < that ? -1 : 1;
});
var mapInput = /* @__PURE__ */ dual(2, (self, f) => make((b1, b2) => self(f(b1), f(b2))));
var isGreaterThan = (O) => dual(2, (self, that) => O(self, that) === 1);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Option.js
var none2 = () => none;
var some2 = some;
var isNone2 = isNone;
var isSome2 = isSome;
var match = /* @__PURE__ */ dual(2, (self, {
  onNone,
  onSome
}) => isNone2(self) ? onNone() : onSome(self.value));
var getOrElse = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? onNone() : self.value);
var fromNullishOr = (a) => a == null ? none2() : some2(a);
var fromUndefinedOr = (a) => a === void 0 ? none2() : some2(a);
var getOrUndefined = /* @__PURE__ */ getOrElse(constUndefined);
var map = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : some2(f(self.value)));
var flatMap = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : f(self.value));
var filter = /* @__PURE__ */ dual(2, (self, predicate) => isNone2(self) ? none2() : predicate(self.value) ? some2(self.value) : none2());
var exists = /* @__PURE__ */ dual(2, (self, refinement) => isNone2(self) ? false : refinement(self.value));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Context.js
var ServiceTypeId = "~effect/Context/Service";
var Service = function() {
  function KeyClass() {
  }
  const self = KeyClass;
  Object.setPrototypeOf(self, ServiceProto);
  const init = (key, options) => {
    self.key = key;
    if (options?.defaultValue) {
      self[ReferenceTypeId] = ReferenceTypeId;
      self.defaultValue = options.defaultValue;
    }
    if (options?.make) {
      ;
      self.make = options.make;
    }
    if (options?.fiberCached) {
      cacheKeys.add(key);
    }
    return self;
  };
  return arguments.length > 0 ? init(arguments[0], arguments[1]) : init;
};
var ServiceProto = {
  [ServiceTypeId]: ServiceTypeId,
  .../* @__PURE__ */ Prototype2({
    label: "Service",
    evaluate(fiber2) {
      return exitSucceed(get(fiber2.context, this));
    }
  }),
  toJSON() {
    return {
      _id: "Service",
      key: this.key
    };
  },
  of(self) {
    return self;
  },
  context(self) {
    return make2(this, self);
  },
  use(f) {
    return withFiber((fiber2) => f(get(fiber2.context, this)));
  },
  useSync(f) {
    return withFiber((fiber2) => exitSucceed(f(get(fiber2.context, this))));
  }
};
var cacheKeys = /* @__PURE__ */ new Set();
var ReferenceTypeId = "~effect/Context/Reference";
var TypeId3 = "~effect/Context";
var MaxDepth = 8;
var FlattenAfterBaseHits = 8;
var makeImpl = (cacheRoot, base, overlay, depth) => {
  const self = Object.create(Proto);
  self.cacheRoot = cacheRoot ?? self;
  self.base = base;
  self.overlay = overlay;
  self.depth = depth;
  self._flat = void 0;
  self.baseHits = 0;
  return self;
};
var applyOverlays = (map12, overlay) => {
  if (!overlay) return;
  applyOverlays(map12, overlay.parent);
  map12.set(overlay.key, overlay.value);
};
var flatten = (self) => {
  if (self._flat) return self._flat;
  if (!self.overlay) return self._flat = self.base;
  const map12 = new Map(self.base);
  applyOverlays(map12, self.overlay);
  return self._flat = map12;
};
var withFlat = (self, f) => {
  const map12 = new Map(self.mapUnsafe);
  f(map12);
  return makeUnsafe(map12);
};
var notFound = /* @__PURE__ */ Symbol();
var lookup = (self, key) => {
  const impl = self;
  for (let overlay = impl.overlay; overlay; overlay = overlay.parent) {
    if (overlay.key === key) return overlay.value;
  }
  const value3 = impl.base.get(key);
  if (value3 === void 0 && !impl.base.has(key)) return notFound;
  if (impl.overlay && ++impl.baseHits >= impl.base.size && impl.baseHits >= FlattenAfterBaseHits) {
    impl.base = flatten(impl);
    impl.overlay = void 0;
    impl.depth = 0;
  }
  return value3;
};
var makeUnsafe = (mapUnsafe) => makeImpl(void 0, mapUnsafe, void 0, 0);
var Proto = {
  get mapUnsafe() {
    return flatten(this);
  },
  ...PipeInspectableProto,
  [TypeId3]: {
    _Services: (_) => _
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.mapUnsafe).map(([key, value3]) => ({
        key,
        value: value3
      }))
    };
  },
  [symbol2](that) {
    if (!isContext(that)) return false;
    const self = this.mapUnsafe;
    const other = that.mapUnsafe;
    if (self.size !== other.size) return false;
    for (const [key, value3] of self) {
      if (!other.has(key) || !equals(value3, other.get(key))) return false;
    }
    return true;
  },
  [symbol]() {
    return number(this.mapUnsafe.size);
  }
};
var hasSameCache = (self, that) => self.cacheRoot === that.cacheRoot;
var isContext = (u) => hasProperty(u, TypeId3);
var isReference = (u) => !!u[ReferenceTypeId];
var empty = () => emptyContext2;
var emptyContext2 = /* @__PURE__ */ makeUnsafe(/* @__PURE__ */ new Map());
var make2 = (key, service3) => makeUnsafe(/* @__PURE__ */ new Map([[key.key, service3]]));
var add = /* @__PURE__ */ dual(3, (self, key, service3) => addUnsafe(self, key.key, service3));
var addUnsafe = (self, key, service3) => {
  const impl = self;
  const cacheRoot = cacheKeys.has(key) ? void 0 : impl.cacheRoot;
  if (impl.depth >= MaxDepth) {
    const map12 = new Map(impl.mapUnsafe);
    map12.set(key, service3);
    return makeImpl(cacheRoot, map12, void 0, 0);
  }
  return makeImpl(cacheRoot, impl.base, {
    key,
    value: service3,
    parent: impl.overlay
  }, impl.depth + 1);
};
var getOrUndefined2 = /* @__PURE__ */ dual(2, (self, key) => getOrUndefinedUnsafe(self, key.key));
var getOrUndefinedUnsafe = (self, key) => {
  const value3 = lookup(self, key);
  return value3 === notFound ? void 0 : value3;
};
var getUnsafe = /* @__PURE__ */ dual(2, (self, service3) => {
  const value3 = lookup(self, service3.key);
  if (value3 === notFound) {
    if (isReference(service3)) return getDefaultValue(service3);
    throw serviceNotFoundError(service3);
  }
  return value3;
});
var get = getUnsafe;
var defaultValueCacheKey = "~effect/Context/defaultValue";
var getDefaultValue = (ref) => {
  if (defaultValueCacheKey in ref) {
    return ref[defaultValueCacheKey];
  }
  return ref[defaultValueCacheKey] = ref.defaultValue();
};
var serviceNotFoundError = (service3) => {
  const error2 = new Error(`Service not found${service3.key ? `: ${String(service3.key)}` : ""}`);
  if (error2.stack) {
    const lines2 = error2.stack.split("\n");
    lines2.splice(1, 3);
    error2.stack = lines2.join("\n");
  }
  return error2;
};
var getOption = /* @__PURE__ */ dual(2, (self, service3) => {
  const value3 = lookup(self, service3.key);
  if (value3 !== notFound) return some2(value3);
  return isReference(service3) ? some2(getDefaultValue(service3)) : none2();
});
var merge = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.mapUnsafe.size === 0) return that;
  if (that.mapUnsafe.size === 0) return self;
  return withFlat(self, (map12) => that.mapUnsafe.forEach((value3, key) => map12.set(key, value3)));
});
var mergeAll = (...ctxs) => {
  const map12 = /* @__PURE__ */ new Map();
  for (let i = 0; i < ctxs.length; i++) {
    ctxs[i].mapUnsafe.forEach((value3, key) => {
      map12.set(key, value3);
    });
  }
  return makeUnsafe(map12);
};
var Reference = Service;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/array.js
var isArrayNonEmpty = (self) => self.length > 0;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/count.js
var normalize = (n) => n > 0 ? Math.floor(n) : 0;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Result.js
var succeed2 = succeed;
var fail2 = fail;
var isFailure2 = isFailure;
var match2 = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => isFailure2(self) ? onFailure(self.failure) : onSuccess(self.success));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Iterable.js
var findFirst = /* @__PURE__ */ dual(2, (self, f) => {
  let i = 0;
  for (const a of self) {
    const o = f(a, i);
    if (isBoolean(o)) {
      if (o) {
        return some2(a);
      }
    } else {
      if (isSome2(o)) {
        return o;
      }
    }
    i++;
  }
  return none2();
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Array.js
var Array2 = globalThis.Array;
var fromIterable = (collection) => Array2.isArray(collection) ? collection : Array2.from(collection);
var match3 = /* @__PURE__ */ dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isReadonlyArrayNonEmpty(self) ? onNonEmpty(self) : onEmpty());
var append = /* @__PURE__ */ dual(2, (self, last) => [...self, last]);
var isArray = Array2.isArray;
var isArrayNonEmpty2 = isArrayNonEmpty;
var isReadonlyArrayNonEmpty = isArrayNonEmpty;
function isCanonicalArrayIndex(key) {
  const index = Number(key);
  return String(index) === key && Number.isInteger(index) && index >= 0 && index < 2 ** 32 - 1;
}
var findFirstIndex = /* @__PURE__ */ dual(2, (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (predicate(a, i)) {
      return some2(i);
    }
    i++;
  }
  return none2();
});
var findFirst2 = findFirst;
var findLast = /* @__PURE__ */ dual(2, (self, f) => {
  const input = fromIterable(self);
  for (let i = input.length - 1; i >= 0; i--) {
    const a = input[i];
    const o = f(a, i);
    if (typeof o === "boolean") {
      if (o) {
        return some2(a);
      }
    } else {
      if (isSome2(o)) {
        return o;
      }
    }
  }
  return none2();
});
var empty2 = () => [];
var of = (a) => [a];
var map2 = /* @__PURE__ */ dual(2, (self, f) => self.map(f));
var reduce = /* @__PURE__ */ dual(3, (self, b, f) => fromIterable(self).reduce((b2, a, i) => f(b2, a, i), b));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Duration.js
var TypeId4 = "~effect/Duration";
var bigint0 = /* @__PURE__ */ BigInt(0);
var bigint1 = /* @__PURE__ */ BigInt(1);
var bigint2 = /* @__PURE__ */ BigInt(2);
var bigint10 = /* @__PURE__ */ BigInt(10);
var bigint1e3 = /* @__PURE__ */ BigInt(1e3);
var roundTiesAwayFromZero = (input) => BigInt(input < 0 ? Math.ceil(input - 0.5) : Math.floor(input + 0.5));
var roundMillisToNanos = (millis2) => roundTiesAwayFromZero(millis2 * 1e6);
var parseNanos = (input, scale) => {
  const decimalIndex = input.indexOf(".");
  if (decimalIndex === -1) return BigInt(input) * scale;
  const isNegative = input[0] === "-";
  const fractional = input.slice(decimalIndex + 1);
  const fractionalScale = bigint10 ** BigInt(fractional.length);
  const scaled = (BigInt(input.slice(isNegative ? 1 : 0, decimalIndex)) * fractionalScale + BigInt(fractional)) * scale;
  const rounded = scaled / fractionalScale + (scaled % fractionalScale * bigint2 >= fractionalScale ? bigint1 : bigint0);
  return isNegative ? -rounded : rounded;
};
var DURATION_REGEXP = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
var fromInputUnsafe = (input) => {
  switch (typeof input) {
    case "number":
      return millis(input);
    case "bigint":
      return nanos(input);
    case "string": {
      if (input === "Infinity") {
        return infinity;
      }
      if (input === "-Infinity") {
        return negativeInfinity;
      }
      const match7 = DURATION_REGEXP.exec(input);
      if (!match7) break;
      const [_, valueStr, unit] = match7;
      if (unit === "nano" || unit === "nanos") {
        return nanos(parseNanos(valueStr, bigint1));
      }
      if (unit === "micro" || unit === "micros") {
        return nanos(parseNanos(valueStr, bigint1e3));
      }
      const value3 = Number(valueStr);
      switch (unit) {
        case "milli":
        case "millis":
          return millis(value3);
        case "second":
        case "seconds":
          return seconds(value3);
        case "minute":
        case "minutes":
          return minutes(value3);
        case "hour":
        case "hours":
          return hours(value3);
        case "day":
        case "days":
          return days(value3);
        case "week":
        case "weeks":
          return weeks(value3);
      }
      break;
    }
    case "object": {
      if (input === null) break;
      if (TypeId4 in input) return input;
      if (Array.isArray(input)) {
        if (input.length !== 2 || !input.every(isNumber)) {
          return invalid(input);
        }
        if (Number.isNaN(input[0]) || Number.isNaN(input[1])) {
          return zero;
        }
        if (input[0] === -Infinity || input[1] === -Infinity) {
          return negativeInfinity;
        }
        if (input[0] === Infinity || input[1] === Infinity) {
          return infinity;
        }
        return make3(roundTiesAwayFromZero(input[0] * 1e9 + input[1]));
      }
      const obj = input;
      let millis2 = 0;
      if (obj.weeks) millis2 += obj.weeks * 6048e5;
      if (obj.days) millis2 += obj.days * 864e5;
      if (obj.hours) millis2 += obj.hours * 36e5;
      if (obj.minutes) millis2 += obj.minutes * 6e4;
      if (obj.seconds) millis2 += obj.seconds * 1e3;
      if (obj.milliseconds) millis2 += obj.milliseconds;
      if (!obj.microseconds && !obj.nanoseconds) return make3(millis2);
      return make3(roundTiesAwayFromZero(millis2 * 1e6 + (obj.microseconds ?? 0) * 1e3 + (obj.nanoseconds ?? 0)));
    }
  }
  return invalid(input);
};
var invalid = (input) => {
  throw new Error(`Invalid Input: ${input}`);
};
var zeroDurationValue = {
  _tag: "Millis",
  millis: 0
};
var infinityDurationValue = {
  _tag: "Infinity"
};
var negativeInfinityDurationValue = {
  _tag: "NegativeInfinity"
};
var DurationProto = {
  [TypeId4]: TypeId4,
  [symbol]() {
    switch (this.value._tag) {
      case "Millis": {
        const nanos2 = this.value.millis * 1e6;
        return Number.isFinite(nanos2) ? hash(roundTiesAwayFromZero(nanos2)) : number(this.value.millis);
      }
      case "Nanos":
        return hash(this.value.nanos);
      default:
        return structure(this.value);
    }
  },
  [symbol2](that) {
    return isDuration(that) && equals2(this, that);
  },
  toString() {
    switch (this.value._tag) {
      case "Infinity":
        return "Infinity";
      case "NegativeInfinity":
        return "-Infinity";
      case "Nanos":
        return `${this.value.nanos} nanos`;
      case "Millis":
        return `${this.value.millis} millis`;
    }
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          nanos: String(this.value.nanos)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
      case "NegativeInfinity":
        return {
          _id: "Duration",
          _tag: "NegativeInfinity"
        };
    }
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make3 = (input) => {
  const duration = Object.create(DurationProto);
  if (typeof input === "number") {
    if (isNaN(input) || input === 0 || Object.is(input, -0)) {
      duration.value = zeroDurationValue;
    } else if (!Number.isFinite(input)) {
      duration.value = input > 0 ? infinityDurationValue : negativeInfinityDurationValue;
    } else if (!Number.isInteger(input)) {
      duration.value = {
        _tag: "Nanos",
        nanos: roundMillisToNanos(input)
      };
    } else {
      duration.value = {
        _tag: "Millis",
        millis: input
      };
    }
  } else if (input === bigint0) {
    duration.value = zeroDurationValue;
  } else {
    duration.value = {
      _tag: "Nanos",
      nanos: input
    };
  }
  return duration;
};
var isDuration = (u) => hasProperty(u, TypeId4);
var isFinite = (self) => self.value._tag !== "Infinity" && self.value._tag !== "NegativeInfinity";
var zero = /* @__PURE__ */ make3(0);
var infinity = /* @__PURE__ */ make3(Infinity);
var negativeInfinity = /* @__PURE__ */ make3(-Infinity);
var nanos = (nanos2) => make3(nanos2);
var millis = (millis2) => make3(millis2);
var seconds = (seconds2) => make3(seconds2 * 1e3);
var minutes = (minutes2) => make3(minutes2 * 6e4);
var hours = (hours2) => make3(hours2 * 36e5);
var days = (days2) => make3(days2 * 864e5);
var weeks = (weeks2) => make3(weeks2 * 6048e5);
var toMillis = (self) => match4(fromInputUnsafe(self), {
  onMillis: identity,
  onNanos: (nanos2) => Number(nanos2) / 1e6,
  onInfinity: () => Infinity,
  onNegativeInfinity: () => -Infinity
});
var toNanosUnsafe = (input) => {
  const self = fromInputUnsafe(input);
  switch (self.value._tag) {
    case "Infinity":
    case "NegativeInfinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return self.value.nanos;
    case "Millis":
      return roundMillisToNanos(self.value.millis);
  }
};
var match4 = /* @__PURE__ */ dual(2, (self, options) => {
  switch (self.value._tag) {
    case "Millis":
      return options.onMillis(self.value.millis);
    case "Nanos":
      return options.onNanos(self.value.nanos);
    case "Infinity":
      return options.onInfinity();
    case "NegativeInfinity":
      return (options.onNegativeInfinity ?? options.onInfinity)();
  }
});
var matchPair = /* @__PURE__ */ dual(3, (self, that, options) => {
  if (self.value._tag === "Infinity" || self.value._tag === "NegativeInfinity" || that.value._tag === "Infinity" || that.value._tag === "NegativeInfinity") return options.onInfinity(self, that);
  if (self.value._tag === "Millis") {
    return that.value._tag === "Millis" ? options.onMillis(self.value.millis, that.value.millis) : options.onNanos(toNanosUnsafe(self), that.value.nanos);
  } else {
    return options.onNanos(self.value.nanos, toNanosUnsafe(that));
  }
});
var Equivalence = (self, that) => matchPair(self, that, {
  onMillis: (self2, that2) => self2 === that2,
  onNanos: (self2, that2) => self2 === that2,
  onInfinity: (self2, that2) => self2.value._tag === that2.value._tag
});
var equals2 = /* @__PURE__ */ dual(2, (self, that) => Equivalence(self, that));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Scheduler.js
var Scheduler = /* @__PURE__ */ Reference("effect/Scheduler", {
  fiberCached: true,
  defaultValue: () => new MixedScheduler()
});
var setMicrotask = (f) => {
  let cancelled = false;
  Promise.resolve().then(() => {
    if (!cancelled) f();
  });
  return () => {
    cancelled = true;
  };
};
var setTimer = "setImmediate" in globalThis ? (f) => {
  const timer = globalThis.setImmediate(f);
  return () => globalThis.clearImmediate(timer);
} : (f) => {
  const timer = setTimeout(f, 0);
  return () => clearTimeout(timer);
};
var setImmediate = (f) => {
  try {
    return setTimer(f);
  } catch {
    return setMicrotask(f);
  }
};
var PriorityBuckets = class {
  buckets = [];
  scheduleTask(task, priority) {
    const buckets = this.buckets;
    const len = buckets.length;
    let bucket;
    let index = 0;
    for (; index < len; index++) {
      if (buckets[index][0] > priority) break;
      bucket = buckets[index];
    }
    if (bucket && bucket[0] === priority) {
      bucket[1].push(task);
    } else if (index === len) {
      buckets.push([priority, [task]]);
    } else {
      buckets.splice(index, 0, [priority, [task]]);
    }
  }
  drain() {
    const buckets = this.buckets;
    this.buckets = [];
    return buckets;
  }
};
var MixedScheduler = class {
  executionMode;
  setImmediate;
  constructor(executionMode = "async", setImmediateFn) {
    this.executionMode = executionMode;
    this.setImmediate = setImmediateFn ?? (executionMode === "sync" ? setMicrotask : setImmediate);
  }
  /**
   * Returns whether the fiber has reached its operation budget and should yield.
   *
   * **When to use**
   *
   * Use to decide whether a fiber should yield after consuming its current
   * operation budget.
   *
   * @since 2.0.0
   */
  shouldYield(fiber2) {
    return fiber2.currentOpCount >= fiber2.cache.maxOpsBeforeYield;
  }
  /**
   * Creates a dispatcher that schedules work through this scheduler.
   *
   * **When to use**
   *
   * Use when you need a standalone dispatcher from a scheduler instance, for
   * example in tests that enqueue tasks and then flush them deterministically.
   *
   * @since 4.0.0
   */
  makeDispatcher() {
    return new MixedSchedulerDispatcher(this.setImmediate);
  }
};
var MixedSchedulerDispatcher = class {
  tasks = /* @__PURE__ */ new PriorityBuckets();
  running = void 0;
  setImmediate;
  constructor(setImmediateFn = setImmediate) {
    this.setImmediate = setImmediateFn;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (this.running === void 0) {
      this.running = this.setImmediate(this.afterScheduled);
    }
  }
  /**
   * @since 2.0.0
   */
  afterScheduled = () => {
    this.running = void 0;
    this.runTasks();
  };
  /**
   * @since 2.0.0
   */
  runTasks() {
    const buckets = this.tasks.drain();
    for (let i = 0; i < buckets.length; i++) {
      const toRun = buckets[i][1];
      for (let j = 0; j < toRun.length; j++) {
        toRun[j]();
      }
    }
  }
  /**
   * @since 2.0.0
   */
  flush() {
    while (this.tasks.buckets.length > 0) {
      if (this.running !== void 0) {
        this.running();
        this.running = void 0;
      }
      this.runTasks();
    }
  }
};
var MaxOpsBeforeYield = /* @__PURE__ */ Reference("effect/Scheduler/MaxOpsBeforeYield", {
  fiberCached: true,
  defaultValue: () => 2048
});
var PreventSchedulerYield = /* @__PURE__ */ Reference("effect/Scheduler/PreventSchedulerYield", {
  fiberCached: true,
  defaultValue: () => false
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Data.js
var taggedEnum = () => new Proxy({}, {
  get(_target, tag2, _receiver) {
    if (tag2 === "$is") {
      return isTagged;
    } else if (tag2 === "$match") {
      return taggedMatch;
    }
    return (props) => ({
      ...props,
      _tag: tag2
    });
  }
});
function taggedMatch() {
  if (arguments.length === 1) {
    const cases2 = arguments[0];
    return function(value4) {
      return cases2[value4._tag](value4);
    };
  }
  const value3 = arguments[0];
  const cases = arguments[1];
  return cases[value3._tag](value3);
}
var Error3 = Error2;
var TaggedError2 = TaggedError;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/encoding/EncodingError.js
var EncodingErrorTypeId = "~effect/encoding/EncodingError";
var EncodingError = class extends (/* @__PURE__ */ TaggedError2("EncodingError")) {
  /**
   * Marks this value as an encoding or decoding error for runtime guards.
   *
   * **When to use**
   *
   * Use to identify `EncodingError` instances through `isEncodingError`.
   *
   * @since 4.0.0
   */
  [EncodingErrorTypeId] = EncodingErrorTypeId;
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/encoding/Hex.js
var random2 = (length) => {
  switch (length) {
    case 16:
      return random16();
    case 32:
      return random32();
    default: {
      let result3 = "";
      for (let i = length >>> 3; i > 0; i--) {
        result3 += random8();
      }
      return result3;
    }
  }
};
var hexCharCodes = /* @__PURE__ */ Uint8Array.from("0123456789abcdef", (c) => c.charCodeAt(0));
var randomWord = () => Math.random() * 4294967296 >>> 0;
var random8 = () => {
  const a = randomWord();
  return String.fromCharCode(hexCharCodes[a >>> 28], hexCharCodes[a >>> 24 & 15], hexCharCodes[a >>> 20 & 15], hexCharCodes[a >>> 16 & 15], hexCharCodes[a >>> 12 & 15], hexCharCodes[a >>> 8 & 15], hexCharCodes[a >>> 4 & 15], hexCharCodes[a & 15]);
};
var random16 = () => {
  const a = randomWord();
  const b = randomWord();
  return String.fromCharCode(hexCharCodes[a >>> 28], hexCharCodes[a >>> 24 & 15], hexCharCodes[a >>> 20 & 15], hexCharCodes[a >>> 16 & 15], hexCharCodes[a >>> 12 & 15], hexCharCodes[a >>> 8 & 15], hexCharCodes[a >>> 4 & 15], hexCharCodes[a & 15], hexCharCodes[b >>> 28], hexCharCodes[b >>> 24 & 15], hexCharCodes[b >>> 20 & 15], hexCharCodes[b >>> 16 & 15], hexCharCodes[b >>> 12 & 15], hexCharCodes[b >>> 8 & 15], hexCharCodes[b >>> 4 & 15], hexCharCodes[b & 15]);
};
var random32 = () => {
  const a = randomWord();
  const b = randomWord();
  const c = randomWord();
  const d = randomWord();
  return String.fromCharCode(hexCharCodes[a >>> 28], hexCharCodes[a >>> 24 & 15], hexCharCodes[a >>> 20 & 15], hexCharCodes[a >>> 16 & 15], hexCharCodes[a >>> 12 & 15], hexCharCodes[a >>> 8 & 15], hexCharCodes[a >>> 4 & 15], hexCharCodes[a & 15], hexCharCodes[b >>> 28], hexCharCodes[b >>> 24 & 15], hexCharCodes[b >>> 20 & 15], hexCharCodes[b >>> 16 & 15], hexCharCodes[b >>> 12 & 15], hexCharCodes[b >>> 8 & 15], hexCharCodes[b >>> 4 & 15], hexCharCodes[b & 15], hexCharCodes[c >>> 28], hexCharCodes[c >>> 24 & 15], hexCharCodes[c >>> 20 & 15], hexCharCodes[c >>> 16 & 15], hexCharCodes[c >>> 12 & 15], hexCharCodes[c >>> 8 & 15], hexCharCodes[c >>> 4 & 15], hexCharCodes[c & 15], hexCharCodes[d >>> 28], hexCharCodes[d >>> 24 & 15], hexCharCodes[d >>> 20 & 15], hexCharCodes[d >>> 16 & 15], hexCharCodes[d >>> 12 & 15], hexCharCodes[d >>> 8 & 15], hexCharCodes[d >>> 4 & 15], hexCharCodes[d & 15]);
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Tracer.js
var ParentSpanKey = "effect/Tracer/ParentSpan";
var ParentSpan = class extends (/* @__PURE__ */ Service()(ParentSpanKey, {
  fiberCached: true
})) {
};
var make4 = (options) => options;
var DisablePropagation = /* @__PURE__ */ Reference("effect/Tracer/DisablePropagation", {
  defaultValue: constFalse
});
var CurrentTraceLevel = /* @__PURE__ */ Reference("effect/Tracer/CurrentTraceLevel", {
  defaultValue: () => "Info"
});
var MinimumTraceLevel = /* @__PURE__ */ Reference("effect/Tracer/MinimumTraceLevel", {
  defaultValue: () => "All"
});
var TracerKey = "effect/Tracer";
var nativeTracer = /* @__PURE__ */ make4({
  span: (options) => new NativeSpan(options)
});
var NativeSpan = class {
  _tag = "Span";
  sampled;
  name;
  parent;
  annotations;
  links;
  startTime;
  kind;
  status;
  _traceId = void 0;
  _spanId = void 0;
  _attributes = void 0;
  _events = void 0;
  constructor(options) {
    this.name = options.name;
    this.parent = options.parent;
    this.annotations = options.annotations;
    this.links = options.links;
    this.startTime = options.startTime;
    this.kind = options.kind;
    this.sampled = options.sampled;
    this.status = {
      _tag: "Started",
      startTime: options.startTime
    };
  }
  get traceId() {
    return this._traceId ??= getOrUndefined(this.parent)?.traceId ?? random2(32);
  }
  get spanId() {
    return this._spanId ??= random2(16);
  }
  get attributes() {
    return this._attributes ??= /* @__PURE__ */ new Map();
  }
  get events() {
    return this._events ??= [];
  }
  end(endTime, exit3) {
    this.status = {
      _tag: "Ended",
      endTime,
      exit: exit3,
      startTime: this.status.startTime
    };
  }
  attribute(key, value3) {
    this.attributes.set(key, value3);
  }
  event(name, startTime, attributes) {
    this.events.push([name, startTime, attributes ?? {}]);
  }
  addLinks(links) {
    this.links.push(...links);
  }
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/metric.js
var FiberRuntimeMetricsKey = "effect/Metric/FiberRuntimeMetrics";

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/references.js
var CurrentStackFrame = /* @__PURE__ */ Reference("effect/References/CurrentStackFrame", {
  fiberCached: true,
  defaultValue: constUndefined
});
var TracerEnabled = /* @__PURE__ */ Reference("effect/References/TracerEnabled", {
  fiberCached: true,
  defaultValue: constTrue
});
var TracerTimingEnabled = /* @__PURE__ */ Reference("effect/References/TracerTimingEnabled", {
  defaultValue: constTrue
});
var TracerSpanAnnotations = /* @__PURE__ */ Reference("effect/References/TracerSpanAnnotations", {
  defaultValue: () => ({})
});
var TracerSpanLinks = /* @__PURE__ */ Reference("effect/References/TracerSpanLinks", {
  defaultValue: () => []
});
var CurrentLogAnnotations = /* @__PURE__ */ Reference("effect/References/CurrentLogAnnotations", {
  defaultValue: () => ({})
});
var CurrentLogLevel = /* @__PURE__ */ Reference("effect/References/CurrentLogLevel", {
  fiberCached: true,
  defaultValue: () => "Info"
});
var MinimumLogLevel = /* @__PURE__ */ Reference("effect/References/MinimumLogLevel", {
  fiberCached: true,
  defaultValue: () => "Info"
});
var CurrentLogSpans = /* @__PURE__ */ Reference("effect/References/CurrentLogSpans", {
  defaultValue: () => []
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/tracer.js
var makeStackCleaner = (line) => (stack) => {
  let cache2;
  return () => {
    if (cache2 !== void 0) return cache2;
    const trace = stack();
    if (!trace) return void 0;
    const lines2 = trace.split("\n");
    if (lines2[line] !== void 0) {
      cache2 = lines2[line].trim();
      return cache2;
    }
  };
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/effect.js
var Interrupt = class extends ReasonBase {
  constructor(fiberId2, annotations = constEmptyAnnotations) {
    super("Interrupt", annotations, "Interrupted");
    this.fiberId = fiberId2;
  }
  toString() {
    return `Interrupt(${this.fiberId})`;
  }
  toJSON() {
    return {
      _tag: "Interrupt",
      fiberId: this.fiberId
    };
  }
  [symbol2](that) {
    return isInterruptReason(that) && this.fiberId === that.fiberId && this.annotations === that.annotations;
  }
  [symbol]() {
    return combine(string(`${this._tag}:${this.fiberId}`))(random(this.annotations));
  }
};
var causeInterrupt = (fiberId2) => new CauseImpl([new Interrupt(fiberId2)]);
var findFail = (self) => {
  const reason = self.reasons.find(isFailReason);
  return reason ? succeed2(reason) : fail2(self);
};
var findError = (self) => {
  for (let i = 0; i < self.reasons.length; i++) {
    const reason = self.reasons[i];
    if (reason._tag === "Fail") {
      return succeed2(reason.error);
    }
  }
  return fail2(self);
};
var hasInterrupts = (self) => self.reasons.some(isInterruptReason);
var hasInterruptsOnly = (self) => self.reasons.length > 0 && self.reasons.every(isInterruptReason);
var reasonAnnotations = (self) => makeUnsafe(self.annotations);
var causeMap = /* @__PURE__ */ dual(2, (self, f) => {
  let hasFail = false;
  const failures = self.reasons.map((failure) => {
    if (isFailReason(failure)) {
      hasFail = true;
      return new Fail(f(failure.error), failure.annotations);
    }
    return failure;
  });
  return hasFail ? causeFromReasons(failures) : self;
});
var causeSquash = (self) => {
  let die6;
  for (const reason of self.reasons) {
    if (reason._tag === "Fail") return reason.error;
    if (reason._tag === "Die") die6 ??= reason;
  }
  if (die6 !== void 0) return die6.defect;
  if (self.reasons.length > 0) return new globalThis.Error("All fibers interrupted without error");
  return new globalThis.Error("Empty cause");
};
var causePrettyErrors = (self, options) => {
  const errors = [];
  const interrupts = [];
  if (self.reasons.length === 0) return errors;
  const prevStackLimit = getStackTraceLimit();
  if (prevStackLimit !== 0) setStackTraceLimit(1);
  try {
    for (const failure of self.reasons) {
      if (failure._tag === "Interrupt") {
        interrupts.push(failure);
        continue;
      }
      errors.push(causePrettyError(failure._tag === "Die" ? failure.defect : failure.error, failure.annotations, options));
    }
    if (errors.length === 0) {
      const cause = new Error("The fiber was interrupted by:");
      cause.name = "InterruptCause";
      cause.stack = interruptCauseStack(cause, interrupts);
      const error2 = new globalThis.Error("All fibers interrupted without error", {
        cause
      });
      error2.name = "InterruptError";
      error2.stack = `${error2.name}: ${error2.message}`;
      errors.push(causePrettyError(error2, interrupts[0].annotations, options));
    }
  } finally {
    if (prevStackLimit !== 0) setStackTraceLimit(prevStackLimit);
  }
  return errors;
};
var causePrettyError = (original, annotations, options) => {
  const kind = typeof original;
  let error2;
  if (original && kind === "object") {
    error2 = new globalThis.Error(causePrettyMessage(original), {
      cause: original.cause ? causePrettyError(original.cause) : void 0
    });
    if (typeof original.name === "string") {
      error2.name = original.name;
    }
    if (typeof original.stack === "string") {
      error2.stack = cleanErrorStack(original.stack, error2, annotations);
    } else {
      const stack = `${error2.name}: ${error2.message}`;
      error2.stack = annotations ? addStackAnnotations(stack, annotations) : stack;
    }
    if (options?.includeCauseInStack) {
      error2.stack = renderPrettyError(error2);
    }
    for (const key of Object.keys(original)) {
      if (!(key in error2)) {
        ;
        error2[key] = original[key];
      }
    }
  } else {
    error2 = new globalThis.Error(!original ? `Unknown error: ${original}` : kind === "string" ? original : formatJson(original));
    const stack = `${error2.name}: ${error2.message}`;
    error2.stack = annotations ? addStackAnnotations(stack, annotations) : stack;
  }
  return error2;
};
var causePrettyMessage = (u) => {
  if (typeof u.message === "string") {
    return u.message;
  } else if (typeof u.toString === "function" && u.toString !== Object.prototype.toString && u.toString !== Array.prototype.toString) {
    try {
      return u.toString();
    } catch {
    }
  }
  return formatJson(u);
};
var locationRegExp = /\((.*)\)/g;
var cleanErrorStack = (stack, error2, annotations) => {
  const message = `${error2.name}: ${error2.message}`;
  const lines2 = (stack.startsWith(message) ? stack.slice(message.length) : stack).split("\n");
  const out = [message];
  for (let i = 1; i < lines2.length; i++) {
    if (/Generator\.next|~effect\/(?:Effect|Utils)/.test(lines2[i])) {
      break;
    }
    out.push(lines2[i]);
  }
  return annotations ? addStackAnnotations(out.join("\n"), annotations) : out.join("\n");
};
var addStackAnnotations = (stack, annotations) => {
  const frame = annotations?.get(StackTraceKey.key);
  if (frame) {
    stack = `${stack}
${currentStackTrace(frame)}`;
  }
  return stack;
};
var interruptCauseStack = (error2, interrupts) => {
  const out = [`${error2.name}: ${error2.message}`];
  for (const current of interrupts) {
    const fiberId2 = current.fiberId !== void 0 ? `#${current.fiberId}` : "unknown";
    const frame = current.annotations.get(InterruptorStackTrace.key);
    out.push(`    at fiber (${fiberId2})`);
    if (frame) out.push(currentStackTrace(frame));
  }
  return out.join("\n");
};
var currentStackTrace = (frame) => {
  const out = [];
  let current = frame;
  let i = 0;
  while (current && i < 10) {
    const stack = current.stack();
    if (stack) {
      const locationMatchAll = stack.matchAll(locationRegExp);
      let match7 = false;
      for (const [, location] of locationMatchAll) {
        match7 = true;
        out.push(`    at ${current.name} (${location})`);
      }
      if (!match7) {
        out.push(`    at ${current.name} (${stack.replace(/^at /, "")})`);
      }
    } else {
      out.push(`    at ${current.name}`);
    }
    current = current.parent;
    i++;
  }
  return out.join("\n");
};
var causePretty = (cause) => causePrettyErrors(cause).map(renderPrettyError).join("\n");
var renderPrettyError = (e) => e.cause ? `${e.stack} {
${renderErrorCause(e.cause, "  ")}
}` : e.stack;
var renderErrorCause = (cause, prefix) => {
  const lines2 = cause.stack.split("\n");
  let stack = `${prefix}[cause]: ${lines2[0]}`;
  for (let i = 1, len = lines2.length; i < len; i++) {
    stack += `
${prefix}${lines2[i]}`;
  }
  if (cause.cause) {
    stack += ` {
${renderErrorCause(cause.cause, `${prefix}  `)}
${prefix}}`;
  }
  return stack;
};
var FiberTypeId = "~effect/Fiber";
var fiberVariance = {
  _A: identity,
  _E: identity
};
var fiberIdStore = {
  id: 0
};
var AsyncResource = /* @__PURE__ */ (() => {
  try {
    return globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncResource;
  } catch {
    return void 0;
  }
})();
var captureAsyncContext = () => AsyncResource === void 0 ? void 0 : new AsyncResource("effect/Fiber");
var getCurrentFiber = () => globalThis[currentFiberTypeId];
var FiberImpl = class {
  constructor(context3, interruptible2 = true) {
    this.setContext(context3);
    this.id = ++fiberIdStore.id;
    this.currentOpCount = 0;
    this.interruptible = interruptible2;
    this._stack = [];
    this._observers = void 0;
    this._exit = void 0;
    this._children = void 0;
    this._interruptedCause = void 0;
    this._yielded = void 0;
    this._running = false;
    this._deferredInterrupt = false;
    this._parent = void 0;
    this._asyncContext = void 0;
    this.cache.runtimeMetrics?.recordFiberStart(this.context);
  }
  get [FiberTypeId]() {
    return fiberVariance;
  }
  get currentDispatcher() {
    return this._dispatcher ??= this.cache.scheduler.makeDispatcher();
  }
  getRef(ref) {
    return get(this.context, ref);
  }
  addObserver(cb) {
    if (this._exit) {
      cb(this._exit);
      return constVoid;
    }
    if (this._observers === void 0) {
      this._observers = [cb];
    } else {
      this._observers.push(cb);
    }
    return () => this.removeObserver(cb);
  }
  removeObserver(cb) {
    if (this._exit || this._observers === void 0) return;
    const index = this._observers.indexOf(cb);
    if (index >= 0) {
      this._observers.splice(index, 1);
    }
  }
  interruptUnsafe(fiberId2, annotations) {
    if (this._exit) {
      return;
    }
    let cause = causeInterrupt(fiberId2);
    if (this.cache.stackFrame) {
      cause = causeAnnotate(cause, make2(StackTraceKey, this.cache.stackFrame));
    }
    if (annotations) {
      cause = causeAnnotate(cause, annotations);
    }
    this._interruptedCause = this._interruptedCause ? causeCombine(this._interruptedCause, cause) : cause;
    if (this.interruptible) {
      if (this._running) {
        this._deferredInterrupt = true;
      } else {
        this.evaluate(failCause(this._interruptedCause));
      }
    }
  }
  pollUnsafe() {
    return this._exit;
  }
  evaluate(effect2) {
    if (this._exit) {
      return;
    } else if (this._asyncContext !== void 0) {
      const asyncContext = this._asyncContext;
      this._asyncContext = void 0;
      return asyncContext.runInAsyncScope(this.evaluate, this, effect2);
    } else if (this._yielded !== void 0) {
      const yielded = this._yielded;
      this._yielded = void 0;
      yielded();
    }
    const exit3 = this.runLoop(effect2);
    if (exit3 === Yield) {
      this._asyncContext = captureAsyncContext();
      return;
    }
    const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
    if (interruptChildren !== void 0) {
      return this.evaluate(flatMap2(interruptChildren, () => exit3));
    }
    this._exit = exit3;
    this.cache.runtimeMetrics?.recordFiberEnd(this.context, this._exit);
    if (this._parent) {
      this._parent._children?.delete(this);
      this._parent = void 0;
    }
    if (this._observers !== void 0) {
      const observers = this._observers;
      this._observers = void 0;
      for (let i = 0; i < observers.length; i++) {
        observers[i](exit3);
      }
    }
    this._stack.length = 0;
    this._children = void 0;
    this.context = empty();
  }
  runLoop(effect2) {
    const prevFiber = globalThis[currentFiberTypeId];
    globalThis[currentFiberTypeId] = this;
    const prevRunning = this._running;
    this._running = true;
    let yielding = false;
    let current = effect2;
    this.currentOpCount = 0;
    try {
      while (true) {
        try {
          if (this._deferredInterrupt) {
            this._deferredInterrupt = false;
            current = failCause(this._interruptedCause);
          }
          this.currentOpCount++;
          const cache2 = this.cache;
          if (!yielding && !cache2.preventYield && cache2.scheduler.shouldYield(this)) {
            yielding = true;
            const prev = current;
            current = flatMap2(yieldNow, () => prev);
          }
          current = cache2.tracerContext ? cache2.tracerContext(current, this) : current[evaluate](this);
          if (current === Yield) {
            const yielded = this._yielded;
            if (ExitTypeId in yielded) {
              this._deferredInterrupt = false;
              this._yielded = void 0;
              return yielded;
            } else if (this._deferredInterrupt) {
              this._yielded = void 0;
              yielded();
              continue;
            }
            return Yield;
          }
        } catch (error2) {
          if (!hasProperty(current, evaluate)) {
            return exitDie(`Fiber.runLoop: Not a valid effect: ${String(current)}`);
          }
          current = exitDie(error2);
        }
      }
    } finally {
      this._running = prevRunning;
      globalThis[currentFiberTypeId] = prevFiber;
    }
  }
  getCont(symbol4) {
    if (this._deferredInterrupt) {
      this._deferredInterrupt = false;
      return deferredInterruptCont;
    }
    while (true) {
      const op = this._stack.pop();
      if (!op) return void 0;
      const all4 = op[contAll];
      if (all4 !== void 0) {
        const cont = all4.call(op, this);
        if (cont) {
          ;
          cont[symbol4] = cont;
          return cont;
        }
      }
      if (op[symbol4]) return op;
    }
  }
  // Passes a success value straight to the next continuation instead of
  // returning an Exit for the run loop to unwrap. Each call counts as an
  // operation, and every `maxInlineSteps`th call returns an Exit instead, so
  // continuations calling continuations never nest deeper than that.
  succeedWith(value3) {
    if ((++this.currentOpCount & maxInlineSteps - 1) === 0) {
      return exitSucceed(value3);
    }
    const cont = this.getCont(contA);
    return cont ? cont[contA](value3, this) : this.yieldWith(exitSucceed(value3));
  }
  yieldWith(value3) {
    this._yielded = value3;
    return Yield;
  }
  children() {
    return this._children ??= /* @__PURE__ */ new Set();
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  setContext(context3) {
    const previous = this.context;
    this.context = context3;
    if (previous !== void 0 && hasSameCache(previous, context3)) return;
    const root = context3.cacheRoot;
    const cache2 = root._fiberCache ??= makeFiberContextCache(context3);
    if (this.cache?.scheduler !== cache2.scheduler) {
      this._dispatcher = void 0;
    }
    this.cache = cache2;
  }
  get currentSpanLocal() {
    const span = this.cache.span;
    return span?._tag === "Span" ? span : void 0;
  }
};
var makeFiberContextCache = (context3) => {
  const currentTracer = getOrUndefinedUnsafe(context3, TracerKey);
  return {
    scheduler: get(context3, Scheduler),
    tracer: currentTracer,
    tracerContext: currentTracer ? currentTracer["context"] : void 0,
    tracerEnabled: get(context3, TracerEnabled),
    span: getOrUndefinedUnsafe(context3, ParentSpanKey),
    logLevel: get(context3, CurrentLogLevel),
    minimumLogLevel: get(context3, MinimumLogLevel),
    stackFrame: get(context3, CurrentStackFrame),
    runtimeMetrics: getOrUndefinedUnsafe(context3, FiberRuntimeMetricsKey),
    maxOpsBeforeYield: get(context3, MaxOpsBeforeYield),
    preventYield: get(context3, PreventSchedulerYield)
  };
};
var deferredInterruptCont = {
  [contA](_value, fiber2) {
    return failCause(fiber2._interruptedCause);
  },
  [contE](_cause, fiber2) {
    return failCause(fiber2._interruptedCause);
  }
};
var maxInlineSteps = 32;
var fiberMiddleware = {
  interruptChildren: void 0
};
var fiberStackAnnotations = (fiber2) => {
  if (!fiber2.cache.stackFrame) return void 0;
  const annotations = /* @__PURE__ */ new Map();
  annotations.set(InterruptorStackTrace.key, fiber2.cache.stackFrame);
  return makeUnsafe(annotations);
};
var fiberAwait = (self) => {
  const impl = self;
  if (impl._exit) return succeed3(impl._exit);
  return callback((resume) => {
    if (impl._exit) return resume(succeed3(impl._exit));
    return sync(self.addObserver((exit3) => resume(succeed3(exit3))));
  });
};
var fiberAwaitAll = (self) => callback((resume) => {
  const iter = self[Symbol.iterator]();
  const exits = [];
  let cancel = void 0;
  function loop() {
    let result3 = iter.next();
    while (!result3.done) {
      if (result3.value._exit) {
        exits.push(result3.value._exit);
        result3 = iter.next();
        continue;
      }
      cancel = result3.value.addObserver((exit3) => {
        exits.push(exit3);
        loop();
      });
      return;
    }
    resume(succeed3(exits));
  }
  loop();
  return sync(() => cancel?.());
});
var fiberJoin = (self) => {
  const impl = self;
  if (impl._exit) return impl._exit;
  return callback((resume) => {
    if (impl._exit) return resume(impl._exit);
    return sync(self.addObserver(resume));
  });
};
var fiberInterrupt = (self) => withFiber((fiber2) => fiberInterruptAs(self, fiber2.id));
var fiberInterruptAs = /* @__PURE__ */ dual((args2) => hasProperty(args2[0], FiberTypeId), (self, fiberId2, annotations) => withFiber((parent) => {
  let ann = fiberStackAnnotations(parent);
  ann = ann && annotations ? merge(ann, annotations) : ann ?? annotations;
  self.interruptUnsafe(fiberId2, ann);
  return asVoid(fiberAwait(self));
}));
var fiberInterruptAll = (fibers) => withFiber((parent) => {
  const annotations = fiberStackAnnotations(parent);
  let fiberArr = empty2();
  for (const fiber2 of fibers) {
    fiber2.interruptUnsafe(parent.id, annotations);
    fiberArr.push(fiber2);
  }
  return asVoid(fiberAwaitAll(fiberArr));
});
var succeed3 = exitSucceed;
var failCause = exitFailCause;
var fail3 = exitFail;
var sync = /* @__PURE__ */ makePrimitive({
  op: "Sync",
  [evaluate](fiber2) {
    const value3 = this[args]();
    const cont = fiber2.getCont(contA);
    return cont ? cont[contA](value3, fiber2) : fiber2.yieldWith(exitSucceed(value3));
  }
});
var suspend = /* @__PURE__ */ makePrimitive({
  op: "Suspend",
  [evaluate](_fiber) {
    return this[args]();
  }
});
var fromResult = /* @__PURE__ */ match2({
  onFailure: fail3,
  onSuccess: succeed3
});
var yieldNowWith = /* @__PURE__ */ makePrimitive({
  op: "Yield",
  [evaluate](fiber2) {
    let resumed = false;
    fiber2.currentDispatcher.scheduleTask(() => {
      if (resumed) return;
      fiber2.evaluate(exitVoid);
    }, this[args] ?? 0);
    return fiber2.yieldWith(() => {
      resumed = true;
    });
  }
});
var yieldNow = /* @__PURE__ */ yieldNowWith(0);
var failCauseSync = (evaluate2) => suspend(() => failCause(evaluate2()));
var die = (defect) => exitDie(defect);
var failSync = (error2) => suspend(() => fail3(error2()));
var void_ = /* @__PURE__ */ succeed3(void 0);
var try_ = (options) => {
  const evaluate2 = typeof options === "function" ? options : options.try;
  const catcher = typeof options === "function" ? (cause) => new UnknownError(cause, "An error occurred in Effect.try") : options.catch;
  return suspend(() => {
    try {
      return succeed3(evaluate2());
    } catch (err) {
      return fail3(catcher(err));
    }
  });
};
var tryPromise = (options) => {
  const f = typeof options === "function" ? options : options.try;
  const catcher = typeof options === "function" ? (cause) => new UnknownError(cause, "An error occurred in Effect.tryPromise") : options.catch;
  return callbackOptions(function(resume, signal) {
    const failWithCatch = (cause) => suspend(() => {
      try {
        return fail3(internalCall(() => catcher(cause)));
      } catch (err) {
        return die(err);
      }
    });
    try {
      f(signal).then((a) => resume(succeed3(a)), (e) => resume(failWithCatch(e)));
    } catch (err) {
      resume(failWithCatch(err));
    }
  }, f.length !== 0);
};
var withFiberId = (f) => withFiber((fiber2) => f(fiber2.id));
var callbackOptions = /* @__PURE__ */ (function() {
  const Proto9 = /* @__PURE__ */ makePrimitiveProto({
    op: "Async",
    [evaluate](fiber2) {
      let resumed = false;
      let yielded = false;
      const controller = this.withSignal ? new AbortController() : void 0;
      const onCancel = this.register.call(fiber2.cache.scheduler, (effect2) => {
        if (resumed) return;
        resumed = true;
        if (yielded) {
          fiber2.evaluate(effect2);
        } else {
          yielded = effect2;
        }
      }, controller?.signal);
      if (yielded !== false) return yielded;
      yielded = true;
      fiber2._yielded = () => {
        resumed = true;
      };
      if (controller === void 0 && onCancel === void 0) {
        return Yield;
      }
      fiber2._stack.push(asyncFinalizer(() => {
        resumed = true;
        controller?.abort();
        return onCancel ?? exitVoid;
      }));
      return Yield;
    }
  });
  const AsyncImpl = function(register, withSignal) {
    this.register = register;
    this.withSignal = withSignal;
  };
  AsyncImpl.prototype = Proto9;
  return function(register, withSignal) {
    return new AsyncImpl(register, withSignal);
  };
})();
var asyncFinalizer = /* @__PURE__ */ makePrimitive({
  op: "AsyncFinalizer",
  [contAll](fiber2) {
    if (fiber2.interruptible) {
      fiber2.interruptible = false;
      fiber2._stack.push(setInterruptibleTrue);
    }
  },
  [contE](cause, _fiber) {
    return hasInterrupts(cause) ? flatMap2(combineFinalizerCause(exitFailCause(cause), this[args]()), () => failCause(cause)) : failCause(cause);
  }
});
var callback = (register) => callbackOptions(register, register.length >= 2);
var never = /* @__PURE__ */ callback(constVoid);
var gen = (...args2) => {
  if (args2.length === 1) {
    const body2 = args2[0];
    return suspend(() => fromIteratorUnsafe(body2()));
  }
  const [options, body] = args2;
  return suspend(() => fromIteratorUnsafe(body.call(options.self)));
};
var fnUntraced = (body, ...pipeables) => {
  const fn3 = pipeables.length === 0 ? function() {
    return suspend(() => fromIteratorUnsafe(body.apply(this, arguments)));
  } : function() {
    let effect2 = suspend(() => fromIteratorUnsafe(body.apply(this, arguments)));
    for (let i = 0; i < pipeables.length; i++) {
      effect2 = pipeables[i](effect2, ...arguments);
    }
    return effect2;
  };
  return defineFunctionLength(body.length, fn3);
};
var defineFunctionLength = (length, fn3) => Object.defineProperty(fn3, "length", {
  value: length,
  configurable: true
});
var fnStackCleaner = /* @__PURE__ */ makeStackCleaner(2);
var fn = function() {
  const nameFirst = typeof arguments[0] === "string";
  const name = nameFirst ? arguments[0] : "Effect.fn";
  const spanOptions = nameFirst ? arguments[1] : void 0;
  const prevLimit = getStackTraceLimit();
  let defError;
  if (prevLimit !== 0) {
    setStackTraceLimit(2);
    defError = new globalThis.Error();
    setStackTraceLimit(prevLimit);
  }
  if (nameFirst) {
    return (body, ...pipeables) => makeFn(name, body, defError, pipeables, nameFirst, spanOptions);
  }
  return makeFn(name, arguments[0], defError, Array.prototype.slice.call(arguments, 1), nameFirst, spanOptions);
};
var makeFn = (name, bodyOrOptions, defError, pipeables, addSpan, spanOptions) => {
  const body = typeof bodyOrOptions === "function" ? bodyOrOptions : pipeables.shift().bind(bodyOrOptions.self);
  const definitionName = `${name} (definition)`;
  const definitionStack = defError ? fnStackCleaner(() => defError.stack) : constUndefined;
  return defineFunctionLength(body.length, function(...args2) {
    let result3 = suspend(() => {
      const iter = body.apply(this, arguments);
      return isEffect(iter) ? iter : fromIteratorUnsafe(iter);
    });
    for (let i = 0; i < pipeables.length; i++) {
      result3 = pipeables[i](result3, ...args2);
    }
    if (!isEffect(result3)) {
      return result3;
    }
    const prevLimit = getStackTraceLimit();
    let callError;
    if (prevLimit !== 0) {
      setStackTraceLimit(2);
      callError = new globalThis.Error();
      setStackTraceLimit(prevLimit);
    }
    return updateService(addSpan ? useSpan(name, spanOptions, (span) => provideParentSpan(result3, span)) : result3, CurrentStackFrame, (prev) => ({
      name,
      stack: callError ? fnStackCleaner(() => callError.stack) : constUndefined,
      parent: {
        name: definitionName,
        stack: definitionStack,
        parent: prev
      }
    }));
  });
};
var fnUntracedEager = (body, ...pipeables) => defineFunctionLength(body.length, pipeables.length === 0 ? function() {
  return fromIteratorEagerUnsafe(() => body.apply(this, arguments));
} : function() {
  let effect2 = fromIteratorEagerUnsafe(() => body.apply(this, arguments));
  for (const pipeable of pipeables) {
    effect2 = pipeable(effect2, ...arguments);
  }
  return effect2;
});
var fromIteratorEagerUnsafe = (evaluate2) => {
  try {
    const iterator = evaluate2();
    let value3 = void 0;
    while (true) {
      const state = iterator.next(value3);
      if (state.done) {
        return succeed3(state.value);
      }
      const primitive = state.value;
      if (primitive && primitive._tag === "Success") {
        value3 = primitive.value;
        continue;
      } else if (primitive && primitive._tag === "Failure") {
        return state.value;
      } else {
        let isFirstExecution = true;
        return suspend(() => {
          if (isFirstExecution) {
            isFirstExecution = false;
            return flatMap2(state.value, (value4) => fromIteratorUnsafe(iterator, value4));
          } else {
            return suspend(() => fromIteratorUnsafe(evaluate2()));
          }
        });
      }
    }
  } catch (error2) {
    return die(error2);
  }
};
var fromIteratorUnsafe = /* @__PURE__ */ (function() {
  const Proto9 = /* @__PURE__ */ makePrimitiveProto({
    op: "Iterator",
    [contA](value3, fiber2) {
      const iter = this.iterator;
      while (true) {
        const state = iter.next(value3);
        if (state.done) return succeed3(state.value);
        if (!effectIsExit(state.value)) {
          fiber2._stack.push(this);
          return state.value;
        } else if (state.value._tag === "Failure") {
          return state.value;
        }
        value3 = state.value.value;
      }
    },
    [evaluate](fiber2) {
      return this[contA](this.initial, fiber2);
    }
  });
  const IteratorImpl = function(iterator, initial) {
    this.iterator = iterator;
    this.initial = initial;
  };
  IteratorImpl.prototype = Proto9;
  return function(iterator, initial) {
    return new IteratorImpl(iterator, initial);
  };
})();
var as = /* @__PURE__ */ dual(2, (self, value3) => new ContImpl(self, returnPayload, succeed3(value3)));
var evaluateCont = function(fiber2) {
  fiber2._stack.push(this);
  return this[args];
};
var OnSuccessProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccess",
  [evaluate]: evaluateCont
});
var ContImpl = function(self, cont, payload) {
  this[args] = self;
  this[contA] = cont;
  this.payload = payload;
};
ContImpl.prototype = OnSuccessProto;
var returnPayload = function() {
  return this.payload;
};
var succeedPayload = function(_value, fiber2) {
  return fiber2.succeedWith(this.payload);
};
var continuationMarksStack = /* @__PURE__ */ (() => {
  const marker = "~effect/Effect/stackProbe";
  const probe = {
    [marker]: function stackProbe() {
      return new Error().stack;
    }
  };
  return probe[marker]()?.includes("[as " + marker + "]") === true;
})();
var mapCont = function(value3, fiber2) {
  const f = this.payload;
  return fiber2.succeedWith(continuationMarksStack ? f(value3) : internalCall(() => f(value3)));
};
var andThenCont = function(value3) {
  const f = this.payload;
  return f(value3);
};
var tapCont = function(value3) {
  const f = this.payload;
  return new ContImpl(f(value3), succeedPayload, value3);
};
var tapEffectCont = function(value3) {
  return new ContImpl(this.payload, succeedPayload, value3);
};
var andThen = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, isEffect(f) ? returnPayload : andThenCont, f));
var tap = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, isEffect(f) ? tapEffectCont : tapCont, f));
var asVoid = (self) => new ContImpl(self, returnPayload, exitVoid);
var raceAllFirst = (all4, options) => withFiber((parent) => {
  const fibers = /* @__PURE__ */ new Set();
  onExitUnsafe(parent, () => fibers.size === 0 ? void 0 : fiberInterruptAll(fibers));
  return callback((resume) => {
    let done3 = false;
    let i = 0;
    for (const effect2 of all4) {
      if (done3) break;
      const index = i++;
      const fiber2 = forkUnsafe(parent, effect2, true, true, false);
      fibers.add(fiber2);
      fiber2.addObserver((exit3) => {
        fibers.delete(fiber2);
        const isWinner = !done3;
        done3 = true;
        resume(exit3);
        if (isWinner && options?.onWinner) {
          options.onWinner({
            fiber: fiber2,
            index,
            parentFiber: parent
          });
        }
      });
    }
  });
});
var raceFirst = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, options) => raceAllFirst([self, that], options));
var flatMap2 = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, andThenCont, f));
var effectIsExit = (effect2) => effect2[ExitTypeId] !== void 0;
var flatMapEager = /* @__PURE__ */ dual(2, (self, f) => {
  if (effectIsExit(self)) {
    return self._tag === "Success" ? f(self.value) : self;
  }
  return flatMap2(self, f);
});
var map3 = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, mapCont, f));
var mapEager = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMap(self, f) : map3(self, f));
var mapErrorEager = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMapError(self, f) : mapError(self, f));
var catchEager = /* @__PURE__ */ dual(2, (self, f) => {
  if (effectIsExit(self)) {
    if (self._tag === "Success") return self;
    const error2 = findError(self.cause);
    if (isFailure2(error2)) return self;
    return f(error2.success);
  }
  return catch_(self, f);
});
var exitInterrupt = (fiberId2) => exitFailCause(causeInterrupt(fiberId2));
var exitIsSuccess = (self) => self._tag === "Success";
var exitIsFailure = (self) => self._tag === "Failure";
var exitFilterCause = (self) => self._tag === "Failure" ? succeed2(self.cause) : fail2(self);
var exitVoid = /* @__PURE__ */ exitSucceed(void 0);
var exitMap = /* @__PURE__ */ dual(2, (self, f) => self._tag === "Success" ? exitSucceed(f(self.value)) : self);
var exitMapError = /* @__PURE__ */ dual(2, (self, f) => {
  if (self._tag === "Success") return self;
  const error2 = findError(self.cause);
  if (isFailure2(error2)) return self;
  return exitFail(f(error2.success));
});
var exitZipRight = /* @__PURE__ */ dual(2, (self, that) => exitIsSuccess(self) ? that : self);
var exitAsVoidAll = (exits) => {
  const failures = [];
  for (const exit3 of exits) {
    if (exit3._tag === "Failure") {
      failures.push(...exit3.cause.reasons);
    }
  }
  return failures.length === 0 ? exitVoid : exitFailCause(causeFromReasons(failures));
};
var serviceOption = (service3) => withFiber((fiber2) => succeed3(getOption(fiber2.context, service3)));
var updateContext = /* @__PURE__ */ dual(2, (self, f) => withFiber((fiber2) => {
  const prevContext = fiber2.context;
  const nextContext = f(prevContext);
  if (prevContext === nextContext) return self;
  fiber2.setContext(nextContext);
  onExitUnsafe(fiber2, () => {
    fiber2.setContext(prevContext);
    return void 0;
  });
  return self;
}));
var updateService = /* @__PURE__ */ dual(3, (self, service3, f) => updateContext(self, (s) => {
  const prev = getUnsafe(s, service3);
  const next = f(prev);
  if (prev === next) return s;
  return add(s, service3, next);
}));
var contextWith = (f) => withFiber((fiber2) => f(fiber2.context));
var provideContext = /* @__PURE__ */ dual(2, (self, context3) => {
  if (effectIsExit(self)) return self;
  return updateContext(self, merge(context3));
});
var provideService = function() {
  if (arguments.length === 1) {
    return dual(2, (self, impl) => provideServiceImpl(self, arguments[0], impl));
  }
  return dual(3, (self, service3, impl) => provideServiceImpl(self, service3, impl)).apply(this, arguments);
};
var provideServiceImpl = (self, service3, implementation) => updateContext(self, add(service3, implementation));
var forever = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options) => whileLoop({
  while: constTrue,
  body: constant(options?.disableYield ? self : flatMap2(self, (_) => yieldNow)),
  step: constVoid
}));
var catchCause = /* @__PURE__ */ dual(2, (self, f) => new OnFailureImpl(self, f.length !== 1 ? (cause) => f(cause) : f));
var OnFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnFailure",
  [evaluate]: evaluateCont
});
var OnFailureImpl = function(self, f) {
  this[args] = self;
  this[contE] = f;
};
OnFailureImpl.prototype = OnFailureProto;
var catchCauseFilter = /* @__PURE__ */ dual(3, (self, filter7, f) => catchCause(self, (cause) => {
  const eb = filter7(cause);
  return isFailure2(eb) ? failCause(eb.failure) : f(eb.success, cause);
}));
var catch_ = /* @__PURE__ */ dual(2, (self, f) => catchCauseFilter(self, findError, (e) => f(e)));
var tapCause = /* @__PURE__ */ dual(2, (self, f) => catchCause(self, (cause) => andThen(f(cause), failCause(cause))));
var catchIf = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, predicate, f, orElse2) => catchCause(self, (cause) => {
  const error2 = findError(cause);
  if (isFailure2(error2)) return failCause(error2.failure);
  if (!predicate(error2.success)) {
    return orElse2 ? orElse2(error2.success) : failCause(cause);
  }
  return f(error2.success);
}));
var catchFilter = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, filter7, f, orElse2) => catchCause(self, (cause) => {
  const error2 = findError(cause);
  if (isFailure2(error2)) return failCause(error2.failure);
  const result3 = filter7(error2.success);
  if (isFailure2(result3)) {
    return orElse2 ? orElse2(result3.failure) : failCause(cause);
  }
  return f(result3.success);
}));
var catchTag = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, k, f, orElse2) => {
  const pred = Array.isArray(k) ? (e) => hasProperty(e, "_tag") && k.includes(e._tag) : isTagged(k);
  return catchIf(self, pred, f, orElse2);
});
var catchTags = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, cases, orElse2) => {
  let keys;
  return catchFilter(self, (e) => {
    keys ??= Object.keys(cases);
    return hasProperty(e, "_tag") && isString(e["_tag"]) && keys.includes(e["_tag"]) ? succeed2(e) : fail2(e);
  }, (e) => cases[e["_tag"]](e), orElse2);
});
var mapError = /* @__PURE__ */ dual(2, (self, f) => catch_(self, (error2) => failSync(() => f(error2))));
var orDie = (self) => catch_(self, die);
var orElseSucceed = /* @__PURE__ */ dual(2, (self, f) => catch_(self, (error2) => sync(() => f(error2))));
var ignore = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options) => {
  if (!options?.log) {
    return matchEffect(self, {
      onFailure: (_) => void_,
      onSuccess: (_) => void_
    });
  }
  const logEffect = logWithLevel(options.log === true ? void 0 : options.log);
  return matchCauseEffect(self, {
    onFailure(cause) {
      const failure = findFail(cause);
      return isFailure2(failure) ? failCause(failure.failure) : options.message === void 0 ? logEffect(cause) : logEffect(options.message, cause);
    },
    onSuccess: (_) => void_
  });
});
var result = (self) => matchEager(self, {
  onFailure: fail2,
  onSuccess: succeed2
});
var matchCauseEffect = /* @__PURE__ */ dual(2, (self, options) => new OnSuccessAndFailureImpl(self, options.onSuccess.length !== 1 ? (a) => options.onSuccess(a) : options.onSuccess, options.onFailure.length !== 1 ? (cause) => options.onFailure(cause) : options.onFailure));
var OnSuccessAndFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccessAndFailure",
  [evaluate]: evaluateCont
});
var OnSuccessAndFailureImpl = function(self, onSuccess, onFailure) {
  this[args] = self;
  this[contA] = onSuccess;
  this[contE] = onFailure;
};
OnSuccessAndFailureImpl.prototype = OnSuccessAndFailureProto;
var matchSuccess = function(value3, fiber2) {
  const handlers = this.payload;
  return fiber2.succeedWith(continuationMarksStack ? handlers.onSuccess(value3) : internalCall(() => handlers.onSuccess(value3)));
};
var makeMatch = (op, onFailure) => {
  const Proto9 = makePrimitiveProto({
    op,
    [evaluate]: evaluateCont,
    [contA]: matchSuccess,
    [contE]: onFailure
  });
  const MatchImpl2 = function(self, handlers) {
    this[args] = self;
    this.payload = handlers;
  };
  MatchImpl2.prototype = Proto9;
  return MatchImpl2;
};
var MatchImpl = /* @__PURE__ */ makeMatch("Match", function(cause, fiber2) {
  const fail10 = cause.reasons.find(isFailReason);
  if (fail10 === void 0) return failCause(cause);
  const handlers = this.payload;
  return fiber2.succeedWith(continuationMarksStack ? handlers.onFailure(fail10.error) : internalCall(() => handlers.onFailure(fail10.error)));
});
var matchEffect = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect(self, {
  onFailure: (cause) => {
    const fail10 = cause.reasons.find(isFailReason);
    return fail10 ? options.onFailure(fail10.error) : failCause(cause);
  },
  onSuccess: options.onSuccess
}));
var match5 = /* @__PURE__ */ dual(2, (self, options) => new MatchImpl(self, options));
var matchEager = /* @__PURE__ */ dual(2, (self, options) => {
  if (effectIsExit(self)) {
    if (self._tag === "Success") return exitSucceed(options.onSuccess(self.value));
    const error2 = findError(self.cause);
    if (isFailure2(error2)) return self;
    return exitSucceed(options.onFailure(error2.success));
  }
  return match5(self, options);
});
var exit = (self) => effectIsExit(self) ? exitSucceed(self) : exitPrimitive(self);
var exitPrimitive = /* @__PURE__ */ makePrimitive({
  op: "Exit",
  [evaluate](fiber2) {
    fiber2._stack.push(this);
    return this[args];
  },
  [contA](value3, fiber2, exit3) {
    return fiber2.succeedWith(exit3 ?? exitSucceed(value3));
  },
  [contE](cause, fiber2, exit3) {
    return fiber2.succeedWith(exit3 ?? exitFailCause(cause));
  }
});
var ScopeTypeId = "~effect/Scope";
var ScopeCloseableTypeId = "~effect/Scope/Closeable";
var scopeTag = /* @__PURE__ */ Service("effect/Scope");
var scopeClose = (self, exit_) => withFiber((fiber2) => {
  fiberEnterUninterruptibleUnsafe(fiber2);
  return scopeCloseUnsafe(self, exit_) ?? void_;
});
var scopeCloseUnsafe = (self, exit_) => {
  const state = self.state;
  if (state._tag === "Closed") return;
  self.state = {
    _tag: "Closed",
    exit: exit_
  };
  if (self.parent !== void 0) {
    scopeRemoveFinalizerUnsafe(self.parent, self);
  }
  if (state._tag === "Empty") return;
  if (state.finalizer !== void 0) {
    return runFinalizer(state.finalizer, exit_);
  }
  const finalizers = state.finalizers;
  if (finalizers.size === 1) {
    return runFinalizer(finalizers.values().next().value, exit_);
  }
  return scopeCloseFinalizers(self, finalizers, exit_);
};
var runFinalizer = (finalizer, exit_) => {
  try {
    return finalizer(exit_);
  } catch (defect) {
    return exitDie(defect);
  }
};
var combineFinalizerCause = (exit_, finalizer) => exitIsSuccess(exit_) ? finalizer : catchCause(finalizer, (cause) => failCause(causeCombine(exit_.cause, cause)));
var scopeCloseFinalizers = /* @__PURE__ */ fnUntraced(function* (self, finalizers, exit_) {
  let exits = [];
  const fibers = [];
  const arr = Array.from(finalizers.values());
  const parent = getCurrentFiber();
  for (let i = arr.length - 1; i >= 0; i--) {
    const finalizer = arr[i];
    if (self.strategy === "sequential") {
      exits.push(yield* exit(runFinalizer(finalizer, exit_)));
    } else {
      fibers.push(forkUnsafe(parent, runFinalizer(finalizer, exit_), true, true, "inherit"));
    }
  }
  if (fibers.length > 0) {
    exits = yield* fiberAwaitAll(fibers);
  }
  return yield* exitAsVoidAll(exits);
});
var scopeForkUnsafe = (scope3, finalizerStrategy) => {
  const child = makeScope(finalizerStrategy, scope3);
  if (scope3.state._tag === "Closed") {
    child.state = scope3.state;
    return child;
  }
  scopeAddFinalizerUnsafe(scope3, child, (exit3) => scopeClose(child, exit3));
  return child;
};
var scopeAddFinalizerExit = (scope3, finalizer) => {
  return suspend(() => {
    if (scope3.state._tag === "Closed") {
      return finalizer(scope3.state.exit);
    }
    scopeAddFinalizerUnsafe(scope3, {}, finalizer);
    return void_;
  });
};
var scopeAddFinalizer = (scope3, finalizer) => scopeAddFinalizerExit(scope3, constant(finalizer));
var scopeAddFinalizerUnsafe = (scope3, key, finalizer) => {
  if (scope3.state._tag === "Empty") {
    scope3.state = {
      _tag: "Open",
      finalizerKey: key,
      finalizer,
      finalizers: void 0
    };
  } else if (scope3.state._tag === "Open") {
    const state = scope3.state;
    if (state.finalizer !== void 0) {
      state.finalizers = /* @__PURE__ */ new Map([[state.finalizerKey, state.finalizer]]);
      state.finalizerKey = void 0;
      state.finalizer = void 0;
      state.finalizers.set(key, finalizer);
    } else {
      state.finalizers.set(key, finalizer);
    }
  }
};
var scopeRemoveFinalizerUnsafe = (scope3, key) => {
  if (scope3.state._tag !== "Open") return;
  const state = scope3.state;
  if (state.finalizerKey === key) {
    scope3.state = constScopeEmpty;
  } else if (state.finalizers !== void 0) {
    state.finalizers.delete(key);
    if (state.finalizers.size === 0) {
      scope3.state = constScopeEmpty;
    }
  }
};
var scopeMakeUnsafe = (finalizerStrategy) => makeScope(finalizerStrategy, void 0);
var makeScope = (finalizerStrategy = "sequential", parent) => ({
  [ScopeCloseableTypeId]: ScopeCloseableTypeId,
  [ScopeTypeId]: ScopeTypeId,
  strategy: finalizerStrategy,
  parent,
  state: constScopeEmpty
});
var constScopeEmpty = {
  _tag: "Empty"
};
var scope = scopeTag;
var provideScope = /* @__PURE__ */ provideService(scopeTag);
var scoped = (self) => withFiber((fiber2) => {
  const prev = fiber2.context;
  const scope3 = scopeMakeUnsafe();
  fiber2.setContext(add(fiber2.context, scopeTag, scope3));
  onExitUnsafe(fiber2, (exit3) => {
    fiber2.setContext(prev);
    return scopeCloseUnsafe(scope3, exit3);
  });
  return self;
});
var scopedWith = (f) => suspend(() => {
  const scope3 = scopeMakeUnsafe();
  return onExit(f(scope3), (exit3) => suspend(() => scopeCloseUnsafe(scope3, exit3) ?? void_));
});
var acquireRelease = (acquire, release2, options) => contextWith((context3) => uninterruptibleMask((restore) => flatMap2(scope, (scope3) => tap(options?.interruptible ? restore(acquire) : acquire, (a) => scopeAddFinalizerExit(scope3, (exit3) => provideContext(release2(a, exit3), context3))))));
var addFinalizer = (finalizer) => flatMap2(scope, (scope3) => contextWith((context3) => scopeAddFinalizerExit(scope3, (exit3) => provideContext(finalizer(exit3), context3))));
var OnExitImpl = /* @__PURE__ */ (function() {
  const Proto9 = /* @__PURE__ */ makePrimitiveProto({
    op: "OnExit",
    [evaluate](fiber2) {
      fiber2._stack.push(this);
      return this.effect;
    },
    [contAll](fiber2) {
      if (fiber2.interruptible && this.interruptible !== true) {
        fiber2._stack.push(setInterruptibleTrue);
        fiber2.interruptible = false;
      }
    },
    [contA](value3, _, exit3) {
      exit3 ??= exitSucceed(value3);
      let eff;
      try {
        eff = this.onExit(exit3);
      } catch (defect) {
        eff = exitDie(defect);
      }
      return eff ? flatMap2(eff, (_2) => exit3) : exit3;
    },
    [contE](cause, _, exit3) {
      exit3 ??= exitFailCause(cause);
      let eff;
      try {
        eff = this.onExit(exit3);
      } catch (defect) {
        eff = exitDie(defect);
      }
      return eff ? flatMap2(combineFinalizerCause(exit3, eff), (_2) => exit3) : exit3;
    }
  });
  const OnExitImpl2 = function(effect2, onExit4, interruptible2) {
    this.effect = effect2;
    this.onExit = onExit4;
    this.interruptible = interruptible2;
  };
  OnExitImpl2.prototype = Proto9;
  return OnExitImpl2;
})();
var onExitPrimitive = (effect2, onExit4, interruptible2) => new OnExitImpl(effect2, onExit4, interruptible2);
var onExitUnsafe = (fiber2, f) => {
  ;
  fiber2._stack.push(new OnExitImpl(void 0, f, void 0));
};
var onExit = /* @__PURE__ */ dual(2, onExitPrimitive);
var ensuring = /* @__PURE__ */ dual(2, (self, finalizer) => onExit(self, (_) => finalizer));
var onExitFilter = /* @__PURE__ */ dual(3, (self, filter7, f) => onExit(self, (exit3) => {
  const b = filter7(exit3);
  return isFailure2(b) ? void_ : f(b.success, exit3);
}));
var onError = /* @__PURE__ */ dual(2, (self, f) => onExitFilter(self, exitFilterCause, f));
var interrupt = /* @__PURE__ */ withFiber((fiber2) => failCause(causeInterrupt(fiber2.id)));
var uninterruptible = (self) => withFiber((fiber2) => {
  if (!fiber2.interruptible) return self;
  fiber2.interruptible = false;
  fiber2._stack.push(setInterruptibleTrue);
  return self;
});
var setInterruptible = /* @__PURE__ */ makePrimitive({
  op: "SetInterruptible",
  [contAll](fiber2) {
    fiber2.interruptible = this[args];
    if (fiber2._interruptedCause && fiber2.interruptible) {
      return () => failCause(fiber2._interruptedCause);
    }
  }
});
var setInterruptibleTrue = /* @__PURE__ */ setInterruptible(true);
var setInterruptibleFalse = /* @__PURE__ */ setInterruptible(false);
var setFiberInterruptible = (fiber2) => {
  fiber2.interruptible = true;
  fiber2._stack.push(setInterruptibleFalse);
  if (fiber2._interruptedCause) return failCause(fiber2._interruptedCause);
};
var fiberEnterUninterruptibleUnsafe = (fiber2) => {
  const impl = fiber2;
  if (!impl.interruptible) return;
  impl.interruptible = false;
  impl._stack.push(setInterruptibleTrue);
};
var interruptible = (self) => withFiber((fiber2) => {
  if (fiber2.interruptible) return self;
  return setFiberInterruptible(fiber2) ?? self;
});
var uninterruptibleMask = (f) => withFiber((fiber2) => {
  if (!fiber2.interruptible) return f(identity);
  fiber2.interruptible = false;
  fiber2._stack.push(setInterruptibleTrue);
  return f(interruptible);
});
var whileLoop = /* @__PURE__ */ makePrimitive({
  op: "While",
  [contA](value3, fiber2) {
    this[args].step(value3);
    if (this[args].while()) {
      fiber2._stack.push(this);
      return this[args].body();
    }
    return exitVoid;
  },
  [evaluate](fiber2) {
    if (this[args].while()) {
      fiber2._stack.push(this);
      return this[args].body();
    }
    return exitVoid;
  }
});
var forEach = /* @__PURE__ */ dual((args2) => typeof args2[1] === "function", (iterable, f, options) => suspend(() => {
  const concurrency = resolveConcurrency(options?.concurrency);
  if (concurrency === 1) {
    return forEachSequential(iterable, f, options);
  }
  const items = fromIterable(iterable);
  let length = items.length;
  if (length === 0) {
    return options?.discard ? void_ : succeed3([]);
  }
  const out = options?.discard ? void 0 : new Array(length);
  const eff = forEachConcurrent({
    f,
    out
  }, items, {
    concurrency
  });
  return eff ? as(eff, out) : succeed3(out);
}));
var forEachSequential = (iterable, f, options) => suspend(() => {
  const out = options?.discard ? void 0 : [];
  const iterator = iterable[Symbol.iterator]();
  let state = iterator.next();
  let index = 0;
  return as(whileLoop({
    while: () => !state.done,
    body: () => f(state.value, index++),
    step: (b) => {
      if (out) out.push(b);
      state = iterator.next();
    }
  }), out);
});
var resolveConcurrency = (concurrency) => concurrency === "unbounded" ? Number.POSITIVE_INFINITY : Math.max(1, concurrency ?? 1);
var iterateEager = () => (options) => {
  const onItem = options.onItem;
  const step = options.step;
  const resumeSequential = (state, items, index, end, effect2) => flatMap2(exit(effect2), (itemExit) => step(state, items[index], itemExit, index) ?? runSequential(state, items, index + 1, end) ?? void_);
  const runSequential = (state, items, index = 0, end = items.length) => {
    for (; index < end; index++) {
      const item = items[index];
      const effect2 = onItem(state, item, index);
      if (!effectIsExit(effect2)) {
        return resumeSequential(state, items, index, end, effect2);
      }
      const terminal = step(state, item, effect2, index);
      if (terminal) return terminal._tag === "Failure" ? terminal : void 0;
    }
  };
  return runSequential;
};
var iterateConcurrentImpl = (options) => {
  const onItem = options.onItem;
  const step = options.step;
  return (state, items, opts) => {
    let index = 0;
    const end = opts.end ?? items.length;
    const concurrency = opts.concurrency;
    let done3 = false;
    let parentFiber;
    let fibers;
    let resume;
    let terminal;
    let effect2;
    const failDefect = (error2) => {
      const defect = exitDie(error2);
      terminal = defect;
      done3 = true;
      return fibers && fibers.size > 0 ? flatMap2(uninterruptible(fiberInterruptAll(Array.from(fibers))), () => terminal ?? defect) : defect;
    };
    const go = () => {
      let paused = false;
      for (; !terminal && index < end; index++) {
        const item = items[index];
        const eff = effect2 ?? onItem(state, item, index);
        if (effectIsExit(eff)) {
          terminal = step(state, item, eff, index);
          if (terminal) break;
        } else if (!parentFiber) {
          return callback((cb) => {
            parentFiber = getCurrentFiber();
            fibers = /* @__PURE__ */ new Set();
            effect2 = eff;
            resume = cb;
            let result3;
            try {
              result3 = go();
            } catch (error2) {
              return cb(failDefect(error2));
            }
            if (result3) return cb(result3);
            return suspend(() => {
              terminal ??= exitVoid;
              return flatMap2(fibers ? fiberInterruptAll(fibers) : void_, () => terminal?._tag === "Failure" ? terminal : void_);
            });
          });
        } else {
          effect2 = void 0;
          const fiber2 = forkUnsafe(parentFiber, eff, true, true, "inherit");
          if (fiber2._exit) {
            terminal = step(state, item, fiber2._exit, index);
            if (terminal) break;
            continue;
          }
          fibers.add(fiber2);
          const currentIndex = index;
          fiber2.addObserver((exit3) => {
            fibers.delete(fiber2);
            try {
              if (terminal) {
                if (exit3._tag === "Failure") {
                  const reasons = exit3.cause.reasons.filter((reason) => reason._tag !== "Interrupt");
                  if (reasons.length > 0) {
                    const cause = causeFromReasons(reasons);
                    terminal = exitFailCause(terminal._tag === "Failure" ? causeCombine(terminal.cause, cause) : cause);
                  }
                }
              } else {
                const result3 = step(state, item, exit3, currentIndex);
                if (result3) {
                  terminal = result3;
                  go();
                }
              }
              if (paused) {
                const eff2 = go();
                if (eff2) resume(eff2);
              } else if (done3 && fibers.size === 0) {
                resume(terminal ?? void_);
              }
            } catch (error2) {
              resume(failDefect(error2));
            }
          });
          if (fibers.size < concurrency) continue;
          paused = true;
          index++;
          return;
        }
      }
      done3 = true;
      if (terminal) {
        if (fibers && fibers.size > 0) {
          const annotations = fiberStackAnnotations(parentFiber);
          fibers.forEach((f) => f.interruptUnsafe(parentFiber.id, annotations));
          return;
        }
        if (resume || terminal._tag === "Failure") {
          return terminal;
        }
      } else if (resume) {
        if (!fibers) {
          return exitVoid;
        } else if (fibers.size === 0) {
          resume(void_);
        }
      }
    };
    return go();
  };
};
var iterateConcurrent = () => (options) => iterateConcurrentImpl(options);
var forEachConcurrent = /* @__PURE__ */ iterateConcurrentImpl({
  onItem(state, item, index) {
    return state.f(item, index);
  },
  step(state, _, exit3, index) {
    if (exit3._tag === "Failure") return exit3;
    else if (state.out) {
      state.out[index] = exit3.value;
    }
  }
});
var forkUnsafe = (parent, effect2, immediate = false, daemon = false, uninterruptible3 = false) => {
  const parentRuntime = parent;
  const interruptible2 = uninterruptible3 === "inherit" ? parentRuntime.interruptible : !uninterruptible3;
  const child = new FiberImpl(parentRuntime.context, interruptible2);
  if (!daemon) {
    parentRuntime.children().add(child);
    child._parent = parentRuntime;
  }
  if (immediate) {
    child.evaluate(effect2);
  } else {
    child._asyncContext = captureAsyncContext();
    parentRuntime.currentDispatcher.scheduleTask(() => child.evaluate(effect2), 0);
  }
  return child;
};
var forkIn = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, scope3, options) => withFiber((parent) => {
  const fiber2 = forkUnsafe(parent, self, options?.startImmediately, true, options?.uninterruptible);
  if (!fiber2._exit) {
    if (scope3.state._tag !== "Closed") {
      const key = {};
      const finalizer = () => withFiberId((interruptor) => interruptor === fiber2.id ? void_ : fiberInterrupt(fiber2));
      scopeAddFinalizerUnsafe(scope3, key, finalizer);
      fiber2.addObserver(() => scopeRemoveFinalizerUnsafe(scope3, key));
    } else {
      fiber2.interruptUnsafe(parent.id, fiberStackAnnotations(parent));
    }
  }
  return succeed3(fiber2);
}));
var forkScoped = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options) => flatMap2(scope, (scope3) => forkIn(self, scope3, options)));
var runForkWith = (context3) => (effect2, options) => {
  const fiber2 = new FiberImpl(options?.scheduler ? add(context3, Scheduler, options.scheduler) : context3, options?.uninterruptible !== true);
  fiber2.evaluate(effect2);
  if (fiber2._exit) return fiber2;
  if (options?.signal) {
    if (options.signal.aborted) {
      fiber2.interruptUnsafe();
    } else {
      const abort = () => fiber2.interruptUnsafe();
      options.signal.addEventListener("abort", abort, {
        once: true
      });
      fiber2.addObserver(() => options.signal.removeEventListener("abort", abort));
    }
  }
  if (options?.onFiberStart) {
    options.onFiberStart(fiber2);
  }
  return fiber2;
};
var fiberRunIn = /* @__PURE__ */ dual(2, (self, scope3) => {
  if (self._exit) {
    return self;
  } else if (scope3.state._tag === "Closed") {
    self.interruptUnsafe(self.id);
    return self;
  }
  scopeRemoveFinalizerUnsafe(scope3, self);
  scopeAddFinalizerUnsafe(scope3, self, () => fiberInterrupt(self));
  self.addObserver(() => scopeRemoveFinalizerUnsafe(scope3, self));
  return self;
});
var runFork = /* @__PURE__ */ runForkWith(/* @__PURE__ */ empty());
var runSyncExitWith = (context3) => {
  const runFork3 = runForkWith(context3);
  return (effect2) => {
    if (effectIsExit(effect2)) return effect2;
    const scheduler = new MixedScheduler("sync");
    const fiber2 = runFork3(effect2, {
      scheduler
    });
    fiber2._dispatcher?.flush();
    return fiber2._exit ?? exitDie(new AsyncFiberError(fiber2));
  };
};
var runSyncExit = /* @__PURE__ */ runSyncExitWith(/* @__PURE__ */ empty());
var succeedTrue = /* @__PURE__ */ succeed3(true);
var succeedFalse = /* @__PURE__ */ succeed3(false);
var Latch = class {
  waiters = [];
  scheduled = void 0;
  _isOpen;
  constructor(isOpen) {
    this._isOpen = isOpen;
  }
  scheduleUnsafe(fiber2) {
    if (this.waiters.length === 0) {
      return succeedTrue;
    }
    if (this.scheduled === void 0) {
      this.scheduled = this.waiters;
      fiber2.currentDispatcher.scheduleTask(this.flushScheduled, 0);
    } else {
      for (let i = 0; i < this.waiters.length; i++) {
        this.scheduled.push(this.waiters[i]);
      }
    }
    this.waiters = [];
    return succeedTrue;
  }
  flushScheduled = () => {
    if (this.scheduled === void 0) return;
    const waiters = this.scheduled;
    this.scheduled = void 0;
    for (let i = 0; i < waiters.length; i++) {
      waiters[i](exitVoid);
    }
  };
  flushWaiters() {
    const waiters = this.waiters;
    this.waiters = [];
    this.flushScheduled();
    for (let i = 0; i < waiters.length; i++) {
      waiters[i](exitVoid);
    }
  }
  open = /* @__PURE__ */ withFiber((fiber2) => {
    if (this._isOpen) return succeedFalse;
    this._isOpen = true;
    return this.scheduleUnsafe(fiber2);
  });
  release = /* @__PURE__ */ withFiber((fiber2) => this._isOpen ? succeedFalse : this.scheduleUnsafe(fiber2));
  openUnsafe() {
    if (this._isOpen) return false;
    this._isOpen = true;
    this.flushWaiters();
    return true;
  }
  await = /* @__PURE__ */ callback((resume) => {
    if (this._isOpen) {
      return resume(void_);
    }
    this.waiters.push(resume);
    return sync(() => {
      let index = this.waiters.indexOf(resume);
      if (index !== -1) {
        this.waiters.splice(index, 1);
      } else if (this.scheduled !== void 0) {
        index = this.scheduled.indexOf(resume);
        if (index !== -1) {
          this.scheduled.splice(index, 1);
        }
      }
    });
  });
  closeUnsafe() {
    if (!this._isOpen) return false;
    this._isOpen = false;
    return true;
  }
  close = /* @__PURE__ */ sync(() => this.closeUnsafe());
  whenOpen = (self) => flatMap2(this.await, () => self);
  isOpen() {
    return this._isOpen;
  }
};
var makeLatchUnsafe = (open3) => new Latch(open3 ?? false);
var bigint02 = /* @__PURE__ */ BigInt(0);
var NoopSpanProto = {
  _tag: "Span",
  spanId: "noop",
  traceId: "noop",
  sampled: false,
  status: {
    _tag: "Ended",
    startTime: bigint02,
    endTime: bigint02,
    exit: exitVoid
  },
  attributes: /* @__PURE__ */ new Map(),
  links: [],
  kind: "internal",
  attribute() {
  },
  event() {
  },
  end() {
  },
  addLinks() {
  }
};
var noopSpan = (options) => Object.assign(Object.create(NoopSpanProto), options);
var filterDisablePropagation = (span) => {
  if (!span) return none2();
  return get(span.annotations, DisablePropagation) ? span._tag === "Span" ? filterDisablePropagation(getOrUndefined(span.parent)) : none2() : some2(span);
};
var makeSpanUnsafe = (fiber2, name, options) => {
  const disablePropagation = !fiber2.cache.tracerEnabled || options?.annotations && get(options.annotations, DisablePropagation);
  const parent = options?.parent !== void 0 ? some2(options.parent) : options?.root ? none2() : filterDisablePropagation(fiber2.cache.span);
  let span;
  if (disablePropagation) {
    span = noopSpan({
      name,
      parent,
      annotations: add(options?.annotations ?? empty(), DisablePropagation, true)
    });
  } else {
    const tracer2 = fiber2.cache.tracer ?? nativeTracer;
    const clock = fiber2.getRef(ClockRef);
    const timingEnabled = fiber2.getRef(TracerTimingEnabled);
    const annotationsFromEnv = fiber2.getRef(TracerSpanAnnotations);
    const linksFromEnv = fiber2.getRef(TracerSpanLinks);
    const level = options?.level ?? fiber2.getRef(CurrentTraceLevel);
    const links = options?.links !== void 0 ? [...linksFromEnv, ...options.links] : linksFromEnv.length === 0 ? [] : linksFromEnv.slice();
    span = tracer2.span({
      name,
      parent,
      annotations: options?.annotations ?? empty(),
      links,
      startTime: timingEnabled ? clock.currentTimeNanosUnsafe() : bigint02,
      kind: options?.kind ?? "internal",
      root: options?.root ?? false,
      sampled: options?.sampled ?? (isSome2(parent) && parent.value.sampled === false ? false : !isLogLevelGreaterThan(fiber2.getRef(MinimumTraceLevel), level))
    });
    for (const key in annotationsFromEnv) {
      span.attribute(key, annotationsFromEnv[key]);
    }
    if (options?.attributes !== void 0) {
      for (const key in options.attributes) {
        span.attribute(key, options.attributes[key]);
      }
    }
  }
  return span;
};
var endSpan = (span, exit3, clock, timingEnabled) => sync(() => {
  if (span.status._tag === "Ended") return;
  span.end(timingEnabled ? clock.currentTimeNanosUnsafe() : bigint02, exit3);
});
var useSpan = (name, ...args2) => {
  const options = args2.length === 1 ? void 0 : args2[0];
  const evaluate2 = args2[args2.length - 1];
  return withFiber((fiber2) => {
    const span = makeSpanUnsafe(fiber2, name, options);
    const clock = fiber2.getRef(ClockRef);
    const timingEnabled = fiber2.getRef(TracerTimingEnabled);
    onExitUnsafe(fiber2, (exit3) => endSpan(span, exit3, clock, timingEnabled));
    return evaluate2(span);
  });
};
var provideParentSpan = /* @__PURE__ */ provideService(ParentSpan);
var ClockRef = /* @__PURE__ */ Reference("effect/Clock", {
  defaultValue: () => new ClockImpl()
});
var MAX_TIMER_MILLIS = 2 ** 31 - 1;
var ClockImpl = class {
  currentTimeMillisUnsafe() {
    return Date.now();
  }
  currentTimeMillis = /* @__PURE__ */ sync(() => this.currentTimeMillisUnsafe());
  currentTimeNanosUnsafe() {
    return wallTimeNanos();
  }
  currentTimeNanos = /* @__PURE__ */ sync(() => this.currentTimeNanosUnsafe());
  monotonicTimeNanosUnsafe() {
    return monotonicNowNanos();
  }
  monotonicTimeNanos = /* @__PURE__ */ sync(() => this.monotonicTimeNanosUnsafe());
  sleep(duration) {
    return this.sleepMillis(toMillis(duration));
  }
  sleepMillis(millis2) {
    if (millis2 <= 0) return yieldNow;
    else if (!Number.isFinite(millis2)) return never;
    return callback((resume) => {
      const continuation = millis2 > MAX_TIMER_MILLIS ? this.sleepMillis(millis2 - MAX_TIMER_MILLIS) : void_;
      const handle = setTimeout(() => resume(continuation), Math.min(millis2, MAX_TIMER_MILLIS));
      return sync(() => clearTimeout(handle));
    });
  }
};
var nanosPerMilli = /* @__PURE__ */ BigInt(1e6);
var monotonicNowNanos = /* @__PURE__ */ (function() {
  const processHrtime = globalThis.process?.hrtime;
  if (typeof processHrtime?.bigint === "function") {
    return () => processHrtime.bigint();
  }
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return () => BigInt(Math.round(performance.now() * 1e6));
  }
  let previous = /* @__PURE__ */ BigInt(0);
  return () => {
    const current = BigInt(Date.now()) * nanosPerMilli;
    if (current > previous) {
      previous = current;
    }
    return previous;
  };
})();
var wallTimeNanos = /* @__PURE__ */ (function() {
  const reanchorThresholdNanos = /* @__PURE__ */ BigInt(1e9);
  let origin;
  return () => {
    const monotonic = monotonicNowNanos();
    const wall = BigInt(Date.now()) * nanosPerMilli;
    if (origin === void 0) {
      origin = wall - monotonic;
    } else {
      const projected = origin + monotonic;
      const skew = wall > projected ? wall - projected : projected - wall;
      if (skew > reanchorThresholdNanos) {
        origin = wall - monotonic;
      }
    }
    return origin + monotonic;
  };
})();
var clockWith = (f) => withFiber((fiber2) => f(fiber2.getRef(ClockRef)));
var sleep = (duration) => clockWith((clock) => clock.sleep(fromInputUnsafe(duration)));
var TimeoutErrorTypeId = "~effect/Cause/TimeoutError";
var TimeoutError = class extends (/* @__PURE__ */ TaggedError("TimeoutError")) {
  [TimeoutErrorTypeId] = TimeoutErrorTypeId;
  constructor(message) {
    super({
      message
    });
  }
};
var IllegalArgumentErrorTypeId = "~effect/Cause/IllegalArgumentError";
var IllegalArgumentError = class extends (/* @__PURE__ */ TaggedError("IllegalArgumentError")) {
  [IllegalArgumentErrorTypeId] = IllegalArgumentErrorTypeId;
  constructor(message) {
    super({
      message
    });
  }
};
var ExceededCapacityErrorTypeId = "~effect/Cause/ExceededCapacityError";
var ExceededCapacityError = class extends (/* @__PURE__ */ TaggedError("ExceededCapacityError")) {
  [ExceededCapacityErrorTypeId] = ExceededCapacityErrorTypeId;
  constructor(message) {
    super({
      message
    });
  }
};
var AsyncFiberErrorTypeId = "~effect/Cause/AsyncFiberError";
var AsyncFiberError = class extends (/* @__PURE__ */ TaggedError("AsyncFiberError")) {
  [AsyncFiberErrorTypeId] = AsyncFiberErrorTypeId;
  constructor(fiber2) {
    super({
      message: "An asynchronous Effect was executed with Effect.runSync",
      fiber: fiber2
    });
  }
};
var UnknownErrorTypeId = "~effect/Cause/UnknownError";
var UnknownError = class extends (/* @__PURE__ */ TaggedError("UnknownError")) {
  [UnknownErrorTypeId] = UnknownErrorTypeId;
  constructor(cause, message) {
    super({
      message,
      cause
    });
  }
};
var ConsoleRef = /* @__PURE__ */ Reference("effect/Console", {
  defaultValue: () => globalThis.console
});
var logLevelToOrder = (level) => {
  switch (level) {
    case "All":
      return Number.MIN_SAFE_INTEGER;
    case "Fatal":
      return 5e4;
    case "Error":
      return 4e4;
    case "Warn":
      return 3e4;
    case "Info":
      return 2e4;
    case "Debug":
      return 1e4;
    case "Trace":
      return 0;
    case "None":
      return Number.MAX_SAFE_INTEGER;
  }
};
var LogLevelOrder = /* @__PURE__ */ mapInput(Number2, logLevelToOrder);
var isLogLevelGreaterThan = /* @__PURE__ */ isGreaterThan(LogLevelOrder);
var CurrentLoggers = /* @__PURE__ */ Reference("effect/Logger/CurrentLoggers", {
  defaultValue: () => /* @__PURE__ */ new Set([defaultLogger, tracerLogger])
});
var LogToStderr = /* @__PURE__ */ Reference("effect/Logger/LogToStderr", {
  defaultValue: constFalse
});
var LoggerTypeId = "~effect/Logger";
var LoggerProto = {
  [LoggerTypeId]: {
    _Message: identity,
    _Output: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var loggerMake = (log2) => {
  const self = Object.create(LoggerProto);
  self.log = log2;
  return self;
};
var formatLabel = (key) => key.replace(/[\s="]/g, "_");
var formatLogSpan = (self, now) => {
  const label = formatLabel(self[0]);
  return `${label}=${now - self[1]}ms`;
};
var logWithLevel = (level) => (...message) => {
  let cause = void 0;
  for (let i = 0, len = message.length; i < len; i++) {
    const msg = message[i];
    if (isCause(msg)) {
      if (cause) {
        ;
        message.splice(i, 1);
      } else {
        message = message.slice(0, i).concat(message.slice(i + 1));
      }
      cause = cause ? causeFromReasons(cause.reasons.concat(msg.reasons)) : msg;
      i--;
    }
  }
  if (cause === void 0) {
    cause = causeEmpty;
  }
  return withFiber((fiber2) => {
    const logLevel = level ?? fiber2.cache.logLevel;
    if (isLogLevelGreaterThan(fiber2.cache.minimumLogLevel, logLevel)) {
      return void_;
    }
    const clock = fiber2.getRef(ClockRef);
    const loggers = fiber2.getRef(CurrentLoggers);
    if (loggers.size > 0) {
      const date = new Date(clock.currentTimeMillisUnsafe());
      for (const logger of loggers) {
        logger.log({
          cause,
          fiber: fiber2,
          date,
          logLevel,
          message
        });
      }
    }
    return void_;
  });
};
var colors = {
  bold: "1",
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
  cyan: "36",
  white: "37",
  gray: "90",
  black: "30",
  bgBrightRed: "101"
};
var logLevelColors = {
  None: [],
  All: [],
  Trace: [colors.gray],
  Debug: [colors.blue],
  Info: [colors.green],
  Warn: [colors.yellow],
  Error: [colors.red],
  Fatal: [colors.bgBrightRed, colors.black]
};
var defaultDateFormat = (date) => `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`;
var defaultLogger = /* @__PURE__ */ loggerMake(({
  cause,
  date,
  fiber: fiber2,
  logLevel,
  message
}) => {
  const message_ = Array.isArray(message) ? message.slice() : [message];
  if (cause.reasons.length > 0) {
    message_.push(causePretty(cause));
  }
  const now = date.getTime();
  const spans = fiber2.getRef(CurrentLogSpans);
  let spanString = "";
  for (const span of spans) {
    spanString += ` ${formatLogSpan(span, now)}`;
  }
  const annotations = fiber2.getRef(CurrentLogAnnotations);
  if (Object.keys(annotations).length > 0) {
    message_.push(annotations);
  }
  const console = fiber2.getRef(ConsoleRef);
  const log2 = fiber2.getRef(LogToStderr) ? console.error : console.log;
  log2(`[${defaultDateFormat(date)}] ${logLevel.toUpperCase()} (#${fiber2.id})${spanString}:`, ...message_);
});
var tracerLogger = /* @__PURE__ */ loggerMake(({
  cause,
  fiber: fiber2,
  logLevel,
  message
}) => {
  const clock = fiber2.getRef(ClockRef);
  const annotations = fiber2.getRef(CurrentLogAnnotations);
  const span = fiber2.cache.span;
  if (span === void 0 || span._tag === "ExternalSpan") return;
  const attributes = {};
  for (const [key, value3] of Object.entries(annotations)) {
    assignProperty(attributes, key, value3);
  }
  attributes["effect.fiberId"] = fiber2.id;
  attributes["effect.logLevel"] = logLevel.toUpperCase();
  if (cause.reasons.length > 0) {
    attributes["effect.cause"] = causePretty(cause);
  }
  span.event(toStringUnknown(Array.isArray(message) && message.length === 1 ? message[0] : message), clock.currentTimeNanosUnsafe(), attributes);
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Cause.js
var isFailReason2 = isFailReason;
var isDieReason2 = isDieReason;
var fromReasons = causeFromReasons;
var fail4 = causeFail;
var die2 = causeDie;
var makeFailReason = (error2) => new Fail(error2);
var makeDieReason = (defect) => new Die(defect);
var hasInterruptsOnly2 = hasInterruptsOnly;
var map4 = causeMap;
var squash = causeSquash;
var isDone2 = isDone;
var Done2 = Done;
var done2 = done;
var UnknownError2 = UnknownError;
var reasonAnnotations2 = reasonAnnotations;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Exit.js
var succeed4 = exitSucceed;
var failCause2 = exitFailCause;
var fail5 = exitFail;
var void_2 = exitVoid;
var isSuccess3 = exitIsSuccess;
var isFailure3 = exitIsFailure;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Deferred.js
var TypeId5 = "~effect/Deferred";
var DeferredProto = {
  [TypeId5]: {
    _A: identity,
    _E: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var DeferredImpl = function() {
  this.resumes = void 0;
  this.effect = void 0;
};
DeferredImpl.prototype = DeferredProto;
var makeUnsafe2 = () => new DeferredImpl();
var _await = (self) => callback((resume) => {
  if (self.effect) return resume(self.effect);
  self.resumes ??= [];
  self.resumes.push(resume);
  return sync(() => {
    const resumes = self.resumes;
    if (resumes === void 0) return;
    const index = resumes.indexOf(resume);
    if (index >= 0) resumes.splice(index, 1);
  });
});
var isDone3 = (self) => sync(() => isDoneUnsafe(self));
var isDoneUnsafe = (self) => self.effect !== void 0;
var doneUnsafe = (self, effect2) => {
  if (self.effect) return false;
  self.effect = effect2;
  if (self.resumes) {
    const resumes = self.resumes;
    self.resumes = void 0;
    for (let i = 0; i < resumes.length; i++) {
      resumes[i](effect2);
    }
  }
  return true;
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/References.js
var MinimumLogLevel2 = MinimumLogLevel;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Scope.js
var Scope = scopeTag;
var makeUnsafe3 = scopeMakeUnsafe;
var provide = provideScope;
var addFinalizerExit = scopeAddFinalizerExit;
var addFinalizer2 = scopeAddFinalizer;
var forkUnsafe2 = scopeForkUnsafe;
var close = scopeClose;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Layer.js
var TypeId6 = "~effect/Layer";
var MemoMapTypeId = "~effect/Layer/MemoMap";
var makeMemoMapEntry = (memoMap, layer14) => {
  const entry = {
    observers: 0,
    deferred: makeUnsafe2(),
    scope: makeUnsafe3(),
    finalizer: (exit3) => suspend(() => {
      if (--entry.observers > 0) return void_;
      memoMap.map.delete(layer14);
      return close(entry.scope, exit3);
    })
  };
  return entry;
};
var memoMapObserve = (entry, scope3) => {
  if (scope3.state._tag === "Closed") return false;
  entry.observers++;
  scopeAddFinalizerUnsafe(scope3, {}, entry.finalizer);
  return true;
};
var LayerProto = {
  [TypeId6]: {
    _ROut: identity,
    _E: identity,
    _RIn: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromBuildUnsafe = (build) => {
  const self = Object.create(LayerProto);
  self.build = build;
  return self;
};
var fromBuild = (build) => fromBuildUnsafe((memoMap, scope3) => {
  const layerScope = forkUnsafe2(scope3);
  return onExit(build(memoMap, layerScope), (exit3) => exit3._tag === "Failure" ? close(layerScope, exit3) : void_);
});
var fromBuildMemo = (build) => {
  const self = fromBuild((memoMap, scope3) => memoMap.getOrElseMemoize(self, scope3, build));
  return self;
};
var MemoMapImpl = class {
  get [MemoMapTypeId]() {
    return MemoMapTypeId;
  }
  parent;
  constructor(parent) {
    this.parent = parent;
  }
  map = /* @__PURE__ */ new Map();
  get(layer14, scope3) {
    const local = this.map.get(layer14);
    if (local) {
      memoMapObserve(local, scope3);
      return local.deferred.effect ?? _await(local.deferred);
    }
    return this.parent?.get(layer14, scope3);
  }
  getOrElseMemoize(layer14, scope3, build) {
    return suspend(() => {
      let deferred;
      return onExitPrimitive(suspend(() => {
        const existing = this.get(layer14, scope3);
        if (existing) return existing;
        const entry = makeMemoMapEntry(this, layer14);
        if (!memoMapObserve(entry, scope3)) return build(this, scope3);
        deferred = entry.deferred;
        this.map.set(layer14, entry);
        return build(this, entry.scope);
      }), (exit3) => {
        if (deferred) doneUnsafe(deferred, exit3);
      });
    });
  }
};
var makeMemoMapUnsafe = () => new MemoMapImpl();
var forkMemoMapUnsafe = (parent) => new MemoMapImpl(parent);
var CurrentMemoMap = class _CurrentMemoMap extends (/* @__PURE__ */ Service()("effect/Layer/CurrentMemoMap")) {
  static forkOrCreate(self) {
    const current = getOrUndefined2(self, _CurrentMemoMap);
    return current ? forkMemoMapUnsafe(current) : makeMemoMapUnsafe();
  }
};
var buildWithMemoMap = /* @__PURE__ */ dual(3, (self, memoMap, scope3) => provideService(map3(suspend(() => self.build(memoMap, scope3)), add(CurrentMemoMap, memoMap)), CurrentMemoMap, memoMap));
var buildWithScope = /* @__PURE__ */ dual(2, (self, scope3) => withFiber((fiber2) => buildWithMemoMap(self, CurrentMemoMap.forkOrCreate(fiber2.context), scope3)));
var succeed5 = function() {
  if (arguments.length === 1) {
    return (resource) => succeedContext(make2(arguments[0], resource));
  }
  return succeedContext(make2(arguments[0], arguments[1]));
};
var succeedContext = (context3) => fromBuildUnsafe(constant(succeed3(context3)));
var effect = function() {
  if (arguments.length === 1) {
    return (effect2) => effectImpl(arguments[0], effect2);
  }
  return effectImpl(arguments[0], arguments[1]);
};
var effectImpl = (service3, effect2) => effectContext(map3(effect2, (value3) => make2(service3, value3)));
var effectContext = (effect2) => fromBuildMemo((_, scope3) => provide(effect2, scope3));
var unwrapKey = /* @__PURE__ */ Service("effect/Layer/unwrap");
var unwrap = (self) => flatMap3(effect(unwrapKey)(self), get(unwrapKey));
var mergeAllEffect = (layers, memoMap, scope3) => {
  const parentScope = forkUnsafe2(scope3, "parallel");
  return forEach(layers, (layer14) => layer14.build(memoMap, forkUnsafe2(parentScope, "sequential")), {
    concurrency: layers.length
  }).pipe(map3((context3) => mergeAll(...context3)));
};
var mergeAll2 = (...layers) => fromBuild((memoMap, scope3) => mergeAllEffect(layers, memoMap, scope3));
var provideWith = (self, that, f) => fromBuild((memoMap, scope3) => flatMap2(Array.isArray(that) ? mergeAllEffect(that, memoMap, scope3) : that.build(memoMap, scope3), (context3) => self.build(memoMap, scope3).pipe(provideContext(context3), map3((merged) => f(merged, context3)))));
var provideMerge = /* @__PURE__ */ dual(2, (self, that) => provideWith(self, that, (self2, that2) => merge(that2, self2)));
var flatMap3 = /* @__PURE__ */ dual(2, (self, f) => fromBuild((memoMap, scope3) => flatMap2(self.build(memoMap, scope3), (context3) => f(context3).build(memoMap, scope3))));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Number.js
var Number3 = globalThis.Number;
var round = /* @__PURE__ */ dual(2, (self, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(self * factor) / factor;
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/random.js
var nextBetween = (min, max, draw) => {
  const value3 = draw * (max - min) + min;
  if (value3 !== max || min >= max || !Number.isFinite(max)) {
    return value3;
  }
  if (max === 0) {
    return -Number.MIN_VALUE;
  }
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, max);
  const bits = view.getBigUint64(0);
  view.setBigUint64(0, max > 0 ? bits - BigInt(1) : bits + BigInt(1));
  return view.getFloat64(0);
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Pull.js
var catchDone = /* @__PURE__ */ dual(2, (effect2, f) => catchCauseFilter(effect2, filterDoneLeftover, (l) => f(l)));
var isDoneCause = (cause) => cause.reasons.some(isDoneFailure);
var isDoneFailure = (failure) => failure._tag === "Fail" && isDone2(failure.error);
var filterDone = (cause) => {
  let done3;
  let hasFailure = false;
  for (const reason of cause.reasons) {
    if (isDoneFailure(reason)) {
      done3 ??= reason.error;
    } else if (reason._tag !== "Interrupt") {
      hasFailure = true;
    }
  }
  if (done3 === void 0) return fail2(cause);
  return hasFailure ? fail2(fromReasons(cause.reasons.filter((reason) => !isDoneFailure(reason)))) : succeed2(done3);
};
var filterDoneLeftover = (cause) => {
  const done3 = filterDone(cause);
  return isFailure2(done3) ? done3 : succeed2(done3.success.value);
};
var doneExitFromCause = (cause) => {
  const halt = filterDone(cause);
  return !isFailure2(halt) ? succeed4(halt.success.value) : failCause2(halt.failure);
};
var matchEffect2 = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect(self, {
  onSuccess: options.onSuccess,
  onFailure: (cause) => {
    const halt = filterDone(cause);
    return !isFailure2(halt) ? options.onDone(halt.success.value) : options.onFailure(halt.failure);
  }
}));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/layer.js
var provideLayer = (self, layer14, options) => scopedWith((scope3) => flatMap2(options?.local ? buildWithMemoMap(layer14, makeMemoMapUnsafe(), scope3) : buildWithScope(layer14, scope3), (context3) => provideContext(self, context3)));
var provide2 = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, source, options) => isContext(source) ? provideContext(self, source) : provideLayer(self, Array.isArray(source) ? mergeAll2(...source) : source, options));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Effect.js
var isEffect2 = isEffect;
var forEach2 = forEach;
var whileLoop2 = whileLoop;
var tryPromise2 = tryPromise;
var succeed6 = succeed3;
var suspend2 = suspend;
var sync2 = sync;
var void_3 = void_;
var callback2 = callback;
var gen2 = gen;
var fail6 = fail3;
var failCause3 = failCause;
var failCauseSync2 = failCauseSync;
var die3 = die;
var try_2 = try_;
var withFiber2 = withFiber;
var fromResult2 = fromResult;
var flatMap4 = flatMap2;
var andThen2 = andThen;
var tap2 = tap;
var result2 = result;
var exit2 = exit;
var map5 = map3;
var as2 = as;
var asVoid2 = asVoid;
var catch_2 = catch_;
var catchTag2 = catchTag;
var catchTags2 = catchTags;
var catchCause2 = catchCause;
var catchFilter2 = catchFilter;
var mapError2 = mapError;
var orDie2 = orDie;
var tapCause2 = tapCause;
var ignore2 = ignore;
var orElseSucceed2 = orElseSucceed;
var sleep2 = sleep;
var raceFirst2 = raceFirst;
var match6 = match5;
var matchCauseEffect2 = matchCauseEffect;
var matchEffect3 = matchEffect;
var provide3 = provide2;
var provideContext2 = provideContext;
var serviceOption2 = serviceOption;
var provideService2 = provideService;
var scope2 = scope;
var scoped2 = scoped;
var scopedWith2 = scopedWith;
var acquireRelease2 = acquireRelease;
var addFinalizer3 = addFinalizer;
var ensuring2 = ensuring;
var onError2 = onError;
var onExitPrimitive2 = onExitPrimitive;
var onExit2 = onExit;
var interrupt2 = interrupt;
var uninterruptible2 = uninterruptible;
var uninterruptibleMask2 = uninterruptibleMask;
var forever2 = forever;
var forkIn2 = forkIn;
var forkScoped2 = forkScoped;
var runFork2 = runFork;
var runForkWith2 = runForkWith;
var runSyncExit2 = runSyncExit;
var fnUntraced2 = fnUntraced;
var fn2 = fn;
var clockWith2 = clockWith;
var logError = /* @__PURE__ */ logWithLevel("Error");
var effectify = (fn3, onError4, onSyncError) => (...args2) => callback2((resume) => {
  try {
    fn3(...args2, (err, result3) => {
      if (err) {
        resume(onError4 ? suspend2(() => fail6(onError4(err, args2))) : fail6(err));
      } else {
        resume(succeed6(result3));
      }
    });
  } catch (err) {
    resume(onSyncError ? fail6(onSyncError(err, args2)) : die3(err));
  }
});
var mapEager2 = mapEager;
var mapErrorEager2 = mapErrorEager;
var flatMapEager2 = flatMapEager;
var catchEager2 = catchEager;
var fnUntracedEager2 = fnUntracedEager;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Runtime.js
var defaultTeardown = (exit3, onExit4) => {
  if (isSuccess3(exit3)) return onExit4(0);
  if (hasInterruptsOnly2(exit3.cause)) return onExit4(130);
  return onExit4(getErrorExitCode(squash(exit3.cause)));
};
var makeRunMain = (f) => dual((args2) => isEffect2(args2[0]), (effect2, options) => {
  const fiber2 = options?.disableErrorReporting === true ? runFork2(effect2) : runFork2(tapCause2(effect2, (cause) => {
    if (hasInterruptsOnly2(cause)) return void_3;
    const isReported = getErrorReported(squash(cause));
    return isReported ? logError(cause) : void_3;
  }));
  try {
    const keepAlive = globalThis.setInterval(constVoid, 2147483647);
    fiber2.addObserver(() => {
      clearInterval(keepAlive);
    });
  } catch {
  }
  const teardown = options?.teardown ?? defaultTeardown;
  return f({
    fiber: fiber2,
    teardown
  });
});
var errorExitCode = "~effect/Runtime/errorExitCode";
var getErrorExitCode = (u) => {
  if (typeof u === "object" && u !== null && errorExitCode in u) {
    const code = u[errorExitCode];
    if (typeof code === "number") {
      return code;
    }
  }
  return 1;
};
var errorReported = "~effect/Runtime/errorReported";
var getErrorReported = (u) => {
  if (typeof u === "object" && u !== null && errorReported in u) {
    const isReported = u[errorReported];
    if (typeof isReported === "boolean") {
      return isReported;
    }
  }
  return true;
};

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodeRuntime.js
var runMain = /* @__PURE__ */ makeRunMain(({
  fiber: fiber2,
  teardown
}) => {
  let receivedSignal = false;
  fiber2.addObserver((exit3) => {
    process.removeListener("SIGINT", onSigint);
    process.removeListener("SIGTERM", onSigint);
    teardown(exit3, (code) => {
      if (receivedSignal || code !== 0) {
        process.exit(code);
      }
    });
  });
  function onSigint() {
    receivedSignal = true;
    fiber2.interruptUnsafe(fiber2.id);
  }
  process.on("SIGINT", onSigint);
  process.on("SIGTERM", onSigint);
});

// node_modules/.pnpm/@effect+platform-node@4.0.2_effect@4.0.2_redis@6.3.0/node_modules/@effect/platform-node/dist/NodeRuntime.js
var runMain2 = runMain;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/BigInt.js
var BigInt2 = globalThis.BigInt;
var toNumber = (b) => {
  if (b > BigInt2(Number.MAX_SAFE_INTEGER) || b < BigInt2(Number.MIN_SAFE_INTEGER)) {
    return none2();
  }
  return some2(Number(b));
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/ByteSize.js
var bigint03 = /* @__PURE__ */ BigInt(0);
var bigint12 = /* @__PURE__ */ BigInt(1);
var decimalBase = /* @__PURE__ */ BigInt(1e3);
var binaryBase = /* @__PURE__ */ BigInt(1024);
var decimalUnits = [{
  symbol: "B",
  factor: bigint12,
  names: ["B", "byte", "bytes"]
}, {
  symbol: "kB",
  factor: decimalBase,
  names: ["kB", "kilobyte", "kilobytes"]
}, {
  symbol: "MB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(2),
  names: ["MB", "megabyte", "megabytes"]
}, {
  symbol: "GB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(3),
  names: ["GB", "gigabyte", "gigabytes"]
}, {
  symbol: "TB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(4),
  names: ["TB", "terabyte", "terabytes"]
}, {
  symbol: "PB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(5),
  names: ["PB", "petabyte", "petabytes"]
}, {
  symbol: "EB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(6),
  names: ["EB", "exabyte", "exabytes"]
}, {
  symbol: "ZB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(7),
  names: ["ZB", "zettabyte", "zettabytes"]
}, {
  symbol: "YB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(8),
  names: ["YB", "yottabyte", "yottabytes"]
}, {
  symbol: "RB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(9),
  names: ["RB", "ronnabyte", "ronnabytes"]
}, {
  symbol: "QB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(10),
  names: ["QB", "quettabyte", "quettabytes"]
}];
var binaryUnits = [decimalUnits[0], {
  symbol: "KiB",
  factor: binaryBase,
  names: ["KiB", "kibibyte", "kibibytes"]
}, {
  symbol: "MiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(2),
  names: ["MiB", "mebibyte", "mebibytes"]
}, {
  symbol: "GiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(3),
  names: ["GiB", "gibibyte", "gibibytes"]
}, {
  symbol: "TiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(4),
  names: ["TiB", "tebibyte", "tebibytes"]
}, {
  symbol: "PiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(5),
  names: ["PiB", "pebibyte", "pebibytes"]
}, {
  symbol: "EiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(6),
  names: ["EiB", "exbibyte", "exbibytes"]
}, {
  symbol: "ZiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(7),
  names: ["ZiB", "zebibyte", "zebibytes"]
}, {
  symbol: "YiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(8),
  names: ["YiB", "yobibyte", "yobibytes"]
}];
var allUnits = [...decimalUnits, .../* @__PURE__ */ binaryUnits.slice(1)];
var unitsByName = /* @__PURE__ */ new Map(/* @__PURE__ */ allUnits.flatMap((unit) => unit.names.map((name) => [name, unit])));
var make5 = (value3) => value3;
var invalid2 = (message) => {
  throw new Error(`Invalid ByteSize: ${message}`);
};
var fromNumber = (input) => {
  if (!Number.isSafeInteger(input) || input < 0) {
    return invalid2(`expected a non-negative safe integer, received ${input}`);
  }
  return make5(BigInt(input));
};
var fromStringUnsafe = (input) => {
  const match7 = /^\s*(\d+)(?:\.(\d+))?\s*([A-Za-z]+)\s*$/.exec(input);
  if (match7 === null) return invalid2(`unsupported syntax ${JSON.stringify(input)}`);
  const unit = unitsByName.get(match7[3]);
  if (unit === void 0) return invalid2(`unsupported unit ${JSON.stringify(match7[3])}`);
  const fraction = match7[2] ?? "";
  const scale = BigInt(10) ** BigInt(fraction.length);
  const numerator = BigInt(match7[1] + fraction) * unit.factor;
  if (numerator % scale !== bigint03) {
    return invalid2(`${JSON.stringify(input)} does not represent an integral number of bytes`);
  }
  return make5(numerator / scale);
};
var fromInputUnsafe2 = (input) => {
  switch (typeof input) {
    case "bigint":
      if (input < bigint03) return invalid2(`expected a non-negative bigint, received ${input}`);
      return make5(input);
    case "number":
      return fromNumber(input);
    case "string":
      return fromStringUnsafe(input);
  }
  return invalid2(`unsupported input ${input}`);
};
var bytes = (value3) => typeof value3 === "bigint" ? fromInputUnsafe2(value3) : fromNumber(value3);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/PlatformError.js
var TypeId7 = "~effect/PlatformError";
var BadArgument = class extends (/* @__PURE__ */ TaggedError2("BadArgument")) {
  /**
   * Formats the module, method, and optional description that rejected the argument.
   *
   * **When to use**
   *
   * Use to read the formatted error message for a rejected platform argument.
   *
   * @since 4.0.0
   */
  get message() {
    return `${this.module}.${this.method}${this.description ? `: ${this.description}` : ""}`;
  }
};
var SystemError = class extends Error3 {
  /**
   * Formats the normalized system error tag with operation and path details.
   *
   * **When to use**
   *
   * Use to read the formatted error message for a normalized system failure.
   *
   * @since 4.0.0
   */
  get message() {
    return `${this._tag}: ${this.module}.${this.method}${this.pathOrDescriptor !== void 0 ? ` (${this.pathOrDescriptor})` : ""}${this.description ? `: ${this.description}` : ""}`;
  }
};
var PlatformError = class extends (/* @__PURE__ */ TaggedError2("PlatformError")) {
  constructor(reason) {
    if ("cause" in reason) {
      super({
        reason,
        cause: reason.cause
      });
    } else {
      super({
        reason
      });
    }
  }
  /**
   * Marks this value as a platform error wrapper for runtime guards.
   *
   * **When to use**
   *
   * Use to identify `PlatformError` values through their runtime type marker.
   *
   * @since 4.0.0
   */
  [TypeId7] = TypeId7;
  get message() {
    return this.reason.message;
  }
};
var systemError = (options) => new PlatformError(new SystemError(options));
var badArgument = (options) => new PlatformError(new BadArgument(options));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Fiber.js
var join = fiberJoin;
var interrupt3 = fiberInterrupt;
var getCurrent = getCurrentFiber;
var runIn = fiberRunIn;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Latch.js
var makeUnsafe4 = makeLatchUnsafe;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/MutableRef.js
var TypeId8 = "~effect/MutableRef";
var MutableRefProto = {
  [TypeId8]: TypeId8,
  ...PipeInspectableProto,
  toJSON() {
    return {
      _id: "MutableRef",
      current: toJson(this.current)
    };
  }
};
var make6 = (value3) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value3;
  return ref;
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/MutableList.js
var Empty = /* @__PURE__ */ Symbol.for("effect/MutableList/Empty");
var make7 = () => ({
  head: void 0,
  tail: void 0,
  length: 0
});
var compactHead = (self) => {
  const head2 = self.head;
  if (head2.offset >= 1024 && head2 === self.tail && head2.mutable && (head2.array.length - head2.offset) * 8 <= head2.offset) {
    self.head = self.tail = {
      array: head2.array.slice(head2.offset),
      mutable: true,
      offset: 0,
      next: void 0
    };
  }
};
var emptyBucket = () => ({
  array: [],
  mutable: true,
  offset: 0,
  next: void 0
});
var append2 = (self, message) => {
  if (!self.tail) {
    self.head = self.tail = emptyBucket();
  } else if (!self.tail.mutable) {
    self.tail.next = emptyBucket();
    self.tail = self.tail.next;
  }
  self.tail.array.push(message);
  self.length++;
};
var clear = (self) => {
  self.head = self.tail = void 0;
  self.length = 0;
};
var takeN = (self, n) => {
  n = normalize(n);
  if (n <= 0 || !self.head) return [];
  n = Math.min(n, self.length);
  if (n === self.length && self.head?.offset === 0 && !self.head.next) {
    const array3 = self.head.array;
    clear(self);
    return array3;
  }
  const array2 = new Array(n);
  let index = 0;
  let chunk = self.head;
  while (chunk) {
    while (chunk.offset < chunk.array.length) {
      array2[index++] = chunk.array[chunk.offset];
      if (chunk.mutable) chunk.array[chunk.offset] = void 0;
      chunk.offset++;
      if (index === n) {
        self.head = chunk.offset === chunk.array.length && chunk.next ? chunk.next : chunk;
        self.length -= n;
        if (self.length === 0) clear(self);
        else compactHead(self);
        return array2;
      }
    }
    chunk = chunk.next;
  }
  clear(self);
  return array2;
};
var take = (self) => {
  if (!self.head) return Empty;
  const message = self.head.array[self.head.offset];
  if (self.head.mutable) self.head.array[self.head.offset] = void 0;
  self.head.offset++;
  self.length--;
  if (self.head.offset === self.head.array.length) {
    if (self.head.next) {
      self.head = self.head.next;
    } else {
      clear(self);
    }
  } else {
    compactHead(self);
  }
  return message;
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Queue.js
var TypeId9 = "~effect/Queue";
var EnqueueTypeId = "~effect/Queue/Enqueue";
var DequeueTypeId = "~effect/Queue/Dequeue";
var variance = {
  _A: identity,
  _E: identity
};
var QueueProto = {
  [TypeId9]: variance,
  [EnqueueTypeId]: variance,
  [DequeueTypeId]: variance,
  ...PipeInspectableProto,
  toJSON() {
    return {
      _id: "effect/Queue",
      state: this.state._tag,
      size: sizeUnsafe(this)
    };
  }
};
var make8 = (options) => withFiber((fiber2) => {
  const self = Object.create(QueueProto);
  self.dispatcher = fiber2.currentDispatcher;
  self.capacity = options?.capacity ?? Number.POSITIVE_INFINITY;
  self.strategy = options?.strategy ?? "suspend";
  self.messages = make7();
  self.scheduleRunning = false;
  self.state = {
    _tag: "Open",
    takers: /* @__PURE__ */ new Set(),
    offers: /* @__PURE__ */ new Set(),
    awaiters: /* @__PURE__ */ new Set()
  };
  return succeed3(self);
});
var bounded = (capacity) => make8({
  capacity
});
var offer = /* @__PURE__ */ dual(2, (self, message) => suspend(() => offerUnsafe(self, message) ? exitTrue : self.state._tag === "Open" && self.strategy === "suspend" ? offerOrWait(self, message) : exitFalse));
var offerUnsafe = (self, message) => {
  if (self.state._tag !== "Open") {
    return false;
  } else if (self.messages.length >= self.capacity) {
    if (self.strategy === "sliding") {
      take(self.messages);
      append2(self.messages, message);
      return true;
    } else if (self.capacity <= 0 && self.state.takers.size > 0) {
      append2(self.messages, message);
      releaseTakers(self);
      return true;
    }
    return false;
  }
  append2(self.messages, message);
  scheduleReleaseTaker(self);
  return true;
};
var failCause4 = /* @__PURE__ */ dual(2, (self, cause) => sync(() => failCauseUnsafe(self, cause)));
var failCauseUnsafe = (self, cause) => {
  if (self.state._tag !== "Open") {
    return false;
  }
  const exit3 = exitFailCause(cause);
  const fail10 = exitZipRight(exit3, exitFailDone);
  if (self.state.offers.size === 0 && self.messages.length === 0) {
    finalize(self, fail10);
    return true;
  }
  self.state = {
    ...self.state,
    _tag: "Closing",
    exit: fail10
  };
  scheduleReleaseTaker(self);
  return true;
};
var endUnsafe = (self) => failCauseUnsafe(self, causeFail(Done()));
var shutdown = (self) => sync(() => shutdownUnsafe(self));
var shutdownUnsafe = (self) => {
  if (self.state._tag === "Done") {
    return false;
  }
  clear(self.messages);
  const offers = self.state.offers;
  finalize(self, self.state._tag === "Open" ? exitInterrupt2 : self.state.exit);
  for (const entry of offers) {
    resumeUnoffered(entry);
  }
  return true;
};
var takeAll2 = (self) => takeBetween(self, 1, Number.POSITIVE_INFINITY);
var takeBetween = /* @__PURE__ */ dual(3, (self, min, max) => {
  min = normalize(min);
  max = normalize(max);
  return suspendTake(() => takeBetweenUnsafe(self, min, max) ?? andThen(awaitTake(self, () => canTake(self, min)), takeBetween(self, min, max)));
});
var take2 = (self) => suspendTake(() => takeUnsafe(self) ?? andThen(awaitTake(self, () => canTake(self, 1)), take2(self)));
var poll = (self) => suspendTake(() => {
  const result3 = takeUnsafe(self);
  if (result3 === void 0) {
    return succeed3(none2());
  }
  if (result3._tag === "Success") {
    return succeed3(some2(result3.value));
  }
  return succeed3(none2());
});
var takeUnsafe = (self) => {
  if (self.state._tag === "Done") {
    return self.state.exit;
  }
  if (self.messages.length > 0) {
    const message = take(self.messages);
    releaseCapacity(self);
    return exitSucceed(message);
  } else if (self.capacity <= 0 && self.state.offers.size > 0) {
    const message = takeOfferUnsafe(self.state.offers);
    releaseCapacity(self);
    return exitSucceed(message);
  }
  return void 0;
};
var sizeUnsafe = (self) => self.state._tag === "Done" ? 0 : self.messages.length;
var exitFalse = /* @__PURE__ */ exitSucceed(false);
var exitTrue = /* @__PURE__ */ exitSucceed(true);
var exitFailDone = /* @__PURE__ */ exitFail(/* @__PURE__ */ Done());
var exitInterrupt2 = /* @__PURE__ */ exitInterrupt();
var releaseTakers = (self) => {
  if (self.state._tag === "Done" || self.state.takers.size === 0) {
    return;
  }
  for (const taker of self.state.takers) {
    if (!taker.ready()) continue;
    self.state.takers.delete(taker);
    taker.resume(exitVoid);
    if (self.messages.length === 0) {
      break;
    }
  }
};
var scheduleReleaseTaker = (self) => {
  if (self.scheduleRunning || self.state._tag === "Done" || self.state.takers.size === 0) {
    return;
  }
  self.scheduleRunning = true;
  self.dispatcher.scheduleTask(() => {
    self.scheduleRunning = false;
    releaseTakers(self);
  }, 0);
};
var takeBetweenUnsafe = (self, min, max) => {
  if (self.state._tag === "Done") {
    return self.state.exit;
  } else if (max <= 0 || min <= 0) {
    return exitSucceed([]);
  } else if (!canTake(self, min)) {
    return void 0;
  }
  const messages = self.messages.length > 0 ? takeN(self.messages, max) : [takeOfferUnsafe(self.state.offers)];
  releaseCapacity(self);
  return exitSucceed(messages);
};
var suspendTake = /* @__PURE__ */ makePrimitive({
  op: "QueueTake",
  [evaluate](fiber2) {
    const effect2 = this[args]();
    return isExit(effect2) ? effect2[evaluate](fiber2) : effect2;
  }
});
var canTake = (self, min) => self.messages.length >= (self.state._tag === "Closing" ? 1 : Math.min(min, self.capacity || 1)) || self.capacity <= 0 && self.state._tag !== "Done" && self.state.offers.size > 0;
var awaitTake = (self, ready) => callback((resume) => {
  if (self.state._tag === "Done") return resume(self.state.exit);
  if (ready()) return resume(exitVoid);
  const taker = {
    ready,
    resume
  };
  self.state.takers.add(taker);
  return sync(() => {
    if (self.state._tag !== "Done") self.state.takers.delete(taker);
  });
});
var offerOrWait = (self, message) => callback((resume) => offerUnsafe(self, message) ? resume(exitTrue) : waitToOffer(self, {
  _tag: "Single",
  message,
  resume
}));
var waitToOffer = (self, entry) => {
  if (self.state._tag !== "Open") return resumeUnoffered(entry);
  const offers = self.state.offers;
  offers.add(entry);
  return sync(() => {
    if (self.state._tag === "Done") return;
    offers.delete(entry);
    if (self.state._tag === "Closing" && offers.size === 0 && self.messages.length === 0) {
      finalize(self, self.state.exit);
    }
  });
};
var resumeUnoffered = (entry) => entry._tag === "Single" ? entry.resume(exitFalse) : entry.resume(exitSucceed(entry.remaining.slice(entry.offset)));
var takeOfferUnsafe = (offers) => {
  const entry = offers.values().next().value;
  if (entry._tag === "Single") {
    offers.delete(entry);
    entry.resume(exitTrue);
    return entry.message;
  }
  const message = entry.remaining[entry.offset++];
  if (entry.offset === entry.remaining.length) {
    offers.delete(entry);
    entry.resume(exitSucceed([]));
  }
  return message;
};
var releaseCapacity = (self) => {
  if (self.state._tag === "Done") {
    return isDoneCause(self.state.exit.cause);
  } else if (self.state.offers.size === 0) {
    if (self.state._tag === "Closing" && self.messages.length === 0) {
      finalize(self, self.state.exit);
      return isDoneCause(self.state.exit.cause);
    }
    return false;
  }
  for (const entry of self.state.offers) {
    let n = self.capacity - self.messages.length;
    if (n <= 0) break;
    else if (entry._tag === "Single") {
      append2(self.messages, entry.message);
      self.state.offers.delete(entry);
      entry.resume(exitTrue);
    } else {
      for (; entry.offset < entry.remaining.length; entry.offset++) {
        if (n === 0) return false;
        append2(self.messages, entry.remaining[entry.offset]);
        n--;
      }
      self.state.offers.delete(entry);
      entry.resume(exitSucceed([]));
    }
    const state = self.state;
    if (state._tag === "Done") {
      return isDoneCause(state.exit.cause);
    }
  }
  return false;
};
var finalize = (self, exit3) => {
  if (self.state._tag === "Done") {
    return;
  }
  const openState = self.state;
  self.state = {
    _tag: "Done",
    exit: exit3
  };
  for (const taker of openState.takers) {
    taker.resume(exit3);
  }
  openState.takers.clear();
  for (const awaiter of openState.awaiters) {
    awaiter(exit3);
  }
  openState.awaiters.clear();
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Channel.js
var TypeId10 = "~effect/Channel";
var isChannel = (u) => hasProperty(u, TypeId10);
var ChannelProto = {
  [TypeId10]: {
    _Env: identity,
    _InErr: identity,
    _InElem: identity,
    _OutErr: identity,
    _OutElem: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromTransform = (transform4) => {
  const self = Object.create(ChannelProto);
  self.transform = (upstream, scope3) => catchCause2(transform4(upstream, scope3), (cause) => succeed6(failCause3(cause)));
  return self;
};
var transformPull = (self, f) => fromTransform((upstream, scope3) => flatMap4(toTransform(self)(upstream, scope3), (pull) => f(pull, scope3)));
var fromPull = (effect2) => fromTransform((_, __) => effect2);
var fromTransformBracket = (f) => fromTransform(fnUntraced2(function* (upstream, scope3) {
  const closableScope = forkUnsafe2(scope3);
  const onCause = (cause) => close(closableScope, doneExitFromCause(cause));
  const pull = yield* onError2(f(upstream, scope3, closableScope), onCause);
  return onError2(pull, onCause);
}));
var toTransform = (channel) => channel.transform;
var asyncQueue = (scope3, f, options) => make8({
  capacity: options?.bufferSize,
  strategy: options?.strategy
}).pipe(tap2((queue) => addFinalizer2(scope3, shutdown(queue))), tap2((queue) => provide(f(queue), scope3).pipe(catchCause2((cause) => failCause4(queue, cause)), forkIn2(scope3))));
var callbackArray = (f, options) => fromTransform((_, scope3) => map5(asyncQueue(scope3, f, options), takeAll2));
var suspend3 = (evaluate2) => fromTransform((upstream, scope3) => suspend2(() => toTransform(evaluate2())(upstream, scope3)));
var empty3 = /* @__PURE__ */ fromPull(/* @__PURE__ */ succeed6(/* @__PURE__ */ done2()));
var map6 = /* @__PURE__ */ dual(2, (self, f) => transformPull(self, (pull) => sync2(() => {
  let i = 0;
  return map5(pull, (o) => f(o, i++));
})));
var mapDone = /* @__PURE__ */ dual(2, (self, f) => mapDoneEffect(self, (o) => succeed6(f(o))));
var mapDoneEffect = /* @__PURE__ */ dual(2, (self, f) => transformPull(self, (pull) => succeed6(catchDone(pull, (done3) => flatMap4(f(done3), done2)))));
var merge2 = /* @__PURE__ */ dual((args2) => isChannel(args2[0]) && isChannel(args2[1]), (left, right, options) => fromTransformBracket(fnUntraced2(function* (upstream, _scope, forkedScope) {
  const strategy = options?.haltStrategy ?? "both";
  const queue = yield* bounded(0);
  yield* addFinalizer2(forkedScope, shutdown(queue));
  let done3 = 0;
  function onExit4(side, cause) {
    done3++;
    if (!isDoneCause(cause)) {
      return failCause4(queue, cause);
    }
    switch (strategy) {
      case "both": {
        return done3 === 2 ? failCause4(queue, cause) : void_3;
      }
      case "left":
      case "right": {
        return side === strategy ? failCause4(queue, cause) : void_3;
      }
      case "either": {
        return failCause4(queue, cause);
      }
    }
  }
  const runSide = (side, channel, scope3) => toTransform(channel)(upstream, scope3).pipe(flatMap4((pull) => pull.pipe(flatMap4((value3) => offer(queue, value3)), forever2)), onError2((cause) => onExitPrimitive2(doneExitFromCause(cause), (exit3) => close(scope3, exit3)).pipe(matchCauseEffect2({
    onFailure: (cause2) => onExit4(side, cause2),
    onSuccess: () => onExit4(side, cause)
  }))), forkIn2(forkedScope));
  yield* runSide("left", left, forkUnsafe2(forkedScope));
  yield* runSide("right", right, forkUnsafe2(forkedScope));
  return take2(queue);
})));
var splitLines = () => fromTransform((upstream, _scope) => sync2(() => {
  let stringBuilder = "";
  let midCRLF = false;
  let done3 = none2();
  function splitLinesArray(chunk) {
    const chunkBuilder = [];
    function pushLine(segment) {
      if (stringBuilder.length === 0) {
        chunkBuilder.push(segment);
      } else {
        chunkBuilder.push(stringBuilder + segment);
        stringBuilder = "";
      }
    }
    for (let i = 0; i < chunk.length; i++) {
      const str = chunk[i];
      if (str.length !== 0) {
        let from = 0;
        let indexOfCR = str.indexOf("\r");
        let indexOfLF = str.indexOf("\n");
        if (midCRLF) {
          if (indexOfLF === 0) {
            from = 1;
            indexOfLF = str.indexOf("\n", from);
          }
          midCRLF = false;
        }
        while (indexOfCR !== -1 || indexOfLF !== -1) {
          if (indexOfCR === -1 || indexOfLF !== -1 && indexOfLF < indexOfCR) {
            pushLine(str.substring(from, indexOfLF));
            from = indexOfLF + 1;
            indexOfLF = str.indexOf("\n", from);
          } else {
            pushLine(str.substring(from, indexOfCR));
            if (str.length === indexOfCR + 1) {
              midCRLF = true;
              from = str.length;
              indexOfCR = -1;
            } else {
              from = indexOfCR + (indexOfLF === indexOfCR + 1 ? 2 : 1);
              indexOfCR = str.indexOf("\r", from);
              indexOfLF = str.indexOf("\n", from);
            }
          }
        }
        stringBuilder = stringBuilder + str.substring(from);
      }
    }
    return isReadonlyArrayNonEmpty(chunkBuilder) ? chunkBuilder : null;
  }
  const pullOrFlush = suspend2(() => {
    if (done3._tag === "Some") {
      return done2(done3.value);
    }
    return matchEffect2(upstream, {
      onSuccess: loop,
      onFailure: failCause3,
      onDone: (leftover) => {
        done3 = some2(leftover);
        if (stringBuilder.length > 0) {
          const last = stringBuilder;
          stringBuilder = "";
          midCRLF = false;
          return succeed6([last]);
        }
        return done2(leftover);
      }
    });
  });
  function loop(chunk) {
    const lines2 = splitLinesArray(chunk);
    return lines2 !== null ? succeed6(lines2) : pullOrFlush;
  }
  return pullOrFlush;
}));
var pipeTo = /* @__PURE__ */ dual(2, (self, that) => fromTransform((upstream, scope3) => flatMap4(toTransform(self)(upstream, scope3), (upstream2) => toTransform(that)(upstream2, scope3))));
var unwrap2 = (channel) => fromTransform((upstream, scope3) => {
  let pull;
  return succeed6(suspend2(() => {
    if (pull) return pull;
    return channel.pipe(provide(scope3), flatMap4((channel2) => toTransform(channel2)(upstream, scope3)), flatMap4((pull_) => pull = pull_));
  }));
});
var runWith = (self, f, onHalt) => suspend2(() => {
  const scope3 = makeUnsafe3();
  const makePull = toTransform(self)(done2(), scope3);
  return catchDone(flatMap4(makePull, f), onHalt ? onHalt : succeed6).pipe(onExit2((exit3) => close(scope3, exit3)));
});
var runFold = /* @__PURE__ */ dual(3, (self, initial, f) => suspend2(() => {
  let state = initial();
  return runWith(self, (pull) => whileLoop2({
    while: constTrue,
    body: () => pull,
    step: (value3) => {
      state = f(state, value3);
    }
  }), () => succeed6(state));
}));
var toPullScoped = (self, scope3) => toTransform(self)(done2(), scope3);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/stream.js
var TypeId11 = "~effect/Stream";
var streamVariance = {
  _R: identity,
  _E: identity,
  _A: identity
};
var Stream = function(channel) {
  this.channel = channel;
};
Stream.prototype = {
  [TypeId11]: streamVariance,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromChannel = (channel) => new Stream(channel);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Sink.js
var TypeId12 = "~effect/Sink";
var endVoid = /* @__PURE__ */ succeed6([void 0]);
var sinkVariance = {
  _A: identity,
  _In: identity,
  _L: identity,
  _E: identity,
  _R: identity
};
var SinkProto = {
  [TypeId12]: sinkVariance,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isSink = (u) => hasProperty(u, TypeId12);
var fromChannel2 = (channel) => fromTransform2((upstream, scope3) => toTransform(channel)(upstream, scope3).pipe(flatMap4(forever2({
  disableYield: true
})), catchDone(succeed6)));
var fromTransform2 = (transform4) => {
  const self = Object.create(SinkProto);
  self.transform = transform4;
  return self;
};
var toChannel = (self) => fromTransform((upstream, scope3) => succeed6(flatMap4(self.transform(upstream, scope3), done2)));
var drain = /* @__PURE__ */ fromTransform2((upstream) => catchDone(forever2(upstream, {
  disableYield: true
}), () => endVoid));
var forEach3 = (f) => forEachArray(forEach2((_) => f(_), {
  discard: true
}));
var forEachArray = (f) => fromTransform2((upstream) => upstream.pipe(flatMap4(f), forever2({
  disableYield: true
}), catchDone(() => endVoid)));
var unwrap3 = (effect2) => fromChannel2(unwrap2(map5(effect2, toChannel)));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/rcRef.js
var TypeId13 = "~effect/RcRef";
var stateEmpty = {
  _tag: "Empty"
};
var stateClosed = {
  _tag: "Closed"
};
var variance2 = {
  _A: identity,
  _E: identity
};
var RcRefImpl = class {
  [TypeId13] = variance2;
  pipe() {
    return pipeArguments(this, arguments);
  }
  state = stateEmpty;
  acquire;
  context;
  scope;
  idleTimeToLive;
  constructor(acquire, context3, scope3, idleTimeToLive) {
    this.acquire = acquire;
    this.context = context3;
    this.scope = scope3;
    this.idleTimeToLive = idleTimeToLive;
  }
};
var make9 = (options) => withFiber2((fiber2) => {
  const context3 = fiber2.context;
  const scope3 = get(context3, Scope);
  const ref = new RcRefImpl(options.acquire, context3, scope3, options.idleTimeToLive !== void 0 ? fromInputUnsafe(options.idleTimeToLive) : void 0);
  return as2(addFinalizerExit(scope3, () => {
    const state = ref.state;
    ref.state = stateClosed;
    if (state._tag === "Acquired") return close(state.scope, void_2);
    if (state._tag === "Acquiring") return interrupt3(state.fiber);
    return void_3;
  }), ref);
});
var getState = (self, restore) => {
  switch (self.state._tag) {
    case "Closed": {
      return interrupt2;
    }
    case "Acquired": {
      const state = self.state;
      state.refCount++;
      return state.fiber ? as2(interrupt3(state.fiber), state) : succeed6(state);
    }
    case "Acquiring": {
      const state = self.state;
      state.awaiters++;
      return awaitAcquiring(self, state, restore);
    }
    case "Empty": {
      const acquiring = {
        _tag: "Acquiring",
        fiber: void 0,
        awaiters: 1,
        acquired: void 0
      };
      self.state = acquiring;
      const scope3 = makeUnsafe3();
      const acquire = provideContext2(self.acquire, add(self.context, Scope, scope3)).pipe(flatMap4((value3) => {
        if (self.state !== acquiring) {
          return interrupt2;
        }
        const state = {
          _tag: "Acquired",
          value: value3,
          scope: scope3,
          fiber: void 0,
          // Every caller still waiting holds a reference.
          refCount: acquiring.awaiters,
          invalidated: false
        };
        self.state = state;
        acquiring.acquired = state;
        return succeed6(state);
      }), onExit2((exit3) => {
        if (isSuccess3(exit3)) return void_3;
        if (self.state === acquiring) self.state = stateEmpty;
        return close(scope3, exit3);
      }));
      acquiring.fiber = runForkWith2(getCurrent().context)(acquire);
      return awaitAcquiring(self, acquiring, restore);
    }
  }
};
var awaitAcquiring = (self, acquiring, restore) => onExit2(restore(join(acquiring.fiber)), (exit3) => {
  const acquired = acquiring.acquired;
  if (acquired !== void 0) {
    return isFailure3(exit3) ? release(self, acquired) : void_3;
  }
  if (--acquiring.awaiters > 0 || self.state !== acquiring) return void_3;
  self.state = stateEmpty;
  return interrupt3(acquiring.fiber);
});
var get2 = (self_) => {
  const self = self_;
  return uninterruptibleMask2((restore) => flatMap4(scope2, (scope3) => flatMap4(getState(self, restore), (state) => as2(addFinalizerExit(scope3, () => release(self, state)), state.value))));
};
var release = (self, state) => {
  state.refCount--;
  if (state.refCount > 0) {
    return void_3;
  }
  const idleTimeToLive = self.idleTimeToLive;
  if (idleTimeToLive === void 0 || state.invalidated) {
    if (self.state === state) {
      self.state = stateEmpty;
    }
    return close(state.scope, void_2);
  } else if (!isFinite(idleTimeToLive)) {
    return void_3;
  }
  state.fiber = uninterruptibleMask2((restore) => flatMap4(restore(sleep2(idleTimeToLive)), () => {
    if (self.state === state && state.refCount === 0) {
      self.state = stateEmpty;
      return close(state.scope, void_2);
    }
    return void_3;
  })).pipe(ensuring2(sync2(() => {
    state.fiber = void 0;
  })), runForkWith2(self.context), runIn(self.scope));
  return void_3;
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/RcRef.js
var make10 = make9;
var get3 = get2;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Stream.js
var TypeId14 = "~effect/Stream";
var isStream = (u) => hasProperty(u, TypeId14);
var fromChannel3 = fromChannel;
var fromPull2 = (pull) => fromChannel3(fromPull(pull));
var transformPull2 = (self, f) => fromChannel3(fromTransform((_, scope3) => flatMap4(toPullScoped(self.channel, scope3), (pull) => f(pull, scope3))));
var toChannel2 = (stream) => stream.channel;
var callback3 = (f, options) => fromChannel3(callbackArray(f, options));
var empty4 = /* @__PURE__ */ fromChannel3(empty3);
var suspend4 = (stream) => fromChannel3(suspend3(() => stream().channel));
var unwrap4 = (effect2) => fromChannel3(unwrap2(map5(effect2, toChannel2)));
var map7 = /* @__PURE__ */ dual(2, (self, f) => suspend4(() => {
  let i = 0;
  return fromChannel3(map6(self.channel, map2((o) => f(o, i++))));
}));
var merge3 = /* @__PURE__ */ dual((args2) => isStream(args2[0]) && isStream(args2[1]), (self, that, options) => fromChannel3(merge2(toChannel2(self), toChannel2(that), options)));
var transduce = /* @__PURE__ */ dual(2, (self, sink) => transformPull2(self, (upstream, scope3) => sync2(() => {
  let done3;
  let leftover;
  const upstreamWithLeftover = suspend2(() => {
    if (leftover !== void 0) {
      const chunk = leftover;
      leftover = void 0;
      return succeed6(chunk);
    }
    return upstream;
  }).pipe(catch_2((error2) => {
    done3 = fail5(error2);
    return done2();
  }));
  const pull = map5(suspend2(() => sink.transform(upstreamWithLeftover, scope3)), ([value3, leftover_]) => {
    leftover = leftover_;
    return of(value3);
  });
  return suspend2(() => done3 ? done3 : pull);
})));
var decodeText = /* @__PURE__ */ dual((args2) => isStream(args2[0]), (self, options) => suspend4(() => {
  const decoder = new TextDecoder(options?.encoding);
  return map7(self, (chunk) => decoder.decode(chunk, {
    stream: true
  }));
}));
var splitLines2 = (self) => self.channel.pipe(pipeTo(splitLines()), fromChannel3);
var run = /* @__PURE__ */ dual(2, (self, sink) => scopedWith2((scope3) => toPullScoped(self.channel, scope3).pipe(flatMap4((upstream) => sink.transform(upstream, scope3)), map5(([a]) => a))));
var runCollect = (self) => runFold(self.channel, () => [], (acc, chunk) => {
  for (let i = 0; i < chunk.length; i++) {
    acc.push(chunk[i]);
  }
  return acc;
});
var mkString = (self) => runFold(self.channel, () => "", (acc, chunk) => acc + chunk.join(""));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/FileSystem.js
var TypeId15 = "~effect/FileSystem";
var FileSystem = /* @__PURE__ */ Service("effect/FileSystem");
var make11 = (impl) => FileSystem.of({
  ...impl,
  [TypeId15]: TypeId15,
  exists: (path) => pipe(impl.access(path), as2(true), catchTag2("PlatformError", (e) => e.reason._tag === "NotFound" ? succeed6(false) : fail6(e))),
  readFileString: (path, encoding) => flatMap4(impl.readFile(path), (_) => try_2({
    try: () => new TextDecoder(encoding).decode(_),
    catch: (cause) => badArgument({
      module: "FileSystem",
      method: "readFileString",
      description: "invalid encoding",
      cause
    })
  })),
  stream: fnUntraced2(function* (path, options) {
    const file = yield* impl.open(path, {
      flag: "r"
    });
    const offset = options?.offset === void 0 ? void 0 : fromInputUnsafe2(options.offset);
    if (offset) {
      yield* file.seek(offset, "start");
    }
    const bytesToRead = options?.bytesToRead === void 0 ? void 0 : fromInputUnsafe2(options.bytesToRead);
    let totalBytesRead = BigInt(0);
    const chunkSize = Number(BigInt(options?.chunkSize ?? 64 * 1024));
    const readChunk = file.readAlloc(chunkSize);
    return fromPull2(succeed6(flatMap4(suspend2(() => {
      if (bytesToRead !== void 0 && bytesToRead <= totalBytesRead) {
        return done2();
      }
      return bytesToRead !== void 0 && bytesToRead - totalBytesRead < chunkSize ? file.readAlloc(Number(bytesToRead - totalBytesRead)) : readChunk;
    }), match({
      onNone: () => done2(),
      onSome: (buf) => {
        totalBytesRead += BigInt(buf.length);
        return succeed6(of(buf));
      }
    }))));
  }, unwrap4),
  sink: (path, options) => pipe(impl.open(path, {
    ...options,
    flag: options?.flag ?? "w"
  }), map5((file) => forEach3((_) => file.writeAll(_))), unwrap3),
  writeFileString: (path, data, options) => flatMap4(try_2({
    try: () => new TextEncoder().encode(data),
    catch: (cause) => badArgument({
      module: "FileSystem",
      method: "writeFileString",
      description: "could not encode string",
      cause
    })
  }), (_) => impl.writeFile(path, _, options))
});
var FileTypeId = "~effect/FileSystem/File";
var WatchBackend = class extends (/* @__PURE__ */ Service()("effect/FileSystem/WatchBackend")) {
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Path.js
var TypeId16 = "~effect/Path";
var Path = /* @__PURE__ */ Service("effect/Path");
function normalizeStringPosix(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length) {
      code = path.charCodeAt(i);
    } else if (code === 47) {
      break;
    } else {
      code = 47;
    }
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) {
            res += "/..";
          } else {
            res = "..";
          }
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += "/" + path.slice(lastSlash + 1, i);
        } else {
          res = path.slice(lastSlash + 1, i);
        }
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}
function fromFileUrl(url) {
  if (url.protocol !== "file:") {
    return fail6(new BadArgument({
      module: "Path",
      method: "fromFileUrl",
      description: "URL must be of scheme file"
    }));
  } else if (url.hostname !== "") {
    return fail6(new BadArgument({
      module: "Path",
      method: "fromFileUrl",
      description: "Invalid file URL host"
    }));
  }
  const pathname = url.pathname;
  for (let n = 0; n < pathname.length; n++) {
    if (pathname[n] === "%") {
      const third = pathname.codePointAt(n + 2) | 32;
      if (pathname[n + 1] === "2" && third === 102) {
        return fail6(new BadArgument({
          module: "Path",
          method: "fromFileUrl",
          description: "must not include encoded / characters"
        }));
      }
    }
  }
  return succeed6(decodeURIComponent(pathname));
}
var resolve = function resolve2() {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  let cwd = void 0;
  for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path;
    if (i >= 0) {
      path = arguments[i];
    } else {
      const process2 = globalThis.process;
      if (cwd === void 0 && "process" in globalThis && typeof process2 === "object" && process2 !== null && typeof process2.cwd === "function") {
        cwd = process2.cwd();
      }
      path = cwd;
    }
    if (path.length === 0) {
      continue;
    }
    resolvedPath = path + "/" + resolvedPath;
    resolvedAbsolute = path.charCodeAt(0) === 47;
  }
  resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) {
      return "/" + resolvedPath;
    } else {
      return "/";
    }
  } else if (resolvedPath.length > 0) {
    return resolvedPath;
  } else {
    return ".";
  }
};
var CHAR_FORWARD_SLASH = 47;
function toFileUrl(filepath) {
  const outURL = new URL("file://");
  let resolved = resolve(filepath);
  const filePathLast = filepath.charCodeAt(filepath.length - 1);
  if (filePathLast === CHAR_FORWARD_SLASH && resolved[resolved.length - 1] !== "/") {
    resolved += "/";
  }
  outURL.pathname = encodePathChars(resolved);
  return succeed6(outURL);
}
var percentRegExp = /%/g;
var backslashRegExp = /\\/g;
var newlineRegExp = /\n/g;
var carriageReturnRegExp = /\r/g;
var tabRegExp = /\t/g;
function encodePathChars(filepath) {
  if (filepath.includes("%")) {
    filepath = filepath.replace(percentRegExp, "%25");
  }
  if (filepath.includes("\\")) {
    filepath = filepath.replace(backslashRegExp, "%5C");
  }
  if (filepath.includes("\n")) {
    filepath = filepath.replace(newlineRegExp, "%0A");
  }
  if (filepath.includes("\r")) {
    filepath = filepath.replace(carriageReturnRegExp, "%0D");
  }
  if (filepath.includes("	")) {
    filepath = filepath.replace(tabRegExp, "%09");
  }
  return filepath;
}
var posixImpl = /* @__PURE__ */ Path.of({
  [TypeId16]: TypeId16,
  resolve,
  normalize(path) {
    if (path.length === 0) return ".";
    const isAbsolute = path.charCodeAt(0) === 47;
    const trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeStringPosix(path, !isAbsolute);
    if (path.length === 0 && !isAbsolute) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute) return "/" + path;
    return path;
  },
  isAbsolute(path) {
    return path.length > 0 && path.charCodeAt(0) === 47;
  },
  join() {
    if (arguments.length === 0) {
      return ".";
    }
    let joined;
    for (let i = 0; i < arguments.length; ++i) {
      const arg = arguments[i];
      if (arg.length > 0) {
        if (joined === void 0) {
          joined = arg;
        } else {
          joined += "/" + arg;
        }
      }
    }
    if (joined === void 0) {
      return ".";
    }
    return posixImpl.normalize(joined);
  },
  relative(from, to) {
    if (from === to) return "";
    from = posixImpl.resolve(from);
    to = posixImpl.resolve(to);
    if (from === to) return "";
    let fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47) {
        break;
      }
    }
    const fromEnd = from.length;
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47) {
        break;
      }
    }
    const toEnd = to.length;
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47) {
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47) {
            lastCommonSep = i;
          } else if (i === 0) {
            lastCommonSep = 0;
          }
        }
        break;
      }
      const fromCode = from.charCodeAt(fromStart + i);
      const toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode) {
        break;
      } else if (fromCode === 47) {
        lastCommonSep = i;
      }
    }
    let out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47) {
        if (out.length === 0) {
          out += "..";
        } else {
          out += "/..";
        }
      }
    }
    if (out.length > 0) {
      return out + to.slice(toStart + lastCommonSep);
    } else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47) {
        ++toStart;
      }
      return to.slice(toStart);
    }
  },
  dirname(path) {
    if (path.length === 0) return ".";
    let code = path.charCodeAt(0);
    const hasRoot = code === 47;
    let end = -1;
    let matchedSlash = true;
    for (let i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path.slice(0, end);
  },
  basename(path, ext) {
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return "";
      let extIdx = ext.length - 1;
      let firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end) end = firstNonSlashEnd;
      else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1) return "";
      return path.slice(start, end);
    }
  },
  extname(path) {
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for (let i = path.length - 1; i >= 0; --i) {
      const code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1) {
          startDot = i;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  },
  format: function format3(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format("/", pathObject);
  },
  parse(path) {
    const ret = {
      root: "",
      dir: "",
      base: "",
      ext: "",
      name: ""
    };
    if (path.length === 0) return ret;
    let code = path.charCodeAt(0);
    const isAbsolute = code === 47;
    let start;
    if (isAbsolute) {
      ret.root = "/";
      start = 1;
    } else {
      start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1) startDot = i;
        else if (preDotState !== 1) preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
        else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute) ret.dir = "/";
    return ret;
  },
  sep: "/",
  fromFileUrl,
  toFileUrl,
  toNamespacedPath: identity
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/schema/annotations.js
function resolve3(ast) {
  return ast.checks ? ast.checks[ast.checks.length - 1].annotations : ast.annotations;
}
var STRUCTURAL_ANNOTATION_KEY = "~structural";
var SENTINELS_ANNOTATION_KEY = "~sentinels";
var CONSTRUCTOR_ANNOTATION_KEY = "~constructor";
var getExpected = /* @__PURE__ */ memoize((ast) => {
  const identifier2 = resolve3(ast)?.identifier;
  if (typeof identifier2 === "string") return identifier2;
  return ast.getExpected(getExpected);
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/schema/parser.js
var missing = /* @__PURE__ */ Symbol();
var succeed8 = succeed4;
var missingExit = /* @__PURE__ */ succeed8(missing);
var sameExit = /* @__PURE__ */ succeed8(missing);
var toOption = (value3) => value3 === missing ? none2() : some2(value3);
var fromOptionExit = (option2) => option2._tag === "None" ? missingExit : succeed8(option2.value);

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/SchemaIssue.js
var TypeId17 = "~effect/SchemaIssue/Issue";
function isIssue(u) {
  return hasProperty(u, TypeId17) && u[TypeId17] === TypeId17;
}
function hasInput(issue) {
  return Object.hasOwn(issue, "input");
}
var IssueNodeImpl = class {
  [TypeId17] = TypeId17;
  constructor(input, options) {
    if (options?.reportInput === true && input !== missing) {
      this.input = input;
    }
  }
};
var Filter = class extends IssueNodeImpl {
  _tag = "Filter";
  /**
   * The filter that failed.
   */
  filter;
  /**
   * The issue that occurred.
   */
  issue;
  constructor(filter7, issue, input, options) {
    super(input, options);
    this.filter = filter7;
    this.issue = issue;
  }
};
var Encoding = class extends IssueNodeImpl {
  _tag = "Encoding";
  /**
   * The schema that caused the issue.
   */
  ast;
  /**
   * The issue that occurred.
   */
  issue;
  constructor(ast, issue, input, options) {
    super(input, options);
    this.ast = ast;
    this.issue = issue;
  }
};
var Pointer = class extends IssueNodeImpl {
  _tag = "Pointer";
  /**
   * The path to the location in the input that caused the issue.
   */
  path;
  /**
   * The issue that occurred.
   */
  issue;
  constructor(path, issue) {
    super();
    this.path = path;
    this.issue = issue;
  }
};
var MissingKey = class extends IssueNodeImpl {
  _tag = "MissingKey";
  /**
   * The metadata for the issue.
   */
  annotations;
  constructor(annotations) {
    super();
    this.annotations = annotations;
  }
};
var UnexpectedKey = class extends IssueNodeImpl {
  _tag = "UnexpectedKey";
  /**
   * The schema that caused the issue.
   */
  ast;
  constructor(ast, input, options) {
    super(input, options);
    this.ast = ast;
  }
};
var Composite = class extends IssueNodeImpl {
  _tag = "Composite";
  /**
   * The schema that caused the issue.
   */
  ast;
  /**
   * The issues that occurred.
   */
  issues;
  constructor(ast, issues, input, options) {
    super(input, options);
    this.ast = ast;
    this.issues = issues;
  }
};
var InvalidType = class extends IssueNodeImpl {
  _tag = "InvalidType";
  /**
   * The schema that caused the issue.
   */
  ast;
  constructor(ast, input, options) {
    super(input, options);
    this.ast = ast;
  }
};
var InvalidValue = class extends IssueNodeImpl {
  _tag = "InvalidValue";
  /**
   * The metadata for the issue.
   */
  annotations;
  constructor(annotations, input, options) {
    super(input, options);
    this.annotations = annotations;
  }
};
var AnyOf = class extends IssueNodeImpl {
  _tag = "AnyOf";
  /**
   * The schema that caused the issue.
   */
  ast;
  /**
   * The issues that occurred.
   */
  issues;
  constructor(ast, issues, input, options) {
    super(input, options);
    this.ast = ast;
    this.issues = issues;
  }
};
var OneOf = class extends IssueNodeImpl {
  _tag = "OneOf";
  /**
   * The schema that caused the issue.
   */
  ast;
  /**
   * The schemas that were successful.
   */
  successes;
  constructor(ast, successes, input, options) {
    super(input, options);
    this.ast = ast;
    this.successes = successes;
  }
};
function makeFilterIssue(entry, input, options) {
  if (isIssue(entry)) {
    return entry;
  }
  if (typeof entry === "string") {
    return new InvalidValue({
      message: entry
    }, input, options);
  }
  const inner = typeof entry.issue === "string" ? new InvalidValue({
    message: entry.issue
  }, input, options) : entry.issue;
  return new Pointer(entry.path, inner);
}
function makeSingle(out, input, options) {
  if (out === void 0) {
    return void 0;
  }
  if (typeof out === "boolean") {
    return out ? void 0 : new InvalidValue(void 0, input, options);
  }
  return makeFilterIssue(out, input, options);
}
function normalizeFilterOutput(ast, out, input, options) {
  if (Array.isArray(out)) {
    if (!isReadonlyArrayNonEmpty(out)) {
      return void 0;
    }
    return out.length === 1 ? makeFilterIssue(out[0], input, options) : new Composite(ast, map2(out, (entry) => makeFilterIssue(entry, input, options)), input, options);
  }
  return makeSingle(out, input, options);
}
var defaultLeafHook = (issue) => {
  const message = findMessage(issue);
  if (message !== void 0) return message;
  switch (issue._tag) {
    case "InvalidType":
      return getExpectedMessage(getExpected(issue.ast), issue);
    case "InvalidValue": {
      const expected = findExpected(issue);
      if (expected !== void 0) return getExpectedMessage(expected, issue);
      const input = formatInput(issue);
      return input === void 0 ? "Expected a valid value" : `Invalid data ${input}`;
    }
    case "MissingKey":
      return "Missing key";
    case "UnexpectedKey": {
      const input = formatInput(issue);
      return input === void 0 ? "Expected no excess property" : `Unexpected key with value ${input}`;
    }
    case "Forbidden":
      return "Forbidden operation";
    case "OneOf": {
      const input = formatInput(issue);
      return input === void 0 ? "Expected exactly one member to match" : `Expected exactly one member to match the input ${input}`;
    }
  }
};
var defaultCheckHook = (issue) => findMessage(issue.issue) ?? findMessage(issue);
function formatInput(issue) {
  return hasInput(issue) ? format(issue.input) : void 0;
}
function findExpected(issue) {
  const expected = issue.annotations?.expected;
  return typeof expected === "string" ? expected : void 0;
}
function getExpectedMessage(expected, issue) {
  const input = formatInput(issue);
  return input === void 0 ? `Expected ${expected}` : `Expected ${expected}, got ${input}`;
}
function formatCheck(check) {
  const expected = check.annotations?.expected;
  if (typeof expected === "string") return expected;
  switch (check._tag) {
    case "Filter":
      return "<filter>";
    case "FilterGroup":
      return check.checks.map((check2) => formatCheck(check2)).join(" & ");
  }
}
function makeFormatterDefault() {
  return (issue) => formatIssue(issue, "");
}
var defaultFormatter = /* @__PURE__ */ makeFormatterDefault();
function formatIssue(issue, path) {
  let message;
  switch (issue._tag) {
    case "Filter": {
      const annotated = defaultCheckHook(issue);
      if (annotated !== void 0) {
        message = annotated;
      } else {
        if (issue.issue._tag !== "InvalidValue") {
          return formatIssue(issue.issue, path);
        }
        const expected = findExpected(issue.issue);
        message = expected === void 0 ? getExpectedMessage(formatCheck(issue.filter), issue) : getExpectedMessage(expected, issue.issue);
      }
      break;
    }
    case "Encoding":
      return formatIssue(issue.issue, path);
    case "Pointer":
      return formatIssue(issue.issue, path + formatPath(issue.path));
    case "Composite":
    case "AnyOf": {
      if (issue._tag === "Composite" || issue.issues.length > 0) {
        return issue.issues.map((issue2) => formatIssue(issue2, path)).join("\n");
      }
      message = findMessage(issue) ?? getExpectedMessage(getExpected(issue.ast), issue);
      break;
    }
    default:
      message = defaultLeafHook(issue);
      break;
  }
  return path ? `${message}
  at ${path}` : message;
}
function findMessage(issue) {
  if (issue._tag === "Pointer") return;
  if (issue._tag === "Encoding") return findMessage(issue.issue);
  const annotations = issue._tag === "Filter" ? issue.filter.annotations : "annotations" in issue ? issue.annotations : issue.ast.annotations;
  const message = annotations?.[issue._tag === "MissingKey" ? "messageMissingKey" : issue._tag === "UnexpectedKey" ? "messageUnexpectedKey" : "message"];
  if (typeof message === "string") return message;
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/schema/cause.js
function getSchemaIssue(cause) {
  let issue;
  for (const reason of cause.reasons) {
    if (!isFailReason2(reason) || !isIssue(reason.error)) {
      return void 0;
    }
    issue ??= reason.error;
  }
  return issue;
}
function getSchemaIssueOrThrow(cause, message) {
  const issue = getSchemaIssue(cause);
  if (issue === void 0) {
    throw new Error(message, {
      cause
    });
  }
  return issue;
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/encoding/Base64.js
var encode = (input) => encodeBytes(typeof input === "string" ? encoder.encode(input) : input);
var decode = (str) => {
  const stripped = stripCrlf(str);
  const length = stripped.length;
  if (length % 4 !== 0) {
    return fail2(new EncodingError({
      kind: "Decode",
      module: "Base64",
      input: stripped,
      message: `Length must be a multiple of 4, but is ${length}`
    }));
  }
  const index = stripped.indexOf("=");
  if (index !== -1 && (index < length - 2 || index === length - 2 && stripped[length - 1] !== "=")) {
    return fail2(new EncodingError({
      kind: "Decode",
      module: "Base64",
      input: stripped,
      message: "Found a '=' character, but it is not at the end"
    }));
  }
  try {
    const missingOctets = stripped.endsWith("==") ? 2 : stripped.endsWith("=") ? 1 : 0;
    const result3 = new Uint8Array(3 * (length / 4) - missingOctets);
    for (let i = 0, j = 0; i < length; i += 4, j += 3) {
      const buffer2 = getCode(stripped.charCodeAt(i)) << 18 | getCode(stripped.charCodeAt(i + 1)) << 12 | getCode(stripped.charCodeAt(i + 2)) << 6 | getCode(stripped.charCodeAt(i + 3));
      result3[j] = buffer2 >> 16;
      result3[j + 1] = buffer2 >> 8 & 255;
      result3[j + 2] = buffer2 & 255;
    }
    return succeed2(result3);
  } catch (cause) {
    return fail2(new EncodingError({
      kind: "Decode",
      module: "Base64",
      input: stripped,
      message: cause instanceof Error ? cause.message : "Invalid input"
    }));
  }
};
var encodeBytes = (bytes2) => {
  const length = bytes2.length;
  let result3 = "";
  let i;
  for (i = 2; i < length; i += 3) {
    result3 += alphabet[bytes2[i - 2] >> 2];
    result3 += alphabet[(bytes2[i - 2] & 3) << 4 | bytes2[i - 1] >> 4];
    result3 += alphabet[(bytes2[i - 1] & 15) << 2 | bytes2[i] >> 6];
    result3 += alphabet[bytes2[i] & 63];
  }
  if (i === length + 1) {
    result3 += alphabet[bytes2[i - 2] >> 2];
    result3 += alphabet[(bytes2[i - 2] & 3) << 4];
    result3 += "==";
  }
  if (i === length) {
    result3 += alphabet[bytes2[i - 2] >> 2];
    result3 += alphabet[(bytes2[i - 2] & 3) << 4 | bytes2[i - 1] >> 4];
    result3 += alphabet[(bytes2[i - 1] & 15) << 2];
    result3 += "=";
  }
  return result3;
};
var encoder = /* @__PURE__ */ new TextEncoder();
var stripCrlf = (str) => str.replace(/[\n\r]/g, "");
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var codes = /* @__PURE__ */ new Uint8Array(123).fill(255);
for (let i = 0; i < alphabet.length; i++) codes[/* @__PURE__ */ alphabet.charCodeAt(i)] = i;
codes[/* @__PURE__ */ "=".charCodeAt(0)] = 0;
var getCode = (charCode) => {
  if (charCode >= codes.length || codes[charCode] === 255) {
    throw new TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
  }
  return codes[charCode];
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/SchemaGetter.js
var makeGetter = (fields) => Object.assign(Object.create(Prototype), fields);
var passthrough_ = /* @__PURE__ */ makeGetter({
  _tag: "Passthrough"
});
function passthrough() {
  return passthrough_;
}
function transform(f) {
  return makeGetter({
    _tag: "Transform",
    transform: f
  });
}
function transformEffect(f) {
  return makeGetter({
    _tag: "TransformEffect",
    transform: f
  });
}
function String2() {
  return transform(globalThis.String);
}
function Number4() {
  return transform(globalThis.Number);
}
function parseJson(options) {
  return transformEffect((input, parseOptions) => try_2({
    try: () => JSON.parse(input, options?.reviver),
    catch: () => new InvalidValue({
      expected: "a valid JSON string"
    }, input, parseOptions)
  }));
}
function stringifyJson(options) {
  return transformEffect((input, parseOptions) => try_2({
    try: () => {
      const output = JSON.stringify(input, options?.replacer, options?.space);
      if (output === void 0) {
        throw new TypeError("Value cannot be represented as JSON");
      }
      return output;
    },
    catch: () => new InvalidValue({
      expected: "a JSON-serializable value"
    }, input, parseOptions)
  }));
}
function encodeBase64() {
  return transform(encode);
}
function decodeBase64() {
  return transformEffect((input, options) => mapErrorEager2(fromResult2(decode(input)), () => new InvalidValue({
    expected: "a valid Base64 string"
  }, input, options)));
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/SchemaTransformation.js
var TypeId18 = "~effect/SchemaTransformation/Transformation";
var Transformation = class extends Class {
  [TypeId18] = TypeId18;
  _tag = "Transformation";
  decode;
  encode;
  constructor(decode2, encode2) {
    super();
    this.decode = decode2;
    this.encode = encode2;
  }
  flip() {
    return new Transformation(this.encode, this.decode);
  }
};
function isTransformation(u) {
  return hasProperty(u, TypeId18) && u[TypeId18] === TypeId18;
}
var makeTransformation = (options) => {
  if (isTransformation(options)) {
    return options;
  }
  return new Transformation(options.decode, options.encode);
};
function transformEffect2(options) {
  return new Transformation(transformEffect(options.decode), transformEffect(options.encode));
}
function transform2(options) {
  return new Transformation(transform(options.decode), transform(options.encode));
}
var passthrough_2 = /* @__PURE__ */ new Transformation(/* @__PURE__ */ passthrough(), /* @__PURE__ */ passthrough());
function passthrough2() {
  return passthrough_2;
}
var numberFromString = /* @__PURE__ */ new Transformation(/* @__PURE__ */ Number4(), /* @__PURE__ */ String2());
var isJsonError = (input) => isObject(input) && typeof input["message"] === "string";
var decodeJsonError = (input) => {
  const hasCause = Object.hasOwn(input, "cause");
  const err = hasCause ? new Error(input.message, {
    cause: decodeDefect(input.cause)
  }) : new Error(input.message);
  if (typeof input.name === "string" && input.name !== "Error") err.name = input.name;
  if (typeof input.stack === "string") err.stack = input.stack;
  return err;
};
var encodeUnknownAsJson = (input) => {
  try {
    const json = formatJson(input);
    return json === void 0 ? format(input) : JSON.parse(json);
  } catch {
    return format(input);
  }
};
var encodeJsonError = (input, options, encodeDefect) => {
  const encoded = {
    name: input.name,
    message: typeof input.message === "string" ? input.message : ""
  };
  if (options?.includeStack && typeof input.stack === "string") {
    encoded.stack = input.stack;
  }
  if (!options?.excludeCause && input.cause !== void 0) {
    encoded.cause = encodeDefect(input.cause);
  }
  return encoded;
};
var makeEncodeDefect = (options) => {
  const seen = /* @__PURE__ */ new WeakSet();
  const encode2 = (input) => {
    if (isError(input)) {
      if (seen.has(input)) {
        return "[Circular]";
      }
      seen.add(input);
      const encoded = encodeJsonError(input, options, encode2);
      seen.delete(input);
      return encoded;
    }
    return encodeUnknownAsJson(input);
  };
  return encode2;
};
var decodeDefect = (input) => isJsonError(input) ? decodeJsonError(input) : input;
var defectFromJson = (options) => transform2({
  decode: decodeDefect,
  encode: makeEncodeDefect(options)
});
var urlFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options) => URL.canParse(s) ? succeed6(new URL(s)) : fail6(new InvalidValue({
    expected: "a valid URL string"
  }, s, options)),
  encode: (url) => succeed6(url.href)
});
var uint8ArrayFromBase64String = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeBase64(), /* @__PURE__ */ encodeBase64());
function fromJsonString(options) {
  return new Transformation(parseJson(options ?? {}), stringifyJson(options));
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/SchemaAST.js
function makeGuard(tag2) {
  return (ast) => ast._tag === tag2;
}
var isDeclaration = /* @__PURE__ */ makeGuard("Declaration");
var isNever2 = /* @__PURE__ */ makeGuard("Never");
var isLiteral = /* @__PURE__ */ makeGuard("Literal");
var isUniqueSymbol = /* @__PURE__ */ makeGuard("UniqueSymbol");
var isArrays = /* @__PURE__ */ makeGuard("Arrays");
var isObjects = /* @__PURE__ */ makeGuard("Objects");
var isSuspend = /* @__PURE__ */ makeGuard("Suspend");
var Link = class {
  to;
  transformation;
  constructor(to, transformation) {
    this.to = to;
    this.transformation = transformation;
  }
};
var defaultParseOptions = {};
var Context = class {
  isOptional;
  isMutable;
  /** Used for constructor default values (e.g. `withConstructorDefault` API) */
  constructorDefault;
  annotations;
  constructor(isOptional2, isMutable, constructorDefault = void 0, annotations = void 0) {
    this.isOptional = isOptional2;
    this.isMutable = isMutable;
    this.constructorDefault = constructorDefault;
    this.annotations = annotations;
  }
};
var TypeId19 = "~effect/Schema";
var ASTNodeImpl = class {
  [TypeId19] = TypeId19;
  annotations;
  checks;
  encoding;
  context;
  constructor(annotations = void 0, checks = void 0, encoding = void 0, context3 = void 0) {
    this.annotations = annotations;
    this.checks = checks;
    this.encoding = encoding;
    this.context = context3;
  }
  toString() {
    return `<${this._tag}>`;
  }
};
var Declaration = class extends ASTNodeImpl {
  _tag = "Declaration";
  typeParameters;
  run;
  encodingChecks;
  /**
   * Parser factory {@link flip} swaps in, so a declaration can behave
   * differently when encoding. `undefined` reuses `run`.
   */
  encodingRun;
  constructor(typeParameters, run6, annotations, checks, encoding, context3, encodingChecks, encodingRun) {
    super(annotations, checks, encoding, context3);
    this.typeParameters = typeParameters;
    this.run = run6;
    this.encodingChecks = encodingChecks;
    this.encodingRun = encodingRun;
  }
  /** @internal */
  getParser() {
    let run6;
    return (input, options) => {
      if (input === missing) return missingExit;
      return (run6 ??= this.run(this.typeParameters))(input, this, options);
    };
  }
  _rebuild(recur, checks, encodingChecks, run6, encodingRun) {
    const tps = mapOrSame(this.typeParameters, recur);
    return tps === this.typeParameters && checks === this.checks && encodingChecks === this.encodingChecks && run6 === this.run && encodingRun === this.encodingRun ? this : new Declaration(tps, run6, this.annotations, checks, void 0, this.context, encodingChecks, encodingRun);
  }
  /** @internal */
  recur(recur) {
    return this._rebuild(recur, this.checks, this.encodingChecks, this.run, this.encodingRun);
  }
  /** @internal */
  flip(recur) {
    return this._rebuild(recur, this.encodingChecks, this.checks, this.encodingRun ?? this.run, this.run);
  }
  /** @internal */
  getExpected() {
    const expected = this.annotations?.expected;
    if (typeof expected === "string") return expected;
    return "<Declaration>";
  }
};
var Null = class extends ASTNodeImpl {
  _tag = "Null";
  /** @internal */
  getParser() {
    return fromConst(this, null);
  }
  /** @internal */
  getExpected() {
    return "null";
  }
};
var null_ = /* @__PURE__ */ new Null();
var Undefined = class extends ASTNodeImpl {
  _tag = "Undefined";
  /** @internal */
  getParser() {
    return fromConst(this, void 0);
  }
  /** @internal */
  toCodecJson() {
    return replaceEncoding(this, [undefinedToNull]);
  }
  /** @internal */
  getExpected() {
    return "undefined";
  }
};
var undefinedToNull = /* @__PURE__ */ new Link(null_, /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform(() => void 0), /* @__PURE__ */ transform(() => null)));
var undefined_2 = /* @__PURE__ */ new Undefined();
var Unknown = class extends ASTNodeImpl {
  _tag = "Unknown";
  /** @internal */
  getParser() {
    return fromRefinement(this, isUnknown);
  }
  /** @internal */
  getExpected() {
    return "unknown";
  }
};
var unknown = /* @__PURE__ */ new Unknown();
var Literal = class extends ASTNodeImpl {
  _tag = "Literal";
  literal;
  constructor(literal, annotations, checks, encoding, context3) {
    super(annotations, checks, encoding, context3);
    if (typeof literal === "number" && !globalThis.Number.isFinite(literal)) {
      throw new Error(`A numeric literal must be finite, got ${format(literal)}`);
    }
    this.literal = literal;
  }
  /** @internal */
  getParser() {
    return fromConst(this, this.literal);
  }
  /** @internal */
  matchPart(s, _options) {
    return s === globalThis.String(this.literal) ? this.literal : void 0;
  }
  /** @internal */
  toCodecJson() {
    return typeof this.literal === "bigint" ? literalToString(this) : this;
  }
  /** @internal */
  toCodecStringTree() {
    return typeof this.literal === "string" ? this : literalToString(this);
  }
  /** @internal */
  getExpected() {
    return typeof this.literal === "string" ? JSON.stringify(this.literal) : globalThis.String(this.literal);
  }
};
function literalToString(ast) {
  const literalAsString = globalThis.String(ast.literal);
  return replaceEncoding(ast, [new Link(new Literal(literalAsString), new Transformation(transform(() => ast.literal), transform(() => literalAsString)))]);
}
var String3 = class extends ASTNodeImpl {
  _tag = "String";
  /** @internal */
  getParser() {
    return fromRefinement(this, isString);
  }
  /** @internal */
  matchPart(s, options) {
    const checks = this.checks;
    return checks && !options.disableChecks && collectIssues(checks, s, void 0, this, options) ? void 0 : s;
  }
  /** @internal */
  getExpected() {
    return "string";
  }
};
var string2 = /* @__PURE__ */ new String3();
var Number5 = class extends ASTNodeImpl {
  _tag = "Number";
  /** @internal */
  getParser() {
    return fromRefinement(this, isNumber);
  }
  /** @internal */
  matchKey(s, options) {
    return this._match(isStringNumberRegExp, s, options);
  }
  /** @internal */
  matchPart(s, options) {
    return this._match(isStringFiniteRegExp, s, options);
  }
  _match(regexp, s, options) {
    if (!regexp.test(s)) return void 0;
    const value3 = globalThis.Number(s);
    if (options.disableChecks || !this.checks) return value3;
    return collectIssues(this.checks, value3, void 0, this, options) ? void 0 : value3;
  }
  /** @internal */
  toCodecJson() {
    if (this.checks && (hasCheck(this.checks, "effect/schema/isFinite") || hasCheck(this.checks, "effect/schema/isInt"))) {
      return this;
    }
    return replaceEncoding(this, [numberToJson]);
  }
  /** @internal */
  toCodecStringTree() {
    if (this.toCodecJson() === this) {
      return replaceEncoding(this, [finiteToString]);
    }
    return replaceEncoding(this, [numberToString]);
  }
  /** @internal */
  getExpected() {
    return "number";
  }
};
function hasCheck(checks, id) {
  return checks.some((check) => check.annotations?.representation?.id === id || check._tag === "FilterGroup" && hasCheck(check.checks, id));
}
var number2 = /* @__PURE__ */ new Number5();
var Boolean2 = class extends ASTNodeImpl {
  _tag = "Boolean";
  /** @internal */
  getParser() {
    return fromRefinement(this, isBoolean);
  }
  /** @internal */
  getExpected() {
    return "boolean";
  }
};
var boolean = /* @__PURE__ */ new Boolean2();
var Arrays = class extends ASTNodeImpl {
  _tag = "Arrays";
  isMutable;
  elements;
  rest;
  encodingChecks;
  constructor(isMutable, elements, rest, annotations, checks, encoding, context3, encodingChecks) {
    super(annotations, checks, encoding, context3);
    this.isMutable = isMutable;
    this.elements = elements;
    this.rest = rest;
    this.encodingChecks = encodingChecks;
    let hasOptional = false;
    for (let i = 0; i < elements.length; i++) {
      if (isOptional(elements[i])) {
        hasOptional = true;
      } else if (hasOptional) {
        throw new Error("A required element cannot follow an optional element. ts(1257)");
      }
    }
    if (hasOptional && rest.length > 1) {
      throw new Error("A required element cannot follow an optional element. ts(1257)");
    }
    for (let i = 1; i < rest.length; i++) {
      if (isOptional(rest[i])) {
        throw new Error("An optional element cannot follow a rest element. ts(1266)");
      }
    }
  }
  /** @internal */
  getParser(compile2, compileField2 = compile2) {
    const ast = this;
    let elements;
    let rest;
    const elementLen = ast.elements.length;
    const tailLen = Math.max(0, ast.rest.length - 1);
    function getParser(tailThreshold, index) {
      if (index < elementLen) {
        return elements[index];
      } else if (index >= tailThreshold) {
        return rest[index - tailThreshold + 1];
      }
      return rest[0];
    }
    const finish = (state) => {
      const {
        input,
        len,
        options
      } = state;
      if (ast.rest.length === 0 && len > elementLen) {
        for (let i = elementLen; i < len; i++) {
          const unexpected = new UnexpectedKey(ast, input[i], options);
          const issue = new Pointer([i], unexpected);
          if (options.errors === "all") {
            if (state.issues) state.issues.push(issue);
            else state.issues = [issue];
          } else {
            return fail6(new Composite(ast, [issue], input, options));
          }
        }
      }
      if (state.issues) {
        return fail6(new Composite(ast, state.issues, input, options));
      }
      return succeed8(state.output);
    };
    const parse = (input, options) => {
      const len = input.length;
      const state = {
        ast,
        getParser,
        input,
        len,
        tailThreshold: Math.max(elementLen, len - tailLen),
        output: new globalThis.Array(len),
        issues: void 0,
        options
      };
      const end = ast.rest.length === 0 ? elementLen : Math.max(len, elementLen + tailLen);
      const concurrency = options.concurrency === void 0 ? 1 : resolveConcurrency(options.concurrency);
      const eff = concurrency === 1 ? parseArray(state, input, 0, end) : parseArrayConcurrent(state, input, {
        concurrency,
        end
      });
      if (!eff) return finish(state);
      if (effectIsExit(eff)) return flatMapEager2(eff, () => finish(state));
      let first = true;
      return suspend2(() => {
        if (!first) return parse(input, options);
        first = false;
        return flatMap4(eff, () => finish(state));
      });
    };
    return (input, options) => {
      if (input === missing) return missingExit;
      try {
        if (!Array.isArray(input)) {
          return fail6(new InvalidType(ast, input, options));
        }
        if (!elements) {
          elements = ast.elements.map((ast2) => ({
            ast: ast2,
            parser: compileField2(ast2)
          }));
          rest = ast.rest.map((ast2) => ({
            ast: ast2,
            parser: compileField2(ast2)
          }));
        }
        return parse(input, options);
      } catch (error2) {
        return die3(error2);
      }
    };
  }
  _rebuild(recur, checks, encodingChecks) {
    const elements = mapOrSame(this.elements, recur);
    const rest = mapOrSame(this.rest, recur);
    return elements === this.elements && rest === this.rest && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Arrays(this.isMutable, elements, rest, this.annotations, checks, void 0, this.context, encodingChecks);
  }
  /** @internal */
  recur(recur) {
    return this._rebuild(recur, this.checks, this.encodingChecks);
  }
  /** @internal */
  flip(recur) {
    return this._rebuild(recur, this.encodingChecks, this.checks);
  }
  /** @internal */
  getExpected() {
    return "array";
  }
};
function stepArray(s, item, exit3, i) {
  if (exit3._tag === "Failure") {
    return wrapPropertyKeyIssue(s, s.ast, i, exit3);
  }
  const value3 = exit3 === sameExit ? item : exit3[args];
  if (value3 !== missing) {
    s.output[i] = value3;
  } else {
    const p = s.getParser(s.tailThreshold, i);
    if (isOptional(p.ast)) return;
    const issue = new Pointer([i], new MissingKey(p.ast.context?.annotations));
    if (s.options.errors === "all") {
      if (s.issues) s.issues.push(issue);
      else s.issues = [issue];
    } else {
      return fail5(new Composite(s.ast, [issue], s.input, s.options));
    }
  }
}
var parseArrayOptions = {
  onItem(s, item, i) {
    const value3 = i < s.len ? item : missing;
    return s.getParser(s.tailThreshold, i).parser(value3, s.options);
  },
  step: stepArray
};
var parseArray = /* @__PURE__ */ iterateEager()(parseArrayOptions);
var parseArrayConcurrent = /* @__PURE__ */ iterateConcurrent()(parseArrayOptions);
var wrapPropertyKeyIssue = (s, ast, key, exit3) => {
  if (exit3.cause.reasons.length === 0) {
    return exit3;
  }
  const issue = getSchemaIssue(exit3.cause);
  if (issue === void 0) {
    return failCause2(map4(exit3.cause, (issue2) => new Composite(ast, [new Pointer([key], issue2)], s.input, s.options)));
  }
  const pointer = new Pointer([key], issue);
  if (s.options.errors === "all") {
    if (s.issues) s.issues.push(pointer);
    else s.issues = [pointer];
  } else {
    return fail5(new Composite(ast, [pointer], s.input, s.options));
  }
};
var FINITE_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
function getIndexSignatureKeys(input, parameter, options = defaultParseOptions) {
  let stringKeys;
  let symbolKeys;
  function go(parameter2) {
    switch (parameter2._tag) {
      case "String":
      case "TemplateLiteral":
        return (stringKeys ??= Object.keys(input)).filter((k) => parameter2.matchPart(k, options) !== void 0);
      case "Number":
        return (stringKeys ??= Object.keys(input)).filter((k) => parameter2.matchKey(k, options) !== void 0);
      case "Symbol":
        return (symbolKeys ??= Object.getOwnPropertySymbols(input)).filter((k) => Object.prototype.propertyIsEnumerable.call(input, k) && parameter2.matchKey(k, options) !== void 0);
      case "Union":
        return [...new Set(parameter2.types.flatMap(go))];
      default:
        return [];
    }
  }
  return go(parameterFromPropertyKey(toEncoded(parameter)));
}
var PropertySignature = class {
  name;
  type;
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
};
function isIndexSignatureParameterSide(ast) {
  switch (ast._tag) {
    case "String":
    case "Number":
    case "Symbol":
    case "TemplateLiteral":
      return true;
    case "Union":
      return ast.types.every(isIndexSignatureParameterSide);
    default:
      return false;
  }
}
function isIndexSignatureParameterEncodedSide(ast) {
  const encoded = getLastEncoding(ast);
  switch (encoded._tag) {
    case "String":
    case "Number":
    case "Symbol":
    case "TemplateLiteral":
      return true;
    case "Union":
      return encoded.types.every(isIndexSignatureParameterEncodedSide);
    default:
      return false;
  }
}
function isIndexSignatureParameter(ast) {
  return isIndexSignatureParameterSide(ast) && isIndexSignatureParameterEncodedSide(ast);
}
var IndexSignature = class {
  parameter;
  type;
  constructor(parameter, type) {
    if (!isIndexSignatureParameter(parameter)) {
      throw new Error(`Invalid index signature parameter ${parameter._tag}`);
    }
    this.parameter = parameter;
    this.type = type;
    if (isOptional(type) && !containsUndefined(type)) {
      throw new Error("Cannot use `Schema.optionalKey` with index signatures, use `Schema.optional` instead.");
    }
  }
};
var Objects = class extends ASTNodeImpl {
  _tag = "Objects";
  propertySignatures;
  indexSignatures;
  encodingChecks;
  constructor(propertySignatures, indexSignatures, annotations, checks, encoding, context3, encodingChecks) {
    super(annotations, checks, encoding, context3);
    this.propertySignatures = propertySignatures;
    this.indexSignatures = indexSignatures;
    this.encodingChecks = encodingChecks;
  }
  /** @internal */
  getParser(compile2, compileField2 = compile2) {
    const ast = this;
    const hasProperties = ast.propertySignatures.length;
    const indexCount = ast.indexSignatures.length;
    if (!hasProperties && !indexCount) {
      return fromRefinement(ast, isNotNullish);
    }
    let properties;
    let indexes;
    const compileMembers = () => {
      if (!properties) {
        properties = ast.propertySignatures.map((ps) => ({
          parser: compileField2(ps.type),
          name: ps.name,
          type: ps.type
        }));
        indexes = indexCount ? ast.indexSignatures.map((is3) => ({
          is: is3,
          parserKey: compile2(parameterFromPropertyKey(is3.parameter)),
          parserValue: compileField2(is3.type)
        })) : void 0;
      }
      return properties;
    };
    const makeFallback = () => {
      const expectedKeys = new Set(ast.propertySignatures.map((ps) => typeof ps.name === "number" ? globalThis.String(ps.name) : ps.name));
      const finishIndex = (s, key, k2, inputValue, exitValue) => {
        if (exitValue._tag === "Failure") {
          return wrapPropertyKeyIssue(s, ast, key, exitValue) ?? void_2;
        }
        const value3 = exitValue === sameExit ? inputValue : exitValue[args];
        if (k2 !== missing && value3 !== missing) {
          if (hasProperties && (expectedKeys.has(key) || expectedKeys.has(typeof k2 === "number" ? globalThis.String(k2) : k2))) return void_2;
          assignProperty(s.out, k2, value3);
        }
        return void_2;
      };
      const parseIndex = (s, key, index, exitKey) => {
        if (!exitKey) {
          const eff = index.parserKey(key, s.options);
          if (!effectIsExit(eff)) {
            return flatMap4(exit2(eff), (exit3) => parseIndex(s, key, index, exit3));
          }
          exitKey = eff;
        }
        if (exitKey._tag === "Failure") {
          return wrapPropertyKeyIssue(s, ast, key, exitKey) ?? void_2;
        }
        const k2 = exitKey === sameExit ? key : exitKey[args];
        const inputValue = s.input[key];
        const result3 = index.parserValue(inputValue, s.options);
        return effectIsExit(result3) ? finishIndex(s, key, k2, inputValue, result3) : flatMap4(exit2(result3), (exit3) => finishIndex(s, key, k2, inputValue, exit3));
      };
      const parseStringIndex = (s, key, index) => {
        const inputValue = s.input[key];
        const result3 = index.parserValue(inputValue, s.options);
        return effectIsExit(result3) ? finishIndex(s, key, key, inputValue, result3) : flatMap4(exit2(result3), (exit3) => finishIndex(s, key, key, inputValue, exit3));
      };
      const parseIndexes = indexCount ? iterateConcurrent()({
        onItem: (s, [key, index]) => index.is.parameter === string2 ? parseStringIndex(s, key, index) : parseIndex(s, key, index),
        step: (_s, _item, exit3) => exit3._tag === "Failure" ? exit3 : void 0
      }) : void 0;
      return fnUntracedEager2(function* (input, options) {
        if (input === missing) {
          return missing;
        }
        if (!(typeof input === "object" && input !== null && !Array.isArray(input))) {
          return yield* fail6(new InvalidType(ast, input, options));
        }
        compileMembers();
        const record2 = input;
        const out = {};
        const state = {
          ast,
          input: record2,
          out,
          issues: void 0,
          options
        };
        const errorsAllOption = options.errors === "all";
        const onExcessPropertyError = options.onExcessProperty === "error";
        const concurrency = options.concurrency === void 0 ? 1 : resolveConcurrency(options.concurrency);
        const indexKeys = indexCount && onExcessPropertyError ? ast.indexSignatures.map((index) => getIndexSignatureKeys(record2, index.parameter, options)) : void 0;
        if (onExcessPropertyError) {
          const coveredKeys = indexKeys ? new Set(expectedKeys) : expectedKeys;
          if (indexKeys) {
            for (const keys of indexKeys) {
              for (const key of keys) coveredKeys.add(key);
            }
          }
          const inputKeys = Reflect.ownKeys(record2);
          for (let i = 0; i < inputKeys.length; i++) {
            const key = inputKeys[i];
            if (!coveredKeys.has(key) && Object.prototype.propertyIsEnumerable.call(record2, key)) {
              const unexpected = new UnexpectedKey(ast, record2[key], options);
              const issue = new Pointer([key], unexpected);
              if (errorsAllOption) {
                if (state.issues) {
                  state.issues.push(issue);
                } else {
                  state.issues = [issue];
                }
                continue;
              } else {
                return yield* fail6(new Composite(ast, [issue], input, options));
              }
            }
          }
        }
        if (hasProperties) {
          const eff = concurrency === 1 ? parseProperties(state, properties) : parsePropertiesConcurrent(state, properties, {
            concurrency
          });
          if (eff) yield* eff;
        }
        if (indexCount && concurrency === 1) {
          for (let i = 0; i < indexCount; i++) {
            const index = indexes[i];
            const parse = index.is.parameter === string2 ? parseStringIndex : parseIndex;
            const keys = indexKeys?.[i] ?? (index.is.parameter === string2 ? Object.keys(record2) : getIndexSignatureKeys(record2, index.is.parameter, options));
            for (let j = 0; j < keys.length; j++) {
              const eff = parse(state, keys[j], index);
              if (!effectIsExit(eff)) yield* eff;
              else if (eff._tag === "Failure") return yield* eff;
            }
          }
        } else if (parseIndexes) {
          const keyPairs = empty2();
          for (let i = 0; i < indexCount; i++) {
            const index = indexes[i];
            const keys = indexKeys?.[i] ?? (index.is.parameter === string2 ? Object.keys(record2) : getIndexSignatureKeys(record2, index.is.parameter, options));
            for (let j = 0; j < keys.length; j++) {
              keyPairs.push([keys[j], index]);
            }
          }
          const eff = parseIndexes(state, keyPairs, {
            concurrency
          });
          if (eff) yield* eff;
        }
        if (state.issues) {
          return yield* fail6(new Composite(ast, state.issues, input, options));
        }
        return out;
      });
    };
    if (indexCount) return makeFallback();
    let fallback;
    const resume = (state, index, pending) => {
      const property = properties[index];
      return flatMap4(exit2(pending), (exit3) => {
        const terminal = stepProperty(state, property, exit3);
        if (terminal) return terminal;
        const done3 = () => succeed8(state.out);
        const eff = parseProperties(state, properties.slice(index + 1));
        return eff ? flatMapEager2(eff, done3) : done3();
      });
    };
    return (input, options) => {
      if (input === missing) return missingExit;
      if (options.errors === "all" || options.onExcessProperty !== void 0 || options.concurrency !== void 0 && resolveConcurrency(options.concurrency) !== 1) {
        return (fallback ??= makeFallback())(input, options);
      }
      if (!(typeof input === "object" && input !== null && !Array.isArray(input))) {
        return fail6(new InvalidType(ast, input, options));
      }
      const props = compileMembers();
      const record2 = input;
      const out = {};
      const state = {
        ast,
        input: record2,
        out,
        issues: void 0,
        options
      };
      try {
        for (let index = 0; index < props.length; index++) {
          const property = props[index];
          const name = property.name;
          const hasKey = hasPropertySignature(record2, name);
          const value3 = hasKey ? record2[name] : missing;
          const exit3 = property.parser(value3, options);
          if (!effectIsExit(exit3)) {
            return resume(state, index, exit3);
          }
          if (exit3 === sameExit) {
            if (hasKey) assignProperty(out, name, value3);
            continue;
          }
          const terminal = stepProperty(state, property, exit3);
          if (terminal) return terminal;
        }
      } catch (error2) {
        return die3(error2);
      }
      return succeed8(out);
    };
  }
  _rebuild(recur, recurParameter, checks, encodingChecks) {
    const props = mapOrSame(this.propertySignatures, (ps) => {
      const t = recur(ps.type);
      return t === ps.type ? ps : new PropertySignature(ps.name, t);
    });
    const indexes = mapOrSame(this.indexSignatures, (is3) => {
      const p = recurParameter(is3.parameter);
      const t = recur(is3.type);
      return p === is3.parameter && t === is3.type ? is3 : new IndexSignature(p, t);
    });
    return props === this.propertySignatures && indexes === this.indexSignatures && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Objects(props, indexes, this.annotations, checks, void 0, this.context, encodingChecks);
  }
  /** @internal */
  flip(recur) {
    return this._rebuild(recur, recur, this.encodingChecks, this.checks);
  }
  /** @internal */
  recur(recur, recurParameter = recur) {
    return this._rebuild(recur, recurParameter, this.checks, this.encodingChecks);
  }
  /** @internal */
  getExpected() {
    if (this.propertySignatures.length === 0 && this.indexSignatures.length === 0) return "object | array";
    return "object";
  }
};
function stepProperty(s, p, exit3) {
  if (exit3._tag === "Failure") {
    return wrapPropertyKeyIssue(s, s.ast, p.name, exit3);
  }
  if (exit3 === sameExit) return;
  const value3 = exit3[args];
  if (value3 !== missing) {
    assignProperty(s.out, p.name, value3);
    return;
  }
  delete s.out[p.name];
  if (!isOptional(p.type)) {
    const issue = new Pointer([p.name], new MissingKey(p.type.context?.annotations));
    if (s.options.errors === "all") {
      if (s.issues) s.issues.push(issue);
      else s.issues = [issue];
      return;
    } else {
      return fail5(new Composite(s.ast, [issue], s.input, s.options));
    }
  }
}
var parsePropertiesOptions = {
  onItem(s, p) {
    if (!hasPropertySignature(s.input, p.name)) {
      return p.parser(missing, s.options);
    }
    const value3 = s.input[p.name];
    assignProperty(s.out, p.name, value3);
    return p.parser(value3, s.options);
  },
  step: stepProperty
};
var parseProperties = /* @__PURE__ */ iterateEager()(parsePropertiesOptions);
var parsePropertiesConcurrent = /* @__PURE__ */ iterateConcurrent()(parsePropertiesOptions);
function combineChecks(a, b) {
  if (!a) return b;
  if (!b) return a;
  return [...a, ...b];
}
function struct(fields, checks, annotations) {
  return new Objects(Reflect.ownKeys(fields).map((key) => {
    return new PropertySignature(key, fields[key].ast);
  }), [], annotations, checks);
}
function getAST(self) {
  return self.ast;
}
function tuple(elements, checks = void 0) {
  return new Arrays(false, elements.map((e) => e.ast), [], void 0, checks);
}
function union(members, options, checks) {
  return new Union(members.map(getAST), options, void 0, checks);
}
var toCandidate = /* @__PURE__ */ memoizeIdempotent((ast) => {
  while (true) {
    if (isSuspend(ast)) return unknown;
    const encoding = ast.encoding;
    if (!encoding) {
      return ast.recur?.(toCandidate, identity) ?? ast;
    }
    if (encoding.some((link4) => link4.transformation._tag === "Middleware" && link4.transformation.decode !== identity)) return unknown;
    ast = encoding[encoding.length - 1].to;
  }
});
function getCandidateTypes(ast) {
  switch (ast._tag) {
    case "Null":
      return ["null"];
    case "Undefined":
      return ["undefined"];
    case "String":
    case "TemplateLiteral":
      return ["string"];
    case "Number":
      return ["number"];
    case "Boolean":
      return ["boolean"];
    case "Symbol":
    case "UniqueSymbol":
      return ["symbol"];
    case "BigInt":
      return ["bigint"];
    case "Arrays":
      return ["array"];
    case "ObjectKeyword":
      return ["object", "array", "function"];
    case "Objects":
      return ast.propertySignatures.length || ast.indexSignatures.length ? ["object"] : ["string", "number", "boolean", "symbol", "bigint", "object", "array", "function"];
    case "Enum":
      return Array.from(new Set(ast.enums.map(([, v]) => typeof v)));
    case "Literal":
      return [typeof ast.literal];
    case "Union":
      return Array.from(new Set(ast.types.flatMap(getCandidateTypes)));
    default:
      return ["null", "undefined", "string", "number", "boolean", "symbol", "bigint", "object", "array", "function"];
  }
}
function collectSentinels(ast) {
  switch (ast._tag) {
    default:
      return [];
    case "Declaration": {
      const s = ast.annotations?.[SENTINELS_ANNOTATION_KEY];
      return Array.isArray(s) ? s : [];
    }
    case "Objects":
      return ast.propertySignatures.flatMap((ps) => {
        const type = ps.type;
        if (!isOptional(type)) {
          if (isLiteral(type)) {
            return [{
              key: ps.name,
              literal: type.literal
            }];
          }
          if (isUniqueSymbol(type)) {
            return [{
              key: ps.name,
              literal: type.symbol
            }];
          }
        }
        return [];
      });
    case "Arrays":
      return ast.elements.flatMap((e, i) => {
        if (!isOptional(e)) {
          if (isLiteral(e)) {
            return [{
              key: i,
              literal: e.literal
            }];
          }
          if (isUniqueSymbol(e)) {
            return [{
              key: i,
              literal: e.symbol
            }];
          }
        }
        return [];
      });
    case "Union": {
      if (ast.types.length === 0) return [];
      const members = ast.types.map((type) => collectSentinels(toCandidate(type)));
      return members[0].filter((s) => members.every((sentinels) => sentinels.some((o) => o.key === s.key && o.literal === s.literal)));
    }
    case "Suspend":
      return collectSentinels(ast.thunk());
  }
}
var candidateIndexCache = /* @__PURE__ */ new WeakMap();
var emptyCandidates = /* @__PURE__ */ Object.freeze([]);
var getRuntimeType = (input) => input === null ? "null" : Array.isArray(input) ? "array" : typeof input;
var hasPropertySignature = (input, key) => key === "__proto__" ? Object.hasOwn(input, key) : key in input;
function getCandidateIndex(types) {
  let index = candidateIndexCache.get(types);
  if (index) return index;
  let bySentinel;
  let sentinelCandidateCount = 0;
  let otherwise;
  let literalCandidates;
  let onlyLiterals = true;
  const literalOf = [];
  for (let i = 0; i < types.length; i++) {
    const a = types[i];
    const encoded = toCandidate(a);
    if (isNever2(encoded)) continue;
    if (isLiteral(encoded) || isUniqueSymbol(encoded)) {
      literalCandidates ??= /* @__PURE__ */ new Map();
      const literal = isLiteral(encoded) ? encoded.literal : encoded.symbol;
      literalOf[i] = literal;
      let arr = literalCandidates.get(literal);
      if (!arr) literalCandidates.set(literal, arr = []);
      arr.push(i);
    } else {
      onlyLiterals = false;
    }
    const sentinels = collectSentinels(encoded);
    if (sentinels.length) {
      bySentinel ??= /* @__PURE__ */ new Map();
      sentinelCandidateCount++;
      for (const {
        key,
        literal
      } of sentinels) {
        let entry = bySentinel.get(key);
        if (!entry) bySentinel.set(key, entry = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Set()]);
        entry[1].add(i);
        let indexes = entry[0].get(literal);
        if (!indexes) entry[0].set(literal, indexes = /* @__PURE__ */ new Set());
        indexes.add(i);
      }
    } else {
      otherwise ??= {};
      const candidateTypes = getCandidateTypes(encoded);
      for (const t of candidateTypes) (otherwise[t] ??= []).push(i);
    }
  }
  const fallbacks = {};
  const getFallback = (type) => fallbacks[type] ??= Object.freeze(otherwise?.[type] ?? emptyCandidates);
  if (onlyLiterals && literalCandidates) {
    literalCandidates.forEach(Object.freeze);
    index = (input) => literalCandidates.get(input) ?? emptyCandidates;
  } else if (bySentinel?.size === 1 && !otherwise) {
    const [key, [byValue]] = bySentinel.entries().next().value;
    const candidates = /* @__PURE__ */ new Map();
    for (const [literal, indexes] of byValue) {
      candidates.set(literal, Object.freeze(Array.from(indexes)));
    }
    const all4 = Object.freeze(types.map((_, i) => i));
    index = (input, isConstructor) => {
      if (isObjectKeyword(input)) {
        const value3 = hasPropertySignature(input, key) ? input[key] : void 0;
        if (value3 !== void 0) return candidates.get(value3) ?? emptyCandidates;
        if (isConstructor) return all4;
      }
      return emptyCandidates;
    };
  } else if (bySentinel) {
    let commonSentinel;
    for (const entry of bySentinel) {
      if ((!commonSentinel || entry[1][0].size > commonSentinel[1][0].size) && entry[1][1].size === sentinelCandidateCount) {
        commonSentinel = entry;
      }
    }
    index = (input, isConstructor) => {
      const runtimeType = getRuntimeType(input);
      if (!isObjectKeyword(input)) return getFallback(runtimeType);
      const selected = new Set(otherwise?.[runtimeType]);
      let directKey;
      if (commonSentinel) {
        const [key, [byValue]] = commonSentinel;
        const hasKey = hasPropertySignature(input, key);
        const value3 = hasKey ? input[key] : void 0;
        if (hasKey && (!isConstructor || value3 !== void 0)) {
          const match7 = byValue.get(value3);
          if (!match7) return getFallback(runtimeType);
          for (const i of match7) selected.add(i);
          directKey = key;
        }
      }
      if (directKey === void 0) {
        for (const [key, [byValue, all4]] of bySentinel) {
          const hasKey = hasPropertySignature(input, key);
          const value3 = hasKey ? input[key] : void 0;
          if (hasKey && (!isConstructor || value3 !== void 0)) {
            const match7 = byValue.get(value3);
            if (match7) {
              for (const i of match7) selected.add(i);
            }
          } else if (isConstructor) {
            for (const i of all4) selected.add(i);
          }
        }
      }
      for (const [key, [byValue, all4]] of bySentinel) {
        if (key === directKey) continue;
        const hasKey = hasPropertySignature(input, key);
        const value3 = hasKey ? input[key] : void 0;
        if (hasKey && (!isConstructor || value3 !== void 0)) {
          const match7 = byValue.get(value3);
          for (const i of selected) {
            if (all4.has(i) && !match7?.has(i)) selected.delete(i);
          }
        }
      }
      return Array.from(selected).sort((a, b) => a - b);
    };
  } else {
    index = (input) => {
      const fallback = getFallback(getRuntimeType(input));
      return literalCandidates ? fallback.filter((i) => literalOf[i] === void 0 || literalOf[i] === input) : fallback;
    };
  }
  candidateIndexCache.set(types, index);
  return index;
}
var Union = class extends ASTNodeImpl {
  _tag = "Union";
  types;
  options;
  encodingChecks;
  constructor(types, options, annotations, checks, encoding, context3, encodingChecks) {
    super(annotations, checks, encoding, context3);
    this.types = types;
    this.options = options;
    this.encodingChecks = encodingChecks;
  }
  /** @internal */
  getParser(compile2, compileField2) {
    const ast = this;
    const isConstructor = compileField2 !== void 0;
    const parsers = [];
    const parser = (i) => parsers[i] ??= compile2(ast.types[i]);
    let index;
    return (input, options) => {
      if (input === missing) {
        return missingExit;
      }
      const candidates = (index ??= getCandidateIndex(ast.types))(input, isConstructor);
      if (candidates.length === 0) {
        return fail6(new AnyOf(ast, [], input, options));
      }
      if (candidates.length === 1) {
        const result3 = parser(candidates[0])(input, options);
        if (result3._tag === "Success") return result3;
        return effectIsExit(result3) ? failSingleUnionCandidate(ast, result3.cause, input, options) : catchSingleUnionCandidate(ast, result3, input, options);
      }
      return parseUnionCandidates(ast, parser, candidates, input, options);
    };
  }
  _rebuild(recur, checks, encodingChecks) {
    const types = mapOrSame(this.types, recur);
    return types === this.types && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Union(types, this.options, this.annotations, checks, void 0, this.context, encodingChecks);
  }
  /** @internal */
  recur(recur) {
    return this._rebuild(recur, this.checks, this.encodingChecks);
  }
  /** @internal */
  flip(recur) {
    return this._rebuild(recur, this.encodingChecks, this.checks);
  }
  /** @internal */
  matchPart(s, options) {
    for (const type of this.types) {
      const out = type.matchPart(s, options);
      if (out !== void 0) return out;
    }
    return void 0;
  }
  /** @internal */
  getExpected(getExpected2) {
    const expected = this.annotations?.expected;
    if (typeof expected === "string") return expected;
    if (this.types.length === 0) return "never";
    const types = this.types.map((type) => {
      const encoded = toEncoded(type);
      switch (encoded._tag) {
        case "Arrays": {
          const literals = encoded.elements.filter(isLiteral);
          if (literals.length > 0) {
            return `${formatIsMutable(encoded.isMutable)}[ ${literals.map((e) => getExpected2(e) + formatIsOptional(e.context?.isOptional)).join(", ")}, ... ]`;
          }
          break;
        }
        case "Objects": {
          const literals = encoded.propertySignatures.filter((ps) => isLiteral(ps.type));
          if (literals.length > 0) {
            return `{ ${literals.map((ps) => `${formatIsMutable(ps.type.context?.isMutable)}${formatPropertyKey(ps.name)}${formatIsOptional(ps.type.context?.isOptional)}: ${getExpected2(ps.type)}`).join(", ")}, ... }`;
          }
          break;
        }
      }
      return getExpected2(encoded);
    });
    return Array.from(new Set(types)).join(" | ");
  }
};
function failSingleUnionCandidate(ast, cause, input, options) {
  const issue = getSchemaIssue(cause);
  if (!issue) return failCause2(cause);
  return fail5(new AnyOf(ast, [issue], input, options));
}
function catchSingleUnionCandidate(ast, result3, input, options) {
  return catchCause2(result3, (cause) => failSingleUnionCandidate(ast, cause, input, options));
}
function parseUnionCandidates(ast, parser, candidates, input, options) {
  const state = {
    ast,
    parser,
    input,
    out: void 0,
    successes: ast.options?.mode === "oneOf" ? [] : void 0,
    issues: void 0,
    options
  };
  const eff = parseUnion(state, candidates);
  if (!eff) {
    if (state.out) return state.out;
    return fail6(new AnyOf(ast, state.issues ?? [], input, options));
  }
  if (effectIsExit(eff)) return resumeUnion(eff, state);
  let first = true;
  return suspend2(() => {
    if (!first) return parseUnionCandidates(ast, parser, candidates, input, options);
    first = false;
    return resumeUnion(eff, state);
  });
}
function resumeUnion(eff, state) {
  return flatMapEager2(eff, (_) => {
    if (state.out === sameExit) return succeed6(state.input);
    if (state.out) return state.out;
    return fail6(new AnyOf(state.ast, state.issues ?? [], state.input, state.options));
  });
}
var parseUnion = /* @__PURE__ */ iterateEager()({
  onItem(s, i) {
    return s.parser(i)(s.input, s.options);
  },
  step(s, i, exit3) {
    if (exit3._tag === "Failure") {
      const issue = getSchemaIssue(exit3.cause);
      if (issue === void 0) {
        return exit3;
      }
      if (s.issues) s.issues.push(issue);
      else s.issues = [issue];
    } else {
      if (s.out && s.successes) {
        s.successes.push(s.ast.types[i]);
        return fail5(new OneOf(s.ast, s.successes, s.input, s.options));
      }
      s.out = exit3;
      if (s.successes) {
        s.successes.push(s.ast.types[i]);
      } else {
        return void_2;
      }
    }
  }
});
var nonFiniteLiterals = /* @__PURE__ */ new Union([/* @__PURE__ */ new Literal("Infinity"), /* @__PURE__ */ new Literal("-Infinity"), /* @__PURE__ */ new Literal("NaN")]);
function formatIsMutable(isMutable) {
  return isMutable ? "" : "readonly ";
}
function formatIsOptional(isOptional2) {
  return isOptional2 ? "?" : "";
}
var Filter2 = class extends Class {
  _tag = "Filter";
  run;
  annotations;
  /**
   * Whether the parsing process should be aborted after this check has failed.
   */
  aborted;
  constructor(run6, annotations = void 0, aborted = false) {
    super();
    this.run = run6;
    this.annotations = annotations;
    this.aborted = aborted;
  }
  annotate(annotations) {
    return new Filter2(this.run, {
      ...this.annotations,
      ...annotations
    }, this.aborted);
  }
  abort() {
    return new Filter2(this.run, this.annotations, true);
  }
  and(other, annotations) {
    return new FilterGroup([this, other], annotations);
  }
};
var FilterGroup = class extends Class {
  _tag = "FilterGroup";
  checks;
  annotations;
  constructor(checks, annotations = void 0) {
    super();
    this.checks = checks;
    this.annotations = annotations;
  }
  annotate(annotations) {
    return new FilterGroup(this.checks, {
      ...this.annotations,
      ...annotations
    });
  }
  and(other, annotations) {
    return new FilterGroup([this, other], annotations);
  }
};
function makeFilter(filter7, annotations, aborted = false) {
  return new Filter2((input, ast, options) => normalizeFilterOutput(ast, filter7(input, ast, options), input, options), annotations, aborted);
}
function isFinite2(annotations) {
  return makeFilter((n) => globalThis.Number.isFinite(n), {
    expected: "a finite number",
    representation: {
      id: "effect/schema/isFinite",
      payload: null
    },
    toJsonSchema: () => ({
      type: "number"
    }),
    toCode: () => ({
      runtime: "Schema.isFinite()"
    }),
    arbitraryConstraint: {
      number: "finite"
    },
    ...annotations
  });
}
var finite = /* @__PURE__ */ appendChecks(number2, [/* @__PURE__ */ isFinite2()]);
var numberToJson = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union([finite, nonFiniteLiterals]), /* @__PURE__ */ new Transformation(/* @__PURE__ */ Number4(), /* @__PURE__ */ transform((n) => globalThis.Number.isFinite(n) ? n : globalThis.String(n))));
function isPattern(regExp, annotations) {
  const copy3 = new globalThis.RegExp(regExp);
  const payload = {
    source: copy3.source,
    flags: copy3.flags
  };
  return makeFilter((s) => {
    copy3.lastIndex = 0;
    return copy3.test(s);
  }, {
    expected: `a string matching the RegExp ${payload.source}`,
    representation: {
      id: "effect/schema/isPattern",
      payload
    },
    // Keep the filter exportable so its JSON Schema annotations are preserved
    // when the RegExp constraint itself is omitted.
    toJsonSchema: () => [{}, true],
    arbitraryConstraint: {
      patterns: [payload]
    },
    ...annotations
  });
}
var bodyOwners = /* @__PURE__ */ new WeakMap();
function copy(ast, changes) {
  const out = Object.assign(Object.create(Object.getPrototypeOf(ast)), ast, changes);
  if (Reflect.ownKeys(changes).every((key) => key === "context" || key === "encoding")) {
    bodyOwners.set(out, getContextOwner(ast));
  }
  return out;
}
function getContextOwner(ast) {
  const existing = bodyOwners.get(ast);
  if (existing !== void 0) return existing;
  if (ast.encoding === void 0) return ast;
  const owner = Object.assign(Object.create(Object.getPrototypeOf(ast)), ast, {
    encoding: void 0
  });
  bodyOwners.set(ast, owner);
  return owner;
}
function replaceEncoding(ast, encoding) {
  return ast.encoding === encoding ? ast : copy(ast, {
    encoding
  });
}
function replaceContext(ast, context3) {
  if (ast.context === context3) {
    return ast;
  }
  const owner = getContextOwner(ast);
  if (owner.context === context3 && owner.encoding === ast.encoding) {
    return owner;
  }
  return copy(ast, {
    context: context3
  });
}
function getLastEncoding(ast) {
  return ast.encoding ? getLastEncoding(ast.encoding[ast.encoding.length - 1].to) : ast;
}
function annotate(ast, annotations) {
  if (ast.checks) {
    const last = ast.checks[ast.checks.length - 1];
    return replaceChecks(ast, append(ast.checks.slice(0, -1), last.annotate(annotations)));
  }
  return copy(ast, {
    annotations: {
      ...ast.annotations,
      ...annotations
    }
  });
}
function replaceChecks(ast, checks) {
  if (ast._tag === "Suspend" && checks) {
    throw new Error("Cannot add checks to Suspend");
  }
  if (ast.checks === checks) {
    return ast;
  }
  return copy(ast, {
    checks
  });
}
function appendChecks(ast, checks) {
  return replaceChecks(ast, combineChecks(ast.checks, checks));
}
function mapLink(link4, f) {
  const to = f(link4.to);
  return to === link4.to ? link4 : new Link(to, link4.transformation);
}
function updateLastLink(encoding, f) {
  const links = encoding;
  const last = links[links.length - 1];
  const out = mapLink(last, f);
  return out === last ? encoding : append(encoding.slice(0, encoding.length - 1), out);
}
function applyToLastLink(f) {
  return (ast) => ast.encoding ? replaceEncoding(ast, updateLastLink(ast.encoding, f)) : ast;
}
function replaceContextLastLink(ast, context3) {
  return applyToLastLink((ast2) => replaceContext(ast2, context3))(ast);
}
function applyToSelfOrLastLinkEncoding(f) {
  function out(ast) {
    return ast.encoding ? replaceEncoding(ast, updateLastLink(ast.encoding, out)) : f(ast);
  }
  return memoize(out);
}
function applyToSelfOrLastLinkEncodingIdempotent(f, options) {
  function out(ast) {
    if (ast.encoding) {
      const last = ast.encoding[ast.encoding.length - 1];
      return options?.stopAt?.(last) ? ast : replaceEncoding(ast, updateLastLink(ast.encoding, out));
    }
    return f(ast);
  }
  return memoizeIdempotent(out);
}
function appendTransformation(from, transformation, to) {
  const link4 = new Link(from, transformation);
  return replaceEncoding(to, to.encoding ? [...to.encoding, link4] : [link4]);
}
function mapOrSame(as3, f) {
  let out;
  for (let i = 0; i < as3.length; i++) {
    const a = as3[i];
    const fa = f(a);
    if (out) {
      out[i] = fa;
    } else if (fa !== a) {
      out = new Array(as3.length);
      for (let j = 0; j < i; j++) {
        out[j] = as3[j];
      }
      out[i] = fa;
    }
  }
  return out ?? as3;
}
function annotateKey(ast, annotations) {
  const context3 = ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, ast.context.constructorDefault, {
    ...ast.context.annotations,
    ...annotations
  }) : new Context(false, false, void 0, annotations);
  return replaceContext(ast, context3);
}
var optionalKey = /* @__PURE__ */ memoizeIdempotent((ast) => {
  const context3 = ast.context ? ast.context.isOptional === false ? new Context(true, ast.context.isMutable, ast.context.constructorDefault, ast.context.annotations) : ast.context : new Context(true, false);
  return optionalKeyLastLink(replaceContext(ast, context3));
});
var optionalKeyLastLink = /* @__PURE__ */ applyToLastLink(optionalKey);
var optional = /* @__PURE__ */ memoize((ast) => optionalKey(new Union([ast, undefined_2])));
function withConstructorDefault(ast, defaultValue) {
  const context3 = ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, defaultValue, ast.context.annotations) : new Context(false, false, defaultValue);
  return replaceContext(ast, context3);
}
function decodeTo(from, to, transformation) {
  return appendTransformation(from, transformation, to);
}
function parseParameter(ast) {
  const literals = [];
  const parameters = [];
  function go(ast2) {
    switch (ast2._tag) {
      case "Literal":
        if (isPropertyKey(ast2.literal) && !literals.includes(ast2.literal)) {
          literals.push(ast2.literal);
        }
        return;
      case "UniqueSymbol":
        if (!literals.includes(ast2.symbol)) {
          literals.push(ast2.symbol);
        }
        return;
      case "Never":
        return;
      case "Union":
        for (let i = 0; i < ast2.types.length; i++) {
          go(ast2.types[i]);
        }
        return;
      default:
        parameters.push(ast2);
    }
  }
  go(ast);
  return {
    literals,
    parameters
  };
}
function record(key, value3) {
  const {
    literals,
    parameters: indexSignatures
  } = parseParameter(key);
  return new Objects(literals.map((literal) => new PropertySignature(literal, value3)), indexSignatures.map((parameter) => new IndexSignature(parameter, value3)));
}
function isOptional(ast) {
  return ast.context?.isOptional ?? false;
}
function isStructuralCheck(check) {
  return check.annotations?.[STRUCTURAL_ANNOTATION_KEY] === true || check._tag === "FilterGroup" && check.checks.every(isStructuralCheck);
}
function extractStructuralChecks(checks) {
  function extract(check) {
    if (isStructuralCheck(check)) return [check];
    return check._tag === "FilterGroup" ? check.checks.flatMap(extract) : [];
  }
  const out = checks.flatMap(extract);
  return isArrayNonEmpty2(out) ? out : void 0;
}
function canPreserveEncodingChecks(ast) {
  let preserve = true;
  function visit(child) {
    preserve = preserve && !child.encoding && !isSuspend(child);
    if (preserve && "recur" in child) child.recur(visit);
    return child;
  }
  if ("recur" in ast) ast.recur(visit);
  return preserve;
}
var toType = /* @__PURE__ */ memoizeIdempotent((ast) => {
  const owner = getContextOwner(ast);
  if (owner !== ast) {
    const type2 = toType(owner);
    return type2 === owner && ast.encoding === void 0 ? ast : replaceContext(type2, ast.context);
  }
  const type = "recur" in ast ? ast.recur(toType) : ast;
  if ("encodingChecks" in type && type.encodingChecks) {
    const checks = canPreserveEncodingChecks(ast) ? type.encodingChecks : isArrays(type) || isObjects(type) || isDeclaration(type) && type.typeParameters.length > 0 ? extractStructuralChecks(type.encodingChecks) : void 0;
    return copy(type, {
      encodingChecks: void 0,
      checks: combineChecks(type.checks, checks)
    });
  }
  return type;
});
var toEncoded = /* @__PURE__ */ memoizeIdempotent((ast) => {
  return toType(flip2(ast));
});
function flipEncoding(ast, encoding) {
  const links = encoding;
  const len = links.length;
  const last = links[len - 1];
  const ls = [new Link(flip2(replaceEncoding(ast, void 0)), links[0].transformation.flip())];
  for (let i = 1; i < len; i++) {
    ls.unshift(new Link(flip2(links[i - 1].to), links[i].transformation.flip()));
  }
  const to = flip2(last.to);
  if (to.encoding) {
    return replaceEncoding(to, [...to.encoding, ...ls]);
  } else {
    return replaceEncoding(to, ls);
  }
}
var flip2 = /* @__PURE__ */ memoize((ast) => {
  if (ast.encoding) {
    return flipEncoding(ast, ast.encoding);
  }
  const owner = getContextOwner(ast);
  if (owner !== ast) {
    const flipped = flip2(owner);
    return flipped === owner ? ast : replaceContext(flipped, ast.context);
  }
  return "flip" in ast ? ast.flip(flip2) : "recur" in ast ? ast.recur(flip2) : ast;
});
function containsUndefined(ast) {
  switch (ast._tag) {
    case "Undefined":
      return true;
    case "Union":
      return ast.types.some(containsUndefined);
    default:
      return false;
  }
}
function fromConst(ast, value3) {
  const succeed10 = value3 === 0 ? sameExit : succeed8(value3);
  return (input, options) => {
    if (input === missing) return missingExit;
    if (input === value3) return succeed10;
    return fail6(new InvalidType(ast, input, options));
  };
}
function fromRefinement(ast, refinement) {
  return (input, options) => {
    if (input === missing) return missingExit;
    if (refinement(input)) return sameExit;
    return fail6(new InvalidType(ast, input, options));
  };
}
var parameterFromPropertyKey = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  switch (ast._tag) {
    default:
      return ast;
    case "Number":
      return ast.toCodecStringTree();
    case "Union":
      return ast.recur(parameterFromPropertyKey);
  }
});
var parameterFromString = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  switch (ast._tag) {
    default:
      return ast;
    case "Symbol":
    case "UniqueSymbol":
      return ast.toCodecStringTree();
    case "Union":
      return ast.recur(parameterFromString);
  }
});
var isStringFiniteRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${FINITE_PATTERN}$`);
var isStringNumberRegExp = /* @__PURE__ */ new globalThis.RegExp(`^(?:${FINITE_PATTERN}|Infinity|-Infinity|NaN)$`);
function isStringFinite(annotations) {
  return isPattern(isStringFiniteRegExp, {
    expected: "a string representing a finite number",
    representation: {
      id: "effect/schema/isStringFinite",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: isStringFiniteRegExp.source
    }),
    ...annotations
  });
}
var finiteString = /* @__PURE__ */ appendChecks(string2, [/* @__PURE__ */ isStringFinite()]);
var finiteToString = /* @__PURE__ */ new Link(finiteString, numberFromString);
var numberToString = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union([finiteString, nonFiniteLiterals]), numberFromString);
var BIGINT_PATTERN = "-?\\d+";
var isStringBigIntRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${BIGINT_PATTERN}$`);
var REGEXP_PATTERN = "Symbol\\(([\\s\\S]*)\\)";
var isStringSymbolRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${REGEXP_PATTERN}$`);
function collectIssues(checks, value3, issues, ast, options) {
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    if (check._tag === "FilterGroup") {
      issues = collectIssues(check.checks, value3, issues, ast, options);
      if (issues && (options.errors !== "all" || issues[issues.length - 1].filter.aborted)) {
        return issues;
      }
    } else {
      const issue = check.run(value3, ast, options);
      if (issue) {
        const filter7 = new Filter(check, issue, value3, options);
        if (issues) issues.push(filter7);
        else issues = [filter7];
        if (options.errors !== "all" || check.aborted) {
          return issues;
        }
      }
    }
  }
  return issues;
}
function getConstructorDescriptor(ast) {
  if (!isDeclaration(ast)) return void 0;
  const getDescriptor = ast.annotations?.[CONSTRUCTOR_ANNOTATION_KEY];
  return isFunction(getDescriptor) ? getDescriptor(ast.typeParameters) : void 0;
}
function isJsonLeaf(u) {
  return u === null || typeof u === "string" || typeof u === "boolean" || typeof u === "number" && globalThis.Number.isFinite(u);
}
function isStringTreeLeaf(u) {
  return u === void 0 || typeof u === "string";
}
function isTree(u, isLeaf) {
  const cache2 = /* @__PURE__ */ new WeakMap();
  const stack = [];
  outer: while (true) {
    if (typeof u !== "object" || u === null) {
      if (!isLeaf(u)) {
        return false;
      }
    } else {
      const value3 = u;
      const cached2 = cache2.get(value3);
      if (cached2 === false) {
        return false;
      }
      if (cached2 === void 0) {
        const isArray2 = Array.isArray(value3);
        if (!isArray2) {
          const prototype = Object.getPrototypeOf(value3);
          if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
            return false;
          }
        }
        cache2.set(value3, false);
        stack.push({
          value: value3,
          keys: isArray2 ? value3.length : Object.keys(value3),
          index: 0
        });
      }
    }
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const keys = frame.keys;
      if (typeof keys === "number") {
        if (frame.index < keys) {
          u = frame.value[frame.index++];
          continue outer;
        }
      } else if (frame.index < keys.length) {
        u = frame.value[keys[frame.index++]];
        continue outer;
      }
      cache2.set(frame.value, true);
      stack.pop();
    }
    return true;
  }
}
function isJson(u) {
  return isTree(u, isJsonLeaf);
}
var Json = /* @__PURE__ */ new Declaration([], () => (input, ast, options) => isJson(input) ? sameExit : fail6(new InvalidType(ast, input, options)), {
  representation: {
    id: "effect/schema/Json",
    payload: null
  },
  expected: "JSON value",
  toCodecJson: () => void 0,
  toCodecStringTree: () => unknownToStringTree
});
function isStringTree(u) {
  return isTree(u, isStringTreeLeaf);
}
var StringTree = /* @__PURE__ */ new Declaration([], () => (input, ast, options) => isStringTree(input) ? sameExit : fail6(new InvalidType(ast, input, options)), {
  expected: "StringTree",
  toCodecStringTree: () => void 0
});
var unknownToStringTree = /* @__PURE__ */ new Link(StringTree, /* @__PURE__ */ passthrough2());

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Brand.js
function nominal() {
  return Object.assign((input) => input, {
    option: (input) => some2(input),
    result: (input) => succeed2(input),
    is: (_) => true
  });
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/process/ChildProcessSpawner.js
var ExitCode = /* @__PURE__ */ nominal();
var ProcessId = /* @__PURE__ */ nominal();
var HandleTypeId = "~effect/process/ChildProcessSpawner/ChildProcessHandle";
var HandleProto = {
  [HandleTypeId]: HandleTypeId,
  ...BaseProto,
  toJSON() {
    return {
      _id: "ChildProcessHandle",
      pid: this.pid
    };
  }
};
var makeHandle = (params) => Object.setPrototypeOf({
  ...params
}, HandleProto);
var make12 = (spawn2) => {
  const streamString = (command, options) => spawn2(command).pipe(map5((handle) => decodeText(options?.includeStderr === true ? handle.all : handle.stdout)), unwrap4);
  const streamLines = (command, options) => splitLines2(streamString(command, options));
  return ChildProcessSpawner.of({
    spawn: spawn2,
    exitCode: (command) => scoped2(flatMap4(spawn2(command), (handle) => handle.exitCode)),
    streamString,
    streamLines,
    lines: (command, options) => runCollect(streamLines(command, options)),
    string: (command, options) => mkString(streamString(command, options))
  });
};
var ChildProcessSpawner = class extends (/* @__PURE__ */ Service()("effect/process/ChildProcessSpawner")) {
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/process/ChildProcess.js
var TypeId20 = "~effect/process/ChildProcess";
var Proto2 = {
  .../* @__PURE__ */ Prototype2({
    label: "Command",
    evaluate(fiber2) {
      return getUnsafe(fiber2.context, ChildProcessSpawner).spawn(this);
    }
  }),
  [TypeId20]: TypeId20
};
var makeStandardCommand = (command, args2, options) => Object.assign(Object.create(Proto2), {
  _tag: "StandardCommand",
  command,
  args: args2,
  options
});
var make13 = function make14(...args2) {
  if (isTemplateString(args2[0])) {
    const [templates, ...expressions] = args2;
    const tokens = parseTemplates(templates, expressions);
    return makeStandardCommand(tokens[0] ?? "", tokens.slice(1), {});
  }
  if (typeof args2[0] === "object" && !Array.isArray(args2[0]) && !isTemplateString(args2[0])) {
    const options2 = args2[0];
    return function(templates, ...expressions) {
      const tokens = parseTemplates(templates, expressions);
      return makeStandardCommand(tokens[0] ?? "", tokens.slice(1), options2);
    };
  }
  if (typeof args2[0] === "string" && !Array.isArray(args2[1])) {
    const [command2, options2 = {}] = args2;
    return makeStandardCommand(command2, [], options2);
  }
  const [command, cmdArgs = [], options = {}] = args2;
  return makeStandardCommand(command, cmdArgs, options);
};
var isTemplateString = (u) => Array.isArray(u) && "raw" in u && Array.isArray(u.raw);
var parseFdName = (name) => {
  const match7 = /^fd(\d+)$/.exec(name);
  if (match7 === null) return void 0;
  const fd = parseInt(match7[1], 10);
  return fd >= 3 ? fd : void 0;
};
var fdName = (fd) => `fd${fd}`;
var parseTemplates = (templates, expressions) => {
  let tokens = [];
  for (const [index, template] of templates.entries()) {
    tokens = parseTemplate(templates, expressions, tokens, template, index);
  }
  return tokens;
};
var parseTemplate = (templates, expressions, prevTokens, template, index) => {
  const rawTemplate = templates.raw[index];
  if (rawTemplate === void 0) {
    throw new Error(`Invalid backslash sequence: ${templates.raw[index]}`);
  }
  const {
    hasLeadingWhitespace,
    hasTrailingWhitespace,
    tokens
  } = splitByWhitespaces(template, rawTemplate);
  const nextTokens = concatTokens(prevTokens, tokens, hasLeadingWhitespace);
  if (index === expressions.length) {
    return nextTokens;
  }
  const expression = expressions[index];
  const expressionTokens = Array.isArray(expression) ? expression.map((expression2) => parseExpression(expression2)) : [parseExpression(expression)];
  return concatTokens(nextTokens, expressionTokens, hasTrailingWhitespace);
};
var parseExpression = (expression) => {
  const type = typeof expression;
  if (type === "string") {
    return expression;
  }
  return String(expression);
};
var DELIMITERS = /* @__PURE__ */ new Set([" ", "	", "\r", "\n"]);
var ESCAPE_LENGTH = {
  x: 3,
  u: 5
};
var splitByWhitespaces = (template, rawTemplate) => {
  if (rawTemplate.length === 0) {
    return {
      tokens: [],
      hasLeadingWhitespace: false,
      hasTrailingWhitespace: false
    };
  }
  const hasLeadingWhitespace = DELIMITERS.has(rawTemplate[0]);
  const tokens = [];
  let templateCursor = 0;
  for (let templateIndex = 0, rawIndex = 0; templateIndex < template.length; templateIndex += 1, rawIndex += 1) {
    const rawCharacter = rawTemplate[rawIndex];
    if (DELIMITERS.has(rawCharacter)) {
      if (templateCursor !== templateIndex) {
        tokens.push(template.slice(templateCursor, templateIndex));
      }
      templateCursor = templateIndex + 1;
    } else if (rawCharacter === "\\") {
      const nextRawCharacter = rawTemplate[rawIndex + 1];
      if (nextRawCharacter === "\n") {
        templateIndex -= 1;
        rawIndex += 1;
      } else if (nextRawCharacter === "u" && rawTemplate[rawIndex + 2] === "{") {
        const end = rawTemplate.indexOf("}", rawIndex + 3);
        if (parseInt(rawTemplate.slice(rawIndex + 3, end), 16) > 65535) {
          templateIndex += 1;
        }
        rawIndex = end;
      } else {
        rawIndex += ESCAPE_LENGTH[nextRawCharacter] ?? 1;
      }
    }
  }
  const hasTrailingWhitespace = templateCursor === template.length;
  if (!hasTrailingWhitespace) {
    tokens.push(template.slice(templateCursor));
  }
  return {
    tokens,
    hasLeadingWhitespace,
    hasTrailingWhitespace
  };
};
var concatTokens = (prevTokens, nextTokens, isSeparated) => isSeparated || prevTokens.length === 0 || nextTokens.length === 0 ? [...prevTokens, ...nextTokens] : [...prevTokens.slice(0, -1), `${prevTokens.at(-1)}${nextTokens.at(0)}`, ...nextTokens.slice(1)];

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodeChildProcessSpawner.js
import * as NodeChildProcess from "node:child_process";
import { PassThrough } from "node:stream";

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/internal/nodeChildProcessSpawner.js
var buildSpawnOptions = (options, base, platform) => {
  const detached = options.detached ?? platform !== "win32";
  return {
    ...base,
    detached,
    shell: options.shell,
    windowsHide: options.windowsHide ?? !detached
  };
};

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/internal/utils.js
var handleErrnoException = (module, method) => (err, [path]) => {
  let reason = "Unknown";
  switch (err.code) {
    case "ENOENT":
      reason = "NotFound";
      break;
    case "EACCES":
      reason = "PermissionDenied";
      break;
    case "EEXIST":
      reason = "AlreadyExists";
      break;
    case "EISDIR":
      reason = "BadResource";
      break;
    case "ENOTDIR":
      reason = "BadResource";
      break;
    case "EBUSY":
      reason = "Busy";
      break;
    case "ELOOP":
      reason = "BadResource";
      break;
  }
  return systemError({
    _tag: reason,
    module,
    method,
    pathOrDescriptor: path,
    syscall: err.syscall,
    cause: err
  });
};

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodeSink.js
var fromWritable = (options) => fromChannel2(mapDone(fromWritableChannel(options), (_) => [_]));
var fromWritableChannel = (options) => fromTransform((pull) => {
  const writable = options.evaluate();
  return succeed6(pullIntoWritable({
    ...options,
    writable,
    pull
  }));
});
var pullIntoWritable = (options) => options.pull.pipe(flatMap4((chunk) => {
  let i = 0;
  return callback2((resume) => {
    let cancelled = false;
    const loop = () => {
      for (; i < chunk.length; ) {
        if (cancelled) {
          return;
        }
        const success = options.writable.write(chunk[i++], options.encoding);
        if (!success) {
          if (!cancelled) {
            options.writable.once("drain", loop);
          }
          return;
        }
      }
      if (!cancelled) {
        resume(void_3);
      }
    };
    loop();
    return sync2(() => {
      cancelled = true;
      options.writable.off("drain", loop);
    });
  });
}), forever2({
  disableYield: true
}), options.endOnDone !== false ? catchDone((_) => {
  if ("closed" in options.writable && options.writable.closed) {
    return done2(_);
  }
  return callback2((resume) => {
    const onFinish = () => resume(done2(_));
    options.writable.once("finish", onFinish);
    options.writable.end();
    return sync2(() => {
      options.writable.off("finish", onFinish);
    });
  });
}) : identity, raceFirst2(callback2((resume) => {
  const onError4 = (error2) => resume(fail6(options.onError(error2)));
  options.writable.once("error", onError4);
  return sync2(() => {
    options.writable.off("error", onError4);
  });
})));

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodeStream.js
var fromReadable = (options) => fromChannel3(fromReadableChannel(options));
var fromReadableChannel = (options) => fromTransform((_, scope3) => readableToPullUnsafe({
  scope: scope3,
  readable: options.evaluate(),
  onError: options.onError ?? defaultOnError,
  chunkSize: options.chunkSize,
  closeOnDone: options.closeOnDone
}));
var readableToPullUnsafe = (options) => {
  const readable = options.readable;
  const closeOnDone = options.closeOnDone ?? true;
  const exit3 = options.exit ?? make6(void 0);
  const latch = options.latch ?? makeUnsafe4(false);
  function onReadable() {
    latch.openUnsafe();
  }
  function onError4(error2) {
    exit3.current = fail5(options.onError(error2));
    latch.openUnsafe();
  }
  function onEnd2() {
    exit3.current = fail5(Done2());
    latch.openUnsafe();
  }
  readable.on("readable", onReadable);
  readable.once("error", onError4);
  readable.once("end", onEnd2);
  const pull = suspend2(function loop() {
    let item = options.readable.read(options.chunkSize);
    if (item === null) {
      if (exit3.current) {
        return exit3.current;
      }
      if (readable.readableEnded) {
        return fail6(Done2());
      }
      latch.closeUnsafe();
      return flatMap4(latch.await, loop);
    }
    const chunk = of(item);
    while (true) {
      item = options.readable.read(options.chunkSize);
      if (item === null) break;
      chunk.push(item);
    }
    return succeed6(chunk);
  });
  return as2(addFinalizer2(options.scope, sync2(() => {
    readable.off("readable", onReadable);
    readable.off("error", onError4);
    readable.off("end", onEnd2);
    if (closeOnDone && "closed" in options.readable && !options.readable.closed) {
      options.readable.destroy();
    }
  })), pull);
};
var defaultOnError = (error2) => new UnknownError2(error2);

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodeChildProcessSpawner.js
var toError = (error2) => error2 instanceof globalThis.Error ? error2 : new globalThis.Error(String(error2));
var toPlatformError = (method, error2, command) => {
  const {
    commands
  } = flattenCommand(command);
  const commandStr = commands.reduce((acc, curr) => {
    const cmd = `${curr.command} ${curr.args.join(" ")}`;
    return acc.length === 0 ? cmd : `${acc} | ${cmd}`;
  }, "");
  return handleErrnoException("ChildProcess", method)(error2, [commandStr]);
};
var processGroupGraceMillis = 1e3;
var processGroupPollIntervalMillis = 10;
var isProcessAlive = (childProcess, exitSignal) => {
  if (!isDoneUnsafe(exitSignal)) {
    return true;
  }
  if (globalThis.process.platform === "win32") {
    return false;
  }
  try {
    globalThis.process.kill(-childProcess.pid, 0);
    return true;
  } catch {
    return false;
  }
};
var taskkill = (childProcess, onExit4 = () => {
}) => NodeChildProcess.execFile("taskkill", ["/pid", String(childProcess.pid), "/T", "/F"], {
  windowsHide: true
}, onExit4);
var make15 = /* @__PURE__ */ gen2(function* () {
  const fs = yield* FileSystem;
  const path = yield* Path;
  const resolveWorkingDirectory = fnUntraced2(function* (options) {
    if (isUndefined(options.cwd)) return void 0;
    yield* fs.access(options.cwd);
    return path.resolve(options.cwd);
  });
  const resolveEnvironment = (options) => {
    return options.extendEnv ? {
      ...globalThis.process.env,
      ...options.env
    } : options.env;
  };
  const inputToStdioOption = (input) => isStream(input) ? "pipe" : input;
  const outputToStdioOption = (input) => isSink(input) ? "pipe" : input;
  const resolveStdinOption = (options) => {
    const defaultConfig = {
      stream: "pipe",
      encoding: "utf-8",
      endOnDone: true
    };
    if (isUndefined(options.stdin)) {
      return defaultConfig;
    }
    if (typeof options.stdin === "string") {
      return {
        ...defaultConfig,
        stream: options.stdin
      };
    }
    if (isStream(options.stdin)) {
      return {
        ...defaultConfig,
        stream: options.stdin
      };
    }
    return {
      stream: options.stdin.stream,
      encoding: options.stdin.encoding ?? defaultConfig.encoding,
      endOnDone: options.stdin.endOnDone ?? defaultConfig.endOnDone
    };
  };
  const resolveOutputOption = (options, streamName) => {
    const option2 = options[streamName];
    if (isUndefined(option2)) {
      return {
        stream: "pipe"
      };
    }
    if (typeof option2 === "string") {
      return {
        stream: option2
      };
    }
    if (isSink(option2)) {
      return {
        stream: option2
      };
    }
    return {
      stream: option2.stream
    };
  };
  const resolveAdditionalFds = (options) => {
    if (isUndefined(options.additionalFds)) {
      return [];
    }
    const result3 = [];
    for (const [name, config] of Object.entries(options.additionalFds)) {
      const fd = parseFdName(name);
      if (isNotUndefined(fd)) {
        result3.push({
          fd,
          config
        });
      }
    }
    return result3.sort((a, b) => a.fd - b.fd);
  };
  const buildStdioArray = (stdinConfig, stdoutConfig, stderrConfig, additionalFds) => {
    const stdio = [inputToStdioOption(stdinConfig.stream), outputToStdioOption(stdoutConfig.stream), outputToStdioOption(stderrConfig.stream)];
    if (additionalFds.length === 0) {
      return stdio;
    }
    const maxFd = additionalFds.reduce((max, {
      fd
    }) => Math.max(max, fd), 2);
    for (let i = 3; i <= maxFd; i++) {
      stdio[i] = "ignore";
    }
    for (const {
      fd
    } of additionalFds) {
      stdio[fd] = "pipe";
    }
    return stdio;
  };
  const setupAdditionalFds = fnUntraced2(function* (command, childProcess, additionalFds) {
    if (additionalFds.length === 0) {
      return {
        getInputFd: () => drain,
        getOutputFd: () => empty4
      };
    }
    const inputSinks = /* @__PURE__ */ new Map();
    const outputStreams = /* @__PURE__ */ new Map();
    for (const {
      config,
      fd
    } of additionalFds) {
      const nodeStream = childProcess.stdio[fd];
      switch (config.type) {
        case "input": {
          let sink = drain;
          if (nodeStream && "write" in nodeStream) {
            sink = fromWritable({
              evaluate: () => nodeStream,
              onError: (error2) => toPlatformError(`fromWritable(fd${fd})`, toError(error2), command)
            });
          }
          if (config.stream) {
            yield* forkScoped2(run(config.stream, sink));
          }
          inputSinks.set(fd, sink);
          break;
        }
        case "output": {
          let stream = empty4;
          if (nodeStream && "read" in nodeStream) {
            const passThrough = new PassThrough();
            nodeStream.on("error", (error2) => passThrough.destroy(error2));
            nodeStream.pipe(passThrough);
            stream = fromReadable({
              evaluate: () => passThrough,
              onError: (error2) => toPlatformError(`fromReadable(fd${fd})`, toError(error2), command)
            });
          }
          if (config.sink) {
            stream = transduce(stream, config.sink);
          }
          outputStreams.set(fd, stream);
          break;
        }
      }
    }
    return {
      getInputFd: (fd) => inputSinks.get(fd) ?? drain,
      getOutputFd: (fd) => outputStreams.get(fd) ?? empty4
    };
  });
  const setupChildStdin = (command, childProcess, config) => suspend2(() => {
    let sink = drain;
    if (isNotNull(childProcess.stdin)) {
      sink = fromWritable({
        evaluate: () => childProcess.stdin,
        onError: (error2) => toPlatformError("fromWritable(stdin)", toError(error2), command),
        endOnDone: config.endOnDone,
        encoding: config.encoding
      });
    }
    if (isStream(config.stream)) {
      return as2(forkScoped2(run(config.stream, sink)), sink);
    }
    return succeed6(sink);
  });
  const setupChildOutputStreams = (command, childProcess, stdoutConfig, stderrConfig) => {
    let stdout = childProcess.stdout ? (() => {
      const passThrough = new PassThrough();
      childProcess.stdout.on("error", (error2) => passThrough.destroy(error2));
      childProcess.stdout.pipe(passThrough);
      return fromReadable({
        evaluate: () => passThrough,
        onError: (error2) => toPlatformError("fromReadable(stdout)", toError(error2), command)
      });
    })() : empty4;
    let stderr = childProcess.stderr ? (() => {
      const passThrough = new PassThrough();
      childProcess.stderr.on("error", (error2) => passThrough.destroy(error2));
      childProcess.stderr.pipe(passThrough);
      return fromReadable({
        evaluate: () => passThrough,
        onError: (error2) => toPlatformError("fromReadable(stderr)", toError(error2), command)
      });
    })() : empty4;
    if (isSink(stdoutConfig.stream)) {
      stdout = transduce(stdout, stdoutConfig.stream);
    }
    if (isSink(stderrConfig.stream)) {
      stderr = transduce(stderr, stderrConfig.stream);
    }
    const all4 = merge3(stdout, stderr);
    return {
      stdout,
      stderr,
      all: all4
    };
  };
  const spawn2 = (command, spawnOptions) => callback2((resume) => {
    const deferred = makeUnsafe2();
    const handle = NodeChildProcess.spawn(command.command, command.args, spawnOptions);
    handle.on("error", (error2) => {
      resume(fail6(toPlatformError("spawn", error2, command)));
    });
    handle.on("exit", (...args2) => {
      doneUnsafe(deferred, succeed4(args2));
    });
    handle.on("spawn", () => {
      resume(succeed6([handle, deferred]));
    });
    return sync2(() => {
      handle.kill("SIGTERM");
    });
  });
  const killProcessGroup = (command, childProcess, signal) => {
    if (globalThis.process.platform === "win32") {
      return callback2((resume) => {
        taskkill(childProcess, (error2) => {
          if (error2) {
            resume(fail6(toPlatformError("kill", toError(error2), command)));
          } else {
            resume(void_3);
          }
        });
      });
    }
    return try_2({
      try: () => {
        globalThis.process.kill(-childProcess.pid, signal);
      },
      catch: (error2) => toPlatformError("kill", toError(error2), command)
    });
  };
  const killProcessGroupOnExit = (childProcess, signal) => {
    if (globalThis.process.platform === "win32") {
      taskkill(childProcess);
      return;
    }
    try {
      globalThis.process.kill(-childProcess.pid, signal);
    } catch {
    }
  };
  const killProcess = (command, childProcess, signal) => suspend2(() => {
    const killed = childProcess.kill(signal);
    if (!killed) {
      const error2 = new globalThis.Error("Failed to kill child process");
      return fail6(toPlatformError("kill", error2, command));
    }
    return void_3;
  });
  const awaitProcessExit = (childProcess, exitSignal, timeoutMillis) => callback2((resume) => {
    const deadline = Date.now() + timeoutMillis;
    let timer;
    const stop = () => {
      clearTimeout(timer);
      childProcess.removeListener("exit", poll2);
    };
    const poll2 = () => {
      clearTimeout(timer);
      if (Date.now() >= deadline || !isProcessAlive(childProcess, exitSignal)) {
        stop();
        resume(void_3);
        return;
      }
      timer = setTimeout(poll2, processGroupPollIntervalMillis);
    };
    childProcess.on("exit", poll2);
    poll2();
    return sync2(stop);
  });
  const terminateProcessGroup = fnUntraced2(function* (command, childProcess, exitSignal, options) {
    const signalGroup = (signal) => killProcessGroup(command, childProcess, signal).pipe(catch_2(() => killProcess(command, childProcess, signal)));
    yield* signalGroup(options?.killSignal ?? "SIGTERM");
    if (isUndefined(options?.forceKillAfter)) {
      yield* awaitProcessExit(childProcess, exitSignal, processGroupGraceMillis);
    } else {
      yield* awaitProcessExit(childProcess, exitSignal, toMillis(options.forceKillAfter));
      if (isProcessAlive(childProcess, exitSignal)) {
        yield* signalGroup("SIGKILL");
        yield* awaitProcessExit(childProcess, exitSignal, processGroupGraceMillis);
      }
    }
    yield* _await(exitSignal);
  });
  const getSourceStream = (handle, from) => {
    const fromOption3 = from ?? "stdout";
    switch (fromOption3) {
      case "stdout":
        return handle.stdout;
      case "stderr":
        return handle.stderr;
      case "all":
        return handle.all;
      default: {
        const fd = parseFdName(fromOption3);
        if (isNotUndefined(fd)) {
          return handle.getOutputFd(fd);
        }
        return handle.stdout;
      }
    }
  };
  const spawnCommand = fnUntraced2(function* (cmd) {
    switch (cmd._tag) {
      case "StandardCommand": {
        const stdinConfig = resolveStdinOption(cmd.options);
        const stdoutConfig = resolveOutputOption(cmd.options, "stdout");
        const stderrConfig = resolveOutputOption(cmd.options, "stderr");
        const resolvedAdditionalFds = resolveAdditionalFds(cmd.options);
        let isReferenced = true;
        const cwd = yield* resolveWorkingDirectory(cmd.options);
        const env = resolveEnvironment(cmd.options);
        const stdio = buildStdioArray(stdinConfig, stdoutConfig, stderrConfig, resolvedAdditionalFds);
        const [childProcess, exitSignal] = yield* acquireRelease2(spawn2(cmd, buildSpawnOptions(cmd.options, {
          cwd,
          env,
          stdio
        }, process.platform)), fnUntraced2(function* ([childProcess2, exitSignal2]) {
          const exited = yield* isDone3(exitSignal2);
          if (exited) {
            const [code] = yield* _await(exitSignal2);
            if (code !== 0 && isNotNull(code)) {
              yield* ignore2(terminateProcessGroup(cmd, childProcess2, exitSignal2, cmd.options));
            } else if (isReferenced && process.platform !== "win32" && cmd.options.detached !== false) {
              yield* ignore2(terminateProcessGroup(cmd, childProcess2, exitSignal2, cmd.options));
            }
            return;
          }
          if (!isReferenced) {
            return;
          }
          yield* ignore2(terminateProcessGroup(cmd, childProcess2, exitSignal2, cmd.options));
        }));
        const pid = ProcessId(childProcess.pid);
        childProcess.on("exit", (code) => {
          if (code !== 0 && isNotNull(code)) {
            killProcessGroupOnExit(childProcess, cmd.options.killSignal ?? "SIGTERM");
          }
        });
        const reref = sync2(() => {
          if (!isReferenced) {
            childProcess.ref();
            isReferenced = true;
          }
        });
        const unref = sync2(() => {
          if (isReferenced) {
            childProcess.unref();
            isReferenced = false;
          }
          return reref;
        });
        const stdin = yield* setupChildStdin(cmd, childProcess, stdinConfig);
        const {
          all: all4,
          stderr,
          stdout
        } = setupChildOutputStreams(cmd, childProcess, stdoutConfig, stderrConfig);
        const {
          getInputFd,
          getOutputFd
        } = yield* setupAdditionalFds(cmd, childProcess, resolvedAdditionalFds);
        const isRunning = map5(isDone3(exitSignal), (done3) => !done3);
        const exitCode = flatMap4(_await(exitSignal), ([code, signal]) => {
          if (isNotNull(code)) {
            return succeed6(ExitCode(code));
          }
          const error2 = new globalThis.Error(`Process interrupted due to receipt of signal: '${signal}'`);
          return fail6(toPlatformError("exitCode", error2, cmd));
        });
        const kill = (options) => terminateProcessGroup(cmd, childProcess, exitSignal, options);
        return makeHandle({
          pid,
          exitCode,
          isRunning,
          kill,
          stdin,
          stdout,
          stderr,
          all: all4,
          getInputFd,
          getOutputFd,
          unref
        });
      }
      case "PipedCommand": {
        const {
          commands,
          pipeOptions
        } = flattenCommand(cmd);
        const [root, ...pipeline] = commands;
        const handles = [yield* spawnCommand(root)];
        for (let i = 0; i < pipeline.length; i++) {
          const command = pipeline[i];
          const options = pipeOptions[i] ?? {};
          const stdinConfig = resolveStdinOption(command.options);
          const sourceStream = unwrap4(succeed6(getSourceStream(handles[handles.length - 1], options.from)));
          const toOption2 = options.to ?? "stdin";
          if (toOption2 === "stdin") {
            handles.push(yield* spawnCommand(make13(command.command, command.args, {
              ...command.options,
              stdin: {
                ...stdinConfig,
                stream: sourceStream
              }
            })));
          } else {
            const fd = parseFdName(toOption2);
            if (isNotUndefined(fd)) {
              const fdName2 = fdName(fd);
              const existingFds = command.options.additionalFds ?? {};
              handles.push(yield* spawnCommand(make13(command.command, command.args, {
                ...command.options,
                additionalFds: {
                  ...existingFds,
                  [fdName2]: {
                    type: "input",
                    stream: sourceStream
                  }
                }
              })));
            } else {
              handles.push(yield* spawnCommand(make13(command.command, command.args, {
                ...command.options,
                stdin: {
                  ...stdinConfig,
                  stream: sourceStream
                }
              })));
            }
          }
        }
        const handle = handles[handles.length - 1];
        const kill = (options) => forEach2([...handles].reverse(), (handle2) => ignore2(handle2.kill(options)), {
          discard: true
        });
        const unref = gen2(function* () {
          const rerefs = [];
          for (const handle2 of handles) {
            rerefs.push(yield* handle2.unref);
          }
          return forEach2([...rerefs].reverse(), (reref) => reref, {
            discard: true
          });
        });
        return makeHandle({
          pid: handle.pid,
          exitCode: handle.exitCode,
          isRunning: handle.isRunning,
          kill,
          stdin: handles[0].stdin,
          stdout: handle.stdout,
          stderr: handle.stderr,
          all: handle.all,
          getInputFd: handle.getInputFd,
          getOutputFd: handle.getOutputFd,
          unref
        });
      }
    }
  });
  return make12(spawnCommand);
});
var layer = /* @__PURE__ */ effect(ChildProcessSpawner, make15);
var flattenCommand = (command) => {
  const commands = [];
  const pipeOptions = [];
  const flatten5 = (cmd) => {
    switch (cmd._tag) {
      case "StandardCommand": {
        commands.push(cmd);
        break;
      }
      case "PipedCommand": {
        flatten5(cmd.left);
        pipeOptions.push(cmd.options);
        flatten5(cmd.right);
        break;
      }
    }
  };
  flatten5(command);
  if (commands.length === 0) {
    throw new Error("flattenCommand produced empty commands array");
  }
  const [first, ...rest] = commands;
  const nonEmptyCommands = [first, ...rest];
  return {
    commands: nonEmptyCommands,
    pipeOptions
  };
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/ulid.js
var maxTimestamp = 2 ** 48 - 1;
var base32Chars = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
var ulidString = (timestampMillis, bytes2) => {
  if (bytes2.length !== 10) {
    throw new Error(`ULID randomness must be exactly 10 bytes, received ${bytes2.length}`);
  }
  const timestamp = Math.min(Math.max(0, Math.trunc(timestampMillis)), maxTimestamp);
  let out = "";
  for (let shift = 45; shift >= 0; shift -= 5) {
    out += base32Chars[Math.floor(timestamp / 2 ** shift) & 31];
  }
  let accumulator = 0;
  let bits = 0;
  for (const byte of bytes2) {
    accumulator = accumulator << 8 | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += base32Chars[accumulator >>> bits & 31];
    }
    accumulator &= (1 << bits) - 1;
  }
  return out;
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/uuid.js
var hex = (byte) => byte.toString(16).padStart(2, "0");
var stringify = (bytes2) => {
  const segments = [bytes2.subarray(0, 4), bytes2.subarray(4, 6), bytes2.subarray(6, 8), bytes2.subarray(8, 10), bytes2.subarray(10, 16)];
  return segments.map((segment) => Array.from(segment, hex).join("")).join("-");
};
var randomBytes = () => globalThis.crypto.getRandomValues(new Uint8Array(16));
function v4Bytes(bytes2 = randomBytes()) {
  bytes2[6] = bytes2[6] & 15 | 64;
  bytes2[8] = bytes2[8] & 63 | 128;
  return bytes2;
}
var v4String = (bytes2) => stringify(bytes2 === void 0 ? v4Bytes() : v4Bytes(bytes2));
var maxV7Timestamp = 2 ** 48 - 1;
function v7Bytes(timestampMillis, bytes2 = randomBytes()) {
  const timestamp = Math.min(Math.max(0, Math.trunc(timestampMillis)), maxV7Timestamp);
  bytes2[0] = Math.floor(timestamp / 2 ** 40);
  bytes2[1] = Math.floor(timestamp / 2 ** 32) & 255;
  bytes2[2] = Math.floor(timestamp / 2 ** 24) & 255;
  bytes2[3] = Math.floor(timestamp / 2 ** 16) & 255;
  bytes2[4] = Math.floor(timestamp / 2 ** 8) & 255;
  bytes2[5] = timestamp & 255;
  bytes2[6] = bytes2[6] & 15 | 112;
  bytes2[8] = bytes2[8] & 63 | 128;
  return bytes2;
}
var v7String = (timestampMillis, bytes2) => stringify(bytes2 === void 0 ? v7Bytes(timestampMillis) : v7Bytes(timestampMillis, bytes2));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Crypto.js
var TypeId21 = "~effect/Crypto";
var Crypto = /* @__PURE__ */ Service("effect/Crypto");
var make16 = (impl) => {
  const randomBytesUnsafe = impl.randomBytes;
  const randomBytes4 = (size) => map5(validateSize("randomBytes", size), randomBytesUnsafe);
  const readUint53 = (bytes2) => (bytes2[0] & 31) * 2 ** 48 + bytes2[1] * 2 ** 40 + bytes2[2] * 2 ** 32 + bytes2[3] * 2 ** 24 + bytes2[4] * 2 ** 16 + bytes2[5] * 2 ** 8 + bytes2[6];
  const nextDoubleUnsafe = () => readUint53(randomBytesUnsafe(7)) / 2 ** 53;
  const nextIntUnsafe = () => {
    while (true) {
      const bytes2 = randomBytesUnsafe(7);
      const value3 = readUint53(bytes2);
      if ((bytes2[0] & 32) === 0) {
        return value3 + Number.MIN_SAFE_INTEGER;
      }
      if (value3 < Number.MAX_SAFE_INTEGER) {
        return value3 + 1;
      }
    }
  };
  return Crypto.of({
    [TypeId21]: TypeId21,
    randomBytes: randomBytes4,
    nextDoubleUnsafe,
    nextIntUnsafe,
    digest: impl.digest,
    random: sync2(() => nextDoubleUnsafe()),
    randomBoolean: sync2(() => nextDoubleUnsafe() > 0.5),
    randomInt: sync2(() => nextIntUnsafe()),
    randomBetween: (min, max) => sync2(() => nextBetween(min, max, nextDoubleUnsafe())),
    randomIntBetween(min, max, options) {
      const extra = options?.halfOpen === true ? 0 : 1;
      return sync2(() => {
        const minInt = Math.ceil(min);
        const maxInt = Math.floor(max);
        return Math.floor(nextDoubleUnsafe() * (maxInt - minInt + extra)) + minInt;
      });
    },
    randomShuffle: (elements) => sync2(() => {
      const buffer2 = Array.from(elements);
      for (let i = buffer2.length - 1; i >= 1; i = i - 1) {
        const index = Math.min(i, Math.floor(nextDoubleUnsafe() * (i + 1)));
        const value3 = buffer2[i];
        buffer2[i] = buffer2[index];
        buffer2[index] = value3;
      }
      return buffer2;
    }),
    randomUUIDv4: sync2(() => v4String(randomBytesUnsafe(16))),
    randomUUIDv7: clockWith2((clock) => succeed6(v7String(clock.currentTimeMillisUnsafe(), randomBytesUnsafe(16)))),
    randomULID: clockWith2((clock) => succeed6(ulidString(clock.currentTimeMillisUnsafe(), randomBytesUnsafe(10))))
  });
};
var validateSize = (method, size) => Number.isSafeInteger(size) && size >= 0 ? succeed6(size) : fail6(badArgument({
  module: "Crypto",
  method,
  description: "size must be a non-negative safe integer"
}));

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodeCrypto.js
import * as NodeCrypto from "node:crypto";
var toHashAlgorithm = (algorithm) => {
  switch (algorithm) {
    case "SHA-1":
      return "sha1";
    case "SHA-256":
      return "sha256";
    case "SHA-384":
      return "sha384";
    case "SHA-512":
      return "sha512";
  }
};
var digest = (algorithm, data) => try_2({
  try: () => Uint8Array.from(NodeCrypto.createHash(toHashAlgorithm(algorithm)).update(data).digest()),
  catch: (cause) => systemError({
    module: "Crypto",
    method: "digest",
    _tag: "Unknown",
    description: "Could not compute digest",
    cause
  })
});
var make17 = /* @__PURE__ */ make16({
  randomBytes: NodeCrypto.randomBytes,
  digest
});
var layer2 = /* @__PURE__ */ succeed5(Crypto, make17);

// node_modules/.pnpm/@effect+platform-node@4.0.2_effect@4.0.2_redis@6.3.0/node_modules/@effect/platform-node/dist/NodeCrypto.js
var layer3 = layer2;

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodeFileSystem.js
import * as Crypto2 from "node:crypto";
import * as NFS from "node:fs";
import * as OS from "node:os";
import * as Path2 from "node:path";
var handleBadArgument = (method) => (err) => badArgument({
  module: "FileSystem",
  method,
  description: err.message ?? String(err)
});
var bigintToNumber = (value3, field) => {
  const number3 = Number(value3);
  if (!Number.isSafeInteger(number3)) {
    throw new RangeError(`${field} exceeds the safe integer range: ${value3}`);
  }
  return number3;
};
var bigintToNumberOption = (value3) => flatMap(fromNullishOr(value3), toNumber);
var positionToNumber = (position, method) => try_2({
  try: () => bigintToNumber(position, "position"),
  catch: handleBadArgument(method)
});
var access2 = /* @__PURE__ */ (() => {
  const nodeAccess = /* @__PURE__ */ effectify(NFS.access, /* @__PURE__ */ handleErrnoException("FileSystem", "access"), /* @__PURE__ */ handleBadArgument("access"));
  return (path, options) => {
    let mode = NFS.constants.F_OK;
    if (options?.readable) {
      mode |= NFS.constants.R_OK;
    }
    if (options?.writable) {
      mode |= NFS.constants.W_OK;
    }
    return nodeAccess(path, mode);
  };
})();
var copy2 = /* @__PURE__ */ (() => {
  const nodeCp = /* @__PURE__ */ effectify(NFS.cp, /* @__PURE__ */ handleErrnoException("FileSystem", "copy"), /* @__PURE__ */ handleBadArgument("copy"));
  return (fromPath, toPath, options) => nodeCp(fromPath, toPath, {
    force: options?.overwrite ?? false,
    preserveTimestamps: options?.preserveTimestamps ?? false,
    recursive: true
  });
})();
var copyFile2 = /* @__PURE__ */ (() => {
  const nodeCopyFile = /* @__PURE__ */ effectify(NFS.copyFile, /* @__PURE__ */ handleErrnoException("FileSystem", "copyFile"), /* @__PURE__ */ handleBadArgument("copyFile"));
  return (fromPath, toPath) => nodeCopyFile(fromPath, toPath);
})();
var chmod2 = /* @__PURE__ */ (() => {
  const nodeChmod = /* @__PURE__ */ effectify(NFS.chmod, /* @__PURE__ */ handleErrnoException("FileSystem", "chmod"), /* @__PURE__ */ handleBadArgument("chmod"));
  return (path, mode) => nodeChmod(path, mode);
})();
var chown2 = /* @__PURE__ */ (() => {
  const nodeChown = /* @__PURE__ */ effectify(NFS.chown, /* @__PURE__ */ handleErrnoException("FileSystem", "chown"), /* @__PURE__ */ handleBadArgument("chown"));
  return (path, uid, gid) => nodeChown(path, uid, gid);
})();
var glob2 = /* @__PURE__ */ (() => {
  const nodeGlob = /* @__PURE__ */ effectify(NFS.glob, /* @__PURE__ */ handleErrnoException("FileSystem", "glob"), /* @__PURE__ */ handleBadArgument("glob"));
  return (pattern, options) => nodeGlob(pattern, {
    cwd: options?.root,
    exclude: options?.exclude
  });
})();
var link2 = /* @__PURE__ */ (() => {
  const nodeLink = /* @__PURE__ */ effectify(NFS.link, /* @__PURE__ */ handleErrnoException("FileSystem", "link"), /* @__PURE__ */ handleBadArgument("link"));
  return (existingPath, newPath) => nodeLink(existingPath, newPath);
})();
var makeDirectory = /* @__PURE__ */ (() => {
  const nodeMkdir = /* @__PURE__ */ effectify(NFS.mkdir, /* @__PURE__ */ handleErrnoException("FileSystem", "makeDirectory"), /* @__PURE__ */ handleBadArgument("makeDirectory"));
  return (path, options) => nodeMkdir(path, {
    recursive: options?.recursive ?? false,
    mode: options?.mode
  });
})();
var makeTempDirectoryFactory = (method) => {
  const nodeMkdtemp = effectify(NFS.mkdtemp, handleErrnoException("FileSystem", method), handleBadArgument(method));
  return (options) => suspend2(() => {
    const prefix = options?.prefix ?? "";
    const directory2 = typeof options?.directory === "string" ? Path2.join(options.directory, ".") : OS.tmpdir();
    return nodeMkdtemp(prefix ? Path2.join(directory2, prefix) : directory2 + "/");
  });
};
var makeTempDirectory = /* @__PURE__ */ makeTempDirectoryFactory("makeTempDirectory");
var removeFactory = (method) => {
  const nodeRm = effectify(NFS.rm, handleErrnoException("FileSystem", method), handleBadArgument(method));
  return (path, options) => nodeRm(path, {
    recursive: options?.recursive ?? false,
    force: options?.force ?? false
  });
};
var remove = /* @__PURE__ */ removeFactory("remove");
var makeTempDirectoryScoped = /* @__PURE__ */ (() => {
  const makeDirectory2 = /* @__PURE__ */ makeTempDirectoryFactory("makeTempDirectoryScoped");
  const removeDirectory = /* @__PURE__ */ removeFactory("makeTempDirectoryScoped");
  return (options) => acquireRelease2(makeDirectory2(options), (directory2) => orDie2(removeDirectory(directory2, {
    recursive: true
  })));
})();
var openFactory = (method) => {
  const nodeOpen = effectify(NFS.open, handleErrnoException("FileSystem", method), handleBadArgument(method));
  const nodeClose = effectify(NFS.close, handleErrnoException("FileSystem", method), handleBadArgument(method));
  return (path, options) => pipe(acquireRelease2(nodeOpen(path, options?.flag ?? "r", options?.mode), (fd) => orDie2(nodeClose(fd))), map5((fd) => makeFile(fd, options?.flag?.startsWith("a") ?? false)));
};
var open2 = /* @__PURE__ */ openFactory("open");
var makeFile = /* @__PURE__ */ (() => {
  const nodeReadFactory = (method) => effectify(NFS.read, handleErrnoException("FileSystem", method), handleBadArgument(method));
  const nodeRead = /* @__PURE__ */ nodeReadFactory("read");
  const nodeReadAlloc = /* @__PURE__ */ nodeReadFactory("readAlloc");
  const nodeStat = /* @__PURE__ */ effectify(NFS.fstat, /* @__PURE__ */ handleErrnoException("FileSystem", "stat"), /* @__PURE__ */ handleBadArgument("stat"));
  const nodeTruncate = /* @__PURE__ */ effectify(NFS.ftruncate, /* @__PURE__ */ handleErrnoException("FileSystem", "truncate"), /* @__PURE__ */ handleBadArgument("truncate"));
  const nodeSync = /* @__PURE__ */ effectify(NFS.fsync, /* @__PURE__ */ handleErrnoException("FileSystem", "sync"), /* @__PURE__ */ handleBadArgument("sync"));
  const nodeWriteFactory = (method) => effectify(NFS.write, handleErrnoException("FileSystem", method), handleBadArgument(method));
  const nodeWrite = /* @__PURE__ */ nodeWriteFactory("write");
  const nodeWriteAll = /* @__PURE__ */ nodeWriteFactory("writeAll");
  class FileImpl {
    [FileTypeId];
    fd;
    append;
    position = /* @__PURE__ */ BigInt(0);
    constructor(fd, append3) {
      this[FileTypeId] = FileTypeId;
      this.fd = fd;
      this.append = append3;
    }
    get stat() {
      return flatMap4(nodeStat(this.fd, {
        bigint: true
      }), makeFileInfo);
    }
    get sync() {
      return nodeSync(this.fd);
    }
    seek(offset, from) {
      return suspend2(() => {
        const position = from === "start" ? offset : this.position + offset;
        if (position < BigInt(0)) {
          return fail6(badArgument({
            module: "FileSystem",
            method: "seek",
            description: "Cannot seek before the start of the file"
          }));
        }
        this.position = position;
        return succeed6(position);
      });
    }
    read(buffer2) {
      return suspend2(() => {
        const position = this.position;
        return map5(nodeRead(this.fd, {
          buffer: buffer2,
          position
        }), (bytesRead) => {
          this.position = position + BigInt(bytesRead);
          return bytesRead;
        });
      });
    }
    readAlloc(size) {
      return suspend2(() => {
        try {
          if (!Number.isInteger(size) || size < 0) {
            throw new RangeError("size must be a non-negative integer");
          }
          const buffer2 = Buffer.allocUnsafeSlow(size);
          const position = this.position;
          return map5(nodeReadAlloc(this.fd, {
            buffer: buffer2,
            position
          }), (bytesRead) => {
            if (bytesRead === 0) {
              return none2();
            }
            this.position = position + BigInt(bytesRead);
            if (bytesRead === size) {
              return some2(buffer2);
            }
            const dst = Buffer.allocUnsafeSlow(bytesRead);
            buffer2.copy(dst, 0, 0, bytesRead);
            return some2(dst);
          });
        } catch (cause) {
          return fail6(handleBadArgument("readAlloc")(cause));
        }
      });
    }
    truncate(length) {
      return map5(nodeTruncate(this.fd, length || void 0), () => {
        if (!this.append) {
          const len = BigInt(length ?? 0);
          if (this.position > len) {
            this.position = len;
          }
        }
      });
    }
    write(buffer2) {
      return suspend2(() => {
        const position = this.position;
        return flatMap4(this.append ? succeed6(void 0) : positionToNumber(position, "write"), (nodePosition) => map5(nodeWrite(this.fd, buffer2, void 0, void 0, nodePosition), (bytesWritten) => {
          if (!this.append) {
            this.position = position + BigInt(bytesWritten);
          }
          return bytesWritten;
        }));
      });
    }
    writeAllChunk(buffer2) {
      return suspend2(() => {
        const position = this.position;
        return flatMap4(this.append ? succeed6(void 0) : positionToNumber(position, "writeAll"), (nodePosition) => flatMap4(nodeWriteAll(this.fd, buffer2, void 0, void 0, nodePosition), (bytesWritten) => {
          if (bytesWritten === 0) {
            return fail6(systemError({
              module: "FileSystem",
              method: "writeAll",
              _tag: "WriteZero",
              pathOrDescriptor: this.fd,
              description: "write returned 0 bytes written"
            }));
          }
          if (!this.append) {
            this.position = position + BigInt(bytesWritten);
          }
          return bytesWritten < buffer2.length ? this.writeAllChunk(buffer2.subarray(bytesWritten)) : void_3;
        }));
      });
    }
    writeAll(buffer2) {
      return buffer2.length === 0 ? void_3 : this.writeAllChunk(buffer2);
    }
  }
  return (fd, append3) => new FileImpl(fd, append3);
})();
var makeTempFileFactory = (method) => {
  const makeDirectory2 = makeTempDirectoryFactory(method);
  return fnUntraced2(function* (options) {
    const directory2 = yield* makeDirectory2(options);
    const random3 = Crypto2.randomBytes(6).toString("hex");
    const name = Path2.join(directory2, options?.suffix ? `${random3}${options.suffix}` : random3);
    yield* writeFile2(name, new Uint8Array(0));
    return name;
  });
};
var makeTempFile = /* @__PURE__ */ makeTempFileFactory("makeTempFile");
var makeTempFileScoped = /* @__PURE__ */ (() => {
  const makeFile2 = /* @__PURE__ */ makeTempFileFactory("makeTempFileScoped");
  const removeDirectory = /* @__PURE__ */ removeFactory("makeTempFileScoped");
  return (options) => acquireRelease2(makeFile2(options), (file) => orDie2(removeDirectory(Path2.dirname(file), {
    recursive: true
  })));
})();
var readDirectory = (path, options) => tryPromise2({
  try: () => NFS.promises.readdir(path, options),
  catch: (err) => handleErrnoException("FileSystem", "readDirectory")(err, [path])
});
var readFile2 = (path) => callback2((resume, signal) => {
  try {
    NFS.readFile(path, {
      signal
    }, (err, data) => {
      if (err) {
        resume(fail6(handleErrnoException("FileSystem", "readFile")(err, [path])));
      } else {
        resume(succeed6(data));
      }
    });
  } catch (err) {
    resume(fail6(handleBadArgument("readFile")(err)));
  }
});
var readLink = /* @__PURE__ */ (() => {
  const nodeReadLink = /* @__PURE__ */ effectify(NFS.readlink, /* @__PURE__ */ handleErrnoException("FileSystem", "readLink"), /* @__PURE__ */ handleBadArgument("readLink"));
  return (path) => nodeReadLink(path);
})();
var realPath = /* @__PURE__ */ (() => {
  const nodeRealPath = /* @__PURE__ */ effectify(NFS.realpath, /* @__PURE__ */ handleErrnoException("FileSystem", "realPath"), /* @__PURE__ */ handleBadArgument("realPath"));
  return (path) => nodeRealPath(path);
})();
var rename2 = /* @__PURE__ */ (() => {
  const nodeRename = /* @__PURE__ */ effectify(NFS.rename, /* @__PURE__ */ handleErrnoException("FileSystem", "rename"), /* @__PURE__ */ handleBadArgument("rename"));
  return (oldPath, newPath) => nodeRename(oldPath, newPath);
})();
var makeFileInfo = (stat3) => try_2({
  try: () => ({
    type: stat3.isFile() ? "File" : stat3.isDirectory() ? "Directory" : stat3.isSymbolicLink() ? "SymbolicLink" : stat3.isBlockDevice() ? "BlockDevice" : stat3.isCharacterDevice() ? "CharacterDevice" : stat3.isFIFO() ? "FIFO" : stat3.isSocket() ? "Socket" : "Unknown",
    mtime: fromNullishOr(stat3.mtime),
    atime: fromNullishOr(stat3.atime),
    birthtime: fromNullishOr(stat3.birthtime),
    dev: bigintToNumber(stat3.dev, "dev"),
    rdev: bigintToNumberOption(stat3.rdev),
    ino: bigintToNumberOption(stat3.ino),
    mode: bigintToNumber(stat3.mode, "mode"),
    nlink: bigintToNumberOption(stat3.nlink),
    uid: bigintToNumberOption(stat3.uid),
    gid: bigintToNumberOption(stat3.gid),
    size: bytes(stat3.size),
    blksize: stat3.blksize !== void 0 ? some2(bytes(stat3.blksize)) : none2(),
    blocks: bigintToNumberOption(stat3.blocks)
  }),
  catch: handleBadArgument("stat")
});
var stat2 = /* @__PURE__ */ (() => {
  const nodeStat = /* @__PURE__ */ effectify(NFS.stat, /* @__PURE__ */ handleErrnoException("FileSystem", "stat"), /* @__PURE__ */ handleBadArgument("stat"));
  return (path) => flatMap4(nodeStat(path, {
    bigint: true
  }), makeFileInfo);
})();
var symlink2 = /* @__PURE__ */ (() => {
  const nodeSymlink = /* @__PURE__ */ effectify(NFS.symlink, /* @__PURE__ */ handleErrnoException("FileSystem", "symlink"), /* @__PURE__ */ handleBadArgument("symlink"));
  return (target, path) => nodeSymlink(target, path);
})();
var truncate2 = /* @__PURE__ */ (() => {
  const nodeTruncate = /* @__PURE__ */ effectify(NFS.truncate, /* @__PURE__ */ handleErrnoException("FileSystem", "truncate"), /* @__PURE__ */ handleBadArgument("truncate"));
  return (path, length) => nodeTruncate(path, length);
})();
var utimes2 = /* @__PURE__ */ (() => {
  const nodeUtimes = /* @__PURE__ */ effectify(NFS.utimes, /* @__PURE__ */ handleErrnoException("FileSystem", "utime"), /* @__PURE__ */ handleBadArgument("utime"));
  return (path, atime, mtime) => nodeUtimes(path, atime, mtime);
})();
var watchNode = (path, info, options) => callback3((queue) => acquireRelease2(sync2(() => {
  const directory2 = info.type === "Directory" ? path : Path2.dirname(path);
  const watcher = NFS.watch(path, {
    recursive: options?.recursive ?? false
  }, (event, path2) => {
    if (!path2) return;
    switch (event) {
      case "rename": {
        runFork2(matchEffect3(stat2(Path2.resolve(directory2, path2)), {
          onSuccess: (_) => offer(queue, {
            _tag: "Create",
            path: path2
          }),
          onFailure: (_) => offer(queue, {
            _tag: "Remove",
            path: path2
          })
        }));
        return;
      }
      case "change": {
        offerUnsafe(queue, {
          _tag: "Update",
          path: path2
        });
        return;
      }
    }
  });
  watcher.on("error", (error2) => {
    failCauseUnsafe(queue, fail4(systemError({
      module: "FileSystem",
      _tag: "Unknown",
      method: "watch",
      pathOrDescriptor: path,
      cause: error2
    })));
  });
  watcher.on("close", () => {
    endUnsafe(queue);
  });
  return watcher;
}), (watcher) => sync2(() => watcher.close())));
var watch2 = (backend, path, options) => stat2(path).pipe(map5((stat3) => backend.pipe(flatMap((_) => _.register(path, stat3, options)), getOrElse(() => watchNode(path, stat3, options)))), unwrap4);
var writeFile2 = (path, data, options) => callback2((resume, signal) => {
  try {
    NFS.writeFile(path, data, {
      signal,
      flag: options?.flag,
      mode: options?.mode
    }, (err) => {
      if (err) {
        resume(fail6(handleErrnoException("FileSystem", "writeFile")(err, [path])));
      } else {
        resume(void_3);
      }
    });
  } catch (err) {
    resume(fail6(handleBadArgument("writeFile")(err)));
  }
});
var makeFileSystem = /* @__PURE__ */ map5(/* @__PURE__ */ serviceOption2(WatchBackend), (backend) => make11({
  access: access2,
  chmod: chmod2,
  chown: chown2,
  copy: copy2,
  copyFile: copyFile2,
  glob: glob2,
  link: link2,
  makeDirectory,
  makeTempDirectory,
  makeTempDirectoryScoped,
  makeTempFile,
  makeTempFileScoped,
  open: open2,
  readDirectory,
  readFile: readFile2,
  readLink,
  realPath,
  remove,
  rename: rename2,
  stat: stat2,
  symlink: symlink2,
  truncate: truncate2,
  utimes: utimes2,
  watch(path, options) {
    return watch2(backend, path, options);
  },
  writeFile: writeFile2
}));
var layer4 = /* @__PURE__ */ effect(FileSystem)(makeFileSystem);

// node_modules/.pnpm/@effect+platform-node@4.0.2_effect@4.0.2_redis@6.3.0/node_modules/@effect/platform-node/dist/NodeFileSystem.js
var layer5 = layer4;

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodePath.js
import * as NodePath from "node:path";
import * as NodeUrl from "node:url";
var fileUrlOps = (windows) => ({
  fromFileUrl: (url) => try_2({
    try: () => NodeUrl.fileURLToPath(url, {
      windows
    }),
    catch: (cause) => new BadArgument({
      module: "Path",
      method: "fromFileUrl",
      cause
    })
  }),
  toFileUrl: (path) => try_2({
    try: () => NodeUrl.pathToFileURL(path, {
      windows
    }),
    catch: (cause) => new BadArgument({
      module: "Path",
      method: "toFileUrl",
      cause
    })
  })
});
var layerPosix = /* @__PURE__ */ succeed5(Path)({
  [TypeId16]: TypeId16,
  ...NodePath.posix,
  .../* @__PURE__ */ fileUrlOps(false)
});
var layerWin32 = /* @__PURE__ */ succeed5(Path)({
  [TypeId16]: TypeId16,
  ...NodePath.win32,
  .../* @__PURE__ */ fileUrlOps(true)
});
var layer6 = /* @__PURE__ */ succeed5(Path)({
  [TypeId16]: TypeId16,
  ...NodePath,
  .../* @__PURE__ */ fileUrlOps(void 0)
});

// node_modules/.pnpm/@effect+platform-node@4.0.2_effect@4.0.2_redis@6.3.0/node_modules/@effect/platform-node/dist/NodePath.js
var layer7 = layer6;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Stdio.js
var TypeId22 = "~effect/Stdio";
var Stdio = /* @__PURE__ */ Service(TypeId22);
var make18 = (options) => ({
  [TypeId22]: TypeId22,
  stdinIsTerminal: succeed6(false),
  stdoutIsTerminal: succeed6(false),
  ...options
});

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodeStdio.js
var layer8 = /* @__PURE__ */ succeed5(Stdio, /* @__PURE__ */ make18({
  args: /* @__PURE__ */ sync2(() => process.argv.slice(2)),
  stdinIsTerminal: /* @__PURE__ */ sync2(() => process.stdin.isTTY === true),
  stdoutIsTerminal: /* @__PURE__ */ sync2(() => process.stdout.isTTY === true),
  stdout: (options) => fromWritable({
    evaluate: () => process.stdout,
    onError: (cause) => systemError({
      module: "Stdio",
      method: "stdout",
      _tag: "Unknown",
      cause
    }),
    endOnDone: options?.endOnDone ?? false
  }),
  stderr: (options) => fromWritable({
    evaluate: () => process.stderr,
    onError: (cause) => systemError({
      module: "Stdio",
      method: "stderr",
      _tag: "Unknown",
      cause
    }),
    endOnDone: options?.endOnDone ?? false
  }),
  stdin: /* @__PURE__ */ fromReadable({
    evaluate: () => process.stdin,
    onError: (cause) => systemError({
      module: "Stdio",
      method: "stdin",
      _tag: "Unknown",
      cause
    }),
    closeOnDone: false
  })
}));

// node_modules/.pnpm/@effect+platform-node@4.0.2_effect@4.0.2_redis@6.3.0/node_modules/@effect/platform-node/dist/NodeStdio.js
var layer9 = layer8;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/redacted.js
var redactedRegistry = /* @__PURE__ */ new WeakMap();
var value = (self) => {
  if (redactedRegistry.has(self)) {
    return redactedRegistry.get(self);
  } else {
    throw new Error("Unable to get redacted value" + (self.label ? ` with label: "${self.label}"` : ""));
  }
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Redacted.js
var TypeId23 = "~effect/Redacted";
var isRedacted = (u) => hasProperty(u, TypeId23);
var make19 = (value3, options) => {
  const self = Object.create(Proto3);
  if (options?.label) {
    self.label = options.label;
  }
  redactedRegistry.set(self, value3);
  return self;
};
var Proto3 = {
  [TypeId23]: {
    _A: (_) => _
  },
  label: void 0,
  ...PipeInspectableProto,
  toJSON() {
    return this.toString();
  },
  toString() {
    return `<redacted${isString(this.label) ? ":" + this.label : ""}>`;
  },
  [symbol]() {
    return hash(redactedRegistry.get(this));
  },
  [symbol2](that) {
    return isRedacted(that) && equals(redactedRegistry.get(this), redactedRegistry.get(that));
  }
};
var value2 = value;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/schema/interpreter.js
var flatMapTransformation = (result3, current, f) => result3 === sameExit ? f(current) : flatMapEager2(result3, f);
function compileTransformation(transformation) {
  if (transformation._tag === "Middleware") {
    return (result3, current, options) => {
      const transformed = result3 === sameExit ? transformation.decode(succeed8(toOption(current)), options) : transformation.decode(mapEager2(result3, toOption), options);
      return fromOptionalEffect(transformed);
    };
  }
  const getter = transformation.decode;
  switch (getter._tag) {
    case "Passthrough":
      return (result3, current) => result3 === sameExit ? succeed8(current) : result3;
    case "Transform": {
      const transform4 = (value3) => value3 === missing ? missingExit : succeed8(getter.transform(value3));
      return (result3, current) => flatMapTransformation(result3, current, transform4);
    }
    case "TransformOptional": {
      const transform4 = (value3) => fromOptionExit(getter.transform(toOption(value3)));
      return (result3, current) => flatMapTransformation(result3, current, transform4);
    }
    case "TransformEffect":
      return (result3, current, options) => flatMapTransformation(result3, current, (value3) => value3 === missing ? missingExit : getter.transform(value3, options));
    case "TransformOptionalEffect":
      return (result3, current, options) => flatMapTransformation(result3, current, (value3) => fromOptionalEffect(getter.transform(toOption(value3), options)));
  }
}
var fromOptionalEffect = (effect2) => flatMapEager2(effect2, fromOptionExit);
var wrapEncoding = (ast, input, options, effect2) => catchCause2(effect2, (cause) => failCauseSync2(() => map4(cause, (issue) => new Encoding(ast, issue, input, options))));
function makeConstructorParser(descriptor, compile2) {
  const transform4 = compileTransformation(descriptor.link.transformation);
  let sourceParser;
  return (input, options) => {
    if (input === missing) return missingExit;
    if (descriptor.isConstructed(input)) return sameExit;
    const result3 = (sourceParser ??= compile2(descriptor.link.to))(input, options);
    return transform4(result3, input, options);
  };
}
function withDefault(ast, parser) {
  const defaultValue = ast.context.constructorDefault;
  return (input, options) => {
    if (input !== missing && input !== void 0) return parser(input, options);
    const result3 = defaultValue;
    if (effectIsExit(result3) && result3._tag === "Success") {
      const local = parser(result3[args], options);
      return local === sameExit ? result3 : local;
    }
    return flatMapEager2(wrapEncoding(ast, input, options, result3), (value3) => {
      const local = parser(value3, options);
      return local === sameExit ? succeed8(value3) : local;
    });
  };
}
function compileField(ast, compile2) {
  const parser = compile2(ast);
  return ast.context?.constructorDefault === void 0 ? parser : withDefault(ast, parser);
}
function compile(ast, compile2, compileField2, base, specialize) {
  if (ast._tag === "Declaration") {
    for (const parameter of ast.typeParameters) compile2(parameter);
  }
  const descriptor = compileField2 ? getConstructorDescriptor(ast) : void 0;
  const parser = descriptor ? makeConstructorParser(descriptor, compile2) : base ?? ast.getParser(compile2, compileField2);
  const checks = ast.checks;
  const links = ast.encoding;
  const transformations = links?.map((link4) => compileTransformation(link4.transformation));
  const encodingChecks = ast.encodingChecks;
  if (!links && !checks && !encodingChecks) {
    return parser;
  }
  let encodingParsers;
  const parseChecks = (input, options) => {
    let result3 = parser(input, options);
    if (encodingChecks && !options.disableChecks) {
      if (effectIsExit(result3)) {
        if (result3._tag === "Success") {
          const output = result3 === sameExit ? input : result3[args];
          if (input !== missing && output !== missing) {
            const issues = collectIssues(encodingChecks, input, void 0, ast, options);
            if (issues) {
              result3 = fail6(new Composite(ast, issues, input, options));
            }
          }
        }
      } else {
        result3 = flatMap4(result3, (value3) => {
          if (input !== missing && value3 !== missing) {
            const issues = collectIssues(encodingChecks, input, void 0, ast, options);
            if (issues) {
              return fail6(new Composite(ast, issues, input, options));
            }
          }
          return succeed6(value3);
        });
      }
    }
    if (checks && !options.disableChecks) {
      if (effectIsExit(result3)) {
        if (result3._tag === "Success") {
          const value3 = result3 === sameExit ? input : result3[args];
          if (value3 === missing) return result3;
          const issues = collectIssues(checks, value3, void 0, ast, options);
          if (issues) {
            result3 = fail6(new Composite(ast, issues, value3, options));
          }
        }
      } else {
        result3 = flatMap4(result3, (value3) => {
          if (value3 !== missing) {
            const issues = collectIssues(checks, value3, void 0, ast, options);
            if (issues) {
              return fail6(new Composite(ast, issues, value3, options));
            }
          }
          return succeed6(value3);
        });
      }
    }
    return result3;
  };
  const parseLocal = specialize === void 0 ? parseChecks : specialize(parseChecks);
  if (!links) {
    return parseLocal;
  }
  return (input, options) => {
    const parsers = encodingParsers ??= links.map((link4) => compile2(link4.to));
    let current = input;
    let result3 = parsers[parsers.length - 1](input, options);
    for (let i = links.length - 1; i >= 0; i--) {
      result3 = transformations[i](result3, current, options);
      if (i !== 0) {
        const next = parsers[i - 1];
        if (result3._tag === "Success") {
          current = result3[args];
          result3 = next(current, options);
        } else {
          result3 = flatMapEager2(result3, (value3) => {
            const nextResult = next(value3, options);
            return nextResult === sameExit ? succeed8(value3) : nextResult;
          });
        }
      }
    }
    if (result3._tag === "Success") {
      const value3 = result3[args];
      const local = parseLocal(value3, options);
      return local === sameExit ? result3 : local;
    }
    result3 = wrapEncoding(ast, input, options, result3);
    return flatMapEager2(result3, (value3) => {
      const local = parseLocal(value3, options);
      return local === sameExit ? succeed8(value3) : local;
    });
  };
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/schema/compilerRegistry.js
var invalid3 = /* @__PURE__ */ Symbol();
var cache = /* @__PURE__ */ new WeakMap();
var compiler;
var compilerAdaptersEnabled = false;
var decodeChild = (ast) => compilerAdaptersEnabled ? lazyParser(resolve5, ast, "parser") : resolve5(ast).parser;
var makeChild = (ast) => compilerAdaptersEnabled ? lazyParser(resolve5, ast, "makeEffect") : resolve5(ast).makeEffect;
var makeField = (ast) => compileField(ast, makeChild);
var InterpretedEntry = class {
  ast;
  constructor(ast) {
    this.ast = ast;
  }
  get decodeEffect() {
    return this.cachedDecodeEffect ??= compile(this.ast, decodeChild);
  }
  get parser() {
    return this.decodeEffect;
  }
  get makeEffect() {
    return this.cachedMakeEffect ??= compile(this.ast, makeChild, makeField);
  }
};
var CompilerEntry = class extends InterpretedEntry {
  compiled;
  resolve;
  constructor(ast, compiled, resolve6) {
    super(ast);
    this.compiled = compiled;
    this.resolve = resolve6;
  }
  save(key, value3) {
    Object.defineProperty(this, key, {
      value: value3
    });
    return value3;
  }
  operation(key) {
    const compiled = this.compiled;
    return typeof compiled === "function" ? compiled(this.ast, this.resolve, key) : compiled?.[key];
  }
  get is() {
    return this.save("is", this.operation("is"));
  }
  get decode() {
    return this.save("decode", this.operation("decode"));
  }
  get make() {
    return this.save("make", this.operation("make"));
  }
  get decodeEffect() {
    return this.save("decodeEffect", this.operation("decodeEffect") ?? compile(this.ast, (ast) => lazyParser(this.resolve, ast, "parser")));
  }
  get parser() {
    const decode2 = this.decode;
    return decode2 === void 0 ? this.decodeEffect : this.save("parser", withDecode(decode2, () => this.decodeEffect));
  }
  get makeEffect() {
    const makeEffect2 = this.operation("makeEffect");
    if (makeEffect2 !== void 0) return this.save("makeEffect", makeEffect2);
    const child = (ast) => lazyParser(this.resolve, ast, "makeEffect");
    return this.save("makeEffect", compile(this.ast, child, (ast) => compileField(ast, child)));
  }
};
function withDecode(fastDecode, decodeEffect2) {
  let detailed;
  return (input, options) => {
    if (input !== missing) {
      try {
        const value3 = fastDecode(input, options);
        if (value3 !== invalid3) return value3 === input ? sameExit : succeed8(value3);
      } catch (error2) {
        return die3(error2);
      }
    }
    return (detailed ??= decodeEffect2())(input, options);
  };
}
function lazyParser(resolve6, ast, operation) {
  const entry = resolve6(ast);
  if (entry.compiled === void 0 || Object.hasOwn(entry, operation)) {
    return entry[operation];
  }
  let parser;
  return (input, options) => (parser ??= entry[operation])(input, options);
}
function resolve5(ast) {
  const cached2 = cache.get(ast);
  if (cached2 !== void 0) return cached2;
  const entry = compiler === void 0 ? new InterpretedEntry(ast) : new CompilerEntry(ast, compiler(ast, resolve5), resolve5);
  cache.set(ast, entry);
  return entry;
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/SchemaParser.js
function makeEffect(schema2) {
  const ast = schema2.ast;
  let parser;
  return (input, options) => {
    return (parser ??= runWithCompiler(constructorCompiler, toType(ast)))(input, options?.disableChecks ? options?.parseOptions ? {
      ...options.parseOptions,
      disableChecks: true
    } : {
      disableChecks: true
    } : options?.parseOptions);
  };
}
function makeOption(schema2) {
  const parser = makeEffect(schema2);
  return (input, options) => {
    const exit3 = runSyncExit2(parser(input, options));
    if (isSuccess3(exit3)) {
      return some2(exit3.value);
    }
    getSchemaIssueOrThrow(exit3.cause, "Option adapter can only return none for schema issues");
    return none2();
  };
}
function make20(schema2) {
  return makeConstructorSync(toType(schema2.ast));
}
function is(schema2) {
  return _is(schema2.ast);
}
function makeIs(ast) {
  if (!compilerAdaptersEnabled) {
    const parser2 = asExit(run2(ast));
    return (input) => {
      const exit3 = parser2(input, defaultParseOptions);
      if (isSuccess3(exit3)) return true;
      getSchemaIssueOrThrow(exit3.cause, "Type guard adapter can only return false for schema issues");
      return false;
    };
  }
  const entry = resolve5(ast);
  const guard = entry.is;
  if (guard !== void 0) {
    return (input) => {
      try {
        return guard(input, defaultParseOptions);
      } catch (error2) {
        getSchemaIssueOrThrow(die2(error2), "Type guard adapter can only return false for schema issues");
        return false;
      }
    };
  }
  const parser = entry.parser;
  return (input) => {
    const exit3 = runSyncExit2(parserResult(parser(input, defaultParseOptions), input));
    if (isSuccess3(exit3)) return true;
    getSchemaIssueOrThrow(exit3.cause, "Type guard adapter can only return false for schema issues");
    return false;
  };
}
function _is(ast) {
  const typeAST = toType(ast);
  let guard = (input) => {
    guard = makeIs(typeAST);
    return guard(input);
  };
  return (input) => {
    return guard(input);
  };
}
function decodeUnknownEffect(schema2, options) {
  const parser = run2(schema2.ast);
  return options === void 0 ? parser : (input, overrideOptions) => parser(input, mergeParseOptions(options, overrideOptions));
}
function encodeUnknownEffect(schema2, options) {
  const parser = run2(flip2(schema2.ast));
  return options === void 0 ? parser : (input, overrideOptions) => parser(input, mergeParseOptions(options, overrideOptions));
}
var mergeParseOptions = (options, overrideOptions) => overrideOptions ? {
  ...options,
  ...overrideOptions
} : options;
var getValue = (value3) => {
  if (value3 === missing) {
    return fail6(new InvalidValue());
  }
  return succeed6(value3);
};
function run2(ast) {
  return runWithCompiler(normalCompiler, ast);
}
function parserResult(result3, input) {
  if (result3 === sameExit) {
    return succeed6(input);
  }
  if (!effectIsExit(result3)) {
    return flatMapEager2(result3, getValue);
  }
  return result3[args] === missing ? getValue(missing) : result3;
}
function runWithCompiler(compiler2, ast) {
  let parser;
  return (input, options) => {
    const result3 = (parser ??= compiler2(ast))(input, options ?? defaultParseOptions);
    if (result3 === sameExit) {
      return succeed6(input);
    }
    if (!effectIsExit(result3)) {
      return flatMapEager2(result3, getValue);
    }
    return result3[args] === missing ? getValue(missing) : result3;
  };
}
function asExit(parser) {
  return (input, options) => runSyncExit2(parser(input, options));
}
function runSync2(effect2, message) {
  const exit3 = runSyncExit2(effect2);
  if (isSuccess3(exit3)) {
    return exit3.value;
  }
  const issue = getSchemaIssueOrThrow(exit3.cause, message);
  throw new Error("Schema validation failed", {
    cause: issue
  });
}
function makeConstructorSync(ast) {
  let entry;
  let parser;
  return (input, options) => {
    entry ??= resolve5(ast);
    const parseOptions = options?.disableChecks ? options.parseOptions ? {
      ...options.parseOptions,
      disableChecks: true
    } : {
      disableChecks: true
    } : options?.parseOptions ?? defaultParseOptions;
    const make29 = entry.make;
    if (make29 !== void 0 && input !== missing) {
      let output;
      try {
        output = make29(input, parseOptions);
      } catch (error2) {
        getSchemaIssueOrThrow(die2(error2), "Constructor adapter can only throw schema issues");
        throw error2;
      }
      if (output !== invalid3 && output !== missing) return output;
    }
    const result3 = (parser ??= entry.makeEffect)(input, parseOptions);
    return runSync2(parserResult(result3, input), "Constructor adapter can only throw schema issues");
  };
}
var normalCompiler = (ast) => resolve5(ast).parser;
var constructorCompiler = (ast) => resolve5(ast).makeEffect;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/schema/make.js
var TypeId24 = "~effect/Schema/Schema";
var RebuildOptions = /* @__PURE__ */ Symbol();
var SchemaProto = {
  [TypeId24]: TypeId24,
  get make() {
    const value3 = make20(this);
    Object.defineProperty(this, "make", {
      value: value3,
      enumerable: true
    });
    return value3;
  },
  get makeEffect() {
    const value3 = makeEffect(this);
    Object.defineProperty(this, "makeEffect", {
      value: value3,
      enumerable: true
    });
    return value3;
  },
  get makeOption() {
    const value3 = makeOption(this);
    Object.defineProperty(this, "makeOption", {
      value: value3,
      enumerable: true
    });
    return value3;
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  annotate(annotations) {
    return this.rebuild(annotate(this.ast, annotations));
  },
  annotateKey(annotations) {
    return this.rebuild(annotateKey(this.ast, annotations));
  },
  check(...checks) {
    return this.rebuild(appendChecks(this.ast, checks));
  },
  rebuild(ast) {
    return make21(ast, this[RebuildOptions]);
  }
};
function make21(ast, options) {
  function Schema() {
  }
  const self = Object.setPrototypeOf(Schema, SchemaProto);
  if (options && (Object.hasOwn(options, "name") || Object.hasOwn(options, "length") || Object.hasOwn(options, "__proto__"))) {
    Object.defineProperties(self, Object.getOwnPropertyDescriptors({
      ...options
    }));
  } else {
    Object.assign(self, options);
  }
  self[RebuildOptions] = options;
  self.ast = ast;
  return self;
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/schema/toCodec.js
function withoutConstructorDefault(context3) {
  return context3.constructorDefault === void 0 ? context3 : new Context(context3.isOptional, context3.isMutable, void 0, context3.annotations);
}
function validateCanonicalObjectPropertyNames(ast) {
  if (ast.propertySignatures.some((ps) => typeof ps.name !== "string")) {
    throw new globalThis.Error("Objects property names must be strings", {
      cause: ast
    });
  }
}
function makeReorder(getPriority) {
  return (types) => {
    const sortedTypes = [...types].sort((a, b) => getPriority(toEncoded(a)) - getPriority(toEncoded(b)));
    const orderChanged = sortedTypes.some((ast, index) => ast !== types[index]);
    if (!orderChanged) return types;
    return sortedTypes;
  };
}
function toCodecStringTree(schema2) {
  return make21(toCodecStringTreeAST(schema2.ast), {
    schema: schema2
  });
}
var toStringTreeReorder = /* @__PURE__ */ makeReorder((ast) => {
  switch (ast._tag) {
    case "Null":
    case "Boolean":
    case "Number":
    case "BigInt":
    case "Symbol":
    case "UniqueSymbol":
      return 0;
    default:
      return 1;
  }
});
function toCodecStringTreeASTStep(ast, recur, onMissingAnnotation) {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = ast.typeParameters.map((tp) => make21(recur(toEncoded(tp))));
      const getStringTreeLink = ast.annotations?.toCodecStringTree;
      if (isFunction(getStringTreeLink)) {
        const link5 = getStringTreeLink(typeParameters);
        if (link5 === void 0) return ast;
        return replaceEncoding(ast, [mapLink(link5, recur)]);
      }
      const getJsonLink = ast.annotations?.toCodecJson;
      const jsonLink = isFunction(getJsonLink) ? getJsonLink(typeParameters) : void 0;
      const getLink = jsonLink === void 0 ? ast.annotations?.toCodec : void 0;
      const link4 = jsonLink ?? (isFunction(getLink) ? getLink(typeParameters) : void 0);
      return link4 === void 0 ? onMissingAnnotation(ast) : replaceEncoding(ast, [mapLink(link4, recur)]);
    }
    case "Null":
      return replaceEncoding(ast, [nullToString]);
    case "Boolean":
      return replaceEncoding(ast, [booleanToString]);
    case "Unknown":
    case "ObjectKeyword":
      return replaceEncoding(ast, [unknownToStringTree]);
    case "Enum":
    case "Number":
    case "Literal":
    case "UniqueSymbol":
    case "Symbol":
    case "BigInt":
      return ast.toCodecStringTree();
    case "Objects": {
      validateCanonicalObjectPropertyNames(ast);
      return ast.recur(recur, parameterFromString);
    }
    case "Union": {
      const sortedTypes = toStringTreeReorder(ast.types);
      if (sortedTypes !== ast.types) {
        return new Union(sortedTypes, ast.options, ast.annotations, ast.checks, ast.encoding, ast.context, ast.encodingChecks).recur(recur);
      }
      return ast.recur(recur);
    }
    case "Arrays":
    case "Suspend":
      return ast.recur(recur);
  }
  return ast;
}
var nullToString = /* @__PURE__ */ new Link(/* @__PURE__ */ new Literal("null"), /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform(() => null), /* @__PURE__ */ transform(() => "null")));
var booleanToString = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union([/* @__PURE__ */ new Literal("true"), /* @__PURE__ */ new Literal("false")]), /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform((s) => s === "true"), /* @__PURE__ */ String2()));
var arrayFromSingleTransformation = /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform((input) => typeof input === "string" ? [input] : input), /* @__PURE__ */ passthrough());
var isCodecArrayFromSingleLink = (link4) => link4.transformation === arrayFromSingleTransformation;
var toCodecStringTreeAST = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  const out = toCodecStringTreeASTStep(ast, toCodecStringTreeAST, (ast2) => {
    throw new globalThis.Error("Missing structural codec for StringTree", {
      cause: ast2
    });
  });
  if (out !== ast && ast.context !== void 0) {
    return replaceContextLastLink(out, withoutConstructorDefault(ast.context));
  }
  return out;
}, {
  stopAt: isCodecArrayFromSingleLink
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Struct.js
var lambda = (f) => f;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/internal/schemaError.js
var SchemaErrorTypeId = "~effect/Schema/SchemaError";

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Schema.js
var TypeId25 = TypeId24;
function declareConstructor() {
  return (typeParameters, run6, annotations) => {
    return make22(new Declaration(typeParameters.map(getAST), (typeParameters2) => run6(typeParameters2.map((ast) => make22(ast))), annotations));
  };
}
function declare(is3, annotations) {
  return declareConstructor()([], () => (input, ast, options) => is3(input) ? succeed6(input) : fail6(new InvalidType(ast, input, options)), annotations);
}
var SchemaError = class extends (/* @__PURE__ */ TaggedError2("SchemaError")) {
  [SchemaErrorTypeId] = SchemaErrorTypeId;
  constructor(issue) {
    const stackTraceLimit = getStackTraceLimit();
    setStackTraceLimit(0);
    try {
      super({
        issue
      });
    } finally {
      setStackTraceLimit(stackTraceLimit);
    }
  }
  get message() {
    return defaultFormatter(this.issue);
  }
  toString() {
    return `SchemaError(${this.message})`;
  }
};
function fromIssueEffect(self) {
  if (effectIsExit(self)) {
    return fromIssueExit(self);
  }
  return catchCause2(self, (cause) => failCauseSync2(() => map4(cause, (issue) => new SchemaError(issue))));
}
function fromIssueExit(exit3) {
  return isSuccess3(exit3) ? exit3 : failCause2(map4(exit3.cause, (issue) => new SchemaError(issue)));
}
var is2 = is;
function decodeUnknownEffect2(schema2, options) {
  const parser = decodeUnknownEffect(schema2, options);
  return (input, options2) => {
    return fromIssueEffect(parser(input, options2));
  };
}
function encodeUnknownEffect2(schema2, options) {
  const parser = encodeUnknownEffect(schema2, options);
  return (input, options2) => {
    return fromIssueEffect(parser(input, options2));
  };
}
var encodeEffect = encodeUnknownEffect2;
var make22 = make21;
function isSchema(u) {
  return hasProperty(u, TypeId25) && u[TypeId25] === TypeId25;
}
var optionalKey2 = /* @__PURE__ */ lambda((schema2) => make22(optionalKey(schema2.ast), {
  schema: schema2
}));
var optional2 = /* @__PURE__ */ lambda((self) => {
  const schema2 = UndefinedOr(self);
  return make22(optional(self.ast), {
    schema: schema2
  });
});
function Literal2(literal) {
  const out = make22(new Literal(literal), {
    literal,
    transform(to) {
      return out.pipe(decodeTo2(Literal2(to), {
        decode: transform(() => to),
        encode: transform(() => literal)
      }));
    }
  });
  return out;
}
var Unknown2 = /* @__PURE__ */ make22(unknown);
var Undefined2 = /* @__PURE__ */ make22(undefined_2);
var String4 = /* @__PURE__ */ make22(string2);
var Number6 = /* @__PURE__ */ make22(number2);
var Boolean3 = /* @__PURE__ */ make22(boolean);
function makeStruct(ast, fields) {
  return make22(ast, {
    fields,
    mapFields(f, options) {
      const fields2 = f(this.fields);
      return makeStruct(struct(fields2, options?.unsafePreserveChecks ? this.ast.checks : void 0), fields2);
    }
  });
}
function Struct(fields) {
  return makeStruct(struct(fields, void 0), fields);
}
function Record(key, value3) {
  return make22(record(key.ast, value3.ast), {
    key,
    value: value3
  });
}
function makeTuple(ast, elements) {
  return make22(ast, {
    elements,
    mapElements(f, options) {
      const elements2 = f(this.elements);
      return makeTuple(tuple(elements2, options?.unsafePreserveChecks ? this.ast.checks : void 0), elements2);
    }
  });
}
function Tuple(elements) {
  return makeTuple(tuple(elements), elements);
}
var ArraySchema = /* @__PURE__ */ lambda((schema2) => make22(new Arrays(false, [], [schema2.ast]), {
  value: schema2
}));
function makeUnion(ast, members) {
  return make22(ast, {
    members,
    mapMembers(f, options) {
      const members2 = f(this.members);
      return makeUnion(union(members2, this.ast.options, options?.unsafePreserveChecks ? this.ast.checks : void 0), members2);
    }
  });
}
function Union2(members, options) {
  return makeUnion(union(members, options, void 0), members);
}
function Literals(literals) {
  const members = literals.map(Literal2);
  return make22(union(members, void 0, void 0), {
    literals,
    members,
    mapMembers(f) {
      return Union2(f(this.members));
    },
    pick(literals2) {
      return Literals(literals2);
    },
    transform(to) {
      return Union2(members.map((member, index) => member.transform(to[index])));
    }
  });
}
var UndefinedOr = /* @__PURE__ */ lambda((self) => Union2([self, Undefined2]));
function decodeTo2(to, transformation) {
  return (from) => {
    return make22(decodeTo(from.ast, to.ast, transformation ? makeTransformation(transformation) : passthrough2()), {
      from,
      to
    });
  };
}
var TrueLiterals = /* @__PURE__ */ Literals(["true", "yes", "on", "1", "y"]);
var FalseLiterals = /* @__PURE__ */ Literals(["false", "no", "off", "0", "n"]);
var BooleanLiterals = /* @__PURE__ */ Literals([...TrueLiterals.literals, ...FalseLiterals.literals]).pipe(/* @__PURE__ */ decodeTo2(Boolean3, /* @__PURE__ */ transform2({
  decode: (value3) => value3 === "true" || value3 === "yes" || value3 === "on" || value3 === "1" || value3 === "y",
  encode: (value3) => value3 ? "true" : "false"
})));
function withConstructorDefault2(defaultValue) {
  return (schema2) => make22(withConstructorDefault(schema2.ast, defaultValue), {
    schema: schema2
  });
}
function tag(literal) {
  return Literal2(literal).pipe(withConstructorDefault2(succeed6(literal)));
}
function TaggedStruct(value3, fields) {
  return Struct({
    _tag: tag(value3),
    ...fields
  });
}
function instanceOf(constructor, annotations) {
  return declare((u) => u instanceof constructor, annotations);
}
function link3() {
  return (encodeTo, transformation) => {
    return new Link(encodeTo.ast, makeTransformation(transformation));
  };
}
var makeFilter2 = makeFilter;
function isPattern2(regExp, annotations) {
  const source = regExp.source;
  const flags = regExp.flags;
  const canExport = /^[dg]*uy?$/.test(flags);
  const runtimeRegExp = flags === "" ? `new RegExp(${format(source)})` : `new RegExp(${format(source)}, ${format(flags)})`;
  return isPattern(regExp, {
    toJsonSchema: () => canExport ? {
      pattern: flags.endsWith("y") ? `^(?:${source})` : source
    } : [{}, true],
    toCode: () => ({
      runtime: `Schema.isPattern(${runtimeRegExp})`
    }),
    ...annotations
  });
}
function isBase64(annotations) {
  const regExp = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return isPattern2(regExp, {
    expected: "a base64 encoded string",
    representation: {
      id: "effect/schema/isBase64",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: regExp.source
    }),
    toCode: () => ({
      runtime: "Schema.isBase64()"
    }),
    ...annotations
  });
}
function isInt(annotations) {
  return makeFilter2((n) => globalThis.Number.isSafeInteger(n), {
    expected: "an integer",
    representation: {
      id: "effect/schema/isInt",
      payload: null
    },
    toJsonSchema: () => [{
      type: "integer"
    }, true],
    toCode: () => ({
      runtime: "Schema.isInt()"
    }),
    arbitraryConstraint: {
      number: "integer"
    },
    ...annotations
  });
}
var Int = /* @__PURE__ */ Number6.check(/* @__PURE__ */ isInt());
var getErrorOptionsKey = (options) => (options?.includeStack === true ? 1 : 0) | (options?.excludeCause === true ? 2 : 0);
var getErrorOptions = (key) => {
  switch (key) {
    case 0:
      return void 0;
    case 1:
      return {
        includeStack: true
      };
    case 2:
      return {
        excludeCause: true
      };
    case 3:
      return {
        includeStack: true,
        excludeCause: true
      };
  }
};
var defectSchemaCache = [];
function Defect(options) {
  const key = getErrorOptionsKey(options);
  const cached2 = defectSchemaCache[key];
  if (cached2 !== void 0) {
    return cached2;
  }
  const schema2 = Json2.pipe(decodeTo2(Unknown2, defectFromJson(getErrorOptions(key))));
  defectSchemaCache[key] = schema2;
  return schema2;
}
var RegExp2 = /* @__PURE__ */ instanceOf(globalThis.RegExp, {
  representation: {
    id: "effect/schema/RegExp",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.RegExp`,
    Type: `globalThis.RegExp`
  }),
  expected: "RegExp",
  toCodecJson: () => link3()(Struct({
    source: String4,
    flags: String4
  }), transformEffect2({
    decode: (e, options) => try_2({
      try: () => new globalThis.RegExp(e.source, e.flags),
      catch: () => new InvalidValue({
        expected: "valid RegExp source and flags"
      }, e, options)
    }),
    encode: (regExp) => succeed6({
      source: regExp.source,
      flags: regExp.flags
    })
  }))
});
var URLString = /* @__PURE__ */ String4.annotate({
  expected: "a string that will be decoded as a URL"
});
var URL2 = /* @__PURE__ */ instanceOf(globalThis.URL, {
  representation: {
    id: "effect/schema/URL",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.URL`,
    Type: `globalThis.URL`
  }),
  expected: "URL",
  toCodecJson: () => link3()(URLString, urlFromString)
});
var JsonString = /* @__PURE__ */ String4.annotate({
  expected: "a string that will be decoded as JSON",
  contentMediaType: "application/json"
});
function fromJsonString2(schema2, options) {
  return JsonString.pipe(decodeTo2(schema2, fromJsonString(options)));
}
var File = /* @__PURE__ */ instanceOf(globalThis.File, {
  representation: {
    id: "effect/schema/File",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.File`,
    Type: `globalThis.File`
  }),
  expected: "File",
  toCodecJson: () => link3()(Struct({
    data: String4.check(isBase64()),
    type: String4,
    name: String4,
    lastModified: Int
  }), transformEffect2({
    decode: (e, options) => match2(decode(e.data), {
      onFailure: () => fail6(new InvalidValue({
        expected: "a valid Base64 string"
      }, e.data, options)),
      onSuccess: (bytes2) => {
        const buffer2 = new globalThis.Uint8Array(bytes2);
        return succeed6(new globalThis.File([buffer2], e.name, {
          type: e.type,
          lastModified: e.lastModified
        }));
      }
    }),
    encode: (file, options) => tryPromise2({
      try: async () => {
        const bytes2 = new globalThis.Uint8Array(await file.arrayBuffer());
        return {
          data: encode(bytes2),
          type: file.type,
          name: file.name,
          lastModified: file.lastModified
        };
      },
      catch: () => new InvalidValue({
        expected: "a readable File"
      }, file, options)
    })
  }))
});
var FormData2 = /* @__PURE__ */ instanceOf(globalThis.FormData, {
  representation: {
    id: "effect/schema/FormData",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.FormData`,
    Type: `globalThis.FormData`
  }),
  expected: "FormData",
  toCodecJson: () => link3()(ArraySchema(Tuple([String4, Union2([Struct({
    _tag: tag("String"),
    value: String4
  }), Struct({
    _tag: tag("File"),
    value: File
  })])])), transformEffect2({
    decode: (e) => {
      const out = new globalThis.FormData();
      for (const [key, entry] of e) {
        out.append(key, entry.value);
      }
      return succeed6(out);
    },
    encode: (formData) => {
      return succeed6(globalThis.Array.from(formData.entries()).map(([key, value3]) => {
        if (typeof value3 === "string") {
          return [key, {
            _tag: "String",
            value: value3
          }];
        } else {
          return [key, {
            _tag: "File",
            value: value3
          }];
        }
      }));
    }
  }))
});
var URLSearchParams2 = /* @__PURE__ */ instanceOf(globalThis.URLSearchParams, {
  representation: {
    id: "effect/schema/URLSearchParams",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.URLSearchParams`,
    Type: `globalThis.URLSearchParams`
  }),
  expected: "URLSearchParams",
  toCodecJson: () => link3()(String4.annotate({
    expected: "a query string that will be decoded as URLSearchParams"
  }), transform2({
    decode: (e) => new globalThis.URLSearchParams(e),
    encode: (params) => params.toString()
  }))
});
var Base64String = /* @__PURE__ */ String4.annotate({
  expected: "a base64 encoded string that will be decoded as Uint8Array",
  format: "byte",
  contentEncoding: "base64"
});
var Uint8Array2 = /* @__PURE__ */ instanceOf(globalThis.Uint8Array, {
  representation: {
    id: "effect/schema/Uint8Array",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.Uint8Array`,
    Type: `globalThis.Uint8Array`
  }),
  expected: "Uint8Array",
  toCodecJson: () => link3()(Base64String, uint8ArrayFromBase64String)
});
var arbitraryMinimumDateTimestamp = -864e13;
var arbitraryMaximumDateTimestamp = 864e13;
var arbitraryMinimumZonedDateTimeTimestamp = arbitraryMinimumDateTimestamp + 14 * 60 * 60 * 1e3;
var arbitraryMaximumZonedDateTimeTimestamp = arbitraryMaximumDateTimestamp - 14 * 60 * 60 * 1e3;
var arbitraryMinimumTimeZoneOffset = -12 * 60 * 60 * 1e3;
var arbitraryMaximumTimeZoneOffset = 14 * 60 * 60 * 1e3;
var immerable = /* @__PURE__ */ globalThis.Symbol.for("immer-draftable");
var payloadToken = {};
function makeClass(Inherited, identifier2, struct2, annotations, proto2) {
  const getClassSchema = getClassSchemaFactory(struct2, identifier2, annotations);
  const ClassTypeId = getClassTypeId(identifier2);
  const out = class extends Inherited {
    constructor(...[input, options]) {
      const internalOptions = options;
      const payload = internalOptions?.["~payload"];
      const value3 = payload?.token === payloadToken ? payload.value : struct2.make(input ?? {}, options);
      super(value3, {
        ...options,
        disableChecks: true,
        "~payload": {
          token: payloadToken,
          value: value3
        }
      });
    }
    static [TypeId25] = TypeId25;
    get [ClassTypeId]() {
      return ClassTypeId;
    }
    static [immerable] = true;
    static identifier = identifier2;
    static fields = struct2.fields;
    static get ast() {
      return getClassSchema(this).ast;
    }
    static pipe() {
      return pipeArguments(this, arguments);
    }
    static rebuild(ast) {
      return getClassSchema(this).rebuild(ast);
    }
    static make(input, options) {
      return make20(getClassSchema(this))(input ?? {}, options);
    }
    static makeOption(input, options) {
      return makeOption(getClassSchema(this))(input ?? {}, options);
    }
    static makeEffect(input, options) {
      return getClassSchema(this).makeEffect(input ?? {}, options);
    }
    static annotate(annotations2) {
      return this.rebuild(annotate(this.ast, annotations2));
    }
    static annotateKey(annotations2) {
      return this.rebuild(annotateKey(this.ast, annotations2));
    }
    static check(...checks) {
      return this.rebuild(appendChecks(this.ast, checks));
    }
    static extend(identifier3) {
      return (schema2, annotations2) => {
        const extension = isStruct(schema2) ? schema2 : Struct(schema2);
        const fields = {
          ...struct2.fields,
          ...extension.fields
        };
        const ast = struct(fields, struct2.ast.checks, {
          identifier: identifier3
        });
        return makeClass(this, identifier3, makeStruct(appendChecks(ast, extension.ast.checks), fields), annotations2, proto2);
      };
    }
    static mapFields(f, options) {
      return struct2.mapFields(f, options);
    }
  };
  if (proto2 !== void 0) {
    Object.assign(out.prototype, proto2(identifier2));
  }
  return out;
}
function getClassTransformation(self) {
  return new Transformation(transform((input) => new self(input, {
    "~payload": {
      token: payloadToken,
      value: input
    }
  })), passthrough());
}
function getClassTypeId(identifier2) {
  return `~effect/Schema/Class/${identifier2}`;
}
function getClassSchemaFactory(from, identifier2, annotations) {
  let memo;
  return (self) => {
    if (memo !== void 0) {
      return memo;
    }
    const ClassTypeId = getClassTypeId(identifier2);
    const isClassValue = (input) => input instanceof self || hasProperty(input, ClassTypeId);
    const transformation = getClassTransformation(self);
    const to = make22(new Declaration([from.ast], () => (input, ast, options) => {
      return isClassValue(input) ? succeed6(input) : fail6(new InvalidType(ast, input, options));
    }, {
      identifier: identifier2,
      [CONSTRUCTOR_ANNOTATION_KEY]: ([from2]) => ({
        isConstructed: isClassValue,
        link: new Link(from2, transformation)
      }),
      toCodec: ([from2]) => new Link(from2.ast, transformation),
      toEquivalence: ([from2]) => from2,
      toFormatter: ([from2]) => (t) => `${self.identifier}(${from2(t)})`,
      [SENTINELS_ANNOTATION_KEY]: collectSentinels(from.ast),
      ...annotations
    }));
    return memo = decodeTo2(to, transformation)(from);
  };
}
function isStruct(schema2) {
  return isSchema(schema2);
}
var Error4 = (identifier2) => (schema2, annotations) => {
  const struct2 = isStruct(schema2) ? schema2 : Struct(schema2);
  const self = makeClass(Error2, identifier2, struct2, annotations, (identifier3) => ({
    name: identifier3
  }));
  return self;
};
var TaggedError3 = (identifier2) => {
  return (tagValue, schema2, annotations) => {
    const struct2 = isStruct(schema2) ? schema2.mapFields((fields) => ({
      _tag: tag(tagValue),
      ...fields
    }), {
      unsafePreserveChecks: true
    }) : TaggedStruct(tagValue, schema2);
    return Error4(identifier2 ?? tagValue)(struct2, annotations);
  };
};
var toCodecStringTree2 = toCodecStringTree;
var Json2 = /* @__PURE__ */ make22(/* @__PURE__ */ annotate(Json, {
  toCode: () => ({
    runtime: "Schema.Json",
    Type: "Schema.Json"
  })
}));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Terminal.js
var TypeId26 = "~effect/Terminal";
var QuitErrorTypeId = "~effect/Terminal/QuitError";
var QuitError = class extends (/* @__PURE__ */ Error4("QuitError")({
  _tag: /* @__PURE__ */ tag("QuitError")
})) {
  /**
   * Marks this value as a terminal quit error for runtime guards.
   *
   * @since 4.0.0
   */
  [QuitErrorTypeId] = QuitErrorTypeId;
};
var isQuitError = (u) => hasProperty(u, QuitErrorTypeId);
var Terminal = /* @__PURE__ */ Service("effect/Terminal");
var make23 = (impl) => Terminal.of({
  ...impl,
  [TypeId26]: TypeId26
});

// node_modules/.pnpm/@effect+platform-node-shared@4.0.2_effect@4.0.2/node_modules/@effect/platform-node-shared/dist/NodeTerminal.js
import * as readline from "node:readline";
var make24 = /* @__PURE__ */ fnUntraced2(function* (shouldQuit = defaultShouldQuit) {
  const stdin = process.stdin;
  const stdout = process.stdout;
  const lines2 = yield* make8();
  let inputEnded = stdin.readableEnded;
  let readlineActive = false;
  const onStdinEnd = () => {
    inputEnded = true;
    if (!readlineActive) {
      endUnsafe(lines2);
    }
  };
  stdin.once("end", onStdinEnd);
  yield* addFinalizer3(() => sync2(() => stdin.off("end", onStdinEnd)));
  const rlRef = yield* make10({
    acquire: acquireRelease2(sync2(() => {
      const rl = readline.createInterface({
        input: stdin,
        escapeCodeTimeout: 50
      });
      const onLine = (line) => offerUnsafe(lines2, line);
      const onClose = () => {
        readlineActive = false;
        endUnsafe(lines2);
      };
      readlineActive = true;
      readline.emitKeypressEvents(stdin, rl);
      rl.on("line", onLine);
      rl.once("close", onClose);
      if (stdin.isTTY) {
        stdin.setRawMode(true);
      }
      return {
        rl,
        onClose,
        onLine
      };
    }), ({
      rl,
      onClose,
      onLine
    }) => sync2(() => {
      readlineActive = false;
      rl.off("line", onLine);
      rl.off("close", onClose);
      if (stdin.isTTY) {
        stdin.setRawMode(false);
      }
      rl.close();
      if (inputEnded) {
        endUnsafe(lines2);
      }
    })),
    idleTimeToLive: "10 millis"
  });
  const columns = sync2(() => stdout.columns ?? 0);
  const rows = sync2(() => stdout.rows ?? 0);
  const readInput = gen2(function* () {
    const queue = yield* make8();
    const handleKeypress = (s, k) => {
      const userInput = {
        input: fromUndefinedOr(s),
        key: {
          name: k.name ?? "",
          ctrl: !!k.ctrl,
          meta: !!k.meta,
          shift: !!k.shift
        }
      };
      offerUnsafe(queue, userInput);
      if (shouldQuit(userInput)) {
        endUnsafe(queue);
      }
    };
    const keepAlive = setInterval(() => {
    }, 2147483647);
    const handleEnd = () => {
      clearInterval(keepAlive);
      endUnsafe(queue);
    };
    yield* addFinalizer3(() => sync2(() => {
      clearInterval(keepAlive);
      stdin.off("keypress", handleKeypress);
      stdin.off("end", handleEnd);
    }));
    stdin.on("keypress", handleKeypress);
    if (inputEnded) {
      handleEnd();
    } else {
      yield* get3(rlRef);
      stdin.once("end", handleEnd);
    }
    return queue;
  });
  const readLine = suspend2(() => poll(lines2).pipe(flatMap4(match({
    onNone: () => scoped2(andThen2(get3(rlRef), take2(lines2))),
    onSome: succeed6
  })), mapError2(() => new QuitError({}))));
  const display = (prompt) => uninterruptible2(callback2((resume) => {
    stdout.write(prompt, (err) => isNullish(err) ? resume(void_3) : resume(fail6(badArgument({
      module: "Terminal",
      method: "display",
      description: "Failed to write prompt to stdout",
      cause: err
    }))));
  }));
  return make23({
    columns,
    rows,
    readInput,
    readLine,
    display
  });
});
var layer10 = /* @__PURE__ */ effect(Terminal, /* @__PURE__ */ make24(defaultShouldQuit));
function defaultShouldQuit(input) {
  return input.key.ctrl && (input.key.name === "c" || input.key.name === "d");
}

// node_modules/.pnpm/@effect+platform-node@4.0.2_effect@4.0.2_redis@6.3.0/node_modules/@effect/platform-node/dist/NodeTerminal.js
var layer11 = layer10;

// node_modules/.pnpm/@effect+platform-node@4.0.2_effect@4.0.2_redis@6.3.0/node_modules/@effect/platform-node/dist/NodeServices.js
var layer12 = /* @__PURE__ */ provideMerge(layer, /* @__PURE__ */ mergeAll2(layer5, layer3, layer7, layer9, layer11));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Console.js
var Console = ConsoleRef;
var consoleWith = (f) => withFiber((fiber2) => f(fiber2.getRef(Console)));
var error = (...args2) => consoleWith((console) => sync(() => {
  console.error(...args2);
}));
var log = (...args2) => consoleWith((console) => sync(() => {
  console.log(...args2);
}));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/CliOutput.js
var Formatter = /* @__PURE__ */ Reference("effect/cli/CliOutput", {
  defaultValue: () => defaultFormatter2()
});
var escapeControlCharacters = (text) => (
  // oxlint-disable-next-line no-control-regex
  text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, (character) => `\\x${character.charCodeAt(0).toString(16).padStart(2, "0")}`)
);
var defaultFormatter2 = (options) => {
  const globalProcess = globalThis.process;
  const hasProcess = typeof globalProcess === "object" && globalProcess !== null;
  const useColor = options?.colors !== void 0 ? options.colors : hasProcess && typeof globalProcess.stdout === "object" && globalProcess.stdout !== null && globalProcess.stdout.isTTY === true && !globalProcess.env?.NO_COLOR;
  const colors2 = useColor ? {
    bold: (text) => `\x1B[1m${text}\x1B[0m`,
    dim: (text) => `\x1B[2m${text}\x1B[0m`,
    cyan: (text) => `\x1B[36m${text}\x1B[0m`,
    green: (text) => `\x1B[32m${text}\x1B[0m`,
    blue: (text) => `\x1B[34m${text}\x1B[0m`,
    yellow: (text) => `\x1B[33m${text}\x1B[0m`,
    magenta: (text) => `\x1B[35m${text}\x1B[0m`
  } : {
    bold: (text) => text,
    dim: (text) => text,
    cyan: (text) => text,
    green: (text) => text,
    blue: (text) => text,
    yellow: (text) => text,
    magenta: (text) => text
  };
  const reset2 = useColor ? "\x1B[0m" : "";
  const red2 = useColor ? "\x1B[31m" : "";
  const bold2 = useColor ? "\x1B[1m" : "";
  return {
    formatHelpDoc: (doc) => formatHelpDocImpl(doc, colors2),
    formatCliError: (error2) => escapeControlCharacters(error2.message),
    formatError: (error2) => {
      return `
${bold2}${red2}ERROR${reset2}
  ${escapeControlCharacters(error2.message)}${reset2}`;
    },
    formatErrors: (errors) => {
      if (errors.length === 0) return "";
      if (errors.length === 1) {
        return `
${bold2}${red2}ERROR${reset2}
  ${escapeControlCharacters(errors[0].message)}${reset2}`;
      }
      const grouped = /* @__PURE__ */ new Map();
      for (const error2 of errors) {
        const tag2 = error2._tag ?? "Error";
        const group = grouped.get(tag2) ?? [];
        group.push(error2);
        grouped.set(tag2, group);
      }
      const sections = [];
      sections.push(`
${bold2}${red2}ERRORS${reset2}`);
      for (const [, group] of grouped) {
        for (const error2 of group) {
          sections.push(`  ${escapeControlCharacters(error2.message)}${reset2}`);
        }
      }
      return sections.join("\n");
    },
    formatVersion: (name, version) => `${colors2.bold(name)} ${colors2.dim("v")}${colors2.bold(version)}`
  };
};
var stripAnsi = (text) => {
  return text.replace(/\u001B\[[0-9;]*m/g, "");
};
var graphemeSegmenter = /* @__PURE__ */ new Intl.Segmenter(void 0, {
  granularity: "grapheme"
});
var zeroWidthCodePoints = /[\p{Mark}\p{Control}\p{Default_Ignorable_Code_Point}]/gu;
var emojiPresentation = new RegExp("\\p{Emoji_Presentation}", "u");
var isFullWidthCodePoint = (codePoint) => {
  if (codePoint < 4352) return false;
  return codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || codePoint >= 11904 && codePoint <= 12350 || codePoint >= 12352 && codePoint <= 42191 || codePoint >= 44032 && codePoint <= 55203 || codePoint >= 63744 && codePoint <= 64255 || codePoint >= 65040 && codePoint <= 65049 || codePoint >= 65072 && codePoint <= 65135 || codePoint >= 65280 && codePoint <= 65376 || codePoint >= 65504 && codePoint <= 65510 || codePoint >= 110592 && codePoint <= 111359 || codePoint >= 127488 && codePoint <= 127569 || codePoint >= 131072 && codePoint <= 262141;
};
var graphemeWidth = (grapheme) => {
  const visible = grapheme.replace(zeroWidthCodePoints, "");
  if (visible.length === 0) return 0;
  if (emojiPresentation.test(grapheme) || grapheme.includes("\uFE0F")) return 2;
  return isFullWidthCodePoint(visible.codePointAt(0)) ? 2 : 1;
};
var visualLength = (text) => {
  let length = 0;
  for (const {
    segment
  } of graphemeSegmenter.segment(stripAnsi(text))) {
    length += graphemeWidth(segment);
  }
  return length;
};
var pad = (s, width) => {
  const actualLength = visualLength(s);
  const padding = Math.max(0, width - actualLength);
  return s + " ".repeat(padding);
};
var renderTable = (rows, widthCap) => {
  const maxColumn = Math.max(...rows.map((r) => visualLength(r.left))) + 4;
  const col = widthCap === void 0 ? maxColumn : Math.min(maxColumn, widthCap);
  return rows.map(({
    left,
    right
  }) => `  ${pad(left, Math.max(col, visualLength(left) + 1))}${right}`).join("\n");
};
var formatSubcommandName = (name, alias) => alias ? `${name}, ${alias}` : name;
var formatHelpDocImpl = (doc, colors2) => {
  const sections = [];
  if (doc.description) {
    sections.push(colors2.bold("DESCRIPTION"));
    sections.push(`  ${doc.description}`);
    sections.push("");
  }
  sections.push(colors2.bold("USAGE"));
  sections.push(`  ${colors2.cyan(doc.usage)}`);
  sections.push("");
  if (doc.args && doc.args.length > 0) {
    sections.push(colors2.bold("ARGUMENTS"));
    const argRows = doc.args.map((arg) => {
      let name = arg.name;
      if (arg.variadic) {
        name += "...";
      }
      const coloredName = colors2.green(name);
      const coloredType = colors2.dim(arg.type);
      const nameType = `${coloredName} ${coloredType}`;
      const optionalSuffix = arg.required ? "" : colors2.dim(" (optional)");
      const description = getOrElse(arg.description, () => "") + optionalSuffix;
      return {
        left: nameType,
        right: description
      };
    });
    sections.push(renderTable(argRows, 25));
    sections.push("");
  }
  if (doc.flags.length > 0) {
    sections.push(colors2.bold("FLAGS"));
    const flagRows = doc.flags.map((flag) => {
      const names = [];
      names.push(colors2.green(`--${flag.name}`));
      for (const alias of flag.aliases) {
        names.push(colors2.green(alias));
      }
      const namesPart = names.join(", ");
      const typePart = flag.type !== "boolean" ? ` ${colors2.dim(flag.type)}` : "";
      return {
        left: namesPart + typePart,
        right: getOrElse(flag.description, () => "")
      };
    });
    sections.push(renderTable(flagRows));
    sections.push("");
  }
  if (doc.globalFlags && doc.globalFlags.length > 0) {
    sections.push(colors2.bold("GLOBAL FLAGS"));
    const globalFlagRows = doc.globalFlags.map((flag) => {
      const names = [];
      names.push(colors2.green(`--${flag.name}`));
      for (const alias of flag.aliases) {
        names.push(colors2.green(alias));
      }
      const namesPart = names.join(", ");
      const typePart = flag.type !== "boolean" ? ` ${colors2.dim(flag.type)}` : "";
      return {
        left: namesPart + typePart,
        right: getOrElse(flag.description, () => "")
      };
    });
    sections.push(renderTable(globalFlagRows));
    sections.push("");
  }
  if (doc.subcommands && doc.subcommands.length > 0) {
    const ungrouped = doc.subcommands.find((group) => group.group === void 0);
    if (ungrouped) {
      sections.push(colors2.bold("SUBCOMMANDS"));
      sections.push(renderTable(ungrouped.commands.map((sub) => ({
        left: colors2.cyan(formatSubcommandName(sub.name, sub.alias)),
        right: sub.shortDescription ?? sub.description
      })), 20));
      if (doc.subcommands.length > 1) {
        sections.push("");
      }
    }
    for (const group of doc.subcommands) {
      if (group.group === void 0) continue;
      sections.push(colors2.bold(`${group.group}:`));
      sections.push(renderTable(group.commands.map((sub) => ({
        left: colors2.cyan(formatSubcommandName(sub.name, sub.alias)),
        right: sub.shortDescription ?? sub.description
      })), 20));
      sections.push("");
    }
  }
  if (doc.examples && doc.examples.length > 0) {
    sections.push(colors2.bold("EXAMPLES"));
    let first = true;
    let previousHadDescription = false;
    for (const example of doc.examples) {
      if (example.description) {
        if (!first) sections.push("");
        sections.push(`  ${colors2.dim(`# ${example.description}`)}`);
      } else if (previousHadDescription) {
        sections.push("");
      }
      sections.push(`  ${colors2.cyan(example.command)}`);
      first = false;
      previousHadDescription = !!example.description;
    }
    sections.push("");
  }
  if (sections[sections.length - 1] === "") {
    sections.pop();
  }
  return sections.join("\n");
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/completions/bash.js
var escapeForBash = (s) => s.replace(/'/g, "'\\''");
var sanitizeFunctionName = (s) => s.replace(/[^a-zA-Z0-9_]/g, "_");
var flagNamesForWordlist = (flag) => {
  const names = [`--${flag.name}`];
  for (const alias of flag.aliases) {
    names.push(alias.length === 1 ? `-${alias}` : `--${alias}`);
  }
  if (flag.type._tag === "Boolean") {
    names.push(`--no-${flag.name}`);
  }
  return names;
};
var buildFlagGroupDeclarations = (flags, lines2) => {
  if (flags.length === 0) return;
  const groups = flags.map(flagNamesForWordlist);
  lines2.push(`  local ${groups.map((_, index) => `_used_${index}=""`).join(" ")}`);
  lines2.push(`  for ((i = 1; i < cword; i++)); do`);
  lines2.push(`    case "\${words[i]%%=*}" in`);
  groups.forEach((forms, index) => {
    lines2.push(`      ${forms.join("|")}) _used_${index}=1 ;;`);
  });
  lines2.push(`    esac`);
  lines2.push(`  done`);
  lines2.push(`  local _filtered_flags=""`);
  groups.forEach((forms, index) => {
    lines2.push(`  [[ -n "$_used_${index}" ]] || _filtered_flags+=" ${forms.join(" ")}"`);
  });
  lines2.push(``);
};
var choicesHelper = (helperName, lines2) => {
  lines2.push(`${helperName}()`);
  lines2.push(`{`);
  lines2.push(`  local _cur="$1" _word="$2"; shift 2`);
  lines2.push(``);
  lines2.push(`  local _head="\${_cur%"$_word"}"`);
  lines2.push(`  local _open=""`);
  lines2.push(`  case "$_head" in`);
  lines2.push(`    *\\') _open="'" ;;`);
  lines2.push(`    *\\") _open='"' ;;`);
  lines2.push(`  esac`);
  lines2.push(``);
  lines2.push(`  local _prefix="$_cur" _committed="$_head"`);
  lines2.push(`  _prefix=\${_prefix//\\\\/}; _prefix=\${_prefix//\\"/}; _prefix=\${_prefix//\\'/}`);
  lines2.push(`  _committed=\${_committed//\\\\/}; _committed=\${_committed//\\"/}; _committed=\${_committed//\\'/}`);
  lines2.push(``);
  lines2.push(`  COMPREPLY=()`);
  lines2.push(`  local _choice _rest _match`);
  lines2.push(`  for _choice in "$@"; do`);
  lines2.push(`    [[ "$_choice" == "$_prefix"* ]] || continue`);
  lines2.push(`    _rest="\${_choice#"$_committed"}"`);
  lines2.push(`    case "$_open" in`);
  lines2.push(`      "'")`);
  lines2.push(`        if [[ "$_head" == "'" ]]; then`);
  lines2.push(`          _match=\${_rest//\\'/\\'\\\\\\'\\'}`);
  lines2.push(`        else`);
  lines2.push(`          [[ "$_rest" == *\\'* ]] && continue`);
  lines2.push(`          _match="$_rest"`);
  lines2.push(`        fi`);
  lines2.push(`        ;;`);
  lines2.push(`      '"')`);
  lines2.push(`        _match="\${_rest//\\\\/\\\\\\\\}"`);
  lines2.push(`        _match="\${_match//\\$/\\\\$}"`);
  lines2.push('        _match="${_match//\\`/\\\\\\`}"');
  lines2.push(`        _match="\${_match//\\"/\\\\\\"}"`);
  lines2.push(`        ;;`);
  lines2.push(`      *)`);
  lines2.push(`        printf -v _match '%q' "$_rest"`);
  lines2.push(`        [[ -z "$_head" && "$_match" == '~'* ]] && _match="\\\\$_match"`);
  lines2.push(`        ;;`);
  lines2.push(`    esac`);
  lines2.push(`    [[ -n "$_open" && "$_match" == *"$_open" ]] && _match+="$_open"`);
  lines2.push(`    COMPREPLY+=("$_match")`);
  lines2.push(`  done`);
  lines2.push(`}`);
  lines2.push(``);
};
var choiceCompletion = (helperName, values) => `${helperName} "$cur" "$_comp_word" ${values.map((value3) => `'${escapeForBash(value3)}'`).join(" ")}`;
var flagValueCompletion = (type, helperName) => {
  switch (type._tag) {
    case "Boolean":
      return void 0;
    case "Choice":
      return choiceCompletion(helperName, type.values);
    case "Path":
      if (type.pathType === "directory") return `COMPREPLY=( $(compgen -d -- "$cur") )`;
      return `COMPREPLY=( $(compgen -f -- "$cur") )`;
    default:
      return void 0;
  }
};
var argCompletion = (type, helperName) => {
  switch (type._tag) {
    case "Choice":
      return choiceCompletion(helperName, type.values);
    case "Path":
      if (type.pathType === "directory") return `COMPREPLY=( $(compgen -d -- "$cur") )`;
      return `COMPREPLY=( $(compgen -f -- "$cur") )`;
    default:
      return void 0;
  }
};
var generateFunction = (descriptor, parentPath, lines2, helperName) => {
  const currentPath = [...parentPath, descriptor.name];
  const funcName = `_${currentPath.map(sanitizeFunctionName).join("_")}`;
  lines2.push(`${funcName}()`);
  lines2.push(`{`);
  lines2.push(`  local cur prev words cword i`);
  lines2.push(parentPath.length === 0 ? `  local _command_index=0` : `  local _command_index="$1"`);
  lines2.push(`  _init_completion -n "$COMP_WORDBREAKS" || return`);
  if (parentPath.length === 0) {
    lines2.push(`  local _comp_word="$2"`);
  }
  lines2.push(``);
  const flagsWithValues = descriptor.flags.filter((f) => f.type._tag !== "Boolean");
  if (flagsWithValues.length > 0) {
    lines2.push(`  # Flag value completions`);
    lines2.push(`  case "$prev" in`);
    for (const flag of flagsWithValues) {
      const longNames = [`--${flag.name}`];
      for (const alias of flag.aliases) {
        longNames.push(alias.length === 1 ? `-${alias}` : `--${alias}`);
      }
      const completion = flagValueCompletion(flag.type, helperName);
      if (completion) {
        lines2.push(`    ${longNames.join("|")})`);
        lines2.push(`      ${completion}`);
        lines2.push(`      return`);
        lines2.push(`      ;;`);
      }
    }
    lines2.push(`  esac`);
    lines2.push(``);
  }
  if (descriptor.subcommands.length > 0) {
    lines2.push(`  # Subcommand dispatch`);
    lines2.push(`  local cmd _skip_next=0`);
    lines2.push(`  for ((i = _command_index + 1; i < cword; i++)); do`);
    lines2.push(`    if (( _skip_next )); then`);
    lines2.push(`      _skip_next=0`);
    lines2.push(`      continue`);
    lines2.push(`    fi`);
    lines2.push(`    case "\${words[i]}" in`);
    for (const flag of descriptor.flags) {
      if (flag.type._tag === "Boolean") continue;
      const forms = flagNamesForWordlist(flag);
      lines2.push(`      ${forms.join("|")}) _skip_next=1 ;;`);
      lines2.push(`      ${forms.map((form) => `${form}=*`).join("|")}) ;;`);
    }
    for (const sub of descriptor.subcommands) {
      const subFuncName = `_${[...currentPath, sub.name].map(sanitizeFunctionName).join("_")}`;
      lines2.push(`      ${sub.name})`);
      lines2.push(`        ${subFuncName} "$i"`);
      lines2.push(`        return`);
      lines2.push(`        ;;`);
    }
    lines2.push(`    esac`);
    lines2.push(`  done`);
    lines2.push(``);
  }
  buildFlagGroupDeclarations(descriptor.flags, lines2);
  if (descriptor.flags.length > 0 || descriptor.subcommands.length > 0) {
    lines2.push(`  # Complete flags (filtered) and subcommands`);
    lines2.push(`  if [[ "$cur" == -* ]]; then`);
    if (descriptor.flags.length > 0) {
      lines2.push(`    COMPREPLY=( $(compgen -W "$_filtered_flags" -- "$cur") )`);
    }
    lines2.push(`    return`);
    lines2.push(`  fi`);
    lines2.push(``);
  }
  const argsWithCompletions = descriptor.arguments.flatMap((argument, index) => {
    const completion = argCompletion(argument.type, helperName);
    return completion === void 0 ? [] : [{
      argument,
      completion,
      index
    }];
  });
  if (argsWithCompletions.length > 0) {
    lines2.push(`  # Positional argument completions`);
    lines2.push(`  local _position=0 _skip_next=0 _end_of_options=0`);
    lines2.push(`  for ((i = _command_index + 1; i < cword; i++)); do`);
    lines2.push(`    if (( _skip_next )); then`);
    lines2.push(`      _skip_next=0`);
    lines2.push(`      continue`);
    lines2.push(`    fi`);
    lines2.push(`    if (( _end_of_options )); then`);
    lines2.push(`      ((_position += 1))`);
    lines2.push(`      continue`);
    lines2.push(`    fi`);
    lines2.push(`    case "\${words[i]}" in`);
    lines2.push(`      --) _end_of_options=1 ;;`);
    for (const flag of descriptor.flags) {
      const forms = flagNamesForWordlist(flag);
      if (flag.type._tag === "Boolean") {
        lines2.push(`      ${forms.join("|")}) ;;`);
      } else {
        lines2.push(`      ${forms.join("|")}) _skip_next=1 ;;`);
        lines2.push(`      ${forms.map((form) => `${form}=*`).join("|")}) ;;`);
      }
    }
    lines2.push(`      -*) ;;`);
    lines2.push(`      *) ((_position += 1)) ;;`);
    lines2.push(`    esac`);
    lines2.push(`  done`);
    lines2.push(`  case "$_position" in`);
    for (const {
      argument,
      completion,
      index
    } of argsWithCompletions) {
      if (argument.variadic) continue;
      lines2.push(`    ${index})`);
      lines2.push(`      ${completion}`);
      lines2.push(`      return`);
      lines2.push(`      ;;`);
    }
    lines2.push(`  esac`);
    const variadic2 = argsWithCompletions.find(({
      argument
    }) => argument.variadic);
    if (variadic2 !== void 0) {
      lines2.push(`  if (( _position >= ${variadic2.index} )); then`);
      lines2.push(`    ${variadic2.completion}`);
      lines2.push(`    return`);
      lines2.push(`  fi`);
    }
  } else if (descriptor.subcommands.length > 0) {
    const subNames = descriptor.subcommands.map((s) => s.name);
    lines2.push(`  COMPREPLY=( $(compgen -W '${subNames.join(" ")}' -- "$cur") )`);
  }
  lines2.push(`}`);
  lines2.push(``);
  for (const sub of descriptor.subcommands) {
    generateFunction(sub, currentPath, lines2, helperName);
  }
};
var generate = (executableName, descriptor) => {
  const lines2 = [];
  const safeName = sanitizeFunctionName(executableName);
  const helperName = `_${safeName}--choices`;
  lines2.push(`###-begin-${escapeForBash(executableName)}-completions-###`);
  lines2.push(`#`);
  lines2.push(`# Static completion script for Bash`);
  lines2.push(`#`);
  lines2.push(`# Installation:`);
  lines2.push(`#   ${escapeForBash(executableName)} --completions bash >> ~/.bashrc`);
  lines2.push(`#`);
  lines2.push(``);
  lines2.push(`if ! type _init_completion &>/dev/null; then`);
  lines2.push(`  _init_completion()`);
  lines2.push(`  {`);
  lines2.push(`    COMPREPLY=()`);
  lines2.push(`    local _i _j=0 _piece _line="$COMP_LINE"`);
  lines2.push(`    words=("\${COMP_WORDS[0]}")`);
  lines2.push(`    cword=0`);
  lines2.push(`    _line="\${_line#*"\${COMP_WORDS[0]}"}"`);
  lines2.push(`    for ((_i = 1; _i < \${#COMP_WORDS[@]}; _i++)); do`);
  lines2.push(`      _piece="\${COMP_WORDS[_i]}"`);
  lines2.push(`      if [[ "$_line" == [[:blank:]]* ]]; then`);
  lines2.push(`        ((_j++))`);
  lines2.push(`        words[_j]="$_piece"`);
  lines2.push(`      else`);
  lines2.push(`        words[_j]="\${words[_j]}$_piece"`);
  lines2.push(`      fi`);
  lines2.push(`      ((_i == COMP_CWORD)) && cword=$_j`);
  lines2.push(`      _line="\${_line#*"$_piece"}"`);
  lines2.push(`    done`);
  lines2.push(`    cur="\${words[cword]}"`);
  lines2.push(`    prev=""`);
  lines2.push(`    ((cword > 0)) && prev="\${words[cword-1]}"`);
  lines2.push(`    return 0`);
  lines2.push(`  }`);
  lines2.push(`fi`);
  lines2.push(``);
  choicesHelper(helperName, lines2);
  generateFunction(descriptor, [], lines2, helperName);
  lines2.push(`complete -F _${safeName} ${escapeForBash(executableName)}`);
  lines2.push(`###-end-${escapeForBash(executableName)}-completions-###`);
  return lines2.join("\n");
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/completions/fish.js
var escapeFishString = (s) => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
var escapeFishChoice = (s) => escapeFishString(s.replace(/[^A-Za-z0-9_.,/@%+-]/gu, "\\$&"));
var subcommandCondition = (parentPath, childSubcommandNames) => {
  if (parentPath.length === 0) {
    if (childSubcommandNames.length > 0) {
      return `__fish_use_subcommand`;
    }
    return ``;
  }
  const parentCondition = parentPath.map((parent) => `__fish_seen_subcommand_from ${parent}`).join("; and ");
  if (childSubcommandNames.length > 0) {
    return `${parentCondition}; and not __fish_seen_subcommand_from ${childSubcommandNames.join(" ")}`;
  }
  return parentCondition;
};
var flagContainsOptCondition = (flag) => {
  const optArgs = [];
  for (const alias of flag.aliases) {
    if (alias.length === 1) {
      optArgs.push(`-s ${alias}`);
    }
  }
  optArgs.push(flag.name);
  for (const alias of flag.aliases) {
    if (alias.length > 1) {
      optArgs.push(alias);
    }
  }
  if (flag.type._tag === "Boolean") {
    optArgs.push(`no-${flag.name}`);
  }
  return `not __fish_contains_opt ${optArgs.join(" ")}`;
};
var valueFlagDedupCondition = (flag) => {
  const forms = [`--${flag.name}`];
  for (const alias of flag.aliases) {
    forms.push(alias.length === 1 ? `-${alias}` : `--${alias}`);
  }
  return `begin; ${flagContainsOptCondition(flag)}; or contains -- (commandline -poc)[-1] ${forms.join(" ")}; end`;
};
var flagCompletionArgs = (flag) => {
  const args2 = [`-l ${flag.name}`];
  for (const alias of flag.aliases) {
    if (alias.length === 1) {
      args2.push(`-s ${alias}`);
    } else {
      args2.push(`-l ${alias}`);
    }
  }
  if (flag.description) {
    args2.push(`-d '${escapeFishString(flag.description)}'`);
  }
  const valueArgs = flagValueArgs(flag.type);
  if (valueArgs) {
    args2.push(valueArgs);
  }
  return args2;
};
var flagValueArgs = (type) => {
  switch (type._tag) {
    case "Boolean":
      return void 0;
    case "Choice":
      return `-r -f -a '${type.values.map(escapeFishChoice).join(" ")}'`;
    case "Path":
      if (type.pathType === "directory") return `-r -F`;
      return `-r -F`;
    default:
      return `-r -f`;
  }
};
var argValueArgs = (type) => {
  switch (type._tag) {
    case "Choice":
      return `-r -f -a '${type.values.map(escapeFishChoice).join(" ")}'`;
    case "Path":
      return `-r -F`;
    default:
      return void 0;
  }
};
var generateCompletions = (executableName, descriptor, parentPath, lines2) => {
  const allSubNames = descriptor.subcommands.map((s) => s.name);
  const condition = subcommandCondition(parentPath, allSubNames);
  const conditionArg = condition ? `-n '${condition}'` : ``;
  const hasPathArgs = descriptor.arguments.some((a) => a.type._tag === "Path");
  if (!hasPathArgs) {
    const parts = [`complete -c ${executableName}`];
    if (conditionArg) parts.push(conditionArg);
    parts.push(`-f`);
    lines2.push(parts.join(" "));
  }
  for (const sub of descriptor.subcommands) {
    const parts = [`complete -c ${executableName}`];
    if (conditionArg) parts.push(conditionArg);
    parts.push(`-f -a '${escapeFishString(sub.name)}'`);
    if (sub.description) {
      parts.push(`-d '${escapeFishString(sub.description)}'`);
    }
    lines2.push(parts.join(" "));
  }
  for (const flag of descriptor.flags) {
    const isBoolean3 = flag.type._tag === "Boolean";
    const dedup = isBoolean3 ? flagContainsOptCondition(flag) : valueFlagDedupCondition(flag);
    const flagCondition = condition ? `${condition}; and ${dedup}` : dedup;
    const flagCondArg = flagCondition ? `-n '${flagCondition}'` : ``;
    const parts = [`complete -c ${executableName}`];
    if (flagCondArg) parts.push(flagCondArg);
    parts.push(...flagCompletionArgs(flag));
    lines2.push(parts.join(" "));
    if (isBoolean3) {
      const negParts = [`complete -c ${executableName}`];
      if (flagCondArg) negParts.push(flagCondArg);
      negParts.push(`-l no-${flag.name}`);
      if (flag.description) {
        negParts.push(`-d '${escapeFishString(`Disable ${flag.name}`)}'`);
      }
      lines2.push(negParts.join(" "));
    }
  }
  if (descriptor.flags.length > 0) {
    const notDash = `not string match -q -- "-*" (commandline -ct)`;
    const bareBase = condition ? `${condition}; and ${notDash}` : notDash;
    for (const flag of descriptor.flags) {
      const bareCondition = `${bareBase}; and ${flagContainsOptCondition(flag)}`;
      const isBoolean3 = flag.type._tag === "Boolean";
      const parts = [`complete -c ${executableName}`];
      parts.push(`-n '${bareCondition}'`);
      parts.push(`-f -a '--${flag.name}'`);
      if (flag.description) {
        parts.push(`-d '${escapeFishString(flag.description)}'`);
      }
      lines2.push(parts.join(" "));
      if (isBoolean3) {
        const negParts = [`complete -c ${executableName}`];
        negParts.push(`-n '${bareCondition}'`);
        negParts.push(`-f -a '--no-${flag.name}'`);
        if (flag.description) {
          negParts.push(`-d '${escapeFishString(`Disable ${flag.name}`)}'`);
        }
        lines2.push(negParts.join(" "));
      }
    }
  }
  for (const arg of descriptor.arguments) {
    const valueArg = argValueArgs(arg.type);
    if (valueArg) {
      const parts = [`complete -c ${executableName}`];
      if (conditionArg) parts.push(conditionArg);
      parts.push(valueArg);
      if (arg.description) {
        parts.push(`-d '${escapeFishString(arg.description)}'`);
      }
      lines2.push(parts.join(" "));
    }
  }
  for (const sub of descriptor.subcommands) {
    generateCompletions(executableName, sub, [...parentPath, sub.name], lines2);
  }
};
var generate2 = (executableName, descriptor) => {
  const lines2 = [];
  lines2.push(`###-begin-${executableName}-completions-###`);
  lines2.push(`#`);
  lines2.push(`# Static completion script for Fish`);
  lines2.push(`#`);
  lines2.push(`# Installation:`);
  lines2.push(`#   ${executableName} --completions fish > ~/.config/fish/completions/${executableName}.fish`);
  lines2.push(`#`);
  lines2.push(``);
  generateCompletions(executableName, descriptor, [], lines2);
  lines2.push(``);
  lines2.push(`###-end-${executableName}-completions-###`);
  return lines2.join("\n");
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/completions/zsh.js
var escapeZsh = (s) => s.replace(/\\/g, "\\\\").replace(/'/g, "'\\''").replace(/:/g, "\\:");
var escapeZshChoice = (s) => s.replace(/[^A-Za-z0-9_.,/@%+-]/gu, "\\$&").replace(/'/g, "'\\''");
var sanitize = (s) => s.replace(/[^a-zA-Z0-9_]/g, "_");
var allForms = (flag) => {
  const forms = [`--${flag.name}`];
  for (const alias of flag.aliases) {
    forms.push(alias.length === 1 ? `-${alias}` : `--${alias}`);
  }
  if (flag.type._tag === "Boolean") {
    forms.push(`--no-${flag.name}`);
  }
  return forms;
};
var valueAction = (type) => {
  switch (type._tag) {
    case "Boolean":
      return "";
    case "Choice":
      return `:value:(${type.values.map(escapeZshChoice).join(" ")})`;
    case "Path":
      return type.pathType === "directory" ? `:directory:_directories` : `:file:_files`;
    case "Int":
      return `:integer:`;
    case "Finite":
      return `:float:`;
    case "Date":
      return `:date:`;
    default:
      return `:value:`;
  }
};
var argAction = (type) => {
  switch (type._tag) {
    case "Choice":
      return `(${type.values.map(escapeZshChoice).join(" ")})`;
    case "Path":
      return type.pathType === "directory" ? `_directories` : `_files`;
    default:
      return ``;
  }
};
var flagSpecs = (flag) => {
  const specs = [];
  const desc = flag.description ? `[${escapeZsh(flag.description)}]` : "";
  const action = valueAction(flag.type);
  const excl = `(${allForms(flag).join(" ")})`;
  specs.push(`'${excl}--${flag.name}${desc}${action}'`);
  for (const alias of flag.aliases) {
    const prefix = alias.length === 1 ? "-" : "--";
    specs.push(`'${excl}${prefix}${alias}${desc}${action}'`);
  }
  if (flag.type._tag === "Boolean") {
    const negDesc = flag.description ? `[${escapeZsh(`Disable ${flag.name}`)}]` : "";
    specs.push(`'${excl}--no-${flag.name}${negDesc}'`);
  }
  return specs;
};
var argSpec = (arg) => {
  const desc = arg.description ? escapeZsh(arg.description) : arg.name;
  const action = argAction(arg.type);
  const prefix = arg.variadic ? "*" : "";
  return `'${prefix}:${desc}:${action}'`;
};
var generateFunction2 = (descriptor, parentPath, lines2) => {
  const currentPath = [...parentPath, descriptor.name];
  const funcName = `_${currentPath.map(sanitize).join("_")}`;
  lines2.push(`${funcName}() {`);
  if (descriptor.subcommands.length > 0) {
    lines2.push(`  local context state state_descr line`);
    lines2.push(`  typeset -A opt_args`);
    lines2.push(``);
    lines2.push(`  local -a commands`);
    lines2.push(`  commands=(`);
    for (const sub of descriptor.subcommands) {
      const desc = sub.description ? escapeZsh(sub.description) : "";
      lines2.push(`    '${sub.name}:${desc}'`);
    }
    lines2.push(`  )`);
    lines2.push(``);
    lines2.push(`  local -a specs`);
    lines2.push(`  specs=(`);
    for (const flag of descriptor.flags) {
      for (const spec of flagSpecs(flag)) {
        lines2.push(`    ${spec}`);
      }
    }
    if (descriptor.arguments.length > 0) {
      lines2.push(`    -`);
      lines2.push(`    parent-arguments`);
      for (const arg of descriptor.arguments) {
        lines2.push(`    ${argSpec(arg)}`);
      }
      lines2.push(`    -`);
      lines2.push(`    subcommands`);
    }
    lines2.push(`    '1:command:->command'`);
    lines2.push(`    '*::arg:->args'`);
    lines2.push(`  )`);
    lines2.push(``);
    lines2.push(`  _arguments -C "\${specs[@]}"`);
    lines2.push(``);
    lines2.push(`  case "$state" in`);
    lines2.push(`    command)`);
    lines2.push(`      _describe -t commands 'commands' commands`);
    lines2.push(`      ;;`);
    lines2.push(`    args)`);
    lines2.push(`      case "$words[1]" in`);
    for (const sub of descriptor.subcommands) {
      const subFunc = `_${[...currentPath, sub.name].map(sanitize).join("_")}`;
      lines2.push(`        ${sub.name})`);
      lines2.push(`          ${subFunc}`);
      lines2.push(`          ;;`);
    }
    lines2.push(`      esac`);
    lines2.push(`      ;;`);
    lines2.push(`  esac`);
  } else {
    const allSpecs = [];
    for (const flag of descriptor.flags) {
      allSpecs.push(...flagSpecs(flag));
    }
    for (const arg of descriptor.arguments) {
      allSpecs.push(argSpec(arg));
    }
    if (allSpecs.length > 0) {
      lines2.push(`  local -a specs`);
      lines2.push(`  specs=(`);
      for (const spec of allSpecs) {
        lines2.push(`    ${spec}`);
      }
      lines2.push(`  )`);
      lines2.push(`  _arguments "\${specs[@]}"`);
    }
  }
  lines2.push(`}`);
  lines2.push(``);
  for (const sub of descriptor.subcommands) {
    generateFunction2(sub, currentPath, lines2);
  }
};
var generate3 = (executableName, descriptor) => {
  const lines2 = [];
  const safeName = sanitize(executableName);
  lines2.push(`#compdef ${executableName}`);
  lines2.push(`###-begin-${executableName}-completions-###`);
  lines2.push(`#`);
  lines2.push(`# Static completion script for Zsh`);
  lines2.push(`#`);
  lines2.push(`# Installation:`);
  lines2.push(`#   ${executableName} --completions zsh > ~/.zsh/completions/_${executableName}`);
  lines2.push(`#   then add ~/.zsh/completions to your fpath`);
  lines2.push(`#`);
  lines2.push(``);
  generateFunction2(descriptor, [], lines2);
  lines2.push(`# Handle both direct invocation and autoload`);
  lines2.push(`if [[ "\${zsh_eval_context[-1]}" == "loadautofunc" ]]; then`);
  lines2.push(`  _${safeName} "$@"`);
  lines2.push(`else`);
  lines2.push(`  compdef _${safeName} ${executableName}`);
  lines2.push(`fi`);
  lines2.push(`###-end-${executableName}-completions-###`);
  return lines2.join("\n");
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/Completions.js
var generate4 = (executableName, shell, descriptor) => {
  switch (shell) {
    case "bash":
      return generate(executableName, descriptor);
    case "zsh":
      return generate3(executableName, descriptor);
    case "fish":
      return generate2(executableName, descriptor);
  }
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/ConfigProvider.js
function makeValue(value3) {
  return {
    _tag: "Value",
    value: value3
  };
}
function makeRecord(keys, value3) {
  return {
    _tag: "Record",
    keys,
    value: value3
  };
}
function makeArray(length, value3) {
  return {
    _tag: "Array",
    length,
    value: value3
  };
}
var ConfigProvider = /* @__PURE__ */ Reference("effect/ConfigProvider", {
  defaultValue: () => fromEnv()
});
var Proto4 = {
  ...PipeInspectableProto,
  toJSON() {
    return {
      _id: "ConfigProvider"
    };
  }
};
var identityPath = (path) => path;
function makeProvider(load, mapInput2) {
  const self = Object.create(Proto4);
  self.load = load;
  self.mapInput = mapInput2;
  return self;
}
function makeSource(get4, transform4) {
  return makeProvider((path) => get4(transform4(path)), (f) => makeSource(get4, (path) => f(transform4(path))));
}
function make25(get4) {
  return makeSource(get4, identityPath);
}
function emptyStringAsMissing(value3, preserveEmptyStrings) {
  return value3 === "" && !preserveEmptyStrings ? void 0 : value3;
}
function fromEnvRecord(env, options) {
  const preserveEmptyStrings = options?.preserveEmptyStrings === true;
  const trie = buildEnvTrie(env);
  return make25((path) => succeed6(nodeAtEnv(trie, env, path, preserveEmptyStrings)));
}
function fromEnv(options) {
  const env = options?.env ?? {
    ...globalThis.process?.env,
    ...import.meta?.env
  };
  return fromEnvRecord(env, {
    preserveEmptyStrings: options?.preserveEmptyStrings
  });
}
function buildEnvTrie(env) {
  const trie = {};
  for (const [name, value3] of Object.entries(env)) {
    if (value3 === void 0) continue;
    const segments = name.split("_");
    let node = trie;
    for (const seg of segments) {
      const children = node.children ??= /* @__PURE__ */ Object.create(null);
      node = children[seg] ??= {};
    }
  }
  return trie;
}
function nodeAtEnv(trie, env, path, preserveEmptyStrings) {
  const key = path.map(String).join("_");
  const leafValue = emptyStringAsMissing(Object.hasOwn(env, key) ? env[key] : void 0, preserveEmptyStrings);
  const trieNode = trieNodeAt(trie, path);
  const children = trieNode?.children ? Object.keys(trieNode.children) : [];
  if (children.length === 0) {
    return leafValue === void 0 ? void 0 : makeValue(leafValue);
  }
  const allNumeric = children.every(isCanonicalArrayIndex);
  if (allNumeric) {
    const length = Math.max(...children.map((k) => parseInt(k, 10))) + 1;
    return makeArray(length, leafValue);
  }
  return makeRecord(new Set(children), leafValue);
}
function trieNodeAt(root, path) {
  if (path.length === 0) return root;
  let node = root;
  for (const seg of path) {
    node = node?.children?.[String(seg)];
    if (!node) return void 0;
  }
  return node;
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/Config.js
var TypeId27 = "~effect/Config";
var ConfigError = class {
  _tag = "ConfigError";
  name = "ConfigError";
  cause;
  constructor(cause) {
    this.cause = cause;
  }
  get message() {
    return this.cause.toString();
  }
  toString() {
    return `ConfigError(${this.message})`;
  }
};
var Proto5 = {
  .../* @__PURE__ */ Prototype2({
    label: "Config",
    evaluate(fiber2) {
      return this.parse(fiber2.getRef(ConfigProvider));
    }
  }),
  [TypeId27]: TypeId27,
  toJSON() {
    return {
      _id: "Config"
    };
  }
};
function make26(evaluator) {
  const self = Object.create(Proto5);
  self.evaluator = evaluator;
  self.parse = (provider) => flatMapEager2(evaluator(provider, []), fromResult2);
  return self;
}
var evaluateAt = (self, provider, pathPrefix) => self.evaluator(provider, pathPrefix);
var withDefault3 = /* @__PURE__ */ dual(2, (self, defaultValue) => {
  return make26((provider, pathPrefix) => mapEager2(evaluateAt(self, provider, pathPrefix), (resolution) => isFailure2(resolution) ? succeed2(defaultValue) : resolution));
});
var isSourceError = (u) => isTagged(u, "SourceError");
var cursorToString = () => "<configuration>";
var mapReasons = (f) => (self) => catchCause2(self, (cause) => failCause3(fromReasons(cause.reasons.map(f))));
var loadCursor = (provider, path) => provider.load(path).pipe(
  // Source errors travel as defects so they bypass schema issue recovery; `schema` converts them back.
  mapReasons((reason) => isFailReason2(reason) ? makeDieReason(reason.error).annotate(reasonAnnotations2(reason)) : reason),
  mapEager2((node) => ({
    provider,
    path,
    node,
    toString: cursorToString
  }))
);
var loadChildCursor = (cursor, segment) => loadCursor(cursor.provider, [...cursor.path, segment]);
var decodeFromCursor = (ast, decode2) => decodeTo(unknown, ast, new Transformation(transformEffect((input) => decode2(input)), passthrough()));
var isScalarInput = (ast) => {
  switch (ast._tag) {
    case "Union":
      return ast.types.every(isScalarInput);
    case "Objects":
    case "Arrays":
    case "Suspend":
      return false;
    default:
      return true;
  }
};
var hasProviderInput = (ast, node) => {
  switch (ast._tag) {
    case "Objects":
      return node?._tag === "Record";
    case "Arrays":
      return node?._tag === "Array";
    case "Union":
      return ast.types.some((ast2) => hasProviderInput(ast2, node));
    case "Suspend":
      return hasProviderInput(ast.thunk(), node);
    default:
      return node?.value !== void 0;
  }
};
var toConfigCursorAST = /* @__PURE__ */ memoize((root) => {
  const seen = /* @__PURE__ */ new WeakSet();
  const recur = applyToSelfOrLastLinkEncoding((ast) => {
    seen.add(ast);
    switch (ast._tag) {
      case "Objects": {
        const matchesIndex = ast.indexSignatures.map((is3) => _is(is3.parameter));
        const materialize = fnUntraced2(function* (cursor) {
          if (cursor.node?._tag !== "Record") {
            return void 0;
          }
          const node = cursor.node;
          const keys = /* @__PURE__ */ new Set();
          for (const property of ast.propertySignatures) {
            if (typeof property.name === "string") keys.add(property.name);
          }
          if (matchesIndex.length > 0) {
            for (const key of node.keys) {
              if (matchesIndex.some((matches) => matches(key))) keys.add(key);
            }
          }
          const out = {};
          for (const key of keys) {
            const child = yield* loadChildCursor(cursor, key);
            if (child.node !== void 0) assignProperty(out, key, child);
          }
          return out;
        });
        return decodeFromCursor(ast.recur(recur, (ast2) => ast2), materialize);
      }
      case "Arrays": {
        const materialize = fnUntraced2(function* (cursor) {
          if (cursor.node?._tag !== "Array") {
            return void 0;
          }
          const out = [];
          for (let i = 0; i < cursor.node.length; i++) {
            out.push(yield* loadChildCursor(cursor, i));
          }
          return out;
        });
        return decodeFromCursor(ast.recur(recur), materialize);
      }
      case "Union":
        for (const member of ast.types) {
          recur(member);
        }
        if (!isScalarInput(ast)) return ast.recur(recur);
        break;
      case "Suspend": {
        const target = ast.thunk();
        if (!seen.has(target)) recur(target);
        return ast.recur(recur);
      }
      case "Declaration":
      case "Any":
        throw new globalThis.Error("Config.schema does not support opaque StringTree encodings", {
          cause: ast
        });
    }
    return decodeFromCursor(ast, (cursor) => succeed6(cursor.node?.value));
  });
  return recur(root);
});
function schema(codec, path) {
  const codecStringTree = toCodecStringTree2(codec);
  const encodedAst = toEncoded(codecStringTree.ast);
  const decodeCursor = decodeUnknownEffect(make22(toConfigCursorAST(codecStringTree.ast)));
  const localPath = typeof path === "string" ? [path] : path ?? [];
  return make26((provider, pathPrefix) => {
    const fullPath = [...pathPrefix, ...localPath];
    return loadCursor(provider, fullPath).pipe(flatMapEager2((cursor) => decodeCursor(cursor).pipe(mapEager2(succeed2), catchEager2((issue) => {
      const error2 = new ConfigError(new SchemaError(fullPath.length > 0 ? new Pointer(fullPath, issue) : issue));
      return hasProviderInput(encodedAst, cursor.node) ? fail6(error2) : succeed6(fail2(error2));
    }))), mapReasons((reason) => isDieReason2(reason) && isSourceError(reason.defect) ? makeFailReason(new ConfigError(reason.defect)).annotate(reasonAnnotations2(reason)) : reason));
  });
}
function String5(name) {
  return schema(String4, name);
}

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/CliError.js
var TypeId28 = "~effect/cli/CliError";
var isCliError = (u) => hasProperty(u, TypeId28);
var UnrecognizedOption = class extends (/* @__PURE__ */ TaggedError3(`${TypeId28}/UnrecognizedOption`)("UnrecognizedOption", {
  option: String4,
  command: /* @__PURE__ */ optional2(/* @__PURE__ */ ArraySchema(String4)),
  suggestions: /* @__PURE__ */ ArraySchema(String4)
})) {
  /**
   * Marks this value as a CLI parsing error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [TypeId28] = TypeId28;
  /**
   * Formats the unrecognized option with command context and suggestions.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    const suggestionText = this.suggestions.length > 0 ? `

  Did you mean this?
    ${this.suggestions.join("\n    ")}` : "";
    const baseMessage = this.command ? `Unrecognized flag: ${this.option} in command ${this.command.join(" ")}` : `Unrecognized flag: ${this.option}`;
    return baseMessage + suggestionText;
  }
};
var DuplicateOption = class extends (/* @__PURE__ */ TaggedError3(`${TypeId28}/DuplicateOption`)("DuplicateOption", {
  option: String4,
  parentCommand: String4,
  childCommand: String4
})) {
  /**
   * Marks this value as a CLI configuration error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [TypeId28] = TypeId28;
  /**
   * Explains which parent and child commands define the duplicate option.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    return `Duplicate flag name "${this.option}" in parent command "${this.parentCommand}" and subcommand "${this.childCommand}". Parent will always claim this flag (Mode A semantics). Consider renaming one of them to avoid confusion.`;
  }
};
var MissingOption = class extends (/* @__PURE__ */ TaggedError3(`${TypeId28}/MissingOption`)("MissingOption", {
  option: String4
})) {
  /**
   * Marks this value as a missing CLI option error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [TypeId28] = TypeId28;
  /**
   * Formats the missing required flag for display.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    return `Missing required flag: --${this.option}`;
  }
};
var MissingArgument = class extends (/* @__PURE__ */ TaggedError3(`${TypeId28}/MissingArgument`)("MissingArgument", {
  argument: String4
})) {
  /**
   * Marks this value as a missing CLI argument error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [TypeId28] = TypeId28;
  /**
   * Formats the missing required positional argument for display.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    return `Missing required argument: ${this.argument}`;
  }
};
var UnexpectedArgument = class extends (/* @__PURE__ */ TaggedError3(`${TypeId28}/UnexpectedArgument`)("UnexpectedArgument", {
  arguments: /* @__PURE__ */ ArraySchema(String4)
})) {
  /**
   * Marks this value as an unexpected CLI argument error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [TypeId28] = TypeId28;
  /**
   * Formats the unexpected positional arguments for display.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    const label = this.arguments.length === 1 ? "argument" : "arguments";
    return `Unexpected positional ${label}: ${this.arguments.map((value3) => JSON.stringify(value3)).join(", ")}`;
  }
};
var InvalidValue2 = class extends (/* @__PURE__ */ TaggedError3(`${TypeId28}/InvalidValue`)("InvalidValue", {
  option: String4,
  value: String4,
  expected: String4,
  kind: /* @__PURE__ */ Union2([/* @__PURE__ */ Literal2("flag"), /* @__PURE__ */ Literal2("argument")])
})) {
  /**
   * Marks this value as an invalid CLI value error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [TypeId28] = TypeId28;
  /**
   * Formats the invalid flag or argument value with the expected input.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    const expectation = this.expected.startsWith("Expected ") || this.expected.startsWith("Expected:") ? this.expected : `Expected: ${this.expected}`;
    if (this.kind === "argument") {
      return `Invalid value for argument <${this.option}>: "${this.value}". ${expectation}`;
    }
    if (this.value.length === 0) {
      return `Missing value for flag --${this.option}. ${expectation}`;
    }
    return `Invalid value for flag --${this.option}: "${this.value}". ${expectation}`;
  }
};
var UnknownSubcommand = class extends (/* @__PURE__ */ TaggedError3(`${TypeId28}/UnknownSubcommand`)("UnknownSubcommand", {
  subcommand: String4,
  parent: /* @__PURE__ */ optional2(/* @__PURE__ */ ArraySchema(String4)),
  suggestions: /* @__PURE__ */ ArraySchema(String4)
})) {
  /**
   * Marks this value as an unknown CLI subcommand error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [TypeId28] = TypeId28;
  /**
   * Formats the unknown subcommand with parent command context and suggestions.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    const suggestionText = this.suggestions.length > 0 ? `

  Did you mean this?
    ${this.suggestions.join("\n    ")}` : "";
    return this.parent ? `Unknown subcommand "${this.subcommand}" for "${this.parent.join(" ")}"${suggestionText}` : `Unknown subcommand "${this.subcommand}"${suggestionText}`;
  }
};
var UserError = class extends (/* @__PURE__ */ TaggedError3(`${TypeId28}/UserError`)("UserError", {
  cause: /* @__PURE__ */ Defect(),
  userMessage: /* @__PURE__ */ optionalKey2(String4)
})) {
  /**
   * Marks this value as a user handler error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [TypeId28] = TypeId28;
  /**
   * Controls whether the runtime logger should report this error. The CLI
   * runner sets this to `false` after rendering the error itself.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [errorReported] = true;
  /**
   * Returns the explicit user-facing message or a safe fallback from `cause`.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    if (this.userMessage) return this.userMessage;
    if (typeof this.cause === "string" && this.cause) return this.cause;
    if (this.cause instanceof Error && this.cause.message) return this.cause.message;
    return "An error occurred";
  }
};
var NonShowHelpErrors = /* @__PURE__ */ Union2([UnrecognizedOption, DuplicateOption, MissingOption, MissingArgument, UnexpectedArgument, InvalidValue2, UnknownSubcommand, UserError]);
var ShowHelp = class extends (/* @__PURE__ */ TaggedError3(`${TypeId28}/ShowHelp`)("ShowHelp", {
  commandPath: /* @__PURE__ */ ArraySchema(String4),
  errors: /* @__PURE__ */ ArraySchema(NonShowHelpErrors)
})) {
  [TypeId28] = TypeId28;
  [errorExitCode] = this.errors.length ? 1 : 0;
  [errorReported] = false;
  get message() {
    return "Help requested";
  }
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/Primitive.js
var TypeId29 = "~effect/cli/Primitive";
var Proto6 = {
  [TypeId29]: {
    _A: identity
  }
};
var isTrueLiteral = /* @__PURE__ */ is2(TrueLiterals);
var isFalseLiteral = /* @__PURE__ */ is2(FalseLiterals);
var isBoolean2 = (p) => p._tag === "Boolean";
var makePrimitive2 = (tag2, parse) => Object.assign(Object.create(Proto6), {
  _tag: tag2,
  parse
});
var makeSchemaPrimitive = (tag2, schema2) => {
  const toCodecStringTree3 = toCodecStringTree2(schema2);
  const decode2 = decodeUnknownEffect2(toCodecStringTree3);
  return makePrimitive2(tag2, (value3) => mapError2(decode2(value3), (error2) => error2.message));
};
var Boolean4 = /* @__PURE__ */ makeSchemaPrimitive("Boolean", BooleanLiterals);
var String6 = /* @__PURE__ */ makePrimitive2("String", (value3) => succeed6(value3));
var Choice = (choices) => {
  const choiceMap = new Map(choices);
  const validChoices = choices.map(([key]) => format(key)).join(" | ");
  const primitive = makePrimitive2("Choice", (value3) => {
    if (choiceMap.has(value3)) {
      return succeed6(choiceMap.get(value3));
    }
    return fail6(validChoices);
  });
  return Object.assign(primitive, {
    choiceKeys: choices.map(([key]) => key)
  });
};
var getTypeName = (primitive) => {
  switch (primitive._tag) {
    case "Boolean":
      return "boolean";
    case "String":
      return "string";
    case "Int":
      return "integer";
    case "Finite":
      return "number";
    case "Date":
      return "date";
    case "Path":
      return "path";
    case "Choice":
      return "choice";
    case "Redacted":
      return "string";
    case "FileText":
      return "file";
    case "FileParse":
      return "file";
    case "FileSchema":
      return "file";
    case "KeyValuePair":
      return "key=value";
    case "Never":
      return "none";
    default:
      return "value";
  }
};
var getChoiceKeys = (primitive) => primitive._tag === "Choice" ? primitive.choiceKeys : void 0;
var getPathType = (primitive) => primitive._tag === "Path" ? primitive.pathType : void 0;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/ansi.js
var ESC = "\x1B[";
var BEL = "\x07";
var SEP = ";";
var reset = `${ESC}0m`;
var bold = `${ESC}1m`;
var italicized = `${ESC}3m`;
var underlined = `${ESC}4m`;
var strikethrough = `${ESC}9m`;
var cursorShow = `${ESC}?25h`;
var cursorHide = `${ESC}?25l`;
var cursorLeft = `${ESC}G`;
var cursorSavePosition = `${ESC}s`;
var cursorRestorePosition = `${ESC}u`;
var eraseLine = `${ESC}2K`;
var beep = BEL;
var red = `${ESC}31m`;
var green = `${ESC}32m`;
var magenta = `${ESC}35m`;
var white = `${ESC}37m`;
var blackBright = `${ESC}90m`;
var cyanBright = `${ESC}96m`;
var annotate2 = (text, ...styles) => {
  const flat = styles.flat();
  return `${flat.join("")}${text}${reset}`;
};
var combine3 = (...styles) => styles;
var cursorTo = (column, row) => {
  if (row === void 0) {
    return `${ESC}${Math.max(column + 1, 0)}G`;
  }
  return `${ESC}${row + 1}${SEP}${Math.max(column + 1, 0)}H`;
};
var cursorDown = (lines2 = 1) => {
  return `${ESC}${lines2}B`;
};
var cursorMove = (column, row = 0) => {
  let command = "";
  if (row < 0) {
    command += `${ESC}${-row}A`;
  }
  if (row > 0) {
    command += `${ESC}${row}B`;
  }
  if (column > 0) {
    command += `${ESC}${column}C`;
  }
  if (column < 0) {
    command += `${ESC}${-column}D`;
  }
  return command;
};
var eraseLines = (rows) => {
  let command = "";
  for (let i = 0; i < rows; i++) {
    command += `${ESC}2K` + (i < rows - 1 ? `${ESC}1A` : "");
  }
  if (rows > 0) {
    command += `${ESC}G`;
  }
  return command;
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/Prompt.js
var TypeId30 = "~effect/cli/Prompt";
var isPrompt = (u) => hasProperty(u, TypeId30);
var defaultTheme = {
  prefix: "?",
  arrowUp: "\u2191",
  arrowDown: "\u2193",
  checkboxOn: "\u2612",
  checkboxOff: "\u2610",
  tick: "\u2714",
  ellipsis: "\u2026",
  pointerSmall: "\u203A",
  pointer: "\u276F",
  descriptionSeparator: "- ",
  passwordMask: "*",
  toggleSeparator: "/",
  primaryColor: cyanBright,
  mutedColor: blackBright,
  successColor: green,
  errorColor: red,
  submittedColor: white
};
var windowsTheme = {
  ...defaultTheme,
  checkboxOn: "[*]",
  checkboxOff: "[ ]",
  tick: "\u221A",
  ellipsis: "...",
  pointerSmall: "\xBB",
  pointer: ">"
};
var makeTheme = (options) => ({
  ...process.platform === "win32" ? windowsTheme : defaultTheme,
  ...options
});
var Theme = /* @__PURE__ */ Reference("effect/cli/Prompt/Theme", {
  defaultValue: makeTheme
});
var getTheme = (options) => map5(Theme, (theme) => ({
  ...theme,
  ...options.theme
}));
var annotateLine = (line) => annotate2(line, bold);
var annotateErrorLine = (line, color) => annotate2(line, combine3(italicized, color));
var annotateSymbol = (symbol4, ...styles) => symbol4.length === 0 ? "" : annotate2(symbol4, ...styles);
var separateSymbol = (symbol4, text) => symbol4.length === 0 ? text : symbol4 + " " + text;
var renderPagingPrefix = (theme, showArrowUp, showArrowDown) => {
  const width = Math.max(theme.arrowUp.length, theme.arrowDown.length);
  if (showArrowUp) {
    return theme.arrowUp.padEnd(width);
  }
  if (showArrowDown) {
    return theme.arrowDown.padEnd(width);
  }
  return " ".repeat(width);
};
var Confirm = (options) => {
  const opts = {
    initial: false,
    ...options,
    label: {
      confirm: "yes",
      deny: "no",
      ...options.label
    },
    placeholder: {
      defaultConfirm: "(Y/n)",
      defaultDeny: "(y/N)",
      ...options.placeholder
    }
  };
  const initialState = {
    value: opts.initial
  };
  return Custom(initialState, {
    render: handleConfirmRender(opts),
    process: (input) => handleConfirmProcess(input, opts.initial),
    clear: handleConfirmClear(opts)
  });
};
var Custom = (initialState, ...args2) => {
  const [events, handlers] = args2.length === 1 ? [void 0, args2[0]] : [args2[0], args2[1]];
  const op = Object.create(proto);
  op._tag = "Loop";
  op.initialState = initialState;
  op.render = handlers.render;
  op.process = handlers.process;
  op.clear = handlers.clear;
  op.events = events;
  return op;
};
var Date4 = (options) => {
  const opts = {
    initial: new globalThis.Date(),
    dateMask: "YYYY-MM-DD HH:mm:ss",
    validate: succeed6,
    ...options,
    locales: {
      ...defaultLocales,
      ...options.locales
    }
  };
  const dateParts = makeDateParts(opts.dateMask, opts.initial, opts.locales);
  const initialCursorPosition = dateParts.findIndex((part) => !part.isToken());
  const initialState = {
    dateParts,
    typed: "",
    cursor: initialCursorPosition,
    value: opts.initial,
    error: none2()
  };
  return Custom(initialState, {
    render: handleDateRender(opts),
    process: handleDateProcess(opts),
    clear: handleDateClear(opts)
  });
};
var flatMap6 = /* @__PURE__ */ dual(2, (self, f) => {
  const op = Object.create(proto);
  op._tag = "OnSuccess";
  op.prompt = self;
  op.onSuccess = f;
  return op;
});
var Number7 = (options) => {
  const opts = {
    default: 0,
    min: globalThis.Number.NEGATIVE_INFINITY,
    max: globalThis.Number.POSITIVE_INFINITY,
    incrementBy: 1,
    decrementBy: 1,
    precision: 2,
    validate: (n) => {
      if (n < opts.min) {
        return fail6(`${n} must be greater than or equal to ${opts.min}`);
      }
      if (n > opts.max) {
        return fail6(`${n} must be less than or equal to ${opts.max}`);
      }
      return succeed6(n);
    },
    ...options
  };
  const initialValue = options.default === void 0 ? "" : `${opts.default}`;
  const initialState = {
    cursor: initialValue.length,
    value: initialValue,
    error: none2()
  };
  return Custom(initialState, {
    render: handleRenderFloat(opts),
    process: handleProcessFloat(opts),
    clear: handleNumberClear(opts)
  });
};
var Int2 = (options) => {
  const opts = {
    default: 0,
    min: globalThis.Number.NEGATIVE_INFINITY,
    max: globalThis.Number.POSITIVE_INFINITY,
    incrementBy: 1,
    decrementBy: 1,
    validate: (n) => {
      if (n < opts.min) {
        return fail6(`${n} must be greater than or equal to ${opts.min}`);
      }
      if (n > opts.max) {
        return fail6(`${n} must be less than or equal to ${opts.max}`);
      }
      return succeed6(n);
    },
    ...options
  };
  const initialValue = options.default === void 0 ? "" : `${opts.default}`;
  const initialState = {
    cursor: initialValue.length,
    value: initialValue,
    error: none2()
  };
  return Custom(initialState, {
    render: handleRenderInteger(opts),
    process: handleProcessInteger(opts),
    clear: handleNumberClear(opts)
  });
};
var map9 = /* @__PURE__ */ dual(2, (self, f) => flatMap6(self, (a) => succeed9(f(a))));
var Password = (options) => basePrompt(options, "password").pipe(map9(make19));
var run3 = /* @__PURE__ */ fnUntraced2(function* (self) {
  const terminal = yield* Terminal;
  const input = yield* terminal.readInput;
  return yield* runWithInput(self, terminal, input);
}, /* @__PURE__ */ mapError2(() => new QuitError({})), scoped2);
var getSelectInitialIndex = (choices) => {
  let initialIndex = 0;
  let seenSelected = -1;
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    if (choice.selected === true) {
      if (seenSelected !== -1) {
        throw new Error("InvalidArgumentException: only a single choice can be selected by default for Prompt.Select");
      }
      seenSelected = i;
    }
  }
  if (seenSelected !== -1) {
    initialIndex = seenSelected;
  }
  return initialIndex;
};
var Select = (options) => {
  const opts = {
    maxPerPage: 10,
    ...options
  };
  const initialIndex = getSelectInitialIndex(opts.choices);
  return Custom(initialIndex, {
    render: handleSelectRender(opts),
    process: handleSelectProcess(opts),
    clear: handleSelectClear(opts)
  });
};
var succeed9 = (value3) => {
  const op = Object.create(proto);
  op._tag = "Succeed";
  op.value = value3;
  return op;
};
var String7 = (options) => basePrompt(options, "text");
var Toggle = (options) => {
  const opts = {
    initial: false,
    active: "on",
    inactive: "off",
    ...options
  };
  return Custom(opts.initial, {
    render: handleToggleRender(opts),
    process: handleToggleProcess,
    clear: () => handleToggleClear(opts)
  });
};
var proto = {
  .../* @__PURE__ */ Prototype2({
    label: "Prompt",
    evaluate() {
      return run3(this);
    }
  }),
  [TypeId30]: {
    _Output: (_) => _
  }
};
var runWithInput = (prompt, terminal, input) => suspend2(() => {
  const op = prompt;
  switch (op._tag) {
    case "Loop": {
      return runLoop(op, terminal, input);
    }
    case "OnSuccess": {
      return flatMap4(runWithInput(op.prompt, terminal, input), (a) => runWithInput(op.onSuccess(a), terminal, input));
    }
    case "Succeed": {
      return succeed6(op.value);
    }
  }
});
var runLoop = /* @__PURE__ */ fnUntraced2(function* (loop, terminal, input) {
  let state = isEffect2(loop.initialState) ? yield* loop.initialState : loop.initialState;
  let action = Action.NextFrame({
    state
  });
  let clear2 = "";
  while (true) {
    const msg = yield* loop.render(state, action);
    yield* orDie2(terminal.display(clear2 + msg));
    clear2 = "";
    if (loop.events) {
      const takeInput = take2(input).pipe(map5((input2) => ({
        _tag: "Input",
        input: input2
      })));
      const result3 = yield* raceFirst2(takeInput, take2(loop.events).pipe(map5((value3) => ({
        _tag: "Event",
        value: value3
      }))));
      action = yield* loop.process(result3, state);
    } else {
      const result3 = yield* take2(input);
      action = yield* loop.process(result3, state);
    }
    switch (action._tag) {
      case "Beep":
        continue;
      case "NextFrame": {
        clear2 = yield* loop.clear(state, action);
        state = action.state;
        continue;
      }
      case "Submit": {
        clear2 = yield* loop.clear(state, action);
        const msg2 = yield* loop.render(state, action);
        yield* orDie2(terminal.display(clear2 + msg2));
        return action.value;
      }
    }
  }
}, (effect2, _, terminal) => ensuring2(effect2, orDie2(terminal.display(cursorShow))));
var Action = /* @__PURE__ */ taggedEnum();
var eraseText = (text, columns) => {
  if (columns === 0) {
    return eraseLine + cursorTo(0);
  }
  let rows = 0;
  const lines2 = text.split(NEWLINE_REGEXP);
  for (const line of lines2) {
    rows += 1 + Math.floor(Math.max(line.length - 1, 0) / columns);
  }
  return eraseLines(rows);
};
var lines = (prompt, columns) => {
  const lines2 = prompt.split(NEWLINE_REGEXP);
  return columns === 0 ? lines2.length : pipe(map2(lines2, (line) => Math.ceil(line.length / columns)), reduce(0, (left, right) => left + right));
};
var clearOutputWithError = (outputText, columns, errorText) => {
  if (errorText !== void 0 && errorText.length > 0) {
    return cursorDown(lines(errorText, columns)) + eraseText(`
${errorText}`, columns) + eraseText(outputText, columns);
  }
  return eraseText(outputText, columns);
};
var renderBeep = beep;
var NEWLINE_REGEXP = /\r?\n/;
var handleConfirmClear = (options) => {
  return fnUntraced2(function* (state, _) {
    const terminal = yield* Terminal;
    const columns = yield* terminal.columns;
    const figures = yield* getTheme(options);
    const confirmMessage = state.value ? options.placeholder.defaultConfirm : options.placeholder.defaultDeny;
    const promptText = renderConfirmOutput(confirmMessage, figures.prefix, figures.pointerSmall, options, {
      plain: true
    });
    const clearOutput = eraseText(promptText, columns);
    const resetCurrentLine = eraseLine + cursorLeft;
    return clearOutput + resetCurrentLine;
  });
};
var renderConfirmOutput = (confirm, leadingSymbol, trailingSymbol, options, renderOptions) => renderPrompt(confirm, options.message, leadingSymbol, trailingSymbol, renderOptions);
var renderConfirmNextFrame = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.prefix, figures.primaryColor);
  const trailingSymbol = annotateSymbol(figures.pointerSmall, figures.mutedColor);
  const confirmMessage = state.value ? options.placeholder.defaultConfirm : options.placeholder.defaultDeny;
  const confirm = annotate2(confirmMessage, figures.mutedColor);
  const promptMsg = renderConfirmOutput(confirm, leadingSymbol, trailingSymbol, options);
  return cursorHide + promptMsg;
});
var renderConfirmSubmission = /* @__PURE__ */ fnUntraced2(function* (value3, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.tick, figures.successColor);
  const trailingSymbol = annotateSymbol(figures.ellipsis, figures.mutedColor);
  const confirmMessage = value3 ? options.label.confirm : options.label.deny;
  const promptMsg = renderConfirmOutput(confirmMessage, leadingSymbol, trailingSymbol, options);
  return promptMsg + "\n";
});
var handleConfirmRender = (options) => {
  return (_, action) => {
    return Action.$match(action, {
      Beep: () => succeed6(renderBeep),
      NextFrame: ({
        state
      }) => renderConfirmNextFrame(state, options),
      Submit: ({
        value: value3
      }) => renderConfirmSubmission(value3, options)
    });
  };
};
var TRUE_VALUE_REGEXP = /^y|t$/;
var FALSE_VALUE_REGEXP = /^n|f$/;
var handleConfirmProcess = (input, defaultValue) => {
  const value3 = getOrElse(input.input, () => "");
  if (input.key.name === "enter" || input.key.name === "return") {
    return succeed6(Action.Submit({
      value: defaultValue
    }));
  }
  if (TRUE_VALUE_REGEXP.test(value3.toLowerCase())) {
    return succeed6(Action.Submit({
      value: true
    }));
  }
  if (FALSE_VALUE_REGEXP.test(value3.toLowerCase())) {
    return succeed6(Action.Submit({
      value: false
    }));
  }
  return succeed6(Action.Beep());
};
var handleDateClear = (options) => {
  return fnUntraced2(function* (state, _) {
    const terminal = yield* Terminal;
    const columns = yield* terminal.columns;
    const figures = yield* getTheme(options);
    const resetCurrentLine = eraseLine + cursorLeft;
    const parts = reduce(state.dateParts, "", (doc, part) => doc + part.toString());
    const promptText = renderDateOutput(figures.prefix, figures.pointerSmall, parts, options, {
      plain: true
    });
    const errorText = isSome2(state.error) ? match3(state.error.value.split(NEWLINE_REGEXP), {
      onEmpty: () => "",
      onNonEmpty: (errorLines) => separateSymbol(figures.pointerSmall, errorLines.join("\n"))
    }) : "";
    const clearOutput = clearOutputWithError(promptText, columns, errorText);
    return clearOutput + resetCurrentLine;
  });
};
var renderDateError = (state, pointer, theme) => {
  if (isSome2(state.error)) {
    const errorLines = state.error.value.split(NEWLINE_REGEXP);
    if (isReadonlyArrayNonEmpty(errorLines)) {
      const prefix = annotateSymbol(pointer, theme.errorColor);
      const lines2 = map2(errorLines, (str) => annotateErrorLine(str, theme.errorColor));
      return cursorSavePosition + "\n" + separateSymbol(prefix, lines2.join("\n")) + cursorRestorePosition;
    }
  }
  return "";
};
var renderParts = (state, theme, submitted = false) => {
  return reduce(state.dateParts, "", (doc, part, currentIndex) => {
    const partDoc = part.toString();
    if (currentIndex === state.cursor && !submitted) {
      const annotation = combine3(underlined, theme.primaryColor);
      return doc + annotate2(partDoc, annotation);
    }
    return doc + partDoc;
  });
};
var renderDateOutput = (leadingSymbol, trailingSymbol, parts, options, renderOptions) => renderPrompt(parts, options.message, leadingSymbol, trailingSymbol, renderOptions);
var renderDateNextFrame = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.prefix, figures.primaryColor);
  const trailingSymbol = annotateSymbol(figures.pointerSmall, figures.mutedColor);
  const parts = renderParts(state, figures);
  const promptMsg = renderDateOutput(leadingSymbol, trailingSymbol, parts, options);
  const errorMsg = renderDateError(state, figures.pointerSmall, figures);
  return cursorHide + promptMsg + errorMsg;
});
var renderDateSubmission = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.tick, figures.successColor);
  const trailingSymbol = annotateSymbol(figures.ellipsis, figures.mutedColor);
  const parts = renderParts(state, figures, true);
  const promptMsg = renderDateOutput(leadingSymbol, trailingSymbol, parts, options);
  return promptMsg + "\n";
});
var processUp = (state) => {
  state.dateParts[state.cursor].increment();
  return Action.NextFrame({
    state: {
      ...state,
      typed: ""
    }
  });
};
var processDown = (state) => {
  state.dateParts[state.cursor].decrement();
  return Action.NextFrame({
    state: {
      ...state,
      typed: ""
    }
  });
};
var processDateCursorLeft = (state) => {
  const previous = state.dateParts[state.cursor].previousPart();
  if (isSome2(previous)) {
    return Action.NextFrame({
      state: {
        ...state,
        typed: "",
        cursor: state.dateParts.indexOf(previous.value)
      }
    });
  }
  return Action.Beep();
};
var processDateCursorRight = (state) => {
  const next = state.dateParts[state.cursor].nextPart();
  if (isSome2(next)) {
    return Action.NextFrame({
      state: {
        ...state,
        typed: "",
        cursor: state.dateParts.indexOf(next.value)
      }
    });
  }
  return Action.Beep();
};
var processDateNext = (state) => {
  const next = state.dateParts[state.cursor].nextPart();
  const cursor = match(next, {
    onNone: () => state.dateParts.findIndex((part) => !part.isToken()),
    onSome: (next2) => state.dateParts.indexOf(next2)
  });
  return Action.NextFrame({
    state: {
      ...state,
      typed: "",
      cursor
    }
  });
};
var defaultDateProcessor = (value3, state) => {
  if (/\d/.test(value3)) {
    const typed = state.typed + value3;
    state.dateParts[state.cursor].setValue(typed);
    return Action.NextFrame({
      state: {
        ...state,
        typed
      }
    });
  }
  return Action.Beep();
};
var defaultLocales = {
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
};
var handleDateRender = (options) => {
  return (state, action) => {
    return Action.$match(action, {
      Beep: () => succeed6(renderBeep),
      NextFrame: ({
        state: state2
      }) => renderDateNextFrame(state2, options),
      Submit: () => renderDateSubmission(state, options)
    });
  };
};
var handleDateProcess = (options) => {
  return (input, state) => {
    switch (input.key.name) {
      case "left": {
        return succeed6(processDateCursorLeft(state));
      }
      case "right": {
        return succeed6(processDateCursorRight(state));
      }
      case "k":
      case "up": {
        return succeed6(processUp(state));
      }
      case "j":
      case "down": {
        return succeed6(processDown(state));
      }
      case "tab": {
        return succeed6(processDateNext(state));
      }
      case "enter":
      case "return": {
        return match6(options.validate(state.value), {
          onFailure: (error2) => Action.NextFrame({
            state: {
              ...state,
              error: some2(error2)
            }
          }),
          onSuccess: (value3) => Action.Submit({
            value: value3
          })
        });
      }
      default: {
        return succeed6(defaultDateProcessor(getOrElse(input.input, () => ""), state));
      }
    }
  };
};
var DATE_PART_REGEXP = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
var regExpGroups = {
  1: ({
    token,
    ...opts
  }) => new Token({
    token: token.replace(/\\(.)/g, "$1"),
    ...opts
  }),
  2: (opts) => new Day(opts),
  3: (opts) => new Month(opts),
  4: (opts) => new Year(opts),
  5: (opts) => new Meridiem(opts),
  6: (opts) => new Hours(opts),
  7: (opts) => new Minutes(opts),
  8: (opts) => new Seconds(opts),
  9: (opts) => new Milliseconds(opts)
};
var makeDateParts = (dateMask, date, locales) => {
  const parts = [];
  let result3 = null;
  while (result3 = DATE_PART_REGEXP.exec(dateMask)) {
    const match7 = result3.shift();
    const index = result3.findIndex((group) => group !== void 0);
    if (index in regExpGroups) {
      const token = result3[index] || match7;
      parts.push(regExpGroups[index]({
        token,
        date,
        parts,
        locales
      }));
    } else {
      parts.push(new Token({
        token: result3[index] || match7,
        date,
        parts,
        locales
      }));
    }
  }
  const orderedParts = parts.reduce((array2, element) => {
    const lastElement = array2[array2.length - 1];
    if (element.isToken() && lastElement !== void 0 && lastElement.isToken()) {
      lastElement.setValue(element.token);
    } else {
      array2.push(element);
    }
    return array2;
  }, empty2());
  parts.splice(0, parts.length, ...orderedParts);
  return parts;
};
var DatePart = class {
  token;
  date;
  parts;
  locales;
  constructor(params) {
    this.token = params.token;
    this.locales = params.locales;
    this.date = params.date || new globalThis.Date();
    this.parts = params.parts || [this];
  }
  /**
   * Returns `true` if this `DatePart` is a `Token`, `false` otherwise.
   */
  isToken() {
    return false;
  }
  /**
   * Retrieves the next date part in the list of parts.
   */
  nextPart() {
    const currentPartIndex = getOrElse(findFirstIndex(this.parts, (part) => part === this), () => 0);
    return findFirst2(this.parts.slice(currentPartIndex + 1), (part) => !part.isToken());
  }
  /**
   * Retrieves the previous date part in the list of parts.
   */
  previousPart() {
    const currentPartIndex = findFirstIndex(this.parts, (part) => part === this);
    if (isSome2(currentPartIndex)) {
      return findLast(this.parts.slice(0, currentPartIndex.value), (part) => !part.isToken());
    }
    return none2();
  }
  toString() {
    return globalThis.String(this.date);
  }
};
var Token = class extends DatePart {
  increment() {
  }
  decrement() {
  }
  setValue(value3) {
    this.token = this.token + value3;
  }
  isToken() {
    return true;
  }
  toString() {
    return this.token;
  }
};
var Milliseconds = class extends DatePart {
  increment() {
    this.date.setMilliseconds(this.date.getMilliseconds() + 1);
  }
  decrement() {
    this.date.setMilliseconds(this.date.getMilliseconds() - 1);
  }
  setValue(value3) {
    this.date.setMilliseconds(globalThis.Number.parseInt(value3.slice(-this.token.length)));
  }
  toString() {
    const millis2 = `${this.date.getMilliseconds()}`;
    return millis2.padStart(4, "0").substring(0, this.token.length);
  }
};
var Seconds = class extends DatePart {
  increment() {
    this.date.setSeconds(this.date.getSeconds() + 1);
  }
  decrement() {
    this.date.setSeconds(this.date.getSeconds() - 1);
  }
  setValue(value3) {
    this.date.setSeconds(globalThis.Number.parseInt(value3.slice(-2)));
  }
  toString() {
    const seconds2 = `${this.date.getSeconds()}`;
    return this.token.length > 1 ? seconds2.padStart(2, "0") : seconds2;
  }
};
var Minutes = class extends DatePart {
  increment() {
    this.date.setMinutes(this.date.getMinutes() + 1);
  }
  decrement() {
    this.date.setMinutes(this.date.getMinutes() - 1);
  }
  setValue(value3) {
    this.date.setMinutes(globalThis.Number.parseInt(value3.slice(-2)));
  }
  toString() {
    const minutes2 = `${this.date.getMinutes()}`;
    return this.token.length > 1 ? minutes2.padStart(2, "0") : minutes2;
  }
};
var Hours = class extends DatePart {
  increment() {
    this.date.setHours(this.date.getHours() + 1);
  }
  decrement() {
    this.date.setHours(this.date.getHours() - 1);
  }
  setValue(value3) {
    this.date.setHours(globalThis.Number.parseInt(value3.slice(-2)));
  }
  toString() {
    const hours2 = /h/.test(this.token) ? this.date.getHours() % 12 || 12 : this.date.getHours();
    return this.token.length > 1 ? `${hours2}`.padStart(2, "0") : `${hours2}`;
  }
};
var Day = class extends DatePart {
  increment() {
    this.date.setDate(this.date.getDate() + 1);
  }
  decrement() {
    this.date.setDate(this.date.getDate() - 1);
  }
  setValue(value3) {
    this.date.setDate(globalThis.Number.parseInt(value3.slice(-2)));
  }
  toString() {
    const date = this.date.getDate();
    const day = this.date.getDay();
    switch (this.token) {
      case "DD":
        return `${date}`.padStart(2, "0");
      case "Do":
        return `${date}${this.ordinalIndicator(date)}`;
      case "d":
        return `${day + 1}`;
      case "ddd":
        return this.locales.weekdaysShort[day];
      case "dddd":
        return this.locales.weekdays[day];
      default:
        return `${date}`;
    }
  }
  ordinalIndicator(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
};
var Month = class extends DatePart {
  increment() {
    this.date.setMonth(this.date.getMonth() + 1);
  }
  decrement() {
    this.date.setMonth(this.date.getMonth() - 1);
  }
  setValue(value3) {
    const month = globalThis.Number.parseInt(value3.slice(-2)) - 1;
    this.date.setMonth(month < 0 ? 0 : month);
  }
  toString() {
    const month = this.date.getMonth();
    switch (this.token.length) {
      case 2:
        return `${month + 1}`.padStart(2, "0");
      case 3:
        return this.locales.monthsShort[month];
      case 4:
        return this.locales.months[month];
      default:
        return `${month + 1}`;
    }
  }
};
var Year = class extends DatePart {
  increment() {
    this.date.setFullYear(this.date.getFullYear() + 1);
  }
  decrement() {
    this.date.setFullYear(this.date.getFullYear() - 1);
  }
  setValue(value3) {
    this.date.setFullYear(globalThis.Number.parseInt(value3.slice(-4)));
  }
  toString() {
    const year = `${this.date.getFullYear()}`.padStart(4, "0");
    return this.token.length === 2 ? year.slice(-2) : year;
  }
};
var Meridiem = class extends DatePart {
  increment() {
    this.date.setHours((this.date.getHours() + 12) % 24);
  }
  decrement() {
    this.increment();
  }
  setValue(_value) {
  }
  toString() {
    const meridiem = this.date.getHours() >= 12 ? "pm" : "am";
    return /A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
  }
};
var renderPrompt = (confirm, message, leadingSymbol, trailingSymbol, options) => {
  const prefix = leadingSymbol.length === 0 ? "" : leadingSymbol + " ";
  const renderLine = (line) => {
    let output = prefix + line;
    if (trailingSymbol.length > 0) {
      output += " " + trailingSymbol;
    }
    if (confirm.length > 0) {
      output += " " + confirm;
    } else if (trailingSymbol.length > 0) {
      output += " ";
    }
    return output;
  };
  const annotate3 = options?.plain === true ? (line) => line : annotateLine;
  return match3(message.split(NEWLINE_REGEXP), {
    onEmpty: () => renderLine(""),
    onNonEmpty: (promptLines) => {
      const lines2 = map2(promptLines, (line) => annotate3(line));
      return renderLine(lines2.join("\n"));
    }
  });
};
var renderChoiceDescription = (choice, isActive, theme, renderOptions) => {
  if (!choice.disabled && choice.description && isActive) {
    const text = theme.descriptionSeparator + choice.description;
    return renderOptions?.plain === true ? text : annotate2(text, theme.mutedColor);
  }
  return "";
};
var handleNumberClear = (options) => {
  return fnUntraced2(function* (state, _) {
    const terminal = yield* Terminal;
    const columns = yield* terminal.columns;
    const figures = yield* getTheme(options);
    const resetCurrentLine = eraseLine + cursorLeft;
    const errorText = renderNumberError(state, figures.pointerSmall, figures, {
      plain: true
    });
    const promptText = renderNumberOutput(state, figures.prefix, figures.pointerSmall, options, figures, {
      plain: true
    });
    const clearOutput = clearOutputWithError(promptText, columns, errorText);
    return clearOutput + resetCurrentLine;
  });
};
var renderNumberInput = (state, submitted, theme, renderOptions) => {
  const value3 = state.value === "" ? "" : `${state.value}`;
  if (submitted || renderOptions?.plain === true) {
    return value3;
  }
  const annotation = isSome2(state.error) ? theme.errorColor : combine3(underlined, theme.primaryColor);
  return annotate2(value3, annotation);
};
var renderNumberError = (state, pointer, theme, renderOptions) => {
  if (isSome2(state.error)) {
    return match3(state.error.value.split(NEWLINE_REGEXP), {
      onEmpty: () => "",
      onNonEmpty: (errorLines) => {
        if (renderOptions?.plain === true) {
          return separateSymbol(pointer, errorLines.join("\n"));
        }
        const prefix = annotateSymbol(pointer, theme.errorColor);
        const lines2 = map2(errorLines, (str) => annotateErrorLine(str, theme.errorColor));
        return cursorSavePosition + "\n" + separateSymbol(prefix, lines2.join("\n")) + cursorRestorePosition;
      }
    });
  }
  return "";
};
var renderNumberOutput = (state, leadingSymbol, trailingSymbol, options, theme, renderOptions, submitted = false) => {
  const value3 = renderNumberInput(state, submitted, theme, renderOptions);
  return renderPrompt(value3, options.message, leadingSymbol, trailingSymbol, renderOptions);
};
var renderNumberNextFrame = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.prefix, figures.primaryColor);
  const trailingSymbol = annotateSymbol(figures.pointerSmall, figures.mutedColor);
  const errorMsg = renderNumberError(state, figures.pointerSmall, figures);
  const promptMsg = renderNumberOutput(state, leadingSymbol, trailingSymbol, options, figures);
  return promptMsg + errorMsg;
});
var renderNumberSubmission = /* @__PURE__ */ fnUntraced2(function* (nextState, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.tick, figures.successColor);
  const trailingSymbol = annotateSymbol(figures.ellipsis, figures.mutedColor);
  const promptMsg = renderNumberOutput(nextState, leadingSymbol, trailingSymbol, options, figures, void 0, true);
  return promptMsg + "\n";
});
var processNumberBackspace = (state) => {
  if (state.value.length <= 0) {
    return succeed6(Action.Beep());
  }
  const value3 = state.value.slice(0, state.value.length - 1);
  return succeed6(Action.NextFrame({
    state: {
      ...state,
      value: value3,
      error: none2()
    }
  }));
};
var processNumberClear = (state) => succeed6(Action.NextFrame({
  state: {
    ...state,
    cursor: 0,
    value: "",
    error: none2()
  }
}));
var defaultIntProcessor = (input, state) => {
  if (state.value.length === 0 && input === "-") {
    return succeed6(Action.NextFrame({
      state: {
        ...state,
        value: "-",
        error: none2()
      }
    }));
  }
  const parsed = globalThis.Number.parseInt(state.value + input);
  if (globalThis.Number.isNaN(parsed)) {
    return succeed6(Action.Beep());
  } else {
    return succeed6(Action.NextFrame({
      state: {
        ...state,
        value: `${parsed}`,
        error: none2()
      }
    }));
  }
};
var defaultFloatProcessor = (input, state) => {
  if (input === "." && state.value.includes(".")) {
    return succeed6(Action.Beep());
  }
  if (state.value.length === 0 && input === "-") {
    return succeed6(Action.NextFrame({
      state: {
        ...state,
        value: "-",
        error: none2()
      }
    }));
  }
  const parsed = globalThis.Number.parseFloat(state.value + input);
  if (globalThis.Number.isNaN(parsed)) {
    return succeed6(Action.Beep());
  } else {
    return succeed6(Action.NextFrame({
      state: {
        ...state,
        value: input === "." ? `${parsed}.` : state.value.includes(".") && /^\d$/.test(input) ? state.value + input : `${parsed}`,
        error: none2()
      }
    }));
  }
};
var handleRenderInteger = (options) => {
  return (state, action) => {
    return Action.$match(action, {
      Beep: () => succeed6(renderBeep),
      NextFrame: ({
        state: state2
      }) => renderNumberNextFrame(state2, options),
      Submit: () => renderNumberSubmission(state, options)
    });
  };
};
var handleProcessInteger = (options) => {
  return (input, state) => {
    if (input.key.ctrl && input.key.name === "u") {
      return processNumberClear(state);
    }
    switch (input.key.name) {
      case "backspace": {
        return processNumberBackspace(state);
      }
      case "k":
      case "up": {
        return succeed6(Action.NextFrame({
          state: {
            ...state,
            value: state.value === "" || state.value === "-" ? `${options.incrementBy}` : `${globalThis.Number.parseInt(state.value) + options.incrementBy}`,
            error: none2()
          }
        }));
      }
      case "j":
      case "down": {
        return succeed6(Action.NextFrame({
          state: {
            ...state,
            value: state.value === "" || state.value === "-" ? `-${options.decrementBy}` : `${globalThis.Number.parseInt(state.value) - options.decrementBy}`,
            error: none2()
          }
        }));
      }
      case "enter":
      case "return": {
        const parsed = globalThis.Number.parseInt(state.value);
        if (globalThis.Number.isNaN(parsed)) {
          return succeed6(Action.NextFrame({
            state: {
              ...state,
              error: some2("Must provide an integer value")
            }
          }));
        } else {
          return match6(options.validate(parsed), {
            onFailure: (error2) => Action.NextFrame({
              state: {
                ...state,
                error: some2(error2)
              }
            }),
            onSuccess: (value3) => Action.Submit({
              value: value3
            })
          });
        }
      }
      default: {
        return defaultIntProcessor(getOrElse(input.input, () => ""), state);
      }
    }
  };
};
var handleRenderFloat = (options) => {
  return (state, action) => {
    return Action.$match(action, {
      Beep: () => succeed6(renderBeep),
      NextFrame: ({
        state: state2
      }) => renderNumberNextFrame(state2, options),
      Submit: () => renderNumberSubmission(state, options)
    });
  };
};
var handleProcessFloat = (options) => {
  return (input, state) => {
    if (input.key.ctrl && input.key.name === "u") {
      return processNumberClear(state);
    }
    switch (input.key.name) {
      case "backspace": {
        return processNumberBackspace(state);
      }
      case "k":
      case "up": {
        return succeed6(Action.NextFrame({
          state: {
            ...state,
            value: state.value === "" || state.value === "-" ? `${options.incrementBy}` : `${globalThis.Number.parseFloat(state.value) + options.incrementBy}`,
            error: none2()
          }
        }));
      }
      case "j":
      case "down": {
        return succeed6(Action.NextFrame({
          state: {
            ...state,
            value: state.value === "" || state.value === "-" ? `-${options.decrementBy}` : `${globalThis.Number.parseFloat(state.value) - options.decrementBy}`,
            error: none2()
          }
        }));
      }
      case "enter":
      case "return": {
        const parsed = globalThis.Number.parseFloat(state.value);
        if (globalThis.Number.isNaN(parsed)) {
          return succeed6(Action.NextFrame({
            state: {
              ...state,
              error: some2("Must provide a floating point value")
            }
          }));
        } else {
          return flatMap4(sync2(() => round(parsed, options.precision)), (rounded) => match6(options.validate(rounded), {
            onFailure: (error2) => Action.NextFrame({
              state: {
                ...state,
                error: some2(error2)
              }
            }),
            onSuccess: (value3) => Action.Submit({
              value: value3
            })
          }));
        }
      }
      default: {
        return defaultFloatProcessor(getOrElse(input.input, () => ""), state);
      }
    }
  };
};
var renderSelectOutput = (leadingSymbol, trailingSymbol, options, renderOptions) => options.message === void 0 ? void 0 : renderPrompt("", options.message, leadingSymbol, trailingSymbol, renderOptions);
var withSelectHeader = (header, body) => header === void 0 ? body : header + "\n" + body;
var renderChoicePrefix = (state, choices, toDisplay, currentIndex, figures, renderOptions) => {
  const prefix = renderPagingPrefix(figures, currentIndex === toDisplay.startIndex && toDisplay.startIndex > 0, currentIndex === toDisplay.endIndex - 1 && toDisplay.endIndex < choices.length);
  if (renderOptions?.plain === true) {
    return state === currentIndex ? figures.pointer + prefix : prefix + " ".repeat(figures.pointer.length);
  }
  if (choices[currentIndex].disabled) {
    const annotation = combine3(bold, figures.mutedColor);
    return state === currentIndex ? annotateSymbol(figures.pointer, annotation) + prefix : prefix + " ".repeat(figures.pointer.length);
  }
  return state === currentIndex ? annotateSymbol(figures.pointer, figures.primaryColor) + prefix : prefix + " ".repeat(figures.pointer.length);
};
var renderChoiceTitle = (choice, isSelected, theme, renderOptions) => {
  if (renderOptions?.plain === true) {
    return choice.title;
  }
  const title = choice.title;
  if (isSelected) {
    return choice.disabled ? annotate2(title, combine3(underlined, theme.mutedColor)) : annotate2(title, combine3(underlined, theme.primaryColor));
  }
  return choice.disabled ? annotate2(title, combine3(strikethrough, theme.mutedColor)) : title;
};
var renderSelectChoices = (state, options, figures, renderOptions) => {
  const choices = options.choices;
  const toDisplay = entriesToDisplay(state, choices.length, options.maxPerPage);
  const documents = [];
  for (let index = toDisplay.startIndex; index < toDisplay.endIndex; index++) {
    const choice = choices[index];
    const isSelected = state === index;
    const prefix = renderChoicePrefix(state, choices, toDisplay, index, figures, renderOptions);
    const title = renderChoiceTitle(choice, isSelected, figures, renderOptions);
    const description = renderChoiceDescription(choice, isSelected, figures, renderOptions);
    documents.push(prefix + title + " " + description);
  }
  return documents.join("\n");
};
var renderSelectNextFrame = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const figures = yield* getTheme(options);
  const choices = renderSelectChoices(state, options, figures);
  const leadingSymbol = annotateSymbol(figures.prefix, figures.primaryColor);
  const trailingSymbol = annotateSymbol(figures.pointerSmall, figures.mutedColor);
  const promptMsg = renderSelectOutput(leadingSymbol, trailingSymbol, options);
  return cursorHide + withSelectHeader(promptMsg, choices);
});
var renderSelectSubmission = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const figures = yield* getTheme(options);
  const selected = options.choices[state].title;
  const leadingSymbol = annotateSymbol(figures.tick, figures.successColor);
  const trailingSymbol = annotateSymbol(figures.ellipsis, figures.mutedColor);
  const promptMsg = renderSelectOutput(leadingSymbol, trailingSymbol, options) ?? leadingSymbol;
  return promptMsg + " " + annotate2(selected, figures.submittedColor) + "\n";
});
var processSelectCursorUp = (state, choices) => {
  if (state === 0) {
    return succeed6(Action.NextFrame({
      state: choices.length - 1
    }));
  }
  return succeed6(Action.NextFrame({
    state: state - 1
  }));
};
var processSelectCursorDown = (state, choices) => {
  if (state === choices.length - 1) {
    return succeed6(Action.NextFrame({
      state: 0
    }));
  }
  return succeed6(Action.NextFrame({
    state: state + 1
  }));
};
var processSelectNext = (state, choices) => {
  return succeed6(Action.NextFrame({
    state: (state + 1) % choices.length
  }));
};
var handleSelectRender = (options) => {
  return (state, action) => {
    return Action.$match(action, {
      Beep: () => succeed6(renderBeep),
      NextFrame: ({
        state: state2
      }) => renderSelectNextFrame(state2, options),
      Submit: () => renderSelectSubmission(state, options)
    });
  };
};
var handleSelectClear = (options) => fnUntraced2(function* (state, _) {
  const terminal = yield* Terminal;
  const columns = yield* terminal.columns;
  const figures = yield* getTheme(options);
  const clearPrompt = eraseLine + cursorLeft;
  const promptText = renderSelectOutput(figures.prefix, figures.pointerSmall, options, {
    plain: true
  });
  const choicesText = renderSelectChoices(state, options, figures, {
    plain: true
  });
  const clearOutput = eraseText(withSelectHeader(promptText, choicesText), columns);
  return clearOutput + clearPrompt;
});
var handleSelectProcess = (options) => {
  return (input, state) => {
    switch (input.key.name) {
      case "k":
      case "up": {
        return processSelectCursorUp(state, options.choices);
      }
      case "j":
      case "down": {
        return processSelectCursorDown(state, options.choices);
      }
      case "tab": {
        return processSelectNext(state, options.choices);
      }
      case "enter":
      case "return": {
        const selected = options.choices[state];
        if (selected.disabled) {
          return succeed6(Action.Beep());
        }
        return succeed6(Action.Submit({
          value: selected.value
        }));
      }
      default: {
        return succeed6(Action.Beep());
      }
    }
  };
};
var renderClearScreen = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const terminal = yield* Terminal;
  const columns = yield* terminal.columns;
  const figures = yield* getTheme(options);
  const resetCurrentLine = eraseLine + cursorLeft;
  const errorText = renderTextError(state, figures.pointerSmall, figures, {
    plain: true
  });
  const clearOutput = clearOutputWithError(renderTextOutput(state, figures.prefix, figures.pointerSmall, options, figures, {
    plain: true
  }), columns, errorText);
  return clearOutput + resetCurrentLine;
});
var renderTextInput = (nextState, options, theme, submitted, renderOptions) => {
  const text = nextState.value;
  if (renderOptions?.plain === true) {
    switch (options.type) {
      case "hidden": {
        return "";
      }
      case "password": {
        return theme.passwordMask.repeat(text.length);
      }
      case "text": {
        return text;
      }
    }
  }
  if (text.length === 0) {
    return "";
  }
  const annotation = isSome2(nextState.error) ? theme.errorColor : submitted ? theme.submittedColor : combine3(underlined, theme.primaryColor);
  switch (options.type) {
    case "hidden": {
      return "";
    }
    case "password": {
      return annotateSymbol(theme.passwordMask.repeat(text.length), annotation);
    }
    case "text": {
      return annotate2(text, annotation);
    }
  }
};
var renderTextError = (nextState, pointer, theme, renderOptions) => {
  if (isSome2(nextState.error)) {
    return match3(nextState.error.value.split(NEWLINE_REGEXP), {
      onEmpty: () => "",
      onNonEmpty: (errorLines) => {
        if (renderOptions?.plain === true) {
          return separateSymbol(pointer, errorLines.join("\n"));
        }
        const prefix = annotateSymbol(pointer, theme.errorColor);
        const lines2 = map2(errorLines, (str) => annotateErrorLine(str, theme.errorColor));
        return cursorSavePosition + "\n" + separateSymbol(prefix, lines2.join("\n")) + cursorRestorePosition;
      }
    });
  }
  return "";
};
var renderTextOutput = (nextState, leadingSymbol, trailingSymbol, options, theme, renderOptions, submitted = false) => {
  const value3 = renderTextInput(nextState, options, theme, submitted, renderOptions);
  return renderPrompt(value3, options.message, leadingSymbol, trailingSymbol, renderOptions);
};
var renderTextNextFrame = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.prefix, figures.primaryColor);
  const trailingSymbol = annotateSymbol(figures.pointerSmall, figures.mutedColor);
  const promptMsg = renderTextOutput(state, leadingSymbol, trailingSymbol, options, figures);
  const errorMsg = renderTextError(state, figures.pointerSmall, figures);
  const cursorWidth = options.type === "password" ? figures.passwordMask.length : 1;
  const offset = (state.cursor - state.value.length) * cursorWidth;
  return promptMsg + errorMsg + cursorMove(offset);
});
var renderTextSubmission = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.tick, figures.successColor);
  const trailingSymbol = annotateSymbol(figures.ellipsis, figures.mutedColor);
  const promptMsg = renderTextOutput(state, leadingSymbol, trailingSymbol, options, figures, void 0, true);
  return promptMsg + "\n";
});
var processTextBackspace = (state) => {
  if (state.cursor <= 0) {
    return succeed6(Action.Beep());
  }
  const beforeCursor = state.value.slice(0, state.cursor - 1);
  const afterCursor = state.value.slice(state.cursor);
  const cursor = state.cursor - 1;
  const value3 = `${beforeCursor}${afterCursor}`;
  return succeed6(Action.NextFrame({
    state: {
      ...state,
      cursor,
      value: value3,
      error: none2()
    }
  }));
};
var processTextClear = (state) => succeed6(Action.NextFrame({
  state: {
    ...state,
    cursor: 0,
    value: "",
    error: none2()
  }
}));
var processTextCursorLeft = (state) => {
  if (state.cursor <= 0) {
    return succeed6(Action.Beep());
  }
  const cursor = state.cursor - 1;
  return succeed6(Action.NextFrame({
    state: {
      ...state,
      cursor,
      error: none2()
    }
  }));
};
var processTextCursorRight = (state) => {
  if (state.cursor >= state.value.length) {
    return succeed6(Action.Beep());
  }
  const cursor = Math.min(state.cursor + 1, state.value.length);
  return succeed6(Action.NextFrame({
    state: {
      ...state,
      cursor,
      error: none2()
    }
  }));
};
var processTextCursorStart = (state) => succeed6(Action.NextFrame({
  state: {
    ...state,
    cursor: 0,
    error: none2()
  }
}));
var processTextCursorEnd = (state) => succeed6(Action.NextFrame({
  state: {
    ...state,
    cursor: state.value.length,
    error: none2()
  }
}));
var processTab = (state, options) => {
  if (state.value === options.default) {
    return succeed6(Action.Beep());
  }
  const value3 = state.value.length === 0 ? options.default : state.value;
  return succeed6(Action.NextFrame({
    state: {
      ...state,
      value: value3,
      cursor: value3.length,
      error: none2()
    }
  }));
};
var defaultTextProcessor = (input, state) => {
  const beforeCursor = state.value.slice(0, state.cursor);
  const afterCursor = state.value.slice(state.cursor);
  const value3 = `${beforeCursor}${input}${afterCursor}`;
  const cursor = state.cursor + input.length;
  return succeed6(Action.NextFrame({
    state: {
      ...state,
      cursor,
      value: value3,
      error: none2()
    }
  }));
};
var handleTextRender = (options) => {
  return (state, action) => {
    return Action.$match(action, {
      Beep: () => succeed6(renderBeep),
      NextFrame: ({
        state: state2
      }) => renderTextNextFrame(state2, options),
      Submit: () => renderTextSubmission(state, options)
    });
  };
};
var handleTextProcess = (options) => {
  return (input, state) => {
    if (input.key.ctrl) {
      switch (input.key.name) {
        case "u": {
          return processTextClear(state);
        }
        case "a": {
          return processTextCursorStart(state);
        }
        case "e": {
          return processTextCursorEnd(state);
        }
        default: {
          return succeed6(Action.Beep());
        }
      }
    }
    switch (input.key.name) {
      case "backspace": {
        return processTextBackspace(state);
      }
      case "left": {
        return processTextCursorLeft(state);
      }
      case "right": {
        return processTextCursorRight(state);
      }
      case "home": {
        return processTextCursorStart(state);
      }
      case "end": {
        return processTextCursorEnd(state);
      }
      case "enter":
      case "return": {
        const value3 = state.value;
        return match6(options.validate(value3), {
          onFailure: (error2) => Action.NextFrame({
            state: {
              ...state,
              value: value3,
              error: some2(error2)
            }
          }),
          onSuccess: (value4) => Action.Submit({
            value: value4
          })
        });
      }
      case "tab": {
        return processTab(state, options);
      }
      default: {
        return defaultTextProcessor(getOrElse(input.input, () => ""), state);
      }
    }
  };
};
var handleTextClear = (options) => {
  return (state, _) => {
    return renderClearScreen(state, options);
  };
};
var basePrompt = (options, type) => {
  const opts = {
    default: "",
    type,
    validate: succeed6,
    ...options
  };
  const initialState = {
    cursor: opts.default.length,
    value: opts.default,
    error: none2()
  };
  return Custom(initialState, {
    render: handleTextRender(opts),
    process: handleTextProcess(opts),
    clear: handleTextClear(opts)
  });
};
var handleToggleClear = /* @__PURE__ */ fnUntraced2(function* (options) {
  const terminal = yield* Terminal;
  const columns = yield* terminal.columns;
  const figures = yield* getTheme(options);
  const clearPrompt = eraseLine + cursorLeft;
  const toggleText = options.active + " " + separateSymbol(figures.toggleSeparator, options.inactive);
  const promptText = renderPrompt(toggleText, options.message, figures.prefix, figures.pointerSmall, {
    plain: true
  });
  const clearOutput = eraseText(promptText, columns);
  return clearOutput + clearPrompt;
});
var renderToggle = (value3, options, theme, submitted = false) => {
  const separator = annotateSymbol(theme.toggleSeparator, theme.mutedColor);
  const selectedAnnotation = combine3(underlined, submitted ? theme.submittedColor : theme.primaryColor);
  const inactive = value3 ? options.inactive : annotate2(options.inactive, selectedAnnotation);
  const active = value3 ? annotate2(options.active, selectedAnnotation) : options.active;
  return active + " " + separateSymbol(separator, inactive);
};
var renderToggleOutput = (toggle, leadingSymbol, trailingSymbol, options) => {
  return renderPrompt(toggle, options.message, leadingSymbol, trailingSymbol);
};
var renderToggleNextFrame = /* @__PURE__ */ fnUntraced2(function* (state, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.prefix, figures.primaryColor);
  const trailingSymbol = annotateSymbol(figures.pointerSmall, figures.mutedColor);
  const toggle = renderToggle(state, options, figures);
  const promptMsg = renderToggleOutput(toggle, leadingSymbol, trailingSymbol, options);
  return cursorHide + promptMsg;
});
var renderToggleSubmission = /* @__PURE__ */ fnUntraced2(function* (value3, options) {
  const figures = yield* getTheme(options);
  const leadingSymbol = annotateSymbol(figures.tick, figures.successColor);
  const trailingSymbol = annotateSymbol(figures.ellipsis, figures.mutedColor);
  const toggle = renderToggle(value3, options, figures, true);
  const promptMsg = renderToggleOutput(toggle, leadingSymbol, trailingSymbol, options);
  return promptMsg + "\n";
});
var activate = /* @__PURE__ */ succeed6(/* @__PURE__ */ Action.NextFrame({
  state: true
}));
var deactivate = /* @__PURE__ */ succeed6(/* @__PURE__ */ Action.NextFrame({
  state: false
}));
var handleToggleRender = (options) => {
  return (state, action) => {
    switch (action._tag) {
      case "Beep": {
        return succeed6(renderBeep);
      }
      case "NextFrame": {
        return renderToggleNextFrame(state, options);
      }
      case "Submit": {
        return renderToggleSubmission(state, options);
      }
    }
  };
};
var handleToggleProcess = (input, state) => {
  switch (input.key.name) {
    case "0":
    case "j":
    case "delete":
    case "right":
    case "down": {
      return deactivate;
    }
    case "1":
    case "k":
    case "left":
    case "up": {
      return activate;
    }
    case " ":
    case "tab": {
      return state ? deactivate : activate;
    }
    case "enter":
    case "return": {
      return succeed6(Action.Submit({
        value: state
      }));
    }
    default: {
      return succeed6(Action.Beep());
    }
  }
};
var entriesToDisplay = (cursor, total, maxVisible) => {
  const max = maxVisible === void 0 ? total : maxVisible;
  let startIndex = Math.min(total - max, cursor - Math.floor(max / 2));
  if (startIndex < 0) {
    startIndex = 0;
  }
  const endIndex = Math.min(startIndex + max, total);
  return {
    startIndex,
    endIndex
  };
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/Param.js
var TypeId31 = "~effect/cli/Param";
var argumentKind = "argument";
var flagKind = "flag";
var Proto7 = {
  [TypeId31]: {
    _A: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isParam = (u) => hasProperty(u, TypeId31);
var isFlagParam = (single) => single.kind === "flag";
var makeSingle2 = (params) => {
  const parse = (args2) => params.kind === argumentKind ? parsePositional(params.name, params.primitiveType, args2) : parseFlag(params.name, params.primitiveType, args2);
  return Object.setPrototypeOf({
    _tag: "Single",
    ...params,
    description: params.description ?? none2(),
    aliases: params.aliases ?? [],
    hidden: params.hidden ?? false,
    parse
  }, Proto7);
};
var String8 = (kind, name) => makeSingle2({
  name,
  primitiveType: String6,
  kind
});
var Boolean5 = (kind, name) => makeSingle2({
  name,
  primitiveType: Boolean4,
  kind
});
var ChoiceWithValue = (kind, name, choices) => makeSingle2({
  name,
  primitiveType: Choice(choices),
  kind
});
var Literals2 = (kind, name, choices) => {
  const mappedChoices = choices.map((value3) => [value3, value3]);
  return ChoiceWithValue(kind, name, mappedChoices);
};
var FLAG_DASH_REGEXP = /^-+/;
var withAlias = /* @__PURE__ */ dual(2, (self, alias) => {
  return transformSingle(self, (single) => makeSingle2({
    ...single,
    aliases: [...single.aliases, alias.replace(FLAG_DASH_REGEXP, "")]
  }));
});
var withDescription = /* @__PURE__ */ dual(2, (self, description) => {
  return transformSingle(self, (single) => makeSingle2({
    ...single,
    description: some2(description)
  }));
});
var map10 = /* @__PURE__ */ dual(2, (self, f) => {
  const parse = (args2) => map5(self.parse(args2), ([operands, value3]) => [operands, f(value3)]);
  return Object.assign(Object.create(Proto7), {
    _tag: "Map",
    kind: self.kind,
    param: self,
    f,
    parse
  });
});
var transform3 = (self, f, alternatives = []) => {
  const alternativeParsers = alternatives.map((alternative) => () => alternative().parse);
  return Object.assign(Object.create(Proto7), {
    _tag: "Transform",
    kind: self.kind,
    param: self,
    alternatives,
    f,
    parse: f(self.parse, alternativeParsers)
  });
};
var mapEffect2 = /* @__PURE__ */ dual(2, (self, f) => transform3(self, (parse) => (args2) => flatMap4(parse(args2), ([leftover, a]) => f(a).pipe(map5((b) => [leftover, b])))));
var optional3 = (param) => {
  const parse = (args2) => param.parse(args2).pipe(
    map5(([leftover, value3]) => [leftover, some2(value3)]),
    // Catch both MissingOption (for flags) and MissingArgument (for positional arguments)
    catchTags2({
      MissingOption: () => succeed6([args2.arguments, none2()]),
      MissingArgument: () => succeed6([args2.arguments, none2()])
    })
  );
  return Object.assign(Object.create(Proto7), {
    _tag: "Optional",
    kind: param.kind,
    param,
    parse
  });
};
var withDefault4 = /* @__PURE__ */ dual(2, (self, defaultValue) => {
  if (!isEffect2(defaultValue)) {
    return map10(optional3(self), getOrElse(() => defaultValue));
  }
  return mapEffect2(optional3(self), match({
    onNone: () => defaultValue,
    onSome: succeed6
  }));
});
var withFallbackPrompt = /* @__PURE__ */ dual(2, (self, prompt) => {
  const runPrompt = (error2, args2) => flatMap4(isPrompt(prompt) ? succeed6(prompt) : prompt, run3).pipe(map5((value3) => [args2.arguments, value3]), catchTag2("QuitError", () => fail6(error2)));
  return transform3(self, (parse) => (args2) => parse(args2).pipe(catchTag2(["MissingOption", "MissingArgument"], (error2) => runPrompt(error2, args2))));
});
var variadic = (self, options) => {
  const single = getUnderlyingSingleOrThrow(self);
  const parse = (args2) => {
    if (single.kind === "argument") {
      return parsePositionalVariadic(self, single, args2, options);
    } else {
      return parseOptionVariadic(self, single, args2, options);
    }
  };
  return Object.assign(Object.create(Proto7), {
    _tag: "Variadic",
    kind: self.kind,
    param: self,
    min: fromUndefinedOr(options?.min),
    max: fromUndefinedOr(options?.max),
    parse
  });
};
var withMetavar = /* @__PURE__ */ dual(2, (self, metavar) => transformSingle(self, (single) => makeSingle2({
  ...single,
  typeName: metavar
})));
var parsePositional = /* @__PURE__ */ fnUntraced2(function* (name, primitiveType, args2) {
  if (args2.arguments.length === 0) {
    return yield* new MissingArgument({
      argument: name
    });
  }
  const arg = args2.arguments[0];
  const value3 = yield* mapError2(primitiveType.parse(arg), (error2) => new InvalidValue2({
    option: name,
    value: arg,
    expected: error2,
    kind: "argument"
  }));
  return [args2.arguments.slice(1), value3];
});
var parseFlag = /* @__PURE__ */ fnUntraced2(function* (name, primitiveType, args2) {
  const providedValues = args2.flags[name];
  if (providedValues === void 0 || providedValues.length === 0) {
    return yield* new MissingOption({
      option: name
    });
  }
  const arg = providedValues[0];
  const value3 = yield* mapError2(primitiveType.parse(arg), (error2) => new InvalidValue2({
    option: name,
    value: arg,
    expected: error2,
    kind: "flag"
  }));
  return [args2.arguments, value3];
});
var parsePositionalVariadic = /* @__PURE__ */ fnUntraced2(function* (self, single, args2, options) {
  const results2 = [];
  const minValue = options?.min ?? 0;
  const maxValue = options?.max ?? Number.POSITIVE_INFINITY;
  let count = 0;
  let currentArgs = args2.arguments;
  while (currentArgs.length > 0 && count < maxValue) {
    const [remainingArgs, value3] = yield* self.parse({
      flags: args2.flags,
      arguments: currentArgs
    });
    results2.push(value3);
    currentArgs = remainingArgs;
    count++;
  }
  if (count < minValue) {
    return yield* count === 0 ? new MissingArgument({
      argument: single.name
    }) : new InvalidValue2({
      option: single.name,
      value: `${count} values`,
      expected: `at least ${minValue} value${minValue === 1 ? "" : "s"}`,
      kind: single.kind
    });
  }
  return [currentArgs, results2];
});
var parseOptionVariadic = /* @__PURE__ */ fnUntraced2(function* (self, single, args2, options) {
  const results2 = [];
  const names = [single.name, ...single.aliases];
  const values = names.flatMap((name) => args2.flags[name] ?? []);
  const count = values.length;
  if (isNotUndefined(options?.min) && count < options.min) {
    return yield* count === 0 ? new MissingOption({
      option: single.name
    }) : new InvalidValue2({
      option: single.name,
      value: `${count} occurrences`,
      expected: `at least ${options.min} value${options.min === 1 ? "" : "s"}`,
      kind: single.kind
    });
  }
  if (isNotUndefined(options?.max) && count > options.max) {
    return yield* new InvalidValue2({
      option: single.name,
      value: `${count} occurrences`,
      expected: `at most ${options.max} value${options.max === 1 ? "" : "s"}`,
      kind: single.kind
    });
  }
  for (const value3 of values) {
    const [, parsedValue] = yield* self.parse({
      flags: {
        [single.name]: [value3]
      },
      arguments: []
    });
    results2.push(parsedValue);
  }
  return [args2.arguments, results2];
});
var matchParam = (param, patterns) => {
  const p = param;
  switch (p._tag) {
    case "Single":
      return patterns.Single(p);
    case "Map":
      return patterns.Map(p);
    case "Transform":
      return patterns.Transform(p);
    case "Optional":
      return patterns.Optional(p);
    case "Variadic":
      return patterns.Variadic(p);
  }
};
var transformSingle = (param, f) => {
  return matchParam(param, {
    Single: (single) => f(single),
    Map: (mapped) => map10(transformSingle(mapped.param, f), mapped.f),
    Transform: (mapped) => transform3(transformSingle(mapped.param, f), mapped.f, mapped.alternatives.map((alternative) => () => transformSingle(alternative(), f))),
    Optional: (p) => optional3(transformSingle(p.param, f)),
    Variadic: (p) => variadic(transformSingle(p.param, f), {
      min: getOrUndefined(p.min),
      max: getOrUndefined(p.max)
    })
  });
};
var extractSingleParams = (param) => {
  return matchParam(param, {
    Single: (single) => [single],
    Map: (mapped) => extractSingleParams(mapped.param),
    Transform: (mapped) => [...extractSingleParams(mapped.param), ...mapped.alternatives.flatMap((alternative) => extractSingleParams(alternative()))],
    Optional: (optional5) => extractSingleParams(optional5.param),
    Variadic: (variadic2) => extractSingleParams(variadic2.param)
  });
};
var getUnderlyingSingleOrThrow = (param) => {
  const singles = extractSingleParams(param);
  if (singles.length === 0) {
    throw new Error("No Single param found in param structure");
  }
  if (singles.length > 1) {
    throw new Error(`Multiple Single params found: ${singles.map((s) => s.name).join(", ")}`);
  }
  return singles[0];
};
var getParamMetadata = (param) => {
  return matchParam(param, {
    Single: () => ({
      isOptional: false,
      isVariadic: false,
      variadicMin: none2(),
      variadicMax: none2()
    }),
    Map: (mapped) => getParamMetadata(mapped.param),
    Transform: (mapped) => getParamMetadata(mapped.param),
    Optional: (optional5) => ({
      ...getParamMetadata(optional5.param),
      isOptional: true
    }),
    Variadic: (variadic2) => ({
      ...getParamMetadata(variadic2.param),
      isVariadic: true,
      variadicMin: variadic2.min,
      variadicMax: variadic2.max
    })
  });
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/Flag.js
var Boolean6 = (name) => Boolean5(flagKind, name);
var ChoiceWithValue2 = (name, choices) => ChoiceWithValue(flagKind, name, choices);
var Literals3 = (name, literals) => Literals2(flagKind, name, literals);
var withAlias2 = /* @__PURE__ */ dual(2, (self, alias) => withAlias(self, alias));
var withDescription2 = /* @__PURE__ */ dual(2, (self, description) => withDescription(self, description));
var withMetavar2 = /* @__PURE__ */ dual(2, (self, metavar) => withMetavar(self, metavar));
var optional4 = (param) => optional3(param);
var withDefault5 = withDefault4;
var map11 = /* @__PURE__ */ dual(2, (self, f) => map10(self, f));

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/config.js
var ConfigInternalTypeId = "~effect/cli/Command/Config/Internal";
var parseConfig = (config) => {
  const orderedParams = [];
  const flags = [];
  const args2 = [];
  function parse(config2) {
    const tree = /* @__PURE__ */ Object.create(null);
    for (const key of Object.keys(config2)) {
      tree[key] = parseValue(config2[key]);
    }
    return tree;
  }
  function parseValue(value3) {
    if (Array.isArray(value3)) {
      return {
        _tag: "Array",
        children: value3.map((v) => parseValue(v))
      };
    } else if (isParam(value3)) {
      const index = orderedParams.length;
      orderedParams.push(value3);
      if (value3.kind === "argument") {
        args2.push(value3);
      } else {
        flags.push(value3);
      }
      return {
        _tag: "Param",
        index
      };
    } else {
      return {
        _tag: "Nested",
        tree: parse(value3)
      };
    }
  }
  return {
    [ConfigInternalTypeId]: ConfigInternalTypeId,
    flags,
    arguments: args2,
    orderedParams,
    tree: parse(config)
  };
};
var emptyConfig = /* @__PURE__ */ parseConfig({});
var reconstructTree = (tree, results2) => {
  const output = {};
  for (const key of Object.keys(tree)) {
    assignProperty(output, key, nodeValue(tree[key]));
  }
  return output;
  function nodeValue(node) {
    switch (node._tag) {
      case "Param":
        return results2[node.index];
      case "Array":
        return node.children.map((child) => nodeValue(child));
      case "Nested":
        return reconstructTree(node.tree, results2);
    }
  }
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/command.js
var TypeId32 = "~effect/cli/Command";
var toImpl = (self) => self;
var Proto8 = {
  .../* @__PURE__ */ Prototype2({
    label: "Command",
    evaluate() {
      return toImpl(this).service;
    }
  })
};
var makeCommand = (options) => {
  const config = options.config;
  const contextConfig = options.contextConfig ?? emptyConfig;
  const service3 = options.service ?? Service(`${TypeId32}/${options.name}`);
  const annotations = options.annotations ?? empty();
  const globalFlags = options.globalFlags ?? [];
  const subcommands = options.subcommands ?? [];
  const handle = (input, commandPath) => isNotUndefined(options.handle) ? options.handle(input, commandPath) : fail6(new ShowHelp({
    commandPath,
    errors: []
  }));
  const parse = options.parse ?? makeParser(config);
  const parseContext = options.parseContext ?? makeParser(contextConfig, {
    allowLeftovers: true
  });
  const buildHelpDoc = (commandPath) => {
    const args2 = [];
    const flags = [];
    for (const arg of config.arguments) {
      const singles = extractSingleParams(arg);
      const metadata = getParamMetadata(arg);
      for (const single of singles) {
        args2.push({
          name: single.name,
          type: single.typeName ?? getTypeName(single.primitiveType),
          description: single.description,
          required: !metadata.isOptional && (!metadata.isVariadic || exists(metadata.variadicMin, (min) => min > 0)),
          variadic: metadata.isVariadic
        });
      }
    }
    let usage = commandPath.length > 0 ? commandPath.join(" ") : options.name;
    if (subcommands.some((group) => group.commands.some((c) => !c.unlisted))) {
      usage += " <subcommand>";
    }
    usage += " [flags]";
    for (const arg of args2) {
      const argName = arg.variadic ? `<${arg.name}...>` : `<${arg.name}>`;
      usage += ` ${arg.required ? argName : `[${argName}]`}`;
    }
    for (const option2 of config.flags) {
      const singles = extractSingleParams(option2);
      const metadata = getParamMetadata(option2);
      for (const single of singles) {
        if (single.hidden) continue;
        flags.push(toFlagDoc(single, metadata));
      }
    }
    const subcommandDocs = [];
    for (const group of subcommands) {
      const visible = group.commands.filter((c) => !c.unlisted);
      if (visible.length === 0) continue;
      subcommandDocs.push({
        group: group.group,
        commands: map2(visible, (subcommand) => ({
          name: subcommand.name,
          alias: subcommand.alias,
          shortDescription: subcommand.shortDescription,
          description: subcommand.description ?? ""
        }))
      });
    }
    const examples = options.examples ?? [];
    return {
      description: options.description ?? "",
      usage,
      flags,
      annotations,
      ...args2.length > 0 && {
        args: args2
      },
      ...subcommandDocs.length > 0 && {
        subcommands: subcommandDocs
      },
      ...examples.length > 0 && {
        examples
      }
    };
  };
  return Object.assign(Object.create(Proto8), {
    [TypeId32]: TypeId32,
    name: options.name,
    examples: options.examples ?? [],
    annotations,
    globalFlags,
    subcommands,
    unlisted: options.unlisted ?? false,
    config,
    contextConfig,
    service: service3,
    parse,
    parseContext,
    handle,
    buildHelpDoc,
    ...isNotUndefined(options.description) ? {
      description: options.description
    } : {},
    ...isNotUndefined(options.shortDescription) ? {
      shortDescription: options.shortDescription
    } : {},
    ...isNotUndefined(options.alias) ? {
      alias: options.alias
    } : {}
  });
};
var toFlagDoc = (single, metadata) => {
  const formattedAliases = single.aliases.map((alias) => alias.length === 1 ? `-${alias}` : `--${alias}`);
  return {
    name: single.name,
    aliases: formattedAliases,
    type: single.typeName ?? getTypeName(single.primitiveType),
    description: appendChoiceKeys(single.description, getChoiceKeys(single.primitiveType)),
    required: single.primitiveType._tag !== "Boolean" && !metadata.isOptional
  };
};
var appendChoiceKeys = (description, choiceKeys) => {
  if (choiceKeys === void 0 || choiceKeys.length === 0) {
    return description;
  }
  const choiceSuffix = `(choices: ${choiceKeys.join(", ")})`;
  return match(description, {
    onNone: () => some2(choiceSuffix),
    onSome: (value3) => some2(`${value3} ${choiceSuffix}`)
  });
};
var makeParser = (cfg, options) => fnUntraced2(function* (input) {
  const parsedArgs = {
    flags: input.flags,
    arguments: input.arguments
  };
  const [remainingArguments, values] = yield* parseParams(parsedArgs, cfg.orderedParams);
  if (options?.allowLeftovers !== true && remainingArguments.length > 0) {
    return yield* new UnexpectedArgument({
      arguments: remainingArguments
    });
  }
  return reconstructTree(cfg.tree, values);
});
var parseParams = /* @__PURE__ */ fnUntraced2(function* (parsedArgs, params) {
  const results2 = [];
  let currentArguments = parsedArgs.arguments;
  for (const option2 of params) {
    const [remainingArguments, parsed] = yield* option2.parse({
      flags: parsedArgs.flags,
      arguments: currentArguments
    });
    results2.push(parsed);
    currentArguments = remainingArguments;
  }
  return [currentArguments, results2];
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/completions/descriptor.js
var toFlagType = (single) => {
  const tag2 = single.primitiveType._tag;
  switch (tag2) {
    case "Boolean":
      return {
        _tag: "Boolean"
      };
    case "Int":
      return {
        _tag: "Int"
      };
    case "Finite":
      return {
        _tag: "Finite"
      };
    case "Date":
      return {
        _tag: "Date"
      };
    case "Choice": {
      const keys = getChoiceKeys(single.primitiveType);
      return {
        _tag: "Choice",
        values: keys ?? []
      };
    }
    case "Path":
      return {
        _tag: "Path",
        pathType: getPathType(single.primitiveType) ?? "either"
      };
    case "FileText":
    case "FileParse":
    case "FileSchema":
      return {
        _tag: "Path",
        pathType: "file"
      };
    default:
      return {
        _tag: "String"
      };
  }
};
var toArgumentType = (single) => {
  const tag2 = single.primitiveType._tag;
  switch (tag2) {
    case "Int":
      return {
        _tag: "Int"
      };
    case "Finite":
      return {
        _tag: "Finite"
      };
    case "Date":
      return {
        _tag: "Date"
      };
    case "Choice": {
      const keys = getChoiceKeys(single.primitiveType);
      return {
        _tag: "Choice",
        values: keys ?? []
      };
    }
    case "Path":
      return {
        _tag: "Path",
        pathType: getPathType(single.primitiveType) ?? "either"
      };
    case "FileText":
    case "FileParse":
    case "FileSchema":
      return {
        _tag: "Path",
        pathType: "file"
      };
    default:
      return {
        _tag: "String"
      };
  }
};
var fromCommand = (cmd, inheritedFlags = []) => {
  const impl = toImpl(cmd);
  const config = impl.config;
  const flags = [];
  const seen = /* @__PURE__ */ new Set();
  for (const [index, flag] of [...config.flags, ...inheritedFlags].entries()) {
    const singles = extractSingleParams(flag);
    for (const single of singles) {
      if (single.kind !== "flag") continue;
      if (single.hidden) continue;
      if (index >= config.flags.length && seen.has(single.name)) continue;
      seen.add(single.name);
      flags.push({
        name: single.name,
        aliases: single.aliases,
        description: getOrUndefined(single.description),
        type: toFlagType(single)
      });
    }
  }
  const args2 = [];
  for (const arg of config.arguments) {
    const singles = extractSingleParams(arg);
    const metadata = getParamMetadata(arg);
    for (const single of singles) {
      if (single.kind !== "argument") continue;
      args2.push({
        name: single.name,
        description: getOrUndefined(single.description),
        required: !metadata.isOptional,
        variadic: metadata.isVariadic,
        type: toArgumentType(single)
      });
    }
  }
  const subcommands = [];
  const sharedFlags = [...inheritedFlags, ...impl.contextConfig.flags];
  for (const group of cmd.subcommands) {
    for (const subcommand of group.commands) {
      if (subcommand.unlisted) continue;
      const descriptor = fromCommand(subcommand, sharedFlags);
      subcommands.push(descriptor);
      if (subcommand.alias && subcommand.alias !== subcommand.name) {
        subcommands.push({
          ...descriptor,
          name: subcommand.alias
        });
      }
    }
  }
  return {
    name: cmd.name,
    description: cmd.shortDescription ?? cmd.description,
    flags,
    arguments: args2,
    subcommands
  };
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/help.js
var dedupeGlobalFlags = (flags) => {
  const seen = /* @__PURE__ */ new Set();
  const deduped = [];
  for (const flag of flags) {
    if (seen.has(flag)) {
      continue;
    }
    seen.add(flag);
    deduped.push(flag);
  }
  return deduped;
};
var getCommandsForCommandPath = (command, commandPath) => {
  const commands = [command];
  let currentCommand = command;
  for (let i = 1; i < commandPath.length; i++) {
    const subcommandName = commandPath[i];
    let subcommand = void 0;
    for (const group of currentCommand.subcommands) {
      subcommand = group.commands.find((sub) => sub.name === subcommandName);
      if (subcommand) {
        break;
      }
    }
    if (!subcommand) {
      break;
    }
    commands.push(subcommand);
    currentCommand = subcommand;
  }
  return commands;
};
var getGlobalFlagsForCommandPath = (command, commandPath, builtIns) => {
  const commands = getCommandsForCommandPath(command, commandPath);
  const declared = commands.flatMap((current) => toImpl(current).globalFlags);
  return dedupeGlobalFlags([...builtIns, ...declared]);
};
var collectDeclaredGlobalFlags = (command) => {
  const collected = [];
  const visit = (current) => {
    const impl = toImpl(current);
    for (const flag of impl.globalFlags) {
      collected.push(flag);
    }
    for (const group of current.subcommands) {
      for (const subcommand of group.commands) {
        visit(subcommand);
      }
    }
  };
  visit(command);
  return dedupeGlobalFlags(collected);
};
var getSharedFlagsForCommandPath = (commands, currentFlags) => {
  if (commands.length <= 1) {
    return [];
  }
  const seen = new Set(currentFlags.map((flag) => flag.name));
  const sharedFlags = [];
  for (const ancestor of commands.slice(0, -1)) {
    const ancestorImpl = toImpl(ancestor);
    for (const flag of ancestorImpl.contextConfig.flags) {
      const singles = extractSingleParams(flag);
      const metadata = getParamMetadata(flag);
      for (const single of singles) {
        if (seen.has(single.name)) {
          continue;
        }
        if (single.hidden) {
          continue;
        }
        seen.add(single.name);
        sharedFlags.push(toFlagDoc(single, metadata));
      }
    }
  }
  return sharedFlags;
};
var getGlobalFlagsForCommandTree = (command, builtIns) => dedupeGlobalFlags([...builtIns, ...collectDeclaredGlobalFlags(command)]);
var getHelpForCommandPath = (command, commandPath, builtIns) => gen2(function* () {
  const commands = getCommandsForCommandPath(command, commandPath);
  const currentCommand = commands.length > 0 ? commands[commands.length - 1] : command;
  const baseDoc = toImpl(currentCommand).buildHelpDoc(commandPath);
  const sharedFlags = getSharedFlagsForCommandPath(commands, baseDoc.flags);
  const flags = getGlobalFlagsForCommandPath(command, commandPath, builtIns);
  const globalFlagDocs = [];
  for (const flag of flags) {
    const singles = extractSingleParams(flag.flag);
    const metadata = getParamMetadata(flag.flag);
    for (const single of singles) {
      if (single.hidden) continue;
      globalFlagDocs.push({
        ...toFlagDoc(single, metadata),
        required: false
      });
    }
  }
  return {
    ...baseDoc,
    flags: [...sharedFlags, ...baseDoc.flags],
    globalFlags: globalFlagDocs
  };
});

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/GlobalFlag.js
var Action2 = (options) => ({
  _tag: "Action",
  flag: options.flag,
  run: options.run
});
var Setting = (id) => (options) => {
  settingIdCounter += 1;
  const ref = Service(`effect/cli/GlobalFlag/${id}/${settingIdCounter}`);
  return Object.assign(ref, {
    _tag: "Setting",
    id,
    flag: options.flag
  });
};
var settingIdCounter = 0;
var Help = /* @__PURE__ */ Action2({
  flag: /* @__PURE__ */ Boolean6("help").pipe(/* @__PURE__ */ withAlias2("h"), /* @__PURE__ */ withDescription2("Show help information"), /* @__PURE__ */ withDefault5(false)),
  run: /* @__PURE__ */ fnUntraced2(function* (_, {
    builtIns,
    command,
    commandPath
  }) {
    const formatter = yield* Formatter;
    const helpDoc = yield* getHelpForCommandPath(command, commandPath, builtIns);
    yield* log(formatter.formatHelpDoc(helpDoc));
  })
});
var Version = /* @__PURE__ */ Action2({
  flag: /* @__PURE__ */ Boolean6("version").pipe(/* @__PURE__ */ withAlias2("v"), /* @__PURE__ */ withDescription2("Show version information"), /* @__PURE__ */ withDefault5(false)),
  run: /* @__PURE__ */ fnUntraced2(function* (_, {
    command,
    version
  }) {
    const formatter = yield* Formatter;
    yield* log(formatter.formatVersion(command.name, version));
  })
});
var Wizard = /* @__PURE__ */ Action2({
  flag: /* @__PURE__ */ Boolean6("wizard").pipe(/* @__PURE__ */ withDescription2("Start wizard mode for a command"), /* @__PURE__ */ withDefault5(false)),
  run: () => void_3
});
var Completions = /* @__PURE__ */ Action2({
  flag: /* @__PURE__ */ Literals3("completions", ["bash", "zsh", "fish", "sh"]).pipe(optional4, /* @__PURE__ */ map11((v) => map(v, (s) => s === "sh" ? "bash" : s)), /* @__PURE__ */ withMetavar2("<bash|zsh|fish|sh>"), /* @__PURE__ */ withDescription2("Print shell completion script")),
  run: /* @__PURE__ */ fnUntraced2(function* (shell, {
    command
  }) {
    if (isNone2(shell)) return;
    const descriptor = fromCommand(command);
    yield* log(generate4(command.name, shell.value, descriptor));
  })
});
var LogLevel = /* @__PURE__ */ Setting("log-level")({
  flag: /* @__PURE__ */ ChoiceWithValue2("log-level", [["all", "All"], ["trace", "Trace"], ["debug", "Debug"], ["info", "Info"], ["warn", "Warn"], ["warning", "Warn"], ["error", "Error"], ["fatal", "Fatal"], ["none", "None"]]).pipe(optional4, /* @__PURE__ */ withDescription2("Sets the minimum log level"), /* @__PURE__ */ withMetavar2("<all|trace|debug|info|warn|warning|error|fatal|none>"))
});
var BuiltIns = [Help, Version, Wizard, Completions, LogLevel];

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/CliConfig.js
var CliConfig = class extends (/* @__PURE__ */ Reference("effect/cli/CliConfig", {
  defaultValue: () => defaults
})) {
};
var defaults = {
  builtIns: BuiltIns
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/lexer.js
function lex(argv) {
  const endIndex = argv.indexOf("--");
  if (endIndex === -1) {
    return {
      tokens: lexTokens(argv),
      trailingOperands: []
    };
  }
  return {
    tokens: lexTokens(argv.slice(0, endIndex)),
    trailingOperands: argv.slice(endIndex + 1)
  };
}
var negativeNumberRegex = /^-(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
var lexTokens = (args2) => {
  const tokens = [];
  for (const arg of args2) {
    if (!arg.startsWith("-") || negativeNumberRegex.test(arg)) {
      tokens.push({
        _tag: "Value",
        value: arg
      });
    } else if (arg.startsWith("--")) {
      const equalIndex = arg.indexOf("=");
      if (equalIndex !== -1) {
        const name = arg.slice(2, equalIndex);
        const value3 = arg.slice(equalIndex + 1);
        tokens.push({
          _tag: "LongOption",
          name,
          raw: arg,
          value: value3
        });
      } else {
        tokens.push({
          _tag: "LongOption",
          name: arg.slice(2),
          raw: arg
        });
      }
    } else if (arg.length > 1) {
      const flags = arg.slice(1);
      const equalIndex = flags.indexOf("=");
      if (equalIndex !== -1) {
        const flag = flags.slice(0, equalIndex);
        const value3 = flags.slice(equalIndex + 1);
        tokens.push({
          _tag: "ShortOption",
          flag,
          raw: `-${flag}`,
          value: value3
        });
      } else {
        for (const ch of flags) {
          tokens.push({
            _tag: "ShortOption",
            flag: ch,
            raw: `-${ch}`
          });
        }
      }
    } else {
      tokens.push({
        _tag: "Value",
        value: arg
      });
    }
  }
  return tokens;
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/auto-suggest.js
var levenshtein = (a, b) => {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({
    length: m + 1
  }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};
var suggest = (input, candidates) => {
  const distances = candidates.map((c) => [levenshtein(input, c), c]).filter(([d]) => d <= 2).sort(([a], [b]) => a - b);
  if (distances.length === 0) return [];
  const minDistance = distances[0][0];
  return distances.filter(([d]) => d === minDistance).map(([, c]) => c);
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/parser.js
var getCommandPath = (parsedInput) => match(parsedInput.subcommand, {
  onNone: () => [],
  onSome: (subcommand) => [subcommand.name, ...getCommandPath(subcommand.parsedInput)]
});
var parseArgs = (lexResult, command, commandPath = []) => gen2(function* () {
  const {
    tokens,
    trailingOperands: afterEndOfOptions
  } = lexResult;
  const newCommandPath = [...commandPath, command.name];
  const commandImpl = toImpl(command);
  const singles = commandImpl.config.flags.flatMap(extractSingleParams);
  const flagParams = singles.filter(isFlagParam);
  const flagRegistry = createFlagRegistry(flagParams);
  const inheritedSingles = commandImpl.contextConfig.flags.flatMap(extractSingleParams);
  const inheritedFlagParams = inheritedSingles.filter(isFlagParam);
  const inheritedFlagRegistry = createFlagRegistry(inheritedFlagParams);
  const inheritedNames = new Set(inheritedFlagParams.map((param) => param.name));
  const context3 = {
    command,
    commandPath: newCommandPath,
    flagRegistry,
    inheritedFlagRegistry,
    localFlagNames: flagParams.filter((param) => !inheritedNames.has(param.name)).map((param) => param.name)
  };
  const result3 = scanCommandLevel(tokens, context3);
  if (result3._tag === "Leaf") {
    return {
      flags: result3.flags,
      arguments: [...result3.arguments, ...afterEndOfOptions],
      subcommand: none2(),
      ...result3.errors.length > 0 && {
        errors: result3.errors
      }
    };
  }
  const subLex = {
    tokens: result3.childTokens,
    trailingOperands: afterEndOfOptions
  };
  const subParsed = yield* parseArgs(subLex, result3.sub, newCommandPath);
  const allErrors = [...result3.errors, ...subParsed.errors ?? []];
  return {
    flags: result3.flags,
    arguments: [],
    subcommand: some2({
      name: result3.sub.name,
      parsedInput: subParsed
    }),
    ...allErrors.length > 0 && {
      errors: allErrors
    }
  };
});
var makeCursor = (tokens) => {
  let i = 0;
  return {
    peek: () => tokens[i],
    take: () => tokens[i++],
    rest: () => tokens.slice(i)
  };
};
var createFlagRegistry = (params) => {
  const index = /* @__PURE__ */ new Map();
  for (const param of params) {
    if (index.has(param.name)) {
      throw new Error(`Duplicate flag name "${param.name}" in command definition`);
    }
    index.set(param.name, param);
    for (const alias of param.aliases) {
      if (index.has(alias)) {
        throw new Error(`Duplicate flag/alias "${alias}" in command definition (conflicts with "${index.get(alias).name}")`);
      }
      index.set(alias, param);
    }
  }
  return {
    params,
    index
  };
};
var buildSubcommandIndex = (subcommands) => {
  const index = /* @__PURE__ */ new Map();
  const setKey = (key, command) => {
    const existing = index.get(key);
    if (existing && existing !== command) {
      throw new Error(`Duplicate subcommand name/alias "${key}" in command definition (conflicts with "${existing.name}")`);
    }
    index.set(key, command);
  };
  for (const group of subcommands) {
    for (const subcommand of group.commands) {
      setKey(subcommand.name, subcommand);
      if (subcommand.alias && subcommand.alias !== subcommand.name) {
        setKey(subcommand.alias, subcommand);
      }
    }
  }
  return index;
};
var createEmptyFlagMap = (params) => Object.fromEntries(params.map((p) => [p.name, []]));
var createFlagAccumulator = (params) => {
  const map12 = createEmptyFlagMap(params);
  return {
    add: (name, raw) => {
      if (raw !== void 0) map12[name].push(raw);
    },
    merge: (from) => {
      for (const key in from) {
        const values = from[key];
        if (values?.length) {
          for (let i = 0; i < values.length; i++) {
            map12[key].push(values[i]);
          }
        }
      }
    },
    snapshot: () => map12
  };
};
var isFlagToken = (t) => t._tag === "LongOption" || t._tag === "ShortOption";
var getFlagName = (t) => t._tag === "LongOption" ? t.name : t.flag;
var resolveFlag = (token, registry) => {
  const tokenName = getFlagName(token);
  const direct = registry.index.get(tokenName);
  if (direct && direct.name === tokenName) {
    return {
      param: direct,
      negated: false
    };
  }
  if (token._tag === "LongOption" && token.name.startsWith("no-")) {
    const canonicalName = token.name.slice(3);
    const param = registry.index.get(canonicalName);
    if (param && param.name === canonicalName && isBoolean2(param.primitiveType)) {
      return {
        param,
        negated: true
      };
    }
  }
  if (direct) {
    return {
      param: direct,
      negated: false
    };
  }
  return void 0;
};
var invalidNegatedFlagValue = (token, spec, value3) => new InvalidValue2({
  option: spec.name,
  value: value3,
  expected: `omit the value and use ${token.raw} by itself to set --${spec.name} to false`,
  kind: "flag"
});
var missingFlagValue = (spec) => {
  const choices = getChoiceKeys(spec.primitiveType);
  return new InvalidValue2({
    option: spec.name,
    value: "",
    expected: choices === void 0 ? spec.typeName ?? getTypeName(spec.primitiveType) : choices.join(" | "),
    kind: "flag"
  });
};
var asBooleanLiteral = (token) => token?._tag === "Value" && (isTrueLiteral(token.value) || isFalseLiteral(token.value)) ? token.value : void 0;
var consumeFlagValue = (cursor, token, spec, negated = false) => {
  const consumed = consumeFlagValueWithTokens(cursor, token, spec, negated);
  switch (consumed._tag) {
    case "Value":
      return {
        _tag: "Value",
        value: consumed.value
      };
    case "Error":
      return {
        _tag: "Error",
        error: consumed.error
      };
  }
};
var consumeFlagValueWithTokens = (cursor, token, spec, negated = false) => {
  if (negated) {
    if (token.value !== void 0) {
      return {
        _tag: "Error",
        error: invalidNegatedFlagValue(token, spec, token.value),
        tokens: []
      };
    }
    const literal = asBooleanLiteral(cursor.peek());
    if (literal !== void 0) {
      const literalToken = cursor.take();
      return {
        _tag: "Error",
        error: invalidNegatedFlagValue(token, spec, literal),
        tokens: literalToken === void 0 ? [] : [literalToken]
      };
    }
    return {
      _tag: "Value",
      value: "false",
      tokens: []
    };
  }
  if (token.value !== void 0) {
    return {
      _tag: "Value",
      value: token.value,
      tokens: []
    };
  }
  if (isBoolean2(spec.primitiveType)) {
    const literal = asBooleanLiteral(cursor.peek());
    const literalToken = literal !== void 0 ? cursor.take() : void 0;
    return {
      _tag: "Value",
      value: literal ?? "true",
      tokens: literalToken === void 0 ? [] : [literalToken]
    };
  }
  const next = cursor.peek();
  if (next?._tag === "Value") {
    const valueToken = cursor.take();
    return {
      _tag: "Value",
      value: next.value,
      tokens: valueToken === void 0 ? [] : [valueToken]
    };
  }
  return {
    _tag: "Error",
    error: missingFlagValue(spec),
    tokens: []
  };
};
var consumeKnownFlags = (tokens, registry) => {
  const flagMap = createEmptyFlagMap(registry.params);
  const remainder = [];
  const errors = [];
  const cursor = makeCursor(tokens);
  for (let t = cursor.take(); t; t = cursor.take()) {
    if (!isFlagToken(t)) {
      remainder.push(t);
      continue;
    }
    const resolved = resolveFlag(t, registry);
    if (!resolved) {
      remainder.push(t);
      continue;
    }
    const consumed = consumeFlagValue(cursor, t, resolved.param, resolved.negated);
    if (consumed._tag === "Error") {
      errors.push(consumed.error);
      continue;
    }
    if (consumed.value !== void 0) {
      flagMap[resolved.param.name].push(consumed.value);
    }
  }
  return {
    flagMap,
    remainder,
    errors
  };
};
var extractFlagParams = (command) => {
  const commandImpl = toImpl(command);
  const singles = commandImpl.config.flags.flatMap(extractSingleParams);
  return singles.filter(isFlagParam);
};
var extractContextFlagParams = (command) => {
  const commandImpl = toImpl(command);
  const singles = commandImpl.contextConfig.flags.flatMap(extractSingleParams);
  return singles.filter(isFlagParam);
};
var resolveFromRegistries = (token, registries) => {
  for (const registry of registries) {
    const resolved = resolveFlag(token, registry);
    if (resolved !== void 0) {
      return resolved;
    }
  }
  return void 0;
};
var preserveFlag = (remainder, cursor, token, resolved) => {
  remainder.push(token);
  const consumed = consumeFlagValueWithTokens(cursor, token, resolved.param, resolved.negated);
  remainder.push(...consumed.tokens);
};
var localFlagWouldPrecedeSubcommand = (token, remainingTokens, resolved, subIndex, registries) => {
  const cursor = makeCursor(remainingTokens);
  consumeFlagValueWithTokens(cursor, token, resolved.param, resolved.negated);
  for (let token2 = cursor.take(); token2; token2 = cursor.take()) {
    if (isFlagToken(token2)) {
      const known = resolveFromRegistries(token2, registries);
      if (known !== void 0) {
        consumeFlagValueWithTokens(cursor, token2, known.param, known.negated);
      }
      continue;
    }
    if (token2._tag === "Value") {
      return subIndex.has(token2.value);
    }
  }
  return false;
};
var consumeGlobalFlags = (tokens, command, registry) => {
  const flagMap = createEmptyFlagMap(registry.params);
  const errors = [];
  const consumeLevel = (tokens2, command2, ignoredRegistries) => {
    const localRegistry = createFlagRegistry(extractFlagParams(command2));
    const inheritedRegistry = createFlagRegistry(extractContextFlagParams(command2));
    const subIndex = buildSubcommandIndex(command2.subcommands);
    const cursor = makeCursor(tokens2);
    const remainder = [];
    let awaitingFirstValue = true;
    for (let token = cursor.take(); token; token = cursor.take()) {
      if (isFlagToken(token)) {
        const ignored = resolveFromRegistries(token, ignoredRegistries);
        if (ignored !== void 0) {
          preserveFlag(remainder, cursor, token, ignored);
          continue;
        }
        const inherited = resolveFlag(token, inheritedRegistry);
        if (inherited !== void 0) {
          preserveFlag(remainder, cursor, token, inherited);
          continue;
        }
        const local = resolveFlag(token, localRegistry);
        const global = resolveFlag(token, registry);
        if (local !== void 0) {
          if (global === void 0 || !awaitingFirstValue || !localFlagWouldPrecedeSubcommand(token, cursor.rest(), local, subIndex, [localRegistry, inheritedRegistry, registry])) {
            preserveFlag(remainder, cursor, token, local);
            continue;
          }
        }
        if (global !== void 0) {
          const consumed = consumeFlagValueWithTokens(cursor, token, global.param, global.negated);
          if (consumed._tag === "Error") {
            errors.push(consumed.error);
            continue;
          }
          if (consumed.value !== void 0) {
            flagMap[global.param.name].push(consumed.value);
          }
          continue;
        }
        remainder.push(token);
        continue;
      }
      if (token._tag === "Value" && awaitingFirstValue) {
        const sub = subIndex.get(token.value);
        if (sub !== void 0) {
          remainder.push(token);
          remainder.push(...consumeLevel(cursor.rest(), sub, [...ignoredRegistries, inheritedRegistry]));
          return remainder;
        }
        awaitingFirstValue = false;
      }
      remainder.push(token);
    }
    return remainder;
  };
  return {
    flagMap,
    remainder: consumeLevel(tokens, command, []),
    errors
  };
};
var createUnrecognizedFlagError = (token, params, commandPath) => {
  const printable = token._tag === "LongOption" ? `--${token.name}` : `-${token.flag}`;
  const validNames = [];
  for (const p of params) {
    if (p.hidden) continue;
    validNames.push(p.name);
    if (isBoolean2(p.primitiveType)) {
      validNames.push(`no-${p.name}`);
    }
    for (const alias of p.aliases) {
      validNames.push(alias);
    }
  }
  const suggestions = suggest(getFlagName(token), validNames).map((n) => n.length === 1 ? `-${n}` : `--${n}`);
  return new UnrecognizedOption({
    option: printable,
    suggestions,
    command: commandPath
  });
};
var createParseState = (registry) => ({
  flags: createFlagAccumulator(registry.params),
  arguments: [],
  errors: [],
  mode: {
    _tag: "AwaitingFirstValue"
  }
});
var toLeafResult = (state) => ({
  _tag: "Leaf",
  flags: state.flags.snapshot(),
  arguments: state.arguments,
  errors: state.errors
});
var resolveFirstValue = (value3, cursor, context3, state) => {
  const {
    command,
    commandPath,
    inheritedFlagRegistry,
    localFlagNames
  } = context3;
  const subIndex = buildSubcommandIndex(command.subcommands);
  const sub = subIndex.get(value3);
  if (sub) {
    const selectedPath = [...commandPath, sub.name];
    const parentFlags = state.flags.snapshot();
    for (const localFlagName of localFlagNames) {
      const values = parentFlags[localFlagName];
      if (values !== void 0 && values.length > 0) {
        state.errors.push(new UnrecognizedOption({
          option: `--${localFlagName}`,
          suggestions: [],
          command: selectedPath
        }));
      }
    }
    const tail = consumeKnownFlags(cursor.rest(), inheritedFlagRegistry);
    state.flags.merge(tail.flagMap);
    state.errors.push(...tail.errors);
    return {
      _tag: "Subcommand",
      result: {
        _tag: "Sub",
        flags: state.flags.snapshot(),
        sub,
        childTokens: tail.remainder,
        errors: state.errors
      }
    };
  }
  const expectsArgs = toImpl(command).config.arguments.length > 0;
  if (!expectsArgs && subIndex.size > 0) {
    const visibleKeys = [];
    for (const [key, sub2] of subIndex) {
      if (!sub2.unlisted) visibleKeys.push(key);
    }
    const suggestions = suggest(value3, visibleKeys);
    state.errors.push(new UnknownSubcommand({
      subcommand: value3,
      parent: commandPath,
      suggestions
    }));
  }
  return {
    _tag: "Argument"
  };
};
var processFlag = (token, cursor, context3, state) => {
  const {
    commandPath,
    flagRegistry
  } = context3;
  const resolved = resolveFlag(token, flagRegistry);
  if (!resolved) {
    state.errors.push(createUnrecognizedFlagError(token, flagRegistry.params, commandPath));
    return;
  }
  const consumed = consumeFlagValue(cursor, token, resolved.param, resolved.negated);
  if (consumed._tag === "Error") {
    state.errors.push(consumed.error);
    return;
  }
  state.flags.add(resolved.param.name, consumed.value);
};
var processValue = (value3, cursor, context3, state) => {
  if (state.mode._tag === "AwaitingFirstValue") {
    const result3 = resolveFirstValue(value3, cursor, context3, state);
    if (result3._tag === "Subcommand") {
      return result3.result;
    }
    state.mode = {
      _tag: "CollectingArguments"
    };
  }
  state.arguments.push(value3);
  return void 0;
};
var scanCommandLevel = (tokens, context3) => {
  const cursor = makeCursor(tokens);
  const state = createParseState(context3.flagRegistry);
  for (let token = cursor.take(); token; token = cursor.take()) {
    if (isFlagToken(token)) {
      processFlag(token, cursor, context3, state);
      continue;
    }
    if (token._tag === "Value") {
      const subResult = processValue(token.value, cursor, context3, state);
      if (subResult) return subResult;
    }
  }
  return toLeafResult(state);
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/internal/wizard.js
var run4 = /* @__PURE__ */ fnUntraced2(function* (command, options) {
  const commandPath = options?.commandPath ?? [command.name];
  const selected = getCommandAtPath(command, commandPath);
  const commandLine = (options?.prefix ?? commandPath).map((value3) => commandLineArg(value3));
  yield* logCurrentCommand(commandLine);
  yield* promptCommand(selected, commandLine, selected === command ? "ROOT" : selected.name);
  return {
    args: commandLine.map((arg) => arg.value),
    displayArgs: commandLine.map((arg) => arg.displayValue)
  };
});
var getCommandAtPath = (command, commandPath) => {
  let current = command;
  for (const name of commandPath.slice(1)) {
    const child = current.subcommands.flatMap((group) => group.commands).find((candidate) => candidate.name === name || candidate.alias === name);
    if (child === void 0) {
      break;
    }
    current = child;
  }
  return current;
};
var promptCommand = /* @__PURE__ */ fnUntraced2(function* (command, commandLine, sectionName) {
  const impl = toImpl(command);
  const visibleSubcommands = command.subcommands.flatMap((group) => group.commands.filter((child2) => !child2.unlisted));
  const config = visibleSubcommands.length === 0 ? impl.config : impl.contextConfig;
  if (config.flags.length > 0) {
    yield* log(renderSection(sectionName, "FLAGS"));
    for (const param of config.flags) {
      commandLine.push(...yield* promptParam(param));
    }
    if (config.arguments.length > 0 || visibleSubcommands.length > 0) {
      yield* logCurrentCommand(commandLine);
    }
  }
  if (config.arguments.length > 0) {
    yield* log(renderSection(sectionName, "ARGUMENTS"));
    for (const param of config.arguments) {
      commandLine.push(...yield* promptParam(param));
    }
    if (visibleSubcommands.length > 0) {
      yield* logCurrentCommand(commandLine);
    }
  }
  if (visibleSubcommands.length === 0) {
    return;
  }
  const child = yield* run3(Select({
    message: "Command",
    choices: visibleSubcommands.map((command2) => ({
      title: command2.name,
      value: command2,
      ...command2.shortDescription !== void 0 ? {
        description: command2.shortDescription
      } : command2.description !== void 0 ? {
        description: command2.description
      } : {}
    }))
  }));
  yield* log();
  commandLine.push(commandLineArg(child.name));
  if (hasWizardSteps(child)) {
    yield* logCurrentCommand(commandLine);
  }
  yield* promptCommand(child, commandLine, child.name);
});
var hasWizardSteps = (command) => {
  const hasVisibleSubcommands = command.subcommands.some((group) => group.commands.some((child) => !child.unlisted));
  return hasVisibleSubcommands || toImpl(command).config.orderedParams.length > 0;
};
var promptParam = /* @__PURE__ */ fnUntraced2(function* (param) {
  const single = getUnderlyingSingleOrThrow(param);
  const metadata = getParamMetadata(param);
  if (metadata.isOptional) {
    const include = yield* run3(Confirm({
      message: `Set ${renderParamLabel(single)}?`,
      initial: false
    }));
    if (!include) {
      yield* log();
      return [];
    }
  }
  const count = !metadata.isVariadic ? 1 : yield* run3(Int2({
    message: `${renderParamLabel(single)} count`,
    default: getOrElse(metadata.variadicMin, () => 0),
    min: getOrElse(metadata.variadicMin, () => 0),
    ...isSome2(metadata.variadicMax) ? {
      max: metadata.variadicMax.value
    } : {}
  }));
  const values = [];
  for (let i = 0; i < count; i++) {
    values.push(yield* promptSingle(single));
  }
  const parsed = single.kind === flagKind ? {
    flags: {
      [single.name]: values.map((arg) => arg.value)
    },
    arguments: []
  } : {
    flags: {},
    arguments: values.map((arg) => arg.value)
  };
  yield* param.parse(parsed);
  yield* log();
  if (single.kind === argumentKind) {
    return values;
  }
  return values.flatMap((value3) => value3.value.startsWith("-") && value3.value.length > 1 ? [commandLineArg(`--${single.name}=${value3.value}`, `--${single.name}=${value3.displayValue}`)] : [commandLineArg(`--${single.name}`), value3]);
});
var promptSingle = (single) => {
  const message = renderParamMessage(single);
  switch (single.primitiveType._tag) {
    case "Boolean":
      return map5(run3(Confirm({
        message,
        label: {
          confirm: "true",
          deny: "false"
        },
        placeholder: {
          defaultConfirm: "(T/f)",
          defaultDeny: "(t/F)"
        }
      })), (value3) => commandLineArg(String(value3)));
    case "Choice": {
      const choices = getChoiceKeys(single.primitiveType) ?? [];
      return map5(run3(Select({
        message,
        choices: choices.map((choice) => ({
          title: choice,
          value: choice
        }))
      })), commandLineArg);
    }
    case "Date":
      return map5(run3(Date4({
        message
      })), (date) => commandLineArg(date.toISOString()));
    case "Finite":
      return map5(run3(Number7({
        message
      })), (value3) => commandLineArg(String(value3)));
    case "Int":
      return map5(run3(Int2({
        message
      })), (value3) => commandLineArg(String(value3)));
    case "Redacted":
      return map5(run3(Password({
        message
      })), (value3) => commandLineArg(value2(value3), "<redacted>"));
    default:
      return map5(run3(String7({
        message
      })), commandLineArg);
  }
};
var commandLineArg = (value3, displayValue = value3) => ({
  value: value3,
  displayValue
});
var formatName = (single) => single.kind === flagKind ? `--${single.name}` : single.name;
var renderParamMessage = (single) => renderParamLabel(single);
var renderParamLabel = (single) => {
  const description = getOrUndefined(single.description)?.trim();
  const label = single.kind === flagKind && description !== void 0 && description.length <= 32 ? description : humanize(single.name);
  return single.kind === flagKind ? `${label} (${formatName(single)})` : label;
};
var humanize = (name) => {
  const words = name.split(/[-_]+/).filter((word) => word.length > 0);
  if (words.length === 0) return name;
  return [words[0][0].toUpperCase() + words[0].slice(1), ...words.slice(1)].join(" ");
};
var logCurrentCommand = (commandLine) => log(renderCommandBlock("Current command", commandLine.map((arg) => arg.displayValue), magenta));
var renderSection = (commandName, section) => `${annotate2(commandName.toUpperCase(), bold, cyanBright)} ${annotate2("\xB7", blackBright)} ${annotate2(section, bold, white)}`;
var renderIntroduction = (name, version, summary) => {
  const title = `${annotate2(name, bold, cyanBright)} ${annotate2(`v${version}`, white)} ${annotate2("\xB7 Command wizard", bold, white)}`;
  return [title, ...summary === void 0 || summary.length === 0 ? [] : [summary], annotate2("Build a command interactively. Press Ctrl+C to cancel.", blackBright), ""].join("\n");
};
var renderCompletion = (commandLine) => renderCommandBlock("Command ready", commandLine, cyanBright, green);
var renderQuit = () => `
${annotate2("Wizard cancelled.", red)}`;
var renderCommandBlock = (label, commandLine, commandColor, labelColor = white) => {
  const lines2 = wrapCommand(commandLine);
  return [annotate2(label, bold, labelColor), ...lines2.map((line) => annotate2(line, commandColor)), ""].join("\n");
};
var wrapCommand = (commandLine) => {
  const width = 88;
  const firstIndent = "  $ ";
  const continuationIndent = "    ";
  const args2 = commandLine.map(formatShellArg);
  const lines2 = [];
  let current = firstIndent;
  for (const arg of args2) {
    const separator = current === firstIndent || current === continuationIndent ? "" : " ";
    if (current.length + separator.length + arg.length > width && current !== firstIndent) {
      lines2.push(`${current} \\`);
      current = `${continuationIndent}${arg}`;
    } else {
      current += `${separator}${arg}`;
    }
  }
  if (current !== firstIndent) {
    lines2.push(current);
  }
  return lines2;
};
var formatShellArg = (arg) => /^[A-Za-z0-9_./:@%+=,-]+$/.test(arg) ? arg : `'${arg.replaceAll("'", `'"'"'`)}'`;

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/Command.js
var make27 = (name, config, handler) => {
  const parsedConfig = parseConfig(config ?? {});
  return makeCommand({
    name,
    config: parsedConfig,
    ...isNotUndefined(handler) ? {
      handle: handler
    } : {}
  });
};
var withDescription3 = /* @__PURE__ */ dual(2, (self, description) => makeCommand({
  ...toImpl(self),
  description
}));
var getOutOfScopeGlobalFlagErrors = (allFlags, activeFlags, flagMap, commandPath) => {
  const activeSet = new Set(activeFlags);
  const errors = [];
  const seen = /* @__PURE__ */ new Set();
  for (const flag of allFlags) {
    if (activeSet.has(flag)) {
      continue;
    }
    const singles = extractSingleParams(flag.flag);
    for (const single of singles) {
      const entries = flagMap[single.name];
      if (!entries || entries.length === 0) {
        continue;
      }
      const option2 = `--${single.name}`;
      if (seen.has(option2)) {
        continue;
      }
      seen.add(option2);
      errors.push(new UnrecognizedOption({
        option: option2,
        suggestions: [],
        command: commandPath
      }));
    }
  }
  return errors;
};
var showHelp = (command, error2, renderErrors) => gen2(function* () {
  const {
    builtIns
  } = yield* CliConfig;
  const formatter = yield* Formatter;
  const helpDoc = yield* getHelpForCommandPath(command, error2.commandPath, builtIns);
  yield* log(formatter.formatHelpDoc(helpDoc));
  if (renderErrors && error2.errors.length > 0) {
    yield* error(formatter.formatErrors(error2.errors));
  }
});
var showUserError = (error2) => gen2(function* () {
  const formatter = yield* Formatter;
  yield* error(formatter.formatError(error2));
  error2[errorReported] = false;
});
var run5 = /* @__PURE__ */ dual(2, (command, config) => Stdio.use(({
  args: args2
}) => flatMap4(args2, (args3) => runWith2(command, config)(args3))));
var runWith2 = (command, config) => {
  const commandImpl = toImpl(command);
  return fnUntraced2(function* (args2) {
    const {
      builtIns
    } = yield* CliConfig;
    const {
      tokens,
      trailingOperands
    } = lex(args2);
    const allFlags = getGlobalFlagsForCommandTree(command, builtIns);
    const allFlagParams = allFlags.flatMap((f) => extractSingleParams(f.flag));
    const globalRegistry = createFlagRegistry(allFlagParams.filter(isFlagParam));
    const {
      flagMap,
      remainder,
      errors: globalFlagErrors
    } = consumeGlobalFlags(tokens, command, globalRegistry);
    const emptyArgs = {
      flags: flagMap,
      arguments: []
    };
    const parsedArgs = yield* parseArgs({
      tokens: remainder,
      trailingOperands
    }, command);
    const commandPath = [command.name, ...getCommandPath(parsedArgs)];
    const handlerCtx = {
      builtIns,
      command,
      commandPath,
      version: config.version
    };
    const activeFlags = getGlobalFlagsForCommandPath(command, commandPath, builtIns);
    const outOfScopeErrors = getOutOfScopeGlobalFlagErrors(allFlags, activeFlags, flagMap, commandPath);
    if (outOfScopeErrors.length > 0 || globalFlagErrors.length > 0) {
      const parseErrors = parsedArgs.errors ?? [];
      return yield* new ShowHelp({
        commandPath,
        errors: [...globalFlagErrors, ...outOfScopeErrors, ...parseErrors]
      });
    }
    for (const flag of activeFlags) {
      if (flag._tag !== "Action") continue;
      const singles = extractSingleParams(flag.flag);
      const hasEntry = singles.some((s) => {
        const entries = flagMap[s.name];
        return entries !== void 0 && entries.length > 0;
      });
      if (!hasEntry) continue;
      const [, value3] = yield* flag.flag.parse(emptyArgs);
      if (flag === Wizard) {
        return yield* gen2(function* () {
          yield* log(renderIntroduction(command.name, config.version, command.description));
          const prefix = [command.name, ...args2.filter((arg) => arg !== "--wizard" && !arg.startsWith("--wizard="))];
          const wizardResult = yield* run4(command, {
            commandPath,
            prefix
          });
          yield* log(renderCompletion(wizardResult.displayArgs));
          const shouldRun = yield* run3(Toggle({
            message: "Run this command?",
            initial: true,
            active: "yes",
            inactive: "no"
          }));
          if (shouldRun) {
            yield* log();
            yield* runWith2(command, {
              ...config,
              renderErrors: false
            })(wizardResult.args.slice(1));
          }
        }).pipe(catchTag2("QuitError", () => log(renderQuit())));
      }
      yield* flag.run(value3, handlerCtx);
      return;
    }
    if (parsedArgs.errors && parsedArgs.errors.length > 0) {
      return yield* new ShowHelp({
        commandPath,
        errors: parsedArgs.errors
      });
    }
    const parseResult = yield* result2(commandImpl.parse(parsedArgs));
    if (parseResult._tag === "Failure") {
      return yield* new ShowHelp({
        commandPath,
        errors: [parseResult.failure]
      });
    }
    let program = commandImpl.handle(parseResult.success, [command.name]);
    const logLevel = activeFlags.includes(LogLevel) ? (yield* LogLevel.flag.parse(emptyArgs))[1] : none2();
    program = provideService2(program, LogLevel, logLevel);
    for (const flag of activeFlags) {
      if (flag._tag !== "Setting" || flag === LogLevel) continue;
      const [, value3] = yield* flag.flag.parse(emptyArgs);
      program = provideService2(program, flag, value3);
    }
    const services = match(logLevel, {
      onNone: () => empty(),
      onSome: (level) => make2(MinimumLogLevel2, level)
    });
    yield* provideContext2(program, services);
  }, catchFilter2((error2) => isCliError(error2) && error2._tag === "ShowHelp" ? succeed2(error2) : fail2(error2), (error2) => andThen2(showHelp(command, error2, config.renderErrors !== false), fail6(error2))), catchFilter2((error2) => config.renderErrors !== false && isCliError(error2) && error2._tag === "UserError" ? succeed2(error2) : fail2(error2), (error2) => andThen2(showUserError(error2), fail6(error2))), catchFilter2((e) => isQuitError(e) ? succeed2(e) : fail2(e), (_) => interrupt2));
};

// package.json
var package_default = {
  name: "create-effect-alchemy",
  version: "0.1.0",
  description: "Scaffold a full-stack Effect v4 + Alchemy v2 app on Cloudflare",
  keywords: [
    "alchemy",
    "cloudflare",
    "create",
    "effect",
    "template"
  ],
  license: "MIT",
  repository: {
    type: "git",
    url: "git+https://github.com/JustinRoderick/effect-alchemy-boilerplate.git"
  },
  bin: {
    "create-effect-alchemy": "./dist/bin.mjs"
  },
  files: [
    "dist",
    "docs",
    "template",
    "!template/.alchemy",
    "!template/.repos",
    "!template/**/*.tsbuildinfo",
    "!template/**/.env"
  ],
  type: "module",
  scripts: {
    prepublishOnly: "npm run bundle:check",
    bundle: "node scripts/bundle.ts",
    "bundle:check": "node scripts/bundle.ts --check",
    dev: "node src/bin.ts",
    typecheck: "effect-tsgo patch >/dev/null && tsc --noEmit",
    lint: "oxlint",
    fmt: "oxfmt",
    "fmt:check": "oxfmt --check",
    test: "vitest run",
    check: "pnpm fmt:check && pnpm lint && pnpm typecheck && pnpm test && pnpm bundle:check"
  },
  devDependencies: {
    "@effect/platform-node": "4.0.2",
    "@effect/tsgo": "0.51.1",
    "@effect/vitest": "4.0.2",
    "@types/node": "26.6.4",
    effect: "4.0.2",
    esbuild: "0.28.2",
    oxfmt: "0.72.0",
    oxlint: "1.87.0",
    typescript: "7.0.2",
    vitest: "5.0.3"
  },
  engines: {
    node: ">=24"
  }
};

// node_modules/.pnpm/effect@4.0.2/node_modules/effect/dist/cli/Argument.js
var String9 = (name) => String8(argumentKind, name);
var withDescription4 = /* @__PURE__ */ dual(2, (self, description) => withDescription(self, description));
var withFallbackPrompt2 = /* @__PURE__ */ dual(2, (self, prompt) => withFallbackPrompt(self, prompt));

// src/PackageManager.ts
var PackageManager = Literals(["bun", "pnpm", "npm"]);
var packageManagers = PackageManager.literals;
var isPackageManager = is2(PackageManager);
var fromUserAgent = (userAgent2) => {
  const [first] = userAgent2.trim().split(" ");
  const [name, version] = (first ?? "").split("/");
  return isPackageManager(name) && version ? some2({ name, version }) : none2();
};
var installCommand = (pm) => `${pm} install`;
var runCommand = (pm, script, args2 = "") => {
  const rest = args2.trim();
  switch (pm) {
    case "pnpm":
      return `pnpm ${pnpmBuiltins.has(script) ? "run " : ""}${script}${rest ? ` ${rest}` : ""}`;
    case "bun":
      return `bun run ${script}${rest ? ` ${rest}` : ""}`;
    case "npm":
      return `npm run ${script}${rest ? ` -- ${rest}` : ""}`;
  }
};
var execCommand = (pm, binary) => {
  switch (pm) {
    case "pnpm":
      return `pnpm exec ${binary}`;
    case "bun":
      return `bunx ${binary}`;
    case "npm":
      return `npx ${binary}`;
  }
};
var pnpmBuiltins = /* @__PURE__ */ new Set(["deploy", "publish", "pack", "link", "update", "outdated"]);

// src/Template.ts
var templateStackName = "EffectAlchemyApp";
var templatePackageName = "effect-alchemy-app";
var workspaceGlobs = ["apps/*", "packages/*"];
var trustedDependencies = ["esbuild", "workerd"];
var toPackageName = (directoryName) => {
  const name = directoryName.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^[._-]+|[-]+$/g, "");
  return name.length > 0 ? name : "effect-alchemy-app";
};
var toStackName = (packageName) => {
  const pascal = packageName.split(/[^a-zA-Z0-9]+/).filter((part) => part.length > 0).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  if (pascal.length === 0) return templateStackName;
  return /^[0-9]/.test(pascal) ? `App${pascal}` : pascal;
};
var parseCatalog = (workspaceYaml) => {
  const catalog = {};
  let inCatalog = false;
  for (const line of workspaceYaml.split("\n")) {
    if (/^\S/.test(line)) {
      inCatalog = line.trim() === "catalog:";
      continue;
    }
    if (!inCatalog) continue;
    const match7 = /^\s+("?)([^"\s:]+(?:\/[^"\s:]+)?)\1:\s*"?([^"\s#]+)"?/.exec(line);
    if (match7?.[2] && match7[3]) catalog[match7[2]] = match7[3];
  }
  return catalog;
};
var rootPackageJson = (pkg, settings) => {
  const { packageManager: pm, catalog } = settings;
  const scripts = mapValues(asStringRecord(pkg["scripts"]), (script) => rewriteScript(script, pm));
  const base = {
    ...pkg,
    name: settings.name,
    packageManager: `${pm}@${settings.packageManagerVersion}`,
    scripts
  };
  switch (pm) {
    case "pnpm":
      return base;
    case "bun":
      return {
        ...base,
        workspaces: { packages: workspaceGlobs, catalog },
        overrides: { effect: requireVersion(catalog, "effect") },
        trustedDependencies
      };
    case "npm":
      return {
        ...resolveDependencies(base, settings),
        workspaces: workspaceGlobs,
        overrides: { effect: requireVersion(catalog, "effect") }
      };
  }
};
var workspacePackageJson = (pkg, settings) => settings.packageManager === "npm" ? resolveDependencies(pkg, settings) : pkg;
var rewriteScript = (script, pm) => pm === "pnpm" ? script : script.replace(/\bpnpm ([a-z][\w:-]*)/g, (_, name) => runCommand(pm, name));
var rewriteCommands = (text, pm) => {
  if (pm === "pnpm") return text;
  return text.replace(
    /\bpnpm ([a-z][\w:-]*)((?: (?!#)[^\s`]+)*)/g,
    (_, command, rest) => {
      if (command === "install" || command === "i") return installCommand(pm) + rest;
      if (command === "exec") {
        const [binary = "", ...args2] = rest.trim().split(" ");
        return [execCommand(pm, binary), ...args2].join(" ");
      }
      if (command === "run") {
        const [script = "", ...args2] = rest.trim().split(" ");
        return runCommand(pm, script, args2.join(" "));
      }
      return runCommand(pm, command, rest);
    }
  );
};
var renameProject = (text, settings) => text.replaceAll(`"${templateStackName}"`, `"${settings.stackName}"`).replaceAll(`# ${templatePackageName}`, `# ${settings.name}`);
var dependencyFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
];
var resolveDependencies = (pkg, settings) => {
  const resolved = { ...pkg };
  for (const field of dependencyFields) {
    const deps = pkg[field];
    if (deps === void 0) continue;
    resolved[field] = mapValues(asStringRecord(deps), (range2, name) => {
      if (range2 === "catalog:") return requireVersion(settings.catalog, name);
      if (range2.startsWith("workspace:")) return "*";
      return range2;
    });
  }
  return resolved;
};
var requireVersion = (catalog, name) => {
  const version = catalog[name];
  if (version === void 0) {
    throw new Error(`"${name}" is used as "catalog:" but missing from the template catalog.`);
  }
  return version;
};
var asStringRecord = (value3) => {
  const record2 = {};
  if (typeof value3 === "object" && value3 !== null) {
    for (const [key, entry] of Object.entries(value3)) {
      if (typeof entry === "string") record2[key] = entry;
    }
  }
  return record2;
};
var mapValues = (record2, f) => Object.fromEntries(Object.entries(record2).map(([key, value3]) => [key, f(value3, key)]));

// src/Scaffold.ts
var TargetNotEmpty = class extends TaggedError3()("TargetNotEmpty", {
  path: String4
}) {
  get message() {
    return `${this.path} already exists and is not empty. Pick a new or empty directory.`;
  }
};
var TemplateUnreadable = class extends TaggedError3()(
  "TemplateUnreadable",
  { path: String4, cause: Defect() }
) {
  get message() {
    return `Couldn't read the template at ${this.path}.`;
  }
};
var ProjectWriteFailed = class extends TaggedError3()(
  "ProjectWriteFailed",
  { path: String4, cause: Defect() }
) {
  get message() {
    return `Couldn't write ${this.path}.`;
  }
};
var PackageManagerUnavailable = class extends TaggedError3()(
  "PackageManagerUnavailable",
  { packageManager: PackageManager, cause: Defect() }
) {
  get message() {
    return `${this.packageManager} isn't installed or isn't on PATH.`;
  }
};
var InstallFailed = class extends TaggedError3()("InstallFailed", {
  packageManager: PackageManager,
  exitCode: optional2(Int),
  cause: optional2(Defect())
}) {
  get message() {
    return `${this.packageManager} install failed${this.exitCode === void 0 ? "" : ` (exit code ${this.exitCode})`}.`;
  }
};
var Scaffold = class extends Service()("create-effect-alchemy/Scaffold") {
};
var ignoredEntries = /* @__PURE__ */ new Set(["node_modules", ".alchemy", ".repos", "dist", ".env", ".DS_Store"]);
var isIgnored = (entry) => ignoredEntries.has(entry) || entry.endsWith(".tsbuildinfo");
var pnpmOnlyFiles = /* @__PURE__ */ new Set(["pnpm-workspace.yaml", "pnpm-lock.yaml"]);
var workspacePackageJson2 = /^(apps|packages)\/[^/]+\/package\.json$/;
var PackageJsonFile = fromJsonString2(Record(String4, Unknown2), {
  space: 2
});
var decodePackageJson = decodeUnknownEffect2(PackageJsonFile);
var encodePackageJson = encodeEffect(PackageJsonFile);
var make28 = (source) => gen2(function* () {
  const fs = yield* FileSystem;
  const path = yield* Path;
  const spawner = yield* ChildProcessSpawner;
  const listFiles = (root) => {
    const visit = (relative) => gen2(function* () {
      const dir = path.join(root, relative);
      const entries = yield* fs.readDirectory(dir).pipe(mapError2((cause) => new TemplateUnreadable({ path: dir, cause })));
      const files = [];
      for (const entry of entries.toSorted()) {
        if (isIgnored(entry)) continue;
        const child = relative === "" ? entry : `${relative}/${entry}`;
        const info = yield* fs.stat(path.join(root, child)).pipe(mapError2((cause) => new TemplateUnreadable({ path: child, cause })));
        if (info.type === "Directory") files.push(...yield* visit(child));
        else if (info.type === "File") files.push(child);
      }
      return files;
    });
    return visit("");
  };
  const readTemplateFile = (file) => fs.readFileString(path.join(source.templateDir, file)).pipe(mapError2((cause) => new TemplateUnreadable({ path: file, cause })));
  const writeFile3 = fn2("Scaffold.writeFile")(
    function* (target, contents) {
      yield* fs.makeDirectory(path.dirname(target), { recursive: true });
      yield* fs.writeFileString(target, contents);
    },
    (effect2, target) => effect2.pipe(mapError2((cause) => new ProjectWriteFailed({ path: target, cause })))
  );
  const copyFile3 = fn2("Scaffold.copyFile")(
    function* (from, to) {
      yield* fs.makeDirectory(path.dirname(to), { recursive: true });
      yield* fs.copyFile(from, to);
    },
    (effect2, _from, to) => effect2.pipe(mapError2((cause) => new ProjectWriteFailed({ path: to, cause })))
  );
  const ensureEmpty = fn2("Scaffold.ensureEmpty")(function* (directory2) {
    const exists2 = yield* fs.exists(directory2).pipe(orElseSucceed2(() => false));
    if (!exists2) return;
    const entries = yield* fs.readDirectory(directory2).pipe(mapError2((cause) => new ProjectWriteFailed({ path: directory2, cause })));
    if (entries.some((entry) => entry !== ".git")) {
      return yield* new TargetNotEmpty({ path: directory2 });
    }
  });
  const packageManagerVersion = fn2("Scaffold.packageManagerVersion")(function* (options) {
    if (isSome2(options.packageManagerVersion)) return options.packageManagerVersion.value;
    const output = yield* spawner.string(make13(options.packageManager, ["--version"], { shell: isWindows })).pipe(
      mapError2(
        (cause) => new PackageManagerUnavailable({ packageManager: options.packageManager, cause })
      )
    );
    return output.trim();
  });
  const renderFile = fn2("Scaffold.renderFile")(function* (file, directory2, settings) {
    const from = path.join(source.templateDir, file);
    if (pnpmOnlyFiles.has(file) && settings.packageManager !== "pnpm") return;
    const to = path.join(directory2, file === "_gitignore" ? ".gitignore" : file);
    if (file === "package.json" || workspacePackageJson2.test(file)) {
      const pkg = yield* readTemplateFile(file).pipe(
        flatMap4(decodePackageJson),
        mapError2((cause) => new TemplateUnreadable({ path: file, cause }))
      );
      const rendered = file === "package.json" ? rootPackageJson(pkg, settings) : workspacePackageJson(pkg, settings);
      const json = yield* encodePackageJson(rendered).pipe(orDie2);
      return yield* writeFile3(to, `${json}
`);
    }
    if (file === "alchemy.run.ts" || file === "README.md" || file === "AGENTS.md") {
      const text = yield* readTemplateFile(file);
      const renamed = renameProject(text, settings);
      return yield* writeFile3(
        to,
        file === "alchemy.run.ts" ? renamed : rewriteCommands(renamed, settings.packageManager)
      );
    }
    yield* copyFile3(from, to);
  });
  const install2 = fn2("Scaffold.install")(function* (directory2, packageManager2) {
    yield* log(`
Installing dependencies with ${packageManager2}\u2026
`);
    const exitCode = yield* spawner.exitCode(
      make13(packageManager2, ["install"], {
        cwd: directory2,
        shell: isWindows,
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit"
      })
    ).pipe(mapError2((cause) => new InstallFailed({ packageManager: packageManager2, cause })));
    if (exitCode !== 0) return yield* new InstallFailed({ packageManager: packageManager2, exitCode });
  });
  const format4 = (directory2, packageManager2) => spawner.exitCode(
    make13(packageManager2, ["run", "fmt"], { cwd: directory2, shell: isWindows })
  ).pipe(asVoid2, ignore2);
  const initGit = fn2("Scaffold.initGit")(function* (directory2) {
    const git2 = (args2) => spawner.exitCode(make13("git", args2, { cwd: directory2 })).pipe(orElseSucceed2(() => -1));
    const insideRepo = yield* spawner.string(
      make13("git", ["rev-parse", "--is-inside-work-tree"], { cwd: directory2 })
    ).pipe(
      map5((output) => output.trim() === "true"),
      orElseSucceed2(() => false)
    );
    if (insideRepo) return "skipped";
    if ((yield* git2(["init", "-q"])) !== 0) return "unavailable";
    yield* git2(["add", "-A"]);
    yield* git2(["commit", "-q", "-m", "Initial commit from create-effect-alchemy"]);
    return "initialized";
  });
  const create = fn2("Scaffold.create")(function* (options) {
    const directory2 = path.resolve(options.directory);
    yield* ensureEmpty(directory2);
    const name = toPackageName(path.basename(directory2));
    const settings = {
      name,
      stackName: toStackName(name),
      packageManager: options.packageManager,
      packageManagerVersion: yield* packageManagerVersion(options),
      catalog: parseCatalog(yield* readTemplateFile("pnpm-workspace.yaml"))
    };
    for (const file of yield* listFiles(source.templateDir)) {
      yield* renderFile(file, directory2, settings);
    }
    for (const file of yield* listFiles(source.docsDir)) {
      yield* copyFile3(path.join(source.docsDir, file), path.join(directory2, "docs", file));
    }
    if (options.install) {
      yield* install2(directory2, options.packageManager);
      yield* format4(directory2, options.packageManager);
    }
    const git2 = options.git ? yield* initGit(directory2) : "skipped";
    return { directory: directory2, settings, installed: options.install, git: git2 };
  });
  return Scaffold.of({ create });
});
var isWindows = process.platform === "win32";
var layer13 = (source) => effect(Scaffold, make28(source));

// src/cli.ts
var directory = String9("directory").pipe(
  withDescription4("Where to create the project (must be new or empty)"),
  withFallbackPrompt2(String7({ message: "Project directory", default: "my-app" }))
);
var packageManager = Literals3("pm", packageManagers).pipe(
  withDescription2(
    "Package manager to set the project up for. Defaults to the one running this command (bunx, pnpm dlx, npx), else pnpm."
  ),
  optional4
);
var install = Boolean6("install").pipe(
  withDescription2("Install dependencies after scaffolding (--no-install to skip)"),
  withDefault5(true)
);
var git = Boolean6("git").pipe(
  withDescription2("Initialize a git repository with a first commit (--no-git to skip)"),
  withDefault5(true)
);
var userAgent = String5("npm_config_user_agent").pipe(withDefault3(""));
var cli = make27(
  "create-effect-alchemy",
  { directory, packageManager, install, git },
  fn2("cli")(function* (input) {
    const launchedBy = fromUserAgent(yield* userAgent);
    const chosen = getOrElse(
      input.packageManager,
      () => match(launchedBy, { onNone: () => "pnpm", onSome: (pm2) => pm2.name })
    );
    const scaffold = yield* Scaffold;
    const result3 = yield* scaffold.create({
      directory: input.directory,
      packageManager: chosen,
      packageManagerVersion: launchedBy.pipe(
        filter((pm2) => pm2.name === chosen),
        map((pm2) => pm2.version)
      ),
      install: input.install,
      git: input.git
    }).pipe(
      mapError2(
        (error2) => new UserError({ cause: error2, userMessage: error2.message })
      )
    );
    const pm = result3.settings.packageManager;
    const steps = [
      `cd ${input.directory}`,
      ...result3.installed ? [] : [installCommand(pm)],
      runCommand(pm, "dev")
    ];
    yield* log(
      [
        "",
        `Created ${result3.settings.name} in ${result3.directory}`,
        "",
        "Next steps:",
        ...steps.map((step) => `  ${step}`),
        "",
        `Deploy to Cloudflare with ${runCommand(pm, "deploy")} (log in first: ${execCommand(pm, "alchemy profile edit --add Cloudflare")}).`,
        "Conventions and architecture: docs/README.md",
        ""
      ].join("\n")
    );
  })
).pipe(withDescription3("Scaffold a full-stack Effect + Alchemy app on Cloudflare"));

// src/bin.ts
var layerScaffold = unwrap(
  gen2(function* () {
    const path = yield* Path;
    return layer13({
      templateDir: yield* path.fromFileUrl(new URL("../template", import.meta.url)),
      docsDir: yield* path.fromFileUrl(new URL("../docs", import.meta.url))
    });
  }).pipe(orDie2)
);
run5(cli, { version: package_default.version }).pipe(
  provide3(layerScaffold.pipe(provideMerge(layer12))),
  runMain2
);
