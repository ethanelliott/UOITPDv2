console.time("init")
const PROD = false
const DATABASE_TABLES = [
  'courses',
  'todo',
  'schedule',
  'details',
  'notes',
  'projects',
  'settings',
  'user'
]

const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = require('electron');
const request = require('request-ssl');
const cheerio = require('cheerio');
const crypto = require('crypto');
const moment = require('moment');
const windowStateKeeper = require("electron-window-state");
//Setup local storage paths and such
const path = require('path');
const url = require('url');
const homedir = require('os').homedir();
const fs = require('fs');
const store_dir = path.join(homedir, 'uoitpd');
const db_dir = path.join(homedir, 'uoitpd', 'db');
if (!fs.existsSync(store_dir)) {
  fs.mkdirSync(store_dir);
}
if (!fs.existsSync(db_dir)) {
  fs.mkdirSync(db_dir);
}

let db = require('diskdb')
db = db.connect(db_dir, DATABASE_TABLES)

const config = {
  url: (PROD ? `file://${process.cwd()}/dist/index.html` : 'http://localhost:8080/')
};

let win;

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 795,
  });

  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    },
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 795,
    minWidth: 970,
    frame: false,
    transparent: false,
    show: false,
    backgroundColor: "#d2d2d2"
  });
  win.loadURL(config.url);

  win.once("ready-to-show", () => {
    console.timeEnd("init")
    win.show();
    win.focus();
  });

  win.on('closed', () => {
    win = null;
  });

  mainWindowState.manage(win)
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    try {
      createWindow();
    } catch (e) {
      alert(e)
    }
  }
});

//All IPC comm 
ipcMain.on('check-login', (event, arg) => {
  if (db.user.find().length == 0) {
    console.log('not logged in')
    event.sender.send('not-logged-in')
  }
})

ipcMain.on('user-login', (event, arg) => {
  getDataFromMycampus(arg)
  setTimeout(() => {
    event.sender.send('login-success')
  }, 1000)
})

ipcMain.on('get-courses', (event, arg) => {
  event.sender.send('give-courses', (db.courses.find().length > 0 ? db.courses.find() : []))
})

ipcMain.on('get-name', (event, arg) => {
  event.sender.send('give-name', (db.user.find()[0] ? db.user.find()[0].name : ""))
})

ipcMain.on('get-calendar', (event, arg) => {
  event.sender.send('give-calendar', (db.schedule.find().length > 0 ? db.schedule.find() : []))
})

ipcMain.on('get-course-data', (event, arg) => {
  let course_code = arg
  event.sender.send('give-course-data', (db.courses.find().length > 0 ? db.courses.find().filter(course => course.name == course_code) : []))
})

ipcMain.on('get-courses-today', (event, arg) => {
  event.sender.send('give-courses-today', 
    db.schedule.find().filter(cls => {
      let now = new Date() 
      let clsDate = new Date(cls.startTime)
      if (now.getDate() == clsDate.getDate() &&
          now.getMonth() == clsDate.getMonth() &&
          now.getFullYear() == clsDate.getFullYear()) {
            return true;
          }
      return false;
    })
  )
})

ipcMain.on('get-courses-tomorrow', (event, arg) => {
  event.sender.send('give-courses-tomorrow', 
    db.schedule.find().filter(cls => {
      let now = new Date()
      let clsDate = new Date(cls.startTime)
      if (now.getDate() + 1 == clsDate.getDate() &&
          now.getMonth() == clsDate.getMonth() &&
          now.getFullYear() == clsDate.getFullYear()) {
            return true;
          }
      return false;
    })
  )
})

//All functionality

