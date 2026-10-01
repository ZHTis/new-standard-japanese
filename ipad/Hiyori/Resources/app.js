(()=>{
'use strict';
// 原创练习：初级按课次语法主线，中级按课次话题配置延伸练习。
const raw = [
`初次见面|は…です|は提示话题，读作 wa；です表示礼貌判断。日语通常把谓语放在句末。|私 は 学生 です|我是学生。|私 は 先生 ではありません|我不是老师。`,
`身边的物品|これ・それ・あれ|これ指靠近说话人的物品，それ靠近听话人，あれ远离双方。の可表示所属。|これ は 私 の 本 です|这是我的书。|それ は 友達 の 傘 です|那是朋友的伞。`,
`这里是哪里|ここ・そこ・あそこ|这里、那里用ここ、そこ、あそこ。询问地点用どこ。|図書館 は あそこ です|图书馆在那里。|ここ は 教室 です|这里是教室。`,
`事物的存在|あります・います|无生命的事物用あります；人和动物用います。に标记存在的地点，が标记主体。|庭 に 猫 が います|院子里有猫。|机 の 上 に 時計 が あります|桌子上有钟。`,
`一天的时间|に・から・まで|具体时间后常用に。から表示起点，まで表示终点。毎日等通常不接に。|私 は 六時 に 起きます|我六点起床。|授業 は 九時 から です|课从九点开始。`,
`出发去旅行|へ・で・と|へ表示移动方向，读作 e；で表示交通工具；と表示同行者。|電車 で 大阪 へ 行きます|坐电车去大阪。|友達 と 学校 へ 行きます|和朋友去学校。`,
`每天做的事|を・で|を标记动作对象，读作 o；で标记动作发生的地点。存在的地点才用に。|家 で お茶 を 飲みます|在家喝茶。|図書館 で 本 を 読みます|在图书馆读书。`,
`工具与给予|で・にあげます|で可表示工具或语言；あげます表示给别人，に标记接受者。|日本語 で 日記 を 書きます|用日语写日记。|友達 に 花 を あげます|给朋友花。`,
`描述感受|い形容词|い形容词直接修饰名词；否定时去い加くないです。いい的否定是よくないです。|この お茶 は 熱い です|这杯茶很烫。|今日 は 寒くない です|今天不冷。`,
`城市的印象|な形容词|な形容词修饰名词时加な；作礼貌谓语时接です。きれい是な形容词。|ここ は 静かな 町 です|这里是安静的小镇。|この 公園 は きれい です|这个公园很漂亮。`,
`喜欢与擅长|が好きです|好き是な形容词，喜好的对象用が标记，不用を。|私 は 音楽 が 好き です|我喜欢音乐。|姉 は 料理 が 上手 です|姐姐擅长做饭。`,
`比较与选择|より・ほうが|AはBより…表示A比B更……。BよりAのほうが…也表达同样的比较方向。|今日 は 昨日 より 暖かい です|今天比昨天暖和。|電車 の ほう が 速い です|电车更快。`,
`数量与频率|数量词|日语量词依对象变化：书用冊，细长物用本。数量常放在助词后、动词前。|本 を 二冊 買いました|买了两本书。|一週間 に 三回 走ります|一周跑步三次。`,
`动作的先后|て形|て形连接先后动作，最后的谓语决定时态；てください表示请求。|朝ご飯 を 食べて 学校 へ 行きます|吃早饭后去学校。|ここ に 名前 を 書いてください|请在这里写名字。`,
`正在进行|ています|动词て形加います可表示正在进行；てもいいです表示许可。|弟 は 今 勉強 しています|弟弟现在正在学习。|ここ で 写真 を 撮ってもいいです|可以在这里拍照。`,
`连接描述|くて・で|い形容词去い加くて；な形容词和名词用で连接。|この 部屋 は 明るくて 広い です|这个房间明亮又宽敞。|母 は 親切で 元気 です|妈妈亲切又有精神。`,
`想要与邀请|ほしい・たい|物品愿望用がほしい；动作愿望用动词ます形去ます加たい。|新しい 辞書 が ほしい です|想要一本新词典。|京都 へ 行きたい です|想去京都。`,
`变化与决定|なります・します|い形容词去い加く；な形容词加に。なります表示变化，します表示主动改变。|天気 が 暖かく なりました|天气变暖了。|部屋 を きれいに します|把房间弄干净。`,
`不要与必须|ない形|ないでください表示请不要；なければなりません表示必须，不能按字面当作否定。|ここ で 走らないでください|请不要在这里跑。|明日 は 早く 起きなければなりません|明天必须早起。`,
`能力与爱好|ことができます|动词基本形加こと把动作名词化；ことができます表示有能力做某事。|私 は 泳ぐ こと が できます|我会游泳。|趣味 は 写真 を 撮る こと です|爱好是拍照。`,
`过去的体验|たことがあります|动词た形加ことがあります表示曾经的经验；不要混同某个确定时间的单次动作。|北海道 へ 行った こと が あります|曾经去过北海道。|早く 寝た ほう が いいです|最好早点睡。`,
`日常的简体|普通形|普通形常用于熟人交谈或句中从句。名词和な形容词现在肯定用だ。|明日 は 学校 へ 行かない|明天不去学校。|昨日 は 雨 だった|昨天是雨天。`,
`列举与变化|たり…たりします|动词た形加り，列举代表性动作；并不表示只做这两件事。|休日 は 本 を 読んだり 散歩 したりします|休息日看看书、散散步。|この 店 は 安かったり 高かったりします|这家店的价格有时便宜有时贵。`,
`想法与转述|と思います|と前接普通形，标记想法或引用的内容。思います表达说话人的判断。|明日 は 晴れる と 思います|我想明天会晴。|友達 は 来ない と 言いました|朋友说不来。`,
`修饰名词|连体修饰|日语用普通形从句直接放在名词前，不需要汉语的“的”。|これ は 昨日 買った 鞄 です|这是昨天买的包。|駅 へ 行く バス は あれ です|去车站的公交车是那辆。`,
`把动作当话题|のは・のが|普通形加の可把动作名词化；用は提出话题，用が标记喜好等的对象。|毎日 歩く の は 大切 です|每天走路很重要。|私 は 歌う の が 好き です|我喜欢唱歌。`,
`在某个时候|とき|名词加のとき，动词普通形加とき。动词的时态会影响动作先后。|子供 の とき 海 の 近く に 住んでいました|小时候住在海边。|暇な とき 音楽 を 聞きます|空闲时听音乐。`,
`为别人做事|てくれます|てくれます表示别人为我方做事；てもらいます从接受帮助的人出发表达。|友達 が 荷物 を 持ってくれました|朋友帮我拿了行李。|先生 に 作文 を 見てもらいました|请老师帮我看了作文。`,
`命令与禁止|命令形・な|基本形加な表示禁止，语气强烈。日常对话优先使用礼貌请求。|ここ に 入る な|不要进这里。|早く 来い|快来。`,
`意愿与提议|意志形|意志形可表达自己的意愿或邀请，如行こう；と思っています表示已有的打算。|一緒に 映画 を 見よう|一起看电影吧。|日本 で 働こう と 思っています|我打算在日本工作。`,
`规律与结果|と|条件と常用于自然规律、习惯和自动结果，后面通常不接命令或意志。|春 に なる と 花 が 咲きます|一到春天花就开。|この 道 を 行く と 駅 が あります|沿着这条路走就有车站。`,
`计划与安排|つもり・予定|基本形加つもり表示自己的打算；予定表达预定安排。|来年 留学する つもり です|打算明年留学。|会議 は 三時 に 始まる 予定 です|会议预定三点开始。`,
`自动与他动|自他动词|窓が開く表示窗户自行或处于打开状态；窓を開ける强调人为打开。|窓 が 開きました|窗户打开了。|私 が 窓 を 開けました|我打开了窗户。`,
`准备与状态|てあります・ておきます|てあります表示有意动作留下的状态；ておきます表示提前准备。|机 に 資料 が 置いてあります|桌子上放着资料。|明日 の 準備 を しておきます|提前做好明天的准备。`,
`如果与即使|たら・ても|たら表示假定或完成后的条件；ても表示即使发生前项也不改变后项。|雨 が 降ったら 家 に います|如果下雨就待在家。|忙しくても 朝ご飯 を 食べます|即使忙也吃早饭。`,
`说明原因|て・ので|て形可连接情感的原因；ので较客观地说明理由。|遅れて すみません|对不起，我迟到了。|雨 なので 出かけません|因为下雨，所以不出门。`,
`条件与建议|ば・なら|ば表示条件；なら承接对方的话题，提出建议或判断。|安ければ 買います|便宜的话就买。|京都 へ 行くなら 春 が いいです|要去京都的话，春天好。`,
`能做到的事|可能形|可能形表示能力或条件上的可能。食べる变为食べられる，読む变为読める。|私 は 日本語 が 少し 話せます|我会说一点日语。|ここ から 海 が 見えます|从这里能看见海。`,
`伴随的动作|て・ないで|て可表示伴随状态；ないで表示不做前项而做后项。|傘 を 持って 出かけます|带着伞出门。|朝ご飯 を 食べないで 来ました|没吃早饭就来了。`,
`动作的阶段|ところ・ばかり|基本形加ところ表示正要做；ているところ表示正在做；たところ表示刚做完。|今 から 勉強する ところ です|现在正要学习。|今 帰ってきた ところ です|现在刚回来。`,
`被动表达|受身形|被动句以承受动作的人或物为主语，动作执行者常用に标记。|弟 は 先生 に 褒められました|弟弟被老师表扬了。|私 は 犬 に かまれました|我被狗咬了。`,
`保持原样|まま|た形或ない形加まま表示状态保持不变；名词接のまま。|靴 を 履いた まま 入らないでください|请不要穿着鞋进来。|窓 を 開けた まま 寝ました|开着窗睡了。`,
`让某人做事|使役形|使役形表示让或使某人行动，需结合上下文区分强迫和许可。|先生 は 学生 に 作文 を 書かせました|老师让学生写了作文。|母 は 子供 を 遊ばせました|妈妈让孩子玩。`,
`根据迹象推测|ようです|ようです根据观察作推测；名词加の，な形容词加な后连接。|外 は 寒い よう です|外面似乎很冷。|隣 に 誰か いる よう です|隔壁似乎有人。`,
`变化的方向|ていきます・てきます|ていく表示从现在向未来发展；てくる可表示从过去发展到现在。|これから 暖かく なっていきます|接下来会逐渐变暖。|日本語 が 少し 分かってきました|渐渐能懂一点日语了。`,
`比喻与样态|ような・そうです|ような用于比喻并修饰名词；形容词词干加そうです表示从外观判断。|雪 の ような 雲 です|是像雪一样的云。|この ケーキ は おいしそう です|这个蛋糕看起来很好吃。`,
`尊敬的表达|尊敬语|尊敬语抬高对方动作主体。いらっしゃる对应行く、来る、いる。|先生 は 何時 に いらっしゃいますか|老师几点来？|部長 は 新聞 を お読みになります|部长读报纸。`,
`谦逊的表达|自谦语|自谦语用于自己的相关动作以尊重对方。伺う对应拜访或请教。|明日 先生 の 家 に 伺います|明天去拜访老师家。|荷物 を お持ちします|我来帮您拿行李。`
];
const middle = [
`旅途中的相遇|んです|んです用于解释情况、背景，或寻求解释。名词和な形容词需接なんです。|仕事 で 京都 へ 行く んです|我是因工作去京都的。|この 電車 は 大阪 まで 行く んですか|这辆电车是开到大阪的吗？`,
`得体地打招呼|によって|によって可表示依情况而异。日语礼貌表达要结合关系和场合选择。|あいさつ は 場面 によって 変わります|寒暄会随场合变化。|国 によって 習慣 が 違います|习惯因国家而不同。`,
`认识新同事|と申します|申す是言う的自谦表达，自我介绍可用と申します。|私 は 林 と 申します|我姓林。|皆様 と 働けて うれしい です|能和大家共事很高兴。`,
`走进办公室|ことになっています|ことになっています表示规则或既定安排，不等于个人当下的决定。|九時 に 出勤する ことになっています|规定九点上班。|金曜日 は 会議 を 開く ことになっています|规定周五开会。`,
`介绍一件产品|だけでなく|だけでなく表示不仅……，常与も呼应。|この 鞄 は 軽い だけでなく 丈夫 です|这个包不仅轻还结实。|値段 だけでなく 品質 も 大切 です|不仅价格，品质也重要。`,
`向前辈请教|ていただけますか|ていただけますか是请求对方为自己做事的礼貌表达。|使い方 を 教えていただけますか|能请您教我使用方法吗？|もう 一度 説明していただけますか|能请您再说明一次吗？`,
`讨论工作方案|について|について标记讨论、调查、说明等行为所涉及的话题。|新しい 計画 について 話し合いましょう|讨论一下新计划吧。|会議 について メール を 送りました|发送了关于会议的邮件。`,
`提出企划|ために|动词基本形加ために表示目的；名词加のために。前后动作通常有意志性。|売上 を 増やす ために 調査します|为了增加销售额而调查。|時間 を 節約する ために 工夫します|为了节省时间而想办法。`,
`处理意外|てしまいました|てしまう可表示完成，也可表达遗憾，具体意义依上下文判断。|大切な 書類 を 忘れてしまいました|忘了重要的文件。|予約 を 間違えてしまいました|把预约弄错了。`,
`协调日程|ようにします|ようにします表示有意识地努力做到某事，与一次性决定的ことにします不同。|時間 に 遅れない ようにします|我会注意不迟到。|早めに 連絡する ようにします|我会尽量提前联系。`,
`表达不同观点|とは限りません|とは限らない表示并非一定，否定的是绝对判断而非所有可能。|若い 人 が 皆 同じ 考え だ とは限りません|年轻人并不都持相同想法。|人気 が ある もの が いい とは限りません|受欢迎的东西不一定好。`,
`告别与语言|ても|ても表示让步，即使条件成立结果仍不改变。|離れていても 連絡 を 取りましょう|即使分开也保持联系吧。|方言 が 違っても 気持ち は 伝わります|即使方言不同也能传达心意。`,
`邀请别人发言|ていただけませんか|否定疑问形式使请求更委婉，要考虑对方的负担。|式 で お話ししていただけませんか|能请您在典礼上讲话吗？|少し お時間 を いただけませんか|能占用您一点时间吗？`,
`回访老师|おかげで|おかげで常用于有利结果并带感谢之意；负面结果常用せいで。|先生 の おかげで 合格 できました|多亏老师，我通过了考试。|皆さん の おかげで 仕事 に 慣れました|多亏大家，我适应了工作。`,
`和同学重逢|ようになりました|ようになる表示能力、习惯等的变化，前接基本形或ない形。|最近 自分 で 料理する ようになりました|最近开始自己做饭了。|日本語 の 新聞 が 読める ようになりました|已经能读日语报纸了。`,
`庆祝重要时刻|ことを願います|こと把愿望的内容名词化，願う表示祝愿或期盼。|お二人 が 幸せに 暮らす こと を 願っています|祝愿二位幸福地生活。|また お会いできる こと を 願っています|希望能再次见面。`,
`整理采访成果|を通して|を通して可表示通过某种活动或媒介获得体验。|取材 を通して 町 の 歴史 を 知りました|通过采访了解了小镇历史。|旅 を通して 友達 が 増えました|通过旅行结交了更多朋友。`,
`商务提案与书信|に関して|に関して表示关于某事，常用于较正式的讨论或文件。|契約 に関して 質問 が あります|关于合同有一个问题。|新商品 に関して 資料 を 送りました|发送了关于新产品的资料。`,
`回应问题与投诉|わけではありません|わけではない用于部分否定或否定由前文得出的结论。|品質 に 問題 が ある わけではありません|并不是质量有问题。|すべて の 水 が 飲める わけではありません|并非所有的水都能喝。`,
`希望与坚持|として|として标记身份、立场或资格。|地域 の 一員 として 活動しています|作为社区一员开展活动。|交流 の 場 として 公園 を 使います|把公园用作交流场所。`,
`在广州品茶|に比べて|に比べて表示以某对象为基准作比较。|去年 に比べて お茶 の 売上 が 増えました|茶的销售额比去年增加了。|朝 に比べて 今 は 涼しい です|比起早上，现在凉快些。`,
`电话里的沟通|次第|动词ます形去ます加次第，表示前项发生后立即做后项，常见于工作场景。|確認 でき 次第 お電話します|一经确认就给您打电话。|資料 が 届き 次第 連絡します|资料一到就联系您。`,
`探访水乡|ばかりでなく|ばかりでなく表示不仅……也……，用于补充并列信息。|この 町 は 美しい ばかりでなく 歴史 も あります|这个小镇不仅美丽，也有历史底蕴。|景色 ばかりでなく 料理 も 楽しめます|不仅能欣赏风景，还能享受美食。`,
`拍摄与广告|にとって|にとって表示从某人或群体的立场来看。|私たち にとって この 撮影 は 大切 です|对我们来说，这次拍摄很重要。|企業 にとって 信頼 は 重要 です|对企业来说，信任很重要。`,
`饮食与创意|につれて|につれて表示随着前项变化，后项也随之变化。|交流 が 増える につれて 料理 も 変わります|随着交流增加，料理也发生变化。|経験 を 積む につれて 自信 が つきます|随着积累经验，会增强自信。`,
`活动前的准备|に備えて|に備えて表示为预想的事情提前做好准备。|明日 の イベント に備えて 準備します|为明天的活动做准备。|大雨 に備えて 食料 を 買いました|为防备大雨买了食品。`,
`活动当天|最中に|动词ている或名词加の后接最中に，表示正在进行的当中。|説明している 最中に 電話 が 鳴りました|正在说明时电话响了。|準備 の 最中に 雨 が 降り始めました|正在准备时开始下雨了。`,
`技术与照护|によると|によると标明信息来源，常与そうです、とのことです等传闻表达呼应。|説明 によると この 機械 は 安全 だ そうです|据说明，这台机器很安全。|新聞 によると 新しい 病院 が できる そうです|据报纸报道，将建一所新医院。`,
`庆功与回顾|わけにはいきません|わけにはいかない表示因社会责任或情理而不能做，并非能力不足。|約束 した ので 休む わけにはいきません|因为约好了，不能休息。|大切な 会議 に 遅れる わけにはいきません|重要会议不能迟到。`,
`汇报与防灾|べきです|べき表示从责任或道理上应该做；语气较强，应注意使用场合。|結果 を 正確に 報告する べき です|应该准确汇报结果。|災害 に 備える べき です|应该为灾害做好准备。`,
`工作的新阶段|ことになりました|ことになった表示外部决定或客观安排；ことにした侧重自己的决定。|来月 大阪 へ 転勤する ことになりました|已决定我下个月调往大阪。|新しい チーム で 働く ことになりました|已安排在新团队工作。`,
`记忆与未来|たびに|动词基本形或名词加の后接たびに，表示每当发生某事就……。|この 町 を 訪れる たびに 昔 を 思い出します|每次来到这个小镇都会想起从前。|写真 を 見る たびに 友達 を 思い出します|每次看照片都会想起朋友。`
];
const books = [{name:'初级 · 上册',range:'第 1–24 课',subtitle:'从第一句日语开始',count:24},{name:'初级 · 下册',range:'第 25–48 课',subtitle:'把想法说得更完整',count:24},{name:'中级 · 上册',range:'第 1–16 课',subtitle:'走进真实的交流',count:16},{name:'中级 · 下册',range:'第 17–32 课',subtitle:'理解语境，准确表达',count:16}];
const lessons = [...raw,...middle].map((row,id)=>{const [title,grammar,note,a,az,b,bz]=row.split('|');return {id,book:id<24?0:id<48?1:id<64?2:3,no:id<48?id+1:id-47,title,grammar,note,pairs:[{tokens:a.split(' '),zh:az},{tokens:b.split(' '),zh:bz}]};});
const sentence=p=>p.tokens.join('')+'。';
function questions(l){ const [a,b]=l.pairs;return [
{type:'read',p:a,answer:a.zh,options:[a.zh,b.zh],prompt:'读懂这句话，选择正确的意思'},
{type:'listen',p:b,answer:b.zh,options:[a.zh,b.zh],prompt:'听一听，选择你听到的意思'},
{type:'build',p:a,prompt:'点击词块，组成完整的日语句子'},
{type:'listen',p:a,answer:sentence(a),options:[sentence(a),sentence(b)],prompt:'仔细听，选出你听到的句子'},
{type:'build',p:b,prompt:'把下面的意思用日语表达出来'},
{type:'speak',p:b,prompt:'听示范，再用自己的声音说出来'}
];}

// Optional iPad bridge. The ordinary browser version continues to use Web APIs.
const isNative = () => Boolean(window.webkit?.messageHandlers?.hiyori);
function sendNative(action, payload = {}) {
  if (isNative()) window.webkit.messageHandlers.hiyori.postMessage({ action, ...payload });
}
let ticket = 0;
let callbacks = null;
let nativeRecording = false;
function cancelNative() {
  ticket++;
  callbacks = null;
  nativeRecording = false;
  sendNative('cancel');
}
function startNativeRecording(handlers) {
  callbacks = handlers;
  sendNative('record', { ticket: ++ticket });
}
function stopNativeRecording() { sendNative('stopRecording', { ticket }); }
window.hiyoriNativeEvent = event => {
  if (event.type === 'message') {
    window.dispatchEvent(new CustomEvent('hiyori-message', { detail: event.message }));
    return;
  }
  if (event.ticket !== ticket || !callbacks) return;
  if (event.type === 'recording') {
    nativeRecording = true;
    callbacks.onStart();
  } else {
    nativeRecording = false;
    const handler = callbacks;
    callbacks = null;
    if (event.type === 'recorded') handler.onStop(event.audio);
    else handler.onError(event.message || '录音中断，请重试。');
  }
};

function getPreviewConfig(search, native = false) {
  const params = new URLSearchParams(search);
  const enabled = !native && params.get('preview') === '1';
  const views = ['home','kana','review','grammar','settings'];
  const number = (key, max) => {
    const value=params.get(key);
    return value !== null && /^\d+$/.test(value) && Number(value)<=max ? Number(value) : null;
  };
  return {
    enabled,
    storageKey: enabled ? 'hiyori-preview-v1' : 'hiyori-v1',
    view: enabled && views.includes(params.get('view')) ? params.get('view') : 'home',
    lesson: enabled ? number('lesson',79) : null,
    step: enabled ? number('step',5) : null
  };
}




const $=s=>document.querySelector(s);
const preview=getPreviewConfig(location.search,isNative());
const paths={home:'M3 10 12 3l9 7v10H3Z M9 20v-7h6v7',book:'M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15',review:'M4 8a8 8 0 1 1-1 7 M4 3v5h5 M12 8v5l3 2',grammar:'M5 3h14v18H5Z M8 7h8 M8 11h8 M8 15h5',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',sound:'M11 4 6 8H3v8h3l5 4Z M15 8a6 6 0 0 1 0 8 M18 5a10 10 0 0 1 0 14',arrow:'M4 12h16 M14 6l6 6-6 6',check:'M5 12l4 4L19 6',leaf:'M20 3C7 1 1 12 7 18s17-2 13-15Z M5 21 16 8'};
const icon=n=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.book}"/></svg>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=()=>new Date().toLocaleDateString('en-CA');
let state;try{state=(!preview.enabled&&window.hiyoriSavedState)||JSON.parse(localStorage.getItem(preview.storageKey))}catch{}state={done:{},mistakes:[],days:{},goal:15,rate:.85,book:0,...state};
let view=preview.view,book=state.book,session=null,recorder=null,stream=null,audioURL=null,recordTimer=null,recordPending=false;
function save(){if(isNative())sendNative('save',{value:state});try{localStorage.setItem(preview.storageKey,JSON.stringify(state))}catch{toast('浏览器无法保存进度，请检查存储设置。')}}
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',4500)}
const shuffled=a=>a.map(x=>({x,r:Math.random()})).sort((a,b)=>a.r-b.r).map(o=>o.x);
function speak(text,slow=false){if(isNative()){sendNative('speak',{text,rate:slow?.6:Number(state.rate)});return}if(!('speechSynthesis'in window)){toast('此浏览器不支持朗读，请使用支持语音合成的浏览器。');return}const voices=speechSynthesis.getVoices().filter(v=>v.lang.startsWith('ja'));if(!voices.length){toast('未找到日语语音，请在系统语音设置中添加日语。');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ja-JP';u.voice=voices[0];u.rate=slow?.6:Number(state.rate);u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')toast('朗读未能播放，请检查系统日语语音。')};speechSynthesis.speak(u)}
if('speechSynthesis'in window)speechSynthesis.getVoices();
function render(){
 const labels={home:'课程',kana:'五十音',review:'错题复习',grammar:'语法',settings:'设置'};
 const total=Object.keys(state.done).length;
 $('#app').innerHTML=`<div class="shell"><aside class="sidebar"><div class="brand">新标准日本语</div><nav class="nav" aria-label="主导航">${[['home','book'],['kana','home'],['review','review'],['grammar','grammar'],['settings','settings']].map(([v,i])=>`<button data-nav="${v}" class="${view===v?'active':''}">${icon(i)}${labels[v]}</button>`).join('')}</nav></aside><main class="main"><header class="topbar"><div class="breadcrumb"><span class="mobilebrand">新标准日本语 / </span>${labels[view]}${preview.enabled?' · 试用':''}</div><span class="progresslabel">已学习 ${total} / 80 课</span></header><div id="page">${view==='home'?home():view==='kana'?kana():view==='review'?review():view==='grammar'?grammar():settings()}</div><footer class="footer"><span>原创配套练习 · 非教材官方产品</span>${preview.enabled?'<span>试用记录单独保存</span>':''}</footer></main></div>`;
 bind();
}
function home(){
 const ls=lessons.filter(l=>l.book===book),next=ls.find(l=>!state.done[l.id]);
 const today=Math.floor((state.days[day()]||0)/60);
 return `<div class="heading"><div><h1>课程</h1><p class="sub">按教材顺序学习，也可直接选择课次。</p></div><button class="pill" data-nav="settings">今日 ${today} / ${state.goal} 分钟</button></div><div class="tabs" role="tablist">${books.map((b,i)=>`<button role="tab" aria-selected="${book===i}" data-book="${i}" class="${book===i?'active':''}">${b.name}</button>`).join('')}</div><p class="sub course-note">${book<2?'按课次核心语法编排 · 每课 6 组练习':'按课次话题编排 · 原创延伸句型，未逐条覆盖教材语法'}</p><section class="lessonlist">${ls.map((l,i)=>`${i%4===0?`<div class="unithead"><strong>第 ${Math.floor(i/4)+1} 单元</strong><small>${ls.slice(i,i+4).filter(x=>state.done[x.id]).length} / 4 课已学习</small></div>`:''}<button class="lesson ${l.id===next?.id?'current':''}" data-start="${l.id}"><span class="lessonnum">${String(l.no).padStart(2,'0')}</span><span class="lessontext"><strong>${l.title}</strong><p>${esc(l.grammar)}</p></span><span class="lessonend">${state.done[l.id]?'已学习':l.id===next?.id?'开始学习':'学习'} ${icon('arrow')}</span></button>`).join('')}</section>`;
}
const kanaRows=[['あいうえお','アイウエオ','a i u e o'],['かきくけこ','カキクケコ','ka ki ku ke ko'],['さしすせそ','サシスセソ','sa shi su se so'],['たちつてと','タチツテト','ta chi tsu te to'],['なにぬねの','ナニヌネノ','na ni nu ne no'],['はひふへほ','ハヒフヘホ','ha hi fu he ho'],['まみむめも','マミムメモ','ma mi mu me mo'],['や ゆ よ','ヤ ユ ヨ','ya - yu - yo'],['らりるれろ','ラリルレロ','ra ri ru re ro'],['わ   を','ワ   ヲ','wa - - - o'],['ん','ン','n']];
function kana(){return `<div class="heading"><div><h1>五十音</h1><p class="sub">点击假名听发音。先认识平假名，再熟悉片假名。</p></div></div><div class="card full"><p class="sub" style="margin-bottom:23px">清音入门表 · 大字为平假名，小字为片假名与罗马音。助词 は、へ、を 分别读 wa、e、o。浊音、拗音和长音仍需专项学习。</p><div class="kana">${kanaRows.map(([h,k,r])=>[...h].map((c,i)=>c===' '?'<span></span>':`<button data-say="${c}">${c}<small>${k[i]} · ${r.split(' ')[i]}</small></button>`).join('')).join('')}</div></div>`}
function review(){return `<div class="heading"><div><h1>错题复习</h1><p class="sub">答错的知识点会留在这里。复习答对后，自动移出错题本。</p></div></div>${state.mistakes.length?`<div class="card full"><h3>${state.mistakes.length} 道题，值得再想一遍</h3><button class="primary" id="reviewStart">开始错题复习 ${icon('arrow')}</button></div>${state.mistakes.map(m=>{const l=lessons[m.id];return `<div class="card full"><h3>${books[l.book].name} · 第 ${l.no} 课　${l.title}</h3><p class="jp">${l.grammar}</p><p class="sub">${l.note}</p></div>`}).join('')}`:`<div class="card full empty"><h2>暂无错题</h2><p class="sub">答错的题目会保存在这里。</p><button class="primary" style="margin-top:25px" data-nav="home">去学习</button></div>`}`}
function grammar(){return `<div class="heading"><div><h1>语法</h1><p class="sub">中文解释，日语例句。把零散的知识连起来。</p></div></div><input class="search" id="grammarSearch" aria-label="搜索语法" placeholder="搜索句型、主题或中文解释，例如：条件、と思います"><div class="grid" id="grammarGrid" style="margin-top:23px">${grammarCards(lessons)}</div>`}
function grammarCards(ls){return ls.length?ls.map(l=>`<div class="card grammarcard"><div class="eyebrow">${books[l.book].name} · 第 ${l.no} 课</div><p class="jp">${l.grammar}</p><p>${l.note}</p><button class="textbtn" data-start="${l.id}">练习这个知识点 →</button></div>`).join(''):'<p class="sub">没有找到对应内容，试试其他关键词。</p>'}
function settings(){return `<h1>设置</h1><div class="card full" style="margin-top:25px"><div class="formrow"><label for="goal">每日学习目标</label><select id="goal">${[10,15,20,30].map(n=>`<option value="${n}" ${state.goal===n?'selected':''}>${n} 分钟 / 天</option>`).join('')}</select></div><div class="formrow"><label for="rate">日语朗读语速</label><select id="rate">${[[.65,'慢速'],[.85,'适中'],[1,'正常']].map(([n,t])=>`<option value="${n}" ${Number(state.rate)===n?'selected':''}>${t}</option>`).join('')}</select></div><button class="pill" data-say="こんにちは。今日も一緒に勉強しましょう。">${icon('sound')} 试听日语语音</button><p class="sub" style="margin-top:22px">${isNative()?'课程已内置，可离线学习。进度保存在这台 iPad；录音仅用于本次练习，不上传，退出或进入后台时释放。朗读使用系统日语语音，首次可能需要联网下载语音。':'进度只保存在当前浏览器。录音只在本次练习中回放，不上传。朗读使用设备的日语语音，可能需要先安装日语语音包。'}</p><hr style="border:0;border-top:1px solid var(--line);margin:25px 0"><details><summary>课程与内容说明</summary><p class="sub">覆盖初级上下册 48 课、中级上下册 32 课的课程框架。每课当前包含 2 个原创例句及 6 组核心练习，属于可使用的基础版本，不是完整教材替代品。初级按课次语法主线，中级按话题配置延伸句型，未逐条核对教材全部语法。听力 2 题、阅读与组句 3 题、口语 1 题；口语采用自评，不自动判断发音。</p><p class="sub" style="margin-top:15px">课程结构参考：<a href="https://www.jpedo.com/news/2079.html" target="_blank" rel="noreferrer">新版标日课程目录</a> · <a href="https://www.mitsumura-tosho.co.jp/shoseki/nihongo/s" target="_blank" rel="noreferrer">出版社介绍</a></p></details></div>`}
function bind(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{view=b.dataset.nav;render();window.scrollTo(0,0)});document.querySelectorAll('[data-book]').forEach(b=>b.onclick=()=>{book=Number(b.dataset.book);state.book=book;save();render()});bindStarts();document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));if($('#goal'))$('#goal').onchange=e=>{state.goal=Number(e.target.value);save();toast('学习目标已保存')};if($('#rate'))$('#rate').onchange=e=>{state.rate=Number(e.target.value);save();toast('朗读语速已保存')};if($('#grammarSearch'))$('#grammarSearch').oninput=e=>{const q=e.target.value.toLowerCase();$('#grammarGrid').innerHTML=grammarCards(lessons.filter(l=>`${l.title}${l.grammar}${l.note}`.toLowerCase().includes(q)));bindStarts()};if($('#reviewStart'))$('#reviewStart').onclick=startReview;}
function bindStarts(){document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>start(Number(b.dataset.start)))}
function start(id){session={lesson:lessons[id],queue:questions(lessons[id]).map((q,index)=>({...q,id,index})),pos:-1,right:0,graded:0,unscored:0,spoken:false,started:Date.now(),seconds:0};showStudy()}
function startReview(){session={lesson:lessons[state.mistakes[0].id],queue:state.mistakes.map(m=>({...questions(lessons[m.id])[m.index],...m})),pos:0,right:0,graded:0,unscored:0,review:true,started:Date.now(),seconds:0};prepare();showStudy()}
function prepare(){session.selected=null;session.tokens=[];session.checked=false;session.feedback=null;const q=session.queue[session.pos];session.pool=shuffled(q.p.tokens.map((t,i)=>({t,i})));session.options=q.options?shuffled(q.options):[];session.recorded=false;session.skipped=false;session.showText=false;}
function cleanup(){cancelNative();recordPending=false;clearTimeout(recordTimer);if(recorder&&recorder.state!=='inactive'){recorder.onstop=null;recorder.stop()}stream?.getTracks().forEach(t=>t.stop());stream=null;recorder=null;if(audioURL){URL.revokeObjectURL(audioURL);audioURL=null}window.speechSynthesis?.cancel()}
function showStudy(){let overlay=$('.overlay');if(!overlay){overlay=document.createElement('div');overlay.className='overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','日语练习');document.body.append(overlay);$('.shell').inert=true;document.body.style.overflow='hidden'}const s=session;const q=s.queue[s.pos];const l=q?lessons[q.id]:s.lesson;overlay.innerHTML=`<div class="study"><div class="studyheader"><button class="close" id="quit" aria-label="退出练习">×</button><div class="progress"><span style="width:${Math.max(0,s.pos)/s.queue.length*100}%"></span></div><small>${s.pos<0?'课前手记':Math.min(s.pos+1,s.queue.length)+' / '+s.queue.length}</small></div><div class="eyebrow">${books[l.book].name} · 第 ${l.no} 课 · ${s.review?'错题复习':l.title}</div>${s.pos<0?intro(l):s.pos>=s.queue.length?result():exercise(q,l)}</div>`;$('#quit').onclick=quit;if(s.pos<0){$('#begin').onclick=()=>{s.pos=0;prepare();showStudy()};document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));}else if(s.pos>=s.queue.length){$('#finish').onclick=quit;}else bindExercise(q);overlay.querySelector('h2')?.setAttribute('tabindex','-1');}
function intro(l){return `<h2>先理解，再练习。</h2><span class="bigjp">${l.grammar}</span><p class="intro">${l.note}</p>${l.pairs.map(p=>`<div class="example"><div><div class="jp" lang="ja">${sentence(p)}</div><p>${p.zh}</p></div><button class="sound" data-say="${esc(sentence(p))}" aria-label="朗读例句">${icon('sound')}</button></div>`).join('')}<div class="checkrow"><span class="muted">2 听力 · 3 阅读与组句 · 1 跟读</span><button class="primary" id="begin">开始练习 ${icon('arrow')}</button></div>`}
function exercise(q,l){const s=session;return `<h2>${q.prompt}</h2>${q.type==='read'?`<div class="bigjp" lang="ja">${sentence(q.p)}</div>`:''}${q.type==='listen'?`<div class="listenarea"><button class="sound" id="play" aria-label="播放日语音频">${icon('sound')}</button><button class="pill" id="slow">慢速播放</button></div><button class="textbtn" id="transcript">${s.showText?'已显示原文，本题不计分':'无法听音？显示原文并跳过计分'}</button>${s.showText?`<p class="bigjp">${sentence(q.p)}</p>`:''}`:''}${q.options?`<div class="options">${s.options.map((o,i)=>`<button class="option ${s.selected===o?'selected':''}" data-option="${i}" ${s.checked?'disabled':''}><span class="key">${i+1}</span>${esc(o)}</button>`).join('')}</div>`:''}${q.type==='build'?`<p class="intro">${q.p.zh}</p><div class="answerline">${s.tokens.map(i=>`<button class="token" data-remove="${i}" ${s.checked?'disabled':''}>${q.p.tokens[i]}</button>`).join('')}</div><div class="tokens">${s.pool.map(({t,i})=>`<button class="token" data-token="${i}" ${s.tokens.includes(i)||s.checked?'disabled':''}>${t}</button>`).join('')}</div>`:''}${q.type==='speak'?`<div class="example"><div><div class="jp" lang="ja">${sentence(q.p)}</div><p>${q.p.zh}</p></div><button class="sound" id="play" aria-label="示范朗读">${icon('sound')}</button></div><div class="recorder"><p>听示范 → 录音 → 回放对比<br>注意句末发音、助词和停顿。本题通过自评完成。</p><button class="primary" id="record">${s.recorded?'重新录音':'开始录音'}</button><div id="recordingArea">${audioURL?`<audio controls src="${audioURL}"></audio>`:''}</div><p id="recordStatus" role="status">${s.recorded?'回放自己的录音，再决定是否掌握。':'录音最长 30 秒，仅用于本次回放。'}</p></div><div style="margin-top:20px"><button class="textbtn" id="skipSpeak">暂时不方便开口，跳过口语</button></div>`:''}${s.feedback?`<div class="feedback ${s.feedback.ok?'':'wrong'}" role="status"><strong>${s.feedback.title}</strong><div>${s.feedback.text}</div></div>`:''}<div class="checkrow"><span class="muted">${q.type==='speak'?'口语自评不计入客观正确率':'慢慢想，不限答题时间'}</span><button class="primary" id="check" ${!s.checked&&(q.type==='build'?s.tokens.length!==q.p.tokens.length:q.type==='speak'?!s.recorded:s.selected===null)?'disabled':''}>${s.checked?'继续':q.type==='speak'?'我已回听并完成跟读':'检查答案'} ${icon('arrow')}</button></div>`}
function bindExercise(q){const s=session;document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{s.selected=s.options[Number(b.dataset.option)];showStudy()});document.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{s.tokens.push(Number(b.dataset.token));showStudy()});document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{s.tokens=s.tokens.filter(i=>i!==Number(b.dataset.remove));showStudy()});if($('#play'))$('#play').onclick=()=>speak(sentence(q.p));if($('#slow'))$('#slow').onclick=()=>speak(sentence(q.p),true);if($('#transcript'))$('#transcript').onclick=()=>{s.showText=true;showStudy()};if($('#record'))$('#record').onclick=record;if($('#skipSpeak'))$('#skipSpeak').onclick=()=>{s.skipped=true;advance()};$('#check').onclick=()=>{if(s.checked){advance();return}if(q.type==='speak'){s.spoken=true;advance();return}const correct=q.type==='build'?s.tokens.map(i=>q.p.tokens[i]).join('')===q.p.tokens.join(''):s.selected===q.answer;if(s.showText)s.unscored++;if(!s.showText){s.graded++;if(correct)s.right++;const exists=state.mistakes.some(m=>m.id===q.id&&m.index===q.index);if(correct&&s.review)state.mistakes=state.mistakes.filter(m=>!(m.id===q.id&&m.index===q.index));else if(!correct&&!exists)state.mistakes.push({id:q.id,index:q.index});save()}s.checked=true;s.feedback={ok:correct,title:s.showText?'已看原文，本题不计分':correct?'理解得很好。':'再看一下这个知识点。',text:`${correct?'':`正确答案：${q.type==='build'?sentence(q.p):esc(q.answer)}<br>`}${lessons[q.id].note}`};showStudy()}}
async function record(){if(isNative()){recordOnIPad();return}if(recordPending)return;if(recorder?.state==='recording'){recorder.stop();return}if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('此浏览器无法录音，请在 localhost 或 HTTPS 下使用支持录音的浏览器。');return}recordPending=true;session.recorded=false;$('#check').disabled=true;const current=session;const pos=session.pos;try{cleanup();const acquired=await navigator.mediaDevices.getUserMedia({audio:true});if(session!==current||session.pos!==pos){acquired.getTracks().forEach(t=>t.stop());return}stream=acquired;recorder=new MediaRecorder(stream);const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{clearTimeout(recordTimer);stream?.getTracks().forEach(t=>t.stop());stream=null;if(session!==current||session.pos!==pos)return;audioURL=URL.createObjectURL(new Blob(chunks,{type:recorder.mimeType}));session.recorded=true;showStudy()};recorder.start();$('#record').textContent='结束录音';$('#recordStatus').textContent='正在录音… 再次点击结束，30 秒后自动停止。';recordTimer=setTimeout(()=>{if(recorder?.state==='recording')recorder.stop()},30000)}catch{toast('没有获得麦克风权限。可在浏览器中允许录音，或跳过本次口语。')}finally{recordPending=false}}

