import { DIRECTIONS } from "./directions";

export type Number4d = [number, number, number, number];

export interface Config {
  kCount: number;
  boardShape: Number4d;
}

export class BoardRangeError extends Error {
  static {
    this.prototype.name = "BoardRangeError";
  }
}

export class PositionOverlapError extends Error {
  static {
    this.prototype.name = "PositionOverlapError";
  }
}

class Player {
  constructor(public index: 0 | 1) {}
}

class Stone {
  constructor(public player: Player, public position: Number4d) {}
}

class Cell {
  constructor(public stone?: Stone) {}
}

export class Game {
  board: Cell[][][][] = [];
  players: [Player, Player];
  currentPlayer: Player;

  constructor(public config: Config) {
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

    this.players = [new Player(0), new Player(1)];
    this.currentPlayer = this.players[0];
  }

  playTurn(stonePosition: Number4d): [true, Player, Stone[]] | [false] {
    let stone: Stone;
    try {
      stone = this.placeStone(this.currentPlayer, stonePosition);
    } catch (e) {
      throw e;
    }

    let [judgement, player, stones] = this.judge(this.currentPlayer, stone);
    if (judgement && player && stones) return [judgement, player, stones];
    else this.currentPlayer = this.players[1 - this.currentPlayer.index];
    return [false];
  }

  isPositionEmpty(position: Number4d): boolean {
    let [x, y, z, w] = position;
    let cell = this.board?.[x]?.[y]?.[z]?.[w];
    if (!cell) throw new BoardRangeError();
    return !cell.stone
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

  judge(player: Player, stone: Stone): [false] | [true, Player, Stone[]] {
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

    let judgement = stones.length === this.config.kCount;
    if (judgement) return [judgement, player, stones];
    else return [judgement];
  }
}

// function fix<S, T>(f: (_: (_: S) => T) => (_: S) => T) {
//   type U = (_: U) => (_: S) => T;
//   return ((x) => x(x))((x: U) => f((y) => x(x)(y)));
// }

// let fact = fix<number, number>((f) => (n) => n === 0 ? 1 : n * f(n - 1));
// console.log(fact(5));
