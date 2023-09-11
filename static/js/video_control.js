
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

    judgeExtension();

    const sortableList = document.querySelector('.sortable-list');
    const sortable = new Sortable(sortableList, {
        animation: 150,
        handle: '.sortable-item',
        onUpdate: function(evt) {
            // 並び替え完了時の処理を記述
        }
    });

    
});

function judgeExtension() {
    // judge extension
    // img or video
    const mediaWrapper = document.getElementById('mediaWrapper');
    const imageContainer = document.getElementById('imageContainer');
    const image = document.getElementById('image');
    const videoContainer = document.getElementById('videoContainer');
    const videoPlayer = document.getElementById('videoPlayer');

    // 現在のURLを取得
    const currentURL = window.location.href;

    // 現在のURLからファイル名（拡張子を含む）を取得
    const filePath = currentURL.substring(currentURL.lastIndexOf('/') + 1);
    // 拡張子を取得
    const fileExtension = filePath.split('.').pop().toLowerCase();

    if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'gif') {
        // 画像ファイルの場合
        imageContainer.style.display = 'block';
        videoContainer.style.display = 'none';
    } else if (fileExtension === 'mp4' || fileExtension === 'mkv' || fileExtension === 'avi') {
        // 動画ファイルの場合
        imageContainer.style.display = 'none';
        videoContainer.style.display = 'block';
    } else {
        // サポートされていないファイル形式の場合、メッセージを表示するなどの処理を追加
        console.log('Unsupported file format');
    }
}