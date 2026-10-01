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
const sentence=p=>p.text??p.tokens.join('')+'。';
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
  if(event.type === 'speechStarted'){window.dispatchEvent(new CustomEvent('hiyori-speech-start',{detail:event.text}));return;}
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
  const views = ['today','home','kana','review','grammar','settings'];
  const number = (key, max) => {
    const value=params.get(key);
    return value !== null && /^\d+$/.test(value) && Number(value)<=max ? Number(value) : null;
  };
  return {
    enabled,
    storageKey: enabled ? 'hiyori-preview-v1' : 'hiyori-v1',
    view: enabled ? (views.includes(params.get('view')) ? params.get('view') : 'home') : 'today',
    lesson: enabled ? number('lesson',79) : null,
    step: enabled ? number('step',5) : null
  };
}

// Personal content is loaded separately so it never enters the public bundle.
function validMaterials(value) {
 if(!value||typeof value!=='object')return {};
 return Object.fromEntries(Object.entries(value).filter(([id,m])=>
  /^\d+$/.test(id)&&Number(id)<80&&m&&typeof m.title==='string'&&
  ['vocabulary','texts','grammar','questions','pages'].every(k=>Array.isArray(m[k]))&&
  m.questions.every(q=>['read','listen','build','speak'].includes(q.type)&&q.p&&
   typeof q.p.text==='string'&&Array.isArray(q.p.tokens)&&q.p.tokens.length&&q.p.tokens.every(t=>typeof t==='string'&&t)&&
   (!['read','listen'].includes(q.type)||(Array.isArray(q.options)&&q.options.includes(q.answer)&&new Set(q.options).size===q.options.length)))
 ));
}
function loadLocalMaterials() {
 return new Promise(resolve=>{
  const script=document.createElement('script');
  script.src='private-materials/catalog.js';
  script.onload=()=>resolve(validMaterials(window.hiyoriLocalMaterials));
  script.onerror=()=>resolve({});
  document.head.append(script);
 });
}
function materialQueue(lesson,base,material,practiceOnly=true){
 // Existing mistake records keep their original 0–5 indexes.
 const all=[...base,...(material?.questions||[])].map((q,index)=>({...q,id:lesson.id,index}));
 return practiceOnly&&material?.questions.length?all.slice(base.length):all;
}