function getDataFromMycampus(userDetails) {
  const LOGIN_URL = "http://portal.mycampus.ca/cp/home/login"
  const BASE_URL = "http://portal.mycampus.ca/cp/ip/login?sys=sct&url="
  const DETAIL_URL = "http://ssbp.mycampus.ca/prod_uoit/bwskfshd.P_CrseSchdDetl"
  const NAME_URL = "http://ssbp.mycampus.ca/prod_uoit/bwskoacc.P_ViewAcctTotal"

  const PAYLOAD = {
    'user': userDetails.username,
    'pass': userDetails.password,
    'uuid': '0xACA021'
  };

  let now = new Date();
  let cM = now.getMonth() + 1;
  let termDate = "";
  if ((cM > 0 && cM < 5)) {
    termDate = (now.getFullYear()) + "01";
  } else if (cM > 8 && cM < 13) {
    termDate = now.getFullYear() + "09";
  }
  let detailLoad = {
    'term_in': termDate
  };

  let sess = request.jar();

  request.post({
    url: LOGIN_URL,
    form: PAYLOAD,
    jar: sess
  }, (err_0, res_0, body_0) => {
    if (!body_0.includes("Error: Failed Login")) {
      request.get({
        url: (BASE_URL + NAME_URL),
        jar: sess
      }, function (err_01, res_01, body_01) {
        let na = cheerio.load(body_01)
        let nameContentArray = []
        na('p.whitespace1').each(function () {
          nameContentArray.push(this);
        });
        nameContentArray = nameContentArray[0]
        let name = nameContentArray.children[0].data.replace('\n', '').split(' ')[0]
        db.user.save({
          name
        })
      });
      request.get({
        url: (BASE_URL + DETAIL_URL),
        jar: sess
      }, function (err_1, res_1, body_1) {
        request.post({
          url: DETAIL_URL,
          form: detailLoad,
          jar: sess
        }, function (err_2, res_2, body_2) {
          let ch = cheerio.load(body_2)
          let classes = []
          ch('acronym').each(function () {
            classes.push(this)
          })
          let CRNS = []
          for (let h = 0; h < classes.length; h++) {
            let timeTable = classes[h].parent.parent.parent.parent.next.next.children[2].children
            let timeTableObject = []
            for (let k = 1; k < timeTable.length; k++) {
              stringArray = ch(timeTable[k]).text().split('\n')
              if (stringArray[1] != '') {
                classTimeString = stringArray[2].split(' - ')
                let location = stringArray[4].split(' ')[stringArray[4].split(' ').length - 1]
                if (!isNaN(location[0]) && stringArray[4].split(' ')[0] === "Software") {
                  location = "SIRC" + stringArray[4].split(' ')[stringArray[4].split(' ').length - 1];
                }
                let classTimeObject = {
                  week: stringArray[1],
                  startTime: classTimeString[0],
                  endTime: classTimeString[1],
                  day: stringArray[3],
                  place: location,
                  dateRange: stringArray[5],
                  type: stringArray[6],
                  instructor: stringArray[7]
                }
                timeTableObject.push(classTimeObject)
              }
            }
            let fullClassName = ch(classes[h].parent.parent.parent.parent.children[0]).text().split(' - ')
            let classInfo = {
              crn: ch(classes[h].parent.next.next).text(),
              name: fullClassName[0],
              code: (fullClassName[1].split(" ")[0] + fullClassName[1].split(" ")[1]).slice(0, -1),
              section: fullClassName[2],
              times: timeTableObject,
              type: timeTableObject[0].type
            }
            CRNS.push(classInfo)
          }
          //We have the classes now!
          db.details.save(CRNS)

          let classData = []
          let courseCodeList = []
          for (let i = 0; i < CRNS.length; i++) {
            if (courseCodeList.indexOf(CRNS[i].code) < 0) {
              courseCodeList.push(CRNS[i].code);
              let ClassObject = {
                "name": CRNS[i].code,
                "title": CRNS[i].name,
                "icon": "book",
                "color": randomHexColour(),
                "lecture": CRNS.find(findCourseType("Lecture", CRNS[i].code)),
                "lab": CRNS.find(findCourseType("Laboratory", CRNS[i].code)),
                "tutorial": CRNS.find(findCourseType("Tutorial", CRNS[i].code)),
                "icon": "book",
              }
              classData.push(ClassObject)
            }
          }
          db.courses.save(classData)

          //Generate Calendar JSON
          const weekdayReference = {
            "M": 1,
            "T": 2,
            "W": 3,
            "R": 4,
            "F": 5
          }
          let calArr = []
          let eventInfo = {}
          for (let i = 0; i < CRNS.length; i++) {
            for (let j = 0; j < CRNS[i].times.length; j++) {
              let dateRange = CRNS[i].times[j].dateRange.split(" - ")
              let startTimeDateObject
              let endTimeDateObject
              if (dateRange[0] === dateRange[1]) {
                startTimeDateObject = new Date(dateRange[0] + " " + CRNS[i].times[j].startTime)
                endTimeDateObject = new Date(dateRange[0] + " " + CRNS[i].times[j].endTime)
                eventInfo = {
                  "code": CRNS[i].code,
                  "crn": CRNS[i].crn,
                  "name": CRNS[i].name,
                  "section": CRNS[i].section,
                  "startTime": startTimeDateObject.toISOString(),
                  "endTime": endTimeDateObject.toISOString(),
                  "place": CRNS[i].times[j].place,
                  "type": CRNS[i].times[j].type,
                  "colour": db.courses.find().find(courseLookupByCode(CRNS[i].code)),
                  "icon": "book"
                };
                calArr.push(eventInfo)
              } else {
                var dateRangeWeeks = Math.floor((new Date(dateRange[1]).getTime() - new Date(dateRange[0]).getTime()) / (1000 * 60 * 60 * 24 * 7))
                let start = new Date(dateRange[0])
                let end = new Date(dateRange[1])
                let delta = (start.getDay() - weekdayReference[CRNS[i].times[j].day])
                if (!isNaN(delta)) {
                  if (delta > 0) {
                    start.setTime(start.getTime() + ((7 - delta) * 1000 * 60 * 60 * 24))
                  } else {
                    start.setTime(start.getTime() + ((-delta) * 1000 * 60 * 60 * 24))
                  }
                }
                for (let g = 0; g <= dateRangeWeeks; g++) {
                  let classDateThing = new Date()
                  classDateThing.setTime(start.getTime() + ((7) * 1000 * 60 * 60 * 24 * g))
                  if (classDateThing.getTime() > (new Date("11/04/18").getTime())) {
                    classDateThing.setTime(start.getTime() + (1 * 1000 * 60 * 60 * 24) + ((7) * 1000 * 60 * 60 * 24 * g))
                  }
                  if (CRNS[i].times[j].startTime !== "TBA" && CRNS[i].times[j].endTime !== "TBA") {
                    startTimeDateObject = new Date(classDateThing.toLocaleDateString() + " " + CRNS[i].times[j].startTime)
                    endTimeDateObject = new Date(classDateThing.toLocaleDateString() + " " + CRNS[i].times[j].endTime)
                    eventInfo = {
                      "code": CRNS[i].code,
                      "crn": CRNS[i].crn,
                      "name": CRNS[i].name,
                      "section": CRNS[i].section,
                      "startTime": startTimeDateObject.toISOString(),
                      "endTime": endTimeDateObject.toISOString(),
                      "place": CRNS[i].times[j].place,
                      "type": CRNS[i].times[j].type,
                      "colour": db.courses.find().find(courseLookupByCode(CRNS[i].code)).color,
                      "icon": "book",
                    }
                    calArr.push(eventInfo)
                  }
                }
              }
            }
          }
          calArr.sort((a, b) => {
            return a.startTime - b.startTime
          });
          db.schedule.save(calArr)
        });
      });
    } else {
      console.log("Login Error");
    }
  })
}


function randomHexColour() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

function findCourseType(courseType, courseID) {
  return function (element) {
    return element.type === courseType && element.code === courseID;
  }
}

function courseLookupByCode(courseCode) {
  return(element) => {
    return element.name == courseCode;
  }
}
