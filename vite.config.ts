import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { Server, type ServerOptions } from 'socket.io';
import type { ViteDevServer } from 'vite';
import { Game, type Number4d } from './src/lib/game';

const socketio = {
	name: 'socket.io server',
	configureServer(server: ViteDevServer) {
		const io = new Server(server.httpServer as Partial<ServerOptions> | undefined);

		const rooms: { [id: string]: Game } = {};
		const roomSuffix = 'room';

		io.on('connection', (socket) => {
			socket.on('getRooms', () => {
				socket.join('getRooms');
				socket.emit('getRooms', Object.keys(rooms));
			});

			socket.on('init', (roomId: string) => {
				socket.join(roomSuffix + roomId);

				if (!Object.keys(rooms).includes(roomId)) rooms[roomId] = new Game();
				let game = rooms[roomId];

				io.to('getRooms').emit('getRooms', Object.keys(rooms));
				io.to(roomSuffix + roomId).emit(
					'init',
					game.config,
					game.players,
					game.currentPlayer,
					game.board
				);
			});

			socket.on('playTurn', (roomId: string, stonePosition: Number4d) => {
				try {
					let game = rooms[roomId];
					let result = game.playTurn(stonePosition);

					io.to(roomSuffix + roomId).emit('playTurn', game.currentPlayer, game.board, result);
				} catch (e) {
					socket.emit('error', e);
				}
			});
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), socketio],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
