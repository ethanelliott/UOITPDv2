console.time('init')
const PROD = false
const DATABASE_TABLES = [
  'details',
  'schedule',
  'todo',
  'notes',
  'projects',
  'settings',
  'user'
]

const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const request = require('request-ssl')
const cheerio = require('cheerio')
const moment = require('moment')
const windowStateKeeper = require('electron-window-state')
// Security
const sha256 = require('sha256')
const aes256 = require('aes256')
// Setup local storage paths and such
const path = require('path')
const homedir = require('os').homedir()
const fs = require('fs')
const ical = require('ical-generator')
const storeDir = path.join(homedir, 'uoitpd')
const dbDir = path.join(homedir, 'uoitpd', 'db')
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir)
}
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir)
}

let db = require('diskdb')
db = db.connect(dbDir, DATABASE_TABLES)

const config = {
  url: (PROD ? `file://${process.cwd()}/dist/index.html` : 'http://localhost:8080/')
}

let win

function createWindow () {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 795
  })

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
    backgroundColor: '#d2d2d2'
  })
  win.loadURL(config.url)
  win.once('ready-to-show', () => {
    console.timeEnd('init')
    win.show()
    win.focus()
  })

  win.on('closed', () => {
    win = null
  })

  mainWindowState.manage(win)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    try {
      createWindow()
    } catch (e) {
      alert(e)
    }
  }
})

