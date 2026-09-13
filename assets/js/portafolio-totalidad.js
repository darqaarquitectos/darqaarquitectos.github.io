(()=>{
const datasets={
  1:{name:'Portafolio 01',title:'Presentación resumida',count:15,folder:'portfolio-01',download:'assets/portfolios/pdfs/DARQA_Portafolio_01_Presentacion_Resumen.pdf'},
  2:{name:'Portafolio 02',title:'Portafolio general',count:67,folder:'portfolio-02',download:'assets/portfolios/pdfs/DARQA_Portafolio_02_Portafolio_General.pdf'}
};
const viewer=document.getElementById('portfolioViewer');
const image=document.getElementById('viewerImage');
const counter=document.getElementById('viewerCounter');
const kicker=document.getElementById('viewerKicker');
const title=document.getElementById('viewerTitle');
const download=document.getElementById('viewerDownload');
const prev=document.getElementById('viewerPrev');
const next=document.getElementById('viewerNext');
const close=document.getElementById('viewerClose');
const stage=document.getElementById('viewerStage');
let sequence=[]; let position=0; let previousFocus=null; let touchStartX=0; let touchStartY=0;
function buildSequence(mode){
  const ids=mode===0?[1,2]:[mode];
  sequence=[];
  ids.forEach(id=>{for(let page=1;page<=datasets[id].count;page++)sequence.push({portfolio:id,page});});
}
function render(){
  const item=sequence[position]; const d=datasets[item.portfolio];
  kicker.textContent=d.name;
  title.textContent=d.title;
  image.src=`assets/portfolios/${d.folder}/page-${item.page}.jpg`;
  image.alt=`${d.name}, página ${item.page}`;
  counter.textContent=`${position+1} / ${sequence.length}`;
  download.href=d.download;
  download.setAttribute('download','');
  prev.disabled=position===0;
  next.disabled=position===sequence.length-1;
  prev.style.visibility=position===0?'hidden':'visible';
  next.style.visibility=position===sequence.length-1?'hidden':'visible';
  // Preload adjacent pages so navigation feels immediate.
  [position-1,position+1].forEach(i=>{if(sequence[i]){const pre=new Image();const x=sequence[i];pre.src=`assets/portfolios/${datasets[x.portfolio].folder}/page-${x.page}.jpg`;}});
}
function openViewer(mode){
  previousFocus=document.activeElement;
  buildSequence(mode);
  position=0;
  render();
  viewer.classList.add('is-open');
  viewer.setAttribute('aria-hidden','false');
  document.body.classList.add('portfolio-viewer-open');
  close.focus();
}
function closeViewer(){
  viewer.classList.remove('is-open');
  viewer.setAttribute('aria-hidden','true');
  document.body.classList.remove('portfolio-viewer-open');
  image.removeAttribute('src');
  if(previousFocus&&document.contains(previousFocus))previousFocus.focus();
}
function move(step){
  const target=position+step;
  if(target<0||target>=sequence.length)return;
  position=target; render();
}
document.querySelectorAll('[data-open-portfolio]').forEach(btn=>btn.addEventListener('click',()=>openViewer(Number(btn.dataset.openPortfolio))));
document.querySelector('[data-open-both]')?.addEventListener('click',()=>openViewer(0));
prev.addEventListener('click',()=>move(-1));
next.addEventListener('click',()=>move(1));
close.addEventListener('click',closeViewer);
viewer.addEventListener('click',e=>{if(e.target.hasAttribute('data-viewer-close'))closeViewer();});
document.addEventListener('keydown',e=>{
  if(!viewer.classList.contains('is-open'))return;
  if(e.key==='Escape')closeViewer();
  else if(e.key==='ArrowLeft')move(-1);
  else if(e.key==='ArrowRight')move(1);
});
stage.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchStartX=t.clientX;touchStartY=t.clientY;},{passive:true});
stage.addEventListener('touchend',e=>{const t=e.changedTouches[0];const dx=t.clientX-touchStartX;const dy=t.clientY-touchStartY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.2)move(dx<0?1:-1);},{passive:true});
})();
