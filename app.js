// app.js
// require packages used in the project
const express = require('express')
const app = express()

// start and listen on the Express server
const port = 3000
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})

//樣版引擎
const exphbs = require('express-handlebars') //載入樣版引擎handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' })) //定義要使用的樣板引擎
app.set('view engine', 'handlebars') //設定 view engine 是 handlebars


// 引用 body-parser，用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))


// routes setting
app.get('/', (req, res) => {
  res.render('index')
})

