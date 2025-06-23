interface ProcessResponse {
  success?: boolean;
  error?: string;
}

interface PopupMessageRequest {
  action: string;
  userPrompt: string;
}

document.addEventListener('DOMContentLoaded', (): void => {
  const processBtn = document.getElementById('processBtn') as HTMLButtonElement;
  const promptTextarea = document.getElementById('prompt') as HTMLTextAreaElement;
  const error = document.getElementById('error') as HTMLDivElement;
  const success = document.getElementById('success') as HTMLDivElement;
  const suggestions = document.querySelectorAll('.suggestion') as NodeListOf<HTMLElement>;

  const showMessage = (message: string, type: 'error' | 'success'): void => {
    const messageElement = type === 'error' ? error : success;
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    setTimeout((): void => {
      messageElement.style.display = 'none';
    }, 5000);
  };

  const hideMessages = (): void => {
    error.style.display = 'none';
    success.style.display = 'none';
  };

  const setButtonState = (isProcessing: boolean): void => {
    processBtn.disabled = isProcessing;
    processBtn.classList.toggle('processing', isProcessing);
    const buttonText = processBtn.querySelector('span') as HTMLSpanElement;
    buttonText.textContent = isProcessing
      ? 'Processing...'
      : 'Process Content';
  };

  const processContent = async (): Promise<void> => {
    hideMessages();
    setButtonState(true);

    try {
      const promptText = promptTextarea.value.trim();
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
        files: ['dist/content.js'],
      });

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'process',
        userPrompt: promptText,
      } as PopupMessageRequest) as ProcessResponse;

      if (response?.error) {
        throw new Error(response.error);
      }

      if (response?.success) {
        showMessage('Content processed successfully!', 'success');
        setTimeout((): void => window.close(), 1500);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error processing content';
      showMessage(errorMessage, 'error');
    } finally {
      setButtonState(false);
    }
  };

  // Handle suggestion clicks
  suggestions.forEach((suggestion: HTMLElement): void => {
    suggestion.addEventListener('click', (): void => {
      promptTextarea.value = suggestion.textContent || '';
      promptTextarea.focus();
    });
  });

  // Handle keyboard shortcut
  document.addEventListener('keydown', (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processContent();
    }
  });

  processBtn.addEventListener('click', processContent);
});