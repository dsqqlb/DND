/* ============================================================
   法术数据库 (Spell Database)
   字段: id, name, nameEn, level, school, classes,
         castTime, range, components, duration, conc, description
   level=0 为戏法，1-3 为对应环阶。
   可自行在对应 level 区域追加对象扩充数据库。
============================================================ */
const SPELL_DB = [

  /* ──────────────────── 戏法 (Level 0) ──────────────────── */
  {
    id: 'guidance',
    name: '神导术',
    nameEn: 'Guidance',
    level: 0,
    school: '预言',
    classes: ['牧师', '德鲁伊'],
    castTime: '动作',
    range: '触碰',
    components: 'V、S',
    duration: '专注，至多 1 分钟',
    conc: true,
    description: '你触碰一名自愿生物并选择一项技能。直到法术结束为止，受术生物在进行使用到所选技能的任何属性检定时，该次检定具有 1d4 加值.'
  },

  {
    id: 'light',
    name: '光亮术',
    nameEn: ' Light',
    level: 0,
    school: '塑能',
    classes: ['吟游诗人', '牧师', '术士', '法师'],
    castTime: '动作',
    range: '触碰',
    components: 'V、M（一只萤火虫或一片磷光苔藓）',
    duration: '1 小时',
    conc: false,
    description: '你触碰一个体型不超过大型，且未被他人携带/着装的物件。在法术终止前，物件将发出 20 尺半径的明亮光照以及额外 20 尺的微光光照。光的颜色由你决定。该物件被不透明的东西完全遮盖时，其光照也将被遮挡。此法术将在你再次施展它时提前终止。'
  },

  {
    id: 'word_of_radiance',
    name: '光耀祷词',
    nameEn: 'Word of Radiance',
    level: 0,
    school: '塑能',
    classes: ['牧师'],
    castTime: '动作',
    range: '自身',
    components: 'V、 M（一枚艳阳标志）',
    duration: '立即',
    conc: false,
    description: '灼热的光辉喷薄而出，覆盖你周身 5尺光环区 域。每个区域中你可见且受你选择的生物必须通过一次体质豁免，否则受到 1d6点光耀伤害。戏法强化。到达特定等级后，此戏法的伤害将增加1d6 5级（ 2d6）、 11级（ 3d6）、 17级（ 4d6）。'
  },
  {
    id: 'sacred_flame',
    name: '圣火术',
    nameEn: 'Sacred Flame',
    level: 0,
    school: '塑能',
    classes: ['牧师'],
    castTime: '动作',
    range: '60尺',
    components: 'V、S',
    duration: '立即',
    conc: false,
    description: '如同火焰般的辉光向施法距离内你能看见的一个生物倾泻而下。目标必须要进行一次敏捷豁免，豁免失败则受到1d8点光耀伤害。目标在这次豁免检定中无法获得掩护的增益。第5级时，本法术的伤害增加1d8（变为2d8）。11级时再增加1d8（变为3d8），17级时再增加1d8（变为4d8）。'
  },

  /* ──────────────────── 1环法术 (Level 1) ──────────────────── */
  {
    id: 'bane',
    name: '灾祸术',
    nameEn: 'Bane',
    level: 1,
    school: '附魔',
    classes: ['吟游诗人','牧师'],
    castTime: '动作',
    range: '30尺',
    components: 'V、S、M（一滴血）',
    duration: '专注，至多1分钟',
    conc: true,
    description: '指定施法距离内至多三个你能看见的生物，并迫使其进行一次魅力豁免。豁免失败者直至法术终止前，在每当进行攻击检定或豁免检定时，必须从投骰结果中减去一个d4。升环施法效应: 使用2环或更高法术位施放本法术时，你使用的法术位每比1环高一环，就能多指定一个目标。'
  },
  {
    id: 'bless',
    name: '祝福术',
    nameEn: 'Bless',
    level: 1,
    school: '附魔',
    classes: ['圣武士','牧师'],
    castTime: '动作',
    range: '30尺',
    components: 'V、S、M（一点圣水）',
    duration: '专注，至多1分钟',
    conc: true,
    description: '你用言语祝福施法距离内至多三个生物。在法术终止前，每当受术目标进行攻击检定或豁免检定时，可以额外掷一次d4并加在其结果上。升环施法效应: 使用2环或更高法术位施放本法术时，你使用的法术位每比1环高一环，就可以多指定一个目标。'
  },
  {
    id: 'ceremony',
    name: '典礼术',
    nameEn: 'Ceremony',
    level: 1,
    school: '防护',
    classes: ['圣武士','牧师'],
    castTime: '动作',
    range: '触及',
    components: ' V、S、M（价值25金币的银粉，作为本法术的耗材）',
    duration: '立即',
    conc: false,
    description: '你进行几种宗教典礼之一。当你施放本法术时，选择下述典礼之一，其目标必须在施法过程中处于你周围10尺内。赎罪Atonement：你接触一个阵营发生了改变的自愿生物，而你进行一次DC20的感知（洞悉）检定。成功则你令目标恢复其原始阵营。祝福圣水Bless Water：你接触一瓶水并将它转变为圣水。成人礼Coming of Age：你接触一个年龄足够成年的类人生物。在接下来的24小时内，当目标进行一次属性检定时，它可以投d4并将投出的结果加到属性检定上。一个生物只能从此仪式中获得此好处一次。献身Dedication：你接触一个自愿转变为你的宗教的信仰或想要为你信奉的神明服务的类人生物。在接下来的24小时内，当目标进行一次豁免检定时，它可以投d4并将投出的结果加到检定上。一个生物只能从此仪式中获得此好处一次。葬礼Funeral Rite：你祝福一具处于你周围5尺内的尸体。在接下来的7天内，目标不能被任何弱于祈愿术的方式变为不死生物。婚礼Wedding：你接触自愿接受婚姻的束缚的成年类人生物。在接下来的7天内，每个目标若处于彼此30尺范围内，则在AC上获得+2加值。一个生物只有在丧偶时才能再次从这个仪式中受益。'
  },
  {
    id: 'command',
    name: '命令术',
    nameEn: 'Command',
    level: 1,
    school: '附魔',
    classes: ['圣武士','牧师','吟游诗人'],
    castTime: '动作',
    range: '60尺',
    components: 'V',
    duration: '1轮',
    conc: false,
    description: '你对施法距离内一个你能看见的生物说出一个单词的命令。目标生物必须成功通过一次感知豁免，否则必须在其自己的下一回合服从该命令行事。如果目标为不死生物或目标无法听懂你的语言，又或者你的命令对其直接构成损害，则本法术无效。以下列出一些通常可用的命令单词及其效果。你也可以说出此处没有列明的单词命令，并由DM决定目标将如何行动。如果目标无法完成你的命令，则法术终止。过来 Approach。目标以最短最直接的路线向你移动，并在到达距你5尺时结束其回合。放下 Drop。目标放下手中持握物并结束其回合。走开 Flee。目标在其回合内以最快最有效的方式远离你。趴下 Grovel。目标趴下倒地并结束其回合。立定 Halt。目标不移动且不作任何动作。飞行生物在原地悬浮（如果它可以这么做）。如果它必须移动才能保持在空中，则其移动最小的距离以保持飞行。升环施法效应: 使用2环或更高法术位施放本法术时，你使用的法术位每比1环高一环，法术就能多影响一个目标。而各目标之间距离不能超过30尺。'
  },
  {
    id: 'create_or_destroy_water',
    name: '造水术/枯水术',
    nameEn: 'Create or Destroy Water',
    level: 1,
    school: '附魔',
    classes: ['牧师','德鲁伊'],
    castTime: '动作',
    range: '30尺',
    components: 'V、S、M（造水为一滴水，枯水为一点谷物或沙子）',
    duration: '立即',
    conc: false,
    description: '你施法创造水或者使水枯竭。\n·造水 Create Water。你在施法距离内一个打开的容器里创造10加仑干净的水。或以降雨的方式在施法距离内一处30尺的立方区域降下等量水分并浇灭区域内不受遮盖的火苗。\n·枯水 Destory Water。你使施法距离内一个打开的容器里的10加仑水分枯竭不见。或者使施法距离内一片30尺立方区域的浓雾消失不见。升环施法效应: 使用2环或更高法术位施放本法术时，你使用的法术位每比1环高一环，法术就多创造或枯竭10加仑额外的水分，或者影响的立方区域边长增加5尺。'
  },
  {
    id: 'cure_wounds',
    name: '疗伤术',
    nameEn: 'Cure Wounds',
    level: 1,
    school: '塑能',
    classes: ['奇械师', '吟游诗人', '牧师', '德鲁伊', '圣武士', '游侠'],
    castTime: '动作',
    range: '触及',
    components: 'V、S',
    duration: '立即',
    conc: false,
    description: '一个你触碰的生物恢复特定数值的生命值，其恢复量等于1d8+你的施法关键属性调整值。本法术对不死生物和构装生物无效。\n升环施法效应: 使用2环或更高法术位施放本法术时，你使用的法术位每比1环高一环，恢复量就增加1d8。'
  },
  {
    id: 'detect_evil_and_good',
    name: '侦测善恶',
    nameEn: 'Detect Evil and Good',
    level: 1,
    school: '预言',
    classes: ['牧师', '圣武士'],
    castTime: '动作',
    range: '自身',
    components: 'V、S',
    duration: '专注，至多10分钟',
    conc: true,
    description: '你在法术持续时间内能感觉到身边30尺内出现的任一异怪、天界生物、元素生物、精类生物、邪魔或不死生物的存在，并掌握其具体位置。另外，你也可以知晓30尺内的物件或地点是否被祝福或亵渎。\n本法术可以穿透大部分障碍，但仍会被1尺厚的石质、1寸厚的金属质、一层薄铅质、3尺厚木质或泥质材料阻隔。'
  },
  {
    id: 'detect_magic',
    name: '侦测魔法',
    nameEn: 'Detect Magic',
    level: 1,
    school: '预言',
    classes: ['奇械师', '吟游诗人', '牧师', '德鲁伊', '圣武士', '游侠', '术士', '法师'],
    castTime: '动作',
    range: '自身',
    components: 'V、S',
    duration: '专注，至多10分钟',
    conc: true,
    description: '你在法术持续时间内能感测到30尺内存在的魔法。你以此法感测到魔法的存在后，你可以使用动作，来看到任何你能看见的生物或物件周围微弱的灵光，并分辨出其所属的魔法学派（若有）。\n本法术可以穿透大部分障碍，但仍会被1尺厚的石质、1寸厚的金属质、一层薄铅质、3尺厚木质或泥质材料阻隔。'
  },
  {
    id: 'detect_poison_and_disease',
    name: '侦测毒性和疾病',
    nameEn: 'Detect Poison and Disease',
    level: 1,
    school: '预言',
    classes: ['牧师', '德鲁伊', '圣武士', '游侠'],
    castTime: '动作',
    range: '自身',
    components: 'V、S、M（一片红豆杉叶）',
    duration: '专注，至多10分钟',
    conc: true,
    description: '你在法术持续时间内可以感测并定位30尺内的毒素、有毒生物以及疾病。你还可以判断所感测毒素、毒物或疾病的具体类别。\n本法术可以穿透大部分障碍，但仍会被1尺厚的石质、1寸厚的金属质、一层薄铅质、3尺厚木质或泥质材料阻隔。'
  },
  {
    id: 'guiding_bolt',
    name: '光导箭',
    nameEn: 'Guiding Bolt',
    level: 1,
    school: '塑能',
    classes: ['牧师'],
    castTime: '动作',
    range: '120尺',
    components: 'V、S',
    duration: '1轮',
    conc: false,
    description: '一道闪光快速飞向施法距离内你指定的一个生物，并对该目标进行一次远程法术攻击检定。命中时，目标受4d6的光耀伤害。由于目标身上闪耀着秘法的微光，在施法者下个回合结束前，对该目标发动的下一次攻击检定具有优势。\n升环施法效应: 使用2环或更高法术位施放本法术时，你使用的法术位每比1环高一环，伤害就增加1d6。'
  },
  {
    id: 'healing_word',
    name: '治愈真言',
    nameEn: 'Healing Word',
    level: 1,
    school: '塑能',
    classes: ['吟游诗人', '牧师', '德鲁伊'],
    castTime: '附赠动作',
    range: '60尺',
    components: 'V',
    duration: '立即',
    conc: false,
    description: '你指定施法距离内一个你能看见的生物并为其恢复生命值，恢复量等同于1d4+你的施法关键属性调整值。本法术对构装体和不死生物无效。\n升环施法效应: 使用2环或更高法术位施放本法术时，你使用的法术位每比1环高一环，治疗量就增加1d4点。'
  },
  {
    id: 'inflict_wounds',
    name: '致伤术',
    nameEn: 'Inflict Wounds',
    level: 1,
    school: '死灵',
    classes: ['牧师'],
    castTime: '动作',
    range: '触及',
    components: 'V、S',
    duration: '立即',
    conc: false,
    description: '你对触及范围内一个生物发动一次近战法术攻击。命中时，目标受到3d10点黯蚀伤害。\n升环施法效应: 使用2环或更高法术位施放本法术时，你使用的法术位每比1环高一环，伤害就增加1d10。'
  },
  {
    id: 'protection_from_evil_and_good',
    name: '防护善恶',
    nameEn: 'Protection from Evil and Good',
    level: 1,
    school: '防护',
    classes: ['牧师', '圣武士', '邪术师', '法师', '德鲁伊'],
    castTime: '动作',
    range: '触及',
    components: 'V、S、M（圣水或者银和铁的粉末，作为本法术的耗材）',
    duration: '专注，至多10分钟',
    conc: true,
    description: '在法术终止前，你触碰的一个自愿生物获得针对以下类型生物的防护：异怪、天界生物、元素生物、精类生物、邪魔和不死生物。\n该防护提供以下增益：该类生物对目标生物进行的攻击检定具有劣势；目标不会被该类生物魅惑、恐慌或附身；如果目标已被该类生物影响而陷入魅惑、恐慌，或被附身，则目标之后进行对抗相关效应的豁免检定时具有优势。'
  },
  {
    id: 'purify_food_and_drink',
    name: '净化食粮',
    nameEn: 'Purify Food and Drink',
    level: 1,
    school: '变化',
    classes: ['牧师', '德鲁伊', '圣武士'],
    castTime: '动作',
    range: '10尺',
    components: 'V、S',
    duration: '立即',
    conc: false,
    description: '你指定施法距离内一点，净化指定点周围半径5尺球状区域内的非魔法饮食品，并驱除其浸染的所有毒素和疾病。'
  },
  {
    id: 'sanctuary',
    name: '庇护术',
    nameEn: 'Sanctuary',
    level: 1,
    school: '防护',
    classes: ['奇械师', '牧师'],
    castTime: '附赠动作',
    range: '30尺',
    components: 'V、S、M（一小块银镜）',
    duration: '1分钟',
    conc: false,
    description: '你的法术保护一个施法距离内的生物不受攻击。在法术终止前，任何试图对受保护者进行攻击或对受保护者施放伤害性法术的生物都必须进行一次感知豁免。豁免失败则该生物必须选定一个新目标，否则将失去本次的攻击或法术。本法术不能保护受术者免受范围效应（如爆炸或火球）的影响。\n若受保护生物发动一次攻击、施放一个影响敌人的法术、或对其他生物造成伤害，则本法术随之终止。'
  },
  {
    id: 'shield_of_faith',
    name: '虔诚护盾',
    nameEn: 'Shield of Faith',
    level: 1,
    school: '防护',
    classes: ['牧师', '圣武士'],
    castTime: '附赠动作',
    range: '60尺',
    components: 'V、S、M（一小块写有神圣文字的羊皮纸）',
    duration: '专注，至多10分钟',
    conc: true,
    description: '围绕着施法距离内你指定的一个生物出现一片闪着微光的魔法力场。使目标在法术持续时间内AC获得+2加值。'
  },
  /* ──────────────────── 2环法术 (Level 2) ──────────────────── */
  {
    id: 'aid',
    name: '援助术',
    nameEn: 'Aid',
    level: 2,
    school: '塑能',
    classes: ['奇械师', '牧师', '圣武士', '吟游诗人', '游侠'],
    castTime: '动作',
    range: '30尺',
    components: 'V、S、M（一小片白布）',
    duration: '8小时',
    conc: false,
    description: '你的法术增强了盟友的韧性和毅力。在施法距离内指定至多三个生物。每个目标的生命值上限和当前生命值在法术持续时间内提高5点。\n升环施法效应: 使用3环或更高法术位施放本法术时，你使用的法术位每比2环高一环，每个目标的生命值上限和当前生命值就额外提高5点。'
  },
  {
    id: 'augury',
    name: '卜筮术',
    nameEn: 'Augury',
    level: 2,
    school: '预言',
    classes: ['牧师', '德鲁伊', '法师'],
    castTime: '1分钟',
    range: '自身',
    components: 'V、S、M（一套绘有标记的短棒，骨头，或类似的象征物，价值至少25gp）',
    duration: '立即',
    conc: false,
    description: '借由镶嵌宝石的小短棒，龙骨，卡牌或是其他占卜器具，你从异界存在处获得对某件你计划在接下来的30分钟内做的事的预示。DM从下列预示中选取一个：\n·吉：预示着好的结果。\n·凶：预示着坏的结果。\n·吉且凶：预示着结果既有好的方面，也有坏的方面。\n·无：预示着结果并无明显的好坏分别。\n本法术不会将任何可能影响结果的偶然事件考虑在内。例如，额外施放某个法术，或是得到/失去某个同伴。\n若你在两次长休之间使用两次或更多次的卜筮术，则法术有概率会给出随机的结果。此概率从第二次施放起每次累计25％。具体结果由DM暗骰决定。'
  },
  {
    id: 'borrowed_knowledge',
    name: '借鉴才学',
    nameEn: 'Borrowed Knowledge',
    level: 2,
    school: '预言',
    classes: ['吟游诗人', '牧师', '邪术师', '法师'],
    castTime: '动作',
    range: '自身',
    components: 'V、S、M（一本价值至少25gp的书）',
    duration: '1小时',
    conc: false,
    description: '你从往昔的精魄中获取知识。选择一项你没有熟练的技能。在法术的持续时间里，你拥有所选技能的熟练项。如果你再次施放该法术，该法术会提前结束。'
  },
  {
    id: 'calm_emotions',
    name: '安定心神',
    nameEn: 'Calm Emotions',
    level: 2,
    school: '附魔',
    classes: ['吟游诗人', '牧师'],
    castTime: '动作',
    range: '60尺',
    components: 'V、S',
    duration: '专注，至多1分钟',
    conc: true,
    description: '你试图抑制一群人的强烈情感。指定施法距离内一点，并迫使该点周边半径20尺球状区域内的每个类人生物进行一次魅力豁免。受术生物可以自愿放弃豁免。豁免失败者将由你选择以下两项效应之一对其生效。\n你可以选择压制任何使目标受魅惑或恐慌的效应。法术终止时，若被压制效应持续时间仍未完结，则该效应继续生效。或者，你也可以选择使目标改变对某个你所指定生物的态度，由敌对变为冷漠。如果目标被攻击，或者被有害法术影响，又或者发现其盟友受到损害，则此效应终止。法术终止时，除非DM另行裁决，否则目标的态度恢复敌对。'
  },
  {
    id: 'continual_flame',
    name: '不灭明焰',
    nameEn: 'Continual Flame',
    level: 2,
    school: '塑能',
    classes: ['奇械师', '牧师', '法师', '德鲁伊'],
    castTime: '动作',
    range: '触及',
    components: 'V、S、M（价值50gp的红宝石粉末，作为本法术的耗材）',
    duration: '直至被解除',
    conc: false,
    description: '你在所触碰物件上制造如火把一样亮的火焰，使其看上去与一般火焰无异，不过其并不会发热，也不需要燃烧氧气。你可以掩盖或隐藏它，但无法将之闷熄或扑灭。'
  },
  {
    id: 'enhance_ability',
    name: '强化属性',
    nameEn: 'Enhance Ability',
    level: 2,
    school: '变化',
    classes: ['奇械师', '吟游诗人', '牧师', '德鲁伊', '术士', '游侠', '法师'],
    castTime: '动作',
    range: '触及',
    components: 'V、S、M（野兽的毛皮或羽毛）',
    duration: '专注，至多1小时',
    conc: true,
    description: '你触碰一个生物，并为其附上魔力强化。选择下列效应之一生效，而目标将在法术终止前维持本法术效应。\n·熊之坚韧 Bear\'s Endurance。目标进行体质检定时具有优势。目标同时获得2d6的临时生命值，并维持至法术终止。\n·公牛之力 Bull\'s Strength。目标进行力量检定时具有优势，且其负重翻倍。\n·猫之优雅 Cat\'s Grace。目标进行敏捷检定时具有优势。另外，目标在非失能状态下不会因20尺以内的坠落而伤害。\n·鹰之威仪 Eagle\'s Splendor。目标进行魅力检定时具优势。\n·狐之狡黠 Fox\'s Cunning。目标进行智力检定时具有优势。\n·枭之睿智 Owl\'s Wisdom。目标进行感知检定时具有优势。\n升环施法效应: 使用3环或更高法术位施放本法术时，你使用的法术位每比2环高一环，就可以多指定一个目标。'
  },
  {
    id: 'find_traps',
    name: '寻找陷阱',
    nameEn: 'Find Traps',
    level: 2,
    school: '预言',
    classes: ['牧师', '德鲁伊', '游侠'],
    castTime: '动作',
    range: '120尺',
    components: 'V、S',
    duration: '立即',
    conc: false,
    description: '你感测到施法距离范围内，且在你视线范围内的任何陷阱。本法术的目标“陷阱”包括任何可能引发的，对你有害或对你构成妨碍的突发性意外效应，而其性质也正是其创作者的意图。因此本法术可以感测警报术 alarm 和守卫刻纹 glyph of warding 的效应区域，也可以发现某个陷坑型机械陷阱。不过它不能揭示地板的某处脆弱点，或天花板的某处不稳定位置，又或是某个隐藏的阴沟。\n本法术只单纯揭示陷阱的存在。你并不能以此一一定位每个存在的陷阱，不过你可以知晓所感测到陷阱其能够构成危害的大致形式。'
  },
  {
    id: 'gentle_repose',
    name: '遗体防腐',
    nameEn: 'Gentle Repose',
    level: 2,
    school: '死灵',
    classes: ['牧师', '法师', '圣武士'],
    castTime: '动作',
    range: '触及',
    components: 'V、S、M（一撮盐，以及尸体每只眼睛上必须放置的铜币，铜币必须在法术持续时间内一直保留在眼睛上）',
    duration: '10日',
    conc: false,
    description: '你触碰一具尸体或其他遗骸。目标将在法术持续时间内受保护并免于腐烂且无法转变为不死生物。\n本法术同样可以有效的延长复活目标的时间限制，因为受本法术影响下度过的时间不计入法术如死者复活 raise dead 的时间限制内。'
  },
  {
    id: 'hold_person',
    name: '人类定身术',
    nameEn: 'Hold Person',
    level: 2,
    school: '附魔',
    classes: ['吟游诗人', '牧师', '德鲁伊', '术士', '邪术师', '法师'],
    castTime: '动作',
    range: '60尺',
    components: 'V、S、M（一片直的小铁片）',
    duration: '专注，至多1分钟',
    conc: true,
    description: '指定施法距离内一个你能看见的类人生物。该目标必须进行一次感知豁免，豁免失败则其在法术持续时间内陷入麻痹。目标在其每回合结束时可以再进行一次感知豁免，豁免成功则终止其身上本法术的效应。\n升环施法效应: 使用3环或更高法术位施放本法术时，你使用的法术位每比2环高一环，你就可以额外指定一个类人生物。指定目标时，每个目标生物必须身处其他目标30尺范围内。'
  },
  {
    id: 'lesser_restoration',
    name: '次级复原术',
    nameEn: 'Lesser Restoration',
    level: 2,
    school: '防护',
    classes: ['奇械师', '吟游诗人', '牧师', '德鲁伊', '圣武士', '游侠'],
    castTime: '动作',
    range: '触及',
    components: 'V、S',
    duration: '立即',
    conc: false,
    description: '你触碰一个生物，并终止正影响它的一项疾病或一种状态。该状态可以是目盲，耳聋，麻痹或中毒其一。'
  },
  {
    id: 'locate_object',
    name: '物件定位术',
    nameEn: 'Locate Object',
    level: 2,
    school: '预言',
    classes: ['吟游诗人', '牧师', '德鲁伊', '圣武士', '游侠', '法师'],
    castTime: '动作',
    range: '自身',
    components: 'V、S、M（一根分叉的树枝）',
    duration: '专注，至多10分钟',
    conc: true,
    description: '你点名或描述一个你熟悉的物件。只要该物件与你相距不超过1000尺，你就会感测到该物件的方位。如果该物件正在移动，则你也将知晓其移动的方向。\n本法术可定位一个你认识的特定物件，不过你需要在30尺内近距离看到过该物件至少一次；或者它也可定位特定的一类物件（如某种服装、珠宝、家具、工具或武器）中距你最近个体。\n如果有任意厚度的铅，即使只是薄薄一片铅片阻挡了你与被定位物件间的通路，则该物件也无法被本法术所定位。'
  },
  {
    id: 'prayer_of_healing',
    name: '治疗祷言',
    nameEn: 'Prayer of Healing',
    level: 2,
    school: '塑能',
    classes: ['牧师', '圣武士'],
    castTime: '10分钟',
    range: '30尺',
    components: 'V',
    duration: '立即',
    conc: false,
    description: '你指定施法距离内至多六个你能看见的生物，并使其每人恢复2d8+你施法关键属性调整值的生命值。本法术对不死生物和构装体不产生任何效应。\n升环施法效应: 当你使用3环或更高法术位施放本法术时，你使用的法术位每比2环高一环，治疗量就增加1d8。'
  },
  {
    id: 'protection_from_poison',
    name: '防护毒素',
    nameEn: 'Protection from Poison',
    level: 2,
    school: '防护',
    classes: ['奇械师', '牧师', '德鲁伊', '圣武士', '游侠'],
    castTime: '动作',
    range: '触及',
    components: 'V、S',
    duration: '1小时',
    conc: false,
    description: '你触碰一个生物。如果处于中毒状态，则中和其所受毒素。如果目标身上具有超过一种毒素，则选择你所了解一种或随机选择其一进行中和。\n在法术持续时间内，目标对抗中毒所豁免具有优势，并且对毒素伤害具有抗性。'
  },
  {
    id: 'silence',
    name: '沉默术',
    nameEn: 'Silence',
    level: 2,
    school: '幻术',
    classes: ['吟游诗人', '牧师', '游侠'],
    castTime: '动作',
    range: '120尺',
    components: 'V、S',
    duration: '专注，至多10分钟',
    conc: true,
    description: '你指定施法距离内一点，以该点为中心半径20尺的球状区域在法术持续时间内将无法产生任何声音，且外界的声音也无法进入该区域内。任何完全位于该区域内的生物和物件都将免疫雷鸣伤害，而任何生物在完全位于该区域内时都将陷入耳聋。此外，该区域内无法施放需要言语成分的法术。'
  },
  {
    id: 'spiritual_weapon',
    name: '灵体武器',
    nameEn: 'Spiritual Weapon',
    level: 2,
    school: '塑能',
    classes: ['牧师'],
    castTime: '附赠动作',
    range: '60尺',
    components: 'V、S',
    duration: '1分钟',
    conc: false,
    description: '你在施法距离内的一点创造出一把浮空的虚幻武器，并使其持续到法术持续时间结束或你再次施放本法术为止。施放本法术时，你可以对该武器周围5尺内的一个生物发动一次近战法术攻击。若命中，则目标受到1d8+你的施法关键属性调整值的力场伤害。\n你可以在自己回合内以一个附赠动作让该武器移动至多20尺，并再对它周围5尺内的一个生物发动一次同样的攻击。该武器的外形由你决定。而如果施法的牧师侍奉的是一位和特定武器有关的神祇（例如圣库斯伯特 St.Cuthbert 的钉头锤、托尔Thor 的锤子），则本法术创造出武器的外形与该武器类似。\n升环施法效应: 使用3环或更高法术位施放本法术时，你使用的法术位每比2环高两环，法术的伤害就增加1d8。'
  },
  {
    id: 'warding_bond',
    name: '守护之链',
    nameEn: 'Warding Bond',
    level: 2,
    school: '防护',
    classes: ['牧师','圣武士'],
    castTime: '动作',
    range: '触及',
    components: 'V、S、M（一对单个价值至少50gp的铂金戒指，并由你和目标在法术持续时间内一直佩戴）',
    duration: '1小时',
    conc: false,
    description: '你触碰一个自愿的生物，并让本法术的魔力保护它。本法术在你和目标之间建立一种神秘的连接，并一直持续至法术终止。目标位于你身边60尺内时，其AC和豁免检定具有+1加值，且对所有伤害具有抗性。此外，每当目标受到伤害时，你也会受到同样的伤害。\n如果你的生命值降至0，或你与目标距离超过60尺，则本法术终止。如果本法术被再次施放于两个已被连接生物中的任意一方，则原法术即时终止。你还可以用一个动作主动解除本法术。'
  },
  {
    id: 'zone_of_truth',
    name: '诚实之域',
    nameEn: 'Zone of Truth',
    level: 2,
    school: '附魔',
    classes: ['吟游诗人', '牧师', '圣武士'],
    castTime: '动作',
    range: '60尺',
    components: 'V、S',
    duration: '10分钟',
    conc: false,
    description: '你创造一个抵御谎言的魔法区域，该区域以施法距离内一点为中心，覆盖该点周边15尺半径的球状区域。在法术终止前，生物在其回合内第一次进入该区域，或在该区域内开始其回合时，必须进行一次魅力豁免。豁免失败者在该区域内不能故意说谎。而你可以知晓每个受术生物的豁免是成功与否。\n受影响的生物可以意识到该效果的存在，因此它可以主动回避回答那些通常会以谎言答复的问题。该生物在回答问题时可以闪烁其词、避重就轻，但只要不超出实话的范围就没有问题。'
  },
  /* ──────────────────── 3环法术 (Level 3) ──────────────────── */
  {
    id: 'animate_dead',
    name: '活化死尸',
    nameEn: 'Animate Dead',
    level: 3,
    school: '死灵',
    classes: ['牧师', '法师'],
    castTime: '1分钟',
    range: '10尺',
    components: 'V、S、M（一滴血，一块肉，以及一点骨灰）',
    duration: '立即',
    conc: false,
    description: '本法术创造一个不死生物仆从。在施法距离内指定一具中型或小型类人生物遗骨或遗体，并以本法术将污秽的虚假生命力量注入其中，将之唤起为一个不死生物。如果你选择的是遗骨，则目标变为骷髅skeleton；选择的是遗体则变为僵尸zombie。该生物的具体游戏资料由DM掌控。\n在你的任一回合内，你可以使用一个附赠动作并以精神命令操纵60尺内任何你用本法术唤起的生物（如果你操纵多个生物，则你的命令可以同时传达给它们全部或是其中的某几个，不过只能使用同一种命令）。你决定被操纵生物下回合的动作和移动。或者，你也可以选择下达宽泛的命令（比如守护某个房间或走廊）。没有接受到你命令的生物则只会对敌对生物作出自卫行为。一旦被下达命令，该生物会持续执行命令直到任务完成。\n这些受操纵生物只会在24小时内服从你的命令。如果你在当前的24小时时间段终止前再施放本法术，则你对这些生物的操纵时间再延长24小时。法术的此种用法只能延长你对至多四个你使用本法术所创造生物的控制时间，而不会创造新的生物。\n升环施法效应: 使用4环或更高法术位施放本法术时，你使用的法术位每比3环高一环，就会多唤起两只不死生物，或是多延长对两只不死生物的控制。你无法用同一具骸骨或遗体唤起多个不死生物。'
  },
  {
    id: 'aura_of_vitality',
    name: '活力灵光',
    nameEn: 'Aura of Vitality',
    level: 3,
    school: '塑能',
    classes: ['圣武士', '牧师', '德鲁伊'],
    castTime: '动作',
    range: '自身（30尺半径）',
    components: 'V',
    duration: '专注，至多1分钟',
    conc: true,
    description: '你身上发出的治愈能量形成半径30尺的灵光。法术持续时间内灵光将以你为中心随你移动。你可以用一个附赠动作为灵光范围内的一名生物（包括你自己）恢复2d6的生命值。'
  },
  {
    id: 'beacon_of_hope',
    name: '希望信标',
    nameEn: 'Beacon of Hope',
    level: 3,
    school: '防护',
    classes: ['牧师'],
    castTime: '动作',
    range: '30尺',
    components: 'V、S',
    duration: '专注，至多1分钟',
    conc: true,
    description: '本法术带来活力与希望。在施法距离内指定任意数量的生物，并使其在法术持续时间内进行的感知豁免和死亡豁免具有优势。此外，其获得治疗时均以骰子最大值来决定其恢复的生命值。'
  },
  {
    id: 'bestow_curse',
    name: '降咒术',
    nameEn: 'Bestow Curse',
    level: 3,
    school: '死灵',
    classes: ['吟游诗人', '牧师', '法师'],
    castTime: '动作',
    range: '触及',
    components: 'V、S',
    duration: '专注，至多1分钟',
    conc: true,
    description: '你触碰一名生物。该生物必须进行一次感知豁免并成功通过，否则将在法术持续时间内被诅咒。施放法术时，你从以下诅咒选项选择其一：\n·选择一个属性值。受诅咒影响时，目标进行该属性的豁免检定和属性检定时具有劣势。\n·受诅咒影响时，目标对你进行的攻击检定具有劣势。\n·受诅咒影响时，目标必须在其每回合开始时进行一次感知豁免，豁免失败则浪费掉该回合的动作。\n·受诅咒影响时，你的攻击和法术对目标额外造成1d8的黯蚀伤害。\n法术移除诅咒可终止本法术的效应。DM也可以让你选择其他诅咒，但它们不该比上表更强大。诅咒效应最终由DM裁定。\n升环施法效应: 使用4环或更高法术位施放本法术时，法术的持续时间变为：专注，至多10分钟。使用5环或更高法术位时，变为8小时。使用7环或更高法术位时，变为24小时。使用9环法术位时，法术将持续到被解除。使用5环或更高法术位施放本法术时无需在其持续时间内维持专注。'
  },
  {
    id: 'clairvoyance',
    name: '鹰眼术',
    nameEn: 'Clairvoyance',
    level: 3,
    school: '预言',
    classes: ['吟游诗人', '牧师','术士', '法师'],
    castTime: '10分钟',
    range: '1里',
    components: 'V、S、M（价值至少100gp的法器，选择聆听时用一个以珠宝装饰的号角，选择观察时用一颗玻璃眼珠）',
    duration: '专注，至多10分钟',
    conc: true,
    description: '你在施法距离内某处创造一个隐形的传感器，该处可以是你熟悉的地点（你曾到访过或看见过的地方），也可以是你不熟悉的显眼处（比如一扇门后，拐角位置或树林里）。该传感器在法术持续时间内停留在该地且无法被攻击或与之互动。\n施放本法术时，你可以选择进行观察或是聆听。你可以通过传感器以所选的感官方式感测目标空间。你也可以用一个动作在观察和聆听之间切换。\n可以看见传感器的生物（比如生物具有增益如识破隐形 see invisibility 或真实视觉时）会看到检测点是一个拳头大小发着微光的半透球体。'
  },
  {
    id: 'create_food_and_water',
    name: '造粮术',
    nameEn: 'Create Food and Water',
    level: 3,
    school: '咒法',
    classes: ['奇械师', '牧师', '圣武士'],
    castTime: '动作',
    range: '30尺',
    components: 'V、S',
    duration: '立即',
    conc: false,
    description: '你在施法距离内的地面或容器上创造45磅的食物和30加仑的水，其总量可以满足十五个类人生物或者五匹坐骑24小时的补给需求。食物非常清淡但营养丰富，并且如果24小时内不食用即会变坏。创造的水清洁可饮用且不会以该方式变质。'
  },
  {
    id: 'daylight',
    name: '昼明术',
    nameEn: 'Daylight',
    level: 3,
    school: '塑能',
    classes: ['牧师', '德鲁伊', '圣武士', '游侠', '术士'],
    castTime: '动作',
    range: '60尺',
    components: 'V、S',
    duration: '1小时',
    conc: false,
    description: '你在施法距离内指定一点，并从中释放光亮蔓延至半径60尺的球状区域。法术产生的光亮为区域内提供明亮光照并向其外提供60尺的微光光照。\n如果你将作为法术目标的点设置于你正持握或未被穿着携带的物件，则光亮将从物件周围漫出并跟随物件移动。将该物件完全掩盖时（比如用碗或头盔盖住），也会将其漫出的光亮隔绝。\n如果法术区域内有任何3环或更低环阶法术创造的黑暗，则这些造暗的法术将被解除。'
  },
  {
    id: 'dispel_magic',
    name: '解除魔法',
    nameEn: 'Dispel Magic',
    level: 3,
    school: '防护',
    classes: ['奇械师', '吟游诗人', '牧师', '德鲁伊', '圣武士', '术士', '邪术师', '法师'],
    castTime: '动作',
    range: '120尺',
    components: 'V、S',
    duration: '立即',
    conc: false,
    description: '在施法距离内指定一个生物、一个物件或一处魔法效应，并终止所有影响该目标的3环或更低环阶法术。每个影响目标的4环或更高环阶法术都需要以你的施法关键属性进行一次属性检定，其DC等于10+目标法术的环阶，检定成功时目标法术终止。\n升环施法效应: 使用4环或更高法术位施放本法术时，你直接终止目标身上小于等于该施法环阶的法术效应。'
  },
  {
    id: 'fast_friends',
    name: '快速交友',
    nameEn: 'Fast Friends',
    level: 3,
    school: '附魔',
    classes: ['吟游诗人', '牧师', '法师'],
    castTime: '动作',
    range: '30尺',
    components: 'V',
    duration: '专注，至多1小时',
    conc: true,
    description: '如果你想要确保某件事情完成，你不能依赖于含糊不清的承诺、宣誓或雇佣合同。当你施放本法术时，选择一个能看见、听见，并且能理解你的，在施法距离内的类人生物。这个生物必须通过一次感知豁免，否则将会在持续期间内被你魅惑。当生物因为这种方式被魅惑时，它将承诺尽其所能地以友好的方式履行你所要求的任何服务或者是活动。\n在这个生物之前的任务完成时，或者你决定中止它的当前任务时，你可以为它布置一个新任务。如果这项活动或任务可能伤害这个生物，或者与这个生物的正常活动和欲望相违背时，生物可以进行另一次感知豁免来尝试中止这个效果。如果你或者你的同伴正在与这个生物交战，他对此豁免具有优势。如果你要求的活动在结果上会确实地导致这个生物死亡，法术将会结束。\n当法术结束时，这个生物知道他曾经被你所魅惑。\n升环施法效应: 当你使用4环或更高法术位施放本法术时，你使用的法术位每比3环高一环，你就可以多指定一个额外的目标。'
  },
  {
    id: 'feign_death',
    name: '假死术',
    nameEn: 'Feign Death',
    level: 3,
    school: '死灵',
    classes: ['吟游诗人', '牧师', '德鲁伊', '法师'],
    castTime: '动作',
    range: '触及',
    components: 'V、S、M（1把坟土）',
    duration: '1小时',
    conc: false,
    description: '你触碰一自愿生物并将其变得如死去一样的僵直状态。 你可以用一个动作再次触碰该目标以终止本法术。\n在法术持续时间内，对目标进行的任何肉体检查和法术检测都显示目标已处于死亡状态。该状态下的目标陷入目盲以及失能状态，且其移动速度降低为0。目标对除了心灵伤害外的所有伤害类型具有抗性。如果目标在受术时正陷入疾病或中毒状态，或者在法术生效时陷入疾病或中毒状态，则这些状态在本法术持续时间内受抑制而无效，直至法术终止时再恢复生效。'
  },
  {
    id: 'glyph_of_warding',
    name: '守卫刻纹',
    nameEn: 'Glyph of Warding',
    level: 3,
    school: '防护',
    classes: ['奇械师', '吟游诗人', '牧师', '法师'],
    castTime: '1小时',
    range: '触及',
    components: 'V、S、M（熏香和至少价值200gp的钻石粉，作为本法术的耗材）',
    duration: '直到被解除或触发',
    conc: false,
    description: '施放本法术时，你在某个表面（诸如桌面、地板、墙等）或某个能被关闭以隐藏符纹的物件里（诸如书本、卷轴、宝箱等）刻画一个不一定对生物造成伤害的符纹。如果你指定某个表面，则该符纹可以覆盖内径不超过10尺直径的区域。如果受术的物件或表面从被施法位置被移开超过10尺，则其符纹被破坏且法术不被触发即高终止。\n结界符纹近乎隐形，其需要以法术的豁免DC进行一次智力（调查）检定才能被发现。\n你在施法时设定结界符纹的触发条件。刻画于表面的符纹其最典型的触发条件包括：触碰或站立在符纹上；拿掉覆盖在符纹上的物件；进入符纹一定施法距离；操作符纹所在的物件等。刻画在物件内的符纹其最典型的触发条件包括：打开物件； 靠近物件一定的距离；看到或阅读该符纹等。符纹一旦被触发，则本法术终止。\n你可以进一步细化触发条件，比如设定法术触发时符合特定的条件，或设定其触发者必须具备特定身体特征（身高体重等），特定生物种类（例如设定为只影响异怪或卓尔）或特定阵营。你还可以将特定条件者排除在符纹触发者之外，诸如某说出特定口令的人。\n刻画符纹时，你可以从爆炸符文和法术符纹两者中选择其一。\n爆炸符文Explosive Runes。符文被触发时将在半径20尺球状区域内将爆发魔法能量，并绕过角落扩散。区域内的每个生物必须进行一次敏捷豁免。豁免失败者将受到5d8的强酸，冷冻，火焰，闪电，或雷鸣伤害（你在制造符纹时指定），豁免成功则伤害减半。\n法术刻纹Spell Glyph。你可以施放一个准备好的3环或更低环阶法术，并将其储备在所创造的符纹中。所储备法术必须以一个生物或一个区域为目标，而其以该方式施放时并不会立即生效。符纹被触发时将随即施放所储备的法术。如果法术指向一个目标，则以触发符纹的生物为目标；如果法术影响一个区域，则该区域以此生物为中心；如果法术召唤敌对生物或创造伤害性质的物件或陷阱，则这些造物将显现在可能靠近触发者的地方并攻击它。如果法术需要专注，则其效应将在其最大持续时间内维持。\n升环施法效应: 使用4环或更高法术位施放本法术时，你使用的法术位每比3环高一环，一个爆炸符文的伤害就增加1d8。如果你创造一个法术符纹，则其储备法术的环阶可以与你施放守卫刻纹时使用的法术位相同。'
  },
  {
    id: 'incite_greed',
    name: '鼓动贪欲',
    nameEn: 'Incite Greed',
    level: 3,
    school: '附魔',
    classes: ['牧师', '术士', '邪术师', '法师'],
    castTime: '动作',
    range: '30尺',
    components: ' V、S、M（一块至少价值50gp的宝石）',
    duration: '专注，至多1分钟',
    conc: true,
    description: '当你施放这个法术时，你将展现作为法术材料成分的宝石，并且选择施法距离内能看见你的、任意数量的生物。每一个目标都必须成功通过一次感知豁免检定，否则将会被你魅惑直到法术结束，或者直到你或你的同伴做了任何有害于他的事情。当生物被这种方式魅惑时，它们除了以安全的方式花费移动力来接近你以外，不能做任何其他的事情。当一个受影响的生物到达你的5尺之内，它将不能移动，只是贪婪地注视着你所展现的宝石。\n受影响的目标每个回合结束时，可以再进行一次感知豁免检定。如果它成功，对于那个目标的效果将结束。'
  },
  {
    id: 'life_transference',
    name: '生命转换',
    nameEn: 'Life Transference',
    level: 3,
    school: '死灵',
    classes: ['牧师', '法师'],
    castTime: '动作',
    range: '30尺',
    components: ' V、S',
    duration: '立即',
    conc: false,
    description: '你牺牲自己的部分健康来修复其他生物的伤口。你受到无法以任何方式减少的4d8点黯蚀伤害，同时施法距离内一个由你选择的可见生物恢复生命值，数值等于你承受的黯蚀伤害的两倍。\n升环施法效应: 当你使用4环或更高法术位施放本法术时，使用的法术位每高一环，黯蚀伤害就增加1d8。'
  },
  {
    id: 'magic_circle',
    name: '防护法阵',
    nameEn: 'Magic Circle',
    level: 3,
    school: '咒法',
    classes: ['牧师', '圣武士', '邪术师', '法师'],
    castTime: '1分钟',
    range: '10尺',
    components: ' V、S、M（总价值至少100gp的圣水或银、铁粉，作为本法术的耗材）',
    duration: '1小时',
    conc: false,
    description: '指定施法距离内地面上你能看见的一点，并在该处创造了一个10尺半径、20尺高的柱状魔法能量。而承载能量柱的地面或其他平面上则会显现出闪光的符文。\n指定以下生物类型中的一种或多种：天界生物、元素生物、精类生物、邪魔、不死生物。法阵将会对被指定类型的生物产生以下效应：\n·该类生物不能以非魔法手段主动进入柱状区域内。如果该类生物试图使用传送或位面旅行进入此区域，则它必须先进行一次魅力豁免以判定其是否成功。\n·该类生物对柱状区域内的生物进行攻击检定时具有劣势。\n·柱状区域内的目标不受该类生物所魅惑，恐慌或附身。\n施放本法术时，你可以选择让魔法作用于相反的方向来阻止特定种类的生物离开柱状区域内，以保护区域外的目标。\n升环施法效应: 使用4环或更高法术位施放本法术时，你使用的法术位每比3环高一环，法术持续时间就增加1小时。'
  },
  {
    id: 'mass_healing_word',
    name: '群体治愈真言',
    nameEn: 'Mass Healing Word',
    level: 3,
    school: '塑能',
    classes: ['牧师', '吟游诗人'],
    castTime: '附赠动作',
    range: '60尺',
    components: 'V',
    duration: '立即',
    conc: false,
    description: '你高声诵出复原的真言，并指定施法距离内至多六个你能看见的生物，使其各自恢复一定的生命值，其数值等于1d4+ 你的施法关键属性调整值。本法术对不死生物和构装生物无效。\n升环施法效应: 使用4环或更高法术位施放本法术时，你使用的法术位每比3环高一环，其治疗量就增加1d4。'
  },
  {
    id: 'meld_into_stone',
    name: '融身入石',
    nameEn: 'Meld into Stone',
    level: 3,
    school: '变化',
    classes: ['牧师', '德鲁伊', '游侠'],
    castTime: '动作',
    range: '触及',
    components: 'V、S',
    duration: '8小时',
    conc: false,
    description: '你进入一个足以完全容纳你身体的石制物件或石材表面内，使你自己和你携带的所有装备在法术持续时间内与石头融为一 体。你可以在移动时从一个你能接触到的位置进入石中。此后，任何非魔法的感官都无法看到或侦测到你的存在。\n与石头融合后，你看不到外界发生了什么，并且你为了聆听外界声音而进行的任何感知（察觉）检定都具有劣势。与石头融合时，你仍能感觉到时间的流逝，也可以对自己施放法术。此时你无法移动，不过可以从进入石头的地方以移动的方式离开石内并终止本法术。\n石头所受的轻微损伤不会对你造成伤害，不过石头部分损毁或者形状改变时（改变到不再适合容纳你的程度），会将你从石中排挤出并对你造成6d6的钝击伤害。石头完全损毁（或材质改变）时，也会将你从石中排挤出并对你造成50点钝击伤害。被排挤出石头时，你将被摔至距离第一次进入石头处最近一处未被占据的空间位置，并陷入倒地状态。'
  },
  {
    id: 'motivational_speech',
    name: '励志演讲',
    nameEn: 'Motivational Speech',
    level: 3,
    school: '附魔',
    classes: [ '吟游诗人', '牧师' ],
    castTime: '1分钟',
    range: '60尺',
    components: 'V',
    duration: '1小时',
    conc: false,
    description: '你向盟友、工作人员、或是无辜的旁观者发出劝诫，激励他们向往崇高的目标，不管到底有没有发生什么让他们兴奋的事情。选择施法距离内最多5个可以听见你的生物。在持续时间中，每个生物都可以得到5点临时生命值，并且在感知豁免中具有优势。如果一个受影响的生物被一次攻击击中，它将在下一个它所进行的攻击检定中具有优势。一旦一个受影响的生物失去了这个法术所提供的临时生命值，这个法术就对它结束了。\n升环施法效应: 当你使用4环或更高的法术位施放本法术时，使用的法术位每高一环，提供的临时生命值就增加5点。'
  },
  {
    id: 'protection_from_energy',
    name: '防护能量',
    nameEn: 'Protection from Energy',
    level: 3,
    school: '防护',
    classes: ['奇械师', '牧师', '德鲁伊', '游侠', '术士', '法师'],
    castTime: '动作',
    range: '触及',
    components: 'V、S',
    duration: '专注，至多1小时',
    conc: true,
    description: '受你触碰的一个自愿生物在法术持续时间内对下列你指定的一种伤害类型具有抗性：强酸、冷冻、火焰、闪电、雷鸣'
  },
  {
    id: 'remove_curse',
    name: '解咒术',
    nameEn: 'Remove Curse',
    level: 3,
    school: '防护',
    classes: ['牧师', '圣武士', '邪术师', '法师'],
    castTime: '动作',
    range: '触及',
    components: 'V、S',
    duration: '立即',
    conc: false,
    description: '你的触碰立即为一个生物或一个物件解除其身上的所有诅咒。如果目标物体是一件被诅咒的魔法物品则其上的诅咒不会因此解除，不过本法术可以打破诅咒物品与其所有者之间的同调，使其所有者可以将其卸下或丢弃。'
  },
  {
    id: 'revivify',
    name: '回生术',
    nameEn: 'Revivify',
    level: 3,
    school: '死灵',
    classes: ['奇械师', '牧师', '圣武士', '德鲁伊', '游侠'],
    castTime: '动作',
    range: '触及',
    components: 'V、S、M（总价值至少300gp的钻石，作为本法术的耗材）',
    duration: '立即',
    conc: false,
    description: '你触碰一个在前一分钟内刚刚死去的生物，使该生物以1点生命值重生。本法术不能复活老死的生物，也不能恢复失去的身体部位。'
  },
  {
    id: 'sending',
    name: '短讯术',
    nameEn: 'Sending',
    level: 3,
    school: '塑能',
    classes: ['吟游诗人', '牧师', '法师'],
    castTime: '动作',
    range: '无限',
    components: 'V、S、M（一小段细铜线）',
    duration: '1轮',
    conc: false,
    description: '你向你所熟识的一个生物发送一小段二十五个单词以内的信息。该生物将在心中听到你的信息，他可以认出你是发讯人（如果他认识你），还可以用同样的方式立即回复一条讯息。对方的智力值必须至少为1才能理解你的信息。\n你的传讯可以跨越任意长的距离，甚至能跨越位面。但如果目标和你不在同一个存在位面，则短讯术有5%的概率无法到达。'
  },
  {
    id: 'speaking_with_dead',
    name: '死者交谈',
    nameEn: 'Speak with Dead',
    level: 3,
    school: '死灵',
    classes: ['吟游诗人', '牧师', '法师'],
    castTime: '动作',
    range: '10尺',
    components: 'V、S、M（燃烧的香）',
    duration: '10分钟',
    conc: false,
    description: '你给施法距离内一具尸体赋予少许生命与智力，让其可回答你的问题。这具尸体必须还有一张嘴，且不能是不死生物。若目标尸体在最近十日内曾被作为本法术的目标，则本次施法失败。\n你可以在法术终止前向尸体提出最多五个问题。尸体的知识仅限于其生前所知，包括它所讲的语言。回答通常是简短，含糊或重复的语句，而且如果你对尸体抱有敌意或者尸体认为你是其敌人，它也不必一定要给你正确的答复。本法术并不能让该生物的灵魂返回其身体中，只是活化了其精神。因此，该尸体不能认知新的信息，不能理解它死后发生的任何事情，也不能对未来的事件作出猜测。'
  },
  {
    id: 'spirit_guardians',
    name: '灵体卫士',
    nameEn: 'Spirit Guardians',
    level: 3,
    school: '咒法',
    classes: ['牧师'],
    castTime: '动作',
    range: '自身（半径15尺）',
    components: 'V、S、M（一面圣徽）',
    duration: '专注，至多10分钟',
    conc: true,
    description: '你唤来灵体作你的守卫，并使其在法术持续时间内在你周围15尺内四处飞舞。如果你属于善良或中立阵营，则它们飘渺的身形看起来像是天使或精类生物（由你选择）。如果你属于邪恶阵营，则它们将形如邪魔。\n施放本法术时，你可以指定你能看见的内任意数量生物让其不受本法术影响。受术生物在该区域内其速度减半，且当它在一个回合内第一次进入该区域或在区域内开始其回合时，必须进行一次感知豁免。豁免失败则受到3d8点光耀伤害（如果你属于善良或中立）或3d8点黯蚀伤害（如果你属于邪恶），豁免成功则伤害减半。\n升环施法效应: 使用4环或更高法术位施放本法术时，你使用的法术位每比3环高一环，法术的伤害就增加1d8。'
  },
  {
    id: 'spirit_shroud',
    name: '魂灵环绕',
    nameEn: 'Spirit Shroud',
    level: 3,
    school: '死灵',
    classes: ['牧师', '圣武士', '邪术师', '法师'],
    castTime: '附赠动作',
    range: '自身',
    components: 'V、S',
    duration: '专注，至多1分钟',
    conc: true,
    description: '你召来亡者的魂灵，而它们在法术持续时间内环绕于你的身边。这些魂灵无形且不可伤害。\n直到法术终止前，你所有命中你10尺内生物的攻击造成1d8额外伤害。伤害类型为光耀、黯蚀或寒冷（由你在施放法术的时候选择）。任何受到此伤害的生物无法恢复生命值直到你的下个回合开始。\n此外，任何你10尺内可见生物回合开始时，你可以使其速度降低10尺直到你的下个回合开始。\n升环施法效应: 使用四环或更高法术位施放本法术时，你使用的法术位每比三环高2环，其伤害就增加1d8。'
  },
  {
    id: 'tongues',
    name: '巧言术',
    nameEn: 'Tongues',
    level: 3,
    school: '预言',
    classes: ['吟游诗人', '牧师', '术士', '邪术师', '法师'],
    castTime: '动作',
    range: '触及',
    components: 'V、M（一个陶制阶梯金字塔小模型）',
    duration: '1小时',
    conc: false,
    description: '本法术赋予你所触碰生物听懂任何语言的能力。此外，当目标生物说话时，任何能听见其话语且掌握至少一门语言的生物都能听懂它的话。'
  },
  {
    id: 'water_walk',
    name: '水上行走',
    nameEn: 'Water Walk',
    level: 3,
    school: '变化',
    classes: ['奇械师', '牧师', '德鲁伊', '游侠', '术士'],
    castTime: '动作',
    range: '30尺',
    components: 'V、S、M（一个软木塞）',
    duration: '1小时',
    conc: false,
    description: '使受术者行走于任何液体表面时（例如流水、酸液、泥浆、雪地、流沙、熔岩）都如同行走在无伤害性的实体地面上。（但走在熔岩上的生物仍会因高热而受伤）。你可以将此能力赋予施法距离内你能看见的至多十个自愿生物，并使其在法术持续时间内拥有该能力。\n如果你选择一个浸没在水中的生物作为本法术的目标，则受术者将会以每轮60尺的速度上升，直至浮上液面。'
  },

];