// A transparent spaced-review scheduler. No network, model, or calendar simulation.
const DAY_MS=86400000;
const REVIEW_DAYS=[1,3,7,14,30,60];
const adaptiveDay=time=>{const d=new Date(time);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const normalized=text=>String(text).normalize('NFKC').replace(/\s/g,'');
const mix=(items,random)=>{const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
function learningPool(materials){
 const pool=[];
 for(const [lessonId,m] of Object.entries(materials).sort((a,b)=>Number(a[0])-Number(b[0]))){
  const seen=new Set();
  const add=(kind,ja,zh,audio,tokens,note)=>{
   const key=`${lessonId}:${kind}:${encodeURIComponent(normalized(ja))}`;
   if(!ja||!zh||seen.has(key))return;seen.add(key);
   pool.push({key,lessonId:Number(lessonId),kind,ja,zh,audio:audio||ja,tokens:tokens||[ja],note:note||`${ja}：${zh}`});
  };
  for(const v of m.vocabulary)add('word',v.ja,v.zh,v.kana,null,`${v.ja}（${v.kana}）：${v.zh}`);
  for(const t of m.texts)for(const line of t.lines){
   const q=m.questions.find(q=>q.type==='build'&&normalized(q.p.text)===normalized(line.ja));
   add('sentence',line.ja,line.zh,line.audio,q?.p.tokens,q?.explanation);
  }
 }
 return pool;
}
function isMastered(record){return Boolean(record&&record.stage>=4&&record.modes?.listen&&(record.modes?.read||record.modes?.build));}
function adaptiveStats(pool,records={},now=Date.now()){
 const used=pool.filter(i=>records[i.key]);
 return {total:pool.length,unseen:pool.length-used.length,active:used.filter(i=>!isMastered(records[i.key])).length,
  mastered:used.filter(i=>isMastered(records[i.key])).length,due:used.filter(i=>records[i.key].due<=now).length,
  introducedToday:used.filter(i=>records[i.key].introducedDay===adaptiveDay(now)).length,
  nextDue:used.length?Math.min(...used.map(i=>records[i.key].due)):null};
}
function nextMode(item,record){
 if(item.hasAudio===false)return item.tokens.length>1&&(record?.attempts||0)%2?'build':'read';
 if(!record||!record.modes?.read)return 'read';
 if(!record.modes?.listen)return 'listen';
 const modes=item.kind==='sentence'&&item.tokens.length>1?['listen','build','read']:['listen','read'];
 return modes[(record.attempts||0)%modes.length];
}
function choosePractice(pool,records={},now=Date.now(),random=Math.random){
 // A backlog uses the whole session; no new cards while 12+ reviews are due.
 const due=mix(pool.filter(i=>records[i.key]?.due<=now),random).sort((a,b)=>{
  const ar=records[a.key],br=records[b.key];
  return (ar.stage>0)-(br.stage>0)||ar.due-br.due;
 }).slice(0,12);
 const slots=Math.max(0,Math.min(6,12-due.length));
 // Only introduce from the earliest unfinished lesson, never jump to advanced books.
 const remaining=pool.filter(i=>!records[i.key]);
 const first=remaining.length?Math.min(...remaining.map(i=>i.lessonId)):null;
 const eligible=remaining.filter(i=>i.lessonId===first);
 const words=mix(eligible.filter(i=>i.kind==='word'),random),sentences=mix(eligible.filter(i=>i.kind==='sentence'),random);
 const fresh=[];
 while(fresh.length<slots&&(words.length||sentences.length)){
  const group=fresh.length%2===0?(words.length?words:sentences):(sentences.length?sentences:words);
  fresh.push(group.pop());
 }
 // Fill extra practice from learned cards, with unmastered and least-recently
 // answered cards first. No daily or active-card cap; mastery rules stay separate.
 const selected=new Set([...due,...fresh].map(i=>i.key));
 const onlyMastered=!remaining.length&&!pool.some(i=>records[i.key]&&!isMastered(records[i.key]));
 const extra=mix(pool.filter(i=>records[i.key]&&!selected.has(i.key)&&(onlyMastered||!isMastered(records[i.key]))),random).sort((a,b)=>{
  const ar=records[a.key],br=records[b.key];
  return Number(isMastered(ar))-Number(isMastered(br))||(ar.lastAnswered||ar.introducedAt||0)-(br.lastAnswered||br.introducedAt||0);
 }).slice(0,12-due.length-fresh.length);
 const batch=[...due,...fresh,...extra];
 let freshIndex=0;
 const tasks=mix(batch,random).map(i=>({key:i.key,type:records[i.key]?nextMode(i,records[i.key]):(freshIndex++%3===2&&i.hasAudio!==false?'listen':'read'),fresh:!records[i.key]}));
 // Keep a small optional speaking component. It never promotes memory mastery.
 const speech=mix(batch.filter(i=>i.kind==='sentence'&&i.hasAudio!==false),random).slice(0,Math.ceil(tasks.length/6));
 for(const item of speech)tasks.push({key:item.key,type:'speak',fresh:false});
 return tasks;
}
function introduceItem(now){return {stage:0,due:now,introducedAt:now,introducedDay:adaptiveDay(now),attempts:0,lapses:0,modes:{},lastPromotionDay:null};}
function recordRecall(previous,{correct,hinted=false,mode},now=Date.now()){
 const r={...(previous||introduceItem(now)),modes:{...(previous?.modes||{})}};
 // Viewing, introduction and recording alone are not evidence of recall.
 if(!['read','listen','build'].includes(mode))return r;
 r.attempts++;r.lastAnswered=now;
 if(!correct){r.stage=0;r.lapses++;r.due=now+10*60*1000;return r;}
 if(hinted){r.due=Math.max(r.due,now+DAY_MS);return r;}
 r.modes[mode]=true;
 const canPromote=now>=r.due&&r.lastPromotionDay!==adaptiveDay(now);
 if(canPromote){r.stage=Math.min(6,r.stage+1);r.lastPromotionDay=adaptiveDay(now);r.due=now+REVIEW_DAYS[r.stage-1]*DAY_MS;}
 else if(r.due<=now)r.due=now+DAY_MS;
 return r;
}
function practiceQuestion(item,task,pool,random=Math.random){
 const p={text:item.ja,zh:item.zh,audio:item.audio,tokens:item.tokens};
 if(task.type==='speak')return {id:item.lessonId,type:'speak',p,prompt:'听示范，再录音跟读',explanation:item.note};
 if(task.type==='build')return {id:item.lessonId,type:'build',p,prompt:'点击词块，回想这句话',explanation:item.note};
 // Avoid close formulaic synonyms becoming competing correct choices.
 const similar=[['はい','そうです'],['すみません','どうもすみません'],['よろしくお願いします','こちらこそ']];
 const excluded=new Set(similar.find(g=>g.includes(item.ja))||[]);
 const distractors=[...new Set(mix(pool.filter(i=>i.kind===item.kind&&i.key!==item.key&&!excluded.has(i.ja)),random).map(i=>i.zh))].filter(zh=>normalized(zh)!==normalized(item.zh)).slice(0,3);
 return {id:item.lessonId,type:task.type,p,answerLang:'zh-CN',prompt:task.type==='listen'?'听一听，选出正确的意思':'读一读，选出正确的意思',answer:item.zh,options:[item.zh,...distractors],explanation:item.note};
}
function appendRetry(tasks,pos,retried,key){
 if(retried.includes(key))return tasks;
 // At least two other recall cards before a second attempt; otherwise wait 10 min.
 const rest=tasks.slice(pos+1).filter(t=>t.key!==key&&t.type!=='speak');
 if(rest.length<2)return tasks;
 const third=rest[1],index=tasks.indexOf(third)+1;
 const out=[...tasks];out.splice(index,0,{...tasks[pos],fresh:false,retry:true});return out;
}

// Only explicitly verified local recordings. Never substitute speech synthesis.
const audioKey=text=>String(text).normalize('NFKC').replace(/\s/g,'');
function verifiedClips(entries=[]){
 const clips={};
 if(!Array.isArray(entries))return clips;
 for(const e of entries){
  if(!e||e.verified!==true||e.kind!=='human'||typeof e.text!=='string'||!e.text||typeof e.source!=='string'||!e.source.trim()||typeof e.track!=='string'||!e.track.trim())continue;
  if(typeof e.src!=='string'||!/^private-materials\/audio\/[\p{L}\p{N}_./ -]+\.(mp3|m4a|wav|ogg)$/u.test(e.src)||e.src.includes('..'))continue;
  const start=e.start??0,end=e.end??null;
  if(!Number.isFinite(start)||start<0||(end!==null&&(!Number.isFinite(end)||end<=start)))continue;
  clips[audioKey(e.text)]={...e,start,end};
 }
 return clips;
}
function loadHumanAudio(){return new Promise(resolve=>{
 const script=document.createElement('script');script.src='private-materials/audio-manifest.js';
 script.onload=()=>resolve(verifiedClips(window.hiyoriHumanAudio));script.onerror=()=>resolve({});document.head.append(script);
});}
function recordingFor(clips,text){return clips[audioKey(text)]||null;}
function createHumanPlayer(makeAudio=src=>new Audio(src)){
 let current=null,timer=null,cancelPending=null;
 function stop(){if(cancelPending){cancelPending();cancelPending=null;}clearInterval(timer);timer=null;if(current){current.pause();current.onloadedmetadata=null;current.onerror=null;current.onended=null;current=null;}}
 async function play(clip,rate=1){
  stop();if(!clip)throw new Error('missing');
  const audio=makeAudio(clip.src);current=audio;audio.preload='auto';audio.playbackRate=rate;audio.preservesPitch=true;
  try{
   if(audio.readyState<1)await new Promise((resolve,reject)=>{cancelPending=resolve;audio.onloadedmetadata=()=>{cancelPending=null;resolve();};audio.onerror=()=>{cancelPending=null;reject(new Error('load'));};});
   if(current!==audio)return false;
   if(clip.start>=audio.duration||(clip.end!==null&&clip.end>audio.duration+.1))throw new Error('segment');
   audio.currentTime=clip.start;await audio.play();
   if(current!==audio){audio.pause();return false;}
   if(clip.end!==null)timer=setInterval(()=>{if(audio.currentTime>=clip.end)stop();},25);
   audio.onended=stop;return true;
  }catch(error){if(current===audio)stop();throw error;}
 }
 return {play,stop};
}

// A question may render repeatedly while selecting tokens or receiving feedback.
function createQuestionAutoplay({play,available,visible=()=>true}){
 const attempted=new WeakMap();
 return function autoplay(session){
  const q=session?.queue[session.pos];
  if(!session?.daily||!q||session.checked||!visible()||!available(q))return;
  if(attempted.get(session)===session.pos)return;
  attempted.set(session,session.pos);
  play(q);
 };
}

// One cancellable transition. Never advance a different question or a hidden page.
function createAnswerFlow({current,advance,visible=()=>true,setTimer=setTimeout,clearTimer=clearTimeout,delay=800}){
 let timer=null;
 function cancel(){if(timer!==null)clearTimer(timer);timer=null;}
 function schedule(){
  cancel();const s=current();
  if(!s||!s.checked||!s.feedback?.ok||s.explanationOpen||!visible())return;
  const pos=s.pos;
  timer=setTimer(()=>{timer=null;if(current()===s&&s.pos===pos&&s.checked&&s.feedback?.ok&&!s.explanationOpen&&visible())advance();},delay);
 }
 return {cancel,schedule};
}








let materials={},studyPool=[],dailyRefreshKey='',humanClips={};
const humanPlayer=createHumanPlayer();
const hasRecording=text=>Boolean(recordingFor(humanClips,text));
const canReadSentence=text=>studyPool.some(i=>i.kind==='sentence'&&i.ja===text)||/[。？！?!]/.test(text);
const canPlay=text=>hasRecording(text)||(canReadSentence(text)&&(isNative()||Boolean(window.speechSynthesis)));
let speechStarted=null;
function stopSpeech(){speechStarted=null;window.speechSynthesis?.cancel();if(isNative())cancelNative();}
window.addEventListener('hiyori-speech-start',e=>speechStarted?.(e.detail));
const autoplayQuestion=createQuestionAutoplay({play:q=>speak(sentence(q.p)),available:q=>canPlay(sentence(q.p)),visible:()=>!document.hidden});
const $=s=>document.querySelector(s);
const completed=l=>Boolean(state.done[l.id])&&(!materials[l.id]||state.done[l.id].materialVersion===materials[l.id].version);
const lessonTitle=l=>materials[l.id]?.title||l.title;
const preview=getPreviewConfig(location.search,isNative());
const paths={home:'M3 10 12 3l9 7v10H3Z M9 20v-7h6v7',book:'M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15',review:'M4 8a8 8 0 1 1-1 7 M4 3v5h5 M12 8v5l3 2',grammar:'M5 3h14v18H5Z M8 7h8 M8 11h8 M8 15h5',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',sound:'M11 4 6 8H3v8h3l5 4Z M15 8a6 6 0 0 1 0 8 M18 5a10 10 0 0 1 0 14',arrow:'M4 12h16 M14 6l6 6-6 6',check:'M5 12l4 4L19 6',leaf:'M20 3C7 1 1 12 7 18s17-2 13-15Z M5 21 16 8'};
const icon=n=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.book}"/></svg>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=()=>new Date().toLocaleDateString('en-CA');
let state;try{state=(!preview.enabled&&window.hiyoriSavedState)||JSON.parse(localStorage.getItem(preview.storageKey))}catch{}state={done:{},mistakes:[],days:{},goal:15,rate:.85,audioRate:1,book:0,...state};
state.adaptive={records:{},run:null,...state.adaptive};
let view=preview.view,book=state.book,session=null,recorder=null,stream=null,audioURL=null,recordTimer=null,recordPending=false;
const answerFlow=createAnswerFlow({current:()=>session,advance:()=>advance(),visible:()=>!document.hidden});
function save(){if(isNative())sendNative('save',{value:state});try{localStorage.setItem(preview.storageKey,JSON.stringify(state))}catch{toast('浏览器无法保存进度，请检查存储设置。')}}
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',4500)}
const shuffled=a=>a.map(x=>({x,r:Math.random()})).sort((a,b)=>a.r-b.r).map(o=>o.x);
function speak(text,slow=false){
 const current=session,pos=session?.pos,clip=recordingFor(humanClips,text);
 const heard=()=>{if(session===current&&current?.pos===pos&&current.queue[pos]?.p&&sentence(current.queue[pos].p)===text){current.heard=true;if(current.queue[pos].type==='listen'&&!current.checked)showStudy();}};
 stopSpeech();humanPlayer.stop();
 if(clip){humanPlayer.play(clip,slow?.75:Number(state.audioRate)||1).then(played=>{if(played)heard();}).catch(error=>{if(session===current&&current?.pos===pos)toast(error.name==='NotAllowedError'?'请点一下喇叭播放录音。':'录音无法播放，请检查本地音频文件。');});return;}
 if(!canPlay(text)){toast('这项词汇的真人录音待导入。');return;}
 const line=Object.values(materials).flatMap(m=>m.texts.flatMap(t=>t.lines)).find(x=>x.ja===text);
 const reading=line?.audio||(current?.queue[pos]?.p&&sentence(current.queue[pos].p)===text?current.queue[pos].p.audio:null)||text;
 if(isNative()){speechStarted=spoken=>{if(spoken===reading)heard();};sendNative('speak',{text:reading,rate:slow?.65:Number(state.audioRate)||1});return;}
 const utterance=new SpeechSynthesisUtterance(reading);utterance.lang='ja-JP';
 utterance.voice=window.speechSynthesis.getVoices().find(v=>/^ja(?:-|_)/i.test(v.lang))||null;
 utterance.rate=slow?.65:Number(state.audioRate)||1;utterance.onstart=heard;
 utterance.onerror=e=>{if(!['canceled','interrupted'].includes(e.error)&&session===current&&current?.pos===pos)toast('日语朗读未能播放，请检查系统日语语音或点击喇叭重试。');};
 window.speechSynthesis.speak(utterance);
}
function audioSource(text){const clip=recordingFor(humanClips,text);return clip?`<p class="sub audio-source">真人录音 · ${esc(clip.source)} · ${esc(clip.track)}</p>`:`<p class="sub audio-source">${canReadSentence(text)?'机器朗读 · 日语':'真人录音待导入'}</p>`;}
function labelAudioButtons(){document.querySelectorAll('[data-say]').forEach(b=>{if(!canPlay(b.dataset.say)){b.disabled=true;b.title='真人录音待导入';b.setAttribute('aria-label','真人录音待导入');}});}
function missingAudio(q){return q&&['listen','speak'].includes(q.type)&&!canPlay(sentence(q.p));}
function unavailableAudio(q){return `<h2>真人录音待导入</h2><p class="intro">这道${q.type==='listen'?'听力':'跟读'}题还没有核对过来源的录音。暂时跳过，不计对错，也不增加掌握程度。</p><button class="primary" id="skipMissingAudio">跳过此题，不计入掌握</button>`;}
function render(){
 const labels={today:'混池',home:'课程',kana:'五十音',review:'错题复习',grammar:'语法',settings:'设置'};
 const total=lessons.filter(completed).length;
 $('#app').innerHTML=`<div class="shell"><aside class="sidebar"><div class="brand">新标准日本语</div><nav class="nav" aria-label="主导航">${[['today','review'],['home','book'],['kana','home'],['review','review'],['grammar','grammar'],['settings','settings']].map(([v,i])=>`<button data-nav="${v}" class="${view===v?'active':''}">${icon(i)}${labels[v]}</button>`).join('')}</nav></aside><main class="main"><header class="topbar"><div class="breadcrumb"><span class="mobilebrand">新标准日本语 / </span>${labels[view]}${preview.enabled?' · 试用':''}</div><span class="progresslabel">${view==='today'?`已掌握 ${adaptiveStats(studyPool,state.adaptive.records).mastered} 项`:`已学习 ${total} / 80 课`}</span></header><div id="page">${view==='today'?dailyHome():view==='home'?home():view==='kana'?kana():view==='review'?review():view==='grammar'?grammar():settings()}</div><footer class="footer"><span>个人学习 · 非教材官方产品</span>${preview.enabled?'<span>试用记录单独保存</span>':''}</footer></main></div>`;
 bind();labelAudioButtons();
}
function home(){
 const ls=lessons.filter(l=>l.book===book),next=ls.find(l=>!completed(l));
 const today=Math.floor((state.days[day()]||0)/60);
 return `<div class="heading"><div><h1>课程</h1><p class="sub">按教材顺序学习，也可直接选择课次。</p></div><button class="pill" data-nav="settings">今日 ${today} / ${state.goal} 分钟</button></div><div class="tabs" role="tablist">${books.map((b,i)=>`<button role="tab" aria-selected="${book===i}" data-book="${i}" class="${book===i?'active':''}">${b.name}</button>`).join('')}</div><p class="sub course-note">${ls.some(l=>materials[l.id])?'带“教材已整理”的课程含词汇、课文与语法；其余仍为示例练习。':book<2?'当前为示例练习 · 每课 6 题，尚未导入教材内容':'当前为原创延伸练习 · 尚未导入教材内容'}</p><section class="lessonlist">${ls.map((l,i)=>`${i%4===0?`<div class="unithead"><strong>第 ${Math.floor(i/4)+1} 单元</strong><small>${ls.slice(i,i+4).filter(completed).length} / 4 课已学习</small></div>`:''}<button class="lesson ${l.id===next?.id?'current':''}" data-start="${l.id}"><span class="lessonnum">${String(l.no).padStart(2,'0')}</span><span class="lessontext"><strong ${materials[l.id]?'lang="ja"':''}>${esc(lessonTitle(l))}</strong>${materials[l.id]?'<small class="material-badge">教材已整理</small>':''}<p class="grammar-label">${esc(l.grammar)}</p></span><span class="lessonend">${completed(l)?'已学习':l.id===next?.id?'开始学习':'学习'} ${icon('arrow')}</span></button>`).join('')}</section>`;
}
const kanaRows=[['あいうえお','アイウエオ','a i u e o'],['かきくけこ','カキクケコ','ka ki ku ke ko'],['さしすせそ','サシスセソ','sa shi su se so'],['たちつてと','タチツテト','ta chi tsu te to'],['なにぬねの','ナニヌネノ','na ni nu ne no'],['はひふへほ','ハヒフヘホ','ha hi fu he ho'],['まみむめも','マミムメモ','ma mi mu me mo'],['や ゆ よ','ヤ ユ ヨ','ya - yu - yo'],['らりるれろ','ラリルレロ','ra ri ru re ro'],['わ   を','ワ   ヲ','wa - - - o'],['ん','ン','n']];
function kana(){return `<div class="heading"><div><h1>五十音</h1><p class="sub">先认识平假名，再熟悉片假名。真人发音录音待导入。</p></div></div><div class="card full"><p class="sub" style="margin-bottom:23px">清音入门表 · 大字为平假名，小字为片假名与罗马音。助词 は、へ、を 分别读 wa、e、o。浊音、拗音和长音仍需专项学习。</p><div class="kana">${kanaRows.map(([h,k,r])=>[...h].map((c,i)=>c===' '?'<span></span>':`<button data-say="${c}" lang="ja">${c}<small><span lang="ja">${k[i]}</span> · <span lang="en">${r.split(' ')[i]}</span></small></button>`).join('')).join('')}</div></div>`}
function review(){const count=studyPool.filter(i=>state.adaptive.records[i.key]?.lapses&&state.adaptive.records[i.key].stage===0).length;return `<div class="heading"><div><h1>错题复习</h1><p class="sub">课程练习的错题保存在这里；混池的错项会自动安排再次出现。</p></div></div>${count?`<div class="card full"><p class="intro">混学中有 ${count} 项需要巩固，会按到期时间自动安排。</p><button class="pill" data-nav="today">查看混池</button></div>`:''}${state.mistakes.length?`<div class="card full"><h3>${state.mistakes.length} 道题，值得再想一遍</h3><button class="primary" id="reviewStart">开始错题复习 ${icon('arrow')}</button></div>${state.mistakes.map(m=>{const l=lessons[m.id],q=materialQueue(l,questions(l),materials[l.id],false)[m.index];return `<div class="card full"><h3>${books[l.book].name} · 第 ${l.no} 课　${esc(lessonTitle(l))}</h3><p class="jp" lang="ja">${esc(q?sentence(q.p):l.grammar)}</p><p class="sub">${esc(q?.explanation||l.note)}</p></div>`}).join('')}`:`<div class="card full empty"><h2>暂无错题</h2><p class="sub">答错的题目会保存在这里。</p><button class="primary" style="margin-top:25px" data-nav="home">去学习</button></div>`}`}
function grammar(){return `<div class="heading"><div><h1>语法</h1><p class="sub">中文解释，日语例句。把零散的知识连起来。</p></div></div><input class="search" id="grammarSearch" aria-label="搜索语法" placeholder="搜索句型、主题或中文解释，例如：条件、と思います"><div class="grid" id="grammarGrid" style="margin-top:23px">${grammarCards(lessons)}</div>`}
function grammarCards(ls){return ls.length?ls.map(l=>(materials[l.id]?.grammar||[{title:l.grammar,note:l.note}]).map(g=>`<div class="card grammarcard"><div class="eyebrow">${books[l.book].name} · 第 ${l.no} 课${materials[l.id]?" · 教材笔记":" · 示例"}</div><p class="jp">${esc(g.title)}</p><p>${esc(g.note)}</p>${g.example?`<p class="jp" lang="ja">${esc(g.example)}</p>`:""}<button class="textbtn" data-start="${l.id}">进入本课学习 →</button></div>`).join('')).join(''):'<p class="sub">没有找到对应内容，试试其他关键词。</p>'}
function settings(){return `<h1>设置</h1><div class="card full" style="margin-top:25px"><div class="formrow"><label for="goal">每日学习目标</label><select id="goal">${[10,15,20,30].map(n=>`<option value="${n}" ${state.goal===n?'selected':''}>${n} 分钟 / 天</option>`).join('')}</select></div><div class="formrow"><label for="rate">朗读播放速度</label><select id="rate">${[[.75,'0.75 倍'],[.85,'0.85 倍'],[1,'原速']].map(([n,t])=>`<option value="${n}" ${Number(state.audioRate)===n?'selected':''}>${t}</option>`).join('')}</select></div><p class="intro">已接入 ${Object.keys(humanClips).length} 段有来源的真人录音。</p><p class="sub">优先播放已导入录音；句子缺少录音时使用日语机器朗读。</p><p class="sub"><a href="https://ebook.pep.com.cn/lry/bmxy.html" target="_blank" rel="noreferrer">人教社官方音频资源与使用说明</a></p><p class="sub" style="margin-top:22px">${isNative()?'课程已内置，可离线学习。进度保存在这台 iPad；录音仅用于本次练习，不上传，退出或进入后台时释放。已导入的真人录音随课程内置。':'进度只保存在当前浏览器。录音只在本次练习中回放，不上传。已有录音优先，句子缺少录音时使用系统日语朗读。'}</p><hr style="border:0;border-top:1px solid var(--line);margin:25px 0"><details><summary>课程与内容说明</summary><p class="sub">覆盖初级上下册 48 课、中级上下册 32 课的课程框架。已整理的本地教材课程在列表单独标记，包含词汇、课文、语法与配套练习。其他课次仍只有 2 个原创例句及 6 组示例练习，不是完整教材。初级按课次语法主线，中级按话题配置延伸句型，未逐条核对教材全部语法。示例课程听力 2 题、阅读与组句 3 题、口语 1 题。教材课程的题量见课内说明；口语采用自评，不自动判断发音。句子的机器朗读会明确标注，之后导入录音即自动优先使用录音。</p><p class="sub" style="margin-top:15px">课程结构参考：<a href="https://www.jpedo.com/news/2079.html" target="_blank" rel="noreferrer">新版标日课程目录</a> · <a href="https://www.mitsumura-tosho.co.jp/shoseki/nihongo/s" target="_blank" rel="noreferrer">出版社介绍</a></p></details></div>`}
function bind(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{view=b.dataset.nav;render();window.scrollTo(0,0)});document.querySelectorAll('[data-book]').forEach(b=>b.onclick=()=>{book=Number(b.dataset.book);state.book=book;save();render()});bindStarts();document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));if($('#goal'))$('#goal').onchange=e=>{state.goal=Number(e.target.value);save();toast('学习目标已保存')};if($('#rate'))$('#rate').onchange=e=>{state.audioRate=Number(e.target.value);save();toast('录音播放速度已保存')};if($('#grammarSearch'))$('#grammarSearch').oninput=e=>{const q=e.target.value.toLowerCase();$('#grammarGrid').innerHTML=grammarCards(lessons.filter(l=>`${lessonTitle(l)}${l.grammar}${l.note}${materials[l.id]?.grammar.map(g=>g.title+g.note+g.example).join('')||''}`.toLowerCase().includes(q)));bindStarts()};if($('#reviewStart'))$('#reviewStart').onclick=startReview;if($('#dailyStart'))$('#dailyStart').onclick=startDaily;}
function bindStarts(){document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>start(Number(b.dataset.start)))}
function start(id){session={materialTab:'overview',lesson:lessons[id],queue:materialQueue(lessons[id],questions(lessons[id]),materials[id]),pos:-1,right:0,graded:0,unscored:0,spoken:false,started:Date.now(),seconds:0};showStudy()}
function startReview(){const queue=state.mistakes.map(m=>{const q=materialQueue(lessons[m.id],questions(lessons[m.id]),materials[m.id],false)[m.index];return q?{...q,...m}:null}).filter(Boolean);if(!queue.length){toast('这些错题需要对应的本地教材资料。');return}session={lesson:lessons[queue[0].id],queue,pos:0,right:0,graded:0,unscored:0,review:true,started:Date.now(),seconds:0};prepare();showStudy()}
function prepare(){answerFlow.cancel();session.explanationOpen=false;session.selected=null;session.tokens=[];session.checked=false;session.feedback=null;const q=session.queue[session.pos];session.pool=shuffled(q.p.tokens.map((t,i)=>({t,i})));session.options=q.options?shuffled(q.options):[];session.heard=false;session.recorded=false;session.skipped=false;session.showText=false;if(session.daily){session.learning=false;if(q.fresh&&!session.run.tasks[session.pos].introduced){session.run.tasks[session.pos].introduced=true;state.adaptive.records[q.itemKey]??=introduceItem(Date.now());saveDaily();}const a=session.run.answered;if(a){session.checked=true;session.learning=false;session.feedback=a.feedback;session.selected=a.selected;session.tokens=a.tokens;session.options=a.options;session.showText=a.showText;session.explanationOpen=Boolean(a.explanationOpen);}}}
function cleanup(){stopSpeech();answerFlow.cancel();cancelNative();recordPending=false;clearTimeout(recordTimer);if(recorder&&recorder.state!=='inactive'){recorder.onstop=null;recorder.stop()}stream?.getTracks().forEach(t=>t.stop());stream=null;recorder=null;if(audioURL){URL.revokeObjectURL(audioURL);audioURL=null}humanPlayer.stop()}
function showStudy(){
 let overlay=$('.overlay');
 if(!overlay){overlay=document.createElement('div');overlay.className='overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','日语练习');document.body.append(overlay);$('.shell').inert=true;document.body.style.overflow='hidden';}
 const s=session,q=s.queue[s.pos],l=q?lessons[q.id]:s.lesson;
 overlay.innerHTML=`<div class="study ${q?'quick-study':''}"><div class="studyheader"><button class="close" id="quit" aria-label="退出练习">×</button><div class="progress"><span style="width:${Math.max(0,s.pos)/s.queue.length*100}%"></span></div><small>${s.pos<0?'本课学习':Math.min(s.pos+1,s.queue.length)+' / '+s.queue.length}</small></div>${s.pos<0?`<div class="eyebrow">${books[l.book].name} · 第 ${l.no} 课</div>`:''}${s.pos<0?intro(l):s.pos>=s.queue.length?result():missingAudio(q)?unavailableAudio(q):exercise(q,l)}</div>`;
 $('#quit').onclick=quit;
 if(s.pos<0){$('#begin').onclick=()=>{s.pos=0;prepare();showStudy();$('.overlay').scrollTop=0;};document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));bindMaterial();}
 else if(s.pos>=s.queue.length){$('#finish').onclick=quit;if($('#practiceAgain'))$('#practiceAgain').onclick=()=>{quit();startDaily();};}
 else if(missingAudio(q))$('#skipMissingAudio').onclick=()=>{s.unscored++;advance();};
 else bindExercise(q);
 labelAudioButtons();answerFlow.schedule();autoplayQuestion(s);
}
function intro(l){if(materials[l.id])return materialIntro(l,materials[l.id]);return `<h2>先理解，再练习。</h2><span class="bigjp">${l.grammar}</span><p class="intro">${l.note}</p>${l.pairs.map(p=>`<div class="example"><div><div class="jp" lang="ja">${sentence(p)}</div><p>${p.zh}</p></div><button class="sound" data-say="${esc(sentence(p))}" aria-label="朗读例句">${icon('sound')}</button></div>`).join('')}<div class="checkrow"><span class="muted">2 听力 · 3 阅读与组句 · 1 跟读</span><button class="primary" id="begin">开始练习 ${icon('arrow')}</button></div>`}
function answerFeedback(q){
 const s=session;if(!s.checked)return '';
 const answer=q.type==='build'?sentence(q.p):q.answer;
 const language=q.type==='build'?'ja':q.answerLang||(q.answer===sentence(q.p)?'ja':'zh-CN');
 return `<div class="answer-feedback ${s.feedback.ok?'correct':'incorrect'}" role="status"><div class="answer-verdict">${s.feedback.ok?`${icon('check')} 正确`:'正确答案'}</div>${!s.feedback.ok?`<p class="answer-correction" lang="${language}">${esc(answer)}</p>`:''}${s.explanationOpen?`<p class="answer-explanation">${esc(q.explanation||lessons[q.id].note)}</p>`:''}<div class="answer-actions">${!s.explanationOpen?'<button class="textbtn" id="explainAnswer">查看解答</button>':''}${!s.feedback.ok||s.explanationOpen?`<button class="primary" id="nextAnswer">${s.feedback.ok?'继续':'知道了'} ${icon('arrow')}</button>`:''}</div></div>`;
}
function exercise(q,l){
 const s=session;
 return `<h2 class="question-prompt">${q.type==='read'?'选择意思':q.type==='listen'?'听音，选择意思':q.type==='build'?'组成句子':'听示范，跟读'}</h2>${!hasRecording(sentence(q.p))&&canPlay(sentence(q.p))?'<small class="sub">机器朗读</small>':''}${q.type==='read'?`<div class="bigjp" lang="ja">${esc(sentence(q.p))}</div>`:''}${s.daily&&['read','build'].includes(q.type)&&canPlay(sentence(q.p))?`<button class="sound" id="play" aria-label="重听读音">${icon('sound')}</button>`:''}${q.type==='listen'?`<div class="listenarea"><button class="sound" id="play" aria-label="播放读音">${icon('sound')}</button><button class="textbtn" id="slow">慢速</button></div><button class="textbtn" id="transcript">${s.showText?'原文已显示':'听不清，查看原文'}</button>${s.showText?`<p class="bigjp" lang="ja">${esc(sentence(q.p))}</p>`:''}`:''}${q.options?`<div class="options">${s.options.map((o,i)=>`<button class="option ${s.selected===o?'selected':''}" data-option="${i}" ${s.checked||(q.type==='listen'&&!s.heard&&!s.showText)?'disabled':''}><span lang="${q.answerLang||(q.answer===sentence(q.p)?'ja':'zh-CN')}">${esc(o)}</span></button>`).join('')}</div>`:''}${q.type==='build'?`<p class="intro">${esc(q.p.zh)}</p><div class="answerline">${s.tokens.map(i=>`<button class="token" lang="ja" data-remove="${i}" ${s.checked?'disabled':''}>${esc(q.p.tokens[i])}</button>`).join('')}</div><div class="tokens">${s.pool.map(({t,i})=>`<button class="token" lang="ja" data-token="${i}" ${s.tokens.includes(i)||s.checked?'disabled':''}>${esc(t)}</button>`).join('')}</div>`:''}${q.type==='speak'?`<div class="example"><div><div class="jp" lang="ja">${esc(sentence(q.p))}</div><p>${esc(q.p.zh)}</p></div><button class="sound" id="play" aria-label="示范朗读">${icon('sound')}</button></div><div class="recorder"><button class="primary" id="record">${s.recorded?'重新录音':'开始录音'}</button><div id="recordingArea">${audioURL?`<audio controls src="${audioURL}"></audio>`:''}</div><p id="recordStatus" role="status">${s.recorded?'回听后确认完成。':'录音最长 30 秒。'}</p></div><div class="checkrow"><button class="textbtn" id="skipSpeak">跳过跟读</button><button class="primary" id="check" ${s.recorded?'':'disabled'}>回听完成</button></div>`:''}${answerFeedback(q)}`;
}
function revealAnswer(){
 answerFlow.cancel();session.explanationOpen=true;
 if(session.daily&&session.run.answered){session.run.answered.explanationOpen=true;saveDaily();}
 showStudy();
}
function bindExercise(q){
 const s=session;
 document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{if(s!==session||s.checked)return;s.selected=s.options[Number(b.dataset.option)];submitAnswer(q);});
 document.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{if(s!==session||s.checked||s.tokens.includes(Number(b.dataset.token)))return;s.tokens.push(Number(b.dataset.token));if(s.tokens.length===q.p.tokens.length)submitAnswer(q);else showStudy();});
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{if(s.checked)return;s.tokens=s.tokens.filter(i=>i!==Number(b.dataset.remove));showStudy();});
 if($('#play'))$('#play').onclick=()=>speak(sentence(q.p));
 if($('#slow'))$('#slow').onclick=()=>speak(sentence(q.p),true);
 if($('#transcript'))$('#transcript').onclick=()=>{s.showText=true;showStudy();};
 if($('#record'))$('#record').onclick=record;
 if($('#skipSpeak'))$('#skipSpeak').onclick=()=>{s.skipped=true;advance();};
 if($('#check'))$('#check').onclick=()=>submitAnswer(q);
 if($('#explainAnswer')){const b=$('#explainAnswer');b.onpointerdown=()=>answerFlow.cancel();b.onfocus=()=>answerFlow.cancel();b.onblur=()=>answerFlow.schedule();b.onpointercancel=()=>answerFlow.schedule();b.onclick=revealAnswer;}
 if($('#nextAnswer'))$('#nextAnswer').onclick=()=>{if(session===s)advance();};
}
function submitAnswer(q){
 const s=session;if(!s||s.checked||s.queue[s.pos]!==q)return;
 if(q.type==='listen'&&!s.heard&&!s.showText)return;
 if(q.type==='build'&&s.tokens.length!==q.p.tokens.length)return;
 if(q.options&&s.selected===null)return;
 if(q.type==='speak'&&!s.recorded)return;
 if(s.daily){answerDaily(q);return;}
 if(q.type==='speak'){s.spoken=true;advance();return;}
 const correct=q.type==='build'?s.tokens.map(i=>q.p.tokens[i]).join('')===q.p.tokens.join(''):s.selected===q.answer;
 if(s.showText)s.unscored++;
 if(!s.showText){s.graded++;if(correct)s.right++;const exists=state.mistakes.some(m=>m.id===q.id&&m.index===q.index);if(correct&&s.review)state.mistakes=state.mistakes.filter(m=>!(m.id===q.id&&m.index===q.index));else if(!correct&&!exists)state.mistakes.push({id:q.id,index:q.index});save();}
 s.checked=true;s.feedback={ok:correct};showStudy();
}
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

