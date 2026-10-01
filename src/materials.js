// Personal content is loaded separately so it never enters the public bundle.
export function validMaterials(value) {
 if(!value||typeof value!=='object')return {};
 return Object.fromEntries(Object.entries(value).filter(([id,m])=>
  /^\d+$/.test(id)&&Number(id)<80&&m&&typeof m.title==='string'&&
  ['vocabulary','texts','grammar','questions','pages'].every(k=>Array.isArray(m[k]))&&
  m.questions.every(q=>['read','listen','build','speak'].includes(q.type)&&q.p&&
   typeof q.p.text==='string'&&Array.isArray(q.p.tokens)&&q.p.tokens.length&&q.p.tokens.every(t=>typeof t==='string'&&t)&&
   (!['read','listen'].includes(q.type)||(Array.isArray(q.options)&&q.options.includes(q.answer)&&new Set(q.options).size===q.options.length)))
 ));
}
export function loadLocalMaterials() {
 return new Promise(resolve=>{
  const script=document.createElement('script');
  script.src='private-materials/catalog.js';
  script.onload=()=>resolve(validMaterials(window.hiyoriLocalMaterials));
  script.onerror=()=>resolve({});
  document.head.append(script);
 });
}
export function materialQueue(lesson,base,material,practiceOnly=true){
 // Existing mistake records keep their original 0–5 indexes.
 const all=[...base,...(material?.questions||[])].map((q,index)=>({...q,id:lesson.id,index}));
 return practiceOnly&&material?.questions.length?all.slice(base.length):all;
}
