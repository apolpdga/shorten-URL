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
// 載入 URL model
const URL = require('./models/shortenURL')
//載入mongoose設定
require('./config/mongoose')

//載入小工具裡的程式
//產生短網址程式
const getShortURL = require('./utilities/getShortURL')

// 路由前置設定
// 引用 body-parser，用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// 載入 method-override
const methodOverride = require('method-override')
app.use(methodOverride('_method')) //將每筆路由使用 methodOverride 進行前置處理

// 路由設定

/* read */
// 首頁 -> 短網址轉址介面
app.get('/', (req, res) => {
  res.render('index')
})

// 短網址資料庫 -> 瀏覽、修改短網址資訊
app.get('/urls', (req, res) => {
  URL.find() // 
    .lean()
    .then(urls => res.render('urldb', { urls: urls }))
    .catch(error => console.error(error))
})

//短網址轉址 -> 將輸入的短網址轉址至原網址
app.get('/:short', (req, res) => {

  //防止進入首頁時自動執行此路由
  if (req.params.short === 'favicon.ico') {
    // console.log(req.params.short)
    return res.redirect('/')
  }

  // 轉址至原網址(利用短網址找出原網址)
  URL.findOne({ shorted_url: req.params.short })
    .then(data => {
      res.redirect(data.original_url)
    })
    .catch(error => console.error(error))
})

/* create */

// 將取得的網址和新產生的短網址，一併存入資料庫，並導回首頁
app.post('/', (req, res) => {
  //如果使用者輸入的網址已存在資料庫中，則回傳相對應的短網址

  //如果產生的短網址已在資料庫中，則重新產生
  const shortedURL = getShortURL()  //亂數產生短網址

  //資料寫入資料庫，回導回首頁(呈現短網址的介面)
  URL.create({ original_url: req.body.originalURL, shorted_url: shortedURL })     // 資料新增至資料庫
    .then((data) => {
      res.render('index', {
        origin: req.headers.origin,    // 網站首頁網址
        shorted_url: data.shorted_url, // 短網址
      })
    })
    .catch(error => console.log(error))
  // 使用then時需要返回一個結果，而當使用 arrow function, 例如() => x 其實就是() => { return x; }，故會返回結果
})

/* update */

//渲染edit頁面->取得要修改的 item 丟進 edit 頁面處理
app.get('/:url_id/edit', (req, res) => {
  const id = req.params.url_id
  return URL.findById(id)
    .lean()
    .then(item => {
      res.render('edit', { item })
    })
    .catch(error => console.log(error))
})

//將修改完的 itme 存回資料庫，並導回「短網址資料庫」頁面
app.post('/:url_id/edit', (req, res) => {
  const id = req.params.url_id
  const { name, name_en, category, image, location, phone, google_map, rating, description, } = req.body
  console.log(req.body)
  // 「解構賦值(destructuring assignment)」:把物件裡的屬性一項項拿出來存成變數時，可以使用的一種縮寫

  return URL.findById(id)
    .then(item => {
      item.name = name
      item.name_en = name_en
      item.category = category
      item.image = image

      return restaurant.save()
    })
    .then(() => res.redirect('/urls'))
    .catch(error => console.log(error))
})

//delete
app.delete('/urls/:id', (req, res) => {
  const id = req.params.id
  URL.findById(id)
    .then(data => data.remove())
    .then(() => res.redirect('/urls'))
    .catch(error => console.log(error))
})
