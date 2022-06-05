const { ipcRenderer } = require('electron');

let signupbtn = document.querySelector("#signup");
let id = document.querySelector("#id");
let ps = document.querySelector("#password");
let reps = document.querySelector("#repassword");

class SignUp {
    constructor(ID, PS, REPS) {
        if (this.checkId(ID) == true && this.checkPassword(PS, REPS) == true) {
            this.signup(ID, PS);
        }
    }

    checkId(ID) {
        let regExp = /^[a-z]+[a-z0-9]{5,19}$/g;
        if (regExp.test(ID) == false) {
            alert('아이디는 영문자로 시작하는 영문자 또는 숫자 6~20자 입니다.')
        }
        else {
            return true;
        }
    }

    checkPassword(PS, REPS) {
        let regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/;
        if (PS != REPS) {
            alert('비밀번호와 재입력이 일치하지 않습니다.');
            return false;
        }
        else if (regExp.test(PS) == false) {
            alert('비밀번호는 8~16자 영문, 숫자 조합 입니다.')
        }
        else {
            return true;
        }
    }

    signup(ID, PS) {
        let user = ID + " " + PS;
        ipcRenderer.send('signup', user);
        ipcRenderer.on('signupok', (event, argument) => {
            location.href = "login.html";
        })
    }
}

signupbtn.addEventListener('click', function () {
    new SignUp(id.value, ps.value, reps.value);
})