/* ============================================================
   角色配置 (Character Config)
   修改此处即可定制角色数据，无需改动逻辑代码。
============================================================ */
const CHAR = {
  maxHp:           37,
  channelDivinity:  1,
  spellSlots:      [0, 4, 3, 2],   // index=环阶(1-3), [0]占位
  maxPrepared:      8,              // 可携带的自选法术总上限
  maxCantrips:      4,              // 已知戏法上限
  /* 生命领域法术 - 常驻备法，玩家无法移除 */
  domainSpells: {
    1: ['cure_wounds', 'bless'],
    2: ['lesser_restoration', 'spiritual_weapon'],
    3: ['beacon_of_hope', 'revivify'],
  },
};

/* 状态列表 */
const BUFFS = [
  '祝福术 +1d4',
  '神导术 +1d4',
  '倒地',
  '中毒',
  '目盲',
  '魅惑',
];

/* ============================================================
   localStorage 工具
============================================================ */
function save(key, val) { localStorage.setItem('dnd_' + key, JSON.stringify(val)); }
function load(key, def) {
  const v = localStorage.getItem('dnd_' + key);
  return v === null ? def : JSON.parse(v);
}

/* ============================================================
   初始化状态
============================================================ */
let state = {
  hp:            load('hp', CHAR.maxHp),
  maxHp:         load('maxHp', CHAR.maxHp),
  tempHp:        load('tempHp', 0),
  slots:         load('slots', [[], [false,false,false,false], [false,false,false], [false,false]]),
  cantripIds:    load('cantripIds',  []),   // 已知戏法 ID 列表
  preparedIds:   load('preparedIds', []),   // 自选备法 ID 列表（含环1-3，不超过 maxPrepared）
  deathSave:     load('deathSave', { success:[false,false,false], fail:[false,false,false] }),
  exhaustion:    load('exhaustion', [false, false, false, false]),
  channel:       load('channel', new Array(CHAR.channelDivinity).fill(false)),
  buffs:         load('buffs', {}),
  concentration: load('concentration', null),  // 专注中的法术 ID，或 null
  luckyDice:     load('luckyDice', 0),
};

