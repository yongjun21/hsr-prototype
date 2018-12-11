#! /usr/bin/env bash

cd video

function process {
  ffmpeg -i raw/$1.mp4 -vcodec libx264 -x264-params keyint=30:scenecut=0 -an -pix_fmt yuv420p -crf 23 -movflags faststart processed/$1.mp4
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
