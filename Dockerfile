FROM python:3.8

COPY . /opt/app

WORKDIR /opt/app

RUN apt update

RUN python -m pip install -r requirements.txt


