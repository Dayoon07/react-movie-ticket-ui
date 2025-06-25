async function a(p) {
    const val = encodeURIComponent(p);
    try {
        const response = await fetch("http://localhost:9000/movie/api/ai/chat?q="+val);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';
        let aiMessageAdded = false;
        const aiMessageId = Date.now() + 1;

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            accumulatedContent += chunk;

            if (!aiMessageAdded) {
                const aiMessage = {
                    id: aiMessageId,
                    type: 'ai',
                    content: accumulatedContent,
                    timestamp: new Date().toLocaleTimeString()
                };
                aiMessageAdded = true;
            }

            console.log(accumulatedContent);
        }
    } catch (error) {
        console.log(error);
    }
}

a("고전 소설 추천해줘");