const expect = require('chai').expect
const varcon = require('../')

describe('varcon', function() {
  it('load', function() {
    const dbs = [
      varcon.load('A'),
      varcon.load('B'),
      varcon.load('C')
    ]
    dbs.forEach(db => {
      expect(db).is.an.object
    })

    expect(function() {
      varcon.load('WHATEVER')
    }).to.throw(/lang argument/)
  })

  it('getVariants', function() {
    const a = varcon.load('A')
    const b = varcon.load('B')
    const c = varcon.load('C')
    expect(a.getVariants('color')).to.deep.equal({ B: 'colour', C: 'colour' })
    expect(b.getVariants('colour')).to.deep.equal({ A: 'color' })
    expect(c.getVariants('colour')).to.deep.equal({ A: 'color' })
  })

  it('getVariant', function() {
    const a = varcon.load('A')
    const b = varcon.load('B')

    expect(a.getVariant('color', 'B')).equals('colour')
    expect(a.getVariant('color', 'C')).equals('colour')
    expect(b.getVariant('color', 'C')).equals(null)
    expect(b.getVariant('colour', 'A')).equals('color')
  })
})