<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
</script>

<div class="card p-3 shadow-xl w-48">
	<header class="text-lg font-bold text-center mb-2">🎉 Choose! 🎉</header>
	<div class="flex justify-center gap-4">
		<button class="btn btn-sm variant-filled-success" on:click={() => popup.close(true)}>
			<span class="text-xl">✓</span>
		</button>
		<button class="btn btn-sm variant-filled-error" on:click={() => popup.close(false)}>
			<span class="text-xl">✗</span>
		</button>
	</div>
</div>

<style>
	.card {
		animation: popIn 0.2s ease-out;
	}

	@keyframes popIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
