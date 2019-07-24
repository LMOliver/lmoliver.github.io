{

const DO_TRANSLATE=true;
const LANG_ZH='zh';
const LANG_EN='en';
let language=LANG_ZH;

const DICT_DATA={
	[LANG_ZH]:{
		name:'中文',
		text:
`
膜拜{Siyuan}
{Siyuan}是我们的红太阳，没有她我们会死！
荒野
曾经，有一个高度发达的文明在这个星球上度过了它最为繁荣的时代。在那时，人们相信{Siyuan}是最强的神，也是这个星球的科技、魔法与信仰三大学科体系高度发展的原因。
然而好景不长，曾被人们认为亘古不变的真理在一次失控的魔法实验之后支离破碎。科技与魔法的支柱轰然倒塌，毁灭席卷了整个星球。
高楼变为废墟，法阵化作黄土，雕像碎成砂砾，但{Siyuan}并未抛弃这个文明——因为信仰仍在。
膜拜
您已膜拜{0}次
膜拜{Siyuan}{0}次
{0}点击/秒
真诚膜拜{0} [{1}次膜拜]
最大
信徒{0} [{1}次膜拜]
教堂{0} [{1}位信徒]
自动购买
信仰
转化信仰 (+{0}信仰)
经书{0} [{1}信仰]
传教{0} [{1}本经书]
探索遗迹 [{0}信仰]
遗迹
已发现{0}个遗迹
过去的事物深埋于地下，而且数量稀少，发掘它们需要坚定的信仰。尽管道路艰辛，但这是前进所必须的代价。文明不进即退，而这残存的文明已经无路可退。
在遗迹中，人们惊喜地发现了向{Siyuan}祈求水晶的途径。拥有了水晶，两扇大门便随着遗迹的探索徐徐开启……
遗迹大门
水晶
祈求恩赐
次膜拜
智慧
奥秘
本质
朝圣地
宝石
雕琢
神学
神坛
巨石
炼金区
魔法石
赋能
魔力
魔法师
法阵
实验室
透镜
打磨
研究
科学家
知识之书*{0} [{1}座法阵]
城镇
在遗迹中的发现与收获振奋了信徒们。愚昧逐渐远离，新的知识填充了信徒们的内心。
但新的挑战也已来临：天灾人祸随时可能发生，只有居安思危，稳妥前行，才能防止在灾难发生时遭到重创。
真理之路
你已探索到真理{0}
正在追寻<strong>真理{0}</strong>
阶段
已进行
次尝试
重置
材料
数量
本次消耗
追寻真理
感应
虔诚
强度
战意
战争等级
真理
展开
外域
随着文明的重新建立，人们意识到这个星球上遗留的文明不止一个。“比平凡与愚昧更可怕的是失去光明。”他们是否仍膜拜着{Siyuan}呢？
不管如何，人们已经不甘于平凡的生活了。当得知关于敌人的消息后，他们反而热血沸腾，渴望通过战斗来获得全新的资源。
元素
光明
元素塔
块巨石
座法阵
枚透镜
拥有量
入侵
敌方种群大小
基因继承器大小
展开基因继承器
建设
防御
阵地
排序
建筑
优先攻击
状态
等待中
未处于冷却状态
拆除
文档
在探索荒野的时候，人们发现了一些来自失落文明的文档。它们现在看起来奥妙重重，难以读懂，但也许对将来文明的重建有巨大的帮助。
以这个文明的现有技术水平还不能解读这篇<a href="./documentA.pdf">“天书”</a>中的东西，但{Siyuan}一定可以。
因文档过大(约11.2MB)，请点击链接访问。
似乎是一张<a href="./documentB.html">实验数据表</a>，记载了过去文明探索真理的过程。可惜，真理已有改变，不能直接套用其中的实验数据。
一份发言记录(有删减)与一张截图，表现了两位高手在膜拜{Siyuan}后取得了丰硕战果时的<a href="https://majsoul.union-game.com/0/">快乐</a>。
注意 Stepsys 的昵称
一些php和md文件，似乎是一个<a href="https://orzsiyuan.com/archives/Algorithm/Simulate-Anneal">个人博客</a>。从博客名(orzsiyuan.com)可以看出即使对于个人，膜拜{Siyuan}也十分重要。
因博客作者太强，大幅影响加载速度，请点击链接访问。
只有大家的领导者才能解读<a href="./documentE.html">这篇文档</a>。
咕
咕咕咕……
我千辛万苦点了
次你就给我看这个
杂项

当前版本: {0}
存档
导出时请用<strong><code>Ctrl + A</code></strong>选中，切勿双击选中！
导入
导出
语言
多语言支持目前尚十分简陋。对于没有翻译的文本感到抱歉。`,
	},
	[LANG_EN]:{
		name:'English',
		text:
`
Worship {Siyuan}
{Siyuan} is our red sun, we will die without her!
wilderness
Once upon a time, a highly developed civilization spent its most prosperous era on the planet. At that time, people believed that {Siyuan} was the strongest god and the reason why the science, magic and belief of the planet were highly developed.
However, the good times are not long. The truth that was once believed to be unchanging is broken after a runaway magic experiment. The pillars of technology and magic collapsed and the destruction swept the entire planet.
The high-rise became a ruin, the squad turned into loess, and the statue shattered into gravel, but {Siyuan} did not abandon this civilization—because the faith is still there.
Worship
You have worshipped {0} times
Worship {Siyuan}{0} times
{0}clicks/sec
Sincere worship{0} [{1} times worship]
maximum
Believers {0} [{1} times worship]
Church {0} [{1} believers]
Automatic purchase
faith
Transforming faith (+{0}belief)
Scripture {0} [{1}Faith]
Mission {0} [{1} Scripture]
Explore the ruins [{0}faith]
remains
{0} ruins have been discovered
The things of the past are buried deep underground, and the number is scarce. Exploring them requires a firm belief. Despite the hard road, this is the price that must be advanced. Civilization does not advance and retreat, and this remaining civilization has no way to retreat.
In the ruins, people were pleasantly surprised to find a way to pray for crystals to {Siyuan}. With crystal, the two doors will open with the exploration of the remains...
Relics gate
crystal
Pray for gifts
Sub-week
wisdom
Mystery
Nature
Pilgrimage site
gem
Carving
theology
Altar
Boulder
Alchemy District
Magic stone
Empowerment
magic
Magician
Array
laboratory
lens
Polishing
the study
the scientist
Book of Knowledge*{0} [{1} Block]
town
The discovery and harvest in the ruins inspired the believers. Ignorance is gradually moving away, and new knowledge fills the hearts of believers.
But new challenges have also come: natural disasters and man-made disasters can happen at any time. Only when they are prepared for danger and safely can they be prevented from being hit hard in the event of a disaster.
The road to truth
You have explored the truth {0}
Searching for <strong>truth{0}</strong>
stage
Has been carried out
Trial
Reset
material
Quantity
This consumption
Pursuing the truth
induction
Devotion
strength
War
War rating
truth
Expand
Outland
With the re-establishment of civilization, people realized that there is more than one civilization left on this planet. "What is more terrible than ordinary and ignorant is the loss of light." Are they still worshipping {Siyuan}?
No matter what, people are not willing to live an ordinary life. When they learned about the enemy, they were excited and eager to get new resources through battle.
element
bright
Element tower
Block boulder
Seat array
Lens
Ownership
Intrusion
Enemy population size
Gene inheritor size
Expand Gene Successor
Construction
defense
position
Sort
building
Priority attack
status
Waiting
Not in cooling
tear down
Document
When exploring the wilderness, people discovered some documents from lost civilizations. They now seem subtle and difficult to read, but they may be of great help to the reconstruction of civilization in the future.
It is impossible to interpret the contents of this <a href="./documentA.pdf">"the book"</a> with the current state of the art, but {Siyuan} must be.
Due to the size of the document (about 11.2MB), please click on the link to visit.
It seems to be a <a href="./documentB.html">experimental data sheet</a> that documents the process by which civilizations explored truth in the past. Unfortunately, the truth has changed and the experimental data cannot be applied directly.
A record of the speech (with a deletion) and a screenshot showing the two masters' <a href="https://majsoul.union-game.com/0/"> when they achieved great results after worshipping {Siyuan} Happy</a>.
Note the nickname of Stepsys
Some php and md files seem to be a <a href="https://orzsiyuan.com/archives/Algorithm/Simulate-Anneal">personal blog</a>. From the blog name (orzsiyuan.com), it can be seen that even for individuals, worshipping {Siyuan} is very important.
Because the blogger is too strong and greatly affects the loading speed, please click on the link to access.
Only the leader of yours can interpret <a href="./documentE.html">this document</a>.
咕
Oh...
I have worked hard for a bit.
You will show me this time.
Miscellaneous

Current version: {0}
Archive
Please use <strong><code>Ctrl + A</code></strong> when exporting, don't double click to select!
Import
Export
Language
Multilingual support is still very rudimentary. Sorry for the text without translation.`,
	},
};

let dictTable={};
for(let lang in DICT_DATA){
	let dict=DICT_DATA[lang].text;
	dictTable[lang]=dict.split('\n').filter(x=>x.trim());
}

let translateTable={};
const DICT_ZH=dictTable[LANG_ZH];
for(let lang in DICT_DATA){
	const DICT_LANG=dictTable[lang];
	if(DICT_LANG.length!==DICT_ZH.length){
		console.warn(`DICT[${DICT_DATA[lang].name}] is invaild.`);
		continue;
	}
	translateTable[lang]={};
	for(let i=0;i<DICT_LANG.length;i++){
		translateTable[lang][DICT_ZH[i]]=DICT_LANG[i];
	}
}

let t=new Set();
function translate(text,...args) {
	t.add(text);
	if(DO_TRANSLATE){
		if(!(text in translateTable[language])){
		}
		else{
			text=translateTable[language][text];
		}
	}
	for(let i in args){
		text=text.replace(new RegExp('\\{'+i+'\\}','g'),args[i]);
	}
	text=text.replace(/\{Siyuan\}/g,'<span class="siyuan"></span>');
	return text;
}

function dict(){
	return [...t].join('\n');
}

window.translate=translate;
window.dict=dict;
window.setLanguage=(newLang)=>{language=newLang;};
window.getLangName=(lang)=>DICT_DATA[lang].name;
window.languages=[
	LANG_ZH,
	LANG_EN,
];

}