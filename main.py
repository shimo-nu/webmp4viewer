import subprocess
from crypt import methods
from flask import Flask, render_template, request, send_from_directory, redirect, session, url_for, jsonify
from werkzeug.utils import secure_filename
import os
import secrets
from encode import convertMp4

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = os.path.abspath(os.path.dirname(__file__))
FILE_FOLDER = os.path.join(app.config['UPLOAD_FOLDER'], 'files')
UPLOAD_FOLDER = os.path.join(app.config['UPLOAD_FOLDER'], 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.secret_key = secrets.token_bytes(32)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def list_files_in_directory(directory):
    file_list = []
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path) or os.path.isdir(file_path):
            file_list.append(filename)
    return file_list



def is_directory(filename):
    path = None
    if 'current_directory' in session:
        path = os.path.join(app.config['UPLOAD_FOLDER'], session['current_directory'], filename)
    else:
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return os.path.isdir(path)


def list_files_recursive(directory, depth=0, max_depth=1):
    file_list = []
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path) or os.path.isdir(file_path):
            file_list.append((filename, depth))
            if depth < max_depth and os.path.isdir(file_path):
                file_list.extend(list_files_recursive(file_path, depth + 1, max_depth))
    return file_list

@app.route('/')
def index():
    files = list_files_in_directory(app.config['UPLOAD_FOLDER'])
    return render_template('index.html', files=files, is_directory=is_directory,  uploads_dir = UPLOAD_FOLDER)

@app.route('/set/upload_dir', methods=['POST'])
def setUploadDirectory():
    folder_path = request.form.get('folderPath')
    # フォルダのパスを使用して適切な処理を行う
    app.config['UPLOAD_FOLDER'] = folder_path
    # global FILE_FOLDER, UPLOAD_FOLDER
    # FILE_FOLDER = os.path.join(app.config['UPLOAD_FOLDER'], 'files')
    # UPLOAD_FOLDER = os.path.join(app.config['UPLOAD_FOLDER'], 'uploads')        
    return redirect('/')

@app.route('/fetch_data', methods=['POST'])
def fetchData():
    sim_name = request.form['sim_name']
    experiment_name = request.form['experiment_name']
    output_dir = request.form['output_dir']
    print(output_dir)
    if (os.path.isfile('fetch.sh')):
        result = subprocess.run(['bash', 'fetch.sh', sim_name, experiment_name, output_dir], stdout=subprocess.PIPE, text=True)
        generated_maessage = result.stdout.strip()
        session.clear()
        return redirect('/' + sim_name + '/' + experiment_name + '/movie')
    else:
        return "Not found fetch.sh"

@app.route('/clear_session')
def clear_session():
    session.clear()
    files = list_files_in_directory(app.config['UPLOAD_FOLDER'])
    return render_template('index.html', files=files, is_directory=is_directory,  uploads_dir = UPLOAD_FOLDER)

@app.route('/<path:directory>/')
def browse_directory(directory):
    dir_path = os.path.join(app.config['UPLOAD_FOLDER'], directory)
    if os.path.isdir(dir_path):
        # if 'current_directory' in session:
        #     session['current_directory'].append(directory)
        # else:
        session['current_directory'] = directory
        files = list_files_in_directory(dir_path)
        return render_template('index.html', files=files, is_directory=is_directory, uploads_dir = UPLOAD_FOLDER)
    return "Invalid directory."


@app.route('/play/<path:filename>')
def play(filename):
    return render_template('play.html', filename=filename)

@app.route('/post/selected_video', methods=['POST'])
def postSelectedVideos():
    data = request.json
    selected_videos = data.get('selectedVideos', [])

    # 選択された動画パスを処理するコードを記述
    # 例: 選択された動画パスをログに出力
    print('Selected Videos:', selected_videos)
    session['selected_videos'] = selected_videos
    return jsonify(message='Selected video saved')

@app.route('/play/multi')
def multiPlay():
    if 'selected_videos' in session:
        return render_template('multi-play.html', video_paths=session['selected_videos'])
    else:
        return "not set videos"
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)



@app.route('/convert_video/<path:file_path>', methods=['GET', 'POST'])
def convert_video(file_path):
    # ファイル名を取得
    file_name = os.path.basename(file_path)
    new_file_name = file_name.split('.')[0] + '_re.' + file_name.split('.')[1]
    # パス（ファイル名を除く）を取得
    directory = os.path.dirname(file_path)

    convertMp4(os.path.join(app.config['UPLOAD_FOLDER'], file_path), os.path.join(app.config['UPLOAD_FOLDER'], directory, new_file_name))
    if 'current_directory' in session:
        print("session : {}".format(session['current_directory']))
    print(os.path.join(app.config['UPLOAD_FOLDER'], directory, new_file_name))
    if request.method == 'POST':
        response_data = {'status': 'success', 'new_filename': new_file_name}
        return jsonify(response_data)
    else:
        return redirect(url_for('play', filename=os.path.join(directory, new_file_name)))

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect('/')

@app.route('/delete_file', methods=['POST'])
def deleteFile():
    data = request.json
    file_path = data.get('filePath', '')

    try:
        if file_path:
            print("UPLOAD_FOLDER : {}".format(app.config['UPLOAD_FOLDER']))
            print("Remove {}".format(os.path.join(app.config['UPLOAD_FOLDER'], file_path)))

            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file_path.lstrip('/')))
            # print("remove {}".format(file_path))
            response_data = {'status': 'success', 'message': 'File deleted successfully.'}
        else:
            response_data = {'status': 'error', 'message': 'File path is missing.'}
    except Exception as e:
        response_data = {'status': 'error', 'message': str(e)}

    return jsonify(response_data)
if __name__ == '__main__':
    app.run(debug=True, port=18000)
