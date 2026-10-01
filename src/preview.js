import {books,lessons} from './data.js';
const $=s=>document.querySelector(s);
const frame=$('#appFrame');
let size='desktop';
function load(params){
 const url=new URL('index.html',location.href);
 url.search=new URLSearchParams({preview:'1',...params}).toString();
 frame.src=url.href;$('#standalone').href=url.href;
}
$('#book').innerHTML=books.map((b,i)=>`<option value="${i}">${b.name}</option>`).join('');
function fillLessons(){const book=Number($('#book').value);$('#lesson').innerHTML=lessons.filter(l=>l.book===book).map(l=>`<option value="${l.id}">第 ${l.no} 课 · ${l.title}</option>`).join('')}
fillLessons();$('#book').onchange=fillLessons;
document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b===button));load({view:button.dataset.view});
});
$('#launch').onclick=()=>{document.querySelectorAll('[data-view]').forEach(b=>b.classList.remove('active'));const params={lesson:$('#lesson').value};if($('#step').value!=='')params.step=$('#step').value;load(params)};
function resize(){
 const available=Math.max(250,$('#stage').clientWidth-(innerWidth<=540?16:40));
 const [w,h]=size==='portrait'?[768,1024]:size==='landscape'?[1024,768]:[1280,800];
 const scale=Math.min(1,available/w);
 frame.style.width=w+'px';frame.style.height=h+'px';frame.style.transform=`scale(${scale})`;
 $('#frameSpace').style.width=w*scale+'px';$('#frameSpace').style.height=h*scale+'px';
 $('#dimensions').textContent=`${Math.round(w)} × ${h} · ${Math.round(scale*100)}%`;
}
document.querySelectorAll('[data-size]').forEach(button=>button.onclick=()=>{size=button.dataset.size;document.querySelectorAll('[data-size]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});resize()});
new ResizeObserver(resize).observe($('#stage'));
const items=['首页与四册课程顺序','中文讲解与日语例句','听力正常与慢速播放','组句、答错解析与错题复习','录音、回放、重录与拒绝权限','刷新后进度保存','iPad 横屏与竖屏布局','内容深度是否符合学习目标'];
let feedback={checks:[],notes:''};try{feedback={...feedback,...JSON.parse(localStorage.getItem('hiyori-feedback-v1')||'{}')}}catch{}
$('#checks').innerHTML=items.map((t,i)=>`<label><input type="checkbox" value="${i}" ${feedback.checks.includes(i)?'checked':''}>${t}</label>`).join('');
$('#notes').value=feedback.notes;
function save(){feedback={checks:[...document.querySelectorAll('#checks input:checked')].map(el=>Number(el.value)),notes:$('#notes').value};try{localStorage.setItem('hiyori-feedback-v1',JSON.stringify(feedback));$('#saved').textContent='已自动保存到这台电脑'}catch{$('#saved').textContent='存储不可用，请导出反馈'}}
$('#notes').oninput=save;$('#checks').onchange=save;
$('#export').onclick=()=>{
 save();const text=`# 新标准日本语试用反馈\n\n日期：${new Date().toLocaleDateString('zh-CN')}\n\n${items.map((t,i)=>`- [${feedback.checks.includes(i)?'x':' '}] ${t}`).join('\n')}\n\n## 修改意见\n\n${feedback.notes||'尚未填写'}\n`;
 const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='新标准日本语试用反馈.md';link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
};
