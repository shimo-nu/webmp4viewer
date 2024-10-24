FROM python:3.8

COPY . /opt/app

WORKDIR /opt/app

RUN apt update && apt install -y ffmpeg

RUN python -m pip install -r requirements.txt


