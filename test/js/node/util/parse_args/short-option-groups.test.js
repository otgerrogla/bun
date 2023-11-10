import { test, expect } from "bun:test";
import { parseArgs } from "node:util";

test("when pass zero-config group of booleans then parsed as booleans", () => {
  const args = ["-rf", "p"];
  const options = {};
  const expected = { values: { __proto__: null, r: true, f: true }, positionals: ["p"] };

  const result = parseArgs({ strict: false, args, options });

  expect(result).toEqual(expected);
});

test("when pass full-config group of booleans then parsed as booleans", () => {
  const args = ["-rf", "p"];
  const options = { r: { type: "boolean" }, f: { type: "boolean" } };
  const expected = { values: { __proto__: null, r: true, f: true }, positionals: ["p"] };

  const result = parseArgs({ allowPositionals: true, args, options });

  expect(result).toEqual(expected);
});

test("when pass group with string option on end then parsed as booleans and string option", () => {
  const args = ["-rf", "p"];
  const options = { r: { type: "boolean" }, f: { type: "string" } };
  const expected = { values: { __proto__: null, r: true, f: "p" }, positionals: [] };

  const result = parseArgs({ args, options });

  expect(result).toEqual(expected);
});

test("when pass group with string option in middle and strict:false then parsed as booleans and string option with trailing value", () => {
  const args = ["-afb", "p"];
  const options = { f: { type: "string" } };
  const expected = { values: { __proto__: null, a: true, f: "b" }, positionals: ["p"] };

  const result = parseArgs({ args, options, strict: false });

  expect(result).toEqual(expected);
});
