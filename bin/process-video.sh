#! /usr/bin/env bash

cd video

function process {
  if [[ -z $MOBILE ]]
  then
    ffmpeg -i raw/$1.m4v -x264-params keyint=30:scenecut=0 -an -crf 28 -movflags faststart -vf crop=1920:1200:0:120 -preset veryslow processed/$1.mp4
  else
    ffmpeg -i raw/$1.m4v -x264-params keyint=30:scenecut=0 -an -crf 28 -movflags faststart -vf crop=675:1200:622:120,scale=414:736 -preset veryslow processed/mobile/$1.mp4
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
