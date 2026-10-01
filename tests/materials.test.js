import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
import {validMaterials,materialQueue} from '../src/materials.js';
import {lessons,questions,sentence} from '../src/data.js';
const sample={version:1,title:'Sample',vocabulary:[],texts:[],grammar:[],pages:[],questions:[{type:'read',p:{text:'テスト',tokens:['テスト']},answer:'Test',options:['Test','Other']}]};
test('本地材料保留原有错题索引；未加载资料仍能使用原创练习',()=>{
 const lesson=lessons[0],base=questions(lesson);
 assert.deepEqual(materialQueue(lesson,base,null).map(q=>q.index),[0,1,2,3,4,5]);
 assert.equal(materialQueue(lesson,base,sample)[0].index,6);
 assert.equal(materialQueue(lesson,base,sample,false)[6].answer,'Test');
 assert.equal(sentence(sample.questions[0].p),'テスト');
 assert.deepEqual(validMaterials(null),{});
 assert.deepEqual(validMaterials({'0':{...sample,questions:[{type:'read'}]}}),{});
});
const catalogURL=new URL('../private-materials/catalog.js',import.meta.url);
test('本地教材题库、原书图片和 iPad 副本有效，公开资源不包含私有课文',{skip:!existsSync(catalogURL)},()=>{
 const context={window:{}};vm.runInNewContext(readFileSync(catalogURL,'utf8'),context);
 const imported=JSON.parse(JSON.stringify(context.window.hiyoriLocalMaterials));
 const materials=validMaterials(imported);
 assert.equal(Object.keys(materials).length,Object.keys(imported).length);
 for(const m of Object.values(materials)){
  assert.ok(m.vocabulary.length>0&&m.texts.length>0);
  for(const q of m.questions){
   assert.ok(q.p.zh&&q.p.text);
   if(q.type==='build')assert.equal(q.p.tokens.join('')+'。',q.p.text);
  }
  for(const p of m.pages){
   assert.match(p.src,/^private-materials\//);
   assert.ok(existsSync(new URL('../'+p.src,import.meta.url)));
   assert.ok(existsSync(new URL('../ipad/Hiyori/Resources/'+p.src,import.meta.url)));
  }
  const privateLine=m.texts.flatMap(t=>t.lines).find(l=>l.ja.length>25)?.ja;
  assert.ok(privateLine);
  for(const file of ['app.js','curriculum.json'])assert.ok(!readFileSync(new URL('../ipad/Hiyori/Resources/'+file,import.meta.url),'utf8').includes(privateLine));
 }
 assert.equal(readFileSync(catalogURL,'utf8'),readFileSync(new URL('../ipad/Hiyori/Resources/private-materials/catalog.js',import.meta.url),'utf8'));
});
