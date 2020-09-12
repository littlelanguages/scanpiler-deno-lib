import {
  assertEquals,
} from "https://deno.land/std@0.68.0/testing/asserts.ts";

import {
  combine,
  mkCoordinate,
  mkRange,
  range,
  toString,
} from "./location.ts";

let P1 = mkCoordinate(0, 1, 2);
let P2 = mkCoordinate(3, 4, 5);
let P3 = mkCoordinate(6, 7, 8);
let P4 = mkCoordinate(9, 10, 10);

Deno.test("location - combining two ordered locations", () => {
  assertEquals(combine(P1, P2), mkRange(P1, P2));
});

Deno.test("location - combining two locations in reverse", () => {
  assertEquals(combine(P2, P1), mkRange(P1, P2));
});

Deno.test("location - combining two ordered ranges", () => {
  assertEquals(combine(combine(P1, P2), combine(P3, P4)), mkRange(P1, P4));
});

Deno.test("location - combining two ranges in reverse", () => {
  assertEquals(combine(combine(P3, P4), combine(P1, P2)), mkRange(P1, P4));
});

Deno.test("location - toString", () => {
  assertEquals(toString(P1), "1:2");
  assertEquals(toString(P1, "file.txt"), "file.txt 1:2");

  assertEquals(toString(range(1, 1, 2, 4, 1, 5)), "1:2-5");
  assertEquals(toString(range(1, 1, 2, 4, 1, 5), "file.txt"), "file.txt 1:2-5");

  assertEquals(toString(range(1, 2, 3, 4, 5, 6)), "2:3-5:6");
  assertEquals(
    toString(range(1, 2, 3, 4, 5, 6), "file.txt"),
    "file.txt 2:3-5:6",
  );
});
