/**
 * 诗人展示 meta —— 纯派生 / 硬编码补充数据，不污染 poets.ts 数据 schema。
 *
 * 字段说明：
 *  - pinyin       : 大写拼音段，如 ['BAI', 'JU', 'YI']
 *  - hangzhouRole : 在杭事迹一行（年份 · 身份 · 关键事件）
 *  - accent       : 朱色竖排"诗眼"短语（2-4 字），落版到详情卡右侧
 *  - quote        : 代表诗节选 + 出处
 *  - seal         : 朱印字（默认取诗人姓首字）
 *
 * 22 位核心诗人（weight=3）做完整 hardcode；
 * 其他诗人有 pinyin，其余字段从 short_desc / works_short / WORKS_CONTENT fallback。
 */

import type { Poet } from '../data';

export interface PoetMeta {
  pinyin: string[];
  hangzhouRole?: string;
  /** 朱色竖排"诗眼"，仅核心 22 位 hardcode；非核心诗人不显示，避免切片不通顺 */
  accent?: string;
  quote?: { lines: string[]; source: string };
  seal: string;
}

/** 全 81 位诗人的拼音表（大写、不带声调） */
const PINYIN: Record<string, string[]> = {
  // 初唐
  褚亮: ['CHU', 'LIANG'],
  骆宾王: ['LUO', 'BIN', 'WANG'],
  宋之问: ['SONG', 'ZHI', 'WEN'],
  // 盛唐
  贺知章: ['HE', 'ZHI', 'ZHANG'],
  孟浩然: ['MENG', 'HAO', 'RAN'],
  李白: ['LI', 'BAI'],
  王昌龄: ['WANG', 'CHANG', 'LING'],
  崔颢: ['CUI', 'HAO'],
  储光羲: ['CHU', 'GUANG', 'XI'],
  綦毋潜: ['QI', 'WU', 'QIAN'],
  // 中唐
  刘长卿: ['LIU', 'CHANG', 'QING'],
  顾况: ['GU', 'KUANG'],
  韦应物: ['WEI', 'YING', 'WU'],
  皎然: ['JIAO', 'RAN'],
  孟郊: ['MENG', 'JIAO'],
  张籍: ['ZHANG', 'JI'],
  韩愈: ['HAN', 'YU'],
  白居易: ['BAI', 'JU', 'YI'],
  刘禹锡: ['LIU', 'YU', 'XI'],
  柳宗元: ['LIU', 'ZONG', 'YUAN'],
  元稹: ['YUAN', 'ZHEN'],
  贾岛: ['JIA', 'DAO'],
  李绅: ['LI', 'SHEN'],
  许浑: ['XU', 'HUN'],
  // 晚唐
  杜牧: ['DU', 'MU'],
  李商隐: ['LI', 'SHANG', 'YIN'],
  温庭筠: ['WEN', 'TING', 'YUN'],
  陆龟蒙: ['LU', 'GUI', 'MENG'],
  皮日休: ['PI', 'RI', 'XIU'],
  司空图: ['SI', 'KONG', 'TU'],
  罗隐: ['LUO', 'YIN'],
  韦庄: ['WEI', 'ZHUANG'],
  方干: ['FANG', 'GAN'],
  贯休: ['GUAN', 'XIU'],
  鱼玄机: ['YU', 'XUAN', 'JI'],
  // 五代
  钱镠: ['QIAN', 'LIU'],
  // 北宋
  林逋: ['LIN', 'BU'],
  范仲淹: ['FAN', 'ZHONG', 'YAN'],
  柳永: ['LIU', 'YONG'],
  欧阳修: ['OU', 'YANG', 'XIU'],
  梅尧臣: ['MEI', 'YAO', 'CHEN'],
  曾巩: ['ZENG', 'GONG'],
  司马光: ['SI', 'MA', 'GUANG'],
  王安石: ['WANG', 'AN', 'SHI'],
  沈括: ['SHEN', 'KUO'],
  苏舜钦: ['SU', 'SHUN', 'QIN'],
  苏轼: ['SU', 'SHI'],
  苏辙: ['SU', 'ZHE'],
  黄庭坚: ['HUANG', 'TING', 'JIAN'],
  秦观: ['QIN', 'GUAN'],
  晏殊: ['YAN', 'SHU'],
  晏几道: ['YAN', 'JI', 'DAO'],
  贺铸: ['HE', 'ZHU'],
  周邦彦: ['ZHOU', 'BANG', 'YAN'],
  张先: ['ZHANG', 'XIAN'],
  // 南宋
  李清照: ['LI', 'QING', 'ZHAO'],
  岳飞: ['YUE', 'FEI'],
  陈与义: ['CHEN', 'YU', 'YI'],
  朱敦儒: ['ZHU', 'DUN', 'RU'],
  张孝祥: ['ZHANG', 'XIAO', 'XIANG'],
  范成大: ['FAN', 'CHENG', 'DA'],
  杨万里: ['YANG', 'WAN', 'LI'],
  陆游: ['LU', 'YOU'],
  尤袤: ['YOU', 'MAO'],
  林升: ['LIN', 'SHENG'],
  朱熹: ['ZHU', 'XI'],
  辛弃疾: ['XIN', 'QI', 'JI'],
  陈亮: ['CHEN', 'LIANG'],
  叶适: ['YE', 'SHI'],
  刘克庄: ['LIU', 'KE', 'ZHUANG'],
  姜夔: ['JIANG', 'KUI'],
  史达祖: ['SHI', 'DA', 'ZU'],
  吴文英: ['WU', 'WEN', 'YING'],
  周密: ['ZHOU', 'MI'],
  文天祥: ['WEN', 'TIAN', 'XIANG'],
  汪元量: ['WANG', 'YUAN', 'LIANG'],
  蒋捷: ['JIANG', 'JIE'],
  张炎: ['ZHANG', 'YAN'],
  王沂孙: ['WANG', 'YI', 'SUN'],
  谢翱: ['XIE', 'AO'],
  仇远: ['QIU', 'YUAN'],
  戴复古: ['DAI', 'FU', 'GU'],
};

