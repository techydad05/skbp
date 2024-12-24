<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Palette, Sun, Moon, ChevronDown } from 'lucide-svelte';
	import { popup, type PopupSettings, LightSwitch, ProgressBar } from '@skeletonlabs/skeleton';
	import { currentTheme, isDarkMode } from '$lib/stores/appStore';
    import LoadingScreen from './LoadingScreen.svelte';

	export let inDrawer = false;

	const themes = [
		{ type: 'skeleton', name: 'Skeleton', icon: '💀' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' },
		{ type: 'seasonal', name: 'Seasonal', icon: '🎆' },
		{ type: 'test', name: 'Test', icon: '🚧' }
	];

	// Set default theme for SSR
	$currentTheme = 'skeleton';
    let showLoading = false;

	let popupSettings: PopupSettings = {
		event: 'click',
		target: inDrawer ? 'drawerThemePopup' : 'themePopup',
		placement: inDrawer ? 'bottom-start' : 'bottom-end'
	};

	async function setTheme(theme: string) {
        showLoading = true;
		if (!browser) return;

		$currentTheme = theme;
		document.body.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
        await new Promise(resolve => setTimeout(resolve, 100));
        showLoading = false;
	}

	function toggleMode() {
		$isDarkMode = !$isDarkMode;
		const mode = $isDarkMode ? 'dark' : 'light';
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add(mode);
		localStorage.setItem('mode', mode);
	}

	onMount(() => {
        showLoading = true;
		if (!browser) return;

		const savedTheme = localStorage.getItem('theme');
		const savedMode = localStorage.getItem('mode');

		if (savedTheme) {
			$currentTheme = savedTheme;
			document.body.setAttribute('data-theme', savedTheme);
		}

		if (savedMode) {
			$isDarkMode = savedMode === 'dark';
			document.documentElement.classList.remove('dark', 'light');
			document.documentElement.classList.add(savedMode);
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			$isDarkMode = prefersDark;
			document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
		}
        showLoading = false;
	});
</script>

<LoadingScreen show={showLoading} />

<!-- Theme -->
<div style={`opacity: ${showLoading ? 0 : 1}`}>
	<!-- trigger -->
	<button class="btn hover:variant-soft-primary" use:popup={popupSettings}>
		<svelte:component this={Palette} class="h-4 w-4" />
		<span>Theme</span>
		<svelte:component this={ChevronDown} class="h-4 w-4" />
	</button>
	<!-- popup -->
	<div class="card w-60 p-4 shadow-xl" data-popup={inDrawer ? 'drawerThemePopup' : 'themePopup'}>
		<div class="space-y-4">
			{#if browser}
				<section class="flex items-center justify-between">
					<h6 class="h6">Mode</h6>
					<LightSwitch bind:checked={$isDarkMode} on:change={toggleMode} />
				</section>
				<section class="space-y-2">
					<h6 class="h6">Theme</h6>
					<div class="grid gap-2">
						{#each themes as theme}
							<button
								class="btn variant-soft {$currentTheme === theme.type ? 'variant-filled-primary' : ''} w-full"
								on:click={() => setTheme(theme.type)}
							>
								<span>{theme.icon}</span>
								<span>{theme.name}</span>
							</button>
						{/each}
					</div>
				</section>
			{/if}
		</div>
	</div>
</div>

<style>
	[data-popup='themePopup'],
	[data-popup='drawerThemePopup'] {
		position: absolute;
	}
	.arrow {
		position: absolute;
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-bottom: 8px solid var(--color-surface-500);
		top: -8px;
		right: 18px;
	}
</style>