function advance(){if(session.daily){advanceDaily();return}cleanup();session.pos++;if(session.pos>=session.queue.length){if(!session.saved){if(!session.review)state.done[session.lesson.id]={at:day(),correct:session.right,total:session.graded,speaking:session.spoken,materialVersion:materials[session.lesson.id]?.version};session.saved=true;save()}}else prepare();showStudy();$('.overlay').scrollTop=0;}
function result(){const s=session;if(s.daily)return dailyResult();return `<div class="results"><h2>练习完成</h2><p class="sub">${s.review?'答对的题目已移出错题本。':'学习记录已保存。'}</p><div class="resultstats"><strong>${s.graded?`${s.right} / ${s.graded}`:'—'}</strong><span>${s.graded?'客观题答对':'本次未作答计分题'}</span></div><p class="sub">${s.review?'':s.spoken?'口语：已录音、自评完成':'口语：本次已跳过'}${s.unscored>0?' · 跳过或看过原文的题不计分':''}</p><button class="primary" id="finish">返回课程 ${icon('arrow')}</button></div>`}
function quit(){if(session?.daily&&!session.saved)saveDaily();cleanup();session=null;$('.overlay')?.remove();$('.shell').inert=false;document.body.style.overflow='';render()}
// 仅计入页面可见且正在练习的时间，每秒保存，避免退出或刷新丢失。
setInterval(()=>{if(session&&session.pos<session.queue.length&&!document.hidden){state.days[day()]=(state.days[day()]||0)+1;save()}},1000);
Promise.all([loadLocalMaterials(),loadHumanAudio()]).then(([value,clips])=>{
 materials=value;humanClips=clips;studyPool=learningPool(materials).map(i=>({...i,hasAudio:hasRecording(i.ja)}));
 if(state.adaptive.audioPolicy!=='human-only-v1'){for(const r of Object.values(state.adaptive.records)){if(r.modes)delete r.modes.listen;}state.adaptive.audioPolicy='human-only-v1';save();}
 render();
 if(preview.lesson!==null){start(preview.lesson);if(preview.step!==null){session.pos=preview.step;prepare();showStudy();}}
});

