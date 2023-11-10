import { test, expect } from "bun:test";
import { parseArgs } from "node:util";

// These tests are not synced upstream with node, in case of possible side-effects.
// See index.js for tests shared with upstream.

function setObjectPrototype(prop, value) {
  const oldDescriptor = Object.getOwnPropertyDescriptor(Object.prototype, prop);
  Object.prototype[prop] = value;
  return oldDescriptor;
}

function restoreObjectPrototype(prop, oldDescriptor) {
  if (oldDescriptor == null) {
    delete Object.prototype[prop];
  } else {
    Object.defineProperty(Object.prototype, prop, oldDescriptor);
  }
}

test("should not allow __proto__ key to be set on object", () => {
  const args = ["--__proto__=hello"];
  const expected = { values: { __proto__: null }, positionals: [] };

  const result = parseArgs({ strict: false, args });

  expect(result).toEqual(expected);
});

test("when prototype has multiple then ignored", () => {
  const args = ["--foo", "1", "--foo", "2"];
  const options = { foo: { type: "string" } };
  const expectedResult = { values: { __proto__: null, foo: "2" }, positionals: [] };

  const holdDescriptor = setObjectPrototype("multiple", true);
  const result = parseArgs({ args, options });
  restoreObjectPrototype("multiple", holdDescriptor);
  expect(result).toEqual(expectedResult);
});

test("when prototype has type then ignored", () => {
  const args = ["--foo", "1"];
  const options = { foo: {} };

  const holdDescriptor = setObjectPrototype("type", "string");
  expect(() => {
    parseArgs({ args, options });
  }).toThrow();
  restoreObjectPrototype("type", holdDescriptor);
});

test("when prototype has short then ignored", () => {
  const args = ["-f", "1"];
  const options = { foo: { type: "string" } };

  const holdDescriptor = setObjectPrototype("short", "f");
  expect(() => {
    parseArgs({ args, options });
  }).toThrow();
  restoreObjectPrototype("short", holdDescriptor);
});

test("when prototype has strict then ignored", () => {
  const args = ["-f"];

  const holdDescriptor = setObjectPrototype("strict", false);
  expect(() => {
    parseArgs({ args });
  }).toThrow();
  restoreObjectPrototype("strict", holdDescriptor);
});

test("when prototype has args then ignored", () => {
  const holdDescriptor = setObjectPrototype("args", ["--foo"]);
  const result = parseArgs({ strict: false });
  restoreObjectPrototype("args", holdDescriptor);
  expect(result.values.foo).toBeUndefined();
});
