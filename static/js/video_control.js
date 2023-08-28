
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

document.addEventListener('DOMContentLoaded', function() {
    const sortableList = document.querySelector('.sortable-list');
    const sortable = new Sortable(sortableList, {
        animation: 150,
        handle: '.sortable-item',
        onUpdate: function(evt) {
            // 並び替え完了時の処理を記述
        }
    });
});
