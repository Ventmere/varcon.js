const LANGUAGES = ['A', 'B', 'C']
const FILES = ['./A.json', './B.json', './C.json']

exports.load = function(lang) {
  const idx = LANGUAGES.indexOf(lang)
  if (idx === -1) {
    throw new Error(`lang argument must be one of ${LANGUAGES.join(', ')}.`)
  }
  const db = require(FILES[idx])
  return {
    getVariants(word) {
      return db[word] || null
    },
    getVariant(word, lang) {
      const variants = this.getVariants(word)
      if (!variants) {
        return null
      }
      if (lang in variants) {
        return variants[lang]
      } else {
        return null
      }
    }
  }
}