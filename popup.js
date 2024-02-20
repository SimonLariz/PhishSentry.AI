// Get the page URL button
const page_url_button = document.getElementById('getPageUrl');

// Add a click event listener to the button
page_url_button.addEventListener('click', function() {
  // Log the current page URL
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];

    // Update status to current URL
    var pageUrl = document.getElementById('pageUrl');
    pageUrl.textContent = activeTab.url;
  });
});

// Get HTML button
const html_button = document.getElementById('getHTML');

// Add a click event listener to the button
html_button.addEventListener('click', function() {
  // Get the current page HTML
  // DOESNT WORK!!!!!
});