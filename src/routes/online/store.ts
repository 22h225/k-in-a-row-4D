import { writable, type Writable } from 'svelte/store';
import { Player, Cell } from '$lib/game';
import type { Result, Config } from '$lib/game';

export const x = writable(0);
export const y = writable(0);
export const z = writable(0);
export const w = writable(0);

export const result: Writable<Result | undefined> = writable({
  finished: false,
  winner: undefined,
  stones: undefined,
});
export const config: Writable<Config | undefined> = writable();
export const players: Writable<[Player, Player] | undefined> = writable();
export const currentPlayer: Writable<Player | undefined> = writable();
export const board: Writable<Cell[][][][] | undefined> = writable();
