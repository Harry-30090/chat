console.log(window.firebase);  // Add this line

// 🔐 Simple password protection
const correctPassword = "0730"; // <-- change this to your real password

function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  const error = document.getElementById("passwordError");
  
  if (input === correctPassword) {
    document.getElementById("passwordScreen").style.display = "none";
    document.getElementById("chatUI").style.display = "block";
  } else {
    error.textContent = "Incorrect password. Try again.";
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

// Listen for new messages
let knownMessageIds = new Set(); // To keep track of known message IDs
messagesRef.orderBy("timestamp").onSnapshot(snapshot => {
  const messagesDiv = document.getElementById("messages");

  snapshot.forEach(doc => {
    const msg = doc.data();
    const id = doc.id;

    if (!knownMessageIds.has(id)) {
    messagesDiv.innerHTML += `<p><strong>${msg.name}:</strong> ${msg.text}</p>`;

    // Show notification only for new messages
    if (!document.hasFocus()) { // Optional: only notify if tab is not focused
      showNotification(msg);
    }
    knownMessageIds.add(id);
    }
  });
  
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
