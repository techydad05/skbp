<script>
	export let progress = 0;
	export let thickness = 16; // Controls the width of rainbow lines

	// Define softer colors for the rainbow
	const rainbowColors = [
		'hsl(0, 70%, 80%)', // Soft red
		'hsl(30, 70%, 80%)', // Soft orange
		'hsl(60, 70%, 80%)', // Soft yellow
		'hsl(120, 70%, 80%)', // Soft green
		'hsl(180, 70%, 80%)', // Soft cyan
		'hsl(240, 70%, 80%)', // Soft blue
		'hsl(270, 70%, 80%)' // Soft violet
	];

	// Define radius values for each concentric circle
	const baseRadius = 180;
</script>

<div class="rainbow-container relative h-[200px] w-full overflow-hidden">
	<svg width="100%" height="400" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
		{#each rainbowColors as color, i}
			{@const radius = baseRadius - i * thickness}
			<!-- Reduce radius incrementally, ensure no gaps between strokes -->
			<circle
				cx="200"
				cy="200"
				r={radius}
				fill="none"
				stroke={color}
				stroke-width={thickness}
				class="rainbow-circle"
				style="stroke-dasharray: {2 * Math.PI * radius}; stroke-dashoffset: {(1 - progress / 100) *
					Math.PI *
					radius};"
			/>
		{/each}
	</svg>
</div>

<style>
	.rainbow-container {
		overflow: hidden; /* Cut off the circles to create an arch effect */
	}

	.rainbow-circle {
		transition: stroke-dashoffset 0.5s ease;
		filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.2));
	}
</style>
