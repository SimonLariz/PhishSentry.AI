
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
const parse_button = document.getElementById('parseEmail');

// Add a click event listener to the button ( if the button is clicked, the current page HTML will be logged and saved to a file)
parse_button.addEventListener('click', function() {
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
    // Create DOM Parser
    var parser = new DOMParser();
    const doc = parser.parseFromString(message.htmlContent, 'text/html');

    // Extract the sender
    const senderRow = Array.from(doc.querySelectorAll('tr'))
      .find(row => Array.from(row.querySelectorAll('th')).some(th => th.textContent.includes('From:')));
    const senderElement = senderRow ? senderRow.querySelector('td') : null;
    const sender = senderElement ? senderElement.textContent.trim() : '';

    // Extract the subject
    const subjectRow = Array.from(doc.querySelectorAll('tr'))
      .find(row => Array.from(row.querySelectorAll('th')).some(th => th.textContent.includes('Subject:')));
    const subjectElement = subjectRow ? subjectRow.querySelector('td') : null;
    const subject = subjectElement ? subjectElement.textContent.trim() : '';
    
    // Extract email body 
    const preElement = doc.querySelector('pre.raw_message_text');
    const emailBody = preElement ? preElement.textContent : '';

    // Prompt user to save the sender, subject, and email body to a file
    var blob = new Blob([`From: ${sender}\n\nSubject: ${subject}\n\nEmail Body: ${emailBody}`], { type: "text/plain" });
    saveAs(blob, "email.txt");

  }
  else {
    console.error("No HTML content received!");
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

// Get Post Request button
const post_request_button = document.getElementById('postRequest');

post_request_button.addEventListener('click', async function() {
  try {
    const data = {
      //Fill in the data to be sent
      message: 'Hello from the popup!',
    };
    const formattedData = new URLSearchParams(data).toString();

    const response = await fetch('https://localhost:4443/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formattedData,
    });

    // Handle the response
    if (response.ok) {
      const responseData = await response.json();
      console.log('Response:', responseData);
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});