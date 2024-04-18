
//gettingStarted button
const gettingStarted_button = document.getElementById('gettingStarted');

// Add a click event listener to the button
gettingStarted_button.addEventListener('click', function() {
  //Open a new tab with the getting started page
  chrome.tabs.create({ url: '../images/gettingstarted.svg' });
});

// parseEmail button
const parse_button = document.getElementById('parseEmail');

// Add a click event listener to the button 
parse_button.addEventListener('click', function() {
  //Log button pressed 
  console.log("Button pressed!");
  // Execute the inject script in the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
    if (activeTabs.length === 0) {
      console.error("No active tab found!");
      return;
    }
    console.log("Active tab found!");
    const activeTabId = activeTabs[0].id; 
    // Use the activeTabId for further processing (e.g., inject script)
    chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      files: ['scripts/inject.js']
    });
    console.log("Inject script executed!");
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

    // Send email content to the server
    sendEmailToServer(sender, subject, emailBody);
  }
  else {
    console.error("No HTML content received!");
  }
});

// Function to send email content to the server
function sendEmailToServer(sender, subject, emailBody) {
  var emailData = {
    from: sender,
    subject: subject,
    body: emailBody
  };
  var status = document.getElementById('response');
  var responseData = "";

  try {
    const data = {
      message: JSON.stringify(emailData)
    };

    fetch('https://localhost:4443/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
       else {
        throw new Error("Error, make sure the server is running!");
      }
    })
    .then(responseData => {
      var message = responseData.message;
      status.textContent = message;
    })
    .catch(error => {
      status.textContent = error.message;
    });
  } catch (error) {
    status.textContent = "Error, make sure the server is running!";
  }
}

// Get Post Request button
const post_request_button = document.getElementById('postRequest');

post_request_button.addEventListener('click', async function() {
  // Get raw email content
  var status = document.getElementById('response');
  var responseData = ""
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
      responseData = await response.json();
    } else {
      responseData = "Error, make sure the server is running!"
    }
  } catch (error) {
    responseData = "Error, make sure the server is running!"
  }
  status.textContent = responseData;
});