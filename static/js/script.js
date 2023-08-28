document.getElementById('toggle-checkboxes').addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('.video-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.style.display = checkbox.style.display === 'none' ? 'inline-block' : 'none';
    });
});

document.getElementById('encoding').addEventListener('click', function() {
    var selectedVideos = [];
    var checkboxes = document.querySelectorAll('.video-checkbox:checked');
    checkboxes.forEach(function(checkbox) {
        selectedVideos.push(checkbox.value);
    });

    var selectedVideosString = selectedVideos.join(', ');

    // 選択された動画パスをPOSTリクエストで送信
    selectedVideos.forEach((selectVideo)=>{
        console.log(selectVideo)
        fetch('/convert_video' + selectVideo, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            // サーバからのレスポンスを処理
            window.location.href = window.location.href;
        })
        .catch(error => {
            console.log("Error");
            console.error('Error:', error);
        });
    })
});

document.getElementById('show-selected').addEventListener('click', function() {
    var selectedVideos = [];
    var checkboxes = document.querySelectorAll('.video-checkbox:checked');
    checkboxes.forEach(function(checkbox) {
        selectedVideos.push(checkbox.value);
    });

    var selectedVideosString = selectedVideos.join(', ');

    // 選択された動画パスをPOSTリクエストで送信
    fetch('/post/selected_video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selectedVideos: selectedVideos })
    })
    .then(response => response.json())
    .then(data => {
        // サーバからのレスポンスを処理
        window.location.href = '/play/multi';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// script.js
document.addEventListener('DOMContentLoaded', function() {

    // All select and All deselect
    var selectAllButton = document.getElementById('select-all');
    var deselectAllButton = document.getElementById('deselect-all');
    var checkboxes = document.querySelectorAll('.video-checkbox');

    selectAllButton.addEventListener('click', function() {
        console.log("onclick");
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    });

    deselectAllButton.addEventListener('click', function() {
        console.log("onclick");

        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    });


    // const selectFolderButton = document.getElementById('select-folder-button');
    const folderPathInput = document.getElementById('folder-path');
    const folderForm = document.getElementById('folder-form');

    // selectFolderButton.addEventListener('click', function() {
    //     const folderInput = document.createElement('input');
    //     folderInput.type = 'file';
    //     folderInput.webkitdirectory = true;
    //     folderInput.addEventListener('change', function() {
    //         if (folderInput.files.length > 0) {
    //             folderPathInput.value = folderInput.files[0].path;
    //         }
    //     });
    //     folderInput.click();
    // });

    folderForm.addEventListener('submit', function(event) {
        // フォームが送信される前にフォルダのパスを設定
        folderPathInput.disabled = false;
    });

    var deleteButtons = document.querySelectorAll('.delete-button');
    attachDeleteEvent(deleteButtons);

    var deleteSelectedButton = document.querySelector('#delete-selected-files');
    if (deleteSelectedButton) {
        deleteSelectedButton.addEventListener('click', deleteSelectedFiles);
    }

   

});

function attachDeleteEvent(deleteButtons) {
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var filePath = this.getAttribute('data-file');
            showConfirmDialogAndDelete(filePath);
        });
    });
}

function showConfirmDialogAndDelete(filePath) {
    var confirmed = confirm(filePath + " を消します。大丈夫ですか？");
    if (confirmed) {
        deleteFile(filePath);
    }
}

function deleteFile(filePath) {
    fetch('/delete_file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath: filePath })
    })
    .then(response => response.json())
    .then(data => {
        handleDeleteResponse();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function handleDeleteResponse() {
    window.location.href = window.location.href;
}

function deleteSelectedFiles() {
    var selectedVideos = [];
    var checkboxes = document.querySelectorAll('.video-checkbox:checked');
    checkboxes.forEach(function(checkbox) {
        selectedVideos.push(checkbox.value);
    });
    var selectedVideosString = selectedVideos.join(', ');

    var confirmed = confirm(selectedVideosString + " を消します。大丈夫ですか？");
    if (confirmed) {
        selectedVideos.forEach(function(selectVideo) {
            deleteFile(selectVideo);
        });
    }
}