function materialIntro(l,m){
 const tab=session.materialTab||'overview';
 const sections=[['overview','本课'],['vocabulary','词汇'],['texts','课文'],['grammar','语法'],['pages','原书']];
 const counts=session.queue.reduce((out,q)=>(out[q.type]=(out[q.type]||0)+1,out),{});
 const start=`<div class="material-actions"><span class="sub">${counts.listen||0} 听力 · ${(counts.read||0)+(counts.build||0)} 阅读与组句 · ${counts.speak||0} 跟读</span><button class="primary" id="begin">开始 ${session.queue.length} 题练习 ${icon('arrow')}</button></div>`;
 let content='';
 if(tab==='overview')content=`<p class="intro">从词汇和课文开始，理解句型后再做练习。你可以随时切换，不必一次学完。</p><div class="material-overview">${[['vocabulary',m.vocabulary.length+' 个词条','假名、释义与点读'],['texts','基本与应用课文','逐句阅读、查看译文'],['grammar',m.grammar.length+' 组语法与表达','中文讲解与例句'],['pages','原书对照','课文、扩展表与练习页']].map(([key,title,desc])=>`<button data-material="${key}"><strong>${esc(title)}</strong><span>${esc(desc)}</span></button>`).join('')}</div><p class="sub">教材日文依据你提供的扫描本整理；中文课文译文、语法笔记和互动题为配套整理。原书扩展表、书面练习与专栏可在“原书”查看。</p>`;
 if(tab==='vocabulary')content=`<label class="sub" for="vocabSearch">搜索日文、假名或中文</label><input id="vocabSearch" class="search" type="search" placeholder="例如：会社員、かいしゃいん、公司"><p class="sub material-hint">点击词条展开释义；有真人录音时可点读，缺失时按钮暂不可用。共 ${m.vocabulary.length} 项。</p><div id="vocabRows" class="vocab-grid">${vocabRows(m.vocabulary)}</div>`;
 if(tab==='texts')content=m.texts.map(t=>`<section class="text-section"><h3>${esc(t.title)}</h3><p class="sub">书页 ${t.page} · 译文为配套整理</p>${t.context?`<p class="intro">${esc(t.context)}</p>`:''}${t.lines.map(x=>`<div class="text-line"><div>${x.speaker?`<span class="sub">${esc(x.speaker)}</span>`:''}<p class="jp" lang="ja">${esc(x.ja)}</p>${audioSource(x.ja)}<details><summary>查看译文</summary><p>${esc(x.zh)}</p></details></div><button class="sound" data-say="${esc(x.ja)}" aria-label="朗读：${esc(x.ja)}">${icon('sound')}</button></div>`).join('')}</section>`).join('');
 if(tab==='grammar')content=`<p class="sub material-hint">以下为按本课知识点整理的中文笔记。教材原文见“原书”。</p>${m.grammar.map(g=>`<section class="material-grammar"><h3>${esc(g.title)}</h3><p class="intro">${esc(g.note)}</p><p class="jp" lang="ja">${esc(g.example)}</p><p class="sub">对应书页 ${g.page}</p></section>`).join('')}`;
 if(tab==='pages')content=`<p class="sub material-hint">${esc(m.sourcePages)}。可对照原书核查用字、注音和扩展内容。</p>${m.pages.map(p=>`<details class="source-page"><summary>${esc(p.label)}</summary><img src="${esc(p.src)}" alt="${esc(p.label)}教材扫描页" loading="lazy"></details>`).join('')}`;
 return `<h2 lang="ja">${esc(m.title)}</h2><p class="sub">${esc(m.sourcePages)} · 仅使用有来源的真人录音</p><div class="tabs material-tabs" role="tablist" aria-label="本课内容">${sections.map(([key,title])=>`<button role="tab" aria-selected="${tab===key}" class="${tab===key?'active':''}" data-material="${key}">${title}</button>`).join('')}</div>${start}<div class="material-panel">${content}</div>`;
}
function vocabRows(items){return items.length?items.map(v=>`<div class="vocab-row"><details><summary><span lang="ja">${esc(v.ja)}</span><small lang="ja">${esc(v.kana)}</small></summary><p>${esc(v.zh)}</p><span class="sub">${esc(v.kind)}</span>${audioSource(v.ja)}</details><button class="sound" data-say="${esc(v.ja)}" aria-label="朗读单词：${esc(v.ja)}">${icon('sound')}</button></div>`).join(''):'<p class="sub">没有匹配的词条。</p>'}
function bindMaterial(){
 document.querySelectorAll('[data-material]').forEach(b=>b.onclick=()=>{session.materialTab=b.dataset.material;stopSpeech();humanPlayer.stop();showStudy();$('.overlay').scrollTop=0;});
 if($('#vocabSearch'))$('#vocabSearch').oninput=e=>{const query=e.target.value.trim().toLowerCase();$('#vocabRows').innerHTML=vocabRows(materials[session.lesson.id].vocabulary.filter(v=>`${v.ja}${v.kana}${v.zh}`.toLowerCase().includes(query)));$('#vocabRows').querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));labelAudioButtons();};
}

