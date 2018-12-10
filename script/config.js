const TRANSIT = {
  hongkong_west_kowloon_to_shenzhen_north: {range: 10000, tilt: 0, duration: 15},
  shenzhen_north_to_guangzhou_south: {range: 10000, tilt: 0, duration: 15},
  guangzhou_south_to_changsha_south: {range: 10000, tilt: 0, duration: 15},
  changsha_south_to_wuhan: {range: 10000, tilt: 0, duration: 15},
  wuhan_to_shijiazhuang: {range: 10000, tilt: 0, duration: 15},
  shijiazhuang_to_beijing_west: {range: 10000, tilt: 0, duration: 15}
}

const CHECKPOINTS = {
  hongkong_west_kowloon: [
    {range: 8000, heading: 36, tilt: 54}
  ],
  shenzhen_north: [
    {coordinates: [114.041537, 22.526765], range: 6000, heading: 36, tilt: 54}
  ],
  guangzhou_south: [
    {range: 10000, tilt: 40}
  ],
  changsha_south: [
    {range: 10000, tilt: 40}
  ],
  wuhan: [
    {range: 10000, tilt: 40}
  ],
  shijiazhuang: [
    {range: 10000, tilt: 40}
  ],
  beijing_west: [
    {range: 10000, tilt: 40}
  ]
}

const TRANSITION_TIME = 3.5
const TRANSITION_PAUSE = 0.5
const FRAME_RATE = 30

module.exports = {
  TRANSIT,
  CHECKPOINTS,
  TRANSITION_TIME,
  TRANSITION_PAUSE,
  FRAME_RATE
}
