document.getElementById('apply').addEventListener('click', () => {
    const query = document.getElementById('query').value;
    console.log('Applying query:', query);
    // Get the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tabId = tabs[0].id;
            

            // Ensure the content script is ready before sending the message
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => console.log("Executing content script on the tab")
            }, () => {
                // Send a message to the content script in the active tab with the user query
                chrome.tabs.sendMessage(tabId, { action: 'applyQuery', query: query }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error contacting content script:", chrome.runtime.lastError);
                    } else {
                        console.log('Response from content script:', response);
                    }
                });
            });
        }
    });
});