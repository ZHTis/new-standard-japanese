import {createAnswerFlow} from './answer-flow.js?v=20261001-fast';
import {loadHumanAudio,recordingFor,createHumanPlayer,createQuestionAutoplay} from './human-audio.js?v=20261001-autoplay';
import {learningPool,adaptiveStats,choosePractice,practiceQuestion,introduceItem,recordRecall,isMastered,appendRetry,adaptiveDay} from './adaptive.js?v=20261001-pool';
import {loadLocalMaterials,materialQueue} from './materials.js';
import {getPreviewConfig} from './preview-config.js?v=20261001-adaptive';
import {isNative,sendNative,cancelNative,startNativeRecording,stopNativeRecording,nativeRecording} from './native.js?v=20261001-sentence';
import {books,lessons,questions,sentence} from './data.js';
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
