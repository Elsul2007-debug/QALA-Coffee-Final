"use strict";
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Task 2: custom FAQ accordion with a CSS grid transition.
document.querySelectorAll('.faq-question').forEach(button=>{
  button.addEventListener('click',()=>{
    const answer=document.getElementById(button.getAttribute('aria-controls'));
    const open=button.getAttribute('aria-expanded')!=='true';
    button.setAttribute('aria-expanded',String(open));
    button.querySelector('span').textContent=open?'в€’':'+';
    answer.classList.toggle('open',open); answer.inert=!open;
  });
});
const firstQuestion=document.querySelector('.faq-question');
if(firstQuestion) firstQuestion.click();
// Task 3: native dialog handles keyboard focus and Escape.
const dialog=document.getElementById('subscribeDialog');
if(dialog){
  document.querySelectorAll('[data-open-subscribe]').forEach(button=>button.addEventListener('click',()=>{
    dialog.showModal(); document.body.classList.add('modal-open');
  }));
  dialog.querySelector('[data-close-subscribe]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    const rect=dialog.getBoundingClientRect();
    if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();
  });
  dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
  const subscribe=document.getElementById('subscribeForm');
  const input=document.getElementById('subscribeEmail');
  const error=document.getElementById('subscribeError');
  const result=document.getElementById('subscribeResult');
  subscribe.addEventListener('submit',event=>{
    event.preventDefault();
    const valid=emailPattern.test(input.value.trim());
    error.textContent=valid?'':'Please enter a valid email address.';
    input.setAttribute('aria-invalid',String(!valid));
    result.textContent=valid?'Thank you! Your subscription demo is complete. No email was saved.':'';
    if(!valid)input.focus();
  });
  input.addEventListener('input',()=>{error.textContent='';input.removeAttribute('aria-invalid');result.textContent='';});
}
// Task 5: Date object and a live clock in the cafe's timezone.
const clock=document.getElementById('currentDateTime');
if(clock){
  function updateClock(){
    const now=new Date();
    clock.dateTime=now.toISOString();
    clock.textContent=now.toLocaleString('en-US',{timeZone:'Asia/Almaty',month:'long',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true});
  }
  updateClock(); setInterval(updateClock,1000);
}
