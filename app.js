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
messagesRef.orderBy("timestamp").onSnapshot(snapshot => {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";
  snapshot.forEach(doc => {
    const msg = doc.data();
    messagesDiv.innerHTML += `<p><strong>${msg.name}:</strong> ${msg.text}</p>`;
  });
});
