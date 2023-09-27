/* firebase config */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const appSettings = {
  databaseURL:
    "https://we-are-the-champions-d65ad-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const messagesInDB = ref(database, "messages-list");
const feedEl = document.getElementById("feed");

// event listeners con target.dataset según boton click..falta el evento con dbl click para "remove".
document.addEventListener("click", function (e) {
  if (e.target.id === "publish-btn") {
    handlePublishButtonClick();
  } else if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  }
});

function handlePublishButtonClick() {
  const messageInputEl = document.getElementById("message-input-el");
  const fromInputEl = document.getElementById("from");
  const toInputEl = document.getElementById("to");

  //creo objeto de mensaje
  if (messageInputEl.value && fromInputEl.value && toInputEl.value) {
    let messageObject = {
      messageText: messageInputEl.value,
      from: fromInputEl.value,
      to: toInputEl.value,
      likes: 0,
      isLiked: false,
      uuid: uuidv4(),
    };

    //agrego el mensaje objeto a la base de datos "messagesInDB"
    push(messagesInDB, messageObject);
    function clearInputField() {
      messageInputEl.value = "";
      fromInputEl.value = "";
      toInputEl.value = "";
    }

    clearInputField();
  } else alert("Fill in all the blanks, please!");
}

//Función onValue que es llamada cada vez que se crean cambios en la base de datos messagesInDB.
onValue(messagesInDB, function (snapshot) {
  let messageArray = Object.entries(snapshot.val());

  clearFeedEl();

  for (let i = 0; i < messageArray.length; i++) {
    let currentMessage = messageArray[i];
    let currentMessageID = messageArray[0];
    manageFeed(currentMessage[1], currentMessageID);
  }
});

function manageFeed(messageObject, currentMessageID) {
  let newMsg = `
    <li class="message-style">
        <div>
            <h3><span>From</span> ${messageObject.from}</h3>
            
        </div>
        <p>${messageObject.messageText}</p>
        <div>
            <h3><span>To</span> ${messageObject.to}</h3>
        </div>
        <div class="like-div">
          <i id="heart${currentMessageID}" class="fa-solid fa-heart"></i>
          <h3 class="like-count">${messageObject.likes}</h3>
        </div>
    </li>
    `;
  feedEl.innerHTML += newMsg;
}

function handleLikeClick(currentMessageID) {
  console.log(currentMessageID);
}

function clearFeedEl() {
  feedEl.innerHTML = "";
}

/* function appendItemToCommentList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");
  newEl.innerHTML = `
    <p class="custom-text"> To ${itemValue.recipient}</p>
    ${itemValue.comment}
    <p class="custom-text2">
      From ${itemValue.sender} 
      <span class="likeEmoji" data-commentid="${itemValue.commentID}">
        ❤️
        <span class="likeCountEmoji" id="likeCount${itemValue.commentID}">
        0
        </span>
      </span> 
    </p>
    `;

  listEL.append(newEl);
} */
