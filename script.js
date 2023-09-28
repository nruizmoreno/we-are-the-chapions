/* firebase config */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  get,
  set,
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
    push(ref(database, 'messages-list'), messageObject);

    function clearInputField() {
      messageInputEl.value = "";
      fromInputEl.value = "";
      toInputEl.value = "";
    }

    clearInputField();

    manageFeed(messageObject);
  } else alert("Fill in all the blanks, please!");
}

//Función onValue que es llamada cada vez que se crean cambios en la base de datos messagesInDB.
onValue(messagesInDB, function (snapshot) {
  if (snapshot.exists()) {
  let messageArray = Object.entries(snapshot.val());

  clearFeedEl();

  for (let [key, value] of messageArray) {
    manageFeed(value, key);
  }
  }});


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
          <i id="heart" class="fa-solid fa-heart" data-like="${currentMessageID}"></i>
          <h3 class="like-count">${messageObject.likes}</h3>
        </div>
    </li>
    `;
  feedEl.innerHTML += newMsg;
}

function handleLikeClick(currentMessageID) {
  const targetMessageRef = ref(database, "messages-list/" + currentMessageID);
  
  get(targetMessageRef).then(snapshot => {
    if (snapshot.exists()) {
      let messageData = snapshot.val();
      let newLikes = (messageData.likes || 0) + 1;
      set(targetMessageRef, {...messageData, likes: newLikes});
    }
  });
}

function clearFeedEl() {
  feedEl.innerHTML = "";
}
