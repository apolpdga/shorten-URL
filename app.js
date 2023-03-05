// app.js
// require packages used in the project
const express = require('express')
const app = express()
// start and listen on the Express server
const port = 3000
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})

//環境變數設定
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//樣版引擎
const exphbs = require('express-handlebars') //載入樣版引擎handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' })) //定義要使用的樣板引擎
app.set('view engine', 'handlebars') //設定 view engine 是 handlebars

// 資料庫設定
// 載入 Todo model
const URL = require('./models/shortenURL')
//載入mongoose設定
require('./config/mongoose')

//載入小工具裡的程式
//產生短網址程式
const getShortURL = require('./utilities/getShortURL')

// 路由設定
// 引用 body-parser，用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// 載入 method-override
const methodOverride = require('method-override')
app.use(methodOverride('_method')) //將每筆路由使用 methodOverride 進行前置處理

// 首頁
app.get('/', (req, res) => {
  res.render('index') // 將資料傳給 index 樣板
})

// 短網址資料庫
app.get('/urls', (req, res) => {
  URL.find() // 取出 URL model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(urls => res.render('urldb', { urls: urls })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

//短網址轉址
app.get('/:short', (req, res) => {
  if (req.params.short === 'favicon.ico') {  //防止進入首頁時自動執行此路由
    // console.log(req.params.short)
    return res.redirect('/') // 將資料傳給 index 樣板
  }

  URL.findOne({ shorted_url: req.params.short }) // 取出 URL model 裡的shorten_url
    .then(data => {
      res.redirect(data.original_url)
    })
    .catch(error => console.error(error))
})

// 將取得的網址和產生的短網址，一併存入資料庫，並導回首頁
app.post('/', (req, res) => {
  //如果使用者輸入的網址已存在資料庫中，則回傳相對應的短網址

  //如果產生的短網址已在資料庫中，則重新產生
  const shortedURL = getShortURL()  //亂數產生短網址

  //資料寫入資料庫
  URL.create({ original_url: req.body.originalURL, shorted_url: shortedURL })     // 資料新增至資料庫
    .then((data) => {
      res.render('index', {
        origin: req.headers.origin,
        shorted_url: data.shorted_url,
      }) // 新增完成後導回首頁
    })
    .catch(error => console.log(error))
  // 使用then時需要返回一個結果，而當使用 arrow function, 例如() => x 其實就是() => { return x; }，故會返回結果
})


//delete
app.delete('/urls/:id', (req, res) => {
  const id = req.params.id
  URL.findById(id)
    .then(data => data.remove())
    .then(() => res.redirect('/urls'))
    .catch(error => console.log(error))
})