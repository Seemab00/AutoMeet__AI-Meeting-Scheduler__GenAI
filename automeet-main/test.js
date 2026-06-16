import axios from 'axios';
async function testEndpoint() {
    try {
        console.log("Testing POST to http://127.0.0.1:3000/api/integrations/transcribe");
        const res = await axios.post('http://127.0.0.1:3000/api/integrations/transcribe', {
            audioBase64: "data:audio/webm;base64,GkXfow=="
        });
        console.log("Status:", res.status);
        console.log("Response:", res.data);
    } catch (e) {
        if (e.response) {
            console.error("Server Error:", e.response.status, e.response.data);
        } else {
            console.error("Axios failed:", e.message);
        }
    }
}
testEndpoint();
