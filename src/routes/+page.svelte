<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		AppBar,
		Avatar,
		ListBox,
		ListBoxItem,
		TabGroup,
		Tab,
		ProgressBar as SkProgressBar,
		Accordion,
		AccordionItem,
		RangeSlider,
		RadioGroup,
		RadioItem,
		ProgressRadial
	} from '@skeletonlabs/skeleton';
	import {
		Palette,
		Sun,
		Moon,
		Github,
		Code,
		Package,
		BookOpen,
		Heart,
		Zap,
		Box,
		Puzzle,
		CheckCircle2,
		Circle,
		Trash2,
		Plus,
		ArrowRight
	} from 'lucide-svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { todos, techDetails, type TechDetail, currentTheme } from '$lib/stores/appStore';
	import { slide, fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Rainbow from '$lib/components/Rainbow.svelte';
	import AnimatedContainer from '$lib/components/AnimatedContainer.svelte';
	import BallMaze from '$lib/components/BallMaze.svelte';

	let newTodo = '';
	let selectedTech: TechDetail | null = null;
	let showTechDetails = false;
	let progressValue = 50; 
	let isVertical = false; 
	let selectedValue = '1';
	let animationKey = 0; // Add counter for forcing animation replay

	// Calculate gradient opacity based on slider
	$: gradientOpacity = 0.15 + (progressValue / 400);
	
	// Construct gradient string based on direction
	$: backgroundGradient = `linear-gradient(${isVertical ? '180deg' : '90deg'}, 
		rgb(var(--color-primary-500) / ${gradientOpacity}) 0%, 
		rgb(var(--color-secondary-500) / ${gradientOpacity}) 50%, 
		rgb(var(--color-tertiary-500) / ${gradientOpacity}) 100%)`;

	$: waveAmplitude = 25; 

	// Set default selected tech
	onMount(() => {
		techDetails.subscribe((details) => {
			selectedTech = details['SvelteKit'];
			showTechDetails = true;
			animationKey++; // Increment key to force animation replay
		})();
	});

	function handleTechClick(tech: string) {
		techDetails.subscribe((details) => {
			selectedTech = details[tech];
			showTechDetails = true;
			animationKey++; // Increment key to force animation replay
		})();
	}

	function addTodo() {
		if (newTodo.trim()) {
			todos.add(newTodo.trim());
			newTodo = '';
		}
	}
</script>

<div class="flex flex-col">
	<!-- Gradient Background -->
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<div
		class="fixed inset-0 -z-10 transition-all duration-500"
		style:background={backgroundGradient}
	/>

	<!-- Main Content -->
	<main class="flex-1 space-y-8 py-4">
		<!-- Hero Section -->
		<div class="card variant-glass-surface my-8 space-y-6 p-4 sm:my-12 sm:space-y-8 sm:p-8 text-center">
			<div class="flex flex-wrap justify-center gap-4">
				<div class="badge variant-filled-primary">v1.0.0</div>
				<div class="badge variant-filled-secondary">Theme: {$currentTheme}</div>
			</div>
			<h1 class="h1 font-bold tracking-tight text-2xl sm:text-4xl">Modern Web Development Stack</h1>
			<p class="mx-auto max-w-[65ch] text-lg sm:text-2xl">
				A powerful combination of SvelteKit, Skeleton UI, and modern web technologies for building
				beautiful, responsive applications.
			</p>
			<div class="flex flex-wrap justify-center gap-4">
				<button class="btn variant-filled-primary">Get Started</button>
				<a href="https://github.com" target="_blank" class="btn variant-soft-surface">
					<Github class="mr-2 h-4 w-4" />
					GitHub
				</a>
			</div>
		</div>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
			{#each Object.entries($techDetails) as [tech, detail]}
				<button
					class="card variant-glass hover:variant-soft-primary cursor-pointer space-y-4 p-4 sm:p-6 text-center transition-all duration-200"
					on:click={() => handleTechClick(tech)}
				>
					<div class="flex justify-center">
						<svelte:component
							this={tech === 'SvelteKit'
								? Zap
								: tech === 'Skeleton'
									? Box
									: tech === 'TypeScript'
										? Code
										: Package}
							class="h-8 w-8 sm:h-12 sm:w-12"
						/>
					</div>
					<h3 class="h3 text-lg sm:text-xl">{tech}</h3>
					<p class="text-sm sm:text-base">{detail.description}</p>
				</button>
			{/each}
		</div>

		<!-- Tech Details Section -->
		{#if showTechDetails && selectedTech}
			{#key animationKey}
				<AnimatedContainer title={selectedTech.title} let:progress>
					<button slot="close-button" class="btn variant-soft" on:click={() => (showTechDetails = false)}>Close</button>
					
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div class="space-y-4">
							{#if progress > 0.2}
								<h3 class="h3 text-xl sm:text-2xl" in:fly={{ y: 10, duration: 200 }}>Key Features</h3>
							{/if}
							<ul class="list">
								{#each selectedTech.features as feature, i}
									{#if progress > 0.3 + (i * 0.1)}
										<li 
											class="flex items-center gap-2 text-sm sm:text-base" 
											in:fly={{ y: 10, duration: 200 }}
										>
											<ArrowRight class="h-4 w-4 flex-shrink-0" />
											<span>{feature}</span>
										</li>
									{/if}
								{/each}
							</ul>
						</div>

						<div class="space-y-4">
							{#if progress > 0.6}
								<h3 class="h3 text-xl sm:text-2xl" in:fly={{ y: 10, duration: 200 }}>Code Example</h3>
								<div class="relative">
									<!-- Animated border container -->
									<!-- svelte-ignore element_invalid_self_closing_tag -->
									<div 
										class="absolute inset-0 rounded-container-token"
										style:background="linear-gradient(90deg, var(--color-primary-500), var(--color-secondary-500))"
										style:clip-path={`polygon(
											0 0,
											${Math.min(100, ((progress - 0.6) * 500))}% 0,
											${Math.min(100, ((progress - 0.7) * 500))}% 100%,
											0 100%,
											0 ${Math.min(100, ((progress - 0.8) * 500))}%
										)`}
									/>
									<!-- Border mask -->
									<!-- svelte-ignore element_invalid_self_closing_tag -->
									<div 
										class="absolute inset-[2px] rounded-container-token bg-surface-100-800-token"
									/>
									<!-- Code content -->
									{#if progress > 0.9}
										<pre
											class="code rounded-container-token bg-surface-600/20 p-4 relative overflow-x-auto text-sm sm:text-base"
											in:fly={{ y: 10, duration: 200 }}
										>{selectedTech.codeExample}</pre>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				</AnimatedContainer>
			{/key}
		{/if}

		<!-- Dashboard Components -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Progress Cards -->
			<div class="card variant-glass-surface space-y-4 p-4 sm:p-6">
				<h3 class="h3 text-xl sm:text-2xl">Project Progress</h3>
				<div class="flex flex-col gap-6">
					<div class="card variant-glass-surface p-4 rounded-container-token">
						<div class="flex flex-wrap items-center gap-4 mb-4">
							<ProgressRadial
								value={progressValue}
								width="w-12"
								meter="stroke-primary-500"
								track="stroke-primary-500/30"
							/>
							<div class="flex-1">
								<div class="flex flex-wrap justify-between items-center gap-2">
									<span class="h4 text-lg sm:text-xl">Gradient Flow</span>
									<button 
										class="chip {isVertical ? 'variant-filled' : 'variant-soft'}-primary transition-all"
										on:click={() => isVertical = !isVertical}
									>
										<span>{isVertical ? '↕️ Up/Down' : '↔️ Left/Right'}</span>
									</button>
								</div>
							</div>
						</div>
						
						<div class="relative">
							<div class="wave-container h-48 relative rounded-container-token overflow-hidden backdrop-blur-sm" 
								style:background={backgroundGradient}
							>
								<svg
									class="absolute left-0 top-0 h-full w-full"
									viewBox="0 0 100 120"
									preserveAspectRatio="none"
								>
									<path
										class="wave fill-tertiary-500/40"
										d={`M0,60 
											Q${25},${60 + Math.sin(progressValue/15) * waveAmplitude} 
											${50},${60 + Math.cos(progressValue/15) * waveAmplitude} 
											T100,60 
											V120 H0 Z`}
									/>
									<path
										class="wave fill-secondary-500/40"
										d={`M0,60 
											Q${25},${60 - Math.cos(progressValue/20) * waveAmplitude} 
											${50},${60 - Math.sin(progressValue/20) * waveAmplitude} 
											T100,60 
											V120 H0 Z`}
									/>
									<path
										class="wave fill-primary-500/40"
										d={`M0,60 
											Q${25},${60 + Math.sin((progressValue + 45)/25) * waveAmplitude} 
											${50},${60 + Math.cos((progressValue + 45)/25) * waveAmplitude} 
											T100,60 
											V120 H0 Z`}
									/>
								</svg>
							</div>
							<RangeSlider 
								bind:value={progressValue} 
								max={100} 
								step={1} 
								name="progress" 
								class="z-10 relative mt-4 slider-enhanced" 
							/>
							<Rainbow progress={progressValue} />
						</div>
					</div>
				</div>
				<SkProgressBar value={progressValue} max={100} height="h-3" />
			</div>

			<!-- Radio Group Example -->
			<div class="card variant-glass-surface space-y-4 p-4 sm:p-6">
				<h3 class="h3 text-xl sm:text-2xl">Project Status</h3>
				<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
					<RadioItem bind:group={selectedValue} name="status" value="1">Planning</RadioItem>
					<RadioItem bind:group={selectedValue} name="status" value="2">In Progress</RadioItem>
					<RadioItem bind:group={selectedValue} name="status" value="3">Completed</RadioItem>
				</RadioGroup>
			</div>
		</div>

		<!-- Tabs Example -->
		<div class="card variant-glass-surface mb-8 space-y-4 p-4 sm:p-6">
			<TabGroup>
				<Tab bind:group={selectedValue} name="tab1" value="1">Overview</Tab>
				<Tab bind:group={selectedValue} name="tab2" value="2">Analytics</Tab>
				<Tab bind:group={selectedValue} name="tab3" value="3">Settings</Tab>
				<!-- Tab Panels -->
				<svelte:fragment slot="panel">
					{#if selectedValue === '1'}
						<div class="p-4">
							<h3 class="h3 mb-4">Project Overview</h3>
							<p>View your project's key metrics and progress at a glance.</p>
						</div>
					{:else if selectedValue === '2'}
						<div class="p-4">
							<h3 class="h3 mb-4">Analytics Dashboard</h3>
							<p>Track your project's performance and metrics.</p>
						</div>
					{:else if selectedValue === '3'}
						<div class="p-4">
							<h3 class="h3 mb-4">Project Settings</h3>
							<p>Configure your project preferences and options.</p>
						</div>
					{/if}
				</svelte:fragment>
			</TabGroup>
		</div>

		<!-- Todo Section -->
		<div class="card variant-glass-surface space-y-4 p-4 sm:p-6">
			<header class="flex items-center justify-between">
				<h2 class="h2">Project Tasks</h2>
				<div class="flex items-center gap-2">
					<span class="badge variant-soft"
						>{$todos.filter((t) => t.completed).length} / {$todos.length}</span
					>
					<SkProgressBar
						value={($todos.filter((t) => t.completed).length / $todos.length) * 100}
						max={100}
						class="w-24"
					/>
				</div>
			</header>

			<div class="card variant-ghost space-y-4 p-4">
				{#each $todos as todo (todo.id)}
					<div
						class="card variant-soft flex items-center justify-between gap-4 p-4"
						transition:slide
					>
						<div class="flex items-center gap-4">
							<button class="btn-icon variant-soft" on:click={() => todos.toggle(todo.id)}>
								<svelte:component this={todo.completed ? CheckCircle2 : Circle} class="h-5 w-5" />
							</button>
							<span class={todo.completed ? 'line-through opacity-50' : ''}>{todo.text}</span>
						</div>
						<button class="btn-icon variant-soft-error" on:click={() => todos.remove(todo.id)}>
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				{/each}
			</div>

			<footer class="flex gap-2">
				<input
					class="input"
					type="text"
					placeholder="Add new task..."
					bind:value={newTodo}
					on:keydown={(e) => e.key === 'Enter' && addTodo()}
				/>
				<button class="btn variant-filled-primary" on:click={addTodo}>
					<Plus class="h-4 w-4" />
					Add
				</button>
			</footer>
		</div>
	</main>

	<!-- Footer -->
	<footer class="bg-surface-100-800-token mt-12">
		<div class="container mx-auto px-4 py-8">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="space-y-4">
					<h3 class="h3">About</h3>
					<p>
						Built with modern web technologies to showcase the power of SvelteKit and Skeleton UI.
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="h3">Links</h3>
					<ul class="space-y-2">
						<li>
							<a href="https://kit.svelte.dev" class="anchor">SvelteKit</a>
						</li>
						<li>
							<a href="https://www.skeleton.dev" class="anchor">Skeleton</a>
						</li>
						<li>
							<a href="https://tailwindcss.com" class="anchor">Tailwind CSS</a>
						</li>
					</ul>
				</div>
				<div class="space-y-4">
					<h3 class="h3">Connect</h3>
					<div class="flex gap-4">
						<a
							class="btn variant-ghost-surface"
							href="https://github.com/yourusername"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github />
							<span>GitHub</span>
						</a>
						<a
							class="btn variant-ghost-surface"
							href="https://www.threads.net/@yourusername"
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg viewBox="0 0 192 192" class="w-4 h-4">
								<path fill="currentColor" d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
							</svg>
							<span>Threads</span>
						</a>
					</div>
				</div>
			</div>
			<div class="border-surface-500/30 mt-8 border-t pt-8 text-center">
				<p>2024 Your Project. Built with using SvelteKit and Skeleton.</p>
			</div>
		</div>
	</footer>
</div>

<style>
	.code {
		font-family: 'Fira Code', monospace;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.wave {
		transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	.wave-container {
		transition: background 0.5s ease;
		box-shadow: 0 0 20px rgba(var(--color-primary-500) / 0.2);
	}

	.slider-enhanced:hover {
		transform: scale(1.02);
		transition: transform 0.3s ease;
	}

	:global(.slider-enhanced input[type="range"]::-webkit-slider-thumb) {
		box-shadow: 0 0 15px rgb(var(--color-primary-500) / 0.5);
		transition: box-shadow 0.3s ease;
	}

	:global(.slider-enhanced input[type="range"]::-webkit-slider-thumb:hover) {
		box-shadow: 0 0 20px rgb(var(--color-primary-500) / 0.7);
	}
</style>
