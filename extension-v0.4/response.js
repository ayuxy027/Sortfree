// response.js
document.addEventListener('DOMContentLoaded', () => {
    const responseContainer = document.getElementById('response');

    chrome.storage.local.get('apiResponse', (data) => {
        const apiResponse = data.apiResponse;
        console.log('Retrieved API response:', apiResponse); // Debugging line
        if (apiResponse) {
            try {
                let importantData = apiResponse.candidates[0].content.parts[0].text;
                // Remove ```html from the beginning and ``` from the end
                importantData = importantData.replace(/^```html\s*/, '').replace(/```$/, '');
                responseContainer.innerHTML = importantData;
            } catch (error) {
                console.error('Error extracting important data:', error);
                responseContainer.innerText = 'Error extracting important data.';
            }
        } else {
            responseContainer.innerText = 'No data found.';
        }
    });
});