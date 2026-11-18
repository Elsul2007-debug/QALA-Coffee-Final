'use strict';

// 1. DOM selection and styling: day/night theme and rating.
const themeToggle=document.getElementById('themeToggle');
function syncThemeButton(){
  const night=document.documentElement.dataset.theme==='night';
  if(themeToggle){themeToggle.textContent=night?'Day mode':'Night mode';themeToggle.setAttribute('aria-pressed',String(night));}
}
syncThemeButton();
themeToggle?.addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='night'?'day':'night';
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('qalaTheme',theme);}catch(_){/* Theme remains usable for this page. */}
  syncThemeButton();
});
window.addEventListener('storage',event=>{if(event.key==='qalaTheme'){document.documentElement.dataset.theme=event.newValue==='night'?'night':'day';syncThemeButton();}});
const ratingStars=document.querySelectorAll('[data-rating]');
ratingStars.forEach(star=>star.addEventListener('click',()=>{
  const rating=Number(star.dataset.rating);
  ratingStars.forEach(item=>{
    item.classList.toggle('selected',Number(item.dataset.rating)<=rating);
    item.setAttribute('aria-pressed',String(item===star));
  });
  document.getElementById('ratingMessage').textContent=`Thanks! You rated your QALA moment ${rating} out of 5.`;
}));

// 2. Attributes: choose a thumbnail and update the main image.
const thumbnails=document.querySelectorAll('[data-image]');
thumbnails.forEach(thumbnail=>thumbnail.addEventListener('click',()=>{
  const image=document.getElementById('galleryMain');
  image.src=thumbnail.dataset.image;
  image.alt=thumbnail.dataset.alt;
  document.getElementById('galleryCaption').textContent=thumbnail.dataset.caption;
  thumbnails.forEach(item=>item.setAttribute('aria-pressed',String(item===thumbnail)));
}));

// 3. Keyboard events: move focus through the navigation.
const navigationLinks=Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
navigationLinks.forEach((link,index)=>link.addEventListener('keydown',event=>{
  let next;
  switch(event.key){
    case 'ArrowRight': case 'ArrowDown': next=(index+1)%navigationLinks.length; break;
    case 'ArrowLeft': case 'ArrowUp': next=(index-1+navigationLinks.length)%navigationLinks.length; break;
    case 'Home': next=0; break;
    case 'End': next=navigationLinks.length-1; break;
    default: return;
  }
  event.preventDefault();
  navigationLinks[next].focus();
}));

// 4. Callbacks: a three-step brew form that retains its inputs.
const brewForm=document.getElementById('brewForm');
if(brewForm){
  let currentStep=0;
  const steps=Array.from(brewForm.querySelectorAll('[data-brew-step]'));
  const next=document.getElementById('brewNext');
  const back=document.getElementById('brewBack');
  const error=document.getElementById('brewError');
  const name=document.getElementById('brewName');
  function showStep(index){
    currentStep=index;
    steps.forEach((step,i)=>step.hidden=i!==index);
    back.disabled=index===0;
    next.textContent=index===2?'Finish':'Next';
    document.getElementById('stepLabel').textContent=`STEP ${index+1} OF 3`;
    document.getElementById('brewProgressBar').style.width=`${(index+1)/steps.length*100}%`;
    error.textContent='';
    if(index===2){
      const drink=document.getElementById('brewDrink').value;
      const milk=document.getElementById('brewMilk').value;
      const size=document.getElementById('brewSize').value;
      document.getElementById('brewSummary').textContent=`${name.value.trim()}, your choice is ${size.toLowerCase()} ${drink} with ${milk.toLowerCase()}.`;
    }
  }
  // onChange is a callback, invoked after an action selects a step.
  function changeStep(direction,onChange){
    if(direction>0&&currentStep===0&&!name.value.trim()){
      error.textContent='Please enter your name.';name.setAttribute('aria-invalid','true');name.focus();return;
    }
    name.removeAttribute('aria-invalid');
    onChange(Math.max(0,Math.min(2,currentStep+direction)));
    steps[currentStep].querySelector('h3').focus();
  }
  next.addEventListener('click',()=>{
    if(currentStep<2){changeStep(1,showStep);return;}
    document.getElementById('brewResult').textContent='Your brew preview is ready. No order was placed.';
    next.disabled=true;
  });
  back.addEventListener('click',()=>{
    next.disabled=false;document.getElementById('brewResult').textContent='';changeStep(-1,showStep);
  });
  document.getElementById('brewReset').addEventListener('click',()=>{
    brewForm.reset();next.disabled=false;name.removeAttribute('aria-invalid');
    document.getElementById('brewResult').textContent='';showStep(0);name.focus();
  });
  brewForm.addEventListener('submit',event=>{event.preventDefault();if(!next.disabled)next.click();});
  showStep(0);
}

