<script lang="ts">
	import 'normalize.css';
	import { Canvas } from '@threlte/core';
	import { Environment } from '@threlte/extras';
	import { Game } from '$lib/game';
	import { ENVIRONMENT_HDR } from '$lib/client_constants';
	import back_arrow_icon from '$lib/images/back-arrow-icon.svg';
	import { x, y, z, w, result } from './store';
	import Scene from './Scene.svelte';

	$x = 0;
	$y = 0;
	$z = 0;
	$w = 0;
	$result = {
		finished: false,
		winner: undefined,
		stones: undefined
	};

	let innerWidth: number, innerHeight: number;

	const game = new Game();

	function onKeydown(e: KeyboardEvent & { currentTarget: EventTarget & Window }) {
		if (!$result.finished && e.key == 'Control') {
			let resultRaw = game.playTurn([$x, $y, $z, $w]);
			if (resultRaw.finished) result.set(resultRaw);

			game.currentPlayer = game.currentPlayer;
			game.board = game.board;
		}
	}
</script>

<svelte:window on:keydown={onKeydown} bind:innerWidth bind:innerHeight />

<Canvas size={{ width: innerWidth, height: innerHeight }}>
	<Environment files={ENVIRONMENT_HDR} isBackground={true} format="hdr" />
	<Scene {game}></Scene>
</Canvas>

<div class="overlay back">
	<a href="/">
		<img src={back_arrow_icon} alt="back arrow icon" />
	</a>
</div>

<div class="overlay status">
	<table>
		<tr><td>{game.players[0].name}</td><td>黒</td></tr>
		<tr><td>{game.players[1].name}</td><td>白</td></tr>
		<tr><td>現在のプレイヤー</td><td>{game.currentPlayer.name}</td></tr>
		<tr><td></td><td></td></tr>
	</table>
</div>

<div class="overlay control">
	<table>
		<tr><td>左</td><td>A</td></tr>
		<tr><td>右</td><td>D</td></tr>
		<tr><td>奥</td><td>W</td></tr>
		<tr><td>手前</td><td>S</td></tr>
		<tr><td>広く</td><td>E</td></tr>
		<tr><td>狭く</td><td>Q</td></tr>
		<tr><td>上</td><td>Space</td></tr>
		<tr><td>下</td><td>Shift</td></tr>
		<tr><td>石を置く</td><td>Control</td></tr>
		<tr><td>カメラを回転移動</td><td>左クリック＆ドラッグ</td></tr>
	</table>
</div>

{#if $result?.finished}
	{#if $result.winner}
		<div class="overlay result"><p>{$result.winner.name}の勝ち！</p></div>
	{:else}
		<div class="overlay result"><p>引き分け！</p></div>
	{/if}
{/if}

<style lang="scss">
	:root {
		color: white;
	}

	.overlay {
		pointer-events: none;
		z-index: 1;
	}

	.back,
	.status,
	.control {
		position: absolute;
		padding: 1rem;

		table tr td {
			padding: 0 0.5rem 0 0.5rem;
			text-align: center;
		}
	}

	.back {
		top: 0;

		a {
			pointer-events: all;
		}
	}

	.control {
		bottom: 0;
		right: 0;
	}

	.status {
		top: 0;
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
		background: rgba(255, 255, 0, 0.4);

		p {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateY(-50%) translateX(-50%);
			-webkit-transform: translateY(-50%) translateX(-50%);
			margin: 0;
			font-size: large;
			font-weight: bold;
			letter-spacing: 0.1em;
		}
	}
</style>
