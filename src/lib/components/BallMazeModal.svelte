<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import BallMaze from './BallMaze.svelte';
	let modalStore = getModalStore();
	let gameTime = 0;
</script>

<div class="card p-2 sm:p-4 w-full max-w-[95vw] sm:max-w-3xl mx-auto">
	<button class="close-btn" on:click={() => modalStore.close()}>×</button>
	<div class="timer text-center mb-2">Time: {gameTime.toFixed(1)}s</div>
	<div class="maze-wrapper">
		<BallMaze gameTime={gameTime} />
	</div>
</div>

<style>
	.card {
		animation: fadeIn 0.3s ease-out;
		position: relative;
		z-index: 1;
	}

	@media (max-width: 640px) {
		.card {
			max-width: 100vw !important;
			width: 100vw !important;
			height: 100vh !important;
			margin: 0 !important;
			padding: 0 !important;
			border-radius: 0 !important;
		}

		.maze-wrapper {
			height: 100vh !important;
		}
	}

	.close-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 2.5rem;
		height: 2.5rem;
		background: rgba(0, 0, 0, 0.3);
		border: none;
		border-radius: 50%;
		color: white;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 20;
		backdrop-filter: blur(4px);
		transition: background 0.2s;
	}

	.close-btn:hover {
		background: rgba(0, 0, 0, 0.5);
	}

	.maze-wrapper {
		aspect-ratio: 3/2;
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.timer {
		font-size: 1.2rem;
		font-weight: bold;
		color: var(--color-primary-500);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (max-width: 640px) {
		.maze-wrapper {
			aspect-ratio: 4/3;
		}
	}

	:global(.confetti) {
		position: fixed !important;
		z-index: 1000 !important;
	}
</style>