/** 22 位核心诗人的杭州事迹一行 */
const HANGZHOU_ROLE: Record<string, string> = {
  贺知章: '744 · 弃官还乡 · 诗酒终老于越州',
  孟浩然: '盛唐 · 漫游浙东 · 渡浙江、入越中',
  李白: '盛唐 · 漫游吴越 · 入剡寻越中山水',
  顾况: '中唐 · 任著作郎 · 寓居杭州',
  白居易: '822 · 杭州刺史 · 主持修筑白堤',
  罗隐: '晚唐 · 寓居钱塘 · 钱镠麾下从事',
  钱镠: '907 · 吴越国王 · 营建杭州城与西湖',
  林逋: '北宋 · 隐于孤山 · 梅妻鹤子二十年',
  柳永: '北宋 · 望海潮一阕 · 写尽钱塘繁华',
  王安石: '熙宁 · 知江宁 · 数度往还杭州',
  苏轼: '1089 · 知杭州 · 疏浚西湖、筑苏堤',
  周邦彦: '北宋 · 钱塘人 · 大晟府制曲',
  李清照: '南渡 · 寓居临安 · 漱玉词在西湖侧',
  岳飞: '1142 · 风波亭 · 葬于杭州西子湖畔',
  陆游: '南宋 · 数度入临安 · 临安春雨初霁',
  林升: '1189 · 题临安邸 · 西湖歌舞几时休',
  辛弃疾: '南宋 · 数度往还临安 · 青玉案咏元夕',
  姜夔: '南宋 · 寓居西湖 · 白石道人风骨',
  吴文英: '南宋 · 寓居苏杭 · 梦窗词派宗主',
  周密: '南宋 · 寓居杭州 · 武林旧事记临安',
  文天祥: '1276 · 经临安 · 北行途中过钱塘',
  张炎: '宋末 · 寓居杭州 · 山中白云词',
};

/** 22 位核心诗人的"诗眼"——朱色竖排短语，2-4 字 */
const ACCENT: Record<string, string> = {
  贺知章: '少小离家',
  孟浩然: '潮平江阔',
  李白: '逸兴遄飞',
  顾况: '寓杭著郎',
  白居易: '白堤',
  罗隐: '蜂',
  钱镠: '陌上花开',
  林逋: '梅妻鹤子',
  柳永: '钱塘自古',
  王安石: '飞来峰顶',
  苏轼: '苏堤',
  周邦彦: '清真',
  李清照: '声声慢',
  岳飞: '满江红',
  陆游: '小楼一夜',
  林升: '醉把杭州',
  辛弃疾: '元夕',
  姜夔: '白石',
  吴文英: '梦窗',
  周密: '武林旧事',
  文天祥: '正气',
  张炎: '山中白云',
};

