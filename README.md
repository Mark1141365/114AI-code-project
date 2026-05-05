# 114AI-code-project

## 垃圾分類手機WEB APP

這是一個使用前端技術開發的垃圾分類手機APP，具有響應式設計。

### 功能
- 使用手機攝影機拍攝照片
- 上傳圖片文件進行辨識
- 利用Teachable Machine訓練的模型進行垃圾分類辨識
- 顯示辨識結果和信心度

### 技術
- HTML5/CSS3 for UI
- JavaScript for 邏輯
- TensorFlow.js for 模型載入和預測
- Teachable Machine for 模型

### 運行方式
1. 確保有Python環境
2. 運行 `python3 -m http.server 8000`
3. 在瀏覽器中訪問 `http://localhost:8000`

### 模型
模型文件位於 `models/` 資料夾，包含：
- model.json: 模型架構
- metadata.json: 模型元數據
- weights.bin: 模型權重

分類類別: 鞋子, 電池, 塑膠, 玻璃