document.addEventListener('DOMContentLoaded', () => {
  const processBtn = document.getElementById('processBtn');
  const prompt = document.getElementById('prompt');
  const error = document.getElementById('error');
  const success = document.getElementById('success');
  const suggestions = document.querySelectorAll('.suggestion');

  const showMessage = (message, type) => {
    const messageElement = type === 'error' ? error : success;
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 5000);
  };

  const hideMessages = () => {
    error.style.display = 'none';
    success.style.display = 'none';
  };

  const setButtonState = (isProcessing) => {
    processBtn.disabled = isProcessing;
    processBtn.classList.toggle('processing', isProcessing);
    processBtn.querySelector('span').textContent = isProcessing
      ? 'Processing...'
      : 'Process Content';
  };

  const processContent = async () => {
    hideMessages();
    setButtonState(true);

    try {
      const promptText = prompt.value.trim();
      if (!promptText) {
        throw new Error('Please enter a sorting/organization prompt');
      }

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        throw new Error('No active tab found');
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js'],
      });

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'process',
        prompt: promptText,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      if (response?.success) {
        showMessage('Content processed successfully!', 'success');
        setTimeout(() => window.close(), 1500);
      }
    } catch (err) {
      showMessage(err.message || 'Error processing content', 'error');
    } finally {
      setButtonState(false);
    }
  };

  // Handle suggestion clicks
  suggestions.forEach(suggestion => {
    suggestion.addEventListener('click', () => {
      prompt.value = suggestion.textContent;
      prompt.focus();
    });
  });

  // Handle keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processContent();
    }
  });

  processBtn.addEventListener('click', processContent);
});