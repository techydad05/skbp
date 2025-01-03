<script lang="ts">
	import {
		AppBar,
		Drawer,
		initializeStores,
		getDrawerStore,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import AuthModal from '$lib/components/auth/AuthModal.svelte';
	import { showAuthModal, authMode, currentUser, setUser } from '$lib/stores/authStore';
	import { menuStore } from '$lib/stores/menuStore';
	import { EasterEggHandler } from '$lib/utils/easterEgg';
	import { onMount } from 'svelte';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	// Props
	let { data } = $props();

	// Initialize stores and handlers
	initializeStores();
	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	
	// Easter egg state
	let showEasterEgg = false;
	let clickX = 0;
	let clickY = 0;
	
	// Initialize easter egg handler with configuration
	const easterEggHandler = new EasterEggHandler({
		requiredClicks: 6,
		timeWindow: 500,
		cardDimensions: { width: 192, height: 100 }
	});

	// Drawer controls
	const openDrawer = () => drawerStore.open();
	const closeDrawer = () => drawerStore.close();

	// User menu element reference
	let userMenuTrigger: HTMLElement | undefined;

	// Close menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if ($menuStore.userMenuOpen && userMenuTrigger && !userMenuTrigger.contains(event.target as Node)) {
			menuStore.closeUserMenu();
		}
	}

	// Watch for changes in data.user and update the user state
	$effect(() => {
		if (data?.user) {
			setUser(data.user);
		}
	});

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function handleLogoClick(event: MouseEvent) {
		const result = easterEggHandler.handleClick(event);
		if (result.triggered && result.position) {
			clickX = result.position.x;
			clickY = result.position.y;
			showEasterEgg = true;
		}
	}

	function handleChoice(choice: boolean) {
		showEasterEgg = false;
		if (choice) {
			const settings: ModalSettings = {
				type: 'component',
				component: 'ballMazeModal',
				title: '🎮 Ball Maze Game'
			};
			modalStore.trigger(settings);
		}
	}

	function openAuth() {
		authMode.set('login');
		showAuthModal.set(true);
	}

</script>

<!-- Header -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<AppBar class="bg-surface-100-800-token">
	<svelte:fragment slot="lead">
		<div class="flex items-baseline gap-0.5 px-4">
			<div
				class="flex items-start gap-3"
				on:click={handleLogoClick}
				role="button"
				tabindex="0"
			>
				<span class="relative text-6xl font-black text-primary-500">
					S
					<span
						class="absolute -right-4 -top-1 text-sm font-bold text-surface-900 dark:text-surface-100"
						>(5)</span
					>
				</span>
				<span class="relative translate-y-2 text-5xl font-black text-secondary-500">
					K
					<span
						class="absolute -right-4 -top-1 text-sm font-bold text-surface-900 dark:text-surface-100"
						>(2)</span
					>
				</span>
			</div>
		</div>
		<strong class="pl-2 text-xl uppercase">SvelteKit Boilerplate</strong>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<nav class="hidden items-center space-x-4 md:flex">
			<a class="variant-ghost-surface btn btn-sm" href="/">Home</a>
			<a class="variant-ghost-surface btn btn-sm" href="/about">About</a>
			<a class="variant-ghost-surface btn btn-sm" href="/contact">Contact</a>
			<ThemeSwitcher />
			{#if $currentUser || data?.user}
				<div class="relative flex items-center space-x-2">
					<button
						class="variant-ghost-surface btn btn-sm flex items-center gap-2"
						on:click={() => menuStore.toggleUserMenu()}
						bind:this={userMenuTrigger}
					>
						<span class="text-sm">{$currentUser?.username || data.user.username}</span>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{#if $menuStore.userMenuOpen}
						<div
							class="bg-surface-100-800-token absolute right-0 top-full z-50 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
						>
							<div class="py-1" role="menu">
								<a
									href="/profile"
									class="block px-4 py-2 text-sm hover:bg-surface-200-700-token"
									role="menuitem">Profile</a
								>
								<a
									href="/test-form"
									class="block px-4 py-2 text-sm hover:bg-surface-200-700-token"
									role="menuitem">URL Tester</a
								>
								<button
									class="block w-full px-4 py-2 text-left text-sm hover:bg-surface-200-700-token"
									role="menuitem"
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
						</div>
					{/if}
				</div>
			{:else}
				<button class="variant-filled-primary btn btn-sm" on:click={openAuth}> Sign In </button>
			{/if}
		</nav>
		<button class="variant-ghost-surface btn btn-icon md:hidden" on:click={openDrawer}>
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
	<div
		class="card fixed w-48 p-3 shadow-xl"
		style="left: {clickX}px; top: {clickY}px; transform: translate(-50%, 10px); z-index: 1000;"
	>
		<header class="mb-2 text-center text-lg font-bold">🎉 Choose! 🎉</header>
		<div class="flex justify-center gap-4">
			<button class="variant-filled-success btn btn-sm" on:click={() => handleChoice(true)}>
				<span class="text-xl">✓</span>
			</button>
			<button class="variant-filled-error btn btn-sm" on:click={() => handleChoice(false)}>
				<span class="text-xl">✗</span>
			</button>
		</div>
	</div>
{/if}

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
						<button type="submit" class="variant-ghost-surface btn btn-sm mt-2">Logout</button>
					</form>
				</div>
			{:else}
				<button class="variant-filled-primary btn btn-sm" on:click={openAuth}> Sign In </button>
			{/if}
			<ThemeSwitcher inDrawer={true} />
		</nav>
	{/if}
</Drawer>

<AuthModal />

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
