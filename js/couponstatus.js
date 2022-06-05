const { ipcRenderer } = require("electron");

let coupon = document.querySelector("#AA");

ipcRenderer.send('user');
ipcRenderer.on('username', (event,argument) => {
    let user = argument;
    ipcRenderer.send('coupon', user);
    ipcRenderer.on('usercoupon', (event,argument) => {
        let usercoupon = argument;
        for(let i = 0; i < parseInt(usercoupon); i++) {
            let img = document.createElement("img");
            img.className = "image";
            img.src = "img/stamp.jpg"
            coupon.appendChild(img);
        }
        for(let i = 0; i < 7 - parseInt(usercoupon); i++) {
            let img = document.createElement("img");
            img.className = "image";
            img.src = "img/nostamp.jpg"
            coupon.appendChild(img);
        }
    })
})