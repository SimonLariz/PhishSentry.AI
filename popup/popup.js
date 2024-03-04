// Getting the buttons is required to add event listeners to them

// Get the page URL button
const page_url_button = document.getElementById('getPageUrl');

// Add a click event listener to the button ( if the button is clicked, the current page URL will be logged)
page_url_button.addEventListener('click', function() {
  // Get the active tab and URL
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    var pageUrl = document.getElementById('pageUrl');
    // Update the status with the received URL
    pageUrl.textContent = activeTab.url;
  });
});

// Get HTML button
const html_button = document.getElementById('getHTML');

// Add a click event listener to the button ( if the button is clicked, the current page HTML will be logged and saved to a file)
html_button.addEventListener('click', function() {
  // Execute the inject script in the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
    if (activeTabs.length === 0) {
      console.error("No active tab found!");
      return;
    }
    const activeTabId = activeTabs[0].id; 
    // Use the activeTabId for further processing (e.g., inject script)
    chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      files: ['scripts/inject.js']
    });
  });
});

// Add a listener for the message from the inject script (scripts/inject.js, sending the HTML content back to the popup script)
chrome.runtime.onMessage.addListener((message) => {
  if (message.htmlContent) {
    // Update the status with the received HTML (partially truncated)
    var pageHTML = document.getElementById('pageHTML');
    pageHTML.textContent = message.htmlContent.slice(0, 100) + '...'; 
    // Prompt the user to save the HTML content to a file 
   //  (mostly for testing to see if all HTML content is received correctly)
    var blob = new Blob([message.htmlContent], { type: "text/html" });
    saveAs(blob, "page.html");
  }
});

// Function to save the HTML content to a file
function saveAs(blob, filename) {
  chrome.downloads.download({
    url: URL.createObjectURL(blob),
    filename: filename,
    saveAs: true // Prompt the user to save the file
  });
}