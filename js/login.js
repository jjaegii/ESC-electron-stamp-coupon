const { ipcRenderer } = require('electron');

let id = document.querySelector("#id");
let ps = document.querySelector("#ps");
let login = document.querySelector("#login");
let signup = document.querySelector("#signUp");
let exit = document.querySelector("#exit");

class Login {
    constructor(ID, PS) {
        this.login(ID, PS);
    }

    login(ID, PS) {
        let user = ID + " " + PS;
        ipcRenderer.send('login', user);
    }
}

login.addEventListener("click", function() {
    new Login(id.value, ps.value);
})

signup.addEventListener("click", function() {
    location.href = "signup.html"
})

exit.addEventListener("click", function() {
    window.close();
})