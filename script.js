/* firebase config */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://we-are-the-champions-d65ad-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const messagesInDB = ref(database, "messages-list");

/* get elements */
const messagesInputFieldEl = document.getElementById("message-input-field");
const fromInputEl = document.getElementById("from");
const toInputEl = document.getElementById("to");
const pusblishBtnEl = document.getElementById("publish-btn");
const messagesListEl = document.getElementById("messages-list");
const likeButton = document.getElementById("fa-heart");
const likeCounter = document.getElementById("like-counter");

/* function that pushes inputs to database and clears input function */
pusblishBtnEl.addEventListener("click", function () {
  if (fromInputEl.value && messagesInputFieldEl.value && toInputEl.value) {
    const messageObject = {
      from: fromInputEl.value,
      message: messagesInputFieldEl.value,
      to: toInputEl.value,
      isLiked: false,
      likes: 0,
    };
    push(messagesInDB, messageObject);
  } else alert("Please enter all fields!");

  clearInputField();
});

function clearInputField() {
  messagesInputFieldEl.value = "";
  fromInputEl.value = "";
  toInputEl.value = "";
}

/* onValue function */
onValue(messagesInDB, function (snapshot) {
  if (snapshot.exists()) {
    let messagesArray = Object.entries(snapshot.val());

    clearMessagesListEl();

    printMessage(messagesArray);
  } else messagesListEl.innerHTML = `<p class="no-item">No items added...yet</p>`;
});

function clearMessagesListEl() {
  messagesListEl.innerHTML = "";
}

function printMessage(messagesArray) {
  for (let i = 0; i < messagesArray.length; i++) {
    appendMessageToList(messagesArray[i][1]);
  }
}

function appendMessageToList(messageObj) {
  let newMsg = `
    <li>
        <div>
            <h3><span>From</span> ${messageObj.from}</h3>
            
        </div>
        <p>${messageObj.message}</p>
        <div>
            <h3><span>To</span> ${messageObj.to}</h3>
        </div>
        <div class="like-div">
          <i class="fa-solid fa-heart" ></i>
          <h3 class="like-count">0</h3> 
        </div>
    </li>
    `;
  messagesListEl.innerHTML += newMsg;

  /*   //remove item code
  let messageId = messageObj[0];
  let messageValue = messageObj[1]

  let newEl = document.createElement("li");
  newEl.textContent = messageValue;
  messagesListEl.append(newEl);

  newEl.addEventListener("dblclick", function () {
    let locationOfMessagesInDB = ref(database, `messages-list/${messageId}`);
    remove(locationOfMessagesInDB);
  }); */
}