/** 22 位核心诗人的代表诗节选 */
const QUOTE: Record<string, { lines: string[]; source: string }> = {
  贺知章: {
    lines: ['少小离家老大回，', '乡音无改鬓毛衰。'],
    source: '回乡偶书',
  },
  孟浩然: {
    lines: ['潮落江平未有风，', '扁舟共济与曾翁。'],
    source: '渡浙江问舟中人',
  },
  李白: {
    lines: ['闻道稽山去，', '偏宜谢客才。'],
    source: '送友人寻越中山水',
  },
  顾况: {
    lines: ['井邑白云间，', '岩城远带山。'],
    source: '登重玄寺阁',
  },
  白居易: {
    lines: ['未能抛得杭州去，', '一半勾留是此湖。'],
    source: '春题湖上',
  },
  罗隐: {
    lines: ['采得百花成蜜后，', '为谁辛苦为谁甜。'],
    source: '蜂',
  },
  钱镠: {
    lines: ['陌上花开，', '可缓缓归矣。'],
    source: '寄妻',
  },
  林逋: {
    lines: ['疏影横斜水清浅，', '暗香浮动月黄昏。'],
    source: '山园小梅',
  },
  柳永: {
    lines: ['东南形胜，三吴都会，', '钱塘自古繁华。'],
    source: '望海潮',
  },
  王安石: {
    lines: ['不畏浮云遮望眼，', '自缘身在最高层。'],
    source: '登飞来峰',
  },
  苏轼: {
    lines: ['欲把西湖比西子，', '淡妆浓抹总相宜。'],
    source: '饮湖上初晴后雨',
  },
  周邦彦: {
    lines: ['念月榭携手，', '露桥闻笛。'],
    source: '兰陵王',
  },
  李清照: {
    lines: ['寻寻觅觅，', '冷冷清清，', '凄凄惨惨戚戚。'],
    source: '声声慢',
  },
  岳飞: {
    lines: ['三十功名尘与土，', '八千里路云和月。'],
    source: '满江红',
  },
  陆游: {
    lines: ['小楼一夜听春雨，', '深巷明朝卖杏花。'],
    source: '临安春雨初霁',
  },
  林升: {
    lines: ['暖风熏得游人醉，', '直把杭州作汴州。'],
    source: '题临安邸',
  },
  辛弃疾: {
    lines: ['众里寻他千百度，', '蓦然回首，那人却在，灯火阑珊处。'],
    source: '青玉案·元夕',
  },
  姜夔: {
    lines: ['二十四桥仍在，', '波心荡、冷月无声。'],
    source: '扬州慢',
  },
  吴文英: {
    lines: ['何处合成愁，', '离人心上秋。'],
    source: '唐多令',
  },
  周密: {
    lines: ['宫漏未央，', '一种相思别样长。'],
    source: '一萼红',
  },
  文天祥: {
    lines: ['人生自古谁无死，', '留取丹心照汗青。'],
    source: '过零丁洋',
  },
  张炎: {
    lines: ['楚江空晚，', '怅离群万里，恍然惊散。'],
    source: '解连环·孤雁',
  },
};

const FALLBACK_PINYIN = ['SHI', 'REN'];

export function getPoetMeta(poet: Poet): PoetMeta {
  const pinyin = PINYIN[poet.name] ?? FALLBACK_PINYIN;
  const seal = poet.name.charAt(0);
  const hangzhouRole = HANGZHOU_ROLE[poet.name] ?? deriveRole(poet);
  // accent 朱色竖排字仅核心诗人有，fallback 不显示，避免文字切片不通顺
  const accent = ACCENT[poet.name];
  const quote = QUOTE[poet.name];

  return {
    pinyin,
    hangzhouRole,
    accent,
    quote,
    seal,
  };
}

/** 没有 hardcode role 时，从 era + tags + short_desc 拼一行 */
function deriveRole(poet: Poet): string {
  const post = poet.tags.find((t) =>
    ['宰辅', '尚书', '侍从', '翰林', '州郡', '郎官', '县级', '君主'].includes(t),
  );
  const status = poet.tags.find((t) =>
    ['进士', '状元', '落第', '不试', '无考', '布衣', '无官'].includes(t),
  );
  const parts = [post, status, poet.short_desc].filter(Boolean) as string[];
  return parts.length > 0 ? parts.join(' · ') : poet.short_desc;
}
