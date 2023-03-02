// mongoose 載入進來，才能使用相關方法
const mongoose = require('mongoose')

//Mongoose 提供了一個 mongoose.Schema 模組
const Schema = mongoose.Schema

// Schema 大寫表示你可以用 new Schema() 的方式來建構一個新的 Schema
const shortenUrlSchema = new Schema({
  long: {
    type: String,
    required: true
  },
  short: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('shortenURL', shortenUrlSchema)