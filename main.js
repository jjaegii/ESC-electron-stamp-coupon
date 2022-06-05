const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const lineReader = require('line-reader')
const fs = require('fs')
var user = "";

ipcMain.on('signup', (event, argument) => {
  fs.writeFile('./users.txt', "\n" + argument, { flag: 'a+' }, err => {
    if (err) {
      console.error(err);
      return;
    }
  })
  fs.writeFile('./coupon.txt', "\n" + argument.split(" ")[0] + " 0", { flag: 'a+' }, err => {
    if (err) {
      console.error(err);
      return;
    }
  })
  dialog.showMessageBox(null, { type: 'info', title: '회원가입 성공', message: '회원가입 완료.' });
  event.sender.send('signupok');
})

ipcMain.on('login', (event, argument) => {
  let flag = 0;
  lineReader.eachLine('./users.txt', (line, last) => {
    if (line == argument) {
      flag = 1;
      user = argument.split(" ")[0];
      event.sender.send('loginok');
    }
  })
  setTimeout(function() {
    if (flag == 0) {
      dialog.showMessageBox(null, { type: 'info', title: '로그인 실패', message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }
  }, 100);
})

ipcMain.on('user', (event, argument) => {
  event.sender.send('username', user);
})

ipcMain.on('coupon', (event, argument) => {
  lineReader.eachLine('./coupon.txt', (line, last) => {
    if (line.split(" ")[0] == argument) {
      event.sender.send('usercoupon', line.split(" ")[1]);
    }
  })
})

ipcMain.on('addr', (event, argument) => {
  fs.writeFile('./address.txt', "\n" + user + " " + argument, { flag: 'a+' }, err => {
    if (err) {
      console.error(err);
      return;
    }
  })
})

ipcMain.on('password', (event, argument) => {
  lineReader.eachLine('./users.txt', (line, last) => {
    if (line.split(" ")[0] == user) {
      event.sender.send('passwordis', line.split(" ")[1]);
    }
  })
})

ipcMain.on('resetpassword', (event, argument) => {
  fs.readFile('./users.txt', 'utf8', (err, data) => {
    if (err) throw err;
    let txt = data.replace(user + " " + argument.split(" ")[0], user + " " + argument.split(" ")[1]);
    fs.writeFile('./users.txt', txt, err => {
      if (err) {
        console.error(err);
        return;
      }
    })
  })
})

ipcMain.on('order', (event, argument) => {
  if (argument[4] == false) { // 쿠폰 미사용
    fs.readFile('./coupon.txt', 'utf8', (err, data) => {
      if (err) throw err;
      let txt = data.replace(user + " " + argument[5], user + " " + (parseInt(argument[5]) + 1));
      fs.writeFile('./coupon.txt', txt, err => {
        if (err) {
          console.error(err);
          return;
        }
      })
    })
    dialog.showMessageBox(null, { type: 'info', title: '주문 완료', message: '쿠폰 스탬프가 적립되었습니다! 40분 내 도착 예정입니다.' });
  }
  else if (argument[4] == true) { // 쿠폰 사용
    fs.readFile('./coupon.txt', 'utf8', (err, data) => {
      if (err) throw err;
      let txt = data.replace(user + " " + argument[5], user + " " + 0);
      fs.writeFile('./coupon.txt', txt, err => {
        if (err) {
          console.error(err);
          return;
        }
      })
    })
    dialog.showMessageBox(null, { type: 'info', title: '주문 완료', message: '쿠폰 사용 완료! 40분 내 도착 예정입니다.' });
  }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 720,
    height: 810,
    icon: 'img/logo.png',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, '/'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('login.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})