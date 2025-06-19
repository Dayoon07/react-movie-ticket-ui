async function a() {
    try {
        const res = await fetch("http://localhost:9004/api/ai/chat?q=안녕?");

        if (res.ok) {
            const data = await res.text();
            console.log(data);
        }

    } catch (error) {
        console.log(error);
    }
}

a();