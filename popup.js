document.addEventListener('DOMContentLoaded', function () {
  // Global variable to store the last clicked header element
  let lastClickedHeader;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getHeaderTags' }, function (response) {
      const tagsListDiv = document.getElementById('tagsList');
      tagsListDiv.innerHTML = '';

      if (response && response.h1Tag && response.h2Tags && response.h2Tags.length > 0) {
        // Create and append the H1 tag to the top
        const h1Header = document.createElement('h1');
        h1Header.textContent = toTitleCase(response.h1Tag);

        // Convert H1 text to title case
        h1Header.textContent = toTitleCase(response.h1Tag);

        tagsListDiv.appendChild(h1Header);

        // Create and append a list of H2 tags to the popup
        const h2Ul = document.createElement('ul');
        h2Ul.id = 'h2List';
        h2Ul.style.listStyle = 'none';
        response.h2Tags.forEach((tagText, index) => {
          const li = document.createElement('li');
          li.textContent = toTitleCase(tagText);

          // Add an event listener to scroll to the selected header on click
          li.addEventListener('click', function () {
            // Remove color from the previous last clicked header
            if (lastClickedHeader) {
              lastClickedHeader.style.color = '';
            }

            // Scroll to the header
            scrollToHeader(index, 'h2');

            // Set the current header as the last clicked header and change its color
            lastClickedHeader = this;
            lastClickedHeader.style.color = 'skyblue';
          });

          h2Ul.appendChild(li);
        });

        tagsListDiv.appendChild(h2Ul);
      } else {
        // If no headers are present, display an 'Error' element
        const errorLi = document.createElement('li');
        errorLi.textContent = 'Error';
        errorLi.style.listStyle = 'none';
        errorLi.style.color = 'red';
        errorLi.style.fontWeight = 'bold';
        tagsListDiv.appendChild(errorLi);
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

// Function to convert text to title case
function toTitleCase(text) {
  return text.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
