import { App, userdata } from "./index.js";

export function searchUser(event){
  if(event.target.value == ""){
    const app = document.querySelector('.app');
    app.innerHTML = '';
    App();
  }else {
    const app = document.querySelector('.app');
    app.innerHTML = `
      <div class="loading-wave">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
    `;
    const name = event.target.value;
    firebase.database().ref("users").orderByKey().once("value")
    .then(function(snapshot) {
      app.innerHTML = '';
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val().name.startsWith(name)){
          app.insertAdjacentHTML('beforeend', `
            <div userdata='${JSON.stringify(childSnapshot.val())}' class="userprofile" >
               <div style="margin-left: 50px; display: inline-block;">
                  <img src="${childSnapshot.val().photoURL}" alt="user" width="64px" height="64px">
                  <span>Username: ${childSnapshot.val().name}</span>
               </div>
            </div>
            <br>
          `);
        }
      });
      const userprofilebtns = document.querySelectorAll('.userprofile');
      for(let userbtn of userprofilebtns){
        userbtn.addEventListener("click", (event) => {
          app.innerHTML = `
            <div class="loading-wave">
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
            </div>
          `;
          UserProfile(JSON.parse(userbtn.getAttribute('userdata')));
        });
      }
    });
  }
}

export function UserProfile(data){
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="userinfo" >
          <div class="topbar">
            <button class="backbtn" >
              <img src="img/icons/back.png" width="32px" height="32px">
            </button>
          </div>
          <div style="padding-top: 50px; class="userprofile" >
             <div style="margin-left: 20px;">
                <div style="margin-bottom: 20px; display: inline-block;" >
                  <img src="${data.photoURL}" alt="user" width="64px" height="64px">
                  <span>${data.name}</span>
                </div>
                <br>
                <button class="openchat" >
                  <span class="span-mother">
                      <span>C</span>
                      <span>h</span>
                      <span>a</span>
                      <span>t</span>
                  </span>
                  <span class="span-mother2">
                      <span>C</span>
                      <span>h</span>
                      <span>a</span>
                      <span>t</span>
                  </span>
                </button>
             </div>
             <br>
             <hr>
             <br>
             <div class="userwall">
             
             </div>
          </div>
        </div>
  `;
  const backbtn = root.querySelector('.backbtn');
  backbtn.addEventListener("click", () => App());
  const openchatbtn = root.querySelector('.openchat');
  openchatbtn.addEventListener("click", () => {
    firebase.database().ref(`userchats/${userdata.uid}`).orderByKey().once("value")
    .then(function(snapshot) {
      if(snapshot.val() != null){
        let haveChat = false;
        let dataSnapshot;
        snapshot.forEach(function(childSnapshot) {
          if(childSnapshot.val().target == data.uid){
            haveChat = true;
            dataSnapshot = childSnapshot.val();
          }
        });
        if(haveChat){
          Chat(dataSnapshot);
        }else{
          let chatId = 0;
          const newChat = firebase.database().ref("chats").push({type: "chat", messages: null });
          chatId = newChat.key;
          const mychat = {
            target: data.uid,
            targetName: data.name,
            targetPhoto: data.photoURL,
            chatId: chatId
          }
          const herchat = {
            target: userdata.uid,
            targetName: userdata.displayName,
            targetPhoto: userdata.photoURL,
            chatId: chatId
          }
          firebase.database().ref(`userchats/${userdata.uid}`).push().set(mychat);
          if(data.uid != userdata.uid){
            firebase.database().ref(`userchats/${data.uid}`).push().set(herchat);
          }
          Chat(mychat);
        }
      }else{
        let chatId = 0;
        const newChat = firebase.database().ref("chats").push({type: "chat", messages: null });
        chatId = newChat.key;
        const mychat = {
          target: data.uid,
          targetName: data.name,
          targetPhoto: data.photoURL,
          chatId: chatId
        }
        const herchat = {
          target: userdata.uid,
          targetName: userdata.displayName,
          targetPhoto: userdata.photoURL,
          chatId: chatId
        }
        firebase.database().ref(`userchats/${userdata.uid}`).push().set(mychat);
        if(data.uid != userdata.uid){
          firebase.database().ref(`userchats/${data.uid}`).push().set(herchat);
        }
        Chat(mychat);
      }
    });
  });
}

export function chatsBlock(){
  const app = document.querySelector('.app');
  app.innerHTML = `
      <div class="loading-wave">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
  `;
  firebase.database().ref(`userchats/${userdata.uid}`).orderByKey().once("value")
  .then(function(snapshot) {
    app.innerHTML = '';
    if(snapshot.val() != null){
      snapshot.forEach(function(childSnapshot) {
        app.insertAdjacentHTML('beforeend', `
          <hr>
          <div style="display: flex; vertical-align: middle;"  id="chatopenbtn" userdata='${JSON.stringify(childSnapshot.val())}'>
            <img src="${childSnapshot.val().targetPhoto}" width="64px" height="64px" >
            <div style="display: block;" >
              <span style="height: 100%; vertical-align: middle;" >${childSnapshot.val().targetName}</span>
              <br>
              <span style="opacity: .3;" >Message...</span>
            </div>
          </div>
          <hr>
        `);
        window.scrollBy(0, 0);
      });
      const chatopenbtns = document.querySelectorAll('#chatopenbtn');
      for(let chatopenbtn of chatopenbtns){
        chatopenbtn.addEventListener("click", () => {
          const data = JSON.parse(chatopenbtn.getAttribute('userdata'));
          Chat(data);
        });
      }
    }else{
      app.innerHTML = `<h4 style="margin-left: 20px;" >No chats found</h4>`
    }
  });
  
}

export function Chat(data){
  const root = document.getElementById('root');
  root.innerHTML = `
    <div id="chat" >
      <div style="display: flex;"  class="topbar">
        <button class="backbtn" >
          <img src="img/icons/back.png" width="32px" height="32px">
        </button>
        <span>${data.targetName}</span>
        <img src="${data.targetPhoto}" alt="${data.targetName}" width="48px" height="48px">
      </div>
      <div style="margin-top: 60px; margin-bottom: 50px;"  id="listmessage" >
        
      </div>
      <div style="display: inline-block;"  class="bottoinput" >
        <div class="message-input-div">
          <input id="messageinput" placeholder="Hello..." type="text">
          <button id="sendmessage">
            <img src="img/icons/sendmessage.png"  width="24px" height="24px">
          </button>
        </div>
      </div>
    </div>
  `;
  const listmessage = document.getElementById('listmessage');
  firebase.database().ref(`chats/${data.chatId}/messages`).on("child_added", (snapshot) => {
    if(snapshot.val().sender == userdata.displayName){
      listmessage.insertAdjacentHTML("beforeend", `
        <div class="mymessage">
          <p style="word-break: break-all; word-wrap: break-word;" >${snapshot.val().text}</p>
        </div>
        <div style="clear: both;" ></div>
        <br>
      `);
    }else{
      listmessage.insertAdjacentHTML("beforeend", `
        <div class="hermessage">
          <p style="word-break: break-all; word-wrap: break-word;">${snapshot.val().text}</p>
        </div>
        <br>
      `);
    }
    const chat = document.querySelector('#chat');
    chat.scrollIntoView({block: "end", behavior: "auto"});
  });
  const sendmessagebtn = document.getElementById('sendmessage');
  sendmessagebtn.addEventListener("click", () => {
    const messageinput = document.getElementById('messageinput');
    const message = messageinput.value;
    messageinput.value = "";
    firebase.database().ref(`chats/${data.chatId}/messages`).push().set({sender: userdata.displayName, text: message});
  });
  const backbtn = document.querySelector('.backbtn');
  backbtn.addEventListener("click", () => {
    App();
  });
  
}


export function MyProfile(){
  const app = document.querySelector('.app');
  const blocktitle = document.getElementById('blocktitle');
  blocktitle.innerHTML = "Profile";
  app.innerHTML = `
    <div class="userinfo" >
      <div class="userprofile" >
        <button id="settingsbtn"><img src="img/icons/settings.png" width="35px" height="35px"></button>
        <div style="">
          <div style="background: #959595; width: 100%; height: 150px; position: relative;" >
            <div style="text-align: center; align-items: center; display: block; position: absolute; bottom: -35%; width: 100%;" >
              <img src="${userdata.photoURL}" alt="user" width="80px" height="80px">
              <br>
              <span style="font-size: 24px;" >${userdata.displayName}</span>
            </div>
          </div>
        </div>
        <div style="margin-top: 50px; class="userwall">
             
        </div>
      </div>
    </div>
  `;
  document.getElementById('settingsbtn').onclick = () => {
    Settings();
  }
}

export function Settings(){
  const root = document.getElementById('root');
  root.innerHTML = `
    <div id="settings" >
      <div style="display: flex;"  class="topbar">
        <button class="backbtn" >
          <img src="img/icons/back.png" width="32px" height="32px">
        </button>
      </div>
      <div style="margin-top: 60px;"  id="settingssections" >
        <div style="vertical-align: center"  id="logoutbtn" >
          <img src="img/icons/logout.png" width="32px" height="32px">
          <span style="font-size: 32px; color: #FF0000">Log out</span>
        </div>
      </div>
    </div>
  `;
  const backbtn = document.querySelector('.backbtn');
  backbtn.addEventListener("click", () => {
    App();
  });
  document.getElementById('logoutbtn').onclick = () => {
    firebase.auth().signOut();
  }
}
