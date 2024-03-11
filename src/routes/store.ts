import { writable, type Writable } from 'svelte/store';
import type { Result } from './main';

export const x = writable(0);
export const y = writable(0);
export const z = writable(0);
export const w = writable(0);

export const result: Writable<Result> = writable({
  finished: false,
  winner: undefined,
  stones: undefined,
});
