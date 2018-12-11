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
  hongkong_west_kowloon: [
    {coordinates: [114.160900, 22.285381], range: 5849, tilt: 52, heading: 38}
  ],
  shenzhen_north: [
    {coordinates: [114.034984, 22.533823], range: 7501, tilt: 46, heading: 39}
  ],
  guangzhou_south: [
    {coordinates: [113.283313, 23.043461], range: 18580, tilt: 52, heading: 28}
  ],
  changsha_south: [
    {coordinates: [112.969073, 28.161649], range: 19649, tilt: 48, heading: -35}
  ],
  wuhan: [
    {coordinates: [114.276466, 30.504629], range: 20267, tilt: 48, heading: 19}
  ],
  zhengzhou_east: [
    {coordinates: [113.636560, 34.699120], range: 23566, tilt: 51, heading: 37}
  ],
  shijiazhuang: [
    {coordinates: [114.488498, 37.991969], range: 10255, tilt: 55, heading: 2}
  ],
  beijing_west: [
    {coordinates: [116.398056, 39.890202], range: 16302, tilt: 48, heading: 0}
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
