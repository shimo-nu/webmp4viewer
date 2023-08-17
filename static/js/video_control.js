
var videoElement = document.getElementById('video');
console.log("videoid" + videoElement   )
document.addEventListener('keydown', function(event) {
    // キーがSpaceキー（キーコード: 32）の場合
    if (event.keyCode === 32) {
        if (videoElement.paused) {
            videoElement.play();  // 停止中なら再生する
        } else {
            videoElement.pause(); // 再生中なら停止する
        }
    }
});