/* ============================================================
   辅助函数
============================================================ */
const $ = id => document.getElementById(id);

function getSpell(id) { return SPELL_DB.find(s => s.id === id); }

function allDomainIds() {
  return Object.values(CHAR.domainSpells).flat();
}

function isPrepared(id) {
  return state.preparedIds.includes(id) || allDomainIds().includes(id) || state.cantripIds.includes(id);
}

/* ============================================================
   渲染：血量
============================================================ */
function hpColor(pct) {
  /* hue: 0=红 120=维 线性差内 */
  const hue = Math.round(pct * 120);
  return `hsl(${hue}, 65%, 38%)`;
}

function renderHp() {
  $('hp-current').textContent = state.hp;
  $('hp-max').textContent = state.maxHp;
  const total = state.maxHp + state.tempHp;
  const hpPct   = (state.hp       / total) * 100;
  const tempPct = (state.tempHp   / total) * 100;
  const colorPct = Math.max(0, Math.min(1, state.hp / state.maxHp));
  $('hp-bar-fill').style.width = hpPct + '%';
  $('hp-bar-fill').style.background = hpColor(colorPct);
  $('hp-bar-temp').style.width = tempPct + '%';
  $('temp-hp-val').textContent = state.tempHp;
  $('temp-hp-badge').classList.toggle('has-temp', state.tempHp > 0);
}

