console.log("Content script is loaded and running");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'applyQuery') {
        const query = request.query;
        console.log('Received query:', query);
        // Call your function to process sorting/filtering with the provided query
        handleSortFilter(query).then((result) => {
            console.log('Sorting/filtering applied successfully:', result);
            sendResponse({ status: 'success', result });
        }).catch((error) => {
            sendResponse({ status: 'error', error: error.message });
        });
        return true;  // Indicates an async response
    }
});

async function handleSortFilter(query) {
    // Assume `extractAndProcessData` is a function that performs sorting/filtering based on `query`
    const structure = await detectStructureUsingLLM();
    console.log('Detected structure:', structure);
    const data = await extractDataWithDetectedStructure(structure);
    console.log('Extracted data:', data);
    const sortedFilteredData = await sendDataToPython(data, query);
    console.log('Sorted data:', sortedFilteredData);
    await applySortedData(sortedFilteredData, structure);
    console.log('Sorting/filtering applied successfully');
    return 'Sorting/filtering applied successfully';
}

async function detectStructureUsingLLM() {
    const htmlStructure = document.body.innerHTML.slice(0, 2000);  // Limit to 2000 chars for performance
    const response = await fetch('http://localhost:5000/detect_structure', { // Flask endpoint for LLM processing
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlStructure })
    });
    return await response.json();  // Expected format: { cardClass: ".card-element", titleSelector: ".card-title", priceSelector: ".card-price" }
}


async function extractDataWithDetectedStructure(structure) {
    const cards = document.querySelectorAll(structure.cardClass);
    const data = Array.from(cards).map((card, index) => ({
        id: index,
        title: card.querySelector(structure.titleSelector)?.innerText || "N/A",
        price: parseFloat(card.querySelector(structure.priceSelector)?.innerText.replace('$', '')) || null,
        rating: parseFloat(card.querySelector(structure.ratingSelector)?.innerText) || null
    }));
    return data;
    // Send the extracted data to the backend
    const sortedData = await sendDataToPython(data);
    await applySortedData(sortedData, structure);
}

async function sendDataToPython(data) {
    const userQuery = prompt("Enter your sorting/filtering criteria (e.g., 'highest rating'):");
    const response = await fetch('http://localhost:5000/sort_filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, query: userQuery })
    });
    return await response.json();
}

async function applySortedData(sortedData, structure) {
    const container = document.querySelector(structure.containerClass);  // Define the container for the cards
    container.innerHTML = '';  // Clear the current order

    sortedData.forEach(item => {
        const card = document.querySelectorAll(structure.cardClass)[item.id];
        container.appendChild(card);  // Re-add card elements in sorted order
    });
}

// Main function to orchestrate the entire process
(async () => {
    const structure = await detectStructureUsingLLM();
    console.log('Detected structure:', structure);
    if (structure) {
        const data = await extractDataWithDetectedStructure(structure);
        console.log('Extracted data:', data);
        const query = prompt("Enter your sorting/filtering criteria (e.g., 'highest rating'):");
        console.log('User query:', query);
        const sortedData = await sendDataToPython(data, query);
        console.log('Sorted data:', sortedData);
        await applySortedData(sortedData, structure);
        console.log('Sorting/filtering applied successfully');
    }
})();