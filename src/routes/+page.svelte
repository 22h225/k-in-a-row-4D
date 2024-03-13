<script lang="ts">
	import "./styles.scss"
	import { io } from 'socket.io-client';
	const socket = io();

	socket.emit('getRooms');

	let rooms: string[] = [];
	socket.on('getRooms', (arg: string[]) => {
		rooms = arg;
	});

	let value: string = '';
</script>

<main>
	<header>
		<h1>４次元４目並べ</h1>
	</header>

	<div class="button-container">
		<div>
			<h2>Offline</h2>
			<a href="/offline">
				<button type="button">Play Offline</button>
			</a>
		</div>
		<div class="online">
			<h2>Online</h2>
			<input bind:value type="text" name="room" id="room" autocomplete="off" />
			<a href="/online?room={value}">
				<button type="button">Play Online</button>
			</a>
			<table>
				{#each rooms as room}
					<tr>
						<td>{room}</td>
						<td><a href="/online?room={room}">join</a></td>
					</tr>
				{/each}
				<tr></tr>
			</table>
		</div>
	</div>
</main>

<style lang="scss">
	main {
		text-align: center;
	}

	.button-container {
		display: flex;
		justify-content: space-around;

		& > div {
			width: 50%;

			& > a {
				display: block;
				margin: 1rem;
			}
		}
	}

	.online {
		text-align: center;

		table {
			width: 100%;
			padding: 2rem;

			td {
				width: 80%;
			}
		}
	}
</style>
