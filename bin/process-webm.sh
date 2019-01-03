#! /usr/bin/env bash

cd video

function process {
  if [[ -z $MOBILE ]]
  then
    ffmpeg -i raw/$1.webm -c:v libvpx-vp9 -b:v 0 -crf 42 -g 30 -an -threads 7 -vf crop=1920:1200:0:120 -speed 0 processed/$1.webm
  else
    ffmpeg -i raw/$1.webm -c:v libvpx-vp9 -b:v 0 -crf 42 -g 30 -an -threads 7 -vf crop=675:1200:622:120,scale=414:736 -speed 0 processed/mobile/$1.webm
  fi
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
