"use strict"

// Compile varcon.txt to a map indexed by American usage

const fs = require('fs')
const path = require('path')

const DATABASE_FILE = path.join(__dirname, 'varcon.txt')
const ENTRY_RE = /^\s*# (\w+)/
const COMMENT_RE = /^\s*##/
const USAGE_RE = /\|[^|]+$/

const content = fs.readFileSync(DATABASE_FILE, { encoding: 'utf8' })

const lines = content.split('\n')
  .filter(line => 
    !COMMENT_RE.test(line) && !!line.trim()
  )

const map = {
  A: {},
  B: {},
  C: {}
}
let cluster = null
lines.forEach((line, row) => {
  var matches = ENTRY_RE.exec(line)
  if (matches) {
    cluster = matches[1]
    //console.log(row, cluster)
  } else {
    const variants = {}
    const pairs = line.replace(USAGE_RE, '').split('/').map(pair => pair.trim())
    //console.log('\tpairs = ' + pairs.length)
    pairs.forEach(pair => {
      const kv = pair.split(':').map(p => p.trim())
      const tags = kv[0].split(' ')
      const spell = kv[1]

      tags.forEach(t => {
        if (t in variants) {
          /*
          if (t.indexOf('v') === -1 && t.indexOf('V') === -1) {
            console.log(`#${row} Override: ${cluster} ${t} ${spell}`)
            console.log('\t', variants)
          }
          */
        }
        variants[t] = spell.toLowerCase()
      })
    })

    /*
    If there are no tags with the 'Z' spelling category on the line than
    'B' implies 'Z'.  Similarly if there are no 'C' tags than 'Z' implies
    'C'.
    */

    const A = variants['A']
    if (A) {
      const B = variants['B']
      const C = variants['C'] || variants['Z'] || variants['B']
      const removeDup = (obj, v) => {
        Object.keys(obj).forEach(k => {
          if (obj[k] === v) {
            delete obj[k]
          }
        })
        return obj
      }

      map.A[A] = removeDup({
        B, C
      }, A)

      map.B[B] = removeDup({
        A, C
      }, B)

      map.C[C] = removeDup({
        A, B
      }, C)
    }
  }
})

fs.writeFileSync('A.json', JSON.stringify(map.A), { encoding: 'utf8' })
fs.writeFileSync('B.json', JSON.stringify(map.B), { encoding: 'utf8' })
fs.writeFileSync('C.json', JSON.stringify(map.C), { encoding: 'utf8' })