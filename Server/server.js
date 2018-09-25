'use strict';
// Constants
const port = 1337
const v = '0.1.0'
const DATABASE_TABLES = [
    'userdata'
]
const colors = require('colors')
colors.setTheme({
    debug: ['green', 'italic'],
    logo: ['white', 'bgBlue'],
    important: ['white', 'bgRed']
})
// server
const express = require('express')
const app = express()
const http = require('http').Server(app)
const path = require('path')
app.set('port', port);
http.listen(port);
// Local storage
const homedir = require('os').homedir()
const fs = require('fs')
const diskdb = require('diskdb')
const sha256 = require('sha256')
const aes256 = require('aes256')
// Load local files
const storeDir = path.join(homedir, 'uoitpd_server')
const dbDir = path.join(storeDir, 'db')
if (!fs.existsSync(storeDir)) { fs.mkdirSync(storeDir) }
if (!fs.existsSync(dbDir)) { fs.mkdirSync(dbDir) }
var db = diskdb.connect(dbDir, DATABASE_TABLES)

// General functions
function log(data, noDate) {
    console.log((noDate ? '' : ('[' + new Date().toLocaleTimeString() + ']').debug + ' ') + data)
}
function salt($len) {
    let ALL = "abcdefghijklmnopqrstuvwxyz1234567890";
    let s = "";
    for (let i = 0; i < $len; i++) {s += ALL[Math.floor(Math.random() * ALL.length)]}
    return s;
}
function registerUrl(path, callback) {
    log('Registering url: ' + path)
    app.get(path, (req, res) => {
        log(req.hostname + ' => ' + req.ip)
        callback(req, res)
    })
}

function getUserDataByID(id) {
    return null
}

// Start console logging
log(('\n\n\t=============================\n' + '\t┬ ┐ ┌─┐ ┬ ┌┬┐ ┬─┐ ┬─┐     ┌─┐\n' + '\t│ │ │ │ │  │  │─┘ │ │ │┌┘ ┌─┘\n' + '\t└─┘ └─┘ ┴  ┴  ┴   ┴─┘ └┘  └──\n' + '\t=============================\n').logo, true)
log('\t  Starting UOITPDv2 v' + v + '...\n\n', true)
log('Session key: ' + sha256(salt(20)).important)
// URL registration
log('Begin registering URLs')
registerUrl('/', (req, res) => {
    res.json({'Test': 200})
})
log('End registering URLs')

// End
log('Ready!')