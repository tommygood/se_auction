# se_auction 軟工-拍賣系統
  - framework : nodejs
  
  - run : 
  1. install nodejs enviroment 
  2. change the config in config/default.json
  3. `node test.js`
  - sql schema : 
  
  ![auction_sql_schema jpg](https://user-images.githubusercontent.com/96759292/203079936-0d7d37c5-0b07-460b-859f-453ce033d404.jpg)
  ![流程圖](https://user-images.githubusercontent.com/100771005/204227158-e5edc1e4-333b-46a1-aca4-b8522cca9768.png)

  - 說明 : <b>賣家買家之間有著複雜關係。</b>
  - 總共有五個資料表。
  - <b>預設帳號：</b>
  - 買家：1
  - 賣家：2
  <ul>
  <li>先進入se_login.html進行帳號登入</li>
  <li>買家就輸入1 賣家就輸入2</li>
  <li>輸入1，顯示買家頁面 
  <ul>
    <li>點選可競標的商品，輸入高於競標商品的價格即可競標</li>
    <li>顯示歷史購買紀錄</li>
  </ul>
  </li>
  - <li>輸入2，顯示賣家頁面
  <ul>
    <li>新增拍賣商品，設定初始價格以及最高價格</li>
    <li>顯示歷史售出紀錄</li>
    <li>顯示拍賣品清單，可以點選開始競標，買家的頁面才可以競標，或是按確認結標，結束商品的競標</li>
  </ul>
  </li>
  </ul>
  
  
  
  


