console.log(window.firebase);  // Add this line

function checkPassword() {
  const pw1 = document.getElementById("password1").value;
  const pw2 = document.getElementById("passwordInput").value;

  const correct1 = "0730"; // 🔒 Replace with your real password
  const correct2 = "98632147";

  if (pw1 === correct1 && pw2 === correct2) {
    document.getElementById("passwordScreen").style.display = "none";
    document.getElementById("chatUI").style.display = "block"; // 👈 Make sure your chat container has this ID
    console.log("Passwords are correct. Chat UI is now visible.");
  } else {
    alert("Incorrect password(s). Try again.");
  }
}


// Request notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
}

// Function to show browser notifications
function showNotification(message) {
  if (Notification.permission === "granted") {
    const name = message.name || "誰か";
    const text = message.text || "";

    new Notification("新しいブツが送信された", {
      body: `${name}: ${text}`,
      icon: "chat-icon.png", // Optional 
    });
  }
}


showNotification("Test message: This is a test notification!");


  // Replaced this with part with config from Firebase conslole

  const firebaseConfig = {
    apiKey: "AIzaSyAX6UWci9AIPCix3CR5146RPNK_8LL0rCM",
    authDomain: "chat-app-d54ef.firebaseapp.com",
    projectId: "chat-app-d54ef",
    storageBucket: "chat-app-d54ef.firebasestorage.app",
    messagingSenderId: "328677677789",
    appId: "1:328677677789:web:9ba84b7e33441a082c1934"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const messagesRef = db.collection("messages");

// Send a message
function sendMessage() {
  const name = document.getElementById("name").value;
  const text = document.getElementById("message").value;
  if (name && text) {
    messagesRef.add({
      name: name,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById("message").value = "";
  }
}

// Function to convert URLs in text to clickable links
function linkify(text) {
  const urlPattern = /(\bhttps?:\/\/[^\s<]+)/gi;
  return text.replace(urlPattern, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
}

// Listen for new messages
let knownMessageIds = new Set(); // To keep track of known message IDs
messagesRef.orderBy("timestamp").onSnapshot(snapshot => {
  const messagesDiv = document.getElementById("messages");

  snapshot.forEach(doc => {
    const msg = doc.data();
    const id = doc.id;

    if (!knownMessageIds.has(id)) {
      // Use linkify to convert URLs to links
      const safeText = linkify(msg.text);
      messagesDiv.innerHTML += `<p><strong>${msg.name}:</strong> ${safeText}</p>`;

      // Show notification only for new messages
      if (!document.hasFocus()) { // Optional: only notify if tab is not focused
        showNotification(msg);
      }
      knownMessageIds.add(id);
    }
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});


// Add event listener to the password input field to send message on Enter key press
  const passwordInput = document.getElementById("passwordInput");
  const checkPasswordButton = document.getElementById("checkPassword");
  // Add event listener for the Enter key on the password input
  passwordInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if inside a form
      checkPasswordButton.click(); // Trigger the button click
    }
  });

// Add event listener to the message input field to send message on Enter key press
const input = document.getElementById("message");
  const sendButton = document.getElementById("sendButton");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if inside a form
      sendButton.click();
    }
  }
);


// Button to toggle chat UI visibility
let chatHidden = false;
let websiteOpened = false;

const toggleButton = document.getElementById("toggleChat");
const passwordScreen = document.getElementById("passwordScreen"); // 👈 Your target element
const websiteToOpen = "https://classroom.google.com";

toggleButton.addEventListener("click", () => {
  chatHidden = !chatHidden;

  if (chatHidden) {
    // First click: hide everything but the button, open website
    for (const child of document.body.children) {
      if (child !== toggleButton) {
        child.style.display = "none";
      }
    }

    document.body.style.background = "white";

    window.open(websiteToOpen, "_blank");

  } else {
    // Second click: show only the password screen
    for (const child of document.body.children) {
      if (child !== toggleButton && child !== passwordScreen) {
        child.style.display = "none";
      } else if (child === passwordScreen) {
        child.style.display = "";
      }
    }

    document.body.style.background = "";
  }
});
