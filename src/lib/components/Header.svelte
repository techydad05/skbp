<script lang="ts">
	import { AppBar, Drawer, initializeStores, getDrawerStore, getModalStore, popup } from '@skeletonlabs/skeleton';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import AuthModal from '$lib/components/auth/AuthModal.svelte';
	import { showAuthModal, authMode, currentUser, setUser } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import BallMaze from '$lib/components/BallMaze.svelte';
	
	let clickCount = 0;
	let clickTimer: number;
	let showEasterEgg = false;
	let clickX = 0;
	let clickY = 0;
	let logoElement: HTMLElement;
	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	const openDrawer = () => drawerStore.open();
	const closeDrawer = () => drawerStore.close();
	
	function handleLogoClick(event: MouseEvent) {
		clickCount++;
		clearTimeout(clickTimer);
		
		if (clickCount === 6) { // 3 double-clicks = 6 clicks
			clickCount = 0;
			clickX = event.clientX;
			clickY = event.clientY;
			showEasterEgg = true;
		}
		
		// Reset click count after 500ms
		clickTimer = setTimeout(() => {
			clickCount = 0;
		}, 500);
	}

	function handleChoice(choice: boolean) {
		showEasterEgg = false;
		if (choice) {
			modalStore.trigger({
				type: 'component',
				component: 'ballMazeModal',
				title: '🎮 Ball Maze Game',
				buttonDefaults: {
					size: 'sm',
					rounded: 'rounded-full'
				}
			});
		}
	}

	initializeStores();

	function openAuth() {
		authMode.set('login');
		showAuthModal.set(true);
	}

	/** @type {import('./$types').PageData} */
	export let data;

	// Initialize client-side state from server data
	onMount(() => {
		if (data?.user) {
			setUser(data.user);
		}
	});

	$: if (data?.user) {
		setUser(data.user);
	}
</script>

<!-- Header -->
<AppBar class="bg-surface-100-800-token">
	<svelte:fragment slot="lead">
		<div class="flex items-baseline gap-0.5 px-4">
			<div class="flex items-start gap-3" 
				 on:click={handleLogoClick}
				 bind:this={logoElement}>
				<span class="text-6xl font-black text-primary-500 relative">
					S
					<span class="text-sm font-bold text-surface-600 absolute -top-1 -right-4">(5)</span>
				</span>
				<span class="text-5xl font-black text-secondary-500 translate-y-2 relative">
					K
					<span class="text-sm font-bold text-surface-600 absolute -top-1 -right-4">(2)</span>
				</span>
			</div>
		</div>
		<strong class="pl-2 text-xl uppercase">SvelteKit Boilerplate</strong>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<nav class="hidden items-center space-x-4 md:flex">
			<a class="btn btn-sm variant-ghost-surface" href="/">Home</a>
			<a class="btn btn-sm variant-ghost-surface" href="/about">About</a>
			<a class="btn btn-sm variant-ghost-surface" href="/contact">Contact</a>
			<ThemeSwitcher />
			{#if $currentUser || data?.user}
				<div class="flex items-center space-x-2">
					<span class="text-sm">Welcome, {$currentUser?.username || data.user.username}!</span>
					<a href="/profile" class="btn btn-sm variant-ghost-surface">Profile</a>
					<button 
						class="btn btn-sm variant-ghost-surface"
						on:click={async () => {
							await fetch('/api/auth', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({ action: 'logout' })
							});
							window.location.reload();
						}}
					>
						Logout
					</button>
				</div>
			{:else}
				<button class="btn btn-sm variant-filled-primary" on:click={openAuth}>
					Sign In
				</button>
			{/if}
		</nav>
		<button class="btn btn-icon variant-ghost-surface md:hidden" on:click={openDrawer}>
			<!-- Hamburger Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</button>
	</svelte:fragment>
</AppBar>

{#if showEasterEgg}
	<div class="card p-3 shadow-xl w-48 fixed" style="left: {clickX}px; top: {clickY}px; transform: translate(-50%, 10px); z-index: 1000;">
		<header class="text-lg font-bold text-center mb-2">🎉 Choose! 🎉</header>
		<div class="flex justify-center gap-4">
			<button class="btn btn-sm variant-filled-success" on:click={() => handleChoice(true)}>
				<span class="text-xl">✓</span>
			</button>
			<button class="btn btn-sm variant-filled-error" on:click={() => handleChoice(false)}>
				<span class="text-xl">✗</span>
			</button>
		</div>
	</div>
{/if}

<style>
	.card {
		animation: popIn 0.2s ease-out;
	}

	@keyframes popIn {
		from {
			transform: translate(-50%, 20px) scale(0.8);
			opacity: 0;
		}
		to {
			transform: translate(-50%, 10px) scale(1);
			opacity: 1;
		}
	}
</style>

<!-- Drawer -->
<Drawer>
	{#if $drawerStore.open}
		<nav class="space-y-2 p-4">
			<a class="block py-2" href="/" on:click={closeDrawer}>Home</a>
			<a class="block py-2" href="/about" on:click={closeDrawer}>About</a>
			<a class="block py-2" href="/contact" on:click={closeDrawer}>Contact</a>
			{#if $currentUser || data?.user}
				<div class="py-2">
					<span class="block">Welcome, {$currentUser?.username || data.user.username}!</span>
					<form method="POST" action="/auth?/logout">
						<button type="submit" class="btn btn-sm variant-ghost-surface mt-2">Logout</button>
					</form>
				</div>
			{:else}
				<button class="btn btn-sm variant-filled-primary" on:click={openAuth}>
					Sign In
				</button>
			{/if}
			<ThemeSwitcher inDrawer={true} />
		</nav>
	{/if}
</Drawer>

<AuthModal />
