#! /usr/bin/env bash

cd video

function process {
  if [[ -z $MOBILE ]]
  then
    ffmpeg -i raw/$1.webm -c:v libvpx-vp9 -b:v 0 -crf 42 -g 30 -an -threads 7 -vf crop=1920:1200:0:120,eq=saturation=1.3:brightness=-0.01,scale=1600:1000,unsharp=5:5:1:5:5:0.0 -speed 0 processed/$1.webm
  else
    ffmpeg -i raw/mobile/$1.webm -c:v libvpx-vp9 -b:v 0 -crf 42 -g 30 -an -threads 7 -vf crop=414:736:0:120,eq=saturation=1.3:brightness=-0.01,unsharp=5:5:0.5:5:5:0.0 processed/mobile/$1.webm
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
