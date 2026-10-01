import test from 'node:test';
import assert from 'node:assert/strict';
import {learningPool,choosePractice,recordRecall,introduceItem,isMastered,adaptiveStats,practiceQuestion,appendRetry,adaptiveDay} from '../src/adaptive.js';
const dayMs=86400000;
const now=new Date(2026,9,1,10).getTime();
const fixture={0:{vocabulary:Array.from({length:30},(_,i)=>({ja:`単語${i}`,kana:`たんご${i}`,zh:`词义${i}`})),texts:[{lines:Array.from({length:24},(_,i)=>({ja:`例文${i}です。`,zh:`句意${i}`}))}],questions:[{type:'build',p:{text:'例文0です。',tokens:['例文0','です']},explanation:'Example'}]}};
const pool=learningPool(fixture);
const rng=()=>.37;
test('学习池按内容稳定标识、合并重复句子，并使用经过整理的组句词块',()=>{
 const duplicate=structuredClone(fixture);duplicate[0].texts.push({lines:[{ja:'例文0です。',zh:'句意0'}]});
 assert.equal(learningPool(duplicate).length,pool.length);
 duplicate[0].vocabulary.reverse();
 assert.deepEqual(new Set(learningPool(duplicate).map(i=>i.key)),new Set(pool.map(i=>i.key)));
 assert.equal(pool.find(i=>i.ja==='例文0です。').tokens.length,2);
});
test('首轮混合词和句，同日可持续加入新项目，超过二十项仍可继续',()=>{
 const tasks=choosePractice(pool,{},now,rng),fresh=tasks.filter(t=>t.fresh);
 assert.equal(fresh.length,6);assert.equal(fresh.filter(t=>t.type==='listen').length,2);
 assert.deepEqual(new Set(fresh.map(t=>pool.find(i=>i.key===t.key).kind)),new Set(['word','sentence']));
 const records=Object.fromEntries(fresh.map(t=>[t.key,{...introduceItem(now),due:now+dayMs}]));
 for(let round=0;round<5;round++){
  const next=choosePractice(pool,records,now,rng);
  assert.equal(next.filter(t=>t.fresh).length,6);
  for(const t of next.filter(t=>t.fresh))records[t.key]={...introduceItem(now),due:now+dayMs};
 }
 assert.equal(adaptiveStats(pool,records,now).active,36);
 assert.equal(adaptiveStats(pool,records,now).introducedToday,36);
 assert.equal(choosePractice(pool,records,now+dayMs,rng).filter(t=>t.fresh).length,0);
});
test('到期积压优先；有新内容时不补入未到期的已掌握项',()=>{
 const backlog=Object.fromEntries(pool.slice(0,25).map(i=>[i.key,{...introduceItem(now-dayMs),due:now-1}]));
 const tasks=choosePractice(pool,backlog,now,rng);
 assert.equal(tasks.filter(t=>t.type!=='speak').length,12);assert.ok(tasks.every(t=>!t.fresh));
 const mastered={...introduceItem(now-dayMs),stage:4,modes:{read:true,listen:true},due:now+14*dayMs};
 assert.ok(!choosePractice(pool,{[pool[0].key]:mastered},now,rng).some(t=>t.key===pool[0].key));
 assert.ok(choosePractice(pool,{[pool[0].key]:{...mastered,due:now-1}},now,rng).some(t=>t.key===pool[0].key));
});
test('按课次加入新内容，不抽取尚未轮到的课次',()=>{
 const material=structuredClone(fixture);material[4]={vocabulary:[{ja:'後の言葉',kana:'あとのことば',zh:'后面的词'}],texts:[],questions:[]};
 const all=learningPool(material),tasks=choosePractice(all,{},now,rng);
 assert.ok(tasks.every(t=>all.find(i=>i.key===t.key).lessonId===0));
});
test('看答案与同日重复不升级；四次跨日到期答对且经过听辨后才能掌握',()=>{
 let r=recordRecall(introduceItem(now),{correct:true,hinted:true,mode:'read'},now);
 assert.equal(r.stage,0);assert.equal(r.due,now+dayMs);
 r=recordRecall(r,{correct:true,mode:'read'},r.due);
 assert.equal(r.stage,1);assert.ok(!isMastered(r));
 const at=r.lastAnswered;
 r=recordRecall(r,{correct:true,mode:'listen'},at+1000);
 assert.equal(r.stage,1);
 for(const mode of ['listen','build','read'])r=recordRecall(r,{correct:true,mode},r.due);
 assert.equal(r.stage,4);assert.ok(isMastered(r));assert.equal(r.due-r.lastAnswered,14*dayMs);
 const noListening={...r,modes:{read:true,build:true}};assert.ok(!isMastered(noListening));
});
test('答错撤销掌握、安排十分钟后复习；录音自评不提升记忆等级',()=>{
 let r={...introduceItem(now-dayMs),stage:5,modes:{read:true,listen:true},due:now};
 r=recordRecall(r,{correct:false,mode:'listen'},now);assert.equal(r.stage,0);assert.equal(r.lapses,1);assert.equal(r.due,now+600000);assert.ok(!isMastered(r));
 const speech=recordRecall(r,{correct:true,mode:'speak'},now+1000);assert.deepEqual(speech,r);
 const retry=recordRecall(r,{correct:true,mode:'listen'},now+3000);assert.equal(retry.stage,0);
});
test('错题本轮最多加练一次，至少间隔另外两个项目',()=>{
 const tasks=pool.slice(0,5).map(i=>({key:i.key,type:'read',fresh:true}));
 const retried=appendRetry(tasks,0,[],tasks[0].key);
 assert.equal(retried.length,6);assert.equal(retried[3].key,tasks[0].key);assert.equal(retried[3].fresh,false);
 assert.equal(appendRetry(retried,3,[tasks[0].key],tasks[0].key),retried);
 assert.equal(appendRetry(tasks,3,[],tasks[3].key),tasks);
});
test('生成的阅读与听力有唯一答案和真实干扰项，不因日期改变而丢失项目',()=>{
 for(const item of pool)for(const type of ['read','listen']){
  const q=practiceQuestion(item,{type},pool,rng);
  assert.equal(q.answer,item.zh);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options.includes(q.answer));
 }
 assert.equal(adaptiveDay(now),'2026-10-01');
});

test('全部已学且未到期也能连续开新轮，不重复抽同一项目、不提前升级',()=>{
 for(const stage of [1,4]){
  const records=Object.fromEntries(pool.map(i=>[i.key,{...introduceItem(now-dayMs),stage,modes:{read:true,listen:true},due:now+14*dayMs}]));
  const seen=new Set();
  for(let round=0;round<10;round++){
   const tasks=choosePractice(pool,records,now+round*1000,rng).filter(t=>t.type!=='speak');
   assert.equal(tasks.length,12);assert.equal(new Set(tasks.map(t=>t.key)).size,12);
   for(const t of tasks){
    assert.equal(t.fresh,false);seen.add(t.key);
    records[t.key]=recordRecall(records[t.key],{correct:true,mode:t.type},now+round*1000);
    assert.equal(records[t.key].stage,stage);assert.equal(records[t.key].due,now+14*dayMs);
   }
  }
  assert.equal(seen.size,pool.length);
 }
});
