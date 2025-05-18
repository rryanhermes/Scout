document.addEventListener('DOMContentLoaded', function () {
  // Global variable to store the last clicked header element
  let lastClickedHeader;

  // Theme handling
  const themeToggle = document.getElementById('theme-toggle');
  
  // Load saved theme preference
  chrome.storage.sync.get('theme', function(data) {
    if (data.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.checked = true;
    }
  });

  // Theme toggle handler
  themeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.documentElement.setAttribute('data-theme', 'light');
      chrome.storage.sync.set({ theme: 'light' });
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      chrome.storage.sync.set({ theme: 'dark' });
    }
  });

  // Show loading spinner
  const tagsListDiv = document.getElementById('tagsList');
  function showSpinner() {
    tagsListDiv.innerHTML = `
      <div style=\"display: flex; justify-content: center; align-items: center; height: 100px;\">
        <div style=\"
          width: 30px;
          height: 30px;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--hover-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        \" ></div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }
  showSpinner();

  // Retry logic for loading headings
  let attempts = 0;
  const maxAttempts = 3;
  const retryDelay = 500;

  function requestHeadings() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getHeaderTags' }, function (response) {
        if (!response || !response.headings || response.headings.length === 0) {
          if (attempts < maxAttempts - 1) {
            attempts++;
            showSpinner();
            setTimeout(requestHeadings, retryDelay);
            return;
          } else {
            showSpinner();
            setTimeout(() => {
              if (!response || !response.headings || response.headings.length === 0) {
                tagsListDiv.innerHTML = '';
                const errorLi = document.createElement('li');
                errorLi.textContent = "No headings found on this page";
                errorLi.style.listStyle = 'none';
                errorLi.style.color = 'var(--error-color)';
                errorLi.style.fontWeight = 'normal';
                errorLi.style.fontStyle = "italic"; 
                tagsListDiv.appendChild(errorLi);
              }
            }, 700);
            return;
          }
        }
        // Otherwise, show headings immediately
        tagsListDiv.innerHTML = '';
        if (response && response.headings && response.headings.length > 0) {
          // Separate the first H1 (main heading) from the rest
          const mainHeading = response.headings.find(h => h.level === 1);
          const subHeadings = response.headings.filter(h => h.level !== 1);

          // Render the main heading above the box
          const mainHeadingDiv = document.createElement('div');
          if (mainHeading) {
            mainHeadingDiv.textContent = toTitleCase(mainHeading.text);
            mainHeadingDiv.style.fontWeight = 'bold';
            mainHeadingDiv.style.fontSize = '20px';
            mainHeadingDiv.style.margin = '0 0 10px 6px';
            mainHeadingDiv.style.color = 'var(--heading-color)';
            mainHeadingDiv.style.letterSpacing = '0.01em';
            tagsListDiv.appendChild(mainHeadingDiv);
          }

          // Create and append the list of subheadings inside the box
          const headingsUl = document.createElement('ul');
          headingsUl.id = 'headingsList';
          headingsUl.style.listStyle = 'none';
          headingsUl.style.padding = '0';
          headingsUl.style.margin = '0';
          headingsUl.style.background = 'transparent';
          headingsUl.style.border = 'none';

          subHeadings.forEach((heading, index) => {
            const li = document.createElement('li');
            li.textContent = toTitleCase(heading.text);
            
            // Set indentation based on heading level
            const indent = (heading.level - 1) * 20; // 20px per level
            li.style.paddingLeft = `${indent}px`;
            
            // Style based on heading level
            if (heading.level === 2) {
              li.style.fontWeight = 'normal';
              li.style.fontSize = '15px';
              li.style.marginBottom = '8px';
            } else {
              li.style.fontSize = '13px';
              li.style.marginBottom = '6px';
            }

            // Add an event listener to scroll to the selected header on click
            li.addEventListener('click', function () {
              // Remove color from the previous last clicked header
              if (lastClickedHeader) {
                lastClickedHeader.style.color = '';
              }

              // Scroll to the header using the unique selector
              scrollToHeader(heading.selector);

              // Set the current header as the last clicked header and change its color
              lastClickedHeader = this;
              lastClickedHeader.style.color = 'var(--hover-color)';
            });

            headingsUl.appendChild(li);
          });

          // Only append the box if there are subheadings
          if (subHeadings.length > 0) {
            // Wrap the list in a box
            const boxDiv = document.createElement('div');
            boxDiv.style.background = 'var(--secondary-bg)';
            boxDiv.style.border = '1.5px solid var(--border-color)';
            boxDiv.style.borderRadius = '8px';
            boxDiv.style.padding = '7px 7px 7px 7px';
            boxDiv.style.margin = '0 0 0 0';
            boxDiv.appendChild(headingsUl);
            tagsListDiv.appendChild(boxDiv);
          }
        }
      });
    });
  }

  requestHeadings();
});

// Function to scroll the webpage to the selected header using selector
function scrollToHeader(selector) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Add logging for debugging
    chrome.tabs.sendMessage(tabs[0].id, { action: 'scrollToHeader', selector: selector }, function(response) {
      if (chrome.runtime.lastError) {
        console.warn('Scout: Could not scroll to selector', selector, chrome.runtime.lastError);
      }
    });
  });
}

// Function to convert text to title case
function toTitleCase(text) {
  return text.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
