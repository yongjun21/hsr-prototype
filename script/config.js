const TRANSIT = {
  hongkong_west_kowloon_to_shenzhen_north: {range: 52000, tilt: 0, heading: 10, duration: 1.4}, // dist: 38.7198
  shenzhen_north_to_guangzhou_south: {range: 10000, tilt: 0, duration: 3.6}, // dist: 102.4126
  guangzhou_south_to_changsha_south: {range: 10000, tilt: 0, duration: 22.1}, // dist: 620.0347
  changsha_south_to_wuhan: {range: 10000, tilt: 0, duration: 12.4}, // dist: 347.7061
  wuhan_to_shijiazhuang: {range: 10000, tilt: 0, duration: 30.5}, // dist: 856.0625
  shijiazhuang_to_beijing_west: {range: 10000, tilt: 0, duration: 10.0} // dist: 280.9590
}

const CHECKPOINTS = {
  hongkong_west_kowloon: [
    {coordinates: [114.161703, 22.289759], range: 7100, tilt: 54, heading: 36}
  ],
  shenzhen_north: [
    {coordinates: [114.041537, 22.526765], range: 6000, tilt: 54, heading: 36}
  ],
  guangzhou_south: [
    {coordinates: [113.309925, 23.100481], range: 10000, tilt: 40}
  ],
  changsha_south: [
    {coordinates: [112.964496, 28.192951], range: 10000, tilt: 40}
  ],
  wuhan: [
    {coordinates: [114.272526, 30.517163], range: 10000, tilt: 40}
  ],
  shijiazhuang: [
    {coordinates: [114.488105, 38.002674], range: 10000, tilt: 40}
  ],
  beijing_west: [
    {coordinates: [116.397819, 39.901404], range: 10000, tilt: 40}
  ]
}

const TRANSITION_TIME = 3
const FRAME_RATE = 30

module.exports = {
  TRANSIT,
  CHECKPOINTS,
  TRANSITION_TIME,
  FRAME_RATE
}
