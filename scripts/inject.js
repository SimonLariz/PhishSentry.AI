// inject.js
var htmlContent = document.documentElement.outerHTML;

// Send the HTML back to the popup script via a message
chrome.runtime.sendMessage({ htmlContent });

// Clear the HTML content variable
htmlContent = '';
