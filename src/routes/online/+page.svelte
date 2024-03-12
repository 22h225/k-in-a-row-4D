<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import back_arrow_icon from '$lib/images/back-arrow-icon.svg';
	import { x, y, z, w, result, config, players, currentPlayer, board } from './store';
	import { io } from 'socket.io-client';
	import { page } from '$app/stores';

	let innerWidth: number, innerHeight: number;

	const socket = io();
	const room = $page.url.searchParams.get('room')
	socket.emit('init', room);

	socket.on(
		'init',
		(
			configRaw: typeof $config,
			playersRaw: typeof $players,
			currentPlayerRaw: typeof $currentPlayer,
			boardRaw: typeof $board
		) => {
			$config = configRaw;
			$players = playersRaw;
			$currentPlayer = currentPlayerRaw;
			$board = boardRaw;
		}
	);

	socket.on(
		'playTurn',
		(
			currentPlayerRaw: typeof $currentPlayer,
			boardRaw: typeof $board,
			resultRaw: typeof $result
		) => {
			$currentPlayer = currentPlayerRaw;
			$board = boardRaw;
			if (resultRaw?.finished) $result = resultRaw;
		}
	);

	function onKeydown(e: KeyboardEvent & { currentTarget: EventTarget & Window }) {
		if (!$result?.finished && e.key == 'Control') {
			socket.emit('playTurn', room, [$x, $y, $z, $w]);
		}
	}
</script>

<svelte:window on:keydown={onKeydown} bind:innerWidth bind:innerHeight />

<Canvas size={{ width: innerWidth, height: innerHeight }}>
	{#if $board}<Scene />{/if}
</Canvas>

<div class="overlay back">
	<a href="/">
		<img src={back_arrow_icon} alt="back arrow icon" />
	</a>
</div>

<div class="overlay status">
	<table>
		<tr><td>{$players?.[0].name}</td><td>黒</td></tr>
		<tr><td>{$players?.[1].name}</td><td>白</td></tr>
		<tr><td>現在のプレイヤー</td><td>{$currentPlayer?.name}</td></tr>
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
		<tr><td>カメラを平行移動</td><td>右クリック＆ドラッグ</td></tr>
	</table>
</div>

{#if $result?.finished}
	<div class="overlay result"><p>{$result.winner?.name}の勝ち！</p></div>
{/if}

<style lang="scss">
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