/* ============================================================
   渲染：法术位
============================================================ */
function renderSlots() { renderSpellPanel(); }

/* ============================================================
   渲染：法术面板（统一入口）
============================================================ */
function renderSpellPanel() {
  renderCantripList();
  renderPreparedList();
}

/* ──── 构建单行法术卡片 ──── */
function buildSpellRow(sp, isDomain, isCantrip) {
  const row = document.createElement('div');
  row.className = 'srow' + (isDomain ? ' srow-domain' : '');

  /* 环阶徽章 */
  if (!isCantrip) {
    const badge = document.createElement('span');
    badge.className = 'srow-lv-badge';
    badge.textContent = sp.level + '环';
    row.appendChild(badge);
  }

  /* 名称区域（点击展开详情） */
  const nameWrap = document.createElement('div');
  nameWrap.className = 'srow-name';
  nameWrap.innerHTML = `<span class="srow-cn cinzel">${sp.name}</span><span class="srow-en">${sp.nameEn}</span>`;
  nameWrap.title = '点击查看详情';
  nameWrap.style.cursor = 'pointer';
  nameWrap.addEventListener('click', () => showInlineDetail(sp, row));
  row.appendChild(nameWrap);

  /* 专注徽章（可点击激活专注） */
  if (sp.conc) {
    const concBtn = document.createElement('button');
    concBtn.className = 'srow-conc-btn' + (state.concentration === sp.id ? ' active' : '');
    concBtn.textContent = '专注';
    concBtn.title = '点击激活/取消专注';
    concBtn.addEventListener('click', () => toggleConc(sp.id));
    row.appendChild(concBtn);
  }

  /* 右侧操作 */
  if (isDomain) {
    const lock = document.createElement('span');
    lock.className = 'srow-domain-lock';
    lock.textContent = '⚑';
    lock.title = '领域法术，常驻备法';
    row.appendChild(lock);
  } else {
    const rm = document.createElement('button');
    rm.className = 'srow-remove-btn';
    rm.textContent = '×';
    rm.title = '移除';
    rm.addEventListener('click', () => {
      if (isCantrip) removeCantrip(sp.id);
      else removeSpell(sp.id);
    });
    row.appendChild(rm);
  }

  return row;
}

