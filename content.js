// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'getHeaderTags') {
    // Gather all heading tags from the current webpage
    let headingIndex = 0;
    const headings = [];
    ['h1', 'h2', 'h3'].forEach(tag => {
      document.querySelectorAll(tag).forEach(h => {
        // Assign a unique data attribute for reliable scrolling
        const uniqueId = `scout-heading-${headingIndex++}`;
        h.setAttribute('data-scout-id', uniqueId);
        headings.push({
          text: h.textContent.trim(),
          level: parseInt(tag[1]),
          selector: `[data-scout-id='${uniqueId}']`
        });
      });
    });
    // Send the headings back to the popup
    sendResponse({ headings });
  } else if (message.action === 'scrollToHeader') {
    // Scroll to the selected header using the unique selector
    const selector = message.selector;
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
