// Only explicitly verified local recordings. Never substitute speech synthesis.
export const audioKey=text=>String(text).normalize('NFKC').replace(/\s/g,'');
export function verifiedClips(entries=[]){
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
export function loadHumanAudio(){return new Promise(resolve=>{
 const script=document.createElement('script');script.src='private-materials/audio-manifest.js';
 script.onload=()=>resolve(verifiedClips(window.hiyoriHumanAudio));script.onerror=()=>resolve({});document.head.append(script);
});}
export function recordingFor(clips,text){return clips[audioKey(text)]||null;}
export function createHumanPlayer(makeAudio=src=>new Audio(src)){
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
export function createQuestionAutoplay({play,available,visible=()=>true}){
 const attempted=new WeakMap();
 return function autoplay(session){
  const q=session?.queue[session.pos];
  if(!session?.daily||!q||session.checked||!visible()||!available(q))return;
  if(attempted.get(session)===session.pos)return;
  attempted.set(session,session.pos);
  play(q);
 };
}
