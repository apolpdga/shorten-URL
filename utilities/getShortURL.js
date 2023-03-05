//短網址所用字元
letterOfshortURL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
//設定短網址長度
lengthOfshortURL = 5

//函數 - 取得短網址
function getShortURL() {
  let shortenURL = ''
  for (let i = 0; i < lengthOfshortURL; i++) {
    let x = Math.floor(Math.random() * letterOfshortURL.length);
    shortenURL = shortenURL + letterOfshortURL[x]
  }
  return shortenURL
};

// //輸入網址以取得短網址，並將結果存入資料庫
// // 1. 判斷輸入網址是否存在
// // 2. 判斷取得之短網址是否重複
// const url = prompt()
// shortURL = getRandom(letterOfshortURL, lengthOfshortURL)
// urlData[url] = shortURL
// console.log(urlData)

module.exports = getShortURL