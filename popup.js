document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getHeaderTags' }, function (response) {
      if (response && response.h2Tags) {
        const tagsListDiv = document.getElementById('tagsList');
        tagsListDiv.innerHTML = '';

        // Create and append a list of H2 tags to the popup
        const h2Ul = document.createElement('ul');
        response.h2Tags.forEach((tagText, index) => {
          const li = document.createElement('li');
          li.textContent = tagText;

          // Add an event listener to scroll to the selected header on click
          li.addEventListener('click', function () {
            scrollToHeader(index, 'h2');
          });

          h2Ul.appendChild(li);
        });

        tagsListDiv.appendChild(h2Ul);
      }
    });
  });
});

// Function to scroll the webpage to the selected header
function scrollToHeader(index, tagName) {
  // Send a message to the content script to instruct scrolling to the selected header
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'scrollToHeader', index: index, tagName: tagName });
  });
}