/* ──── 行内详情展开 ──── */
function showInlineDetail(sp, row) {
  /* 若已展开同一行则收起 */
  const existing = row.nextElementSibling;
  if (existing && existing.classList.contains('srow-inline-detail')) {
    existing.remove();
    return;
  }
  const detail = document.createElement('div');
  detail.className = 'srow-inline-detail';
  detail.innerHTML = buildDetailHTML(sp);
  row.after(detail);
}

function formatCastTime(t) {
  if (t.includes('附赠动作')) return `<span class="cast-icon cast-icon-bonus"></span>${t}`;
  if (t.includes('动作'))   return `<span class="cast-icon cast-icon-action"></span>${t}`;
  return t;
}

function buildDetailHTML(sp) {
  return `
    <div class="detail-meta-grid">
      <div class="detail-meta-box">
        <div class="detail-meta-lbl">施法时间</div>
        <div class="detail-meta-val">${formatCastTime(sp.castTime)}</div>
      </div>
      <div class="detail-meta-box">
        <div class="detail-meta-lbl">施法距离</div>
        <div class="detail-meta-val">${sp.range}</div>
      </div>
      <div class="detail-meta-box">
        <div class="detail-meta-lbl">法术成分</div>
        <div class="detail-meta-val">${sp.components}</div>
      </div>
      <div class="detail-meta-box">
        <div class="detail-meta-lbl">持续时间</div>
        <div class="detail-meta-val">${sp.duration}</div>
      </div>
    </div>
    <div class="detail-minor">${sp.level === 0 ? '戏法' : sp.level + '环'} · ${sp.school}&emsp;${sp.classes.join('、')}</div>
    <div class="detail-desc">${sp.description.replace(/\n/g, '<br>')}</div>
  `;
}

