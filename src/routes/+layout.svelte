<script>
	import '../app.css';
	// Skeleton
	import { AppShell, initializeStores } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup, Modal } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import EasterEggModal from '$lib/components/EasterEggModal.svelte';
	import BallMazeModal from '$lib/components/BallMazeModal.svelte';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	let { children, data } = $props();

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			document.body.setAttribute('data-theme', savedTheme);
		}
	});

	const popupRegistry = {
		easterEgg: {
			ref: EasterEggModal,
			popup: 'hover'
		}
	};

	const modalRegistry = {
		ballMazeModal: {
			ref: BallMazeModal,
			data: {}
		}
	};
</script>

<Modal components={modalRegistry} />
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
		<Header {data} />
	</svelte:fragment>
	<div class="container mx-auto px-4">
		{@render children()}
	</div>
</AppShell>

<style>
	:global(html, body) {
		height: 100%;
		overflow-y: auto;
	}
	:global(body) {
		display: flex;
		flex-direction: column;
	}
</style>
