const { ipcRenderer } = require("electron");

let address = document.querySelector("#homeaddr");
let addrsubmit = document.querySelector("#addrsubmit");

let presentps = document.querySelector("#presentpassword");
let ps = document.querySelector("#ps");
let reps = document.querySelector("#re_ps");
let pssubmit = document.querySelector("#pssubmit");

class SetUserSettings {
    constructor() {

    }

    changeAddress() {
        ipcRenderer.send('addr', address.value);
        alert('주소가 변경되었습니다.');
        location.href = "main.html";
    }

    resetPassword() {
        let password;
        ipcRenderer.send('password');
        ipcRenderer.on('passwordis', (event, argument) => {
            password = argument;
            if (presentps.value == password) {
                if (ps.value == reps.value) {
                    alert('비밀번호가 변경되었습니다.');
                    ipcRenderer.send('resetpassword', presentps.value + " " + ps.value);
                }
                else {
                    alert('비밀번호와 재입력 비밀번호가 틀립니다.');
                }
            }
            else {
                alert('현재 비밀번호가 틀립니다.');
            }
        })
    }
}

addrsubmit.addEventListener("click", function () {
    new SetUserSettings().changeAddress();
})

pssubmit.addEventListener("click", function () {
    new SetUserSettings().resetPassword();
})