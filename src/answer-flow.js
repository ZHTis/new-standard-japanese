// One cancellable transition. Never advance a different question or a hidden page.
export function createAnswerFlow({current,advance,visible=()=>true,setTimer=setTimeout,clearTimer=clearTimeout,delay=800}){
 let timer=null;
 function cancel(){if(timer!==null)clearTimer(timer);timer=null;}
 function schedule(){
  cancel();const s=current();
  if(!s||!s.checked||!s.feedback?.ok||s.explanationOpen||!visible())return;
  const pos=s.pos;
  timer=setTimer(()=>{timer=null;if(current()===s&&s.pos===pos&&s.checked&&s.feedback?.ok&&!s.explanationOpen&&visible())advance();},delay);
 }
 return {cancel,schedule};
}
