//短網址資料庫
const urlData = {
  "www.google.com.tw": "w57zA",
  "www.yahoo.com.tw": "78xK9",
  "www.msn.com.tw": "Ji9Ce",
  "www.github.com": "gL5qb",
  "www.www.mongodb.com": "Vn1D3",
}
//短網址所用字元
letterOfshortURL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
//設定短網址長度
lengthOfshortURL = 5

//函數 - 取得短網址
function getRandom(letterOfshortURL, lengthOfshortURL) {
  let shortURL = ''
  for (let i = 0; i < lengthOfshortURL; i++) {
    let x = Math.floor(Math.random() * letterOfshortURL.length);
    shortURL = shortURL + letterOfshortURL[x]
  }
  return shortURL
};

//輸入網址以取得短網址，並將結果存入資料庫
// 1. 判斷輸入網址是否存在
// 2. 判斷取得之短網址是否重複
const url = prompt()
shortURL = getRandom(letterOfshortURL, lengthOfshortURL)
urlData[url] = shortURL
console.log(urlData)

