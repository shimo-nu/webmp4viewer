import ffmpeg

input_file = 'input_video.mov'
output_file = 'output_video.mp4'
def convertMp4(input_file, output_file):
    ffmpeg.input(input_file).output(output_file).run(overwrite_output=True)
