#! /usr/bin/env bash

cd video

function process {
  if [[ -z $MOBILE ]]
  then
    ffmpeg -i raw/$1.m4v -crf 28 -x264-params keyint=30:scenecut=0 -an -movflags faststart -vf crop=1920:1200:0:120,eq=saturation=1.3:brightness=-0.01,unsharp=5:5:0.5:5:5:0.0 -preset veryslow processed/$1.mp4
  else
    ffmpeg -i raw/mobile/$1.m4v -crf 28 -x264-params keyint=30:scenecut=0 -an -movflags faststart -vf crop=486:864:0:120,eq=saturation=1.3:brightness=-0.01,unsharp=5:5:0.5:5:5:0.0 -preset veryslow processed/mobile/$1.mp4
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
