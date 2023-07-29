// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'getH2Tags') {
      // Gather all the H2 tags from the current webpage
      const h2Tags = Array.from(document.querySelectorAll('h2')).map((h2) => h2.textContent);
      // Send the H2 tags back to the popup
      sendResponse({ h2Tags: h2Tags });
    } else if (message.action === 'scrollToHeader') {
      // Scroll to the selected header
      const headers = document.querySelectorAll('h2');
      const index = message.index;
  
      if (index >= 0 && index < headers.length) {
        headers[index].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  