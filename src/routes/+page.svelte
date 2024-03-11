<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import 'normalize.css';
	import './styles.scss';
	import { Game, type Config } from './game';
	import { x, y, z, w, result } from './store';

	let innerWidth: number, innerHeight: number;
	let config: Config = {
		kCount: 4,
		boardShape: [4, 4, 4, 4]
	};

	const game = new Game(config);

	function onKeydown(e: KeyboardEvent & { currentTarget: EventTarget & Window }) {
		if (!$result.finished) {
			if (e.key == 'Control') {
				let resultRaw = game.playTurn([$x, $y, $z, $w]);
				if (resultRaw.finished) result.set(resultRaw);

				game.currentPlayer = game.currentPlayer;
			}
		}
	}
</script>

<svelte:window on:keydown={onKeydown} bind:innerWidth bind:innerHeight />

<Canvas size={{ width: innerWidth, height: innerHeight }}>
	<Scene {game} />
</Canvas>

<div class="overlay control">
	<table>
		<tr><td>カメラを回転移動</td><td>左クリック＆ドラッグ</td></tr>
		<tr><td>カメラを平行移動</td><td>右クリック＆ドラッグ</td></tr>
		<tr><td>左</td><td>A</td></tr>
		<tr><td>右</td><td>D</td></tr>
		<tr><td>奥</td><td>W</td></tr>
		<tr><td>手前</td><td>S</td></tr>
		<tr><td>広く</td><td>E</td></tr>
		<tr><td>狭く</td><td>Q</td></tr>
		<tr><td>上</td><td>Space</td></tr>
		<tr><td>下</td><td>Shift</td></tr>
		<tr><td>石を置く</td><td>Control</td></tr>
	</table>
</div>

<div class="overlay status">
	<table>
		<tr><td>{game.players[0].name}</td><td>黒</td></tr>
		<tr><td>{game.players[1].name}</td><td>白</td></tr>
		<tr><td>現在のプレイヤー</td><td>{game.currentPlayer.name}</td></tr>
		<tr><td></td><td></td></tr>
	</table>
</div>

{#if $result.finished}
	<div class="overlay result"><p>{$result.winner?.name}の勝ち！</p></div>
{/if}

<style lang="scss">
	.overlay {
		pointer-events: none;
		z-index: 1;
	}

	.control,
	.status {
		position: absolute;
		top: 0;
		padding: 1rem;

		table tr td {
			padding: 0 0.5rem 0 0.5rem;
			text-align: center;
		}
	}

	.status {
		right: 0;
	}

	.result {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateY(-50%) translateX(-50%);
		-webkit-transform: translateY(-50%) translateX(-50%);
		width: 100%;
		height: 5em;
		background: rgba(255, 255, 0, 0.2);

		p {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateY(-50%) translateX(-50%);
			-webkit-transform: translateY(-50%) translateX(-50%);
			margin: 0;
			font-size: large;
			letter-spacing: 0.1em;
		}
	}
</style>
