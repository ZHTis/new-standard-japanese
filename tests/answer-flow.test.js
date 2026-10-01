import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnswerFlow} from '../src/answer-flow.js';
function fixture(){let s={pos:0,checked:true,feedback:{ok:true},explanationOpen:false},shown=true,callback=null,calls=0;const flow=createAnswerFlow({current:()=>s,advance:()=>calls++,visible:()=>shown,setTimer:fn=>(callback=fn,1),clearTimer:()=>callback=null});return {flow,get calls(){return calls},get state(){return s},tick(){const fn=callback;callback=null;fn?.();},replace(){s={...s};},hide(){shown=false;}};}
test('答对自动进入下一题；答错必须等待确认',()=>{const f=fixture();f.flow.schedule();f.tick();assert.equal(f.calls,1);f.state.feedback.ok=false;f.flow.schedule();f.tick();assert.equal(f.calls,1);});
test('打开解释、退出或切换题目后，旧计时器不能自动跳题',()=>{const f=fixture();f.flow.schedule();f.state.explanationOpen=true;f.tick();assert.equal(f.calls,0);f.state.explanationOpen=false;f.flow.schedule();f.replace();f.tick();assert.equal(f.calls,0);f.flow.schedule();f.state.pos++;f.tick();assert.equal(f.calls,0);f.flow.schedule();f.flow.cancel();f.tick();assert.equal(f.calls,0);});
test('后台页面不自动跳题，重复安排只留下一个有效计时器',()=>{const f=fixture();f.flow.schedule();f.flow.schedule();f.tick();assert.equal(f.calls,1);f.flow.schedule();f.hide();f.tick();assert.equal(f.calls,1);});