// 5. Arrays, objects and methods: render and calculate a tasting list.
const tastingMenu=[
  {id:'espresso',name:'Espresso',category:'coffee',price:900,image:'espres.jpg'},
  {id:'cappuccino',name:'Cappuccino',category:'coffee',price:1400,image:'capuchi.jpg'},
  {id:'latte',name:'Latte',category:'coffee',price:1700,image:'latte.jpg'},
  {id:'tea',name:'Green tea',category:'tea',price:1200,image:'coffee5.jpg'},
  {id:'cake',name:'Berry cheesecake',category:'dessert',price:1900,image:'coffee4.jpg'}
];
const tastingOrder={
  items:[],
  add(product){this.items.push(product);},
  total(){let sum=0;for(const item of this.items)sum+=item.price;return sum;},
  clear(){this.items=[];}
};
function formatPrice(value){return value.toLocaleString('en-US')+' ₸';}
function updateTasting(){
  const names=tastingOrder.items.map(item=>item.name);
  document.getElementById('tastingItems').textContent=names.length?names.join(' · '):'Your list is empty.';
  document.getElementById('tastingTotal').textContent='Total: '+formatPrice(tastingOrder.total());
}
const tastingGrid=document.getElementById('tastingGrid');
if(tastingGrid){
  function renderTasting(category){
    let visible;
    // Switch selects the category; filter receives a callback.
    switch(category){
      case 'coffee': visible=tastingMenu.filter(item=>item.category==='coffee');break;
      case 'tea': visible=tastingMenu.filter(item=>item.category==='tea');break;
      case 'dessert': visible=tastingMenu.filter(item=>item.category==='dessert');break;
      default: visible=tastingMenu;
    }
    tastingGrid.replaceChildren();
    for(const item of visible){
      const column=document.createElement('div');column.className='col-12 col-sm-6 col-lg-4';
      // All template values come from our fixed product array.
      column.innerHTML=`<article class="lab-panel h-100 overflow-hidden"><img class="tasting-image" src="images/${item.image}" alt="${item.name}" loading="lazy"><div class="p-4"><h3 class="h5">${item.name}</h3><p>${formatPrice(item.price)}</p><button class="btn btn-outline-dark rounded-pill" type="button" data-add="${item.id}" aria-label="Add ${item.name}">Add to list</button></div></article>`;
      tastingGrid.append(column);
    }
    document.getElementById('labFilterStatus').textContent=`${visible.length} options to explore.`;
  }
  const filters=document.querySelectorAll('[data-lab-filter]');
  filters.forEach(button=>button.addEventListener('click',()=>{
    renderTasting(button.dataset.labFilter);
    filters.forEach(item=>{
      const selected=item===button;
      item.setAttribute('aria-pressed',String(selected));
      item.classList.toggle('btn-dark',selected);item.classList.toggle('btn-outline-dark',!selected);
    });
  }));
  // Event delegation also handles buttons recreated by filtering.
  tastingGrid.addEventListener('click',event=>{
    const button=event.target.closest('[data-add]');if(!button)return;
    tastingOrder.add(tastingMenu.find(item=>item.id===button.dataset.add));
    updateTasting();
  });
  document.getElementById('clearTasting').addEventListener('click',()=>{tastingOrder.clear();updateTasting();});
  renderTasting('all');
}

// 6. Sound and event-triggered animation, without overlapping audio.
const playSound=document.getElementById('playSound');
if(playSound){
  const audio=document.getElementById('coffeeAudio');
  const cup=document.getElementById('coffeeCup');
  const status=document.getElementById('soundStatus');
  playSound.addEventListener('click',()=>{
    audio.pause();audio.currentTime=0;
    audio.play().then(()=>{status.textContent='Coffee chime playing.';}).catch(()=>{
      status.textContent='Sound could not play. Please try again.';
    });
    cup.classList.remove('cup-bounce');void cup.offsetWidth;cup.classList.add('cup-bounce');
  });
  cup.addEventListener('animationend',()=>cup.classList.remove('cup-bounce'));
  audio.addEventListener('ended',()=>{status.textContent='Chime finished. Tap to play again.';});
}
