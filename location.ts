export type Location =
  | Coordinate
  | Range;

type Coordinate = {
  tag: "Coordinate";
  offset: number;
  line: number;
  column: number;
};

export function mkCoordinate(
  offset: number,
  line: number,
  column: number,
): Coordinate {
  return { tag: "Coordinate", offset, line, column };
}

type Range = {
  tag: "Range";
  start: Coordinate;
  end: Coordinate;
};

export function mkRange(c1: Coordinate, c2: Coordinate): Range {
  return {
    tag: "Range",
    start: minCoordinate(c1, c2),
    end: maxCoordinate(c1, c2),
  };
}

export function range(
  so: number,
  sl: number,
  sc: number,
  eo: number,
  el: number,
  ec: number,
): Location {
  return mkRange(mkCoordinate(so, sl, sc), mkCoordinate(eo, el, ec));
}

export function combine(l1: Location, l2: Location): Location {
  switch (l1.tag) {
    case "Coordinate":
      switch (l2.tag) {
        case "Coordinate":
          if (l1.offset == l2.offset) {
            return l1;
          } else {
            return mkRange(l1, l2);
          }
        case "Range":
          return mkRange(
            minCoordinate(l1, l2.start),
            maxCoordinate(l1, l2.end),
          );
      }
    case "Range":
      switch (l2.tag) {
        case "Coordinate":
          return mkRange(
            minCoordinate(l1.start, l2),
            maxCoordinate(l1.end, l2),
          );
        case "Range":
          return mkRange(
            minCoordinate(l1.start, l2.start),
            maxCoordinate(l1.end, l2.end),
          );
      }
  }
}

function minCoordinate(c1: Coordinate, c2: Coordinate): Coordinate {
  if (c1.offset < c2.offset) {
    return c1;
  } else {
    return c2;
  }
}

function maxCoordinate(c1: Coordinate, c2: Coordinate): Coordinate {
  if (c1.offset < c2.offset) {
    return c2;
  } else {
    return c1;
  }
}

export function toString(
  location: Location,
  fileName: string | undefined = undefined,
): string {
  const fileNamePrefix = (fileName == undefined) ? "" : `${fileName} `;

  if (location.tag == "Coordinate") {
    return `${fileNamePrefix}${location.line}:${location.column}`;
  } else if (location.start.line == location.end.line) {
    return `${fileNamePrefix}${location.start.line}:${location.start.column}-${location.end.column}`;
  } else {
    return `${fileNamePrefix}${location.start.line}:${location.start.column}-${location.end.line}:${location.end.column}`;
  }
}