/* ──── 戏法列表 ──── */
function renderCantripList() {
  const container = $('cantrips-list');
  container.innerHTML = '';
  /* 清理已不在 DB 中的遗留 ID */
  const cleaned = state.cantripIds.filter(id => getSpell(id));
  if (cleaned.length !== state.cantripIds.length) {
    state.cantripIds = cleaned;
    save('cantripIds', state.cantripIds);
  }
  state.cantripIds.forEach(id => {
    const sp = getSpell(id);
    if (sp) container.appendChild(buildSpellRow(sp, false, true));
  });
  $('cantrip-count').textContent = `${state.cantripIds.length} / ${CHAR.maxCantrips}`;
}

/* ──── 已备法术列表（自选 + 领域常驻，按环阶分组） ──── */
function renderPreparedList() {
  const container = $('prepared-list');
  container.innerHTML = '';
  /* 清理已不在 DB 中的遗留 ID */
  const cleaned = state.preparedIds.filter(id => getSpell(id));
  if (cleaned.length !== state.preparedIds.length) {
    state.preparedIds = cleaned;
    save('preparedIds', state.preparedIds);
  }
  [1, 2, 3].forEach(lv => {
    const domainAtLevel = (CHAR.domainSpells[lv] || []).map(getSpell).filter(Boolean);
    const chosenAtLevel = state.preparedIds.map(getSpell).filter(sp => sp && sp.level === lv);
    if (!domainAtLevel.length && !chosenAtLevel.length) return;

    const hdr = document.createElement('div');
    hdr.className = 'srow-lv-group-hdr';

    const lvLabel = document.createElement('span');
    lvLabel.textContent = lv + '环';
    hdr.appendChild(lvLabel);

    /* 法术位计数块 */
    const slotCount = CHAR.spellSlots[lv] || 0;
    if (slotCount > 0) {
      const gems = document.createElement('div');
      gems.className = 'slot-gems';
      for (let i = 0; i < slotCount; i++) {
        const gem = document.createElement('div');
        gem.className = 'slot-gem' + (state.slots[lv][i] ? ' used' : '');
        gem.title = lv + '环法术位 ' + (i + 1);
        gem.addEventListener('click', () => {
          state.slots[lv][i] = !state.slots[lv][i];
          save('slots', state.slots);
          renderPreparedList();
        });
        gems.appendChild(gem);
      }
      hdr.appendChild(gems);
    }

    container.appendChild(hdr);

    /* 领域法术（锁定）先展示 */
    domainAtLevel.forEach(sp => container.appendChild(buildSpellRow(sp, true, false)));
    /* 自选法术 */
    chosenAtLevel.forEach(sp => container.appendChild(buildSpellRow(sp, false, false)));
  });
  $('prepared-count').textContent = `${state.preparedIds.length} / ${CHAR.maxPrepared}`;
}

