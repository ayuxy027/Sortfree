chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === 'LLM_QUERY') {
      // Call LLM API (e.g., OpenAI's API)
      const response = await fetch('LLM_API_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message.query })
      });
      const data = await response.json();
      sendResponse(data.instructions); // Receive sorting/filtering instructions
    }
  });