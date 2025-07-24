import type { APIRoute } from 'astro';

// Disable prerendering so this API route isn't executed at build time
export const prerender = false;

export const GET: APIRoute = async () => {
    try {
        const KIT_API_KEY = import.meta.env.KIT_API_KEY;
        const KIT_FORM_ID = import.meta.env.KIT_FORM_ID || import.meta.env.CONVERTKIT_FORM_ID;

        console.log('Testing Kit credentials:', {
            hasApiKey: !!KIT_API_KEY,
            hasFormId: !!KIT_FORM_ID,
            formId: KIT_FORM_ID,
            apiKeyLength: KIT_API_KEY?.length
        });

        // Test Kit API v4 connection - check API access
        const testResponse = await fetch('https://api.kit.com/v4/subscribers', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${KIT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const testData = await testResponse.text();
        console.log('Kit v4 API test response:', testData);

        return new Response(
            JSON.stringify({
                message: 'Kit v4 API test completed',
                apiResponse: testData
            }), 
            { 
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Test error:', error);
        return new Response(
            JSON.stringify({
                message: 'Test failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            }), 
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
} 