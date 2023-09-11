#!/bin/bash

CONTAINERNAME=webmp4viewer
VERSION=latest

docker run -ti --rm --name ${CONTAINERNAME} -v /raid/data/00_students/gb3031877:/opt/app/mnt -p 11301:11301 ${CONTAINERNAME}:${VERSION} bash
