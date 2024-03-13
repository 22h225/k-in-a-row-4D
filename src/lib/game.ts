const VALUES = [0, 1, -1];
const DIRECTIONS = VALUES.map((dx) =>
	VALUES.map((dy) => VALUES.map((dz) => VALUES.map((dw) => [dx, dy, dz, dw])))
)
	.flat(3)
	.slice(1);

export type Number4d = [number, number, number, number];

export type Result = {
	finished: boolean;
	winner: Player | undefined;
	stones: Stone[] | undefined;
};

export interface Config {
	kCount: number;
	boardShape: Number4d;
}

export const configDefault: Config = {
	kCount: 4,
	boardShape: [4, 4, 4, 4]
};

export class BoardRangeError extends Error {
	static {
		this.prototype.name = 'BoardRangeError';
	}
}

export class PositionOverlapError extends Error {
	static {
		this.prototype.name = 'PositionOverlapError';
	}
}

export class FinishedGameError extends Error {
	static {
		this.prototype.name = 'FinishedGameError';
	}
}

export class Player {
	constructor(
		public index: 0 | 1,
		public name: string
	) {}
}

export class Stone {
	constructor(
		public player: Player,
		public position: Number4d
	) {}
}

export class Cell {
	constructor(public stone?: Stone) {}
}

export class Game {
	players: [Player, Player];
	currentPlayer: Player;
	board: Cell[][][][] = [];
	result: Result = {
		finished: false,
		winner: undefined,
		stones: undefined
	};

	constructor(public config = configDefault) {
		this.players = [new Player(0, 'Player 1'), new Player(1, 'Player 2')];
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

	placeStone(player: Player, position: Number4d): Stone {
		let [x, y, z, w] = position;
		let cell = this.board?.[x]?.[y]?.[z]?.[w];

		if (!cell) throw new BoardRangeError();
		else if (cell.stone) throw new PositionOverlapError();
		else if (this.result.finished) throw new FinishedGameError();
		else {
			let stone = new Stone(player, position);
			this.board[x][y][z][w].stone = stone;
			return stone;
		}
	}

	judge(player: Player, stone: Stone): Result {
		let [x, y, z, w] = stone.position;
		let stones: Stone[] = [stone];

		for (let direction of DIRECTIONS) {
			let count = 1;
			for (let m = 1; m < this.config.kCount; m++) {
				let mx = x + m * direction[0];
				let my = y + m * direction[1];
				let mz = z + m * direction[2];
				let mw = w + m * direction[3];
				if (this.board[mx]?.[my]?.[mz]?.[mw]?.stone?.player !== stone.player) break;
				count++;
			}

			if (count === this.config.kCount) {
				for (let n = 1; n < this.config.kCount; n++) {
					let nx = x + n * direction[0];
					let ny = y + n * direction[1];
					let nz = z + n * direction[2];
					let nw = w + n * direction[3];
					let nstone = this.board[nx][ny][nz][nw]?.stone;
					if (nstone) stones.push(nstone);
				}
				break;
			}
		}

		// Won
		if (stones.length === this.config.kCount) {
			this.result = {
				finished: true,
				winner: player,
				stones: stones
			};
			return this.result;
		}
		// Draw
		else if (this.board.flat(3).filter((cell) => !cell.stone).length == 0) {
			this.result = {
				finished: true,
				winner: undefined,
				stones: undefined
			};
			return this.result;
		}
		// Continue
		else return this.result;
	}
}

// function fix<S, T>(f: (_: (_: S) => T) => (_: S) => T) {
//   type U = (_: U) => (_: S) => T;
//   return ((x) => x(x))((x: U) => f((y) => x(x)(y)));
// }

// let fact = fix<number, number>((f) => (n) => n === 0 ? 1 : n * f(n - 1));
// console.log(fact(5));
