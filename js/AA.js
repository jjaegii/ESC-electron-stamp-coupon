const { ipcRenderer } = require('electron');

let 김치찌개 = document.querySelector("#kimchi");
let 김치count = 0;
let 된장찌개 = document.querySelector("#doenjang");
let 된장count = 0;
let 두부김치 = document.querySelector("#tofu");
let 두부count = 0;
let 제육볶음 = document.querySelector("#je6");
let 제육count = 0;

let 김치 = document.querySelector("#김치");
let 된장 = document.querySelector("#된장");
let 두부 = document.querySelector("#두부");
let 제육 = document.querySelector("#제육");

let coupon = document.querySelector("#coupon");
let user = "";
let usercoupon = "";
let order = document.querySelector("#order");
let useCoupon = document.querySelector("#couponcheck");
let checkbox = document.querySelector("#checkbox");
let stamp;

class UseStampCoupon {
    isUsable;

    constructor(usercoupon) {
        if(parseInt(usercoupon) >= 3) {
            this.isStampUsable(true);
            useCoupon.checked = true;
        }
        else {
            this.isStampUsable(false);
            checkbox.remove();
        }
    }

    isStampUsable(bool) {
        this.isUsable = bool;
    }

    useStamp() {
        if(useCoupon.checked == true && this.isUsable == true) {
            return true;
        }
        else {
            return false;
        }
    }
}

ipcRenderer.send('user');
ipcRenderer.on('username', (event, argument) => {
    user = argument;
    coupon.innerHTML = user + "님의 사용가능 Coupon : ";
    ipcRenderer.send('coupon', user);
    ipcRenderer.on('usercoupon', (event, argument) => {
        usercoupon = argument;
        coupon.innerHTML += usercoupon + "개"
        stamp = new UseStampCoupon(usercoupon);
    })
})


김치찌개.addEventListener('click', function () {
    김치.innerHTML = "김치찌개 " + (++김치count);
})

된장찌개.addEventListener('click', function () {
    된장.innerHTML = "된장찌개 " + (++된장count);
})

두부김치.addEventListener('click', function () {
    두부.innerHTML = "두부김치 " + (++두부count);
})

제육볶음.addEventListener('click', function () {
    제육.innerHTML = "제육볶음 " + (++제육count);
})

order.addEventListener('click', function() {
    let order = [ 
        김치.innerHTML.split(" ")[1],
        된장.innerHTML.split(" ")[1],
        두부.innerHTML.split(" ")[1],
        제육.innerHTML.split(" ")[1],
        stamp.useStamp(),
        usercoupon,
    ]
    ipcRenderer.send('order', order);
    location.href = "couponstatus.html";
})