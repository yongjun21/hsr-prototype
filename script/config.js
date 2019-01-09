const TRANSIT = {
  hongkong_west_kowloon_to_shenzhen_north: {range: 20000, tilt: 0, duration: 2}, // dist: 38.7198
  shenzhen_north_to_guangzhou_south: {range: 40000, tilt: 0, duration: 2}, // dist: 102.4126
  guangzhou_south_to_changsha_south: {range: 60000, tilt: 0, duration: 4}, // dist: 620.0347
  changsha_south_to_wuhan: {range: 50000, tilt: 0, duration: 3}, // dist: 347.7061
  wuhan_to_zhengzhou_east: {range: 50000, tilt: 0, duration: 3},
  zhengzhou_east_to_shijiazhuang: {range: 50000, tilt: 0, duration: 3},
  shijiazhuang_to_beijing_west: {range: 30000, tilt: 0, duration: 3} // dist: 280.9590
}

const CHECKPOINTS = {
  overview: {coordinates: [115.292158, 31.088956], range: 3356561, tilt: 0, heading: 0},
  hongkong_west_kowloon: [
    {coordinates: [114.161703, 22.289759], range: 10000, tilt: 0, heading: 0},
    {coordinates: [114.161703, 22.289759], range: 6000, tilt: 54, heading: 36}
  ],
  shenzhen_north: [
    {coordinates: [114.038656, 22.536813], range: 10000, tilt: 54, heading: 36}
  ],
  guangzhou_south: [
    {coordinates: [113.278801, 23.064849], range: 25000, tilt: 45, heading: 36}
  ],
  changsha_south: [
    {coordinates: [112.989842, 28.159448], range: 39000, tilt: 54, heading: -36}
  ],
  wuhan: [
    {coordinates: [114.272526, 30.517163], range: 28000, tilt: 60, heading: 12}
  ],
  zhengzhou_east: [
    {coordinates: [113.635864, 34.722789], range: 32800, tilt: 55, heading: 36}
  ],
  shijiazhuang: [
    {coordinates: [114.487613, 37.987364], range: 21400, tilt: 59, heading: 0}
  ],
  beijing_west: [
    {coordinates: [116.397819, 39.901404], range: 23250, tilt: 48, heading: -1}
  ]
}

const ENTER_TIME = 2
const TRANSITION_TIME = 0.666667
const FRAME_RATE = 30

module.exports = {
  TRANSIT,
  CHECKPOINTS,
  ENTER_TIME,
  TRANSITION_TIME,
  FRAME_RATE
}