/* ──── 领域法术列表（已合并到 renderPreparedList） ──── */
function renderDomainList() {}  /* 保留空实现以兼容其他可能调用 */

/* ============================================================
   渲染：专注横条
============================================================ */
function renderConcentration() {
  const banner = $('concentration-banner');
  if (state.concentration) {
    const sp = getSpell(state.concentration);
    $('conc-spell-name').textContent = sp ? sp.name : state.concentration;
    banner.classList.add('active');
  } else {
    banner.classList.remove('active');
  }
}

function toggleConc(spellId) {
  state.concentration = (state.concentration === spellId) ? null : spellId;
  save('concentration', state.concentration);
  renderConcentration();
  renderSpellPanel();  /* 刷新专注按钮高亮状态 */
}

/* ============================================================
   渲染：死亡豁免
============================================================ */
function renderExhaustion() {
  document.querySelectorAll('.exhaust-pip').forEach((pip, i) => {
    pip.classList.toggle('active', state.exhaustion[i]);
  });
}

function renderDeathSaves() {
  ['success', 'fail'].forEach(type => {
    document.querySelectorAll(`#death-${type} .save-circle`).forEach((c, i) => {
      c.classList.toggle(type, state.deathSave[type][i]);
    });
  });
}

/* ============================================================
   渲染：引导神力
============================================================ */
function renderChannel() {
  const container = $('channel-pips');
  container.innerHTML = '';
  for (let i = 0; i < CHAR.channelDivinity; i++) {
    const pip = document.createElement('div');
    pip.className = 'resource-pip' + (state.channel[i] ? ' spent' : '');
    pip.addEventListener('click', () => {
      state.channel[i] = !state.channel[i];
      save('channel', state.channel);
      renderChannel();
    });
    container.appendChild(pip);
  }
}

/* ============================================================
   渲染：增益状态
============================================================ */
function renderBuffs() {
  const container = $('buff-chips');
  container.innerHTML = '';
  BUFFS.forEach(b => {
    const chip = document.createElement('button');
    chip.className = 'buff-chip' + (state.buffs[b] ? ' lit' : '');
    chip.textContent = b;
    chip.addEventListener('click', () => {
      state.buffs[b] = !state.buffs[b];
      save('buffs', state.buffs);
      renderBuffs();
    });
    container.appendChild(chip);
  });
}

function renderLuckyDice() {
  $('lucky-val').textContent = state.luckyDice;
  const pips = $('lucky-pips');
  pips.innerHTML = '';
  for (let i = 0; i < state.luckyDice && i < 20; i++) {
    const pip = document.createElement('div');
    pip.className = 'lucky-pip';
    pips.appendChild(pip);
  }
}

/* ============================================================
   法术选择器 Modal
============================================================ */
let pickerMode  = 'prepared';  /* 'cantrip' | 'prepared' */
let pickerLevel = 1;

function openPicker(mode) {
  pickerMode = mode;
  pickerLevel = (mode === 'cantrip') ? 0 : 1;
  $('spell-modal-title').textContent = (mode === 'cantrip') ? '选择戏法' : '选择备法';

  /* 控制 tab 可见性 */
  document.querySelectorAll('.sp-tab').forEach(tab => {
    const lv = parseInt(tab.dataset.lv);
    if (mode === 'cantrip') {
      tab.style.display = (lv === 0) ? '' : 'none';
    } else {
      tab.style.display = (lv === 0) ? 'none' : '';
    }
    tab.classList.toggle('active', lv === pickerLevel);
  });

  renderPickerList();
  $('spell-modal').classList.remove('hidden');
}

function renderPickerList() {
  const container = $('spell-modal-list');
  container.innerHTML = '';

  const domainIds = allDomainIds();
  const spells    = SPELL_DB.filter(sp => sp.level === pickerLevel);

  spells.forEach(sp => {
    const isDomain  = domainIds.includes(sp.id);
    const isAdded   = pickerLevel === 0
      ? state.cantripIds.includes(sp.id)
      : state.preparedIds.includes(sp.id);
    const anyAdded  = isDomain || isAdded;

    const row = document.createElement('div');
    row.className = 'picker-row' + (anyAdded ? ' added' : '');

    /* 主内容行 */
    const main = document.createElement('div');
    main.className = 'picker-row-main';

    const nameArea = document.createElement('div');
    nameArea.className = 'picker-name-area';
    nameArea.innerHTML = `
      <span class="picker-spell-cn cinzel">${sp.name}</span>
      <span class="picker-spell-en">${sp.nameEn}</span>
      <span class="picker-spell-meta">${sp.school}${sp.conc ? ' · 专注' : ''} · ${sp.castTime}</span>
    `;

    /* 添加按钮 */
    const addBtn = document.createElement('button');
    addBtn.className = 'picker-add-btn';
    if (isDomain) {
      addBtn.textContent = '领域';
      addBtn.disabled = true;
    } else if (isAdded) {
      addBtn.textContent = '已备';
      addBtn.disabled = true;
    } else {
      addBtn.textContent = '＋ 备法';
      addBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (pickerLevel === 0) addCantrip(sp.id);
        else addSpell(sp.id);
      });
    }

    main.appendChild(nameArea);
    main.appendChild(addBtn);
    row.appendChild(main);

    /* 点击展开详情 */
    const detail = document.createElement('div');
    detail.className = 'picker-row-detail';
    detail.innerHTML = buildDetailHTML(sp);
    row.appendChild(detail);

    main.addEventListener('click', () => {
      row.classList.toggle('expanded');
    });

    container.appendChild(row);
  });
}

/* ──── 动作：添加/移除 ──── */
function addSpell(id) {
  if (state.preparedIds.length >= CHAR.maxPrepared) {
    alert(`已达到自选备法上限（${CHAR.maxPrepared}个）`);
    return;
  }
  if (!state.preparedIds.includes(id)) {
    state.preparedIds.push(id);
    save('preparedIds', state.preparedIds);
    renderPreparedList();
    renderPickerList();
  }
}

function removeSpell(id) {
  state.preparedIds = state.preparedIds.filter(i => i !== id);
  save('preparedIds', state.preparedIds);
  if (state.concentration === id) {
    state.concentration = null;
    save('concentration', state.concentration);
    renderConcentration();
  }
  document.querySelectorAll('.srow-inline-detail').forEach(el => el.remove());
  renderPreparedList();
}

