import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {lessons} from '../src/data.js';

test('iPad 内置课程和网页课程一致，所有启动资源都来自本地',()=>{
 const data=JSON.parse(readFileSync(new URL('../ipad/Hiyori/Resources/curriculum.json',import.meta.url),'utf8'));
 assert.deepEqual(data.lessons,lessons);
 const read=file=>readFileSync(new URL('../ipad/Hiyori/Resources/'+file,import.meta.url),'utf8');
 assert.doesNotMatch(read('style.css'),/@import|url\(\s*['"]?https?:/);
 assert.doesNotMatch(read('index.html'),/(src|href)="https?:|type="module"/);
 assert.doesNotMatch(read('app.js'),/^import\s|^export\s/m);
 new vm.Script(read('app.js'));
});

test('原生录音桥接正确处理完成、取消和迟到回调',()=>{
 const sent=[],events=[];
 const window={webkit:{messageHandlers:{hiyori:{postMessage:m=>sent.push(m)}}},dispatchEvent:e=>events.push(e)};
 const context=vm.createContext({window,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail}}});
 const source=readFileSync(new URL('../src/native.js',import.meta.url),'utf8').replace(/\bexport /g,'');
 vm.runInContext(source+'\nthis.bridge={startNativeRecording,stopNativeRecording,cancelNative};',context);
 const calls=[];
 const handlers={onStart:()=>calls.push('start'),onStop:a=>calls.push(a),onError:m=>calls.push(m)};
 context.bridge.startNativeRecording(handlers);
 const first=sent.at(-1).ticket;
 window.hiyoriNativeEvent({type:'recording',ticket:first});
 context.bridge.stopNativeRecording();
 assert.equal(sent.at(-1).action,'stopRecording');
 window.hiyoriNativeEvent({type:'recorded',ticket:first,audio:'data:audio/mp4;base64,test'});
 assert.deepEqual(calls,['start','data:audio/mp4;base64,test']);
 context.bridge.startNativeRecording(handlers);
 const stale=sent.at(-1).ticket;
 context.bridge.cancelNative();
 window.hiyoriNativeEvent({type:'recorded',ticket:stale,audio:'late'});
 assert.equal(calls.length,2);
 context.bridge.startNativeRecording(handlers);
 window.hiyoriNativeEvent({type:'error',ticket:sent.at(-1).ticket,message:'denied'});
 assert.equal(calls.at(-1),'denied');
});
