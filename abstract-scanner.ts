import * as Location from "./location.ts";

export type Token<T> = [T, Location.Location, string];

export abstract class Scanner<T> {
  private input: string;
  private inputLength = 0;

  private offset = -1;
  private line = 1;
  private column = 0;
  protected nextCh: number = -1;

  private startOffset = 0;
  private startLine = 0;
  private startColumn = 0;

  protected currentToken: Token<T>;

  private backtrack: {
    token: T;
    offset: number;
    line: number;
    column: number;
    nextCh: number;
  } | undefined = undefined;

  constructor(input: string, errorToken: T) {
    this.input = input;
    this.inputLength = input.length;

    this.nextCh = (this.inputLength == 0) ? -1 : input.charCodeAt(0);

    this.currentToken = [errorToken, Location.mkCoordinate(0, 0, 0), ""];

    this.next();
  }

  abstract next(): void;

  current(): Token<T> {
    return this.currentToken;
  }

  protected markAndNextChar(): void {
    this.nextChar();
    this.markStart();
  }

  private markStart(): void {
    this.startOffset = this.offset;
    this.startLine = this.line;
    this.startColumn = this.column;
  }

  protected markBacktrackPoint(ttoken: T): void {
    this.backtrack = {
      token: ttoken,
      offset: this.offset,
      line: this.line,
      column: this.column,
      nextCh: this.nextCh,
    };
  }

  protected attemptBacktrackOtherwise(ttoken: T): void {
    if (this.backtrack == undefined) {
      this.setToken(ttoken);
    } else {
      this.offset = this.backtrack.offset;
      this.line = this.backtrack.line;
      this.column = this.backtrack.column;
      this.nextCh = this.backtrack.nextCh;

      this.setToken(this.backtrack.token);
    }
  }

  protected setToken(ttoken: T, lexeme?: string): void {
    this.backtrack = undefined;
    const loc = (this.startOffset == this.offset)
      ? Location.mkCoordinate(
        this.startOffset,
        this.startLine,
        this.startColumn,
      )
      : Location.mkRange(
        Location.mkCoordinate(
          this.startOffset,
          this.startLine,
          this.startColumn,
        ),
        Location.mkCoordinate(this.offset, this.line, this.column),
      );

    this.currentToken = [
      ttoken,
      loc,
      lexeme == undefined ? this.sliceLexeme() : lexeme,
    ];
  }

  private sliceLexeme(): string {
    return this.input.slice(this.startOffset, this.offset + 1);
  }

  protected nextChar(): void {
    this.offset += 1;

    if (this.nextCh == 10) {
      this.column = 0;
      this.line += 1;
    } else {
      this.column += 1;
    }

    const nextOffset = this.offset + 1;
    this.nextCh = (nextOffset < this.inputLength)
      ? this.input.charCodeAt(nextOffset)
      : -1;
  }
}
