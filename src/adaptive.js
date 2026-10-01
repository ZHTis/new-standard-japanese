// A transparent spaced-review scheduler. No network, model, or calendar simulation.
const DAY_MS=86400000;
const REVIEW_DAYS=[1,3,7,14,30,60];
export const adaptiveDay=time=>{const d=new Date(time);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const normalized=text=>String(text).normalize('NFKC').replace(/\s/g,'');
const mix=(items,random)=>{const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
export function learningPool(materials){
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
export function isMastered(record){return Boolean(record&&record.stage>=4&&record.modes?.listen&&(record.modes?.read||record.modes?.build));}
export function adaptiveStats(pool,records={},now=Date.now()){
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
export function choosePractice(pool,records={},now=Date.now(),random=Math.random){
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
export function introduceItem(now){return {stage:0,due:now,introducedAt:now,introducedDay:adaptiveDay(now),attempts:0,lapses:0,modes:{},lastPromotionDay:null};}
export function recordRecall(previous,{correct,hinted=false,mode},now=Date.now()){
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
export function practiceQuestion(item,task,pool,random=Math.random){
 const p={text:item.ja,zh:item.zh,audio:item.audio,tokens:item.tokens};
 if(task.type==='speak')return {id:item.lessonId,type:'speak',p,prompt:'听示范，再录音跟读',explanation:item.note};
 if(task.type==='build')return {id:item.lessonId,type:'build',p,prompt:'点击词块，回想这句话',explanation:item.note};
 // Avoid close formulaic synonyms becoming competing correct choices.
 const similar=[['はい','そうです'],['すみません','どうもすみません'],['よろしくお願いします','こちらこそ']];
 const excluded=new Set(similar.find(g=>g.includes(item.ja))||[]);
 const distractors=[...new Set(mix(pool.filter(i=>i.kind===item.kind&&i.key!==item.key&&!excluded.has(i.ja)),random).map(i=>i.zh))].filter(zh=>normalized(zh)!==normalized(item.zh)).slice(0,3);
 return {id:item.lessonId,type:task.type,p,answerLang:'zh-CN',prompt:task.type==='listen'?'听一听，选出正确的意思':'读一读，选出正确的意思',answer:item.zh,options:[item.zh,...distractors],explanation:item.note};
}
export function appendRetry(tasks,pos,retried,key){
 if(retried.includes(key))return tasks;
 // At least two other recall cards before a second attempt; otherwise wait 10 min.
 const rest=tasks.slice(pos+1).filter(t=>t.key!==key&&t.type!=='speak');
 if(rest.length<2)return tasks;
 const third=rest[1],index=tasks.indexOf(third)+1;
 const out=[...tasks];out.splice(index,0,{...tasks[pos],fresh:false,retry:true});return out;
}
