//引入 dotenv，讓 Node.js 能抓到寫在 .env 上的環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const URL = require('../shortenURL') // 載入 shortenURL model
const db = require('../../config/mongoose')

//一旦連上mongoDB，即建置種子資料
db.once('open', () => {
  console.log('process...')
  URL.create({
    original_url: 'http://www.google.com.tw',
    shorted_url: 'ab123'
  })
  URL.create({
    original_url: 'http://www.yahoo.com.tw',
    shorted_url: 'cde45'
  })
  URL.create({
    original_url: 'http://www.msn.com.tw',
    shorted_url: 'fg789'
  })
  URL.create({
    original_url: 'http://www.youtube.com',
    shorted_url: 'hijk0'
  })
  console.log('done')
})