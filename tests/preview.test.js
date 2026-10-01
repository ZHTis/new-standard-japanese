import test from 'node:test';
import assert from 'node:assert/strict';
import {getPreviewConfig} from '../src/preview-config.js';

test('试用进度与正式/原生进度使用不同存储键',()=>{
 assert.equal(getPreviewConfig('?preview=1').storageKey,'hiyori-preview-v1');
 assert.equal(getPreviewConfig('').storageKey,'hiyori-v1');
 assert.equal(getPreviewConfig('?preview=1',true).storageKey,'hiyori-v1');
});
test('直达课程和题型仅在试用模式生效，并拒绝越界参数',()=>{
 assert.equal(getPreviewConfig('?lesson=2&step=3').lesson,null);
 const good=getPreviewConfig('?preview=1&lesson=79&step=5&view=grammar');
 assert.equal(good.lesson,79);assert.equal(good.step,5);assert.equal(good.view,'grammar');
 const invalid=getPreviewConfig('?preview=1&lesson=80&step=6&view=invalid');
 assert.equal(invalid.lesson,null);assert.equal(invalid.step,null);assert.equal(invalid.view,'home');
 assert.equal(getPreviewConfig('?preview=1&lesson=-1').lesson,null);
 assert.equal(getPreviewConfig('?preview=1&lesson=').lesson,null);
});
