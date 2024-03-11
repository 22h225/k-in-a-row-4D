import { DIRECTIONS } from "./directions";

export type Number4d = [number, number, number, number];
export type Result = {
  finished: boolean,
  winner: Player | undefined,
  stones: Stone[] | undefined,
}

export interface Config {
  kCount: number;
  boardShape: Number4d;
}

export class BoardRangeError extends Error { static { this.prototype.name = "BoardRangeError"; } }
export class PositionOverlapError extends Error { static { this.prototype.name = "PositionOverlapError"; } }

export class Player { constructor(public index: 0 | 1, public name: string) { } }
export class Stone { constructor(public player: Player, public position: Number4d) { } }
export class Cell { constructor(public stone?: Stone) { } }

export class Game {
  players: [Player, Player];
  currentPlayer: Player;
  board: Cell[][][][] = [];

  constructor(public config: Config) {
    this.players = [new Player(0, 'Bob'), new Player(1, 'David')];
    this.currentPlayer = this.players[0];

    for (let x = 0; x < this.config.boardShape[0]; x++) {
      this.board[x] = [];
      for (let y = 0; y < this.config.boardShape[1]; y++) {
        this.board[x][y] = [];
        for (let z = 0; z < this.config.boardShape[2]; z++) {
          this.board[x][y][z] = [];
          for (let w = 0; w < this.config.boardShape[3]; w++) {
            this.board[x][y][z][w] = new Cell();
          }
        }
      }
    }
  }

  playTurn(stonePosition: Number4d): Result {
    let stone = this.placeStone(this.currentPlayer, stonePosition);
    let result = this.judge(this.currentPlayer, stone);

    if (!result.finished) this.currentPlayer = this.players[1 - this.currentPlayer.index];
    return result;
  }

  isPositionEmpty(position: Number4d): boolean {
    let [x, y, z, w] = position;
    let cell = this.board?.[x]?.[y]?.[z]?.[w];

    if (!cell) throw new BoardRangeError();
    return !cell.stone;
  }

  placeStone(player: Player, position: Number4d): Stone {
    let [x, y, z, w] = position;
    let cell = this.board?.[x]?.[y]?.[z]?.[w];

    if (!cell) throw new BoardRangeError();
    else if (cell.stone) throw new PositionOverlapError();
    else {
      let stone = new Stone(player, position);
      this.board[x][y][z][w].stone = stone;
      return stone;
    }
  }

  judge(player: Player, stone: Stone): Result {
    let [x, y, z, w] = stone.position;
    let stones: Stone[] = [stone];

    for (let DIRECTION of DIRECTIONS) {
      let count = 1;
      for (let n = 1; n < this.config.kCount; n++) {
        let ni = x + n * DIRECTION[0];
        let nj = y + n * DIRECTION[1];
        let nl = z + n * DIRECTION[2];
        let nm = w + n * DIRECTION[3];
        if (this.board[ni]?.[nj]?.[nl]?.[nm]?.stone?.player !== stone.player)
          break;
        count++;
      }

      if (count === this.config.kCount) {
        for (let n = 1; n < this.config.kCount; n++) {
          let nx = x + n * DIRECTION[0];
          let ny = y + n * DIRECTION[1];
          let nz = z + n * DIRECTION[2];
          let nw = w + n * DIRECTION[3];
          let nstone = this.board[nx][ny][nz][nw]?.stone;
          if (nstone) stones.push(nstone);
        }
        break;
      }
    }

    let finished = stones.length === this.config.kCount;
    if (finished) return {
      finished: finished,
      winner: player,
      stones: stones
    };
    else return {
      finished: finished,
      winner: undefined,
      stones: undefined
    };
  }
}

// function fix<S, T>(f: (_: (_: S) => T) => (_: S) => T) {
//   type U = (_: U) => (_: S) => T;
//   return ((x) => x(x))((x: U) => f((y) => x(x)(y)));
// }

// let fact = fix<number, number>((f) => (n) => n === 0 ? 1 : n * f(n - 1));
// console.log(fact(5));
