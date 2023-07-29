document.addEventListener('DOMContentLoaded', function () {
  // Query the current tab to get the content of the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Send a message to the content script to gather the H2 tags
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getH2Tags' }, function (response) {
      // Handle the response from the content script
      if (response && response.h2Tags) {
        const tagsListDiv = document.getElementById('tagsList');
        tagsListDiv.innerHTML = '';

        // Create and append a list of H2 tags to the popup
        const ul = document.createElement('ul');
        response.h2Tags.forEach((tagText, index) => {
          const li = document.createElement('li');
          li.textContent = tagText;

          // Add an event listener to scroll to the selected header on click
          li.addEventListener('click', function () {
            scrollToHeader(index);
          });

          ul.appendChild(li);
        });

        tagsListDiv.appendChild(ul);
      }
    });
  });
});

// Function to scroll the webpage to the selected header
function scrollToHeader(index) {
  // Send a message to the content script to instruct scrolling to the selected header
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'scrollToHeader', index: index });
  });
}
