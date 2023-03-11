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

  //先找看看輸入的網址是否已存在
  URL.findOne({ original_url: req.body.originalURL })
    .then(data => {

      // 若傳入的網址已存在，則找出資料傳回首頁
      if (data) {
        res.render('index', {
          origin: req.headers.origin,    // 網站首頁網址
          shorted_url: data.shorted_url // 短網址
        })
      }
      // 若傳入的網址不存在，則創造資料傳回首頁
      else {
        let shortedURL = getShortURL()
        URL.findOne({ shorted_url: shortedURL })
          .then(data => {
            //若短網址重複，則重新產生
            if (data) shortedURL = getShortURL()

            URL.create({ original_url: req.body.originalURL, shorted_url: shortedURL })
              .then(data => {
                res.render('index', {
                  origin: req.headers.origin,    // 網站首頁網址
                  shorted_url: data.shorted_url // 短網址
                })
              })
          })
      }
    })
    .catch(error => console.error(error))

  /*
  // 若傳入空字串，則轉址回首頁
  if (!req.body.originalURL) return res.redirect("/")

  //亂數產生短網址
  let shortedURL = "ab123"   //先故意設定一個重複的短網址，看看接下來可否判斷出短網址有重複

  // 尋找傳入的網址，若資料庫中已存在，則直接從資料庫回傳，否則就存入一個新資料再回傳
  URL.findOne({ original_url: req.body.originalURL })
    .then(data => {

      // 若傳入的網址已存在，則找出資料傳回首頁
      if (data) {
        res.render('index', {
          origin: req.headers.origin,    // 網站首頁網址
          shorted_url: data.shorted_url  // 短網址
        })
      }

      // 若傳入的網址不存在，則創造資料傳回首頁
      else {
        URL.findOne({ shorted_url: shortedURL })
          .then(data => {
            console.log("進入點1")
            console.log(data)
            shortedURL = getShortURL()
          })
        // const shortedURL = getShortURL()  //亂數產生短網址
        console.log("進入2")
        console.log(shortedURL)
        URL.create({ original_url: req.body.originalURL, shorted_url: shortedURL })
          .then(data => {
            console.log("進入3")
            console.log(shortedURL)
            console.log(data)
            res.render('index', {
              origin: req.headers.origin,    // 網站首頁網址
              shorted_url: data.shorted_url // 短網址
            })
            console.log(shortedURL)
          })
      }
    })
    .catch(error => console.error(error))

*/
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
