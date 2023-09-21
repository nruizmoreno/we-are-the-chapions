/* firebase config */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
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
const messagesListEl = document.getElementById("messages-list");

const likeCounter = document.getElementById("like-counter");

document.addEventListener("click", function (e) {
  if (e.target.id === "publish-btn") {
    handlePublishBtnClick();
  } else if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  }
});

function handlePublishBtnClick() {
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
}

function handleLikeClick(messageKey) {
  const targetMessageRef = ref(database, `messages-list/${messageKey}`);

  /*   const updatedLikes = targetMessageRef.likes + 1;
  update(targetMessageRef, { likes: updatedLikes }); */
}

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

    renderMessage(messagesArray);
  } else messagesListEl.innerHTML = `<p class="no-item">No items added...yet</p>`;
});

function clearMessagesListEl() {
  messagesListEl.innerHTML = "";
}

function renderMessage(messagesArray) {
  for (let i = 0; i < messagesArray.length; i++) {
    appendMessageToList(messagesArray[i][1], messagesArray[i][0]);
    /* Al escribir el [1] especifico que quiero el value del "key-value" de messagesArray, 
    en este caso es un objeto con toda la información de los input (messageObj). */
  }
}

function appendMessageToList(messageObj, messageKey) {
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
          <i class="fa-solid fa-heart" data-like="${messageKey}"></i>
          <h3 class="like-count">${messageObj.likes}</h3> 
        </div>
    </li>
    `;
  messagesListEl.innerHTML += newMsg;
}