function dailyHome(){
 const stats=adaptiveStats(studyPool,state.adaptive.records),run=state.adaptive.run;
 dailyRefreshKey=adaptiveDay(Date.now())+':'+stats.due;
 const eligible=choosePractice(studyPool,state.adaptive.records);
 return `<div class="heading"><div><h1>混池</h1><p class="sub">词汇和句子混合出现，按你的记忆情况安排下一次。</p></div></div><div class="daily-stats"><div><strong>${stats.due}</strong><span>到期复习</span></div><div><strong>${stats.active}</strong><span>正在学习</span></div><div><strong>${stats.mastered}</strong><span>已掌握</span></div></div><section class="daily-start"><h2>${run?'接着上次继续':eligible.length?'随时学，再来一轮':'暂无学习内容'}</h2><p class="intro">${run?`已完成 ${run.pos+(run.answered?1:0)} / ${run.tasks.length} 题，退出或刷新后也能继续。`:!studyPool.length?'整理好的教材会自动加入学习池。现在可先去课程页浏览示例。':'优先复习到期内容，穿插新词句。不限轮数，想学就继续。'}</p>${run||eligible.length?`<button class="primary" id="dailyStart">${run?'继续这一轮':'开始混学'} ${icon('arrow')}</button>`:'<button class="pill" data-nav="home">浏览课程</button>'}</section><p class="sub daily-source">学习池：${studyPool.length} 项，来自 ${Object.keys(materials).length} 课已整理教材。未整理的课次暂不混入。新内容按教材课次逐步加入。</p><p class="sub audio-source">真人录音覆盖 ${studyPool.filter(i=>i.hasAudio).length} / ${studyPool.length} 项；句子缺少录音时暂用机器朗读。</p>${stats.active||stats.mastered?`<details class="memory-list"><summary>查看各项学习状态</summary>${studyPool.filter(i=>state.adaptive.records[i.key]).map(i=>{const r=state.adaptive.records[i.key];return `<div class="memory-row"><div><span class="jp" lang="ja">${esc(i.ja)}</span><small>${esc(i.zh)}</small></div><span class="sub">${isMastered(r)?'已掌握':r.stage?'巩固中':'学习中'}<br>${new Date(r.due).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})} 复习</span></div>`}).join('')}</details>`:''}`;
}
function startDaily(){
 let run=state.adaptive.run;
 if(run&&!run.tasks.every(t=>studyPool.some(i=>i.key===t.key))){toast('本轮需要的教材资料暂时不可用，请恢复对应本地资料。');return;}
 if(!run){const tasks=choosePractice(studyPool,state.adaptive.records);if(!tasks.length){render();return;}
  run={tasks,pos:0,right:0,graded:0,unscored:0,spoken:false,retried:[],answered:null,started:Date.now(),masteredBefore:adaptiveStats(studyPool,state.adaptive.records).mastered};
  state.adaptive.run=run;save();
 }
 session={daily:true,run,lesson:lessons[studyPool.find(i=>i.key===run.tasks[0].key).lessonId],queue:dailyQueue(run.tasks),pos:run.pos,right:run.right,graded:run.graded,unscored:run.unscored,spoken:run.spoken,started:run.started};
 if(session.pos>=session.queue.length){state.adaptive.run=null;session.saved=true;save();}else prepare();showStudy();
}
function dailyQueue(tasks){return tasks.map(t=>{const item=studyPool.find(i=>i.key===t.key);return {...practiceQuestion(item,t,studyPool),itemKey:t.key,itemKind:item.kind,fresh:t.fresh,retry:t.retry};});}
function saveDaily(){
 const s=session;if(!s?.daily||s.saved)return;
 Object.assign(s.run,{pos:s.pos,right:s.right,graded:s.graded,unscored:s.unscored,spoken:s.spoken});state.adaptive.run=s.run;save();
}
function answerDaily(q){
 const s=session;
 if(q.type==='speak'){s.spoken=true;advanceDaily();return;}
 const correct=q.type==='build'?s.tokens.map(i=>q.p.tokens[i]).join('')===q.p.tokens.join(''):s.selected===q.answer;
 if(s.showText)s.unscored++;else{s.graded++;if(correct)s.right++;}
 // A revealed transcript is learning, not a failed independent recall.
 const r=recordRecall(state.adaptive.records[q.itemKey],{correct:s.showText?true:correct,hinted:s.showText||q.fresh,mode:q.type});
 state.adaptive.records[q.itemKey]=r;
 let retryAdded=false;
 if(!correct&&!s.showText){
  const tasks=appendRetry(s.run.tasks,s.pos,s.run.retried,q.itemKey);
  if(tasks!==s.run.tasks){retryAdded=true;s.run.tasks=tasks;s.run.retried.push(q.itemKey);s.queue=dailyQueue(tasks);}
 }
 const when=new Date(r.due).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});
 s.checked=true;
 s.feedback={ok:correct,title:s.showText?'已看原文，作为学习记录':correct?(q.fresh?'已学过，之后再独立回想':'回想正确'):'这项还需要再练',text:`${correct?'':`正确答案：${esc(q.type==='build'?sentence(q.p):q.answer)}<br>`}${esc(q.explanation)}<br>${isMastered(r)?'已掌握，转入低频复习。':'下次到期：'}${when}${retryAdded?'；本轮还会隔题再练一次。':''}`};
 s.run.answered={feedback:s.feedback,selected:s.selected,tokens:s.tokens,options:s.options,showText:s.showText};saveDaily();showStudy();
}
function advanceDaily(){
 cleanup();session.pos++;session.run.answered=null;
 if(session.pos>=session.queue.length){session.saved=true;state.adaptive.run=null;save();}else{saveDaily();prepare();}
 showStudy();$('.overlay').scrollTop=0;
}
function dailyResult(){
 const s=session,stats=adaptiveStats(studyPool,state.adaptive.records);
 return `<div class="results"><h2>这一轮完成了</h2><p class="sub">学习进度已保存，可以继续下一轮。</p><div class="resultstats"><strong>${s.right} / ${s.graded}</strong><span>客观题答对</span></div><p class="intro">正在学习 ${stats.active} 项 · 已掌握 ${stats.mastered} 项</p><p class="sub">${s.spoken?'跟读已完成':'跟读未完成或已跳过'} · 跟读自评不影响掌握判定${s.unscored?' · 跳过或看过原文的题不计分':''}</p><button class="primary" id="practiceAgain">再来一轮 ${icon('arrow')}</button><button class="textbtn" id="finish">返回混池</button></div>`;
}

setInterval(()=>{if(!session&&view==='today'&&!document.hidden){const key=adaptiveDay(Date.now())+':'+adaptiveStats(studyPool,state.adaptive.records).due;if(key!==dailyRefreshKey)render();}},15000);

document.addEventListener('visibilitychange',()=>{if(document.hidden){answerFlow.cancel();humanPlayer.stop();stopSpeech();}else{answerFlow.schedule();autoplayQuestion(session);}});

})();