function addCantrip(id) {
  if (state.cantripIds.length >= CHAR.maxCantrips) {
    alert(`已达到戏法上限（${CHAR.maxCantrips}个）`);
    return;
  }
  if (!state.cantripIds.includes(id)) {
    state.cantripIds.push(id);
    save('cantripIds', state.cantripIds);
    renderCantripList();
    renderPickerList();
  }
}

function removeCantrip(id) {
  state.cantripIds = state.cantripIds.filter(i => i !== id);
  save('cantripIds', state.cantripIds);
  if (state.concentration === id) {
    state.concentration = null;
    save('concentration', state.concentration);
    renderConcentration();
  }
  document.querySelectorAll('.srow-inline-detail').forEach(el => el.remove());
  renderCantripList();
}

/* ──── Modal 事件绑定 ──── */
document.querySelectorAll('.sp-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    pickerLevel = parseInt(tab.dataset.lv);
    document.querySelectorAll('.sp-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderPickerList();
  });
});

$('spell-modal-close').addEventListener('click', () => $('spell-modal').classList.add('hidden'));
$('spell-modal').addEventListener('click', e => {
  if (e.target === $('spell-modal')) $('spell-modal').classList.add('hidden');
});

/* ──── 添加法术按钮 ──── */
document.querySelectorAll('.btn-spell-add').forEach(btn => {
  btn.addEventListener('click', () => openPicker(btn.dataset.mode));
});

/* ============================================================
   交互：血量编辑
============================================================ */
function startHpEdit() {
  $('hp-current').style.display = 'none';
  $('hp-input').style.display = '';
  $('hp-input').value = state.hp;
  $('hp-input').focus();
  $('hp-input').select();
}

function commitHpEdit() {
  let v = parseInt($('hp-input').value, 10);
  if (isNaN(v)) v = state.hp;
  state.hp = Math.max(0, Math.min(state.maxHp, v));
  save('hp', state.hp);
  $('hp-current').style.display = '';
  $('hp-input').style.display = 'none';
  renderHp();
}

function startMaxHpEdit() {
  $('hp-max').style.display = 'none';
  $('hp-max-input').style.display = '';
  $('hp-max-input').value = state.maxHp;
  $('hp-max-input').focus();
  $('hp-max-input').select();
}

function commitMaxHpEdit() {
  let v = parseInt($('hp-max-input').value, 10);
  if (isNaN(v) || v < 1) v = state.maxHp;
  state.maxHp = v;
  state.hp = Math.min(state.hp, state.maxHp);
  save('maxHp', state.maxHp);
  save('hp', state.hp);
  $('hp-max').style.display = '';
  $('hp-max-input').style.display = 'none';
  renderHp();
}

$('hp-current').addEventListener('click', startHpEdit);
$('hp-input').addEventListener('blur', commitHpEdit);
$('hp-input').addEventListener('keydown', e => { if (e.key === 'Enter') commitHpEdit(); });

$('hp-max').addEventListener('click', startMaxHpEdit);
$('hp-max-input').addEventListener('blur', commitMaxHpEdit);
$('hp-max-input').addEventListener('keydown', e => { if (e.key === 'Enter') commitMaxHpEdit(); });

function applyDamage(dmg) {
  const absorbed = Math.min(state.tempHp, dmg);
  state.tempHp -= absorbed;
  state.hp = Math.max(0, state.hp - (dmg - absorbed));
  save('hp', state.hp);
  save('tempHp', state.tempHp);
  $('temp-hp-slider').value = state.tempHp;
  $('temp-hp-slider-val').textContent = state.tempHp;
  renderHp();
}

$('hp-minus').addEventListener('click',  () => applyDamage(1));
$('hp-plus').addEventListener('click',   () => { state.hp = Math.min(state.maxHp, state.hp + 1); save('hp', state.hp); renderHp(); });
$('hp-minus5').addEventListener('click', () => applyDamage(5));
$('hp-plus5').addEventListener('click',  () => { state.hp = Math.min(state.maxHp, state.hp + 5); save('hp', state.hp); renderHp(); });

/* 血条拖拽 / 点击 */
function setHpFromBarX(clientX) {
  const track = $('hp-bar-track');
  const rect = track.getBoundingClientRect();
  const total = state.maxHp + state.tempHp;
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  state.hp = Math.min(state.maxHp, Math.round(ratio * total));
  save('hp', state.hp);
  renderHp();
}

let _draggingHpBar = false;
$('hp-bar-track').addEventListener('mousedown', e => {
  _draggingHpBar = true;
  setHpFromBarX(e.clientX);
  e.preventDefault();
});
document.addEventListener('mousemove', e => { if (_draggingHpBar) setHpFromBarX(e.clientX); });
document.addEventListener('mouseup',   () => { _draggingHpBar = false; });

$('hp-bar-track').addEventListener('touchstart', e => {
  _draggingHpBar = true;
  setHpFromBarX(e.touches[0].clientX);
  e.preventDefault();
}, { passive: false });
document.addEventListener('touchmove', e => { if (_draggingHpBar) setHpFromBarX(e.touches[0].clientX); }, { passive: false });
document.addEventListener('touchend',  () => { _draggingHpBar = false; });

/* 临时HP滑块 */
let _tempSliderOpen = false;

$('temp-hp-badge').addEventListener('click', e => {
  e.stopPropagation();
  _tempSliderOpen = !_tempSliderOpen;
  $('temp-hp-slider-wrap').classList.toggle('hidden', !_tempSliderOpen);
  if (_tempSliderOpen) {
    $('temp-hp-slider').value = state.tempHp;
    $('temp-hp-slider-val').textContent = state.tempHp;
  }
});

$('temp-hp-slider-wrap').addEventListener('click', e => e.stopPropagation());

document.addEventListener('click', () => {
  if (_tempSliderOpen) {
    _tempSliderOpen = false;
    $('temp-hp-slider-wrap').classList.add('hidden');
  }
});

$('temp-hp-slider').addEventListener('input', e => {
  state.tempHp = parseInt(e.target.value, 10);
  $('temp-hp-slider-val').textContent = state.tempHp;
  save('tempHp', state.tempHp);
  renderHp();
});

/* ============================================================
   交互：死亡豁免
============================================================ */
document.querySelectorAll('.save-circle').forEach(c => {
  c.addEventListener('click', () => {
    const type = c.dataset.type;
    const idx  = parseInt(c.dataset.idx, 10);
    state.deathSave[type][idx] = !state.deathSave[type][idx];
    save('deathSave', state.deathSave);
    renderDeathSaves();
  });
});

/* ============================================================
   交互：力竭计数
============================================================ */
document.querySelectorAll('.exhaust-pip').forEach(pip => {
  pip.addEventListener('click', () => {
    const idx = parseInt(pip.dataset.idx, 10);
    state.exhaustion[idx] = !state.exhaustion[idx];
    save('exhaustion', state.exhaustion);
    renderExhaustion();
  });
});

/* ============================================================
   交互：断专注
============================================================ */
$('conc-break').addEventListener('click', () => {
  state.concentration = null;
  save('concentration', null);
  renderConcentration();
  renderSpellPanel();
});

/* ============================================================
   交互：一键长休
============================================================ */
$('btn-long-rest').addEventListener('click', () => {
  state.maxHp         = CHAR.maxHp;
  state.hp            = state.maxHp;
  state.tempHp        = 0;
  state.slots         = [[], new Array(CHAR.spellSlots[1]).fill(false),
                             new Array(CHAR.spellSlots[2]).fill(false),
                             new Array(CHAR.spellSlots[3]).fill(false)];
  state.channel       = new Array(CHAR.channelDivinity).fill(false);
  state.deathSave     = { success:[false,false,false], fail:[false,false,false] };
  state.concentration = null;
  state.buffs         = {};
  /* 力竭每次长休减一级（从末尾往前找第一个激活的清除） */
  const lastActive = [...state.exhaustion].lastIndexOf(true);
  if (lastActive !== -1) state.exhaustion[lastActive] = false;
  save('maxHp',        state.maxHp);
  save('hp',           state.hp);
  save('tempHp',       state.tempHp);
  save('slots',        state.slots);
  save('channel',      state.channel);
  save('deathSave',    state.deathSave);
  save('concentration', state.concentration);
  save('buffs',        state.buffs);
  save('exhaustion',   state.exhaustion);
  $('temp-hp-slider').value = 0;
  $('temp-hp-slider-val').textContent = 0;
  $('temp-hp-slider-wrap').classList.add('hidden');
  renderHp();
  renderSlots();
  renderDeathSaves();
  renderExhaustion();
  renderChannel();
  renderConcentration();
  renderSpellPanel();
  renderBuffs();
});

/* ============================================================
   首次渲染
============================================================ */
renderHp();
renderSpellPanel();
renderConcentration();
renderDeathSaves();
renderExhaustion();
renderChannel();
renderBuffs();
renderLuckyDice();

/* 幸运骠子交互 */
$('lucky-minus').addEventListener('click', () => {
  if (state.luckyDice > 0) { state.luckyDice--; save('luckyDice', state.luckyDice); renderLuckyDice(); }
});
$('lucky-plus').addEventListener('click', () => {
  state.luckyDice++; save('luckyDice', state.luckyDice); renderLuckyDice();
});
$('lucky-val').addEventListener('click', () => {
  $('lucky-val').style.display = 'none';
  $('lucky-input').style.display = '';
  $('lucky-input').value = state.luckyDice;
  $('lucky-input').focus();
  $('lucky-input').select();
});
function commitLuckyEdit() {
  let v = parseInt($('lucky-input').value, 10);
  if (isNaN(v) || v < 0) v = state.luckyDice;
  state.luckyDice = v;
  save('luckyDice', state.luckyDice);
  $('lucky-val').style.display = '';
  $('lucky-input').style.display = 'none';
  renderLuckyDice();
}
$('lucky-input').addEventListener('blur', commitLuckyEdit);
$('lucky-input').addEventListener('keydown', e => { if (e.key === 'Enter') commitLuckyEdit(); });

/* 面板折叠按鈕 */
document.querySelectorAll('.panel').forEach(panel => {
  const title = panel.querySelector(':scope > .panel-title');
  if (!title) return;
  const btn = document.createElement('button');
  btn.className = 'panel-collapse-btn';
  btn.setAttribute('aria-label', '折叠面板');
  btn.textContent = '▾';
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const collapsed = panel.classList.toggle('collapsed');
    btn.textContent = collapsed ? '▸' : '▾';
  });
  title.appendChild(btn);
});

/* 底部标签翻页 */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
  });
});
