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
	import { onMount } from 'svelte';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	let clickCount = 0;
	let clickTimer: ReturnType<typeof setTimeout> | undefined;
	let showEasterEgg = false;
	let clickX = 0;
	let clickY = 0;
	let logoElement: HTMLElement | undefined;
	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	const openDrawer = () => drawerStore.open();
	const closeDrawer = () => drawerStore.close();

	// User menu popup
	let userMenuTrigger: HTMLElement | undefined;
	let userMenuOpen = false;

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	// Close menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (userMenuOpen && userMenuTrigger && !userMenuTrigger.contains(event.target as Node)) {
			userMenuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function handleLogoClick(event: MouseEvent) {
		clickCount++;
		if (clickTimer) clearTimeout(clickTimer); // Clear existing timer

		if (clickCount === 6) {
			// 3 double-clicks = 6 clicks
			clickCount = 0;
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const cardWidth = 192; // card width is 48 * 4 (w-48)
			const cardHeight = 100; // approximate height of the card

			clickX = event.clientX;
			clickY = event.clientY;

			// Keep the card within the viewport
			if (clickX + cardWidth / 2 > viewportWidth) {
				clickX = viewportWidth - cardWidth / 2;
			} else if (clickX - cardWidth / 2 < 0) {
				clickX = cardWidth / 2;
			}

			if (clickY + cardHeight > viewportHeight) {
				clickY = viewportHeight - cardHeight;
			}

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
			const settings: ModalSettings = {
				type: 'component',
				component: 'ballMazeModal', // Assuming this string refers to a valid component.
				title: '🎮 Ball Maze Game'
			};
			modalStore.trigger(settings);
		}
	}

	initializeStores();

	function openAuth() {
		authMode.set('login');
		showAuthModal.set(true);
	}

	export let data: any; // Or import('./$types').PageData if the error is resolved.

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
<!-- svelte-ignore a11y_click_events_have_key_events -->
<AppBar class="bg-surface-100-800-token">
	<svelte:fragment slot="lead">
		<div class="flex items-baseline gap-0.5 px-4">
			<div
				class="flex items-start gap-3"
				on:click={handleLogoClick}
				role="button"
				tabindex="0"
				bind:this={logoElement}
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
						on:click={toggleUserMenu}
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

					{#if userMenuOpen}
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
