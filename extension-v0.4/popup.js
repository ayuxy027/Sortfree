document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    const submitButton = document.getElementById('submit');
    const statusContainer = document.getElementById('status');
    const apiKeyInput = document.getElementById('apiKey');
    const titleInput_Tag = document.getElementById('title');
    const descriptionInput_Tag = document.getElementById('description');
    const textBox = document.getElementById('textBox');

    // Load the saved data of title, description, and API key
    chrome.storage.local.get(['title', 'description', 'apiKey'], (result) => {
        titleInput_Tag.value = result.title;
        descriptionInput_Tag.value = result.description;
        apiKeyInput.value = result.apiKey;
    });

    saveButton.addEventListener('click', () => {
        const titleClass = titleInput_Tag.value;
        const descriptionClass = descriptionInput_Tag.value;

        // Save the input values of title, description, and API key
        chrome.storage.local.set({
            title: titleInput_Tag.value,
            description: descriptionInput_Tag.value,
            apiKey: apiKeyInput.value
        }, () => {
            console.log('Input values saved successfully'); // Debugging line
        });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (titleClass, descriptionClass) => {
                    const titles = Array.from(document.getElementsByClassName(titleClass)).map(element => element.innerText);
                    const descriptions = Array.from(document.getElementsByClassName(descriptionClass)).map(element => element.innerText);
                    // const mergedContent = titles.concat(descriptions).join(' ');
                    // instead of joining the titles and descriptions after the entire array is created, we should join them as we create the array
                    const mergedContent = titles.map((title, index) => ', title:' + title + ' description of title before: ' + descriptions[index]).join(' ');
                
                    return mergedContent;
                },
                args: [titleInput_Tag.value, descriptionInput_Tag.value]
            }, (results) => {
                const bodyContent = results[0].result;
                console.log(bodyContent); // Debugging line
                chrome.storage.local.set({ bodyContent }, () => {
                    console.log('Body content saved to storage'); // Debugging line
                    statusContainer.innerText = 'Body content saved successfully.';
                });
            });
        });
    });

    submitButton.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value;
        const userInput = textBox.value;

        chrome.storage.local.get('bodyContent', async (storageData) => {
            const bodyContent = storageData.bodyContent;
            console.log('Retrieved body content:', bodyContent); // Debugging line

            if (!bodyContent) {
                responseContainer.innerText = 'No body content found.';
                return;
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `Consider yourself as data analyst who is good at what he does, now you are provided a string of titles and description. Sort it according to given filter, and remove all tiles which are not important. Here is the filter = ${userInput}. Also give the respone in <table> so it'll be ez to render.\n Here is the body Content = \n` + bodyContent
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 1,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192,
                        responseMimeType: "text/plain"
                    }
                })
            });

            const apiData = await response.json();
            console.log('API response:', apiData); // Debugging line
            if (response.ok) {
                chrome.storage.local.set({ apiResponse: apiData }, () => {
                    console.log('API response stored successfully'); // Debugging line
                    chrome.tabs.create({ url: chrome.runtime.getURL('response.html') });
                });
            } else {
                responseContainer.innerText = `Error: ${apiData.error.message}`;
            }
        });
    });
});