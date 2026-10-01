import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,questions,sentence,books} from '../src/data.js';
test('四册课次连续且所有题目答案有效',()=>{
 assert.equal(lessons.length,80);
 books.forEach((book,b)=>assert.equal(lessons.filter(l=>l.book===b).length,book.count));
 for(const l of lessons){
  assert.ok(l.note&&l.title&&l.grammar);
  assert.equal(l.no,l.id<48?l.id+1:l.id-47);
  assert.equal(l.pairs.length,2);
  assert.notEqual(sentence(l.pairs[0]),sentence(l.pairs[1]));
  const qs=questions(l);assert.equal(qs.length,6);
  assert.equal(qs.filter(q=>q.type==='listen').length,2);
  for(const q of qs){assert.ok(q.p.tokens.every(Boolean));if(q.options){assert.ok(q.options.includes(q.answer));assert.equal(new Set(q.options).size,q.options.length)}}
 }
});
