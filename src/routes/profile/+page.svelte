<script lang="ts">
	import { enhance } from '$app/forms';

	/** @type {import('./$types').PageData} */
	export let data;

	let form;
	let successMessage = '';

	function handleSubmit() {
		return async ({ result }) => {
			if (result.type === 'success') {
				successMessage = 'Profile updated successfully!';
				setTimeout(() => successMessage = '', 3000);
			} else if (result.type === 'failure') {
				form = result.data;
			}
		};
	}
</script>

<div class="container mx-auto p-4">
	<div class="card p-6 max-w-2xl mx-auto">
		<h1 class="h1 mb-6">User Profile</h1>
		
		{#if !data.user}
			<p>Please log in to view your profile.</p>
		{:else}
			<form method="POST" action="?/updateProfile" use:enhance={handleSubmit} class="space-y-6">
				<div class="space-y-4">
					<label class="label">
						<span>Username</span>
						<input
							class="input"
							type="text"
							name="username"
							value={data.user.username}
							disabled
						/>
						<span class="text-sm text-surface-500">Username cannot be changed</span>
					</label>

					<label class="label">
						<span>Display Name</span>
						<input
							class="input"
							type="text"
							name="displayName"
							value={data.user.displayName || ''}
							placeholder="Enter your display name"
						/>
					</label>

					<label class="label">
						<span>Bio</span>
						<textarea
							class="textarea"
							name="bio"
							rows="3"
							placeholder="Tell us about yourself"
						>{data.user.bio || ''}</textarea>
					</label>
				</div>

				{#if form?.message}
					<div class="alert variant-filled-error">{form.message}</div>
				{/if}

				{#if successMessage}
					<div class="alert variant-filled-success">{successMessage}</div>
				{/if}

				<button type="submit" class="btn variant-filled-primary">Update Profile</button>
			</form>
		{/if}
	</div>
</div>
