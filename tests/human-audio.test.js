import test from 'node:test';
import assert from 'node:assert/strict';
import {verifiedClips,recordingFor,createHumanPlayer,createQuestionAutoplay} from '../src/human-audio.js';
import {choosePractice,introduceItem,isMastered,recordRecall} from '../src/adaptive.js';
const entry={text:'Ａ さん',src:'private-materials/audio/example.mp3',kind:'human',verified:true,source:'Test source',track:'Track 1',start:1,end:2};
test('只接受有来源曲目、人工核对标记和合法本地路径的真人片段',()=>{
 const clips=verifiedClips([entry]);assert.equal(recordingFor(clips,'Aさん').track,'Track 1');
 for(const change of [{source:''},{track:''},{verified:false},{kind:'tts'},{src:'https://example.com/audio.mp3'},{src:'private-materials/audio/../secret.mp3'},{start:3},{end:-1}])assert.deepEqual(verifiedClips([{...entry,...change}]),{});
 assert.equal(recordingFor(clips,'other'),null);
});
test('真人播放器只播放指定片段，停止会释放待加载操作，不会调用语音合成',async()=>{
 let last;
 const player=createHumanPlayer(src=>(last={src,readyState:1,duration:3,currentTime:0,played:false,paused:false,async play(){this.played=true;},pause(){this.paused=true;}}));
 await player.play(entry,.75);assert.equal(last.currentTime,1);assert.equal(last.playbackRate,.75);assert.equal(last.preservesPitch,true);assert.ok(last.played);player.stop();assert.ok(last.paused);
 await assert.rejects(()=>player.play(null),/missing/);
 await assert.rejects(()=>player.play({...entry,start:5,end:6}),/segment/);
 let pending;
 const waiting=createHumanPlayer(()=>pending={readyState:0,pause(){}});
 const work=waiting.play(entry);waiting.stop();await work;assert.equal(pending.onloadedmetadata,null);
});
test('没有真人录音只出文字题，文字练习不能单独判定掌握',()=>{
 const pool=Array.from({length:8},(_,i)=>({key:String(i),lessonId:0,kind:i%2?'sentence':'word',ja:'test'+i,zh:'meaning'+i,tokens:['test',String(i)],hasAudio:false}));
 const tasks=choosePractice(pool,{},Date.now(),()=>.4);assert.ok(tasks.length);assert.ok(tasks.every(t=>!['listen','speak'].includes(t.type)));
 let r=introduceItem(0);for(let i=0;i<8;i++)r=recordRecall(r,{correct:true,mode:'read'},r.due);assert.ok(!isMastered(r));
});

test('混池每题仅自动播放一次，重绘和恢复已作答题不重播',()=>{
 const played=[];let visible=true;
 const run=createQuestionAutoplay({play:q=>played.push(q),available:q=>q.audio,visible:()=>visible});
 const s={daily:true,pos:0,queue:[{audio:true},{audio:true},{audio:false}]};
 run(s);run(s);assert.equal(played.length,1);
 s.checked=true;run(s);assert.equal(played.length,1);
 s.checked=false;s.pos=1;visible=false;run(s);assert.equal(played.length,1);
 visible=true;run(s);assert.equal(played.length,2);
 s.pos=2;run(s);assert.equal(played.length,2);
 run({...s,pos:0,daily:false});run({...s,pos:0,checked:true});run(null);
 assert.equal(played.length,2);
 run({...s,pos:0});assert.equal(played.length,3);
});
