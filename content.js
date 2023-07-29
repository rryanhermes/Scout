// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'getHeaderTags') {
      // Gather all the H1 and H2 tags from the current webpage
      const h1Tags = Array.from(document.querySelectorAll('h1')).map((h1) => h1.textContent.trim());
      const h2Tags = Array.from(document.querySelectorAll('h2')).map((h2) => h2.textContent.trim());
  
      // Send the H1 and H2 tags back to the popup
      sendResponse({ h1Tags: h1Tags, h2Tags: h2Tags });
    } else if (message.action === 'scrollToHeader') {
      // Scroll to the selected header
      const tagName = message.tagName; // Get the tag name from the message
      const headers = document.querySelectorAll(tagName);
  
      const index = message.index;
  
      if (index >= 0 && index < headers.length) {
        headers[index].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  