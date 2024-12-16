<script>
	import { enhance } from '$app/forms';
	import { showAuthModal, setUser } from '$lib/stores/authStore';

	let errorMessage = '';
	let loading = false;
	let username = '';
	let password = '';

	async function handleSubmit(event) {
		event.preventDefault();
		loading = true;
		errorMessage = '';

		try {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'login',
					username,
					password
				})
			});

			const result = await response.json();
			
			if (result.error) {
				errorMessage = result.error;
			} else if (result.user) {
				setUser(result.user);
				showAuthModal.set(false);
			}
		} catch (e) {
			errorMessage = 'An error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<form on:submit={handleSubmit} class="space-y-4">
	<label class="label">
		<span>Username</span>
		<input
			class="input"
			type="text"
			bind:value={username}
			placeholder="Enter username"
			required
		/>
	</label>

	<label class="label">
		<span>Password</span>
		<input
			class="input"
			type="password"
			bind:value={password}
			placeholder="Enter password"
			required
		/>
	</label>

	{#if errorMessage}
		<p class="text-error-500">{errorMessage}</p>
	{/if}

	<button type="submit" class="btn variant-filled-primary w-full" disabled={loading}>
		{#if loading}
			Loading...
		{:else}
			Sign In
		{/if}
	</button>
</form>
