const TRANSIT = {
  hongkong_west_kowloon_to_shenzhen_north: {range: 32000, tilt: 0, duration: 7}, // dist: 38.7198
  shenzhen_north_to_guangzhou_south: {range: 42000, tilt: 0, duration: 10}, // dist: 102.4126
  guangzhou_south_to_changsha_south: {range: 60000, tilt: 0, duration: 15}, // dist: 620.0347
  changsha_south_to_wuhan: {range: 52000, tilt: 0, duration: 13}, // dist: 347.7061
  wuhan_to_zhengzhou_east: {range: 52000, tilt: 0, duration: 10},
  zhengzhou_east_to_shijiazhuang: {range: 52000, tilt: 0, duration: 10},
  shijiazhuang_to_beijing_west: {range: 52000, tilt: 0, duration: 10} // dist: 280.9590
}

const CHECKPOINTS = {
  overview: {coordinates: [114.633611, 26.556607], range: 4718355, tilt: 40, heading: 0},
  hongkong_west_kowloon: [
    {coordinates: [114.161703, 22.289759], range: 28130, tilt: 0, heading: 0},
    {coordinates: [114.161703, 22.289759], range: 14130, tilt: 54, heading: 36}
  ],
  shenzhen_north: [
    {coordinates: [114.038656, 22.536813], range: 16060, tilt: 54, heading: 36}
  ],
  guangzhou_south: [
    {coordinates: [113.278801, 23.074849], range: 27680, tilt: 54, heading: 62}
  ],
  changsha_south: [
    {coordinates: [112.989842, 28.159448], range: 22922, tilt: 53, heading: -35}
  ],
  wuhan: [
    {coordinates: [114.272526, 30.517163], range: 34734, tilt: 60, heading: 22}
  ],
  zhengzhou_east: [
    {coordinates: [113.635864, 34.722789], range: 34137, tilt: 55, heading: 41}
  ],
  shijiazhuang: [
    {coordinates: [114.488105, 38.002674], range: 21492, tilt: 64, heading: 4}
  ],
  beijing_west: [
    {coordinates: [116.397819, 39.901404], range: 24293, tilt: 48, heading: 0}
  ]
}

const TRANSITION_TIME = 4
const FRAME_RATE = 30

module.exports = {
  TRANSIT,
  CHECKPOINTS,
  TRANSITION_TIME,
  FRAME_RATE
}