// All IPC comm
ipcMain.on('check-login', (event) => {
  if (db.user.find().length === 0) {
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

function getDataFromMycampus (userDetails) {
  const LOGIN_URL = 'http://portal.mycampus.ca/cp/home/login'
  const BASE_URL = 'http://portal.mycampus.ca/cp/ip/login?sys=sct&url='
  const DETAIL_URL = 'http://ssbp.mycampus.ca/prod_uoit/bwskfshd.P_CrseSchdDetl'
  const NAME_URL = 'http://ssbp.mycampus.ca/prod_uoit/bwskoacc.P_ViewAcctTotal'

  const PAYLOAD = {
    'user': userDetails.username,
    'pass': userDetails.password,
    'uuid': '0xACA021'
  }

  let now = new Date()
  let cM = now.getMonth() + 1
  let termDate = ''
  if ((cM > 0 && cM < 5)) {
    termDate = (now.getFullYear()) + '01'
  } else if (cM > 8 && cM < 13) {
    termDate = now.getFullYear() + '09'
  }
  let detailLoad = {
    'term_in': termDate
  }

  let sess = request.jar()

  request.post({
    url: LOGIN_URL,
    form: PAYLOAD,
    jar: sess
  }, (_err0, _res0, body0) => {
    // Login successful
    if (!body0.includes('Error: Failed Login')) {
      request.get({
        url: (BASE_URL + NAME_URL),
        jar: sess
      }, (_err01, _res01, body01) => {
        let nameContentArray = []
        cheerio.load(body01)('p.whitespace1').each(function () {
          nameContentArray.push(this)
        })
        db.user.save({ 
          name: nameContentArray[0].children[0].data.replace('\n', ''),
          private_key: sha256(userDetails.username + userDetails.password)
        })
      })
      request.get({
        url: (BASE_URL + DETAIL_URL),
        jar: sess
      }, () => {
        request.post({
          url: DETAIL_URL,
          form: detailLoad,
          jar: sess
        }, (_err2, _res2, body2) => {
          let classes = []
          let ch = cheerio.load(body2)
          ch('acronym').each(function () {
            classes.push(this)
          })
          let CRNS = []
          for (let h = 0; h < classes.length; h++) {
            let timeTable = classes[h].parent.parent.parent.parent.next.next.children[2].children
            let timeTableObject = []
            for (let k = 1; k < timeTable.length; k++) {
              let stringArray = ch(timeTable[k]).text().split('\n')
              if (stringArray[1] !== '') {
                let classTimeString = stringArray[2].split(' - ')
                let location = stringArray[4].split(' ')[stringArray[4].split(' ').length - 1]
                if (!isNaN(location[0]) && stringArray[4].split(' ')[0] === 'Software') {
                  location = 'SIRC' + stringArray[4].split(' ')[stringArray[4].split(' ').length - 1]
                }
                timeTableObject.push({
                  week: stringArray[1],
                  startTime: classTimeString[0],
                  endTime: classTimeString[1],
                  day: stringArray[3],
                  place: location,
                  dateRange: stringArray[5],
                  type: stringArray[6],
                  instructor: stringArray[7]
                })
              }
            }
            let fullClassName = ch(classes[h].parent.parent.parent.parent.children[0]).text().split(' - ')
            let classInfo = {
              crn: ch(classes[h].parent.next.next).text(),
              name: fullClassName[0],
              code: (fullClassName[1].split(' ')[0] + fullClassName[1].split(' ')[1]).slice(0, -1),
              section: fullClassName[2],
              times: timeTableObject,
              type: timeTableObject[0].type

            }
            // CRNS contains the data for each CRN. This needs to be combined by course code
            CRNS.push(classInfo)
          }
          // Collect CRNS by course code
          let classData = []
          let courseCodeList = []
          for (let i = 0; i < CRNS.length; i++) {
            if (courseCodeList.indexOf(CRNS[i].code) < 0) {
              courseCodeList.push(CRNS[i].code)
              let ClassObject = {
                code: CRNS[i].code,
                name: CRNS[i].name,
                icon: 'book',
                color: randomHexColour(),
                lecture: CRNS.find(findCourseType('Lecture', CRNS[i].code)),
                lab: CRNS.find(findCourseType('Laboratory', CRNS[i].code)),
                tutorial: CRNS.find(findCourseType('Tutorial', CRNS[i].code)),
                crnLookup: [
                  {
                    crn: (CRNS.find(findCourseType('Lecture', CRNS[i].code)) ? CRNS.find(findCourseType('Lecture', CRNS[i].code)).crn : ''),
                    type: 'Lecture',
                    class: CRNS.find(findCourseType('Lecture', CRNS[i].code))
                  },
                  {
                    crn: (CRNS.find(findCourseType('Laboratory', CRNS[i].code)) ? CRNS.find(findCourseType('Laboratory', CRNS[i].code)).crn : ''),
                    type: 'Laboratory',
                    class: CRNS.find(findCourseType('Laboratory', CRNS[i].code))
                  },
                  {
                    crn: (CRNS.find(findCourseType('Tutorial', CRNS[i].code)) ? CRNS.find(findCourseType('Tutorial', CRNS[i].code)).crn : ''),
                    type: 'Tutorial',
                    class: CRNS.find(findCourseType('Tutorial', CRNS[i].code))
                  }
                ]
              }
              classData.push(ClassObject)
            }
          }
          // We have the classes now!
          db.details.save(classData)

          // Now, generate the calendar JSON
          const weekdayReference = {
            'M': 1,
            'T': 2,
            'W': 3,
            'R': 4,
            'F': 5
          }
          let calArr = []
          for (let i = 0; i < CRNS.length; i++) {
            for (let j = 0; j < CRNS[i].times.length; j++) {
              let dateRange = CRNS[i].times[j].dateRange.split(' - ')
              // If the date is one-time or a range
              if (dateRange[0] === dateRange[1]) {
                calArr.push({
                  'code': CRNS[i].code,
                  'crn': CRNS[i].crn,
                  'startTimeMilisec': (new Date(dateRange[0] + ' ' + CRNS[i].times[j].startTime)).getTime(),
                  'startTime': (new Date(dateRange[0] + ' ' + CRNS[i].times[j].startTime)).toISOString(),
                  'endTime': (new Date(dateRange[0] + ' ' + CRNS[i].times[j].endTime)).toISOString()
                })
              } else { // Date range... this gets messy
                // calculate number of weeks inside the date range
                var dateRangeWeeks = Math.floor((new Date(dateRange[1]).getTime() - new Date(dateRange[0]).getTime()) / (1000 * 60 * 60 * 24 * 7))
                // start of date range (the first day of school)
                let start = new Date(dateRange[0])
                // Distance from start date to date of class
                let delta = (start.getDay() - weekdayReference[CRNS[i].times[j].day])
                // make sure it evaluated (otherwise its most likely an online course)
                if (!isNaN(delta)) {
                  if (delta > 0) {
                    // Looks like it comes after the first day
                    start.setTime(start.getTime() + ((7 - delta) * 1000 * 60 * 60 * 24))
                  } else {
                    // Looks like it happens starting the next week
                    start.setTime(start.getTime() + ((-delta) * 1000 * 60 * 60 * 24))
                  }
                }
                // Now lets go for each week inside the course date range
                for (let g = 0; g <= dateRangeWeeks; g++) {
                  // cdt is just a random reference to a date that I can use
                  let cdt = new Date() // cdt actually stands for course date thing
                  // Add 1 week worth of miliseconds from the start for each week
                  cdt.setTime(start.getTime() + ((7) * 1000 * 60 * 60 * 24 * g))
                  // This is a little bit annoying. I hate daylight savings. Also, note that months start at 0? for some reason.
                  if (cdt.getTime() > (new Date(2018, (11 - 1), 4, 0, 0, 0).getTime())) {
                    cdt.setTime(start.getTime() + (1 * 1000 * 60 * 60 * 24) + ((7) * 1000 * 60 * 60 * 24 * g))
                  }
                  // Special thanks to moment for making this so easy
                  let startTime = moment(CRNS[i].times[j].startTime, 'hh:mm a')
                  let endTime = moment(CRNS[i].times[j].endTime, 'hh:mm a')
                  // Make sure we are only adding the courses that actually have a timeslot to the calendar
                  if (CRNS[i].times[j].startTime !== 'TBA' && CRNS[i].times[j].endTime !== 'TBA') {
                    let startTimeDateObject = new Date(
                      cdt.getFullYear(),
                      cdt.getMonth(),
                      cdt.getDate(),
                      startTime.hour(),
                      startTime.minute(),
                      startTime.second()
                    )
                    let endTimeDateObject = new Date(
                      cdt.getFullYear(),
                      cdt.getMonth(),
                      cdt.getDate(),
                      endTime.hour(),
                      endTime.minute(),
                      endTime.second()
                    )
                    let eventInfo = {
                      'code': CRNS[i].code,
                      'crn': CRNS[i].crn,
                      'startTimeMilisec': startTimeDateObject.getTime(),
                      'startTime': startTimeDateObject.toISOString(),
                      'endTime': endTimeDateObject.toISOString()
                    }
                    calArr.push(eventInfo)
                  }
                }
              }
            }
          }
          // sort that SOB
          calArr.sort((a, b) => {
            return a.startTimeMilisec - b.startTimeMilisec
          })
          // save that SOB
          db.schedule.save(calArr)
        })
      })
    } else {
      // Looks like you got your login creds wrong...try again
      console.log('Login Error')
    }
  })
}

function randomHexColour () {
  var letters = '0123456789ABCDEF'.split('')
  var color = ''
  for (var i = 0; i < 6; i++) { color += letters[Math.round(Math.random() * 15)] }
  return color
}

function findCourseType (courseType, courseID) {
  return function (element) {
    return element.type === courseType && element.code === courseID
  }
}

function getColorByCourseCode (courseCode) {
  return db.details.find().find(getCourseByCourseCode(courseCode)).color
}

function getNameByCourseCode (courseCode) {
  return db.details.find().find(getCourseByCourseCode(courseCode)).name
}

function getTypeByCRN (courseCode, crn) {
  let crnLookup = db.details.find().find(getCourseByCourseCode(courseCode)).crnLookup
  return crnLookup.find((element) => {
    return element.crn === crn
  }).type
}

function crnReverseLookup(courseCode, crn) {
  let crnLookup = db.details.find().find(getCourseByCourseCode(courseCode)).crnLookup
  return crnLookup.find((element) => {
    return element.crn === crn
  })
}

function getLocationByCRN (courseCode, crn) {
  let crnLookup = db.details.find().find(getCourseByCourseCode(courseCode)).crnLookup
  return crnLookup.find((element) => {
    return element.crn === crn
  }).class.times[0].place
}

function getIconByCourseCode (courseCode) {
  return db.details.find().find(getCourseByCourseCode(courseCode)).icon
}

function getCourseByCourseCode (courseCode) {
  return (element) => {
    return element.code === courseCode
  }
}

ipcMain.on('get-courses', (event) => {
  event.sender.send('give-courses', (db.details.find().length > 0 ? db.details.find() : []))
})

ipcMain.on('get-name', (event) => {
  event.sender.send('give-name', (db.user.find()[0] ? db.user.find()[0].name : ''))
})

ipcMain.on('get-calendar', (event) => {
  if (db.schedule.find().length > 0) {
    let calArr = db.schedule.find().map((ele) => {
      ele.color = getColorByCourseCode(ele.code)
      ele.name = getNameByCourseCode(ele.code)
      ele.type = getTypeByCRN(ele.code, ele.crn)
      return ele
    })
    event.sender.send('give-calendar', calArr)
  } else {
    event.sender.send('give-calendar', [])
  }
})

ipcMain.on('get-course-data', (event, arg) => {
  event.sender.send('give-course-data', (db.details.find().length > 0 ? db.details.find().filter(course => course.code === arg) : []))
})

ipcMain.on('get-courses-today', (event) => {
  event.sender.send('give-courses-today',
    db.schedule.find().filter(cls => {
      let now = new Date()
      let clsDate = new Date(cls.startTime)
      if (now.getDate() === clsDate.getDate() &&
          now.getMonth() === clsDate.getMonth() &&
          now.getFullYear() === clsDate.getFullYear()) {
        return true
      }
      return false
    }).map((ele) => {
      ele.color = getColorByCourseCode(ele.code)
      ele.location = getLocationByCRN(ele.code, ele.crn)
      ele.name = getNameByCourseCode(ele.code)
      ele.type = getTypeByCRN(ele.code, ele.crn)
      ele.icon = getIconByCourseCode(ele.code)
      return ele
    }).sort((a, b) => {
      return a.startTimeMilisec - b.startTimeMilisec
    })
  )
})

ipcMain.on('get-courses-tomorrow', (event) => {
  event.sender.send('give-courses-tomorrow',
    db.schedule.find().filter(cls => {
      let now = new Date()
      let clsDate = new Date(cls.startTime)
      if (now.getDate() + 1 === clsDate.getDate() &&
          now.getMonth() === clsDate.getMonth() &&
          now.getFullYear() === clsDate.getFullYear()) {
        return true
      }
      return false
    }).map((ele) => {
      ele.color = getColorByCourseCode(ele.code)
      ele.location = getLocationByCRN(ele.code, ele.crn)
      ele.name = getNameByCourseCode(ele.code)
      ele.type = getTypeByCRN(ele.code, ele.crn)
      ele.icon = getIconByCourseCode(ele.code)
      return ele
    }).sort((a, b) => {
      return a.startTimeMilisec - b.startTimeMilisec
    })
  )
})

ipcMain.on('get-ics-calendar', (event) => {
  let cal = ical({
    timezone: 'America/New_York'
  })
  let calendarData = db.schedule.find()
  console.log(calendarData.length)
  for (let i = 0; i < calendarData.length; i++) {
    let calEvent = calendarData[i]
    let summary = getNameByCourseCode(calEvent.code) + ' ' + getTypeByCRN(calEvent.code, calEvent.crn)
    // let description = crnReverseLookup(calEvent.code, calEvent.crn)
    cal.createEvent({
      start: new Date(calEvent.startTime),
      end: new Date(calEvent.endTime),
      summary: summary,
      location: getLocationByCRN(calEvent.code, calEvent.crn),
      description: 'Course'
    })
  }
  console.log(cal.toString())
  event.sender.send('give-ics-calendar', cal.toString())
})

// Project stuff
ipcMain.on('get-projects', (event) => {
  event.sender.send('give-projects', (db.projects.find().length > 0 ? db.projects.find() : []))
})

ipcMain.on('get-projects-today', (event) => {
  if (db.projects.find().length > 0) {
    event.sender.send('give-projects-today', db.projects.find().filter(project => {
      let now = new Date()
      let projectDueDate = new Date(project.duedate)
      if (now.getDate() === projectDueDate.getDate() &&
          now.getMonth() === projectDueDate.getMonth() &&
          now.getFullYear() === projectDueDate.getFullYear()) {
        return true
      }
      return false
    }).map((ele) => {
      ele.color = (ele.course !== 'none' ? getColorByCourseCode(ele.course) : '000000')
      ele.coursename = (ele.course !== 'none' ? getNameByCourseCode(ele.course) : '')
      return ele
    }).sort((a, b) => {
      return (new Date(a.duedate)).getTime() - (new Date(b.duedate)).getTime()
    }))
  } else {
    event.sender.send('give-projects-today', [])
  }
})

ipcMain.on('add-new-project', (event, arg) => {
  db.projects.save({
    name: arg.name,
    course: arg.course,
    description: arg.description,
    duedate: moment(arg.date + ' ' + arg.time).toISOString()
  })
  event.sender.send('project-added')
})

ipcMain.on('edit-project', (event, arg) => {
  db.projects.update({
    _id: arg.id
  }, {
    name: arg.name,
    course: arg.course,
    description: arg.description,
    duedate: moment(arg.date + ' ' + arg.time).toISOString()
  })
  event.sender.send('project-edited')
})

ipcMain.on('delete-project', (event, arg) => {
  db.projects.remove({
    _id: arg
  }, false)
  event.sender.send('project-deleted')
})

ipcMain.on('get-projects-upcoming', (event) => {
  if (db.projects.find().length > 0) {
    event.sender.send('give-projects-upcoming', db.projects.find().filter(project => {
      let now = new Date()
      let projectDueDate = new Date(project.duedate)
      if (!(now.getDate() === projectDueDate.getDate() &&
          now.getMonth() === projectDueDate.getMonth() &&
          now.getFullYear() === projectDueDate.getFullYear())) {
        return true
      }
      return false
    }).map((ele) => {
      ele.color = (ele.course !== 'none' ? getColorByCourseCode(ele.course) : '000000')
      ele.coursename = (ele.course !== 'none' ? getNameByCourseCode(ele.course) : '')
      return ele
    }).sort((a, b) => {
      return (new Date(a.duedate)).getTime() - (new Date(b.duedate)).getTime()
    }))
  } else {
    event.sender.send('give-projects-upcoming', [])
  }
})

ipcMain.on('get-todo', (event) => {
  if (db.todo.find().length > 0) {
    event.sender.send('give-todo', db.todo.find().map((ele) => {
      ele.color = (ele.course !== 'none' ? getColorByCourseCode(ele.course) : '000000')
      ele.coursename = (ele.course !== 'none' ? getNameByCourseCode(ele.course) : '')
      return ele
    }).sort((a, b) => {
      return (new Date(a.dateadded)).getTime() - (new Date(b.dateadded)).getTime()
    }))
  } else {
    event.sender.send('give-todo', [])
  }
})

ipcMain.on('add-todo', (event, arg) => {
  db.todo.save({
    name: arg.name,
    course: arg.course,
    description: arg.description,
    dateadded: moment().toISOString()
  })
  event.sender.send('todo-added')
})

ipcMain.on('edit-todo', (event, arg) => {
  db.todo.update({
    _id: arg.id
  }, {
    name: arg.name,
    course: arg.course,
    description: arg.description,
    dateadded: moment().toISOString()
  })
  event.sender.send('todo-edited')
})

ipcMain.on('delete-todo', (event, arg) => {
  db.todo.remove({
    _id: arg
  }, false)
  event.sender.send('todo-deleted')
})

// Course page event handling

ipcMain.on('colour-change', (event, arg) => {
  let colour = arg.colour
  let courseCode = arg.coursedata.code
  db.details.update({
    code: courseCode
  }, {
    color: colour
  })
  event.sender.send('refresh-course')
})

// Backup functions
ipcMain.on('login-for-backup', (event, arg) => {
  let testKey = sha256(arg.username + arg.password)
  let actualKey = db.user.find({
    private_key: testKey
  })
  if (actualKey.length > 0) {
    // User entered correct details
    // Start backup system

    request.post({
      url: 'http://localhost:1337/register',
      form: {
        studentid: arg.username
      }
    }, (e, r, b) => {
      console.log(b)
    })
  } else {
    // Incorrect details!
    // Try again
  }
})
