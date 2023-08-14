import { AuthForm, UserInfoForm } from "./auth.js";
import { searchUser, chatsBlock, MyProfile } from "./app.js";

let menuSelect = 0;

export let userdata = {};

const firebaseConfig = {
    apiKey: "AIzaSyAODWI-DtG9Fgngf7HhBHvr6Kwt_9II6Xg",
    authDomain: "messanger-12487.firebaseapp.com",
    databaseURL: "https://messanger-12487-default-rtdb.firebaseio.com",
    projectId: "messanger-12487",
    storageBucket: "messanger-12487.appspot.com",
    messagingSenderId: "314077500135",
    appId: "1:314077500135:web:4d559c09b5dc88d9a2c842"
};
const app = firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var uid = user.uid;
    var phoneNumber = user.phoneNumber;
    var providerData = user.providerData;
    userdata = user;
    if(displayName == null){
      const root = document.getElementById('root');
      root.innerHTML = "";
      UserInfoForm(user);
    }else{
      
      App();
    }
  }else{
    const root = document.getElementById('root');
    root.innerHTML = "";
    AuthForm();
  }
});
export function App(){
  const root = document.getElementById('root');
  root.innerHTML = "";
  root.innerHTML = `
    <header class="topbar">
      <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
      <input placeholder="Search user" type="search" id="searchuser">
      <br>
      <span id="blocktitle"  style="width: 100%; font-size: 20px; margin-top: 5px;" >Chats<span>
    </header>
    <div style="padding-top: 85px" class="app">
      
    </div>
    <div class="bottombar">
      <label>
        <input value="0" name="value-radio" id="chatsbtn" type="radio" />
        <img src="img/icons/chats.png" width="48px" height="48px">
      </label>
      <label>
        <input value="1" name="value-radio" id="groupsbtn" type="radio" />
        <img src="img/icons/groups.png" width="48px" height="48px">
      </label>
      <label>
        <input value="2" name="value-radio" id="value-3" type="radio" />
        <img src="img/icons/chanels.png" width="48px" height="48px">
      </label>
      <label>
        <input value="3" name="value-radio" id="profilebtn" type="radio" />
        <img src="img/icons/profile.png" width="48px" height="48px">
      </label>
      <span class="selection"></span>
    </div>
  `;
  if(menuSelect == 0){
    chatsBlock();
  }else if(menuSelect == 3){
    MyProfile();
  }
  const bottombar = root.querySelector('.bottombar');
  const width = bottombar.offsetWidth;
  bottombar.style.setProperty('--container_width', width + "px");
  const radioButtons = document.querySelectorAll('input[name="value-radio"]');
  radioButtons[menuSelect].checked = true;
  bottombar.addEventListener("click", (event) => {
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        if(radioButton.value != menuSelect){
          menuSelect = radioButton.value;
           if(menuSelect == 0){
          chatsBlock();
          }else if(menuSelect == 3){
            MyProfile();
          }
        }   
        break;
      }
    }
  });
  
  const searchuser = document.getElementById('searchuser');
  searchuser.addEventListener("change", searchUser);
  window.scrollBy(0, 0);
}
