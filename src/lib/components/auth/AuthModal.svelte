<script>
	import { showAuthModal, authMode } from '$lib/stores/authStore';
	import { fade } from 'svelte/transition';
	import LoginForm from './LoginForm.svelte';
	import RegisterForm from './RegisterForm.svelte';
</script>

{#if $showAuthModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-surface-backdrop-token">
		<div class="card p-4 w-full max-w-md shadow-xl space-y-4" transition:fade>
			<header class="text-2xl font-bold flex space-x-4">
				{#if $authMode === 'login'}
					<span>Sign In</span>
					<button class="btn btn-sm variant-ghost" on:click={() => authMode.set('register')}>
						Register
					</button>
				{:else}
					<button class="btn btn-sm variant-ghost" on:click={() => authMode.set('login')}>
						Sign In
					</button>
					<span>Register</span>
				{/if}
			</header>


			<main class="p-4">
				{#if $authMode === 'login'}
					<LoginForm />
				{:else}
					<RegisterForm />
				{/if}
			</main>

			<footer class="flex justify-end">
				<button class="btn variant-ghost-surface" on:click={() => showAuthModal.set(false)}>Close</button>
			</footer>
		</div>
	</div>
{/if}
