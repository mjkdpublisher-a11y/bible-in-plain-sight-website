'use strict';
(() => {
  const root=document.querySelector('[data-book-reader]');
  if(!root) return;
  const slots=[...root.querySelectorAll('.reader-slot')];
  const prev=root.querySelector('[data-reader-prev]');
  const next=root.querySelector('[data-reader-next]');
  const status=root.querySelector('[data-reader-status]');
  const zoom=document.querySelector('#reader-zoom');
  const mobile=window.matchMedia('(max-width:700px)');
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  const picker=document.querySelector('.reader-picker');
  const select=picker.querySelector('select');
  let pages=[],step=0,busy=false,animation=null,leaf=null,pendingStep=null,zoomOpener=null,wasMobile=mobile.matches,loading=false,loadId=0,activeId='',catalog=[],sample=null;
  const cache=new Map();
  const offset=()=>pages[0]?.number%2===1?1:0;
  const last=()=>mobile.matches?pages.length-1:Math.ceil((pages.length+offset())/2)-1;
  const indices=n=>mobile.matches?[n,null]:[n*2-offset(),n*2-offset()+1];
  function note(end=false) {
    const box=document.createElement('div');box.className='reader-note';
    const h=document.createElement('h3');h.textContent=end?'A place to continue.':sample.section;
    const p=document.createElement('p');p.textContent=end?'You’ve reached the end of this sample. Choose another section, or explore the complete book.':`${sample.chapter}\nChapter ${sample.chapterNumber} · Sample pages ${pages[0].number}–${pages.at(-1).number}\n\nTurn the pages at your own pace.`;
    box.append(h,p);
    if(end) {const a=document.createElement('a');a.href='#editions';a.className='text-button';a.textContent='Choose your edition →';box.append(a);}
    return box;
  }
  function content(index,interactive=true) {
    if(index===null || index<0 || index>=pages.length) return note(index>=pages.length);
    const p=pages[index],img=document.createElement('img');img.src=p.image;img.width=900;img.height=1350;img.alt=`Book page ${p.number}: ${p.alt}`;img.draggable=false;
    if(!interactive) return img;
    const button=document.createElement('button');button.type='button';button.className='reader-page-button';button.setAttribute('aria-label',`Enlarge book page ${p.number}`);button.append(img);button.addEventListener('click',()=>openZoom(p,button));return button;
  }
  function render() {
    const restoreReaderFocus=document.activeElement?.classList.contains('reader-page-button');
    const ids=indices(step);slots.forEach((slot,i)=>slot.replaceChildren(content(ids[i])));
    prev.disabled=loading||step===0;next.disabled=loading||step===last();
    const nums=ids.filter(i=>i!==null&&i>=0&&i<pages.length).map(i=>pages[i].number);
    status.textContent=`${nums.length>1?'Pages':'Page'} ${nums.join('–')} · Sample`;
    root.querySelector('[data-reader-end]').hidden=step!==last();
    if(restoreReaderFocus) root.focus({preventScroll:true});
  }
  function finish() {
    animation=null;leaf?.remove();leaf=null;
    if(pendingStep!==null)step=pendingStep;
    pendingStep=null;busy=false;root.removeAttribute('aria-busy');render();
  }
  function turn(delta) {
    if(busy||loading)return;
    const target=step+delta;if(target<0||target>last())return;
    if(reduced.matches||!Element.prototype.animate){step=target;render();return;}
    busy=true;pendingStep=target;root.setAttribute('aria-busy','true');
    const before=indices(step),after=indices(target),forward=delta>0;
    leaf=document.createElement('div');leaf.className='turn-leaf';leaf.setAttribute('aria-hidden','true');
    leaf.style.left=mobile.matches?'0':forward?'50%':'0';leaf.style.transformOrigin=forward?'left center':'right center';
    const front=document.createElement('div'),back=document.createElement('div');front.className='turn-face';back.className='turn-face turn-back';
    front.append(content(before[mobile.matches?0:forward?1:0],false));back.append(content(after[mobile.matches?0:forward?0:1],false));leaf.append(front,back);
    slots[mobile.matches?0:forward?1:0].replaceChildren(content(after[mobile.matches?0:forward?1:0]));
    root.querySelector('.reader-spread').append(leaf);
    animation=leaf.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${forward?-85:85}deg)`,offset:.5},{transform:`rotateY(${forward?-180:180}deg)`}],{duration:680,easing:'cubic-bezier(.22,.68,.2,1)',fill:'forwards'});
    animation.finished.then(finish).catch(()=>{});
  }
  function cancelTurn(){if(!busy)return;animation?.cancel();finish();}
  function openZoom(p,button){zoomOpener=button;zoom.querySelector('img').src=p.image;zoom.querySelector('img').alt=`Book page ${p.number}: ${p.alt}`;zoom.querySelector('[data-zoom-label]').textContent=`Sample · Page ${p.number}`;zoom.querySelector('.reader-zoom-body').classList.add('is-enlarged');zoom.querySelector('.reader-zoom-fit').textContent='Fit page';zoom.querySelector('.reader-zoom-fit').setAttribute('aria-pressed','true');zoom.showModal();zoom.scrollTop=0;zoom.querySelector('.reader-zoom-body').scrollTo(0,0);document.body.classList.add('reader-zoom-open');}
  zoom.querySelector('.reader-zoom-close').addEventListener('click',()=>zoom.close());
  zoom.querySelector('.reader-zoom-fit').addEventListener('click',e=>{const enlarged=zoom.querySelector('.reader-zoom-body').classList.toggle('is-enlarged');e.currentTarget.textContent=enlarged?'Fit page':'Zoom in';e.currentTarget.setAttribute('aria-pressed',String(enlarged));});
  zoom.addEventListener('close',()=>{document.body.classList.remove('reader-zoom-open');zoomOpener?.focus();});
  zoom.addEventListener('click',event=>{if(event.target===zoom){const r=zoom.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)zoom.close();}});
  prev.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));
  root.addEventListener('keydown',e=>{if(e.target.closest('summary,a,select,textarea,input'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turn(e.key==='ArrowRight'?1:-1);}});
  mobile.addEventListener('change',()=>{const old=pendingStep??step;const active=wasMobile?old:Math.max(0,old*2-offset());wasMobile=mobile.matches;animation?.cancel();leaf?.remove();leaf=null;busy=false;pendingStep=null;if(!loading)root.removeAttribute('aria-busy');step=mobile.matches?Math.min(pages.length-1,active):Math.floor((active+offset())/2);if(pages.length&&!loading)render();});
  reduced.addEventListener('change',()=>{if(reduced.matches)cancelTurn();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelTurn();});
  async function loadSection(id){
    const section=catalog.find(s=>s.id===id);if(!section)return;
    cancelTurn();const request=++loadId;loading=true;root.dataset.loading='';root.setAttribute('aria-busy','true');prev.disabled=true;next.disabled=true;status.textContent=`Opening ${section.title}…`;root.querySelector('[data-reader-error]').hidden=true;
    try{
      let data=cache.get(id);
      if(!data){const response=await fetch(section.url);if(!response.ok)throw Error('Sample unavailable');data=await response.json();if(!data.pages?.length)throw Error('Empty sample');cache.set(id,data);}
      await Promise.all(data.pages.map(p=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=p.image;})));
      if(request!==loadId)return;
      sample=data;pages=data.pages;activeId=id;step=0;loading=false;root.removeAttribute('data-loading');root.removeAttribute('aria-busy');
      document.querySelector('[data-reader-section]').textContent=data.section;
      document.querySelector('[data-reader-chapter]').textContent=`${data.chapter} · ${pages.length} sample pages`;
      select.value=id;picker.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.section===id)));
      const text=root.querySelector('[data-reader-text]');text.replaceChildren();root.querySelector('.reader-text').open=false;
      pages.forEach(p=>{const h=document.createElement('h3'),body=document.createElement('p');h.textContent=`Page ${p.number}`;body.textContent=p.text;text.append(h,body);});
      render();root.querySelector('[data-reader-controls]').hidden=false;root.querySelector('.reader-hint').hidden=false;root.querySelector('.reader-text').hidden=false;
      status.textContent=`${data.section} · ${status.textContent}`;
    }catch{
      if(request!==loadId)return;
      loading=false;root.removeAttribute('data-loading');root.removeAttribute('aria-busy');select.value=activeId||catalog[0].id;
      if(pages.length)render();
      root.querySelector('[data-reader-error]').hidden=false;
    }
  }
  select.addEventListener('change',()=>loadSection(select.value));
  async function init(){
    try{
      const response=await fetch('/assets/book/samples/catalog.json');if(!response.ok)throw Error('Catalog unavailable');
      catalog=(await response.json()).sections;
      const list=picker.querySelector('nav');
      catalog.forEach(s=>{const button=document.createElement('button');button.type='button';button.textContent=s.title;button.dataset.section=s.id;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>loadSection(s.id));list.append(button);const option=document.createElement('option');option.value=s.id;option.textContent=s.title;select.append(option);});
      picker.hidden=false;await loadSection(catalog[0].id);
    }catch{root.querySelector('[data-reader-error]').hidden=false;}
  }
  // Keep chapter assets off the initial loading path; prepare them as the
  // visitor approaches the reader instead of fetching five pages at the hero.
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(e=>e.isIntersecting)){observer.disconnect();init();}
    },{rootMargin:'600px 0px'});
    observer.observe(root);
  }else init();
})();
