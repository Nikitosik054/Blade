import { App } from "./index.js";

export function AuthForm(){
  const authdiv = document.querySelector('.auth-div');
  authdiv.style.display = "block";
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-div');
  recaptchaVerifier.render();
  
  const form = document.getElementById('auth-form');
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = event.target.querySelector('#phone').value;
    Auth(phone);
  });
  
  const verifyform = document.getElementById('verify-form');
  verifyform.addEventListener("submit", (event) =>{
    event.preventDefault();
    const code = event.target.querySelector('#code').value;
    Verify(code);
  });
}

export function UserInfoForm(user){
  const userinfoformdiv = document.querySelector('.UserInfoForm-div');
  userinfoformdiv.style.display = "block";
  
  const userinfoformform = document.getElementById('UserInfoForm-form');
  userinfoformform.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = event.target.querySelector('#name').value;
    UpdateName(user, username);
  });
}

function Auth(phone){
  firebase.auth().signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      const form = document.getElementById('auth-form');
      form.style.display = "none";
      const verifyform = document.getElementById('verify-form');
      verifyform.style.display = "flex";
    }).catch((error) => {
      console.log("Auth:", error);
    });
}
function Verify(code){
  window.confirmationResult.confirm(code).then((result) => {
    const user = result.user;
    const authdiv = document.querySelector('.auth-div');
    authdiv.remove();
  }).catch((error) => {
    console.log("Verify: ", error);
  });
}
function UpdateName(user, name){
  user.updateProfile({
    displayName: name,
    photoURL: "img/profile.png"
  }).then(function() {
    const userinfoformdiv = document.querySelector('.UserInfoForm-div');
    userinfoformdiv.remove();
    var displayName = user.displayName;
    var photoURL = user.photoURL;
    firebase.database().ref(`users/${user.uid}`).set({name: name, photoURL: "img/profile.png", uid: user.uid });
    App();
  }, function(error) {
    console.log("UpdateName:", error );
  });

}