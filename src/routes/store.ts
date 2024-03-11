import { writable } from 'svelte/store';

export const x = writable(0);
export const y = writable(0);
export const z = writable(0);
export const w = writable(0);
export const DIMENSIONS = [x, y, z, w];
