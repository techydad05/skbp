import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { url } = await request.json();
    
    try {
        // Fetch the URL and process it
        const response = await fetch(url);
        const text = await response.text();
        
        // Return some basic info about the page
        return json({
            result: {
                status: response.status,
                contentType: response.headers.get('content-type'),
                length: text.length,
                preview: text.slice(0, 100) + '...'
            }
        });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}
