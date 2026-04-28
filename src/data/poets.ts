export interface Poet {
  name: string;
  birth_year: number;
  death_year: number;
  era: string;
  lane: number;
  weight: number;
  tags: string[];
  works_short: string;
  short_desc: string;
  unknown_dates?: boolean;
}

export const poets: Poet[] = [
  {
    "name": "褚亮",
    "birth_year": 560,
    "death_year": 647,
    "era": "初唐",
    "lane": 1,
    "weight": 2,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "进士",
      "侍从"
    ],
    "works_short": "奉和望月应魏王教",
    "short_desc": "杭州开国重臣"
  },
  {
    "name": "骆宾王",
    "birth_year": 619,
    "death_year": 684,
    "era": "初唐",
    "lane": 1,
    "weight": 2,
    "tags": [
      "诗人",
      "游历",
      "诗家",
      "进士",
      "侍从"
    ],
    "works_short": "灵隐寺",
    "short_desc": "初唐四杰"
  },
  {
    "name": "宋之问",
    "birth_year": 656,
    "death_year": 712,
    "era": "初唐",
    "lane": 3,
    "weight": 2,
    "tags": [
      "诗人",
      "任职",
      "诗家",
      "进士",
      "州郡"
    ],
    "works_short": "灵隐寺",
    "short_desc": "最早西湖诗"
  },
  {
    "name": "贺知章",
    "birth_year": 659,
    "death_year": 744,
    "era": "盛唐",
    "lane": 2,
    "weight": 3,
    "tags": [
      "诗人",
      "本土",
      "田园",
      "状元",
      "侍从"
    ],
    "works_short": "咏柳",
    "short_desc": "状元归乡杭州"
  },
  {
    "name": "孟浩然",
    "birth_year": 689,
    "death_year": 740,
    "era": "盛唐",
    "lane": 4,
    "weight": 3,
    "tags": [
      "诗人",
      "游历",
      "田园",
      "落第",
      "布衣"
    ],
    "works_short": "渡浙江问舟中人",
    "short_desc": "山水诗奠基"
  },
  {
    "name": "李白",
    "birth_year": 701,
    "death_year": 762,
    "era": "盛唐",
    "lane": 1,
    "weight": 3,
    "tags": [
      "诗人",
      "游历",
      "豪放",
      "不试",
      "翰林"
    ],
    "works_short": "送友人寻越中山水",
    "short_desc": "盛唐杭州代表"
  },
  {
    "name": "刘长卿",
    "birth_year": 709,
    "death_year": 786,
    "era": "中唐",
    "lane": 2,
    "weight": 2,
    "tags": [
      "诗人",
      "任职",
      "田园",
      "进士",
      "州郡"
    ],
    "works_short": "七里滩重送",
    "short_desc": "杭州诗坛领袖"
  },
  {
    "name": "张志和",
    "birth_year": 732,
    "death_year": 774,
    "era": "中唐",
    "lane": 4,
    "weight": 2,
    "tags": [
      "词人",
      "隐居",
      "隐逸",
      "明经",
      "县级"
    ],
    "works_short": "渔歌子",
    "short_desc": "隐逸词开创"
  },
  {
    "name": "韦应物",
    "birth_year": 737,
    "death_year": 792,
    "era": "中唐",
    "lane": 1,
    "weight": 3,
    "tags": [
      "诗人",
      "任职",
      "田园",
      "不试",
      "州郡"
    ],
    "works_short": "登重玄寺阁",
    "short_desc": "杭州刺史"
  },
  {
    "name": "金昌绪",
    "birth_year": 740,
    "death_year": 780,
    "era": "盛唐",
    "lane": 1,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "无考"
    ],
    "works_short": "春怨",
    "short_desc": "绝句经典"
  },
  {
    "name": "章八元",
    "birth_year": 743,
    "death_year": 829,
    "era": "中唐",
    "lane": 3,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "田园",
      "进士",
      "县级"
    ],
    "works_short": "新安江行",
    "short_desc": "桐庐诗人"
  },
  {
    "name": "白居易",
    "birth_year": 772,
    "death_year": 846,
    "era": "中唐",
    "lane": 3,
    "weight": 3,
    "tags": [
      "双擅",
      "任职",
      "乐府",
      "进士",
      "尚书"
    ],
    "works_short": "钱塘湖春行",
    "short_desc": "西湖奠基人"
  },
  {
    "name": "刘禹锡",
    "birth_year": 772,
    "death_year": 842,
    "era": "中唐",
    "lane": 4,
    "weight": 2,
    "tags": [
      "双擅",
      "游历",
      "豪放",
      "进士",
      "侍从"
    ],
    "works_short": "观浙江涛",
    "short_desc": "杭州唱和"
  },
  {
    "name": "皇甫湜",
    "birth_year": 777,
    "death_year": 835,
    "era": "中唐",
    "lane": 2,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "进士",
      "郎官"
    ],
    "works_short": "题浯溪石",
    "short_desc": "古文运动"
  },
  {
    "name": "徐凝",
    "birth_year": 779,
    "death_year": 853,
    "era": "中唐",
    "lane": 1,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "田园",
      "落第",
      "布衣"
    ],
    "works_short": "杭州祝涛头",
    "short_desc": "钱塘风物"
  },
  {
    "name": "元稹",
    "birth_year": 779,
    "death_year": 831,
    "era": "中唐",
    "lane": 2,
    "weight": 2,
    "tags": [
      "诗人",
      "游历",
      "乐府",
      "进士",
      "宰辅"
    ],
    "works_short": "杭州春日见寄",
    "short_desc": "元白唱和"
  },
  {
    "name": "姚合",
    "birth_year": 779,
    "death_year": 855,
    "era": "中唐",
    "lane": 3,
    "weight": 2,
    "tags": [
      "诗人",
      "任职",
      "诗家",
      "进士",
      "侍从"
    ],
    "works_short": "杭州观潮",
    "short_desc": "修西湖水利"
  },
  {
    "name": "章孝标",
    "birth_year": 791,
    "death_year": 873,
    "era": "晚唐",
    "lane": 4,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "进士",
      "馆阁"
    ],
    "works_short": "归燕词",
    "short_desc": "桐庐诗人"
  },
  {
    "name": "杜牧",
    "birth_year": 803,
    "death_year": 852,
    "era": "晚唐",
    "lane": 1,
    "weight": 2,
    "tags": [
      "双擅",
      "任职",
      "诗家",
      "进士",
      "侍从"
    ],
    "works_short": "睦州四韵",
    "short_desc": "睦州刺史"
  },
  {
    "name": "方干",
    "birth_year": 809,
    "death_year": 888,
    "era": "晚唐",
    "lane": 2,
    "weight": 2,
    "tags": [
      "诗人",
      "隐居",
      "诗家",
      "落第",
      "布衣"
    ],
    "works_short": "旅次钱塘",
    "short_desc": "江南诗派"
  },
  {
    "name": "李频",
    "birth_year": 818,
    "death_year": 876,
    "era": "晚唐",
    "lane": 3,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "田园",
      "进士",
      "州郡"
    ],
    "works_short": "渡汉江",
    "short_desc": "五律代表"
  },
  {
    "name": "罗邺",
    "birth_year": 825,
    "death_year": 880,
    "era": "晚唐",
    "lane": 4,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "落第",
      "布衣"
    ],
    "works_short": "流水",
    "short_desc": "江东三罗"
  },
  {
    "name": "陆龟蒙",
    "birth_year": 830,
    "death_year": 881,
    "era": "晚唐",
    "lane": 4,
    "weight": 2,
    "tags": [
      "诗人",
      "游历",
      "隐逸",
      "落第",
      "布衣"
    ],
    "works_short": "杭州晚眺",
    "short_desc": "皮陆并称"
  },
  {
    "name": "贯休",
    "birth_year": 832,
    "death_year": 912,
    "era": "五代",
    "lane": 2,
    "weight": 2,
    "tags": [
      "诗人",
      "游历",
      "隐逸",
      "不试",
      "无官"
    ],
    "works_short": "献钱尚父",
    "short_desc": "一剑霜寒十四州"
  },
  {
    "name": "罗隐",
    "birth_year": 833,
    "death_year": 909,
    "era": "晚唐",
    "lane": 1,
    "weight": 3,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "落第",
      "侍从"
    ],
    "works_short": "蜂",
    "short_desc": "杭州文坛领袖"
  },
  {
    "name": "章碣",
    "birth_year": 836,
    "death_year": 905,
    "era": "晚唐",
    "lane": 2,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "落第",
      "布衣"
    ],
    "works_short": "焚书坑",
    "short_desc": "咏史诗"
  },
  {
    "name": "皮日休",
    "birth_year": 838,
    "death_year": 883,
    "era": "晚唐",
    "lane": 3,
    "weight": 2,
    "tags": [
      "诗人",
      "游历",
      "乐府",
      "进士",
      "学官"
    ],
    "works_short": "天竺寺桂子",
    "short_desc": "西湖题咏"
  },
  {
    "name": "罗虬",
    "birth_year": 840,
    "death_year": 881,
    "era": "晚唐",
    "lane": 3,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "进士",
      "州郡"
    ],
    "works_short": "比红儿诗",
    "short_desc": "江东三罗"
  },
  {
    "name": "皇甫松",
    "birth_year": 850,
    "death_year": 900,
    "era": "晚唐",
    "lane": 4,
    "weight": 1,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "无考"
    ],
    "works_short": "梦江南",
    "short_desc": "花间派"
  },
  {
    "name": "钱镠",
    "birth_year": 852,
    "death_year": 932,
    "era": "五代",
    "lane": 1,
    "weight": 3,
    "tags": [
      "诗人",
      "本土",
      "任职",
      "诗家",
      "不试",
      "君主"
    ],
    "works_short": "陌上花开",
    "short_desc": "修筑捍海塘保境安民"
  },
  {
    "name": "翁洮",
    "birth_year": 860,
    "death_year": 900,
    "era": "晚唐",
    "lane": 2,
    "weight": 1,
    "tags": [
      "诗人",
      "本土",
      "隐逸",
      "进士",
      "郎官"
    ],
    "works_short": "春",
    "short_desc": "归隐建德"
  },
  {
    "name": "毛熙震",
    "birth_year": 891,
    "death_year": 947,
    "era": "五代",
    "lane": 3,
    "weight": 1,
    "tags": [
      "词人",
      "游历",
      "婉约",
      "侍从"
    ],
    "works_short": "浣溪沙",
    "short_desc": "花间派咏西湖"
  },
  {
    "name": "延寿",
    "birth_year": 904,
    "death_year": 975,
    "era": "五代",
    "lane": 4,
    "weight": 2,
    "tags": [
      "诗人",
      "本土",
      "隐逸",
      "不试",
      "无官"
    ],
    "works_short": "宗镜录",
    "short_desc": "净慈寺开山祖师"
  },
  {
    "name": "钱俶",
    "birth_year": 929,
    "death_year": 988,
    "era": "五代",
    "lane": 3,
    "weight": 2,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "不试",
      "君主"
    ],
    "works_short": "辞朝诗",
    "short_desc": "纳土归宋建雷峰塔"
  },
  {
    "name": "潘阆",
    "birth_year": 960,
    "death_year": 1009,
    "era": "宋",
    "lane": 1,
    "weight": 2,
    "tags": [
      "诗人",
      "隐居",
      "隐逸",
      "落第",
      "县级"
    ],
    "works_short": "酒泉子",
    "short_desc": "西湖组词"
  },
  {
    "name": "林逋",
    "birth_year": 967,
    "death_year": 1028,
    "era": "宋",
    "lane": 2,
    "weight": 3,
    "tags": [
      "诗人",
      "隐居",
      "隐逸",
      "不试",
      "布衣"
    ],
    "works_short": "山园小梅",
    "short_desc": "孤山隐士"
  },
  {
    "name": "钱惟演",
    "birth_year": 977,
    "death_year": 1034,
    "era": "宋",
    "lane": 3,
    "weight": 2,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "不试",
      "宰辅"
    ],
    "works_short": "玉楼春",
    "short_desc": "西昆体领袖"
  },
  {
    "name": "柳永",
    "birth_year": 984,
    "death_year": 1053,
    "era": "宋",
    "lane": 4,
    "weight": 3,
    "tags": [
      "词人",
      "游历",
      "婉约",
      "进士",
      "郎官"
    ],
    "works_short": "望海潮",
    "short_desc": "杭州名篇"
  },
  {
    "name": "张先",
    "birth_year": 990,
    "death_year": 1078,
    "era": "宋",
    "lane": 1,
    "weight": 2,
    "tags": [
      "词人",
      "游历",
      "婉约",
      "进士",
      "郎官"
    ],
    "works_short": "天仙子",
    "short_desc": "苏轼前辈"
  },
  {
    "name": "王安石",
    "birth_year": 1021,
    "death_year": 1086,
    "era": "宋",
    "lane": 2,
    "weight": 3,
    "tags": [
      "双擅",
      "游历",
      "诗家",
      "进士",
      "宰辅"
    ],
    "works_short": "登飞来峰",
    "short_desc": "千古名篇"
  },
  {
    "name": "苏轼",
    "birth_year": 1037,
    "death_year": 1101,
    "era": "宋",
    "lane": 2,
    "weight": 3,
    "tags": [
      "双擅",
      "任职",
      "豪放",
      "进士",
      "尚书"
    ],
    "works_short": "饮湖上初晴后雨",
    "short_desc": "苏堤修建者"
  },
  {
    "name": "释道潜",
    "birth_year": 1043,
    "death_year": 1102,
    "era": "宋",
    "lane": 3,
    "weight": 1,
    "tags": [
      "诗人",
      "游历",
      "隐逸",
      "不试",
      "无官"
    ],
    "works_short": "临平道中",
    "short_desc": "苏轼至交"
  },
  {
    "name": "黄庭坚",
    "birth_year": 1045,
    "death_year": 1105,
    "era": "宋",
    "lane": 3,
    "weight": 2,
    "tags": [
      "双擅",
      "游历",
      "诗家",
      "进士",
      "侍从"
    ],
    "works_short": "清平乐",
    "short_desc": "苏门四学士"
  },
  {
    "name": "秦观",
    "birth_year": 1049,
    "death_year": 1100,
    "era": "宋",
    "lane": 4,
    "weight": 2,
    "tags": [
      "词人",
      "游历",
      "婉约",
      "进士",
      "馆阁"
    ],
    "works_short": "鹊桥仙",
    "short_desc": "婉约宗师"
  },
  {
    "name": "晁补之",
    "birth_year": 1053,
    "death_year": 1110,
    "era": "宋",
    "lane": 1,
    "weight": 2,
    "tags": [
      "词人",
      "任职",
      "婉约",
      "进士",
      "郎官"
    ],
    "works_short": "摸鱼儿",
    "short_desc": "苏门学士"
  },
  {
    "name": "周邦彦",
    "birth_year": 1056,
    "death_year": 1121,
    "era": "宋",
    "lane": 2,
    "weight": 3,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "进士",
      "侍从"
    ],
    "works_short": "兰陵王",
    "short_desc": "词家之冠"
  },
  {
    "name": "叶梦得",
    "birth_year": 1077,
    "death_year": 1148,
    "era": "宋",
    "lane": 3,
    "weight": 2,
    "tags": [
      "双擅",
      "任职",
      "豪放",
      "进士",
      "宰辅"
    ],
    "works_short": "水调歌头",
    "short_desc": "南北宋过渡"
  },
  {
    "name": "朱敦儒",
    "birth_year": 1081,
    "death_year": 1159,
    "era": "宋",
    "lane": 4,
    "weight": 2,
    "tags": [
      "双擅",
      "寓居",
      "隐逸",
      "进士",
      "州郡"
    ],
    "works_short": "鹧鸪天",
    "short_desc": "樵歌体"
  },
  {
    "name": "李清照",
    "birth_year": 1084,
    "death_year": 1155,
    "era": "宋",
    "lane": 1,
    "weight": 3,
    "tags": [
      "双擅",
      "寓居",
      "婉约",
      "无官"
    ],
    "works_short": "声声慢",
    "short_desc": "婉约宗主"
  },
  {
    "name": "张元干",
    "birth_year": 1091,
    "death_year": 1170,
    "era": "宋",
    "lane": 2,
    "weight": 2,
    "tags": [
      "双擅",
      "任职",
      "豪放",
      "进士",
      "寺监"
    ],
    "works_short": "贺新郎",
    "short_desc": "豪放先驱"
  },
  {
    "name": "岳飞",
    "birth_year": 1103,
    "death_year": 1142,
    "era": "宋",
    "lane": 3,
    "weight": 3,
    "tags": [
      "诗人",
      "任职",
      "豪放",
      "不试",
      "宰辅"
    ],
    "works_short": "满江红",
    "short_desc": "风波亭"
  },
  {
    "name": "韩元吉",
    "birth_year": 1118,
    "death_year": 1187,
    "era": "宋",
    "lane": 4,
    "weight": 2,
    "tags": [
      "诗人",
      "任职",
      "豪放",
      "进士",
      "尚书"
    ],
    "works_short": "六州歌头",
    "short_desc": "尚书词人"
  },
  {
    "name": "陆游",
    "birth_year": 1125,
    "death_year": 1210,
    "era": "宋",
    "lane": 1,
    "weight": 3,
    "tags": [
      "双擅",
      "任职",
      "豪放",
      "进士",
      "侍从"
    ],
    "works_short": "钗头凤",
    "short_desc": "爱国诗人"
  },
  {
    "name": "范成大",
    "birth_year": 1126,
    "death_year": 1193,
    "era": "宋",
    "lane": 2,
    "weight": 2,
    "tags": [
      "双擅",
      "任职",
      "田园",
      "进士",
      "宰辅"
    ],
    "works_short": "秦楼月",
    "short_desc": "田园词"
  },
  {
    "name": "林升",
    "birth_year": 1126,
    "death_year": 1189,
    "era": "宋",
    "lane": 4,
    "weight": 3,
    "tags": [
      "诗人",
      "游历",
      "诗家",
      "无考"
    ],
    "works_short": "题临安邸",
    "short_desc": "南宋绝唱"
  },
  {
    "name": "杨万里",
    "birth_year": 1127,
    "death_year": 1206,
    "era": "宋",
    "lane": 3,
    "weight": 2,
    "tags": [
      "双擅",
      "任职",
      "田园",
      "进士",
      "侍从"
    ],
    "works_short": "晓出净慈寺送林子方",
    "short_desc": "诚斋体"
  },
  {
    "name": "张孝祥",
    "birth_year": 1132,
    "death_year": 1170,
    "era": "宋",
    "lane": 4,
    "weight": 2,
    "tags": [
      "双擅",
      "任职",
      "豪放",
      "状元",
      "侍从"
    ],
    "works_short": "念奴娇",
    "short_desc": "豪放中坚"
  },
  {
    "name": "朱淑真",
    "birth_year": 1135,
    "death_year": 1180,
    "era": "宋",
    "lane": 1,
    "weight": 2,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "无官"
    ],
    "works_short": "蝶恋花",
    "short_desc": "闺阁词"
  },
  {
    "name": "辛弃疾",
    "birth_year": 1140,
    "death_year": 1207,
    "era": "宋",
    "lane": 2,
    "weight": 3,
    "tags": [
      "双擅",
      "任职",
      "豪放",
      "不试",
      "侍从"
    ],
    "works_short": "青玉案",
    "short_desc": "豪放巅峰"
  },
  {
    "name": "陈亮",
    "birth_year": 1143,
    "death_year": 1194,
    "era": "宋",
    "lane": 3,
    "weight": 2,
    "tags": [
      "双擅",
      "游历",
      "豪放",
      "状元",
      "幕职"
    ],
    "works_short": "水龙吟",
    "short_desc": "思想家"
  },
  {
    "name": "姚述尧",
    "birth_year": 1150,
    "death_year": 1200,
    "era": "宋",
    "lane": 1,
    "weight": 1,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "进士",
      "州郡"
    ],
    "works_short": "念奴娇",
    "short_desc": "本土词人"
  },
  {
    "name": "刘过",
    "birth_year": 1154,
    "death_year": 1206,
    "era": "宋",
    "lane": 4,
    "weight": 2,
    "tags": [
      "词人",
      "寓居",
      "豪放",
      "落第",
      "布衣"
    ],
    "works_short": "沁园春",
    "short_desc": "辛派中坚"
  },
  {
    "name": "姜夔",
    "birth_year": 1155,
    "death_year": 1221,
    "era": "宋",
    "lane": 1,
    "weight": 3,
    "tags": [
      "词人",
      "寓居",
      "婉约",
      "不试",
      "布衣"
    ],
    "works_short": "扬州慢",
    "short_desc": "清雅宗主"
  },
  {
    "name": "史达祖",
    "birth_year": 1163,
    "death_year": 1220,
    "era": "宋",
    "lane": 2,
    "weight": 2,
    "tags": [
      "词人",
      "寓居",
      "婉约",
      "不试",
      "幕职"
    ],
    "works_short": "双双燕",
    "short_desc": "西湖词"
  },
  {
    "name": "严蕊",
    "birth_year": 1163,
    "death_year": 1200,
    "era": "宋",
    "lane": 3,
    "weight": 1,
    "tags": [
      "词人",
      "游历",
      "婉约",
      "无官"
    ],
    "works_short": "卜算子",
    "short_desc": "才女词人"
  },
  {
    "name": "戴复古",
    "birth_year": 1167,
    "death_year": 1248,
    "era": "宋",
    "lane": 4,
    "weight": 2,
    "tags": [
      "诗人",
      "游历",
      "诗家",
      "落第",
      "布衣"
    ],
    "works_short": "满江红",
    "short_desc": "江湖诗派"
  },
  {
    "name": "洪咨夔",
    "birth_year": 1176,
    "death_year": 1236,
    "era": "宋",
    "lane": 3,
    "weight": 2,
    "tags": [
      "诗人",
      "本土",
      "豪放",
      "进士",
      "尚书"
    ],
    "works_short": "沁园春",
    "short_desc": "尚书词人"
  },
  {
    "name": "刘克庄",
    "birth_year": 1187,
    "death_year": 1269,
    "era": "宋",
    "lane": 2,
    "weight": 2,
    "tags": [
      "双擅",
      "任职",
      "诗家",
      "进士",
      "尚书"
    ],
    "works_short": "贺新郎",
    "short_desc": "后期领袖"
  },
  {
    "name": "吴潜",
    "birth_year": 1195,
    "death_year": 1262,
    "era": "宋",
    "lane": 4,
    "weight": 2,
    "tags": [
      "双擅",
      "任职",
      "豪放",
      "状元",
      "宰辅"
    ],
    "works_short": "满江红",
    "short_desc": "丞相词人"
  },
  {
    "name": "吴文英",
    "birth_year": 1200,
    "death_year": 1260,
    "era": "宋",
    "lane": 1,
    "weight": 3,
    "tags": [
      "词人",
      "寓居",
      "婉约",
      "不试",
      "布衣"
    ],
    "works_short": "莺啼序",
    "short_desc": "梦窗体"
  },
  {
    "name": "王沂孙",
    "birth_year": 1230,
    "death_year": 1291,
    "era": "宋",
    "lane": 3,
    "weight": 2,
    "tags": [
      "词人",
      "寓居",
      "婉约",
      "学官"
    ],
    "works_short": "齐天乐",
    "short_desc": "遗民词"
  },
  {
    "name": "周密",
    "birth_year": 1232,
    "death_year": 1298,
    "era": "宋",
    "lane": 2,
    "weight": 3,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "不试",
      "县级"
    ],
    "works_short": "一萼红",
    "short_desc": "武林旧事"
  },
  {
    "name": "刘辰翁",
    "birth_year": 1232,
    "death_year": 1297,
    "era": "宋",
    "lane": 4,
    "weight": 2,
    "tags": [
      "词人",
      "寓居",
      "婉约",
      "进士",
      "学官"
    ],
    "works_short": "兰陵王",
    "short_desc": "亡国之痛"
  },
  {
    "name": "文天祥",
    "birth_year": 1236,
    "death_year": 1283,
    "era": "宋",
    "lane": 1,
    "weight": 3,
    "tags": [
      "双擅",
      "任职",
      "豪放",
      "状元",
      "宰辅"
    ],
    "works_short": "正气歌",
    "short_desc": "民族英雄"
  },
  {
    "name": "汪元量",
    "birth_year": 1241,
    "death_year": 1317,
    "era": "宋",
    "lane": 2,
    "weight": 2,
    "tags": [
      "诗人",
      "本土",
      "诗家",
      "不试",
      "无官"
    ],
    "works_short": "水龙吟",
    "short_desc": "宫廷词人"
  },
  {
    "name": "蒋捷",
    "birth_year": 1245,
    "death_year": 1310,
    "era": "宋",
    "lane": 3,
    "weight": 2,
    "tags": [
      "词人",
      "寓居",
      "婉约",
      "进士",
      "布衣"
    ],
    "works_short": "一剪梅",
    "short_desc": "四大家"
  },
  {
    "name": "张炎",
    "birth_year": 1248,
    "death_year": 1320,
    "era": "宋",
    "lane": 4,
    "weight": 3,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "不试",
      "布衣"
    ],
    "works_short": "高阳台",
    "short_desc": "词论大家"
  },
  {
    "name": "张枢",
    "birth_year": 1250,
    "death_year": 1300,
    "era": "宋",
    "lane": 2,
    "weight": 1,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "不试",
      "布衣"
    ],
    "works_short": "清平乐",
    "short_desc": "吟社成员"
  },
  {
    "name": "施岳",
    "birth_year": 1250,
    "death_year": 1300,
    "era": "宋",
    "lane": 3,
    "weight": 1,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "不试",
      "布衣"
    ],
    "works_short": "曲游春",
    "short_desc": "遗民词人"
  },
  {
    "name": "李彭老",
    "birth_year": 1250,
    "death_year": 1300,
    "era": "宋",
    "lane": 4,
    "weight": 1,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "幕职"
    ],
    "works_short": "四字令",
    "short_desc": "吟社成员"
  },
  {
    "name": "李莱老",
    "birth_year": 1250,
    "death_year": 1300,
    "era": "宋",
    "lane": 1,
    "weight": 1,
    "tags": [
      "词人",
      "本土",
      "婉约",
      "州郡"
    ],
    "works_short": "清平乐",
    "short_desc": "遗民词人"
  }
];
