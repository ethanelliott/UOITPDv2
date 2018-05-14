/* eslint-disable */
'use strict'
const fs = require('fs')

let _menu = [{
    course: 'sofe2720',
    icon: 'adjust'
  },
  {
    course: 'elee2450',
    icon: 'angle-double-left'
  },
  {
    course: 'phy2900',
    icon: 'star'
  },
  {
    course: 'sofe2715',
    icon: 'apple'
  },
  {
    course: 'psyc1000',
    icon: 'user'
  }
]

export default {
  menu: _menu,
  method: {
    something: () => {
      fs.readFile('blah.txt', (txt) => {
        console.log(txt)
      })
    }
  }
}
