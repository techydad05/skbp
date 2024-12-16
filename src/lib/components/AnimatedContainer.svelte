<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	export let title: string = '';
	let mounted = false;
	let titleChars: string[] = [];
	let charIndex = 0;
	let displayedTitle = '';
	let showContent = false;
	
	// Calculate progress as a percentage
	$: progress = titleChars.length ? charIndex / titleChars.length : 0;

	$: {
		titleChars = title.split('');
	}

	onMount(() => {
		mounted = true;
		animateTitle();
	});

	async function animateTitle() {
		charIndex = 0;
		displayedTitle = '';
		showContent = false;
		
		for (let char of titleChars) {
			displayedTitle += char;
			charIndex++;
			// Calculate progress and show content gradually
			if (charIndex / titleChars.length > 0.3) {
				showContent = true;
			}
			await new Promise(resolve => setTimeout(resolve, 50));
		}
	}
</script>

<div
	class="relative overflow-hidden"
	in:fade={{ duration: 300 }}
>
	<!-- Animated border effect -->
	<div
		class="absolute inset-0 animate-draw-border"
		style="background: linear-gradient(90deg, var(--color-primary-500), var(--color-secondary-500));"
	/>
	
	<div class="card variant-glass-surface p-4 sm:p-6 relative">
		<!-- Animated title -->
		<div class="mb-4 flex flex-wrap items-start justify-between gap-4">
			<h2 class="h2 text-xl sm:text-2xl">
				{#if mounted}
					<span class="inline-block">{displayedTitle}</span>
					{#if displayedTitle.length < title.length}
						<span class="animate-blink">|</span>
					{/if}
				{/if}
			</h2>
			<slot name="close-button" />
		</div>

		<!-- Content with synchronized animation -->
		{#if showContent}
			<div class="grid grid-cols-1 gap-8">
				<slot {progress} />
			</div>
		{/if}
	</div>
</div>

<style>
	.animate-draw-border {
		height: 2px;
		animation: drawBorder 1s ease-out forwards;
	}

	.animate-blink {
		animation: blink 0.7s infinite;
	}

	@keyframes drawBorder {
		0% {
			width: 0;
			height: 2px;
			opacity: 1;
		}
		25% {
			width: 100%;
			height: 2px;
			opacity: 1;
		}
		50% {
			width: 100%;
			height: 100%;
			opacity: 0.5;
		}
		100% {
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}

	@keyframes blink {
		0%, 100% { opacity: 0; }
		50% { opacity: 1; }
	}
</style>
