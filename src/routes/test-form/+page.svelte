<script>
    let inputValue = '';
    let response = '';
    let loading = false;

    // Handle keyboard shortcuts
    function handleKeydown(event) {
        if (event.ctrlKey && event.key === 'l') {
            event.preventDefault();
            document.querySelector('#url-input').focus();
        }
    }

    async function handleSubmit() {
        loading = true;
        try {
            const res = await fetch('/api/process-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputValue })
            });
            const data = await res.json();
            response = JSON.stringify(data.result, null, 2);
        } catch (error) {
            response = `Error: ${error.message}`;
        }
        loading = false;
    }
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="container mx-auto p-4">
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div class="flex flex-col gap-2">
            <label for="url-input" class="text-sm font-medium">Enter URL (Ctrl + L to focus)</label>
            <input
                id="url-input"
                type="url"
                bind:value={inputValue}
                class="border p-2 rounded w-full"
                placeholder="https://example.com"
                required
            />
        </div>
        
        <button
            id="submit-button"
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
        >
            {loading ? 'Processing...' : 'Submit'}
        </button>
    </form>
    
    {#if response}
        <div class="response-container mt-4 p-4 bg-gray-100 rounded">
            <pre id="response-field" class="whitespace-pre-wrap">Response: {response}</pre>
        </div>
    {/if}
</div>
