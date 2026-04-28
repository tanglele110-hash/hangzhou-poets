import type { Period, HistoricalEvent, TagGroup } from '../types';

export const START_YEAR = 550;
export const END_YEAR = 1350;
export const SCALE = 6;
export const COLUMN_WIDTH = 95;
export const PADDING_YEARS = 8;

export const MIN_HEIGHT_PX: Record<number, number> = {
  3: 260,
  2: 200,
  1: 150,
};

export const PERIODS: Period[] = [
  { name: '初唐', start: 618, end: 712, color: '#F5F3F2' },
  { name: '盛唐', start: 713, end: 755, color: '#EAE5E3' },
  { name: '中唐', start: 766, end: 835, color: '#DFE0D9' },
  { name: '晚唐', start: 836, end: 907, color: '#D4D3CA' },
  { name: '五代', start: 907, end: 960, color: '#C9C8BE' },
  { name: '北宋', start: 960, end: 1127, color: '#BEBCAE' },
  { name: '南宋', start: 1127, end: 1279, color: '#AFAEA0' },
];

export const EVENTS: HistoricalEvent[] = [
  { name: '隋设杭州', start: 589, end: 589 },
  { name: '开凿运河', start: 605, end: 610 },
  { name: '贞观之治', start: 627, end: 649 },
  { name: '武周代唐', start: 690, end: 704 },
  { name: '开元盛世', start: 713, end: 741 },
  { name: '安史之乱', start: 755, end: 763 },
  { name: '白居易刺杭', start: 822, end: 824 },
  { name: '黄巢起义', start: 878, end: 884 },
  { name: '钱镠任节度使', start: 893, end: 893 },
  { name: '吴越建国', start: 907, end: 907, yOffset: -12 },
  { name: '修筑捍海塘', start: 910, end: 910, yOffset: 12 },
  { name: '钱弘俶继任', start: 948, end: 948 },
  { name: '钱俶纳土归宋', start: 978, end: 978 },
  { name: '苏轼知杭', start: 1089, end: 1091 },
  { name: '靖康之变', start: 1126, end: 1127, yOffset: -6 },
  { name: '定都临安', start: 1138, end: 1138, yOffset: 6 },
  { name: '临安降元', start: 1276, end: 1276, yOffset: -12 },
  { name: '崖州海战', start: 1279, end: 1279, yOffset: 12 },
];

export const TAG_GROUPS: TagGroup[] = [
  { prefix: '文人类型', tags: ['诗人', '词人', '双擅'] },
  { prefix: '行迹状态', tags: ['本土', '游历', '隐居', '任职'] },
  { prefix: '文学流派', tags: ['豪放', '婉约', '田园', '隐逸', '乐府', '诗家'] },
  { prefix: '科举成就', tags: ['状元', '进士', '明经', '落第', '不试', '无考'] },
  { prefix: '官职成就', tags: ['君主', '宰辅', '尚书', '侍从', '翰林', '郎官', '馆阁', '寺监', '州郡', '县级', '学官', '幕职', '无官', '布衣', '无考'] },
];

export const ZOOM_MIN = 0.08;
export const ZOOM_MAX = 2.5;
export const ZOOM_STEP = 0.06;
