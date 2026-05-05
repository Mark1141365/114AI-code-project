let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = 'models/model.json';
    const metadataURL = 'models/metadata.json';

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById('webcam-container').appendChild(webcam.canvas);
        labelContainer = document.getElementById('result');

        // 啟用按鈕
        document.getElementById('capture-btn').disabled = false;
        document.getElementById('upload-btn').disabled = false;
        labelContainer.innerHTML = '模型載入完成，請拍攝或上傳圖片進行辨識';
    } catch (error) {
        console.error('模型載入失敗:', error);
        labelContainer.innerHTML = '模型載入失敗，請檢查控制台';
    }
}

async function loop() {
    webcam.update();
    window.requestAnimationFrame(loop);
}

async function predict(canvas) {
    const prediction = await model.predict(canvas);
    let maxProb = 0;
    let className = '';
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > maxProb) {
            maxProb = prediction[i].probability;
            className = prediction[i].className;
        }
    }
    labelContainer.innerHTML = `辨識結果: ${className} (信心度: ${(maxProb * 100).toFixed(2)}%)`;
}

document.getElementById('capture-btn').addEventListener('click', () => predict(webcam.canvas));

document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('image-upload').click();
});

document.getElementById('image-upload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            labelContainer.innerHTML = '請選擇圖片文件';
            return;
        }
        labelContainer.innerHTML = '正在處理圖片...';
        try {
            const img = new Image();
            img.onload = async () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 224;
                    canvas.height = 224;
                    ctx.drawImage(img, 0, 0, 224, 224);
                    await predict(canvas);
                } catch (error) {
                    console.error('預測失敗:', error);
                    labelContainer.innerHTML = '辨識失敗，請重試';
                }
            };
            img.onerror = () => {
                labelContainer.innerHTML = '圖片載入失敗';
            };
            img.src = URL.createObjectURL(file);
        } catch (error) {
            console.error('處理圖片失敗:', error);
            labelContainer.innerHTML = '處理圖片失敗';
        }
    }
});

init();