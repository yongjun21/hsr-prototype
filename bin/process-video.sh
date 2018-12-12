#! /usr/bin/env bash

cd video

function process {
  ffmpeg -i raw/$1.m4v -x264-params keyint=30:scenecut=0 -an -crf 23 -movflags faststart -filter:v crop=1280:720:320:180 processed/$1.mp4
}

if [ $# -gt 0 ]
then
  for video in $@
  do
    process $video
  done
else
  for video in raw/*
  do
    process $video
  done
fi