function recordOnIPad(){
  if(recordPending)return;
  if(nativeRecording){stopNativeRecording();return;}
  cleanup();
  const current=session,pos=session.pos;
  recordPending=true;session.recorded=false;$('#check').disabled=true;
  $('#recordStatus').textContent='正在请求麦克风…';
  startNativeRecording({
    onStart(){recordPending=false;if(session!==current||session.pos!==pos){cleanup();return;}$('#record').textContent='结束录音';$('#recordStatus').textContent='正在录音… 最长 30 秒，再次点击结束。';},
    onStop(audio){recordPending=false;if(session!==current||session.pos!==pos)return;audioURL=audio;session.recorded=true;showStudy();},
    onError(message){recordPending=false;if(session===current&&session.pos===pos){showStudy();toast(message);}}
  });
}
window.addEventListener('hiyori-message',e=>toast(e.detail));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&isNative()){cleanup();if(session&&session.queue[session.pos]?.type==='speak'){session.recorded=false;showStudy();}}});

function advance(){cleanup();session.pos++;if(session.pos>=session.queue.length){if(!session.saved){if(!session.review)state.done[session.lesson.id]={at:day(),correct:session.right,total:session.graded,speaking:session.spoken};session.saved=true;save()}}else prepare();showStudy()}
function result(){const s=session;return `<div class="results"><h2>练习完成</h2><p class="sub">${s.review?'答对的题目已移出错题本。':'学习记录已保存。'}</p><div class="resultstats"><strong>${s.graded?`${s.right} / ${s.graded}`:'—'}</strong><span>${s.graded?'客观题答对':'本次未作答计分题'}</span></div><p class="sub">${s.review?'':s.spoken?'口语：已录音、自评完成':'口语：本次已跳过'}${s.unscored>0?' · 显示原文的听力题不计分':''}</p><button class="primary" id="finish">返回课程 ${icon('arrow')}</button></div>`}
function quit(){cleanup();session=null;$('.overlay')?.remove();$('.shell').inert=false;document.body.style.overflow='';render()}
// 仅计入页面可见且正在练习的时间，每秒保存，避免退出或刷新丢失。
setInterval(()=>{if(session&&session.pos<session.queue.length&&!document.hidden){state.days[day()]=(state.days[day()]||0)+1;save()}},1000);
render();

if(preview.lesson!==null){start(preview.lesson);if(preview.step!==null){session.pos=preview.step;prepare();showStudy();}}

})();
