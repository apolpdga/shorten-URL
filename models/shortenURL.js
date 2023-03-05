// mongoose 載入進來，才能使用相關方法
const mongoose = require('mongoose')

//Mongoose 提供了一個 mongoose.Schema 模組
const Schema = mongoose.Schema

// Schema 大寫表示你可以用 new Schema() 的方式來建構一個新的 Schema
const shortenUrlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  shorted_url: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('URL', shortenUrlSchema)