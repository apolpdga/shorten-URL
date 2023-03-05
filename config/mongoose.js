//載入 mongoose 並且設定連線
const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態並儲存到 db 這個物件
const db = mongoose.connection
// 連線異常
// 用 on 註冊一個事件監聽器，用來監聽 error 事件有沒有發生，
// 只要有觸發 error 就印出 error 訊息
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
// 用once註冊了一個事件監聽器，監聽連線成功的 open 情況，
// 相對於「錯誤」，連線成功只會發生一次，所以這裡特地使用 once，
// 由於 once 設定的監聽器是一次性的，一旦連線成功，在執行 callback 以後就會解除監聽器)
db.once('open', () => {
  console.log('mongodb connected!')
})

//匯出設定
module.exports = db