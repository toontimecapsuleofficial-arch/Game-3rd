'use strict';
/* ================= HELPERS ================= */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
/* rounded hand-drawn sketch font stack (self-contained: no external font files) */
const HAND='"Baloo 2","Fredoka One","Arial Rounded MT Bold","Hiragino Maru Gothic ProN","Nunito","Quicksand","Trebuchet MS","Verdana",sans-serif';
function rng(seed){let t=seed>>>0;return function(){t+=0x6D2B79F5;let r=Math.imul(t^t>>>15,1|t);r^=r+Math.imul(r^r>>>7,61|r);return((r^r>>>14)>>>0)/4294967296;};}
function todayStr(){return new Date().toISOString().slice(0,10);}
function daysBetween(a,b){return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/864e5);}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function getWeekKey(){const d=new Date();const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=t.getUTCDay()||7;
 t.setUTCDate(t.getUTCDate()+4-day);const ys=new Date(Date.UTC(t.getUTCFullYear(),0,1));const wk=Math.ceil((((t-ys)/864e5)+1)/7);return t.getUTCFullYear()+'-W'+wk;}
const num=(v,d)=>(typeof v==='number'&&isFinite(v))?v:d;
function fmt(n){return n>=10000?(Math.round(n/100)/10)+'k':(''+n);}

/* ================= ICONS (hand-drawn SVG) ================= */
const S=(inner)=>'<svg class="ic" viewBox="0 0 24 24">'+inner+'</svg>';
const ICONS={
play:S('<path d="M7.5 4.8 19 12 7.7 19.4Z" fill="currentColor"/>'),
pause:S('<path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" fill="none"/>'),
back:S('<path d="M14.8 4.6 7 12l8 7.6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
check:S('<path d="M4.5 12.8 9.6 18 19.6 6.4" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
cart:S('<path d="M3.5 4.5h2.6l2.4 10.6h9.8l2-7.4H7.2" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.6" cy="19.4" r="1.7" fill="currentColor"/><circle cx="16.8" cy="19.4" r="1.7" fill="currentColor"/>'),
globe:S('<circle cx="12" cy="12" r="8.6" stroke="currentColor" stroke-width="2.4" fill="none"/><path d="M3.6 12h16.8M12 3.4c-5.4 5-5.2 12.4.2 17.2 5.2-4.8 5.4-12.2-.2-17.2Z" stroke="currentColor" stroke-width="2.2" fill="none"/>'),
trophy:S('<path d="M7 4h10v6a5 5 0 0 1-10 0ZM7 5.5H4a3 3 0 0 0 3.4 3.4M17 5.5h3a3 3 0 0 1-3.4 3.4M12 15v3.4M8.5 20.5h7" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
gear:S('<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2.3" fill="none"/><path d="M12 3.2v2.6M12 18.2v2.6M3.2 12h2.6M18.2 12h2.6M5.8 5.8l1.8 1.8M16.4 16.4l1.8 1.8M18.2 5.8l-1.8 1.8M7.6 16.4l-1.8 1.8" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" fill="none"/>'),
gift:S('<path d="M4.5 10.5h15V20h-15ZM4 7h16v3.5H4ZM12 7v13M12 7c-3.5 0-5-1.4-4.4-3.2C8.2 2.2 11 3 12 7Zm0 0c3.5 0 5-1.4 4.4-3.2C15.8 2.2 13 3 12 7Z" stroke="currentColor" stroke-width="2.1" fill="none" stroke-linejoin="round"/>'),
home:S('<path d="M4.4 11 12 4.2 19.6 11M6.4 9.6V20h11.2V9.6" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
redo:S('<path d="M19 12a7 7 0 1 1-2.2-5.1M19 3.6v3.8h-3.8" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
lock:S('<rect x="5.5" y="10.5" width="13" height="9" rx="2" stroke="currentColor" stroke-width="2.3" fill="none"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" stroke-width="2.3" fill="none"/>'),
sndOn:S('<path d="M4.5 9.5v5h3.6l4.6 4V5.5l-4.6 4ZM15.5 9a4.5 4.5 0 0 1 0 6M18 6.6a8 8 0 0 1 0 10.8" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
mus:S('<path d="M9.5 18.2V5.8l9-1.8v12.4" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="18.2" r="2.5" stroke="currentColor" stroke-width="2.3" fill="none"/><circle cx="16" cy="16.4" r="2.5" stroke="currentColor" stroke-width="2.3" fill="none"/>'),
vib:S('<rect x="8" y="4.5" width="8" height="15" rx="1.8" stroke="currentColor" stroke-width="2.3" fill="none"/><path d="M4.5 9v6M19.5 9v6" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" fill="none"/>'),
spark:S('<path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>'),
trash:S('<path d="M4.5 6.5h15M9.5 6.5V4.8h5v1.7M6.5 6.5 7.5 20h9l1-13.5M10 10v6.5M14 10v6.5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
hand:S('<path d="M10 11V4.6a1.6 1.6 0 0 1 3.2 0V10l4.8.9c1.2.3 2 1.3 2 2.5v3.2c0 3.2-2.4 5.4-5.8 5.4h-2.6c-1.8 0-3.2-.7-4.3-2.2L5 15.9c-.8-1-.6-2.2.3-2.9.8-.6 2-.5 2.8.4L10 15.2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
target:S('<circle cx="12" cy="12" r="8.4" stroke="currentColor" stroke-width="2.3" fill="none"/><circle cx="12" cy="12" r="4.6" stroke="currentColor" stroke-width="2.1" fill="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>'),
flame:S('<path d="M12 3.5c1 3-3.4 4.6-3.4 8.2a4.4 4.4 0 0 0 8.8 0c0-1.6-.7-2.9-1.6-4.1-.2 1-.7 1.8-1.5 2.2.5-2.4-.4-4.8-2.3-6.3Z" stroke="currentColor" stroke-width="2.1" fill="none" stroke-linejoin="round"/><path d="M12 20.5v0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
shield:S('<path d="M12 3.6 5 6.4v5.2c0 4.6 3 7.4 7 8.8 4-1.4 7-4.2 7-8.8V6.4Z" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linejoin="round"/><path d="M8.8 11.8l2.2 2.2 4.2-4.6" stroke="currentColor" stroke-width="2.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
coin_classic:S('<circle cx="12" cy="12" r="9" fill="#f6c94a" stroke="#3b3230" stroke-width="2.2"/><circle cx="12" cy="12" r="6.2" fill="none" stroke="#c9942a" stroke-width="1.6"/><path d="M12 8.4l1.1 2.3 2.5.3-1.8 1.8.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.8 2.5-.3Z" fill="#c9942a"/>'),
coin_clover:S('<circle cx="12" cy="12" r="9" fill="#f6c94a" stroke="#3b3230" stroke-width="2.2"/><circle cx="10.6" cy="10.4" r="2" fill="#5c9a4e"/><circle cx="13.6" cy="10.4" r="2" fill="#5c9a4e"/><circle cx="12.1" cy="8.4" r="2" fill="#5c9a4e"/><path d="M12 12.5v3" stroke="#4a7d3f" stroke-width="1.8" stroke-linecap="round"/>'),
coin_button:S('<circle cx="12" cy="12" r="9" fill="#dd9c5c" stroke="#3b3230" stroke-width="2.2"/><circle cx="12" cy="12" r="6.4" fill="none" stroke="#8a5a3b" stroke-width="1.6"/><circle cx="10" cy="10" r="1.1" fill="#8a5a3b"/><circle cx="14" cy="10" r="1.1" fill="#8a5a3b"/><circle cx="10" cy="14" r="1.1" fill="#8a5a3b"/><circle cx="14" cy="14" r="1.1" fill="#8a5a3b"/>'),
coin_star:S('<circle cx="12" cy="12" r="9" fill="#efe6cf" stroke="#3b3230" stroke-width="2.2"/><path d="M12 6.8l1.5 3.1 3.4.4-2.5 2.4.6 3.4-3-1.7-3 1.7.6-3.4-2.5-2.4 3.4-.4Z" fill="#f0a03c"/>'),
coin_acorn:S('<circle cx="12" cy="12" r="9" fill="#e8cfa0" stroke="#3b3230" stroke-width="2.2"/><path d="M8.5 10.5c0-2.6 7 0 7 0s.4 1-3.5 1-3.5-1-3.5-1Z" fill="#8a5a3b"/><path d="M9.2 11.5c0 3 1.6 4.8 2.8 4.8s2.8-1.8 2.8-4.8Z" fill="#b98a4e"/><path d="M12 8.2v-1.6" stroke="#8a5a3b" stroke-width="1.8" stroke-linecap="round"/>'),
coin_gem:S('<circle cx="12" cy="12" r="9" fill="#cfe8ea" stroke="#3b3230" stroke-width="2.2"/><path d="M8 9.5h8l1.6 2.4L12 17.6 6.4 11.9Z" fill="#7fc9cf" stroke="#3f7f8a" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 9.5l4 2.4 4-2.4M12 11.9v5.7" stroke="#3f7f8a" stroke-width="1.2" fill="none"/>')
};
function coinIcon(){return ICONS['coin_'+SV.eq.coins]||ICONS.coin_classic;}

/* ================= SAVE (robust, validated) ================= */
const KEY='stackTower_v2', KEY_OLD='stackTower_v1';
let storageOK=true, loadWarn='';
const DEF={v:2,coins:0,bestH:0,bestScore:0,blocks:0,perfects:0,bestCombo:0,coinsEarned:0,days:0,lastDay:'',first:0,tut:0,welcome:0,
 games:0,goldStacked:0,feverCount:0,chalsDone:0,nearMisses:0,bestAcc:0,
 owned:{},eq:{skins:'wood',themes:'ink',bgs:'plain',trails:'none',fxs:'sparkle',coins:'classic',uis:'cream',birds:'robin',hats:'none'},
 world:'meadow',ach:{},wrew:{},wqrew:{},wbest:{},
 daily:{last:'',day:0,shield:0},
 quest:{chalIdx:0,daily:{date:'',id:-1,prog:0,done:false},week:{key:'',prog:{},done:{}}},
 set:{sound:true,music:true,haptics:true,fx:true}};
function sanitize(d){
 const s=JSON.parse(JSON.stringify(DEF));
 if(!d||typeof d!=='object')return s;
 ['coins','bestH','bestScore','blocks','perfects','bestCombo','coinsEarned','days','games','goldStacked','feverCount','chalsDone','nearMisses','bestAcc','first','tut','welcome'].forEach(k=>{s[k]=num(d[k],DEF[k]);if(s[k]<0)s[k]=DEF[k];});
 ['lastDay','world'].forEach(k=>{s[k]=(typeof d[k]==='string')?d[k]:DEF[k];});
 if(d.owned&&typeof d.owned==='object')for(const k in d.owned)if(typeof k==='string')s.owned[k]=1;
 if(d.eq&&typeof d.eq==='object')for(const k in DEF.eq)if(typeof d.eq[k]==='string')s.eq[k]=d.eq[k];
 if(d.ach&&typeof d.ach==='object')for(const k in d.ach)s.ach[k]=1;
 if(d.wrew&&typeof d.wrew==='object')for(const k in d.wrew)s.wrew[k]=1;
 if(d.wqrew&&typeof d.wqrew==='object')for(const k in d.wqrew)s.wqrew[k]=1;
 if(d.wbest&&typeof d.wbest==='object')for(const k in d.wbest)s.wbest[k]=num(d.wbest[k],0);
 if(d.daily&&typeof d.daily==='object'){s.daily.last=(typeof d.daily.last==='string')?d.daily.last:'';s.daily.day=num(d.daily.day,0);s.daily.shield=clamp(num(d.daily.shield,0),0,2);}
 if(d.set&&typeof d.set==='object')for(const k in DEF.set)s.set[k]=d.set[k]===false?false:!!(d.set[k]!==undefined?d.set[k]:DEF.set[k]);
 if(d.quest&&typeof d.quest==='object'){
  s.quest.chalIdx=num(d.quest.chalIdx,0);
  if(d.quest.daily&&typeof d.quest.daily==='object'){s.quest.daily.date=(typeof d.quest.daily.date==='string')?d.quest.daily.date:'';s.quest.daily.id=num(d.quest.daily.id,-1);s.quest.daily.prog=num(d.quest.daily.prog,0);s.quest.daily.done=!!d.quest.daily.done;}
  if(d.quest.week&&typeof d.quest.week==='object'){s.quest.week.key=(typeof d.quest.week.key==='string')?d.quest.week.key:'';
   if(d.quest.week.prog&&typeof d.quest.week.prog==='object')for(const k in d.quest.week.prog)s.quest.week.prog[k]=num(d.quest.week.prog[k],0);
   if(d.quest.week.done&&typeof d.quest.week.done==='object')for(const k in d.quest.week.done)s.quest.week.done[k]=1;}
 }
 return s;
}
function load(){
 let raw=null;
 try{raw=localStorage.getItem(KEY)||localStorage.getItem(KEY_OLD);}catch(e){storageOK=false;}
 if(!raw)return sanitize(null);
 try{
  let d=JSON.parse(raw);
  if(!d||typeof d!=='object')throw new Error('bad save');
  return sanitize(d);
 }catch(e){
  try{localStorage.setItem(KEY+'_corrupt_'+Date.now(),String(raw).slice(0,200000));localStorage.removeItem(KEY);}catch(e2){}
  loadWarn='Your old save was a bit smudged — starting fresh with a clean sheet!';
  return sanitize(null);
 }
}
let SV=load();
function save(){try{if(storageOK)localStorage.setItem(KEY,JSON.stringify(SV));}catch(e){storageOK=false;}}

/* ================= AUDIO (Web Audio, all generated) ================= */
let AC=null;
function ac(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC;}
function tone(f,d,type,v,slide,delay){
  try{const c=ac(),t=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();
  o.type=type||'sine';o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,slide),t+d);
  g.gain.setValueAtTime(v||0.2,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
  o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+0.03);}catch(e){}
}
const SFX={
  click:()=>tone(520,0.07,'square',0.1,700),
  drop:()=>tone(150,0.12,'triangle',0.3,70),
  perfect:()=>{tone(784,0.1,'sine',0.22);tone(1175,0.16,'sine',0.2,0,0.07);},
  combo:n=>{tone(560+Math.min(n,12)*55,0.09,'square',0.13);tone(840+Math.min(n,12)*55,0.13,'sine',0.13,0,0.06);},
  coin:()=>tone(1250,0.09,'square',0.09,1800),
  over:()=>{tone(320,0.25,'sawtooth',0.15,120);tone(240,0.3,'sawtooth',0.13,90,0.18);tone(160,0.5,'sawtooth',0.13,60,0.4);},
  ach:()=>[523,659,784,1047].forEach((f,i)=>tone(f,0.15,'triangle',0.15,0,i*0.09)),
  mile:()=>[392,494,587,784].forEach((f,i)=>tone(f,0.22,'triangle',0.14,0,i*0.05)),
  buy:()=>{tone(700,0.08,'square',0.11);tone(1050,0.13,'square',0.11,0,0.08);},
  deny:()=>tone(180,0.16,'square',0.14,120),
  pop:()=>tone(880,0.06,'sine',0.14,1200),
  equip:()=>{tone(660,0.07,'sine',0.13);tone(990,0.1,'sine',0.12,0,0.06);},
  fever:()=>[440,554,659,880,1108].forEach((f,i)=>tone(f,0.12,'square',0.1,0,i*0.055)),
  golden:()=>{tone(1568,0.12,'sine',0.15);tone(2093,0.2,'sine',0.13,0,0.09);tone(1568,0.18,'triangle',0.08,0,0.18);},
  special:()=>{tone(600,0.09,'square',0.11,900);tone(900,0.12,'square',0.1,1300,0.08);},
  near:()=>{tone(300,0.22,'sine',0.16,90);tone(1200,0.05,'square',0.06,0,0.02);},
  streak:()=>[880,1108,1318].forEach((f,i)=>tone(f,0.1,'triangle',0.13,0,i*0.05)),
  record:()=>[523,659,784,1047,1319].forEach((f,i)=>tone(f,0.2,'triangle',0.14,0,i*0.09)),
  worldgo:()=>[392,523,659].forEach((f,i)=>tone(f,0.16,'sine',0.12,0,i*0.08)),
  chirp:()=>tone(880,0.07,'triangle',0.07,0,1400)
};
function sfx(n){if(!SV.set.sound)return;try{if(SFX[n])SFX[n].apply(null,[].slice.call(arguments,1));}catch(e){}}
function buzz(p){if(SV.set.haptics&&navigator.vibrate)try{navigator.vibrate(p);}catch(e){}}
let audioReady=false;
function unlockAudio(){if(audioReady)return;try{ac();audioReady=true;if(SV.set.music&&G.state==='play')Music.start();}catch(e){}}
const Music={t:null,i:0,
  seq:[262,330,392,523,587,523,392,330,294,370,440,587,440,370,330,262],
  start(){if(this.t||!SV.set.music)return;this.t=setInterval(()=>{if(!SV.set.music)return;
    const f=this.seq[this.i%this.seq.length];tone(f,0.34,'triangle',0.035);
    if(this.i%4===0)tone(f/2,0.6,'sine',0.03);this.i++;},320);},
  stop(){if(this.t){clearInterval(this.t);this.t=null;}}};

/* ================= CANVAS DRAWING PRIMITIVES (hand-drawn) ================= */
function blockPath(c,x,y,w,h,seed){
  const r=rng(seed),m=Math.min(3,w*0.05+1.2),mv=Math.min(0.5,m*0.18),pts=[];
  const N=Math.max(3,Math.round(w/26)),M=2;
  /* top/bottom edges keep only a whisper of vertical jitter so stacked blocks sit flush (zero visible gaps);
     side edges keep their full hand-drawn wobble */
  for(let i=0;i<=N;i++)pts.push([x+w*i/N,y+(r()*2-1)*mv]);
  for(let i=1;i<=M;i++)pts.push([x+w+(r()*2-1)*m,y+h*i/M]);
  for(let i=N-1;i>=0;i--)pts.push([x+w*i/N,y+h+(r()*2-1)*mv]);
  for(let i=M-1;i>=1;i--)pts.push([x+(r()*2-1)*m,y+h*i/M]);
  c.beginPath();c.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);
  c.closePath();
}
function jline(c,x1,y1,x2,y2,r,col,w){
  c.strokeStyle=col||'#3b3230';c.lineWidth=w||2.5;c.lineCap='round';c.beginPath();
  c.moveTo(x1+(r()*4-2),y1+(r()*4-2));
  c.quadraticCurveTo((x1+x2)/2+(r()*8-4),(y1+y2)/2+(r()*8-4),x2+(r()*4-2),y2+(r()*4-2));c.stroke();
}
function jcircle(c,x,y,rad,r,fill,stroke,w){
  c.beginPath();const N=12;
  for(let i=0;i<=N;i++){const a=i/N*Math.PI*2,rr=rad*(1+(r()-0.5)*0.14);
    const px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;i?c.lineTo(px,py):c.moveTo(px,py);}
  c.closePath();
  if(fill){c.fillStyle=fill;c.fill();}
  if(stroke){c.strokeStyle=stroke;c.lineWidth=w||2.5;c.stroke();}
}
function jpoly(c,pts,r,fill,stroke,w){
  c.beginPath();pts.forEach((p,i)=>{const jx=p[0]+(r()*6-3),jy=p[1]+(r()*6-3);i?c.lineTo(jx,jy):c.moveTo(jx,jy);});
  c.closePath();
  if(fill){c.fillStyle=fill;c.fill();}
  if(stroke){c.strokeStyle=stroke;c.lineWidth=w||2.5;c.stroke();}
}
function speck(c,x,y,s,col){c.strokeStyle=col;c.lineWidth=1.6;c.beginPath();c.moveTo(x-s,y);c.lineTo(x+s,y);c.moveTo(x,y-s);c.lineTo(x,y+s);c.stroke();}
function star5(c,x,y,ro,ri,rot){c.beginPath();for(let i=0;i<10;i++){const a=(rot||0)+i*Math.PI/5-Math.PI/2,rr=i%2?ri:ro;
  const px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();}
function cloud(c,x,y,s,r,fill,str){
  fill=fill||'#ffffff';str=str||'rgba(59,50,48,.45)';
  c.beginPath();c.moveTo(x-s,y+s*0.35);
  const n=4;
  for(let i=0;i<n;i++){
    const bx=x-s+(i+0.5)*(2*s/n),by=y-s*0.28-(i%2?s*0.26:s*0.08)+(r()-0.5)*s*0.1;
    c.quadraticCurveTo(bx,by,x-s+(i+1)*(2*s/n),y+s*0.2+(r()-0.5)*3);
  }
  c.quadraticCurveTo(x+s*0.5,y+s*0.58,x,y+s*0.38);
  c.quadraticCurveTo(x-s*0.6,y+s*0.58,x-s,y+s*0.35);
  c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=str;c.lineWidth=2.5;c.stroke();
}
function hill(c,W,H,y0,amp,col,r){
  c.beginPath();c.moveTo(-30,H+30);
  for(let i=0;i<=9;i++){const x=-30+(W+60)*i/9;c.lineTo(x+(r()*10-5),y0-Math.sin(i/9*Math.PI)*amp+(r()*8-4));}
  c.lineTo(W+30,H+30);c.closePath();
  c.fillStyle=col;c.fill();c.strokeStyle='rgba(59,50,48,.3)';c.lineWidth=2.5;c.stroke();
}
function drawCoinShape(c,x,y,s,id){
  if(id==='donut'){c.fillStyle='#e8b47c';c.beginPath();c.ellipse(x,y,s,s*0.82,0,0,7);c.fill();c.strokeStyle='#3b3230';c.lineWidth=2.4;c.stroke();
   c.fillStyle='#f48fb1';c.beginPath();c.ellipse(x,y-s*0.14,s*0.9,s*0.6,0,0,7);c.fill();c.stroke();
   c.fillStyle='#fbe3ec';c.beginPath();c.ellipse(x,y,s*0.3,s*0.2,0,0,7);c.fill();c.stroke();
   const _dr=rng(9);for(let _i=0;_i<7;_i++){const _a=_i*0.9+_dr()*0.5;
    c.save();c.translate(x+Math.cos(_a)*s*0.62,y+Math.sin(_a)*s*0.46-2);c.rotate(_a+_dr());
    c.fillStyle=CONF[_i%CONF.length];c.fillRect(-2.2,-1,4.4,2);c.restore();}return;}
  jcircle(c,x,y,s,rng(3),id==='button'?'#dd9c5c':id==='star'?'#efe6cf':id==='acorn'?'#e8cfa0':id==='gem'?'#cfe8ea':'#f6c94a','#3b3230',2.6);
  if(id==='acorn'){c.fillStyle='#8a5a3b';c.beginPath();c.ellipse(x,y-s*0.22,s*0.55,s*0.3,0,Math.PI,0);c.fill();
   c.fillStyle='#b98a4e';c.beginPath();c.ellipse(x,y+s*0.18,s*0.4,s*0.5,0,0,7);c.fill();return;}
  if(id==='gem'){c.fillStyle='#7fc9cf';c.strokeStyle='#3f7f8a';c.lineWidth=1.6;
   c.beginPath();c.moveTo(x-s*0.5,y-s*0.2);c.lineTo(x+s*0.5,y-s*0.2);c.lineTo(x+s*0.62,y);c.lineTo(x,y+s*0.55);c.lineTo(x-s*0.62,y);c.closePath();c.fill();c.stroke();return;}
  jcircle(c,x,y,s*0.74,rng(5),null,id==='button'?'#8a5a3b':'#c9942a',1.8);
  if(id==='clover'){c.fillStyle='#5c9a4e';const rr=s*0.2;
    [[-rr*0.95,-rr*0.4],[rr*0.95,-rr*0.4],[0,-rr*1.15]].forEach(o=>{c.beginPath();c.arc(x+o[0],y+o[1],rr,0,7);c.fill();});
    c.strokeStyle='#4a7d3f';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+rr*1.5);c.stroke();}
  else if(id==='button'){c.fillStyle='#8a5a3b';[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(o=>{c.beginPath();c.arc(x+o[0]*s*0.28,y+o[1]*s*0.28,s*0.1,0,7);c.fill();});}
  else if(id==='star'){c.fillStyle='#f0a03c';star5(c,x,y,s*0.5,s*0.22,0.2);c.fill();}
  else{c.fillStyle='#c9942a';star5(c,x,y,s*0.42,s*0.18,0);c.fill();}
}

/* ================= WORLDS ================= */
const WORLDS=[
{id:'meadow',n:'Meadow',req:0,sky:'#c9ecf5',ground:'#9fdc8f',amb:'petal',
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  const sx=W*0.82,sy=H*0.15;
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2;jline(c,sx+Math.cos(a)*46,sy+Math.sin(a)*46,sx+Math.cos(a)*60+(i%2?7:0),sy+Math.sin(a)*60+(i%2?7:0),r,'#e8a800',3);}
  jcircle(c,sx,sy,38,r,'#ffd94d','#e8a800',3);
  cloud(c,W*0.2,H*0.13,36,r);cloud(c,W*0.56,H*0.27,24,r);cloud(c,W*0.06,H*0.42,20,r);
  hill(c,W,H,H*0.74,H*0.17,'#b2e09e',r);
  hill(c,W,H,H*0.8,H*0.13,'#95d483',r);
  for(let i=0;i<7;i++){const fx=W*(0.06+0.88*((i*0.137+r()*0.1)%1)),fy=H*(0.82+r()*0.1);
   c.strokeStyle='#4e7d43';c.lineWidth=2;c.beginPath();c.moveTo(fx,fy);c.lineTo(fx+(r()*4-2),fy-9);c.stroke();
   jcircle(c,fx,fy-12,3.5,r,['#f28ab5','#f5d76e','#f49ac1'][i%3],'#3b3230',1.5);}
 
  /* windmill */
  const _wx=W*0.17,_wy=H*0.74;
  jpoly(c,[[_wx-15,_wy],[_wx+15,_wy],[_wx+9,_wy-48],[_wx-9,_wy-48]],r,'#efe3cb','#3b3230',2.5);
  jcircle(c,_wx,_wy-52,4,r,'#c98d5a','#3b3230',2);
  for(let i=0;i<4;i++){const _a=Math.PI/4+i*Math.PI/2;
   jline(c,_wx,_wy-52,_wx+Math.cos(_a)*27,_wy-52+Math.sin(_a)*27,r,i%2?'#b8443a':'#c9583f',4);}
  /* storybook cottage */
  const _hx=W*0.62,_hy=H*0.87;
  blockPath(c,_hx-27,_hy-25,54,25,3);c.fillStyle='#f6e7c8';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2.5;c.stroke();
  jpoly(c,[[_hx-33,_hy-25],[_hx,_hy-46],[_hx+33,_hy-25]],r,'#c9583f','#3b3230',2.5);
  blockPath(c,_hx-6,_hy-17,12,17,5);c.fillStyle='#8a5a3c';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2;c.stroke();
  jcircle(c,_hx+15,_hy-13,3.5,r,'#f2d98c','#8a5a3c',1.5);
  jline(c,_hx+19,_hy-30,_hx+19,_hy-46,r,'#a8794e',4);
  c.fillStyle='rgba(190,190,190,.6)';for(let i=0;i<3;i++)jcircle(c,_hx+20+i*5,_hy-50-i*7,3.5+i*1.5,r,null,null,0);
  /* picket fence */
  c.strokeStyle='#b0885a';c.lineWidth=2.5;c.lineCap='round';
  for(let i=0;i<8;i++){const _fx=_hx+44+i*11;c.beginPath();c.moveTo(_fx,_hy+7);c.lineTo(_fx,_hy-7);c.stroke();}
  jline(c,_hx+44,_hy-2,_hx+121,_hy-2,r,'#b0885a',2.5);jline(c,_hx+44,_hy+4,_hx+121,_hy+4,r,'#b0885a',2.5);
  /* soft rainbow + butterflies */
  c.save();c.globalAlpha=0.4;c.lineWidth=5;
  ['#e2694f','#f0a03c','#ffd94d','#7cb96a','#7fb3d5'].forEach((_cl,i)=>{c.strokeStyle=_cl;c.beginPath();c.arc(W*0.46,H*0.52,70+i*6,Math.PI*1.06,Math.PI*1.94);c.stroke();});
  c.restore();
  for(let i=0;i<3;i++){const _bx=W*(0.28+0.2*i)+r()*26,_by=H*(0.56+r()*0.1);
   c.fillStyle=['#ef7d9d','#f5d76e','#c39bd5'][i];
   c.beginPath();c.ellipse(_bx-3,_by,4.4,2.7,-0.55,0,7);c.ellipse(_bx+3,_by,4.4,2.7,0.55,0,7);c.fill();}
 }},
{id:'desert',n:'Desert',req:10,sky:'#fdeecf',ground:'#e0b96e',amb:null,
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  const sx=W*0.24,sy=H*0.17;
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;jline(c,sx+Math.cos(a)*54,sy+Math.sin(a)*54,sx+Math.cos(a)*70,sy+Math.sin(a)*70,r,'#e8933c',3);}
  jcircle(c,sx,sy,46,r,'#f6b656','#e8933c',3);
  cloud(c,W*0.7,H*0.12,26,r,'#fff6e3');
  hill(c,W,H,H*0.7,H*0.1,'#f2d7a0',r);
  hill(c,W,H,H*0.78,H*0.09,'#eac985',r);
  hill(c,W,H,H*0.86,H*0.07,'#e0ba6f',r);
  const cx=W*0.09,cy=H*0.8;
  [[cx,cy-58,22,58,3],[cx-16,cy-40,16,10,4],[cx-16,cy-52,10,22,5],[cx+22,cy-34,16,10,6],[cx+28,cy-46,10,22,7]].forEach(b=>{
   blockPath(c,b[0],b[1],b[2],b[3],b[4]);c.fillStyle='#6da85e';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2.5;c.stroke();});
  for(let i=0;i<4;i++)jcircle(c,W*(0.3+0.6*r()),H*0.93,3+r()*2,r,'#cba268','#3b3230',1.5);
 
  /* twin pyramids */
  jpoly(c,[[W*0.60,H*0.72],[W*0.74,H*0.44],[W*0.88,H*0.72]],r,'#ecd096','#b9945c',2.5);
  jline(c,W*0.74,H*0.44,W*0.80,H*0.72,r,'#c9a468',2.5);
  jpoly(c,[[W*0.78,H*0.72],[W*0.86,H*0.56],[W*0.95,H*0.72]],r,'#e2c284','#b9945c',2.5);
  /* palm oasis */
  c.beginPath();c.ellipse(W*0.38,H*0.94,46,11,0,0,7);c.fillStyle='#8fd0e0';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2;c.stroke();
  c.beginPath();c.ellipse(W*0.38,H*0.94,26,5,0,0,7);c.fillStyle='#b8e4ee';c.fill();
  const _px=W*0.31,_py=H*0.92;
  c.strokeStyle='#8a5a3c';c.lineWidth=5;c.lineCap='round';
  c.beginPath();c.moveTo(_px,_py);c.quadraticCurveTo(_px-6,_py-38,_px+4,_py-58);c.stroke();
  for(let i=0;i<5;i++){const _a=Math.PI*(0.05+0.22*i);
   c.strokeStyle='#4e7d43';c.lineWidth=3.5;c.beginPath();c.moveTo(_px+4,_py-58);
   c.quadraticCurveTo(_px+4+Math.cos(_a)*22,_py-58-Math.sin(_a)*10-8,_px+4+Math.cos(_a)*34,_py-58-Math.sin(_a)*2);c.stroke();}
  jcircle(c,_px+12,_py-6,3.5,r,'#8a5a3c','#3b3230',1.5);
  /* sun-bleached skull + vultures */
  jcircle(c,W*0.84,H*0.93,7,r,'#f4ead6','#3b3230',2);
  c.fillStyle='#3b3230';c.fillRect(W*0.83-1.5,H*0.925,2.5,2.5);c.fillRect(W*0.85,H*0.925,2.5,2.5);
  c.strokeStyle='rgba(59,50,48,.65)';c.lineWidth=2;
  for(let i=0;i<2;i++){const _vx=W*(0.5+0.16*i),_vy=H*(0.2+0.05*i);
   c.beginPath();c.moveTo(_vx-8,_vy);c.quadraticCurveTo(_vx-3,_vy-6,_vx,_vy);c.quadraticCurveTo(_vx+3,_vy-6,_vx+8,_vy);c.stroke();}
 }},
{id:'snow',n:'Snow',req:25,sky:'#e9f2f8',ground:'#eef4f8',amb:'snow',
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  jcircle(c,W*0.78,H*0.14,26,r,'#fdf6e0','#d8c9a0',2.5);
  jpoly(c,[[W*0.05,H*0.75],[W*0.3,H*0.34],[W*0.55,H*0.75]],r,'#cdd9e4','rgba(59,50,48,.35)',2.5);
  jpoly(c,[[W*0.22,H*0.42],[W*0.3,H*0.34],[W*0.38,H*0.42],[W*0.3,H*0.48]],r,'#ffffff',null,0);
  jpoly(c,[[W*0.5,H*0.78],[W*0.72,H*0.28],[W*0.95,H*0.78]],r,'#bccbd9','rgba(59,50,48,.35)',2.5);
  jpoly(c,[[W*0.63,H*0.38],[W*0.72,H*0.28],[W*0.81,H*0.38],[W*0.72,H*0.45]],r,'#ffffff',null,0);
  cloud(c,W*0.2,H*0.18,30,r,'#ffffff');
  for(let i=0;i<4;i++){const px=W*(0.12+0.76*(i/3))+r()*20-10,py=H*0.86,s=1+(i%2)*0.4;
   for(let k=0;k<3;k++){const ty=py-k*16*s,tw=(26-k*6)*s;
    jpoly(c,[[px-tw/2,ty],[px,ty-20*s],[px+tw/2,ty]],r,'#5c7d6a','#3b3230',2);}}
  for(let i=0;i<14;i++)speck(c,r()*W,r()*H,2.5,'rgba(120,140,160,.5)');
 
  /* cozy igloo with a warm glow */
  const _ix=W*0.76,_iy=H*0.9;
  c.fillStyle='#f7fbfd';c.beginPath();c.arc(_ix,_iy,32,Math.PI,0);c.closePath();c.fill();
  c.strokeStyle='#3b3230';c.lineWidth=2.5;c.stroke();
  c.strokeStyle='rgba(126,158,190,.55)';c.lineWidth=1.6;
  for(let i=1;i<3;i++){c.beginPath();c.arc(_ix,_iy+2,32-i*11,Math.PI,0);c.stroke();
   c.beginPath();c.moveTo(_ix-8+((i%2)*-14),_iy-i*9);c.lineTo(_ix-8+((i%2)*-14),_iy-i*9+9);}
  c.fillStyle='#3b3230';c.beginPath();c.arc(_ix,_iy,10,Math.PI,0);c.closePath();c.fill();
  c.fillStyle='#f2c86a';c.beginPath();c.arc(_ix,_iy,7.5,Math.PI,0);c.closePath();c.fill();
  /* snowman with scarf & top hat */
  const _mx=W*0.16,_my=H*0.92;
  jcircle(c,_mx,_my-8,13,r,'#ffffff','#3b3230',2.5);jcircle(c,_mx,_my-27,8.5,r,'#ffffff','#3b3230',2.5);
  c.fillStyle='#c9583f';c.beginPath();c.ellipse(_mx,_my-19,7,2.6,0,0,7);c.fill();
  c.fillStyle='#e8933c';c.beginPath();c.moveTo(_mx+6,_my-27);c.lineTo(_mx+14,_my-25.5);c.lineTo(_mx+6,_my-24);c.closePath();c.fill();
  c.fillStyle='#3b3230';c.beginPath();c.arc(_mx-2.5,_my-29.5,1.4,0,7);c.arc(_mx+3,_my-29.5,1.4,0,7);c.fill();
  jline(c,_mx+7,_my-26,_mx+17,_my-33,r,'#8a5a3c',2);jline(c,_mx-7,_my-25,_mx-16,_my-31,r,'#8a5a3c',2);
  /* gentle aurora ribbon — soft, hand-painted */
  c.save();c.globalAlpha=0.35;
  ['#7cb96a','#7fb3d5'].forEach((_cl,i)=>{c.strokeStyle=_cl;c.lineWidth=10-i*4;c.beginPath();
   for(let x=0;x<=6;x++)c.lineTo(W*x/6,H*(0.16+0.02*i)+Math.sin(x*1.1+i)*14);c.stroke();});
  c.restore();
 }},
{id:'jungle',n:'Jungle',req:45,sky:'#eaf3d8',ground:'#6d9c58',amb:'leafp',
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  jcircle(c,W*0.85,H*0.12,30,r,'#ffd94d','#e8a800',3);
  cloud(c,W*0.25,H*0.1,28,r,'#ffffff');
  hill(c,W,H,H*0.8,H*0.1,'#8fbb79',r);
  hill(c,W,H,H*0.87,H*0.08,'#6d9c58',r);
  const leaf=(x,y,len,ang,col,sv)=>{c.save();c.translate(x,y);c.rotate(ang);
   c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(len*0.5,-len*0.3,len,0);c.quadraticCurveTo(len*0.5,len*0.3,0,0);
   c.fillStyle=col;c.fill();c.strokeStyle='rgba(59,50,48,.4)';c.lineWidth=2;c.stroke();
   c.beginPath();c.moveTo(0,0);c.lineTo(len,0);c.stroke();
   if(sv)for(let i=1;i<4;i++){c.beginPath();c.moveTo(len*i/4,0);c.lineTo(len*i/4-6,-8);c.moveTo(len*i/4,0);c.lineTo(len*i/4-6,8);c.stroke();}
   c.restore();};
  leaf(-10,H*0.72,H*0.4,-0.5,'#4e7d43',true);leaf(-10,H*0.55,H*0.34,-0.2,'#5f9450',true);
  leaf(W+10,H*0.68,H*0.42,Math.PI+0.45,'#4e7d43',true);leaf(W+10,H*0.5,H*0.3,Math.PI+0.15,'#5f9450',true);
  for(let i=0;i<3;i++){const vx=W*(0.25+0.25*i)+r()*30;
   jline(c,vx,-5,vx+r()*30-15,H*(0.2+r()*0.2),r,'#4e7d43',3);
   for(let k=0;k<4;k++)leaf(vx+(r()*20-10),H*(0.08+k*0.05),14,r()<0.5?-0.6:0.6,'#6fa85c',false);}
 
  /* stepped jungle temple */
  const _tx=W*0.5,_ty=H*0.8;
  for(let k=0;k<4;k++){const _lw=100-k*20,_ly=_ty-k*17;
   blockPath(c,_tx-_lw/2,_ly-17,_lw,17,9+k);c.fillStyle=k%2?'#c9b8a0':'#d8c8b2';c.fill();c.strokeStyle='#6b5a48';c.lineWidth=2.2;c.stroke();}
  blockPath(c,_tx-9,_ty-12,18,12,2);c.fillStyle='#3d4a3a';c.fill();
  for(let i=0;i<2;i++){const _vx=_tx+(i?1:-1)*(30+r()*16);
   c.strokeStyle='#4e7d43';c.lineWidth=3;c.beginPath();c.moveTo(_vx,H*0.35);c.quadraticCurveTo(_vx+(r()*10-5),H*0.45,_vx+6,H*0.52);c.stroke();}
  /* waterfall cliff-side */
  const _wx=W*0.14;
  c.fillStyle='#d8ecf2';c.fillRect(_wx-9,H*0.52,18,H*0.34);
  c.strokeStyle='#9cc8d8';c.lineWidth=2;
  for(let i=0;i<3;i++)jline(c,_wx-6+i*6,H*0.53,_wx-6+i*6,H*0.84,r,'rgba(255,255,255,.85)',2);
  c.fillStyle='#bfe2ec';c.beginPath();c.ellipse(_wx,H*0.87,22,7,0,0,7);c.fill();
  /* toucan on a branch */
  const _bx=W*0.8,_by=H*0.5;
  jline(c,_bx-34,_by+12,_bx+30,_by+12,r,'#6b4a34',5);
  c.fillStyle='#2f3a4e';c.beginPath();c.ellipse(_bx,_by,12,10,0,0,7);c.fill();c.strokeStyle='#3b3230';c.lineWidth=2;c.stroke();
  c.fillStyle='#f2d98c';c.beginPath();c.ellipse(_bx-6,_by-2,4.5,5,0,0,7);c.fill();
  c.fillStyle='#e8933c';c.beginPath();c.moveTo(_bx+10,_by-4);c.quadraticCurveTo(_bx+34,_by-10,_bx+30,_by+3);c.lineTo(_bx+10,_by+4);c.closePath();c.fill();c.stroke();
  c.fillStyle='#3b3230';c.beginPath();c.arc(_bx-4,_by-4,1.6,0,7);c.fill();
 }},
{id:'night',n:'Night City',req:70,sky:'#313a5b',ground:'#2a3149',amb:'twink',
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  for(let i=0;i<26;i++){if(r()<0.5)speck(c,r()*W,r()*H*0.7,2+r()*2,'rgba(244,233,200,.8)');
   else jcircle(c,r()*W,r()*H*0.7,1.2+r(),r,'rgba(244,233,200,.8)',null,0);}
  jcircle(c,W*0.8,H*0.14,30,r,'#f4e6b8','#d8c9a0',2.5);
  jcircle(c,W*0.74,H*0.1,26,r,this.sky,null,0);
  cloud(c,W*0.25,H*0.12,30,r,'#3d476e','rgba(20,25,45,.6)');
  for(let i=0;i<7;i++){const bw=W*(0.1+r()*0.06),bx=-20+(W+40)*i/7,bh=H*(0.1+r()*0.18),by=H*0.88-bh;
   blockPath(c,bx,by,bw,bh,i*13+1);c.fillStyle='#232a45';c.fill();c.strokeStyle='#181d33';c.lineWidth=2.5;c.stroke();
   c.fillStyle='#f2d98c';
   for(let wy=by+8;wy<by+bh-8;wy+=14)for(let wx=bx+6;wx<bx+bw-8;wx+=12)if(r()>0.45)c.fillRect(wx+(r()*3),wy+(r()*3),4,5);}
  c.fillStyle='#2a3149';c.fillRect(0,H*0.88,W,H*0.12);
 
  /* clock tower landmark */
  const _cx=W*0.84,_ct=H*0.88,_ch=H*0.36;
  blockPath(c,_cx-17,_ct-_ch,34,_ch,21);c.fillStyle='#2f3758';c.fill();c.strokeStyle='#181d33';c.lineWidth=2.5;c.stroke();
  jpoly(c,[[_cx-21,_ct-_ch],[_cx,_ct-_ch-20],[_cx+21,_ct-_ch]],r,'#c9583f','#181d33',2.5);
  jcircle(c,_cx,_ct-_ch+15,9.5,r,'#f4e6b8','#181d33',2.5);
  c.strokeStyle='#3b3230';c.lineWidth=2;c.beginPath();c.moveTo(_cx,_ct-_ch+15);c.lineTo(_cx,_ct-_ch+8.5);
  c.moveTo(_cx,_ct-_ch+15);c.lineTo(_cx+5,_ct-_ch+17);c.stroke();
  /* street lamps with warm halos */
  for(let i=0;i<3;i++){const _lx2=W*(0.18+0.3*i),_ly2=H*0.9;
   jline(c,_lx2,_ly2,_lx2,_ly2-34,r,'#181d33',3.5);
   c.save();c.globalAlpha=0.22;c.fillStyle='#f2d98c';c.beginPath();c.arc(_lx2,_ly2-38,14,0,7);c.fill();c.restore();
   jcircle(c,_lx2,_ly2-38,5,r,'#f6dd96','#181d33',2);}
  /* water tower on the far roof */
  const _wtx=W*0.06;
  blockPath(c,_wtx-16,H*0.52,32,22,31);c.fillStyle='#232a45';c.fill();c.strokeStyle='#181d33';c.lineWidth=2;c.stroke();
  c.beginPath();c.moveTo(_wtx-12,H*0.52+22);c.lineTo(_wtx-16,H*0.88);c.moveTo(_wtx+12,H*0.52+22);c.lineTo(_wtx+16,H*0.88);c.stroke();
 }},
{id:'sky',n:'Sky',req:100,sky:'#d6ebfa',ground:'#ffffff',amb:'cloudp',
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  const sx=W*0.16,sy=H*0.14;
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;jline(c,sx+Math.cos(a)*40,sy+Math.sin(a)*40,sx+Math.cos(a)*54,sy+Math.sin(a)*54,r,'#e8a800',3);}
  jcircle(c,sx,sy,32,r,'#ffd94d','#e8a800',3);
  cloud(c,W*0.5,H*0.2,30,r);cloud(c,W*0.78,H*0.34,22,r);cloud(c,W*0.3,H*0.45,18,r);
  cloud(c,W*0.65,H*0.6,26,r);cloud(c,W*0.12,H*0.66,20,r);cloud(c,W*0.88,H*0.72,24,r);
  c.strokeStyle='#3b3230';c.lineWidth=2;
  for(let i=0;i<3;i++){const bx=W*(0.4+0.18*i),by=H*(0.3+0.07*i);
   c.beginPath();c.moveTo(bx-8,by);c.quadraticCurveTo(bx-3,by-6,bx,by);c.quadraticCurveTo(bx+3,by-6,bx+8,by);c.stroke();}
  const ax=W*0.88,ay=H*0.52;
  jcircle(c,ax,ay,20,r,'#e2694f','#3b3230',2.5);
  jline(c,ax-12,ay+16,ax-6,ay+30,r,'#3b3230',2);jline(c,ax+12,ay+16,ax+6,ay+30,r,'#3b3230',2);
  blockPath(c,ax-7,ay+30,14,10,9);c.fillStyle='#c98d5a';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2;c.stroke();
 
  /* hot-air balloon */
  const _bx=W*0.24,_by=H*0.34;
  c.beginPath();c.moveTo(_bx-16,_by+12);c.quadraticCurveTo(_bx-26,_by-18,_bx,_by-34);
  c.quadraticCurveTo(_bx+26,_by-18,_bx+16,_by+12);c.closePath();
  c.fillStyle='#e2694f';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2.5;c.stroke();
  c.save();c.clip();c.fillStyle='#f6dd96';c.fillRect(_bx-6,_by-40,12,54);
  c.fillStyle='#7fb3d5';c.fillRect(_bx-18,_by-40,7,54);c.fillRect(_bx+11,_by-40,7,54);c.restore();
  jline(c,_bx-12,_by+12,_bx-7,_by+24,r,'#3b3230',1.6);jline(c,_bx+12,_by+12,_bx+7,_by+24,r,'#3b3230',1.6);
  blockPath(c,_bx-8,_by+24,16,11,17);c.fillStyle='#c98d5a';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2;c.stroke();
  /* floating island with a trickling fall */
  const _ix=W*0.78,_iy=H*0.6;
  jpoly(c,[[_ix-34,_iy],[_ix+34,_iy],[_ix+18,_iy+20],[_ix-20,_iy+22]],r,'#a8794e','#3b3230',2.5);
  c.fillStyle='#8fbb79';c.beginPath();c.ellipse(_ix,_iy-2,36,10,0,0,7);c.fill();c.strokeStyle='#3b3230';c.lineWidth=2.5;c.stroke();
  jline(c,_ix,_iy+12,_ix,_iy+22,r,'#4e7d43',2);jcircle(c,_ix-8,_iy+2,3.5,r,'#5f9450',null,0);
  c.fillStyle='rgba(150,210,235,.85)';c.beginPath();c.moveTo(_ix+10,_iy+8);c.lineTo(_ix+14,_iy+8);c.lineTo(_ix+13,_iy+26);c.lineTo(_ix+11,_iy+26);c.closePath();c.fill();
  /* kite with tail */
  const _kx=W*0.55,_ky=H*0.18;
  c.save();c.translate(_kx,_ky);c.rotate(0.4);
  c.fillStyle='#f5d76e';c.beginPath();c.moveTo(0,-12);c.lineTo(9,0);c.lineTo(0,12);c.lineTo(-9,0);c.closePath();c.fill();c.strokeStyle='#3b3230';c.lineWidth=2;c.stroke();
  c.strokeStyle='rgba(59,50,48,.6)';c.lineWidth=1.5;c.beginPath();c.moveTo(0,12);c.quadraticCurveTo(8,26,-2,36);c.stroke();c.restore();
 }},
{id:'sunset',n:'Sunset',req:115,sky:'#fbd9a0',ground:'#c98d5a',amb:'petal',
 draw(c,W,H,r){
  c.fillStyle='#fbd9a0';c.fillRect(0,0,W,H);
  c.fillStyle='#f8c88c';c.fillRect(0,H*0.28,W,H*0.72);
  c.fillStyle='#f4b076';c.fillRect(0,H*0.5,W,H*0.5);
  const sx=W*0.5,sy=H*0.62;
  jcircle(c,sx,sy,52,r,'#ffdf8e','#e8933c',3);
  c.fillStyle='#f4b076';c.fillRect(sx-70,sy,W?70*2:140,60);
  for(let i=0;i<4;i++)jline(c,W*0.1+i*W*0.22,H*0.66+r()*8,W*0.2+i*W*0.22,H*0.66+r()*8,r,'rgba(255,223,142,.8)',4);
  c.fillStyle='#d98a6a';c.fillRect(0,H*0.72,W,H*0.28);
  for(let i=0;i<6;i++)jline(c,r()*W*0.8,H*(0.76+r()*0.16),r()*W*0.8+W*0.2,H*(0.76+r()*0.16),r,'rgba(255,214,170,.55)',3);
  const px=W*0.12,py=H*0.72;
  c.strokeStyle='#5a4a42';c.lineWidth=6;c.lineCap='round';
  c.beginPath();c.moveTo(px,py);c.quadraticCurveTo(px+8,py-46,px+2,py-78);c.stroke();
  for(let i=0;i<5;i++){const a=-0.5-i*0.5;
   c.beginPath();c.moveTo(px+2,py-78);c.quadraticCurveTo(px+2+Math.cos(a)*30,py-78+Math.sin(a)*16-14,px+2+Math.cos(a)*48,py-78+Math.sin(a)*26);
   c.strokeStyle='#5a4a42';c.lineWidth=4;c.stroke();}
  c.strokeStyle='#5a4a42';c.lineWidth=2.4;
  for(let i=0;i<4;i++){const bx=W*(0.55+r()*0.35),by=H*(0.12+r()*0.2);
   c.beginPath();c.moveTo(bx-7,by);c.quadraticCurveTo(bx-2,by-5,bx,by);c.quadraticCurveTo(bx+2,by-5,bx+7,by);c.stroke();}
 
  /* striped lighthouse on the point */
  const _lx=W*0.86,_lb=H*0.72;
  jpoly(c,[[_lx-13,_lb],[_lx+13,_lb],[_lx+9,_lb-64],[_lx-9,_lb-64]],r,'#f7f1e4','#3b3230',2.5);
  c.save();c.beginPath();c.moveTo(_lx-13,_lb);c.lineTo(_lx+13,_lb);c.lineTo(_lx+9,_lb-64);c.lineTo(_lx-9,_lb-64);c.closePath();c.clip();
  c.fillStyle='#c9583f';for(let i=0;i<4;i++)c.fillRect(_lx-14,_lb-14-i*18,28,9);c.restore();
  blockPath(c,_lx-10,_lb-76,20,13,41);c.fillStyle='#3b3230';c.fill();
  c.fillStyle='#f6dd96';c.fillRect(_lx-7,_lb-73,14,8);
  c.save();c.globalAlpha=0.4;c.fillStyle='#f6dd96';
  c.beginPath();c.moveTo(_lx,_lb-69);c.lineTo(_lx-46,_lb-84);c.lineTo(_lx-46,_lb-54);c.closePath();
  c.moveTo(_lx,_lb-69);c.lineTo(_lx+42,_lb-80);c.lineTo(_lx+42,_lb-56);c.closePath();c.fill();c.restore();
  /* little sailboat on the gold sea */
  const _sx2=W*0.32,_sy2=H*0.79;
  jpoly(c,[[_sx2-14,_sy2],[_sx2+14,_sy2],[_sx2+8,_sy2+8],[_sx2-8,_sy2+8]],r,'#5a4a42','#3b3230',2);
  jline(c,_sx2,_sy2,_sx2,_sy2-22,r,'#3b3230',2);
  c.fillStyle='#fdf3dd';c.beginPath();c.moveTo(_sx2-1,_sy2-22);c.lineTo(_sx2+13,_sy2-3);c.lineTo(_sx2-1,_sy2-3);c.closePath();c.fill();c.strokeStyle='#3b3230';c.lineWidth=2;c.stroke();
  c.fillStyle='rgba(255,223,142,.5)';for(let i=0;i<5;i++)c.fillRect(_sx2-10+i*5,_sy2+11+(i%2)*3,4,2);
 }},
{id:'volcano',n:'Volcano',req:140,sky:'#4a2f33',ground:'#5a4040',amb:'ember',
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  jcircle(c,W*0.2,H*0.13,24,r,'#f0a03c','#c9583f',2.5);
  cloud(c,W*0.6,H*0.12,28,r,'#6b4a4a','rgba(30,18,18,.5)');
  cloud(c,W*0.3,H*0.22,20,r,'#5d4141','rgba(30,18,18,.4)');
  jpoly(c,[[W*0.1,H*0.92],[W*0.42,H*0.34],[W*0.58,H*0.34],[W*0.9,H*0.92]],r,'#3a2d2c','#241a19',3);
  c.strokeStyle='#f08c3c';c.lineWidth=5;c.lineCap='round';
  c.beginPath();c.moveTo(W*0.42,H*0.36);c.quadraticCurveTo(W*0.5,H*0.3,W*0.58,H*0.36);c.stroke();
  jline(c,W*0.47,H*0.37,W*0.45,H*0.62,r,'#f08c3c',5);
  jline(c,W*0.53,H*0.37,W*0.56,H*0.7,r,'#f0a03c',4);
  for(let i=0;i<8;i++)jcircle(c,W*0.42+r()*W*0.16,H*(0.32-r()*0.12),2+r()*2,r,i%2?'#f08c3c':'#f0a03c',null,0);
 
  /* drifting smoke plumes over the crater */
  for(let i=0;i<4;i++){const _sy2=H*(0.3-i*0.055),_sx2=W*0.5+Math.sin(i*1.7)*26;
   c.fillStyle='rgba(120,100,100,'+(0.4-i*0.08)+')';
   c.beginPath();c.arc(_sx2,_sy2,12+i*6,0,7);c.arc(_sx2+16,_sy2-6,9+i*4,0,7);c.fill();}
  /* lava lake at the foot with glow */
  c.save();c.globalAlpha=0.85;
  const _gx=W*0.2;
  c.fillStyle='#c9583f';c.beginPath();c.ellipse(_gx,H*0.93,44,10,0,0,7);c.fill();
  c.fillStyle='#f0a03c';c.beginPath();c.ellipse(_gx-6,H*0.925,26,5,0,0,7);c.fill();
  c.restore();
  for(let i=0;i<3;i++)jcircle(c,_gx-20+i*20,H*0.9-4-r()*6,2.5+i*0.6,r,'#f6dd96',null,0);
  /* basalt columns */
  for(let i=0;i<3;i++){const _bx=W*0.88+i*16-16,_bh=26+i*9;
   blockPath(c,_bx,H*0.9-_bh,12,_bh,51+i);c.fillStyle='#2f2624';c.fill();c.strokeStyle='#1c1514';c.lineWidth=2;c.stroke();}
  /* little bone for scale */
  jline(c,W*0.62,H*0.945,W*0.67,H*0.94,r,'#e8dcc8',3);
 }},
{id:'candy',n:'Candy Land',req:175,sky:'#fbe3ec',ground:'#f4b6c2',amb:'twink',
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  cloud(c,W*0.2,H*0.12,28,r,'#fff5fa','rgba(200,120,160,.4)');
  cloud(c,W*0.7,H*0.2,22,r,'#fff5fa','rgba(200,120,160,.4)');
  hill(c,W,H,H*0.76,H*0.14,'#f9cbd8',r);
  hill(c,W,H,H*0.84,H*0.1,'#f4b6c2',r);
  const lolli=(x,y,s,cols)=>{jline(c,x,y,x,y+s*1.5,r,'#c98d5a',4);
   jcircle(c,x,y,s,r,cols[0],'#3b3230',2.5);
   c.strokeStyle=cols[1];c.lineWidth=3;
   for(let k=1;k<4;k++){c.beginPath();c.arc(x,y,s*k/4,0.4*k,0.4*k+4);c.stroke();}};
  lolli(W*0.14,H*0.56,26,['#ffd6e4','#ef7d9d']);
  lolli(W*0.86,H*0.5,32,['#d8f4d0','#7cb96a']);
  lolli(W*0.7,H*0.62,20,['#fff2c4','#f0a03c']);
  const cane=(x,y,h)=>{c.lineCap='round';
   c.strokeStyle='#ffffff';c.lineWidth=11;c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+12);c.arc(x+9,y+12,9,Math.PI,0);c.stroke();
   c.strokeStyle='#e2694f';c.lineWidth=11;c.setLineDash([7,9]);c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+12);c.arc(x+9,y+12,9,Math.PI,0);c.stroke();c.setLineDash([]);
   c.strokeStyle='#3b3230';c.lineWidth=2;};
  cane(W*0.3,H*0.62,44);cane(W*0.52,H*0.66,36);
  c.fillStyle='#f4b6c2';c.fillRect(0,H*0.88,W,H*0.12);
  for(let i=0;i<10;i++){const gx=r()*W,gy=H*(0.89+r()*0.08);
   jcircle(c,gx,gy,3.5+r()*2,r,['#7cb96a','#f0a03c','#c39bd5','#7fb3d5'][i%4],'#3b3230',1.5);}
 
  /* cupcake cottage */
  const _cx=W*0.24,_cy=H*0.66;
  jpoly(c,[[_cx-24,_cy+26],[_cx+24,_cy+26],[_cx+17,_cy-2],[_cx-17,_cy-2]],r,'#e2a45c','#3b3230',2.5);
  c.strokeStyle='rgba(59,50,48,.3)';c.lineWidth=1.6;
  for(let i=0;i<4;i++)jline(c,_cx-16+i*10,_cy-1,_cx-14+i*9,_cy+25,r,'rgba(59,50,48,.3)',1.6);
  c.fillStyle='#f9dce8';c.beginPath();c.arc(_cx,_cy-6,20,Math.PI*0.05,Math.PI*0.95,true);
  c.arc(_cx-13,_cy-2,7,Math.PI*0.9,Math.PI*0.1,true);c.arc(_cx+13,_cy-2,7,Math.PI*0.9,Math.PI*0.1,true);c.closePath();c.fill();
  c.strokeStyle='#3b3230';c.lineWidth=2.5;c.stroke();
  jcircle(c,_cx,_cy-24,5,r,'#e2694f','#3b3230',2);
  blockPath(c,_cx-5,_cy+10,10,16,61);c.fillStyle='#fff6e8';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2;c.stroke();
  /* donut pond + gumdrop bushes */
  c.beginPath();c.ellipse(W*0.72,H*0.92,30,12,0,0,7);c.fillStyle='#e8b47c';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2.5;c.stroke();
  c.beginPath();c.ellipse(W*0.72,H*0.915,26,9,0,0,7);c.fillStyle='#f48fb1';c.fill();
  c.beginPath();c.ellipse(W*0.72,H*0.915,8,3.4,0,0,7);c.fillStyle='#fbe3ec';c.fill();c.stroke();
  for(let i=0;i<7;i++){const _gx=W*(0.36+0.06*i)+r()*8,_gy=H*(0.87+0.02*(i%2));
   jcircle(c,_gx,_gy,8+(i%3)*2,r,['#c39bd5','#7fb3d5','#8fd0a2','#f5b8c8'][i%4],'#3b3230',2);
   c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(_gx-2,_gy-4,1.3,0,7);c.fill();}
 }},
{id:'space',n:'Space',req:200,sky:'#191c30',ground:'#3a3d5c',amb:'twink',
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  for(let i=0;i<34;i++){if(r()<0.6)speck(c,r()*W,r()*H,1.5+r()*2.5,'rgba(230,235,255,.85)');
   else jcircle(c,r()*W,r()*H,0.8+r()*1.4,r,'rgba(230,235,255,.7)',null,0);}
  const px=W*0.76,py=H*0.2;
  jcircle(c,px,py,34,r,'#e2a45c','#3b3230',2.5);
  jcircle(c,px-10,py-6,6,r,'#c9853f',null,0);jcircle(c,px+8,py+9,4.5,r,'#c9853f',null,0);jcircle(c,px+13,py-10,3,r,'#c9853f',null,0);
  c.strokeStyle='#c9b8a0';c.lineWidth=3.5;c.beginPath();c.ellipse(px,py,52,13,-0.3,0,Math.PI*2);c.stroke();
  jcircle(c,W*0.14,H*0.42,16,r,'#9a86c9','#3b3230',2.5);
  jline(c,W*0.3,H*0.14,W*0.44,H*0.22,r,'rgba(190,220,255,.7)',3);
  jcircle(c,W*0.45,H*0.225,4,r,'#e8f2ff',null,0);
 
  /* friendly UFO with a tractor beam */
  const _ux=W*0.28,_uy=H*0.3;
  c.save();c.globalAlpha=0.28;c.fillStyle='#8fd0e0';
  c.beginPath();c.moveTo(_ux-9,_uy+5);c.lineTo(_ux+9,_uy+5);c.lineTo(_ux+22,_uy+46);c.lineTo(_ux-22,_uy+46);c.closePath();c.fill();c.restore();
  c.fillStyle='#9a86c9';c.beginPath();c.ellipse(_ux,_uy-4,13,9,0,Math.PI,0);c.fill();c.strokeStyle='#3b3230';c.lineWidth=2.5;c.stroke();
  c.fillStyle='#cfd6e8';c.beginPath();c.ellipse(_ux,_uy-10,6,5,0,Math.PI,0);c.fill();c.stroke();
  c.fillStyle='#7c86b8';c.beginPath();c.ellipse(_ux,_uy+2,26,8.5,0,0,7);c.fill();c.stroke();
  for(let i=-1;i<2;i++)jcircle(c,_ux+i*13,_uy+5,2.6,r,'#f6dd96',null,0);
  /* crater moon peeking bottom-right */
  c.save();c.globalAlpha=0.9;
  jcircle(c,W*0.9,H*0.96,46,r,'#cfd6e8','#3b3230',3);
  c.fillStyle='#aab3cc';for(let i=0;i<5;i++)jcircle(c,W*0.9-24+i*13,H*0.92+(i%2)*10,4+(i%3),r,null,null,0);
  c.restore();
  /* shooting star + nebula blush */
  jline(c,W*0.52,H*0.1,W*0.66,H*0.16,r,'rgba(230,235,255,.9)',3);
  jcircle(c,W*0.665,H*0.162,3,r,'#ffffff',null,0);
  c.save();c.globalAlpha=0.14;c.fillStyle='#c39bd5';
  c.beginPath();c.ellipse(W*0.2,H*0.7,60,26,-0.4,0,7);c.fill();
  c.fillStyle='#7fb3d5';c.beginPath();c.ellipse(W*0.8,H*0.52,48,20,0.5,0,7);c.fill();c.restore();
 }},
{id:'sea',n:'Under the Sea',req:240,sky:'#a8d8e2',ground:'#e6d8a8',amb:'bubble',
 draw(c,W,H,r){
  c.fillStyle=this.sky;c.fillRect(0,0,W,H);
  c.fillStyle='#8fc9d8';c.fillRect(0,H*0.4,W,H*0.6);
  c.save();c.globalAlpha=0.35;c.fillStyle='#ffffff';
  for(let i=0;i<3;i++){const rx=W*(0.15+0.3*i);
   c.beginPath();c.moveTo(rx,0);c.lineTo(rx+40,0);c.lineTo(rx-30,H*0.8);c.lineTo(rx-70,H*0.8);c.closePath();c.fill();}
  c.restore();
  const fish=(x,y,s,col)=>{c.fillStyle=col;
   c.beginPath();c.ellipse(x,y,s,s*0.55,0,0,7);c.fill();
   c.beginPath();c.moveTo(x+s*0.9,y);c.lineTo(x+s*1.5,y-s*0.5);c.lineTo(x+s*1.5,y+s*0.5);c.closePath();c.fill();
   c.strokeStyle='#3b3230';c.lineWidth=2;c.beginPath();c.ellipse(x,y,s,s*0.55,0,0,7);c.stroke();
   c.fillStyle='#3b3230';c.beginPath();c.arc(x-s*0.45,y-s*0.1,1.8,0,7);c.fill();};
  fish(W*0.2,H*0.3,16,'#e2694f');fish(W*0.72,H*0.44,13,'#f0a03c');fish(W*0.4,H*0.62,18,'#ef7d9d');fish(W*0.85,H*0.24,10,'#7cb96a');
  for(let i=0;i<4;i++){const wx=W*(0.08+0.26*i)+r()*20,wh=40+r()*40;
   c.strokeStyle=i%2?'#4e7d43':'#6fa85c';c.lineWidth=4;c.lineCap='round';
   c.beginPath();c.moveTo(wx,H*0.96);
   c.bezierCurveTo(wx-12,H*0.96-wh*0.4,wx+12,H*0.96-wh*0.6,wx-6,H*0.96-wh);c.stroke();}
  c.fillStyle='#e6d8a8';c.fillRect(0,H*0.92,W,H*0.08);
  for(let i=0;i<3;i++){const sx=W*(0.2+0.3*i),sy=H*0.95;
   c.strokeStyle='#b9a06a';c.lineWidth=2;
   c.beginPath();c.arc(sx,sy,7,Math.PI,0);c.stroke();
   for(let k=-1;k<2;k++){c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+k*5,sy-7);c.stroke();}}
 
  /* sunken galleon */
  const _sx=W*0.82,_sy=H*0.88;
  c.strokeStyle='#6b4a34';c.lineWidth=5;c.lineCap='round';
  c.beginPath();c.moveTo(_sx,_sy);c.lineTo(_sx+4,_sy-46);c.stroke();
  jline(c,_sx-10,_sy-38,_sx+20,_sy-32,r,'rgba(107,74,52,.8)',3);
  c.fillStyle='rgba(230,220,190,.5)';c.beginPath();c.moveTo(_sx+4,_sy-46);c.quadraticCurveTo(_sx+26,_sy-38,_sx+4,_sy-18);c.closePath();c.fill();
  c.strokeStyle='#6b4a34';c.lineWidth=2;c.beginPath();c.moveTo(_sx-38,_sy);c.quadraticCurveTo(_sx,_sy+22,_sx+40,_sy-2);c.quadraticCurveTo(_sx+30,_sy-14,_sx-38,_sy);c.stroke();
  c.fillStyle='#4a3527';c.fill();
  /* jellyfish drifting */
  const _jx=W*0.55,_jy=H*0.42+Math.sin(Date.now()*0.001)*3;
  c.fillStyle='rgba(195,155,213,.8)';c.beginPath();c.arc(_jx,_jy,13,Math.PI,0);c.quadraticCurveTo(_jx+8,_jy+7,_jx,_jy+6);c.quadraticCurveTo(_jx-8,_jy+7,_jx-13,_jy);c.fill();
  c.strokeStyle='rgba(150,110,180,.75)';c.lineWidth=2;
  for(let i=-2;i<3;i++){c.beginPath();c.moveTo(_jx+i*5,_jy+6);c.quadraticCurveTo(_jx+i*5+4,_jy+16,_jx+i*5,_jy+26);c.stroke();}
  /* coral fan + anemone + treasure */
  c.strokeStyle='#e2694f';c.lineWidth=4;c.lineCap='round';
  for(let i=0;i<4;i++){const _a2=Math.PI*1.15+i*0.28;
   c.beginPath();c.moveTo(W*0.32,H*0.95);c.quadraticCurveTo(W*0.32+Math.cos(_a2)*20,H*0.95+Math.sin(_a2)*18,W*0.32+Math.cos(_a2)*26,H*0.95+Math.sin(_a2)*30);c.stroke();}
  c.fillStyle='#f0a03c';c.beginPath();c.arc(W*0.62,H*0.96,9,Math.PI,0);c.fill();
  for(let i=0;i<5;i++){c.fillStyle='#f6c177';c.fillRect(W*0.62-8+i*4,H*0.96-8-r()*4,2.6,5);}
  blockPath(c,W*0.11-2,H*0.9,26,14,77);c.fillStyle='#8a5a3c';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2;c.stroke();
  c.fillStyle='#f6d76a';c.fillRect(W*0.11+3,H*0.9-4,16,4);
  for(let i=0;i<6;i++){const _fx=W*(0.15+r()*0.7),_fy=H*(0.2+r()*0.55);
   jcircle(c,_fx,_fy,3,r,'#f2d98c','#3b3230',1.2);}
 
 }},
];
function WORLD(){return WORLDS.find(w=>w.id===SV.world)||WORLDS[0];}
function unlockedWorlds(){return WORLDS.filter(w=>SV.bestH>=w.req);}

/* ================= COSMETICS CATALOG =================
   q: rarity 0=Common 1=Rare 2=Epic 3=Legendary | p:-1 = gift-only */
const RAR=['COMMON','RARE','EPIC','LEGENDARY'];
const SKINS=[
{id:'wood',n:'Wooden Plank',p:0,q:0,c:'#cf9455',d:(c,x,y,w,h,r)=>{c.strokeStyle='rgba(122,79,40,.5)';c.lineWidth=1.5;
 for(let i=0;i<3;i++){const yy=y+h*(0.22+i*0.28)+(r()*3-1.5);c.beginPath();c.moveTo(x+3,yy);
  for(let px=x+8;px<x+w;px+=10)c.lineTo(px,yy+Math.sin(px*0.07+i*2)*1.8);c.stroke();}
 if(w>60)jcircle(c,x+w*0.72,y+h*0.5,3.5,r,'rgba(122,79,40,.45)',null,0);}},
{id:'brick',n:'Pencil Brick',p:150,q:0,c:'#e9e2d2',d:(c,x,y,w,h,r)=>{c.strokeStyle='rgba(59,50,48,.55)';c.lineWidth=2;
 c.beginPath();c.moveTo(x+3,y+h/2+(r()*2-1));c.lineTo(x+w-3,y+h/2+(r()*2-1));c.stroke();
 const mid=x+w*(0.35+r()*0.3);
 c.beginPath();c.moveTo(mid,y+3);c.lineTo(mid,y+h/2);c.moveTo(mid+w*0.3,y+h/2);c.lineTo(mid+w*0.3,y+h-3);c.stroke();
 c.strokeStyle='rgba(201,88,63,.35)';c.lineWidth=1.2;
 for(let i=0;i<6;i++){const hx=x+4+r()*Math.max(4,w-14);c.beginPath();c.moveTo(hx,y+2);c.lineTo(hx+5,y+h-2);c.stroke();}}},
{id:'candy',n:'Candy Block',p:250,q:0,c:'#f7a8c4',d:(c,x,y,w,h)=>{c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
 c.fillStyle='rgba(255,255,255,.75)';const s=14;
 for(let i=-1;i<w/s+2;i++){c.beginPath();c.moveTo(x+i*s,y+h+2);c.lineTo(x+i*s+h+4,y-2);c.lineTo(x+i*s+h+10,y-2);c.lineTo(x+i*s+6,y+h+2);c.closePath();c.fill();}c.restore();}},
{id:'stone',n:'Stone Block',p:200,q:0,c:'#a8a49b',d:(c,x,y,w,h,r)=>{c.strokeStyle='rgba(59,50,48,.4)';c.lineWidth=1.6;
 for(let i=0;i<2;i++){let cx=x+10+r()*Math.max(4,w-20),cy=y+4+r()*(h-8);c.beginPath();c.moveTo(cx,cy);
  for(let k=0;k<3;k++){cx+=6+r()*10-5;cy+=r()*8-4;c.lineTo(clamp(cx,x+2,x+w-2),clamp(cy,y+2,y+h-2));}c.stroke();}
 c.fillStyle='rgba(59,50,48,.08)';c.fillRect(x,y,w,h*0.25);}},
{id:'leaf',n:'Leaf Block',p:300,q:0,c:'#7cb96a',d:(c,x,y,w,h)=>{c.strokeStyle='rgba(46,92,40,.55)';c.lineWidth=2;
 c.beginPath();c.moveTo(x+3,y+h/2);c.lineTo(x+w-3,y+h/2);c.stroke();
 for(let i=1;i<5;i++){const vx=x+w*i/5;c.beginPath();c.moveTo(vx,y+h/2);c.lineTo(vx-5,y+4);c.moveTo(vx,y+h/2);c.lineTo(vx-5,y+h-4);c.stroke();}}},
{id:'cookie',n:'Cookie Block',p:280,q:0,c:'#d9a86a',d:(c,x,y,w,h,r)=>{c.fillStyle='#6b4423';
 const n=Math.max(4,Math.floor(w/18));
 for(let i=0;i<n;i++)jcircle(c,x+6+r()*Math.max(4,w-12),y+4+r()*(h-8),2.2+r()*1.6,r,'#6b4423',null,0);}},
{id:'denim',n:'Denim Block',p:300,q:1,c:'#7f9dc4',d:(c,x,y,w,h)=>{c.strokeStyle='rgba(255,255,255,.65)';c.lineWidth=1.6;c.setLineDash([4,3]);
 c.beginPath();c.moveTo(x+4,y+5);c.lineTo(x+w-4,y+5);c.moveTo(x+4,y+h-5);c.lineTo(x+w-4,y+h-5);c.stroke();c.setLineDash([]);
 c.strokeStyle='rgba(40,60,100,.3)';c.lineWidth=1;
 for(let ix=x+8;ix<x+w-4;ix+=7){c.beginPath();c.moveTo(ix,y+8);c.lineTo(ix-3,y+h-8);c.stroke();}}},
{id:'melon',n:'Watermelon Block',p:320,q:1,c:'#8fce6f',d:(c,x,y,w,h,r)=>{c.strokeStyle='#3f7d3a';c.lineWidth=3.5;c.lineCap='round';
 const n=Math.max(2,Math.floor(w/26));
 for(let i=0;i<n;i++){const sx=x+8+(w-16)*(i/(n-1||1));
  c.beginPath();c.moveTo(sx,y+3);c.quadraticCurveTo(sx+4,y+h/2,sx,y+h-3);c.stroke();}}},
{id:'ice',n:'Ice Block',p:350,q:1,c:'#bfe3ef',d:(c,x,y,w,h,r)=>{c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=3;
 c.beginPath();c.moveTo(x+w*0.15,y+h*0.75);c.lineTo(x+w*0.3,y+h*0.25);c.stroke();
 c.lineWidth=1.5;const fx=x+w*0.7,fy=y+h*0.5;
 for(let i=0;i<3;i++){const a=i*Math.PI/3;c.beginPath();c.moveTo(fx-Math.cos(a)*6,fy-Math.sin(a)*6);c.lineTo(fx+Math.cos(a)*6,fy+Math.sin(a)*6);c.stroke();}}},
{id:'cactus',n:'Cactus Block',p:340,q:1,c:'#6da85e',d:(c,x,y,w,h,r)=>{c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=1.6;c.lineCap='round';
 for(let i=0;i<Math.max(4,Math.floor(w/14));i++){const px=x+4+r()*Math.max(4,w-8),py=y+3+r()*(h-6);
  c.beginPath();c.moveTo(px-2,py-2);c.lineTo(px+2,py+2);c.stroke();}
 c.strokeStyle='rgba(46,92,40,.5)';c.lineWidth=2;
 c.beginPath();c.moveTo(x+3,y+h/2);c.lineTo(x+w-3,y+h/2);c.stroke();}},
{id:'waffle',n:'Waffle Block',p:360,q:1,c:'#e8b96a',d:(c,x,y,w,h)=>{c.strokeStyle='rgba(122,79,40,.55)';c.lineWidth=2;
 for(let ix=x+8;ix<x+w-4;ix+=12){c.beginPath();c.moveTo(ix,y+3);c.lineTo(ix,y+h-3);c.stroke();}
 for(let iy=y+8;iy<y+h-3;iy+=11){c.beginPath();c.moveTo(x+3,iy);c.lineTo(x+w-3,iy);c.stroke();}
 c.fillStyle='rgba(255,220,120,.8)';c.fillRect(x+w*0.3,y+h*0.3,8,8);}},
{id:'choco',n:'Chocolate Block',p:400,q:1,c:'#8a5a3b',d:(c,x,y,w,h)=>{c.strokeStyle='rgba(50,28,14,.5)';c.lineWidth=2;
 const n=Math.max(2,Math.floor(w/34));
 for(let i=1;i<n;i++){c.beginPath();c.moveTo(x+w*i/n,y+2);c.lineTo(x+w*i/n,y+h-2);c.stroke();}
 c.beginPath();c.moveTo(x+2,y+h/2);c.lineTo(x+w-2,y+h/2);c.stroke();
 c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=3;c.beginPath();c.moveTo(x+6,y+5);c.lineTo(x+w*0.4,y+5);c.stroke();}},
{id:'mush',n:'Mushroom Block',p:450,q:1,c:'#d95f4c',d:(c,x,y,w,h,r)=>{const n=Math.max(2,Math.floor(w/28));
 for(let i=0;i<n;i++)jcircle(c,x+8+r()*Math.max(4,w-16),y+3+r()*(h-6),2.5+r()*2,r,'rgba(255,248,240,.9)','rgba(120,30,20,.3)',1.4);}},
{id:'lava',n:'Lava Block',p:480,q:2,c:'#5a3a34',d:(c,x,y,w,h,r)=>{c.strokeStyle='#f08c3c';c.lineWidth=2.4;c.lineCap='round';
 for(let i=0;i<3;i++){let px=x+6+r()*Math.max(4,w-12),py=y+3;
  c.beginPath();c.moveTo(px,py);
  for(let k=0;k<3;k++){px+=r()*14-7;py+=(h-6)/3;c.lineTo(clamp(px,x+3,x+w-3),py);}c.stroke();}
 c.fillStyle='#f0a03c';jcircle(c,x+w*0.78,y+h*0.4,3,r,'#f0a03c',null,0);}},
{id:'cloudb',n:'Cloud Block',p:500,q:1,c:'#f4f7fa',d:(c,x,y,w,h,r)=>{c.strokeStyle='rgba(120,140,160,.5)';c.lineWidth=2;
 const n=Math.max(2,Math.floor(w/30));
 for(let i=0;i<n;i++){const bx=x+(i+0.5)*w/n;c.beginPath();c.arc(bx,y+2,6+r()*3,Math.PI,0);c.stroke();}}},
{id:'pearl',n:'Pearl Block',p:520,q:2,c:'#f2dde4',d:(c,x,y,w,h,r)=>{c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=2.6;
 c.beginPath();c.arc(x+w*0.24,y+h*0.42,6,Math.PI*0.9,Math.PI*1.6);c.stroke();
 c.fillStyle='rgba(190,160,200,.35)';
 for(let i=0;i<3;i++)jcircle(c,x+10+r()*Math.max(4,w-20),y+4+r()*(h-8),3+r()*2,r,'rgba(190,160,200,.3)',null,0);}},
{id:'note',n:'Notebook Block',p:550,q:1,c:'#fdfbef',d:(c,x,y,w,h)=>{c.strokeStyle='rgba(90,130,180,.55)';c.lineWidth=1.4;
 for(let i=1;i<3;i++){c.beginPath();c.moveTo(x+3,y+h*i/3);c.lineTo(x+w-3,y+h*i/3);c.stroke();}
 c.strokeStyle='rgba(201,88,63,.5)';c.lineWidth=2;c.beginPath();c.moveTo(x+w*0.18,y+2);c.lineTo(x+w*0.18,y+h-2);c.stroke();}},
{id:'starb',n:'Star Block',p:600,q:2,c:'#4b5a8f',d:(c,x,y,w,h,r)=>{c.fillStyle='#f4e2a0';
 const n=Math.max(2,Math.floor(w/26));
 for(let i=0;i<n;i++){star5(c,x+6+r()*Math.max(4,w-12),y+4+r()*(h-8),4,1.7,r()*3);c.fill();}}},
{id:'rainbow',n:'Rainbow Block',p:900,q:2,c:'#f4b6c2',d:(c,x,y,w,h)=>{['#f4b6c2','#f9d789','#b5e3a1','#a7d8f0','#c3b6e8'].forEach((col,i)=>{
 c.fillStyle=col;c.globalAlpha=.85;c.fillRect(x,y+h*i/5,w,h/5+1);});c.globalAlpha=1;}},
{id:'gold',n:'Golden Block',p:-1,q:3,c:'#f0c34e',d:(c,x,y,w,h,r)=>{c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=3;
 c.beginPath();c.moveTo(x+w*0.12,y+h*0.7);c.lineTo(x+w*0.3,y+h*0.3);c.stroke();
 c.fillStyle='#fff6d8';star5(c,x+w*0.75,y+h*0.35,5,2,r());c.fill();}}
];
const THEMES=[
{id:'ink',n:'Sketch Ink',p:0,q:0,line:'#3b3230'},
{id:'stripe',n:'Candy Stripes',p:300,q:1,line:'#3b3230',d:(c,x,y,w,h)=>{c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=5;
 for(let i=-1;i<w/16+2;i++){c.beginPath();c.moveTo(x+i*16,y+h+2);c.lineTo(x+i*16+h,y-2);c.stroke();}}},
{id:'dots',n:'Polka Dots',p:350,q:1,line:'#3b3230',d:(c,x,y,w,h,r)=>{c.fillStyle='rgba(255,255,255,.5)';
 for(let ix=x+8;ix<x+w-4;ix+=16)for(let iy=y+6;iy<y+h-4;iy+=10){c.beginPath();c.arc(ix,iy,2,0,7);c.fill();}}},
{id:'zigzag',n:'Zigzag Doodle',p:320,q:1,line:'#3b3230',d:(c,x,y,w,h)=>{c.strokeStyle='rgba(226,105,79,.45)';c.lineWidth=2.2;
 c.beginPath();let up=true;c.moveTo(x+3,y+h*0.7);
 for(let ix=x+10;ix<x+w-3;ix+=9){c.lineTo(ix,up?y+h*0.35:y+h*0.7);up=!up;}c.stroke();}},
{id:'blue',n:'Blueprint',p:400,q:2,line:'#3f5f8f',d:(c,x,y,w,h)=>{c.strokeStyle='rgba(63,95,143,.25)';c.lineWidth=2;
 for(let i=-1;i<w/14+2;i++){c.beginPath();c.moveTo(x+i*14,y+h);c.lineTo(x+i*14+h,y);c.stroke();}}},
{id:'checker',n:'Picnic Checker',p:360,q:1,line:'#3b3230',d:(c,x,y,w,h)=>{c.fillStyle='rgba(226,105,79,.22)';
 const s=11;for(let ix=0;ix<w;ix+=s)for(let iy=0;iy<h;iy+=s)if(((ix/s|0)+(iy/s|0))%2===0)c.fillRect(x+ix,y+iy,Math.min(s,w-ix),Math.min(s,h-iy));}}
];
const BGS=[{id:'plain',n:'Plain Paper',p:0,q:0},{id:'grid',n:'Grid Paper',p:200,q:0},{id:'dots',n:'Dot Paper',p:200,q:0},{id:'music',n:'Music Sheet',p:300,q:1},{id:'kraft',n:'Kraft Paper',p:180,q:0},{id:'bluegrid',n:'Blue Grid',p:260,q:1}];
const TRAILS=[{id:'none',n:'No Trail',p:0,q:0},{id:'pencil',n:'Pencil Dust',p:250,q:0},{id:'bubble',n:'Bubbles',p:300,q:1},{id:'star',n:'Stardust',p:350,q:1},{id:'heartT',n:'Heart Trail',p:350,q:1},{id:'confT',n:'Confetti Trail',p:380,q:2},{id:'feather',n:'Feather Drift',p:320,q:1},{id:'note',n:'Music Notes',p:380,q:2}];
const FXS=[{id:'sparkle',n:'Sparkle Pop',p:0,q:0},{id:'scribble',n:'Scribble Blast',p:300,q:1},{id:'confetti',n:'Confetti Pop',p:400,q:1},{id:'inksplat',n:'Ink Splats',p:320,q:1},{id:'fireworks',n:'Firework Stars',p:450,q:2},{id:'heart',n:'Heart Pop',p:-1,q:3}];
const COINS=[{id:'classic',n:'Classic Coin',p:0,q:0},{id:'button',n:'Wooden Button',p:250,q:0},{id:'acorn',n:'Acorn Coin',p:300,q:1},{id:'star',n:'Star Coin',p:350,q:1},{id:'gem',n:'Sea Gem',p:450,q:2},{id:'clover',n:'Lucky Clover',p:-1,q:3},{id:'donut',n:'Donut Coin',p:520,q:3}];
const UIS=[
{id:'cream',n:'Warm Cream',p:0,q:0,pal:['#f7efe0','#e2694f','#6d5f57']},
{id:'forest',n:'Forest Ink',p:300,q:1,pal:['#eef0da','#5c8a4e','#5c6a4e']},
{id:'midnight',n:'Midnight Ink',p:400,q:2,pal:['#2b2e42','#f0a03c','#b9b2a4']},
{id:'sunset',n:'Sunset Peach',p:450,q:2,pal:['#fdeee2','#e2694f','#8a6a5c']}];
/* ================= BIRD COMPANIONS =================
   each bird has its own hand-drawn look via colors + features */
const BIRDS=[
{id:'robin',n:'Robin',p:0,q:0,body:'#e2694f',belly:'#f7d9c4',wing:'#c9583f',beak:'#f0a03c',cheek:'#f4a8a0',kind:'round'},
{id:'chick',n:'Chick',p:150,q:0,body:'#f5d76e',belly:'#fdf0c8',wing:'#e8c34e',beak:'#f0a03c',cheek:'#f4b8a0',kind:'round',crest:'#e8a800'},
{id:'bluey',n:'Bluey',p:250,q:1,body:'#7fb3d5',belly:'#dcecf7',wing:'#5c93b8',beak:'#f0a03c',cheek:'#f4b8c8',kind:'round'},
{id:'parroty',n:'Parrot',p:350,q:1,body:'#7cb96a',belly:'#d8ecc4',wing:'#5c9a4e',beak:'#e2694f',cheek:'#f4b8a0',kind:'round',crest:'#e2694f'},
{id:'penguin',n:'Penguin',p:450,q:2,body:'#43424e',belly:'#f4f2ec',wing:'#33323c',beak:'#f0a03c',cheek:'#f4b8b0',kind:'penguin'},
{id:'owl',n:'Little Owl',p:550,q:2,body:'#b98a4e',belly:'#e6d2ae',wing:'#8a5a3b',beak:'#f0a03c',cheek:null,kind:'owl',tufts:1},
{id:'flamingo',n:'Flamingo',p:700,q:2,body:'#f28ab5',belly:'#fbd0e2',wing:'#ef7d9d',beak:'#43424e',cheek:'#f4a8c0',kind:'tall'},
{id:'toucan',n:'Toucan',p:900,q:3,body:'#43424e',belly:'#f4f2ec',wing:'#33323c',beak:'#f0a03c',cheek:null,kind:'toucan'},
{id:'goldfinch',n:'Golden Finch',p:1200,q:3,body:'#f0c34e',belly:'#fff2c8',wing:'#c9942a',beak:'#e2694f',cheek:'#f4b8a0',kind:'round',crest:'#f0c34e'},
{id:'sunny',n:'Sunny',p:200,q:0,body:'#f7c948',belly:'#fff3c4',wing:'#e0a92e',beak:'#e2694f',cheek:'#f4a8a0',kind:'round',crest:'#e2694f'},
{id:'minty',n:'Minty',p:300,q:1,body:'#8fd6b4',belly:'#e2f7ec',wing:'#5fb08c',beak:'#f0a03c',cheek:'#f4b8c8',kind:'round'},
{id:'berry',n:'Berry',p:400,q:1,body:'#9a86c9',belly:'#e8e0f4',wing:'#7a68a8',beak:'#f0a03c',cheek:'#f4a8c0',kind:'round',crest:'#7a68a8'},
{id:'cardinal',n:'Cardinal',p:500,q:2,body:'#d94f3d',belly:'#f7c4b8',wing:'#a83a2c',beak:'#f0a03c',cheek:null,kind:'round',crest:'#a83a2c'},
{id:'ducky',n:'Ducky',p:650,q:2,body:'#f9e27d',belly:'#fff8dc',wing:'#e8c34e',beak:'#e8933c',cheek:'#f4b8a0',kind:'round'},
{id:'shadow',n:'Shadow',p:1000,q:3,body:'#4a4a5a',belly:'#8a8aa0',wing:'#33333f',beak:'#f0c34e',cheek:null,kind:'owl',tufts:1}];
/* brand-new shop category: bird HATS — accessories the bird wears (not blocks, not birds!) */
const HATS=[
{id:'none',n:'No Hat',p:0,q:0},
{id:'party',n:'Party Hat',p:180,q:0,c1:'#e2694f',c2:'#f6dd96'},
{id:'straw',n:'Straw Sun Hat',p:240,q:0,c1:'#e8c34e',c2:'#c9942a'},
{id:'chef',n:'Chef Toque',p:280,q:1,c1:'#fbf7ef',c2:'#e3ebf2'},
{id:'top',n:'Dapper Top Hat',p:360,q:1,c1:'#3a3644',c2:'#7fb3d5'},
{id:'wizard',n:'Star Wizard Hat',p:420,q:2,c1:'#5c73b8',c2:'#f6dd96'},
{id:'crown',n:'Gold Crown',p:560,q:2,c1:'#f0c34e',c2:'#d94f3d'},
{id:'halo',n:'Cloud Halo',p:700,q:3,c1:'#fdf6e0',c2:'#f4e6b8'}];
const CATS=[
{id:'skins',label:'BLOCKS',items:SKINS},
{id:'themes',label:'TOWER',items:THEMES},
{id:'birds',label:'BIRDS',items:BIRDS},
{id:'hats',label:'HATS',items:HATS},
{id:'bgs',label:'PAPER',items:BGS},
{id:'trails',label:'TRAILS',items:TRAILS},
{id:'fxs',label:'EFFECTS',items:FXS},
{id:'coins',label:'COINS',items:COINS},
{id:'uis',label:'UI',items:UIS}];
const TOTAL_ITEMS=CATS.reduce((a,c)=>a+c.items.length,0);
function byId(arr,id){return arr.find(i=>i.id===id);}
function findItem(id){for(const c of CATS){const it=byId(c.items,id);if(it)return{cat:c.id,it};}return null;}
function itemName(id){const f=findItem(id);return f?f.it.n:id;}
function ownedCount(){return Object.keys(SV.owned).length;}

/* ================= ACHIEVEMENTS (39) ================= */
const ACHS=[
{id:'a1',n:'First Block',d:'Place your very first block',r:15,m:'b',g:1},
{id:'a2',n:'10 Floors',d:'Build a tower 10 floors high',r:20,m:'h',g:10},
{id:'a3',n:'25 Floors',d:'Build a tower 25 floors high',r:30,m:'h',g:25},
{id:'a4',n:'50 Floors',d:'Build a tower 50 floors high',r:45,m:'h',g:50},
{id:'a5',n:'100 Floors',d:'Build a tower 100 floors high',r:70,m:'h',g:100},
{id:'a6',n:'250 Floors',d:'Build a tower 250 floors high',r:110,m:'h',g:250},
{id:'a7',n:'500 Floors',d:'Build a tower 500 floors high',r:180,m:'h',g:500},
{id:'a19',n:'Tower Master',d:'Build a tower 150 floors high',r:100,m:'h',g:150},
{id:'a20',n:'Impossible Height',d:'Build a tower 300 floors high',r:220,m:'h',g:300},
{id:'a8',n:'First Perfect',d:'Nail a perfect placement',r:15,m:'p',g:1},
{id:'a9',n:'10 Perfects',d:'Nail 10 perfect placements',r:25,m:'p',g:10},
{id:'a10',n:'50 Perfects',d:'Nail 50 perfect placements',r:45,m:'p',g:50},
{id:'a11',n:'100 Perfects',d:'Nail 100 perfect placements',r:70,m:'p',g:100},
{id:'a36',n:'250 Perfects',d:'Nail 250 perfect placements',r:110,m:'p',g:250},
{id:'a12',n:'10 Combo',d:'Chain a 10x perfect combo',r:25,m:'c',g:10},
{id:'a13',n:'25 Combo',d:'Chain a 25x perfect combo',r:45,m:'c',g:25},
{id:'a14',n:'50 Combo',d:'Chain a 50x perfect combo',r:80,m:'c',g:50},
{id:'a15',n:'Coin Collector',d:'Earn 1,000 coins in total',r:60,m:'ce',g:1000},
{id:'a37',n:'Money Machine',d:'Earn 5,000 coins in total',r:150,m:'ce',g:5000},
{id:'a16',n:'Shop Explorer',d:'Own 12 cosmetic items',r:50,m:'o',g:12},
{id:'a38',n:'Collector',d:'Own 25 cosmetic items',r:100,m:'o',g:25},
{id:'a39',n:'Fashionista',d:'Own 40 cosmetic items',r:180,m:'o',g:40},
{id:'a17',n:'World Traveler',d:'Unlock 4 different worlds',r:60,m:'w',g:4},
{id:'a40',n:'World Conqueror',d:'Unlock every world',r:200,m:'w',g:11},
{id:'a18',n:'Daily Player',d:'Play on 5 different days',r:40,m:'d',g:5},
{id:'a41',n:'Week Regular',d:'Play on 7 different days',r:60,m:'d',g:7},
{id:'a21',n:'First Fever',d:'Trigger FEVER mode',r:25,m:'fv',g:1},
{id:'a22',n:'Fever Fanatic',d:'Trigger FEVER mode 10 times',r:70,m:'fv',g:10},
{id:'a23',n:'Gold Digger',d:'Stack a golden block',r:25,m:'gd',g:1},
{id:'a24',n:'Gold Hoarder',d:'Stack 10 golden blocks',r:70,m:'gd',g:10},
{id:'a25',n:'Challenger',d:'Complete a challenge run',r:35,m:'ch',g:1},
{id:'a26',n:'Challenge Champ',d:'Complete 10 challenge runs',r:90,m:'ch',g:10},
{id:'a27',n:'Close Call',d:'Survive a near-miss drop',r:20,m:'nm',g:1},
{id:'a28',n:'Nerve of Steel',d:'Survive 15 near-miss drops',r:70,m:'nm',g:15},
{id:'a29',n:'Sharpshooter',d:'Finish a 20+ floor run at 85% accuracy',r:50,m:'ac',g:85},
{id:'a30',n:'Score Century',d:'Score 1,000 points in one run',r:50,m:'sc',g:1000},
{id:'a31',n:'Score Legend',d:'Score 5,000 points in one run',r:150,m:'sc',g:5000},
{id:'a32',n:'Dedicated',d:'Play 10 runs',r:30,m:'g',g:10},
{id:'a33',n:'Veteran',d:'Play 50 runs',r:80,m:'g',g:50}];
function achVal(a){switch(a.m){
 case 'h':return SV.bestH;case 'b':return SV.blocks;case 'p':return SV.perfects;
 case 'c':return SV.bestCombo;case 'ce':return SV.coinsEarned;case 'o':return ownedCount();
 case 'w':return unlockedWorlds().length;case 'd':return SV.days;case 'g':return SV.games;
 case 'gd':return SV.goldStacked;case 'fv':return SV.feverCount;case 'ch':return SV.chalsDone;
 case 'nm':return SV.nearMisses;case 'ac':return SV.bestAcc;case 'sc':return SV.bestScore;}return 0;}
let achQueue=[];
function checkAch(inGame){
 let changed=false;
 for(const a of ACHS){if(!SV.ach[a.id]&&achVal(a)>=a.g){SV.ach[a.id]=1;SV.coins+=a.r;SV.coinsEarned+=a.r;changed=true;
  if(inGame)achQueue.push(a);
  else{toast(ICONS.trophy+'<span><b>'+a.n+'</b> +'+a.r+' coins</span>');sfx('ach');}}}
 if(changed){save();updateCoinsUI();}}
function pumpAchPop(){
 const el=$('#achPop');
 if(el.classList.contains('on')||!achQueue.length)return;
 const a=achQueue.shift();
 el.innerHTML=ICONS.trophy+'<span class="acol"><b>'+a.n+'</b><em>+ '+a.r+' coins</em></span>';
 el.classList.add('on');sfx('ach');buzz([15,40,15]);
 setTimeout(()=>{el.classList.remove('on');setTimeout(pumpAchPop,420);},2300);
}

/* ================= CRAZYPLAYABLE GAMES → CrazyGames SDK v2 wrapper =================
   Safe everywhere: outside CrazyGames hosts the SDK is 'disabled' or missing, and every
   call is guarded so the game plays normally offline/localhost as well. */
const CG={ok:false,env:'disabled',busy:false,
 init(){try{
  if(window.CrazyGames&&window.CrazyGames.SDK){this.ok=true;
   const g=window.CrazyGames.SDK.game;
   try{g.sdkGameLoadingStart&&g.sdkGameLoadingStart(()=>{});}catch(e){}
   if(g.getEnvironment)g.getEnvironment((err,env)=>{if(!err&&env)this.env=env;});
   else this.env='crazygames';
  }}catch(e){}},
 loadingStop(){try{if(this.ok)window.CrazyGames.SDK.game.sdkGameLoadingStop(()=>{});}catch(e){}},
 gstart(){try{if(this.ok&&this.env!=='disabled')window.CrazyGames.SDK.game.gameplayStart(()=>{});}catch(e){}},
 gstop(){try{if(this.ok&&this.env!=='disabled')window.CrazyGames.SDK.game.gameplayStop(()=>{});}catch(e){}},
 happy(){try{if(this.ok&&this.env!=='disabled')window.CrazyGames.SDK.game.happytime(()=>{});}catch(e){}},
 /* midgame interstitial at natural breaks; cb(played) always fires so gameplay continues */
 inter(cb){const go=()=>{this.busy=false;cb&&cb(true);};
  if(!this.ok||this.env==='disabled'||this.busy){cb&&cb(false);return;}
  this.busy=true;this.gstop();
  let done=false;const fin=()=>{if(done)return;done=true;this.gstart();go();};
  try{window.CrazyGames.SDK.ad.requestAd('midgame',{adStarted:()=>{},adFinished:fin,adError:()=>{if(!done){done=true;this.gstart();cb&&cb(false);}}});
   setTimeout(()=>{if(!done){done=true;this.gstart();cb&&cb(false);}},12000);}
  catch(e){done=true;this.gstart();cb&&cb(false);}},
 rewarded(cb){if(!this.ok||this.env==='disabled'||this.busy){cb&&cb(false);return;}
  this.busy=true;this.gstop();
  let done=false;const fin=(v)=>{if(done)return;done=true;this.gstart();cb&&cb(v);};
  try{window.CrazyGames.SDK.ad.requestAd('rewarded',{adStarted:()=>{},adFinished:()=>fin(true),adError:()=>fin(false)});
   setTimeout(()=>fin(false),20000);}
  catch(e){fin(false);}},
 syncPause(){try{if(this.ok&&this.env!=='disabled'){if(G.state==='play')this.gstart();else this.gstop();}}catch(e){}}
};
/* per CrazyGames requirements: no page scroll from space/arrows when embedded */
try{
 window.addEventListener('wheel',(ev)=>{if(window.CrazyGames)ev.preventDefault();},{passive:false});
 window.addEventListener('keydown',(ev)=>{if(window.CrazyGames&&['ArrowUp','ArrowDown',' '].includes(ev.key))ev.preventDefault();});
}catch(e){}

/* ================= QUESTS: CHALLENGE RUNS / DAILY / WEEKLY ================= */
const CHALS=[
 {t:'floor',g:30,r:200,n:'High Rise',d:'Reach floor 30 in one run'},
 {t:'floor',g:60,r:350,n:'Skyscraper',d:'Reach floor 60 in one run'},
 {t:'perf',g:8,r:200,n:'Bullseye',d:'Land 8 perfect drops in one run'},
 {t:'perf',g:15,r:320,n:'Sharpshooter',d:'Land 15 perfect drops in one run'},
 {t:'combo',g:6,r:250,n:'Chain Reaction',d:'Hit a 6× perfect combo'},
 {t:'combo',g:10,r:350,n:'Combo Artist',d:'Hit a 10× perfect combo'},
 {t:'gold',g:1,r:180,n:'Gold Rush',d:'Stack a golden block'},
 {t:'fever',g:1,r:220,n:'Hot Streak',d:'Trigger FEVER mode'},
 {t:'coins',g:120,r:260,n:'Piggy Bank',d:'Earn 120 coins in one run'},
 {t:'acc',g:85,r:300,n:'Steady Hands',d:'Finish a 20+ floor run at 85% accuracy'}];
function curChal(){return CHALS[SV.quest.chalIdx%CHALS.length];}
function chalProgress(){
 const ch=curChal();if(!G.chal||G.chalDone)return G.chalDone?ch.g:0;
 switch(ch.t){
  case 'floor':return Math.min(G.floor,ch.g);
  case 'perf':return Math.min(G.perfectsRun,ch.g);
  case 'combo':return Math.min(G.runCombo,ch.g);
  case 'gold':return G.goldRun?1:0;
  case 'fever':return G.feverRun?1:0;
  case 'coins':return Math.min(G.coins,ch.g);
  case 'acc':return 0;}
 return 0;
}
function chalCheck(final){
 if(!G.chal||G.chalDone)return;
 const ch=curChal();let done=false;
 if(ch.t==='floor'&&G.floor>=ch.g)done=true;
 if(ch.t==='perf'&&G.perfectsRun>=ch.g)done=true;
 if(ch.t==='combo'&&G.runCombo>=ch.g)done=true;
 if(ch.t==='gold'&&G.goldRun)done=true;
 if(ch.t==='fever'&&G.feverRun)done=true;
 if(ch.t==='coins'&&G.coins>=ch.g)done=true;
 if(final&&ch.t==='acc'&&G.floor>=20&&G.drops>0&&(G.floor/G.drops*100)>=ch.g)done=true;
 if(done)completeChal();
}
function completeChal(){
 G.chalDone=true;const ch=curChal();
 SV.coins+=ch.r;SV.coinsEarned+=ch.r;SV.chalsDone++;G.coins+=ch.r;
 sfx('mile');buzz([20,40,20,40,20]);
 banner('CHALLENGE DONE!');
 toast(ICONS.target+'<span><b>'+ch.n+' complete!</b> +'+ch.r+' coins</span>');
 questEvent('challenge',1);
 SV.quest.chalIdx++;
 updateChalChip();checkAch(true);updateHUD();save();
}
const DQUESTS=[
 {t:'d_coins',g:200,r:150,n:'Coin Harvester',d:'Earn 200 coins today'},
 {t:'d_perf',g:25,r:150,n:'Perfectionist',d:'Land 25 perfect drops today'},
 {t:'d_runs',g:5,r:120,n:'Regular',d:'Play 5 runs today'},
 {t:'d_floor',g:40,r:160,n:'Climber',d:'Reach floor 40 in one run today'},
 {t:'d_blocks',g:150,r:150,n:'Bricklayer',d:'Stack 150 blocks today'},
 {t:'d_gold',g:1,r:140,n:'Lucky Finder',d:'Stack a golden block today'}];
const DQ_COSMETICS=['button','acorn','grid','pencil','scribble','zigzag','kraft','bubble'];
function ensureDailyQuest(){
 const t=todayStr();
 if(SV.quest.daily.date===t&&SV.quest.daily.id>=0)return;
 const id=hashStr('dq'+t)%DQUESTS.length;
 SV.quest.daily={date:t,id,prog:0,done:false};save();
}
function curDailyQuest(){ensureDailyQuest();return DQUESTS[SV.quest.daily.id];}
function dailyQuestRewardInfo(){
 const t=SV.quest.daily.date||todayStr();
 const cid=DQ_COSMETICS[hashStr('dqr'+t)%DQ_COSMETICS.length];
 const f=findItem(cid);
 if(f&&!SV.owned[cid])return{item:cid,name:f.it.n};
 return{coins:100};
}
const WQUESTS=[
 {t:'w_coins',g:2500,r:300,n:'Moneybags',d:'Earn 2,500 coins this week'},
 {t:'w_perf',g:200,r:300,n:'Perfect Machine',d:'Land 200 perfect drops this week'},
 {t:'w_floor',g:90,r:350,n:'Peak Bagger',d:'Reach floor 90 this week'},
 {t:'w_chal',g:3,r:320,n:'Challenger',d:'Complete 3 challenge runs this week'},
 {t:'w_runs',g:25,r:280,n:'Marathoner',d:'Play 25 runs this week'},
 {t:'w_buy',g:1,r:250,n:'Shopper',d:'Buy something from the shop this week'}];
function ensureWeek(){
 const wk=getWeekKey();
 if(SV.quest.week.key!==wk){SV.quest.week={key:wk,prog:{},done:{}};save();}
}
function weekQuests(){
 ensureWeek();
 const h=hashStr('wq'+SV.quest.week.key);
 const out=[];for(let i=0;i<3;i++)out.push(WQUESTS[(h+i*2)%WQUESTS.length]);
 return out;
}
function questEvent(kind,val){
 /* daily quest */
 const dq=DQUESTS[SV.quest.daily.id]||null;
 if(dq&&SV.quest.daily.date===todayStr()&&!SV.quest.daily.done){
  let P=SV.quest.daily.prog,hit=false;
  if(dq.t==='d_coins'&&kind==='coin'){P+=val;hit=true;}
  if(dq.t==='d_perf'&&kind==='perfect'){P+=val;hit=true;}
  if(dq.t==='d_runs'&&kind==='run'){P+=1;hit=true;}
  if(dq.t==='d_floor'&&kind==='floor'){P=Math.max(P,val);hit=true;}
  if(dq.t==='d_blocks'&&kind==='block'){P+=val;hit=true;}
  if(dq.t==='d_gold'&&kind==='gold'){P+=1;hit=true;}
  if(hit){
   if(P>=dq.g){SV.quest.daily.prog=dq.g;SV.quest.daily.done=true;
    SV.coins+=dq.r;SV.coinsEarned+=dq.r;
    const extra=dailyQuestRewardInfo();
    let msg='<b>Daily quest done!</b> +'+dq.r+' coins';
    if(extra.item){SV.owned[extra.item]=1;msg+=' + <b>'+extra.name+'</b>!';}
    else{SV.coins+=extra.coins;SV.coinsEarned+=extra.coins;msg+=' + '+extra.coins+' coins';}
    toast(ICONS.target+'<span>'+msg+'</span>');sfx('mile');save();refreshShopIfOpen();}
   else SV.quest.daily.prog=P;
  }
 }
 /* weekly quests */
 ensureWeek();
 weekQuests().forEach(q=>{
  if(SV.quest.week.done[q.t])return;
  let P=SV.quest.week.prog[q.t]||0,hit=false;
  if(q.t==='w_coins'&&kind==='coin'){P+=val;hit=true;}
  if(q.t==='w_perf'&&kind==='perfect'){P+=val;hit=true;}
  if(q.t==='w_floor'&&kind==='floor'){P=Math.max(P,val);hit=true;}
  if(q.t==='w_chal'&&kind==='challenge'){P+=1;hit=true;}
  if(q.t==='w_runs'&&kind==='run'){P+=1;hit=true;}
  if(q.t==='w_buy'&&kind==='buy'){P+=1;hit=true;}
  if(!hit)return;
  if(P>=q.g){SV.quest.week.prog[q.t]=q.g;SV.quest.week.done[q.t]=1;
   SV.coins+=q.r;SV.coinsEarned+=q.r;
   toast(ICONS.trophy+'<span><b>Weekly goal: '+q.n+'</b> +'+q.r+' coins</span>');sfx('ach');
   const all=weekQuests().every(w=>SV.quest.week.done[w.t]);
   if(all){SV.coins+=500;SV.coinsEarned+=500;toast(ICONS.gift+'<span><b>All weekly goals done!</b> +500 coins</span>');}
   save();refreshShopIfOpen();}
  else SV.quest.week.prog[q.t]=P;
 });
}

/* ================= DAILY GIFT REWARDS ================= */
const DAILY=[{c:100},{c:200},{item:'clover'},{c:300},{item:'heart'},{c:400},{item:'gold'}];
function giftItemCat(item){
 if(item==='clover')return'coins';if(item==='heart')return'fxs';if(item==='gold')return'skins';return'skins';
}
function getDailyState(){
 const t=todayStr();
 if(SV.daily.last===t)return{claimedToday:true,disp:((SV.daily.day-1)%7)+1,shield:SV.daily.shield};
 const gap=SV.daily.last?daysBetween(SV.daily.last,t):99;
 const continues=SV.daily.last===''?true:(gap===1||(gap===2&&SV.daily.shield>0));
 const day=continues?SV.daily.day+1:1;
 return{claimedToday:false,disp:((day-1)%7)+1,willContinue:continues,needsShield:gap===2&&SV.daily.shield>0&&SV.daily.last!=='',shield:SV.daily.shield};
}
function claimDaily(){
 const t=todayStr();
 if(SV.daily.last===t){sfx('deny');return;}
 const st=getDailyState();
 if(st.needsShield){SV.daily.shield--;toast(ICONS.shield+'<span><b>Streak shield used!</b> Your streak is safe.</span>');}
 SV.daily.last=t;
 SV.daily.day=st.willContinue?SV.daily.day+1:1;
 const disp=((SV.daily.day-1)%7)+1;
 const rw=DAILY[disp-1];
 if(rw.c){SV.coins+=rw.c;SV.coinsEarned+=rw.c;toast(ICONS.gift+'<span>Day '+disp+' gift: <b>+'+rw.c+' coins!</b></span>');}
 else{SV.owned[rw.item]=1;toast(ICONS.gift+'<span>Day '+disp+' gift: <b>'+itemName(rw.item)+'</b>!</span>');}
 if(disp===7){SV.coins+=300;SV.coinsEarned+=300;SV.daily.shield=Math.min(2,SV.daily.shield+1);
  toast(ICONS.shield+'<span><b>7-day streak complete!</b> +300 coins & +1 shield</span>');}
 sfx('mile');buzz([20,30,20]);
 const td=todayStr();if(SV.lastDay!==td){SV.lastDay=td;SV.days++;}
 checkAch(false);save();updateCoinsUI();renderDaily();renderMenuBtn();refreshShopIfOpen();
}

/* ================= GAME STATE ================= */
const cv=$('#game'),ctx=cv.getContext('2d');
let W=0,H=0,DPR=1,bgC=null,bgDpr=1,tower=null;
const TOWER_MAX_DIM=8192,BG_MAX_DIM=4096; /* keep offscreen canvases inside safe GPU limits */
const G={state:'menu',stack:[],moving:null,pieces:[],parts:[],floor:0,score:0,coins:0,combo:0,runCombo:0,
 perfectsRun:0,camY:0,camT:0,shake:0,side:1,spawnT:0,runStartBest:0,runStartBestScore:0,trailT:0,bw:240,bh:34,groundY:0,
 drops:0,bounce:0,slowT:0,fever:{on:false,t:0},feverRun:false,goldRun:false,goldAt:-99,specAt:-99,
 chal:false,chalDone:false,useCosmetics:null,trial:null,fambT:0,resultAt:0,
 bird:null};
const CONF=['#e2694f','#f0a03c','#f5c84e','#7cb96a','#7fb3d5','#c39bd5','#ef7d9d'];
const TUT={on:false,step:-1,freeze:false,tries:0,blockTap:false};
function runEq(cat){return (G.useCosmetics&&G.useCosmetics[cat])?G.useCosmetics[cat]:SV.eq[cat];}
/* compact rectangular hand-drawn blocks like the reference: wide + short, clearly rectangular */
function calcBw(){return clamp(W*0.19,60,120);} /* HALF width per request: compact, uniform planks */
function calcBh(){return clamp(calcBw()/7,11,20);}
function calcBaseW(){return G.bw;}

function resize(){
 W=Math.max(240,window.innerWidth||320);H=Math.max(240,window.innerHeight||320);
 DPR=clamp(window.devicePixelRatio||1,1,2);
 cv.width=Math.max(2,Math.ceil(W*DPR));cv.height=Math.max(2,Math.ceil(H*DPR));
 /* CSS size always equals the viewport: 1 logical px == 1 CSS px on every browser (no stretching/clipping) */
 cv.style.width=W+'px';cv.style.height=H+'px';
 buildBg();if(typeof buildFeverGlow==='function')buildFeverGlow();
 if(G.stack.length){
  /* responsive recalculation of block size, ground, movement baseline and camera */
  G.bw=calcBw();G.bh=calcBh();
  G.groundY=H-Math.max(64,H*0.12);
  G.stack.forEach((b,i)=>{b.h=G.bh;b.y=G.groundY-(i+1)*G.bh;});
  /* recenter the tower horizontally so rotate/resize never leaves it off-centre */
  {const _t0=G.stack[G.stack.length-1];
   const _sh0=W/2-(_t0.x+_t0.w/2);
   if(isFinite(_sh0)&&Math.abs(_sh0)>1){for(const _b of G.stack)_b.x+=_sh0;}}
  const top=G.stack[G.stack.length-1];
  if(isFinite(top.x))top.x=clamp(top.x,-12,Math.max(-12,W-top.w+12));
  towerReset();
  G.camT=camTarget();G.camY=G.camT; /* snap the camera: no stale view after rotate/resize */
  /* repair the moving block: fixed size, one-way flight, valid on every screen */
  if(G.moving){
   G.moving.w=G.bw;G.moving.h=G.bh;G.moving.y=top.y-G.bh;
   if(!isFinite(G.moving.dir))G.moving.dir=1;
   if(!isFinite(G.moving.x))G.moving.x=(G.moving.dir>0)?-G.moving.w/2:W-G.moving.w/2;
   G.moving.x=clamp(G.moving.x,-G.moving.w-60,W+60);
  }
  if(G.bird&&G.bird.jump>=0){G.bird.fromX=clamp(G.bird.fromX,-40,W+40);G.bird.toX=clamp(G.bird.toX,-40,W+40);}
 }
}
function camTarget(){
 /* keeps the tower top around 42% down the screen; clamped so short screens stay playable */
 return Math.max(0,clamp(H*0.42,64,H*0.7)-(G.groundY-G.stack.length*G.bh));
}
function buildBg(){
 bgC=document.createElement('canvas');
 bgDpr=Math.max(0.5,Math.min(DPR,BG_MAX_DIM/Math.max(1,W),BG_MAX_DIM/Math.max(1,H)));
 bgC.width=Math.max(2,Math.ceil(W*bgDpr));bgC.height=Math.max(2,Math.ceil(H*bgDpr));
 const c=bgC.getContext('2d');c.setTransform(bgDpr,0,0,bgDpr,0,0);
 const w=WORLD();w.draw(c,W,H,rng(w.id.length*97+11));
}
function drawBlock(c,b,skinId,themeId){
 const sk=byId(SKINS,skinId)||SKINS[0],th=byId(THEMES,themeId)||THEMES[0];
 /* defensive geometry: auto-correct any missing/invalid block values so a block can never render invisible */
 const bx=isFinite(b.x)?b.x:0,by=isFinite(b.y)?b.y:0;
 const bw=Math.max(4,isFinite(b.w)&&b.w>0?b.w:(G.bw||120));
 const bh=Math.max(4,isFinite(b.h)&&b.h>0?b.h:(G.bh||30));
 const sd=isFinite(b.seed)?b.seed:1;
 /* extend each block 2px past its logical bottom so adjacent blocks always overlap:
    stacked blocks touch with ZERO visible vertical gaps (the block above is baked later and covers the seam) */
 const bhD=bh+2;
 blockPath(c,bx,by,bw,bhD,sd);
 c.save();c.fillStyle=sk.c;c.fill();c.clip();
 c.fillStyle='rgba(59,50,48,.08)';c.fillRect(bx+bw*0.82,by,bw*0.18,bhD);
 if(sk.d)sk.d(c,bx,by,bw,bhD,rng(sd+7));
 if(th.d)th.d(c,bx,by,bw,bhD,rng(sd+13));
 /* plank seam across the middle — the slim slat look from the reference */
 jline(c,bx+4,by+bhD*0.52,bx+bw-4,by+bhD*0.52,rng(sd+21),'rgba(59,50,48,.30)',2);
 c.restore();
 blockPath(c,bx,by,bw,bhD,sd);
 c.strokeStyle=th.line||'#3b3230';c.lineWidth=3;c.stroke();
}
/* progressive tower architecture doodles (baked into the tower canvas) */
function drawDeco(c,b,f){
 if(b.w<44)return;
 const r=rng(b.seed+777);
 const ink='rgba(59,50,48,.5)';
 if(f>=8&&r()<0.45){ /* little windows */
  const n=b.w>90?3:2;
  for(let i=0;i<n;i++){const wx=b.x+b.w*(0.2+0.6*i/(n-1||1))-4+(r()*4-2),wy=b.y+b.h*0.28+(r()*3);
   c.strokeStyle=ink;c.lineWidth=1.6;c.strokeRect(wx,wy,8,7);
   c.beginPath();c.moveTo(wx+4,wy);c.lineTo(wx+4,wy+7);c.stroke();}
 }
 if(f%10===0){ /* bunting line across the top */
  c.strokeStyle=ink;c.lineWidth=1.8;c.beginPath();
  c.moveTo(b.x+3,b.y+4);c.quadraticCurveTo(b.x+b.w/2,b.y+10,b.x+b.w-3,b.y+4);c.stroke();
  const n=Math.max(3,Math.floor(b.w/24));
  for(let i=0;i<n;i++){const fx=b.x+6+(b.w-12)*(i/(n-1||1)),fy=b.y+5+Math.sin(i/(n-1)*Math.PI)*5;
   jpoly(c,[[fx-4,fy],[fx+4,fy],[fx,fy+7]],rng(b.seed+i+50),CONF[i%CONF.length],'rgba(59,50,48,.5)',1.4);}
 }
 if(f%25===0){ /* side flag */
  const fx=b.x+b.w-6,fy=b.y-14;
  jline(c,fx,b.y+2,fx,fy,r,'#3b3230',2.4);
  jpoly(c,[[fx,fy],[fx+16,fy+4],[fx,fy+9]],rng(b.seed+9),['#e2694f','#f0a03c','#7cb96a'][Math.floor(f/25)%3],'#3b3230',1.8);
 }
 if(f>=50&&f%7===0){ /* ivy squiggle */
  c.strokeStyle='rgba(78,125,67,.6)';c.lineWidth=2;c.beginPath();
  c.moveTo(b.x+4,b.y+b.h);
  c.bezierCurveTo(b.x+10,b.y+b.h*0.6,b.x+2,b.y+b.h*0.4,b.x+9,b.y+3);c.stroke();
  for(let i=0;i<3;i++)jcircle(c,b.x+5+r()*6,b.y+b.h*(0.25+i*0.25),2.4,r,'rgba(111,168,92,.75)',null,0);
 }
 if(f===100){ /* crown doodle */
  const cx=b.x+b.w/2,cy=b.y-10;
  jpoly(c,[[cx-12,b.y+2],[cx-12,cy],[cx-5,cy+6],[cx,cy-4],[cx+5,cy+6],[cx+12,cy],[cx+12,b.y+2]],rng(b.seed+3),'#f0c34e','#3b3230',2);
 }
}
// ====== BIRD COMPANION ======
/* One hand-drawn bird lives on top of the tower. It idle-bobs and blinks, and every drop
   launches it in a hop from the old top block to the new one - wings flapping while airborne,
   stretch in flight, squash-and-settle on landing. The hop is the visual continuation of the
   drop action itself, so the bird never feels like a separate character. */
function birdState(){
 if(!G.bird)G.bird={t:0,blink:0,nextBlink:2.2,jump:-1,jumpDur:0.62,fromX:0,fromY:0,toX:0,toY:0,squash:0,stret:0,wing:0,dir:1,fall:false,
  st:'idle',s:0,rot:0,panic:0,dizzy:0,x:0,y:0,vx:0,vy:0,vr:0,bounces:0,stars:0,sx:0,sy:0,cx:0,spark:0};
 return G.bird;
}
/* ===== THE BIG FALL: full multi-phase knock-down animation =====
   impact → tumble-fall with spins & flaps → ground bounce(s) → dizzy with circling
   stars → a swooping fly-back to the tower (it re-aims if you keep stacking) → settle. */
function birdChain(){const b=G.bird;return !!(b&&b.st&&b.st!=='idle');}
function birdBusy(){const b=G.bird;return birdChain()||!!(b&&b.jump>=0);}
function qbez(a,c,b,t){const u=1-t;return u*u*a+2*u*t*c+t*t*b;}
function startBirdFall(dirx){
 const _b=birdState(),_t=G.stack[G.stack.length-1];
 const _sp=byId(BIRDS,runEq('birds'))||BIRDS[0];
 _b.st='impact';_b.s=0;_b.bounces=0;_b.panic=1;_b.dizzy=0;_b.slide=null;_b.ret=null;
 _b.x=_t.x+_t.w/2;_b.y=_t.y;_b.rot=0;_b.squash=0;_b.stret=0;_b.wing=0;
 _b.vx=dirx*(60+Math.random()*50);_b.vy=-150;_b.vr=dirx*6.5;_b.dir=dirx>0?1:-1;
 /* feathers burst! */
 for(let i=0;i<5;i++)part({x:_b.x+(Math.random()-0.5)*16,y:_b.y-10,type:'featherp',
  vx:(Math.random()-0.5)*110,vy:-50-Math.random()*90,g:150,life:1.15,size:5+Math.random()*3,
  col:i%2?'#f4e6b8':(_sp&&_sp.body?_sp.body:'#f4e6b8'),rot:Math.random()*6,vr:3.5});
 sfx('pop');buzz([25,25]);
}
function birdChainTick(b,dt){
 if(G.state==='pause')return;
 b.s+=dt;
 const _t=G.stack[G.stack.length-1], gy=G.groundY;
 switch(b.st){
  case 'impact':
   b.squash=clamp(b.s/0.16,0,1)*0.9; b.panic=1; b.wing=Math.sin(b.s*62)*0.5;
   if(b.s>=0.16){b.st='fall';b.s=0;b.squash=0;b.vy=-150;}
   break;
  case 'fall':
   b.vy+=1500*dt; b.y+=b.vy*dt; b.x+=b.vx*dt*0.7+Math.sin(b.s*21)*26*dt;
   b.rot+=b.vr*dt; b.wing=Math.sin(b.s*40)*1.15; b.panic=1; b.dir=b.vx>=0?1:-1;
   if(b.y>=gy-2){
    b.y=gy-2;
    if(b.vy>170&&b.bounces<2){
     b.bounces++;b.vy=-b.vy*(0.36-b.bounces*0.07);b.vx*=0.5;b.vr*=-0.5;
     b.squash=1.1;b.st='land';b.s=0;dustFx(b.x,gy);sfx('pop');buzz(16);
    }else{b.st='dizzy';b.s=0;b.squash=1.2;b.vy=0;b.vx=0;b.rot=0;}
   }
   break;
  case 'land':
   b.squash=Math.max(0,b.squash-dt*3.6); b.wing=Math.sin(b.s*32)*0.8;
   b.y+=b.vy*dt; b.vy+=1500*dt; b.x+=b.vx*dt; b.rot+=b.vr*dt*0.4;
   if(b.s>=0.2){b.squash=0; if(b.y<gy-2){b.st='fall';} else {b.st='dizzy';b.s=0;}}
   break;
  case 'dizzy':{
   b.rot=Math.sin(b.s*19)*0.17; b.squash=Math.max(0.22,b.squash-dt*1.7); b.panic=0; b.dizzy=1;
   b.wing*=Math.max(0,1-dt*6);
   const _st=Math.floor(b.s/0.13);
   if(_st>(b.stars||0)&&b.s<0.62){b.stars=_st;
    part({x:b.x+Math.cos(b.stars*2.2)*15,y:gy-36+Math.sin(b.stars*2.2)*5,type:'twink',
     vx:0,vy:-8,g:0,life:0.65,size:2.8,col:'#f0c34e'});}
   if(b.s>=0.62){b.stars=0;b.dizzy=0;
    if(G.state==='play'){
     b.st='flyup';b.s=0;b.sx=b.x;b.sy=b.y;b.cx=Math.min(b.x,_t.x+_t.w/2)-56;
    }else b.st='sit'; /* the run ended — the bird stays on the ground, catching its breath */
   }
   break;}
  case 'flyup':{
   const dur=clamp(0.8+Math.abs(gy-_t.y)/900,0.8,1.4);
   const p=clamp(b.s/dur,0,1), e=p*p*(3-2*p);
   const tx2=_t.x+_t.w/2, ty2=_t.y;                 /* live re-aim: if the tower grew, chase it */
   b.x=qbez(b.sx,b.cx+Math.sin(p*Math.PI*3)*18,tx2,e);
   b.y=qbez(b.sy,Math.min(b.sy,ty2)-120,ty2,e)+Math.sin(p*Math.PI*2)*8;
   b.wing=Math.sin(p*Math.PI*7)*1.1; b.stret=Math.sin(p*Math.PI)*0.5;
   b.rot=Math.sin(p*Math.PI*3)*0.2; b.dir=tx2>=b.x?1:-1;
   if(SV.set.fx){b.spark=(b.spark||0)+dt;
    if(b.spark>=0.05){b.spark=0;
     part({x:b.x,y:b.y,type:'twink',vx:0,vy:12,g:8,life:0.45,size:2.4,col:'rgba(244,230,184,.95)'});}}
   if(p>=1){b.st='settle';b.s=0;b.wing=0;b.rot=0;b.stret=0;}
   break;}
  case 'settle':
   b.squash=Math.max(0,1.05-b.s*3.6); b.wing=Math.sin(b.s*42)*0.32*(1-b.s/0.3);
   if(b.s>=0.3){b.st='idle';b.squash=1;b.panic=0;b.dizzy=0;b.rot=0;b.nextBlink=1.1;if(TUT.on)tutEvent('birdback');}
   break;
  case 'sit':
   b.wing*=Math.max(0,1-dt*5); b.squash=Math.max(0.2,b.squash-dt*1.4); b.y=Math.min(gy-2,b.y+30*dt);
   b.rot*=Math.max(0,1-dt*4); b.panic=Math.max(0,b.panic-dt);
   if(G.state==='play'){b.st='flyup';b.s=0;b.sx=b.x;b.sy=b.y;b.cx=Math.min(b.x,_t.x+_t.w/2)-56;}
   break;
 }
}
function birdJump(fromX,fromY,toX,toY){
 const b=birdState();b.jump=0;b.fall=false;b.fromX=fromX;b.fromY=fromY;b.toX=toX;b.toY=toY;
 b.jumpDur=clamp(0.5+Math.abs(fromY-toY)/300,0.5,0.85);
 b.dir=(toX>=fromX)?1:-1;
 chirp();
}
function birdFall(fromX,fromY,toX,toY){
 const b=birdState();b.jump=0;b.fall=true;b.fromX=fromX;b.fromY=fromY;b.toX=toX;b.toY=toY;
 b.jumpDur=0.5;
 b.dir=(toX>=fromX)?1:-1;
 chirp();
}
function chirp(){sfx('chirp');}
/* ===== SOLID BIRD helpers =====
   The bird perches on the tower's TOP block, off toward the side the block flies OUT.
   It is solid: an untapped block that reaches it knocks the bird down. */
function birdPerchX(bk){ /* the bird ALWAYS sits dead-centre on the top block — it never moves */
 return bk.x+bk.w/2;
}
function birdFallTo(fromX,fromY,toX,toY){
 const b=birdState();b.jump=0;b.fall=true;b.fromX=fromX;b.fromY=fromY;b.toX=toX;b.toY=toY;
 b.jumpDur=clamp(0.42+Math.abs(fromY-toY)/700,0.42,0.8);
 b.dir=(toX>=fromX)?1:-1;
 chirp();
}
function drawBird(c,x,y,s,sp,o){
 /* FRONT-FACING hand-drawn bird. x,y = feet anchor; s = size; sp = spec;
    o = {blink,squash,stret,wing,open,tilt} — open = singing beak while airborne */
 o=o||{};const ink='#3b3230';
 const jp=(o.jump!=null&&o.jump>=0)?clamp(o.jump/(o.jumpDur||0.62),0,1):-1;
 const tilt=jp>=0?(o.dir||1)*(jp<0.5?-0.2:0.3)*Math.sin(Math.PI*jp):(o.tilt||0); /* swoop into the hop; lean when braced by a block */
 const open=jp>=0;                                          /* sing while airborne */
 const _br=o.breath||0;
 const sy=Math.max(0.55,1-(o.squash||0)*0.38+(o.stret||0)*0.30+_br);
 const sx=Math.min(1.45,1+(o.squash||0)*0.35-(o.stret||0)*0.18-_br*0.6);
 c.save();c.translate(x,y);c.rotate(tilt+(o.rot||0));c.scale(sx,sy);
 c.lineJoin='round';c.lineCap='round';
 /* feet */
 if(sp.kind==='penguin'){
  c.fillStyle=sp.beak;c.beginPath();c.ellipse(-s*0.3,-s*0.04,s*0.2,s*0.1,0,0,7);c.fill();
  c.beginPath();c.ellipse(s*0.3,-s*0.04,s*0.2,s*0.1,0,0,7);c.fill();
 }else{
  c.strokeStyle=ink;c.lineWidth=Math.max(1.2,s*0.12);
  c.beginPath();c.moveTo(-s*0.3,0);c.lineTo(-s*0.3,-s*0.24);c.moveTo(s*0.3,0);c.lineTo(s*0.3,-s*0.24);c.stroke();
 }
 const tall=sp.kind==='tall';
 const cy=-s*(tall?1.15:0.95);           /* body/face center */
 const ry=s*(tall?1.0:0.82),rx=s*0.8;
 /* wings on both sides — raise & flap while airborne */
 const wA=(o.wing||0)+(o.wingIdle||0)+(jp>=0?(o.fln||0)*0.28:0);
 for(const sd of[-1,1]){
  c.save();c.translate(sd*rx*0.86,cy-s*0.05);c.rotate(sd*(0.55+wA*1.15));
  c.fillStyle=sp.wing;c.beginPath();c.ellipse(0,s*0.34,s*0.3,s*0.52,0,0,7);c.fill();
  c.strokeStyle=ink;c.lineWidth=Math.max(1,s*0.09);c.stroke();c.restore();
 }
 /* body */
 c.fillStyle=sp.body;c.beginPath();c.ellipse(0,cy,rx,ry,0,0,7);c.fill();
 c.strokeStyle=ink;c.lineWidth=Math.max(1.2,s*0.11);c.stroke();
 /* belly patch */
 c.fillStyle=sp.belly;c.beginPath();c.ellipse(0,cy+ry*0.42,rx*0.55,ry*0.5,0,0,7);c.fill();
 /* cheek blushes — soft, on both sides */
 if(sp.cheek){c.globalAlpha=0.75;c.fillStyle=sp.cheek;
  c.beginPath();c.ellipse(-rx*0.62,cy+ry*0.02,s*0.17,s*0.1,0,0,7);c.fill();
  c.beginPath();c.ellipse(rx*0.62,cy+ry*0.02,s*0.17,s*0.1,0,0,7);c.fill();c.globalAlpha=1;}
 /* fluffy belly scallops */
 c.strokeStyle='rgba(59,50,48,.22)';c.lineWidth=1.4;c.beginPath();
 for(let _k=0;_k<3;_k++){const _fx2=-rx*0.3+_k*rx*0.3;c.moveTo(_fx2-4,cy+ry*0.62);c.quadraticCurveTo(_fx2,cy+ry*0.5,_fx2+4,cy+ry*0.62);}c.stroke();
 /* head shine */
 c.globalAlpha=0.28;c.strokeStyle='#ffffff';c.lineWidth=Math.max(1.5,s*0.12);
 c.beginPath();c.arc(-rx*0.25,cy-ry*0.45,rx*0.5,Math.PI*1.15,Math.PI*1.55);c.stroke();c.globalAlpha=1;
 /* equipped HAT — sits on the head, drawn in the same hand-inked style */
 const _hid=(o.hat&&o.hat!=='none')?o.hat:null;
 if(_hid){
  const _hp=byId(HATS,_hid);
  const _c1=_hp&&_hp.c1?_hp.c1:'#e2694f',_c2=_hp&&_hp.c2?_hp.c2:'#f6dd96';
  const _hy=cy-ry+s*0.06,_hw=rx*1.55;
  c.save();c.translate(0,_hy);c.rotate(-tilt*0.6);
  c.lineJoin='round';
  const _ilw=Math.max(1.2,s*0.1);c.lineWidth=_ilw;c.strokeStyle=ink;
  if(_hid==='party'){
   c.fillStyle=_c1;c.beginPath();c.moveTo(-_hw*0.42,2);c.lineTo(0,-s*1.0);c.lineTo(_hw*0.42,2);c.closePath();c.fill();c.stroke();
   c.strokeStyle=_c2;c.lineWidth=Math.max(1,s*0.08);
   for(let _i=1;_i<4;_i++){c.beginPath();c.moveTo(-_hw*0.42+_i*_hw*0.21,2-_i*s*0.21);c.lineTo(-_hw*0.42+_i*_hw*0.21+s*0.1,2-_i*s*0.21);c.stroke();}
   c.fillStyle=_c2;c.beginPath();c.arc(0,-s*1.16,s*0.15,0,7);c.fill();c.lineWidth=_ilw;c.strokeStyle=ink;c.stroke();
  }else if(_hid==='straw'){
   c.fillStyle=_c1;c.beginPath();c.ellipse(0,1,_hw*0.8,s*0.18,0,0,7);c.fill();c.stroke();
   c.beginPath();c.moveTo(-_hw*0.4,0);c.quadraticCurveTo(0,-s*0.8,_hw*0.4,0);c.closePath();c.fill();c.stroke();
   c.strokeStyle=_c2;c.lineWidth=Math.max(1.4,s*0.11);c.beginPath();c.moveTo(-_hw*0.38,-s*0.05);c.quadraticCurveTo(0,-s*0.2,_hw*0.38,-s*0.05);c.stroke();
  }else if(_hid==='chef'){
   c.fillStyle=_c1;
   for(const _k of[-1,0,1]){c.beginPath();c.arc(_k*_hw*0.28,-s*0.4,s*0.26,0,7);c.fill();c.stroke();}
   c.beginPath();c.rect(-_hw*0.4,-s*0.22,_hw*0.8,s*0.3);c.fill();c.stroke();
   c.strokeStyle=_c2;c.lineWidth=1.4;
   for(let _i=0;_i<3;_i++){c.beginPath();c.moveTo(-_hw*0.26+_i*_hw*0.26,-s*0.2);c.lineTo(-_hw*0.26+_i*_hw*0.26,s*0.05);c.stroke();}
  }else if(_hid==='top'){
   c.fillStyle=_c1;
   c.beginPath();c.rect(-_hw*0.5,0,_hw,s*0.14);c.fill();c.stroke();
   c.beginPath();c.rect(-_hw*0.3,-s*0.85,_hw*0.6,s*0.88);c.fill();c.stroke();
   c.strokeStyle=_c2;c.lineWidth=Math.max(1.6,s*0.12);
   c.beginPath();c.moveTo(-_hw*0.3,-s*0.14);c.lineTo(_hw*0.3,-s*0.14);c.stroke();
  }else if(_hid==='wizard'){
   c.fillStyle=_c1;c.beginPath();c.moveTo(-_hw*0.5,3);c.quadraticCurveTo(-_hw*0.1,-s*1.2,_hw*0.48,-s*0.1);c.quadraticCurveTo(0,-s*0.34,-_hw*0.5,3);c.closePath();c.fill();c.stroke();
   c.fillStyle=_c2;
   c.beginPath();c.arc(-_hw*0.1,-s*0.5,s*0.07,0,7);c.fill();
   star5(c,_hw*0.2,-s*0.24,s*0.11,s*0.05,0.4);c.fill();
   c.beginPath();c.arc(-_hw*0.34,-s*0.14,s*0.06,0,7);c.fill();
  }else if(_hid==='crown'){
   c.fillStyle=_c1;c.beginPath();c.moveTo(-_hw*0.4,2);
   for(let _i=0;_i<3;_i++){const _px=-_hw*0.4+_i*_hw*0.27;c.lineTo(_px+_hw*0.13,-s*0.42);c.lineTo(_px+_hw*0.27,s*0.05);}
   c.lineTo(_hw*0.41,2);c.closePath();c.fill();c.stroke();
   c.fillStyle=_c2;c.beginPath();c.arc(0,-s*0.12,s*0.09,0,7);c.fill();
  }else if(_hid==='halo'){
   c.globalAlpha=0.9;
   c.strokeStyle=_c1;c.lineWidth=Math.max(2.4,s*0.16);c.beginPath();c.ellipse(0,-s*0.62,_hw*0.42,s*0.13,0,0,7);c.stroke();
   c.strokeStyle=_c2;c.lineWidth=Math.max(1,s*0.07);c.beginPath();c.ellipse(0,-s*0.62,_hw*0.5,s*0.17,0,0,7);c.stroke();
   c.globalAlpha=1;
  }
  c.restore();
 }
 /* crest tuft on top */
 if(sp.crest){c.strokeStyle=sp.crest;c.lineWidth=Math.max(1.4,s*0.14);
  c.beginPath();c.moveTo(-s*0.12,cy-ry+s*0.06);c.lineTo(-s*0.2,cy-ry-s*0.22);
  c.moveTo(0,cy-ry);c.lineTo(0,cy-ry-s*0.28);
  c.moveTo(s*0.12,cy-ry+s*0.06);c.lineTo(s*0.2,cy-ry-s*0.22);c.stroke();}
 /* owl ear tufts */
 if(sp.tufts){c.fillStyle=sp.body;
  c.beginPath();c.moveTo(-rx*0.75,cy-ry*0.55);c.lineTo(-rx*0.55,cy-ry-s*0.25);c.lineTo(-rx*0.25,cy-ry*0.7);c.closePath();c.fill();
  c.beginPath();c.moveTo(rx*0.75,cy-ry*0.55);c.lineTo(rx*0.55,cy-ry-s*0.25);c.lineTo(rx*0.25,cy-ry*0.7);c.closePath();c.fill();}
 /* eyes — two, facing the player */
 const ey=cy-ry*0.28,ex=rx*0.42;
 if(sp.kind==='owl'){
  c.fillStyle='#f7efe0';c.beginPath();c.ellipse(-ex,ey,s*0.3,s*0.3,0,0,7);c.fill();
  c.beginPath();c.ellipse(ex,ey,s*0.3,s*0.3,0,0,7);c.fill();
  c.strokeStyle=ink;c.lineWidth=Math.max(1,s*0.08);
  c.beginPath();c.ellipse(-ex,ey,s*0.3,s*0.3,0,0,7);c.stroke();
  c.beginPath();c.ellipse(ex,ey,s*0.3,s*0.3,0,0,7);c.stroke();
 }
 if(o.blink){
  c.strokeStyle=ink;c.lineWidth=Math.max(1.2,s*0.12);
  c.beginPath();c.moveTo(-ex-s*0.12,ey);c.lineTo(-ex+s*0.12,ey);
  c.moveTo(ex-s*0.12,ey);c.lineTo(ex+s*0.12,ey);c.stroke();
 }else{
  c.fillStyle=ink;
  c.beginPath();c.arc(-ex,ey,Math.max(1.3,s*0.14),0,7);c.fill();
  c.beginPath();c.arc(ex,ey,Math.max(1.3,s*0.14),0,7);c.fill();
  c.fillStyle='#fff';
  c.beginPath();c.arc(-ex+s*0.05,ey-s*0.05,Math.max(0.6,s*0.05),0,7);c.fill();
  c.beginPath();c.arc(ex+s*0.05,ey-s*0.05,Math.max(0.6,s*0.05),0,7);c.fill();
 }
 /* knocked-down faces: wide panic eyes, then dizzy X-X */
 if(o.panic){
  c.fillStyle='#fff';c.beginPath();c.arc(-ex,ey,s*0.3,0,7);c.arc(ex,ey,s*0.3,0,7);c.fill();
  c.strokeStyle=ink;c.lineWidth=Math.max(1,s*0.08);c.beginPath();c.arc(-ex,ey,s*0.3,0,7);c.stroke();c.beginPath();c.arc(ex,ey,s*0.3,0,7);c.stroke();
  c.fillStyle=ink;c.beginPath();c.arc(-ex,ey+s*0.04,s*0.1,0,7);c.arc(ex,ey+s*0.04,s*0.1,0,7);c.fill();
 }
 if(o.dizzy){
  c.strokeStyle=ink;c.lineWidth=Math.max(1.4,s*0.1);c.lineCap='round';
  for(const _sd of[-1,1]){c.beginPath();
   c.moveTo(_sd*ex-s*0.11,ey-s*0.11);c.lineTo(_sd*ex+s*0.11,ey+s*0.11);
   c.moveTo(_sd*ex+s*0.11,ey-s*0.11);c.lineTo(_sd*ex-s*0.11,ey+s*0.11);c.stroke();}
 }
 /* beak, centered */
 const byk=ey+ry*0.34;
 if(sp.kind==='toucan'){
  c.fillStyle=sp.beak;c.beginPath();
  c.moveTo(-rx*0.5,byk-s*0.14);
  c.quadraticCurveTo(0,byk-s*0.3,rx*0.5,byk-s*0.14);
  c.quadraticCurveTo(rx*0.42,byk+s*0.55,0,byk+s*0.62);
  c.quadraticCurveTo(-rx*0.42,byk+s*0.55,-rx*0.5,byk-s*0.14);
  c.closePath();c.fill();
  c.strokeStyle=ink;c.lineWidth=Math.max(1,s*0.09);c.stroke();
 }else if(open){
  /* singing: open beak like the reference */
  c.fillStyle=sp.beak;c.beginPath();
  c.moveTo(-s*0.22,byk-s*0.06);c.lineTo(s*0.22,byk-s*0.06);c.lineTo(0,byk+s*0.06);c.closePath();c.fill();
  c.fillStyle='#8a4a2c';c.beginPath();
  c.moveTo(-s*0.16,byk+s*0.05);c.quadraticCurveTo(0,byk+s*0.42,s*0.16,byk+s*0.05);c.closePath();c.fill();
  c.strokeStyle=ink;c.lineWidth=Math.max(1,s*0.08);
  c.beginPath();c.moveTo(-s*0.22,byk-s*0.06);c.lineTo(s*0.22,byk-s*0.06);c.stroke();
 }else{
  c.fillStyle=sp.beak;c.beginPath();
  c.moveTo(-s*0.2,byk-s*0.08);c.lineTo(s*0.2,byk-s*0.08);c.lineTo(0,byk+s*0.16);c.closePath();c.fill();
 }
 /* cheeks, both sides */
 if(sp.cheek){c.fillStyle=sp.cheek;c.globalAlpha=0.55;
  c.beginPath();c.arc(-rx*0.62,ey+ry*0.3,s*0.15,0,7);c.fill();
  c.beginPath();c.arc(rx*0.62,ey+ry*0.3,s*0.15,0,7);c.fill();c.globalAlpha=1;}
 c.restore();
}
function drawDropGuides(){
 /* two dashed plumb lines + the block's CENTRE dot; colour tells the verdict live:
    gold = dead on the ✕ (perfect), green = any contact (stacks), red = zero contact (miss) */
 if(!G.moving||!G.stack.length||G.state!=='play')return;
 const m=G.moving,top=G.stack[G.stack.length-1];
 const cx=m.x+m.w/2, tcx=top.x+top.w/2;
 const gold=Math.abs(cx-tcx)<=perfectTol();
 const _Lg=Math.max(m.x,top.x),_Rg=Math.min(m.x+m.w,top.x+top.w);
 const valid=(_Rg-_Lg)>0; /* any contact stacks now — width never shrinks, only a total miss ends the run */
 const col=gold?'#c9942a':valid?'#5c8a4e':'#c9583f';
 const yTop=top.y+G.camY, yBot=m.y+G.camY+G.bh+2;
 if(yTop<-40||yTop>H+60)return;
 ctx.save();
 ctx.globalAlpha=TUT.on?0.95:0.38;
 ctx.strokeStyle=col;ctx.lineWidth=TUT.on?3:2;ctx.lineCap='round';ctx.setLineDash([5,6]);
 ctx.beginPath();ctx.moveTo(m.x+3,yBot);ctx.lineTo(m.x+3,yTop-2);
 ctx.moveTo(m.x+m.w-3,yBot);ctx.lineTo(m.x+m.w-3,yTop-2);ctx.stroke();
 ctx.setLineDash([]);
 /* centre-of-mass dot riding the landing line */
 const r0=TUT.on?4.6:3.4;
 ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx,yTop-G.bh*0.5,r0,0,7);ctx.fill();
 ctx.strokeStyle='#3b3230';ctx.lineWidth=1.6;ctx.stroke();
 if(gold&&SV.set.fx&&Math.random()<0.35)part({x:tcx+(Math.random()-0.5)*top.w*0.4,y:top.y-4,type:'twink',vx:0,vy:-20,g:6,life:0.4,size:2.6,col:'rgba(201,148,42,.8)'});
 ctx.restore();
}
function drawBirdOnTop(c,offY){
 if(!G.stack.length)return;
 const sp=byId(BIRDS,runEq('birds'))||BIRDS[0];
 const b=birdState(),top=G.stack[G.stack.length-1];
 const bw=isFinite(top.w)&&top.w>0?top.w:G.bw;
 const bh=isFinite(top.h)&&top.h>0?top.h:G.bh;
 const s=clamp(bh*1.15,10,20);
 let bx,by;
 if(birdChain()){ /* the fall drama owns the bird */
  drawBird(c,b.x,b.y+offY,s,sp,{squash:b.squash,stret:b.stret||0,wing:b.wing,blink:false,
   dir:b.dir||1,rot:b.rot||0,panic:b.panic,dizzy:b.dizzy,open:(b.st==='fall'||b.st==='land'),hat:runEq('hats')});
  return;
 }
 if(b.jump>=0){
  const p=clamp(b.jump/b.jumpDur,0,1);
  if(b.fall){
   const e=p*p; /* accelerating drop — the bird plummets straight down a level */
   bx=b.fromX+(b.toX-b.fromX)*e;
   by=b.fromY+(b.toY-b.fromY)*e;
  }else{
   const e=p*p*(3-2*p);
   bx=b.fromX+(b.toX-b.fromX)*e;
   by=b.fromY+(b.toY-b.fromY)*e - Math.sin(Math.PI*p)*bh*1.8;
  }
 }else{
  /* idle: the bird sits DEAD-CENTRE on the top block and never moves */
  bx=top.x+bw/2;
  by=top.y+Math.sin(b.t*2.3)*1.5;
  /* watch the moving block — the bird tracks the stacking action; it braces when the block digs in */
  if(G.moving&&isFinite(G.moving.x)){const _mc=G.moving.x+G.moving.w/2;b.dir=(_mc>=bx)?1:-1;}
  const _dig=clamp((G.perchHit||0)/26,0,1);
  b.tilt=_dig>0?-((G.moving&&G.moving.dir)||1)*_dig*0.5:0;
  b.squash=Math.max(b.squash||0,_dig*0.45);
 }
 b.hat=runEq('hats');drawBird(c,bx,by+offY,s,sp,b);
}
function updateBird(dt){
 const b=birdState();b.t+=dt;
 if(b.st&&b.st!=='idle'){birdChainTick(b,dt);return;}
 if(b.jump>=0){
  b.jump+=dt;
  const p=clamp(b.jump/b.jumpDur,0,1);
  b.wing=b.fall?Math.sin(p*Math.PI*9)*1.15
   :(p<0.34?Math.sin(p*Math.PI/0.34*2)*1.1
    :(p<0.66?0.22+Math.sin((p-0.34)/0.32*Math.PI)*0.35
     :Math.sin((p-0.66)*Math.PI/0.34*2)*0.9)); /* take-off flap → apex glide → landing flap; frantic while falling */
  b.stret=b.fall?0.3:Math.sin(p*Math.PI)*0.95; /* tucked fall vs. strong stretch in a hop */
  b.fln=Math.sin(Math.PI*p); b.squash=0;
  if(!b.fall&&SV.set.fx&&G.state==='play'){b.sparkT=(b.sparkT||0)-dt;
   if(b.sparkT<=0){b.sparkT=0.05;const _e=p*p*(3-2*p);
    part({x:b.fromX+(b.toX-b.fromX)*_e,y:b.fromY+(b.toY-b.fromY)*_e-Math.sin(Math.PI*p)*18,
     type:'twink',vx:(Math.random()-0.5)*20,vy:14,g:8,life:0.5,size:2.4,col:'rgba(244,230,184,.95)'});}}
  if(b.jump>=b.jumpDur){b.jump=-1;b.squash=b.fall?1.25:1;b.wing=0;b.stret=0;b.fall=false;b.slide=null;} /* hard squash after a fall */
 }else{
  b.wing*=Math.max(0,1-dt*6);
  b.stret*=Math.max(0,1-dt*6);
  b.squash*=Math.max(0,1-dt*3.0);              /* squash decays as the bird settles */
  b.nextBlink-=dt;
  if(b.nextBlink<=0){b.blink=0.13;b.nextBlink=1.8+Math.random()*2.6;}
  if(b.ret){b.ret.t=(b.ret.t||0)+dt;
   if(G.state!=='play')b.ret=null;
   else if(b.ret.t>=b.ret.delay){const r=b.ret;b.ret=null;b.slide=null;birdJump(b.toX,b.toY,r.tx,r.ty);}}
 }
 if(b.blink>0)b.blink-=dt;else b.blink=0;
 b.breath=Math.sin(b.t*3.2)*0.055;             /* breathing */
 b.wingIdle=(Math.sin(b.t*1.8)*0.5+0.5)*0.16;  /* subtle idle wing sway */
}
function drawGround(){
 const c=tower.c.getContext('2d');c.setTransform(tower.dpr,0,0,tower.dpr,0,0);
 const w=WORLD(),gy=G.groundY-tower.topY;
 blockPath(c,-10,gy,W+20,180,999);c.fillStyle=w.ground;c.fill();c.strokeStyle='#3b3230';c.lineWidth=3.5;c.stroke();
 c.strokeStyle='rgba(59,50,48,.15)';c.lineWidth=2;
 for(let x=6;x<W;x+=24){c.beginPath();c.moveTo(x,gy+12);c.lineTo(x+13,gy+38);c.stroke();}
 const r=rng(777);
 c.strokeStyle='rgba(59,50,48,.4)';c.lineWidth=2;
 for(let i=0;i<9;i++){const x=15+r()*(W-30);
  c.beginPath();c.moveTo(x,gy+2);c.lineTo(x-3,gy-7);c.moveTo(x,gy+2);c.lineTo(x+1,gy-8);c.stroke();}
 for(let i=0;i<6;i++)jcircle(c,20+rng(880+i)()*(W-40),gy+10+r()*10,2.5+r()*2.5,rng(88+i),'rgba(59,50,48,.18)',null,0);
}
function drawOnTower(b,f){
 const c=tower.c.getContext('2d');c.setTransform(tower.dpr,0,0,tower.dpr,0,0);
 const ly=b.y-tower.topY;
 if(!isFinite(ly)||!isFinite(b.x)||!(b.w>0))return; /* defensive: never bake invalid geometry */
 drawBlock(c,{x:b.x,y:ly,w:b.w,h:G.bh,seed:b.seed},runEq('skins'),runEq('themes'));
 drawDeco(c,{x:b.x,y:ly,w:b.w,h:G.bh,seed:b.seed},f||G.floor);
}
function towerAdd(b){
 if(!G.stack.length)return;
 const bottom=G.groundY+180;
 const topBlock=G.stack[G.stack.length-1];
 const topY=topBlock.y-G.bh*25;
 if(tower&&isFinite(tower.topY)&&topY>=tower.topY){drawOnTower(b);return;}
 const h=Math.ceil(bottom-topY);
 if(!isFinite(h)||h<=0)return; /* defensive: never create an invalid tower canvas */
 let tdpr=DPR;
 if(Math.ceil(h*tdpr)>TOWER_MAX_DIM||Math.ceil(W*tdpr)>TOWER_MAX_DIM)tdpr=1; /* stay valid even for huge towers */
 const cnv=document.createElement('canvas');
 cnv.width=Math.max(2,Math.min(TOWER_MAX_DIM,Math.ceil(W*tdpr)));
 cnv.height=Math.max(2,Math.min(TOWER_MAX_DIM,Math.ceil(h*tdpr)));
 tower={c:cnv,topY,h,dpr:tdpr};
 drawGround();G.stack.forEach((bb,i)=>drawOnTower(bb,i+1));
}
function towerReset(){tower=null;if(G.stack.length)towerAdd(G.stack[G.stack.length-1]);}

/* ================= PARTICLES ================= */
const PMAX=170;
function part(o){if(G.parts.length>PMAX)G.parts.shift();
 G.parts.push(Object.assign({t:0,vx:0,vy:0,g:0,rot:0,vr:0,life:0.8,size:5,type:'spark',col:'#f5c84e'},o));}
function textPart(x,y,txt,col,size){part({x,y,type:'text',txt,col,size,vy:-60,life:1});}
function scribPts(){const a=[];for(let i=0;i<5;i++)a.push([(Math.random()-0.5)*16,(Math.random()-0.5)*16]);return a;}
function dustFx(x,y){const m=SV.set.fx?3:1;
 for(let i=0;i<m;i++)part({x:x+(Math.random()-0.5)*20,y,vx:(Math.random()-0.5)*60,vy:-30-Math.random()*40,g:-30,
  life:0.5+Math.random()*0.3,type:'dust',col:'rgba(130,115,100,.45)',size:4+Math.random()*4});}
function burstFx(cx,y,kind){
 /* kind: 'perfect' | 'milestone' | 'mega' — hand-drawn impact bursts */
 const fx=runEq('fxs');
 const mul=kind==='mega'?2.2:kind==='milestone'?1.6:1;
 const n=Math.round((SV.set.fx?10:5)*mul);
 for(let i=0;i<n;i++){
  const a=Math.PI*2*i/n,d=10+Math.random()*40*mul;
  const o={x:cx+Math.cos(a)*d,y:y+Math.sin(a)*d*0.5,vx:Math.cos(a)*(90+60*mul),vy:-80-Math.random()*(120+80*mul),g:300,
   life:0.6+Math.random()*0.4,rot:Math.random()*6,vr:(Math.random()-0.5)*6};
  if(fx==='sparkle')part(Object.assign(o,{type:'spark',col:kind==='mega'?'#f0a03c':'#f5c84e',size:(5+Math.random()*4)*(mul>1?1.3:1)}));
  else if(fx==='scribble')part(Object.assign(o,{type:'scrib',col:'#3b3230',size:5,pts:scribPts()}));
  else if(fx==='confetti')part(Object.assign(o,{type:'conf',col:CONF[i%CONF.length],size:6+Math.random()*4}));
  else if(fx==='inksplat')part(Object.assign(o,{type:'dust',col:'rgba(59,50,48,.5)',size:4+Math.random()*5}));
  else if(fx==='fireworks')part(Object.assign(o,{type:'star',col:CONF[i%CONF.length],size:5+Math.random()*4}));
  else part(Object.assign(o,{type:'heart',col:'#ef7d9d',size:5+Math.random()*4}));
 }
}
function perfectFx(cx,y,w,kind){
 burstFx(cx,y,kind||'perfect');
 part({x:cx,y:y-14,vy:-70,type:'text',txt:'PERFECT!',size:24,col:'#e2694f',rot:-0.06,life:0.9});
 if(G.combo>=3){
  const m=SV.set.fx?1:0.5;
  for(let i=0;i<Math.round(6*m);i++){const a=Math.PI*2*i/6;
   part({x:cx,y,type:'star',vx:Math.cos(a)*140,vy:Math.sin(a)*90-60,g:250,life:0.7,col:'#f0a03c',size:6,rot:Math.random()*3,vr:5});}
  textPart(cx,y-44,'COMBO ×'+G.combo,'#f0a03c',20);
 }
 sfx(G.combo>=2?'combo':'perfect',G.combo);buzz(G.combo>=2?[12,40,12]:20);
}
function confettiBurst(n){
 const m=SV.set.fx?n:Math.min(8,Math.ceil(n/3));
 for(let i=0;i<m;i++)part({x:W/2+(Math.random()-0.5)*W*0.7,y:-G.camY+H*0.18,type:'conf',col:CONF[i%CONF.length],
  vx:(Math.random()-0.5)*260,vy:-60-Math.random()*180,g:420,life:1.4+Math.random()*0.6,size:6+Math.random()*5,
  rot:Math.random()*6,vr:(Math.random()-0.5)*10});
}
function drawParts(c){
 for(const p of G.parts){
  const k=1-p.t/p.life;let a=clamp(k,0,1);
  if(p.ph!==undefined)a*=0.35+0.65*Math.abs(Math.sin(p.t*2.2+p.ph));
  c.save();c.translate(p.x,p.y+G.camY);c.rotate(p.rot||0);c.globalAlpha=a;
  switch(p.type){
   case 'spark':{c.strokeStyle=p.col;c.lineWidth=2.4;c.lineCap='round';const s=p.size*(0.5+k*0.8);
    c.beginPath();c.moveTo(-s,0);c.lineTo(s,0);c.moveTo(0,-s);c.lineTo(0,s);
    c.moveTo(-s*0.5,-s*0.5);c.lineTo(s*0.5,s*0.5);c.moveTo(-s*0.5,s*0.5);c.lineTo(s*0.5,-s*0.5);c.stroke();break;}
   case 'star':c.fillStyle=p.col;star5(c,0,0,p.size,p.size*0.45,p.rot);c.fill();break;
   case 'dust':c.fillStyle=p.col;c.beginPath();c.arc(0,0,p.size*(1+(1-k)*1.6),0,7);c.fill();break;
   case 'conf':c.fillStyle=p.col;c.strokeStyle='rgba(59,50,48,.5)';c.lineWidth=1.2;
    c.fillRect(-p.size/2,-p.size/2.6,p.size,p.size/1.3);c.strokeRect(-p.size/2,-p.size/2.6,p.size,p.size/1.3);break;
   case 'coin':drawCoinShape(c,0,0,p.size,p.style);break;
   case 'text':c.font='bold '+p.size+'px '+HAND;c.textAlign='center';c.textBaseline='middle';
    c.lineWidth=5;c.strokeStyle='rgba(247,239,224,.9)';c.strokeText(p.txt,0,0);
    c.fillStyle=p.col;c.fillText(p.txt,0,0);break;
   case 'scrib':c.strokeStyle=p.col;c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(0,0);
    for(const q of p.pts)c.lineTo(q[0],q[1]);c.stroke();break;
   case 'heart':{c.fillStyle=p.col;const s=p.size;c.beginPath();c.moveTo(0,s*0.35);
    c.bezierCurveTo(-s,-s*0.4,-s*0.35,-s,0,-s*0.35);c.bezierCurveTo(s*0.35,-s,s,-s*0.4,0,s*0.35);c.fill();break;}
   case 'snow':c.fillStyle='#fff';c.strokeStyle='rgba(120,140,160,.6)';c.lineWidth=1;
    c.beginPath();c.arc(0,0,p.size,0,7);c.fill();c.stroke();break;
   case 'petal':c.fillStyle=p.col;c.beginPath();c.ellipse(0,0,p.size,p.size*0.55,0,0,7);c.fill();break;
   case 'leafp':c.fillStyle=p.col;c.beginPath();c.ellipse(0,0,p.size,p.size*0.45,0,0,7);c.fill();
    c.strokeStyle='rgba(46,92,40,.5)';c.lineWidth=1.2;c.beginPath();c.moveTo(-p.size,0);c.lineTo(p.size,0);c.stroke();break;
   case 'ember':c.fillStyle=p.col;c.beginPath();c.arc(0,0,p.size,0,7);c.fill();
    c.globalAlpha=a*0.35;c.beginPath();c.arc(0,0,p.size*2,0,7);c.fill();break;
   case 'twink':c.strokeStyle=p.col;c.lineWidth=1.6;c.beginPath();
    c.moveTo(-p.size,0);c.lineTo(p.size,0);c.moveTo(0,-p.size);c.lineTo(0,p.size);c.stroke();break;
   case 'featherp':c.save();c.rotate(p.rot);c.fillStyle=p.col;c.strokeStyle='rgba(59,50,48,.55)';c.lineWidth=1.2;
    c.beginPath();c.ellipse(0,0,p.size*0.45,p.size,0,0,7);c.fill();c.stroke();
    c.beginPath();c.moveTo(0,-p.size);c.lineTo(0,p.size);c.stroke();c.restore();break;
   case 'notep':c.fillStyle=p.col;c.strokeStyle=p.col;c.lineWidth=1.8;
    c.beginPath();c.ellipse(-p.size*0.3,p.size*0.4,p.size*0.34,p.size*0.26,-0.4,0,7);c.fill();
    c.beginPath();c.moveTo(-p.size*0.02,p.size*0.36);c.lineTo(-p.size*0.02,-p.size*0.6);c.stroke();
    c.beginPath();c.moveTo(-p.size*0.02,-p.size*0.6);c.quadraticCurveTo(p.size*0.5,-p.size*0.45,p.size*0.42,-p.size*0.1);c.stroke();break;
   case 'cloudp':c.fillStyle=p.col;c.beginPath();c.arc(0,0,p.size,0,7);c.arc(p.size*0.8,p.size*0.2,p.size*0.7,0,7);c.fill();break;
   case 'dash':c.strokeStyle=p.col;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(-p.size,0);c.lineTo(p.size,0);c.stroke();break;
   case 'bubble':c.strokeStyle=p.col;c.lineWidth=1.8;c.beginPath();c.arc(0,0,p.size,0,7);c.stroke();
    c.beginPath();c.arc(-p.size*0.3,-p.size*0.3,p.size*0.25,0,7);c.stroke();break;
  }
  c.restore();
 }
}

/* ================= GAMEPLAY ================= */
/* dynamic difficulty: active from the start, smooth curve upward, forgiving early tolerances.
   Speed scales with the actual travel range + screen size so crossing-time stays fair on every device. */
/* one-way crossing: speed scales with screen width so reaction time stays fair on every device */
function speed(){
 const f=G.floor;
 let s=130+400*(1-Math.exp(-f/50));
 s*=clamp(W/430,0.85,1.4);
 s*=clamp(H/760,0.9,1.15);
 if(TUT.on)s*=tutMul();
 if(G.fever.on)s*=1.18;
 return Math.max(70,s);
}
function tutMul(){if(!TUT.on)return 1;return TUT.step===2?0.55:TUT.step===3?0.7:TUT.step===4?0.6:0.9;}
function perfectTol(){const f=G.floor;return f<3?21:f<8?17:f<20?14:f<45?11:9;}
function startGame(withChal){
 unlockAudio();
 /* apply "try for free" trial cosmetics for this run only */
 G.useCosmetics=null;
 if(G.trial){const t=findItem(G.trial.id);
  if(t&&!SV.owned[G.trial.id]){G.useCosmetics=Object.assign({},SV.eq);G.useCosmetics[t.cat]=G.trial.id;
   toast(ICONS.spark+'<span>Trying <b>'+t.it.n+'</b> free for this run!</span>');}}
 G.trial=null;
 G.state='play';G.stack=[];G.pieces=[];G.parts=[];G.floor=0;G.score=0;G.coins=0;G.combo=0;G.runCombo=0;
 G.perfectsRun=0;G.lives=3;G.perchHit=0;G.doubleUsed=false;G.camY=0;G.camT=0;G.shake=0;G.side=1;G.spawnT=0;G.moving=null;G.trailT=0; /* moving block exists on frame one */
 G.drops=0;G.bounce=0;G.slowT=0;G.fever={on:false,t:0};G.feverRun=false;G.goldRun=false;G.goldAt=-99;G.specAt=-99;G.camX=0;
 G.chal=!!withChal;G.chalDone=false;G.chalName=withChal?curChal().n:'';G.fambT=0;
 G.bw=calcBw();G.bh=calcBh();G.groundY=H-Math.max(64,H*0.12);
 const baseW=calcBaseW(); /* uniform compact tower like the reference: base == plank width, centered */
 const base={x:W/2-baseW/2,w:baseW,h:G.bh,y:G.groundY-G.bh,seed:11};
 G.stack.push(base);towerReset();
 G.runStartBest=SV.bestH;G.runStartBestScore=SV.bestScore;
 SV.games++;questEvent('run',1);
 go(null);$('#hud').classList.add('on');updateHUD();setCombo();updateChalChip();CG.gstart();
 G.camT=camTarget();G.camY=G.camT;
 /* reset the bird: it perches on the base block, ready to hop with each drop */
 G.bird=null;birdState();
 spawnMoving(); /* first frame already shows base block + moving block + bird */
 const t=todayStr();if(SV.lastDay!==t){SV.lastDay=t;SV.days++;checkAch(false);}
 TUT.on=!SV.tut;
 if(TUT.on){TUT.step=-1;TUT.tries=0;G.moving=null;tutNext();}else $('#tut').classList.remove('on');
 if(SV.set.music)Music.start();
 checkAch(true);save();
}
function spawnMoving(){
 const top=G.stack[G.stack.length-1];
 /* ONE-WAY mechanic: every block enters from a RANDOM side and flies across exactly once — never comes back */
 G.side=Math.random()<0.5?1:-1;
 G.perchHit=0;G.slowFired=false; /* the bird never moves: it perches dead-centre and acts as the solid stop */
 const mw=G.bw; /* fixed small uniform rectangle — size never changes */
 const m={w:mw,h:G.bh,y:top.y-G.bh,seed:(Math.random()*1e9)|0,dir:G.side};
 /* start half-visible at the entry edge, so the very first frame already shows it */
 m.x=(G.side>0)?-mw/2:W-mw/2;
 G.moving=m;
 /* rare golden blocks */
 if(G.floor>=4&&G.floor-G.goldAt>=12&&Math.random()<0.08){
  G.moving.golden=true;G.goldAt=G.floor;
  textPart(clamp(G.moving.x+G.moving.w/2,40,W-40),G.moving.y-16,'GOLDEN!','#c9942a',18);
 }
 /* occasional special blocks */
 else if(G.floor>=6&&G.floor-G.specAt>=14&&Math.random()<0.075){
  G.moving.spec=['magnet','star'][Math.floor(Math.random()*2)];G.specAt=G.floor;
  const nm={magnet:'MAGNET BLOCK!',star:'LUCKY BLOCK!'};
  textPart(clamp(G.moving.x+G.moving.w/2,40,W-40),G.moving.y-16,nm[G.moving.spec],'#5c8a4e',15);
  sfx('special');
 }
}
/* ONE-WAY TIMEOUT: the block flew past untapped — the bird falls down one level,
   the top block breaks off, and play continues (forgiving). Only losing the lone
   base block ends the run. */
function timeoutMiss(){
 /* block flew past completely untapped — zero contact with the tower, so the run ends here */
 if(G.state!=='play'||!G.moving)return;
 G.moving=null;
 textPart(W/2,-G.camY+H*0.32,'MISSED!','#c9583f',22);
 if(TUT.on)tutEvent('escape');
 G.combo=0;setCombo();endFever(true);updateHUD();
 sfx('near');buzz([40,40,40]);G.shake=Math.max(G.shake,SV.set.fx?4:2);
 gameOver();
}
function loseLife(){
 /* hearts system removed — only a total miss (zero contact) ends a run now */
 return false;
}
/* THE BIRD IS SOLID: an untapped block digs into it and knocks it off the tower.
   The bird falls down (then flies back), 1 heart is lost — but the BLOCK stays:
   it stacks right where it stopped. The tower keeps growing. */
function collisionDrop(){
 /* untapped block reaches the solid bird: the BIRD gets knocked off with the full fall
   animation — the block STAYS and stacks, as long as it touches the tower at all. */
 if(G.state!=='play'||!G.moving)return;
 const m=G.moving,top=G.stack[G.stack.length-1];
 G.moving=null;
 const _L2=Math.max(m.x,top.x),_R2=Math.min(m.x+m.w,top.x+top.w);
 if(_R2-_L2<=0){ /* zero contact at the bird bump: a true miss ends the run */
  G.pieces.push({x:m.x,y:m.y,w:m.w,h:G.bh,vy:-60,vr:m.dir*2.5,rot:0,seed:m.seed});
  textPart(clamp(m.x+m.w/2,50,W-50),m.y-18,'TOO FAR!','#c9583f',17);
  gameOver();
  return;
 }
 G.drops++;
 sfx('drop');buzz(28);
 G.combo=0;setCombo();endFever(false);
 G._hit=true;
 placeBlock(clamp(m.x,-20,W-m.w+20),m.w,false,m,top.w);
 G._hit=null;
 textPart(W/2,-G.camY+H*0.30,'BIRD DOWN!','#b8443a',21);
 startBirdFall(m.dir);            /* ← the show begins */
 if(TUT.on)tutEvent('bird');
 chalCheck(false);updateChalChip();
}
function dropBlock(){
 if(TUT.on&&TUT.blockTap&&G.moving){ /* tutorial "just watch" step */
  textPart(clamp(G.moving.x+G.moving.w/2,60,W-60),G.moving.y-16,'WATCH!','#5c8a4e',15);return;}
 if(G.state!=='play'||!G.moving||G.spawnT>0)return;
 const m=G.moving,top=G.stack[G.stack.length-1];
 const mw=m.w; /* fixed uniform width — blocks are never cut thinner */
 /* STACKING RULE: any contact at all with the block below — it stacks, full width,
    unshrunk. Zero contact (a total miss) ends the run right away; no hearts. */
 const cx=m.x+mw/2;
 const _L=Math.max(m.x,top.x),_R=Math.min(m.x+mw,top.x+top.w);
 const _ovp=Math.max(0,_R-_L);
 m._ov=_ovp/mw; /* contact fraction — feeds the CLOSE! drama */
 const onTower=_ovp>0;
 G.drops++;
 sfx('drop');buzz(15);
 if(!onTower){
  /* the plank misses the tower completely — that's a true miss, run over */
  G.pieces.push({x:m.x,y:m.y,w:m.w,h:G.bh,vy:-60,vr:m.dir*2.5,rot:0,seed:m.seed});
  G.moving=null;
  G.combo=0;setCombo();endFever(true);
  textPart(clamp(m.x+m.w/2,50,W-50),m.y-18,'TOO FAR!','#c9583f',17);
  sfx('near');buzz([40,40]);G.shake=Math.max(G.shake,SV.set.fx?5:2);
  try{const _bb=birdState();if(!birdBusy()){_bb.wing=1;_bb.stret=0.55;chirp();}}catch(e){}
  if(TUT.on)tutEvent('slid');
  updateHUD();
  gameOver();return;
 }
 m._dist=Math.abs(cx-(top.x+top.w/2)); /* how far the centre dot is from the ✕ mark */
 /* PERFECT = the block's centre dot lands on the ✕ mark — which the bird is standing on. */
 const tol=perfectTol();
 let perfect=m._dist<=tol;
 /* magnet special: generous snap */
 if(!perfect&&m.spec==='magnet'&&m._dist<=tol*2.2){perfect=true;textPart(m.x+m.w/2,m.y-14,'MAGNET!','#5c8a4e',17);}
 let nx;
 if(perfect){nx=top.x;G.combo++;}
 else{
  G.combo=0;
  endFever(false);
  nx=clamp(m.x,-20,W-mw+20); /* full fixed-size block placed exactly where dropped */
  dustFx(cx-m.w*0.35,m.y+G.bh*0.5);dustFx(cx+m.w*0.35,m.y+G.bh*0.5); /* dust at the contact edges */
 }
 placeBlock(nx,mw,perfect,m,top.w);
}
function placeBlock(x,w,perfect,m,prevW){
 const top=G.stack[G.stack.length-1];
 const b={x,w,h:G.bh,y:top.y-G.bh,seed:(Math.random()*1e9)|0};
 /* the bird hops from the old top block to the new one — the drop action carries the bird along */
 if(!G._hit)birdJump(top.x+top.w/2,top.y,b.x+b.w/2,b.y); /* on a knock-down, startBirdFall runs instead */
 G.stack.push(b);towerAdd(b);
 G.floor++;
 /* keep the tower visually centered: ease the whole stack toward screen centre (smooth follow) */
 {const _bc=b.x+b.w/2,_sh=(W/2-_bc); /* the tower is ALWAYS kept dead-centre on screen */
  if(isFinite(_sh)&&Math.abs(_sh)>0.5){
   for(const _b of G.stack){_b.x=clamp(_b.x+_sh,-12,Math.max(-12,W-_b.w+12));}
   if(G.bird){G.bird.fromX+=_sh;G.bird.toX+=_sh;G.perchHit=0;if(G.bird.ret)G.bird.ret.tx+=_sh;}
   towerReset();}}
 let pts=10,cn=1;
 if(perfect){
  G.perfectsRun++;SV.perfects++;questEvent('perfect',1);
  pts=25+G.combo*5;cn=2;
  G.runCombo=Math.max(G.runCombo,G.combo);SV.bestCombo=Math.max(SV.bestCombo,G.combo);
  perfectFx(x+w/2,b.y,w,G.combo>=10?'milestone':'perfect');
  G.bounce=1; /* camera bounce */
  comboMilestone(G.combo);
  streakReward(G.combo,x+w/2,b.y);
  if(G.combo>=8&&!G.fever.on)startFever(); /* fever mode! */
 }else{
  dustFx(x+w*0.2,b.y+G.bh*0.5);dustFx(x+w*0.8,b.y+G.bh*0.5);
  G.bounce=Math.max(G.bounce,0.45);
  /* near-miss slow motion (thin overlap with the tower) */
  const _ov=(m&&m._ov!=null)?m._ov:1; /* near the 30% cliff-edge? make a fuss */
  if(_ov<0.45&&SV.set.fx){G.slowT=0.5;SV.nearMisses++;textPart(x+w/2,b.y-30,'CLOSE!','#c9583f',22);sfx('near');buzz([40]);checkAch(true);}
  else if(_ov<0.45){SV.nearMisses++;textPart(x+w/2,b.y-30,'CLOSE!','#c9583f',20);}
 }
 /* golden block bonus */
 if(m&&m.golden){G.goldRun=true;SV.goldStacked++;cn+=15;pts+=40;
  sfx('golden');buzz([15,30,15]);
  burstFx(x+w/2,b.y,'milestone');
  textPart(x+w/2,b.y-32,'+'+15+' GOLD!','#c9942a',19);
  questEvent('gold',1);checkAch(true);}
 /* lucky star special: 5x coins for this drop */
 if(m&&m.spec==='star'){cn*=5;textPart(x+w/2,b.y-46,'JACKPOT! ×5','#c9942a',19);sfx('coin');}
 if(G.fever.on){cn*=2;}
 if(G.combo>=3&&G.combo%5===0)cn+=5;
 G.score+=pts;G.coins+=cn;SV.coins+=cn;SV.coinsEarned+=cn;SV.blocks++;
 questEvent('coin',cn);questEvent('block',1);
 SV.bestH=Math.max(SV.bestH,G.floor);SV.bestScore=Math.max(SV.bestScore,G.score);
 SV.wbest[SV.world]=Math.max(SV.wbest[SV.world]||0,G.floor);
 for(let i=0;i<Math.min(3,cn);i++)part({x:x+w/2+(Math.random()-0.5)*w*0.5,y:b.y,type:'coin',
  vx:(Math.random()-0.5)*120,vy:-200-Math.random()*80,g:500,life:0.8,size:8,style:runEq('coins')});
 floorMilestones();
 worldMilestone();
 worldUnlockCheck();checkAch(true);updateHUD();setCombo();chalCheck(false);updateChalChip();
 if(TUT.on)tutEvent(perfect?'perfect':'placed');
 G.spawnT=0.09;G.moving=null; /* next block appears almost instantly, right above the tower */
 save();
}
function comboMilestone(n){
 if(n===5){textPart(W/2,-G.camY+H*0.3,'×5 COMBO!','#f0a03c',24);sfx('combo',n);}
 else if(n===10){banner('COMBO ×10!');confettiBurst(12);earnBonus(5);sfx('mile');}
 else if(n===20){banner('COMBO ×20!!');confettiBurst(20);G.shake=Math.max(G.shake,SV.set.fx?6:2);earnBonus(15);sfx('mile');buzz([20,40,20]);}
 else if(n===50){banner('COMBO ×50!!!');confettiBurst(36);G.shake=Math.max(G.shake,SV.set.fx?9:3);earnBonus(40);sfx('record');buzz([20,30,20,30,40]);}
 else if(n>50&&n%25===0){banner('×'+n+' UNSTOPPABLE!');confettiBurst(24);earnBonus(25);sfx('record');}
}
function streakReward(n,cx,y){
 /* perfect-streak bonus coins at special thresholds */
 if(n===8||n===15||n===25||n===40||n===60){
  const bonus=Math.round(n*0.8);
  earnBonus(bonus);sfx('streak');buzz([12,30,12,30,12]);
  textPart(cx,y-60,'PERFECT STREAK +'+bonus,'#e2694f',20);
  for(let i=0;i<8;i++){const a=Math.PI*i/8;
   part({x:cx,y,type:'spark',vx:Math.cos(a)*170,vy:-Math.abs(Math.sin(a))*160-40,g:260,life:0.8,col:'#f0c34e',size:6,rot:a,vr:4});}
 }
}
function earnBonus(n){G.coins+=n;SV.coins+=n;SV.coinsEarned+=n;questEvent('coin',n);}
function floorMilestones(){
 const f=G.floor;
 const tiers={10:{t:'10 FLOORS!',c:10,n:8},25:{t:'25 FLOORS!',c:25,n:14},50:{t:'50 FLOORS!',c:60,n:22},100:{t:'100 FLOORS!!',c:120,n:32}};
 if(tiers[f]){const T=tiers[f];banner(T.t);earnBonus(T.c);confettiBurst(T.n);
  G.shake=Math.max(G.shake,SV.set.fx?(f>=50?10:6):3);sfx(f>=50?'record':'mile');buzz([30,50,30]);
  for(let i=0;i<3;i++)part({x:W/2,y:-G.camY+H*0.3,type:'coin',vx:(Math.random()-0.5)*200,vy:-260,g:500,life:1,size:9,style:runEq('coins')});}
 else if(f>100&&f%50===0){banner(f+' FLOORS!');earnBonus(60);confettiBurst(24);G.shake=Math.max(G.shake,SV.set.fx?8:3);sfx('mile');buzz([30,50,30]);}
}
function worldMilestone(){
 const key=SV.world+'_'+G.floor;
 const tiers=[10,25,50],rew=[30,60,120];
 const i=tiers.indexOf(G.floor);
 if(i>=0&&!SV.wqrew[key]){SV.wqrew[key]=1;earnBonus(rew[i]);
  toast(ICONS.globe+'<span><b>'+WORLD().n+' milestone '+G.floor+'!</b> +'+rew[i]+' coins</span>');sfx('worldgo');save();}
}
function startFever(){
 G.fever={on:true,t:9};G.feverRun=true;
 SV.feverCount++;
 banner('FEVER TIME!');sfx('fever');buzz([15,25,15,25,45]);
 $('#comboWrap').classList.add('fever');
 if(SV.set.fx)confettiBurst(10);
 checkAch(true);
}
function endFever(silent){
 if(!G.fever.on)return;
 G.fever.on=false;G.fever.t=0;
 $('#comboWrap').classList.remove('fever');
 if(!silent)textPart(W/2,-G.camY+H*0.35,'fever end','#6d5f57',14);
}
function milestone(n){/* legacy compat no-op */}
function worldUnlockCheck(){
 for(const w of WORLDS){if(SV.bestH>=w.req&&!SV.wrew[w.id]){SV.wrew[w.id]=1;SV.coins+=50;SV.coinsEarned+=50;
  toast(ICONS.gift+'<span><b>'+w.n+' world unlocked!</b> +50 coins</span>');sfx('ach');}}
}
function gameOver(){
 G.state='over';G.resultAt=performance.now();sfx('over');buzz(90);G.shake=10;
 endFever(true);updateChalChip();
 $('#comboWrap').classList.remove('on','fever');
 tutEnd();chalCheck(true);
 questEvent('floor',G.floor);
 if(G.floor>=10&&G.drops>0){const acc=G.floor/G.drops*100;if(acc>SV.bestAcc)SV.bestAcc=Math.round(acc);}
 const rec=G.floor>G.runStartBest;
 if(rec){CG.happy();setTimeout(()=>{if(curScreen==='result'){sfx('record');confettiBurst(30);}},1000);}
 setTimeout(()=>showResult(rec),900);
 save();
}
function showResult(rec){
 const _bd=$('#btnDouble');if(_bd)_bd.classList.toggle('hidden',!(G.coins>0&&!G.doubleUsed));
 $('#resTitle').textContent=rec?'WHAT A TOWER!':'TOWER TOPPLED!';
 $('#resStamp').classList.toggle('show',rec&&G.floor>4);
 $('#rH').textContent=G.floor;$('#rS').textContent=G.score;$('#rC').textContent=G.coins;
 $('#rP').textContent=G.perfectsRun;$('#rK').textContent=G.runCombo;
 const cmp=$('#rCmp');
 if(rec){cmp.textContent=G.runStartBest+' → '+G.floor+' ▲';}
 else{cmp.textContent=''+Math.max(G.runStartBest,G.floor);}
 const acc=G.drops>0?Math.round(G.floor/G.drops*100):0;
 const pr=G.floor>0?Math.round(G.perfectsRun/G.floor*100):0;
 $('#rAcc').textContent=acc+'%';$('#rPR').textContent=pr+'%';
 const rc=$('#rChal');
 if(G.chal||G.chalDone){rc.classList.remove('hidden');
  if(G.chalDone){rc.classList.add('ok');rc.textContent='CHALLENGE COMPLETE!';}
  else{rc.classList.remove('ok');rc.textContent='Challenge "'+G.chalName+'" — not this time!';}}
 else rc.classList.add('hidden');
 go('result');updateCoinsUI();checkAch(false);
}
function pauseGame(){if(G.state!=='play')return;G.state='pause';$('#pFloor').textContent=G.floor;Music.stop();go('pause');}
function resumeGame(){if(G.state!=='pause')return;G.state='play';last=performance.now();if(SV.set.music)Music.start();go(null);CG.gstart();}
function goHome(){G.state='menu';G.useCosmetics=null;Music.stop();tower=null;G.stack=[];G.parts=[];G.pieces=[];G.moving=null;
 $('#comboWrap').classList.remove('on','fever');$('#chalChip').classList.remove('on');renderMenu();go('menu');}

/* ================= UPDATE / RENDER ================= */
let feverGlow=null;
function buildFeverGlow(){
 feverGlow=document.createElement('canvas');
 feverGlow.width=Math.max(2,Math.ceil(W*DPR*0.5));feverGlow.height=Math.max(2,Math.ceil(H*DPR*0.5));
 const c=feverGlow.getContext('2d');
 const w=feverGlow.width,h=feverGlow.height;
 const g=c.createRadialGradient(w/2,h*0.55,Math.min(w,h)*0.32,w/2,h*0.55,Math.max(w,h)*0.72);
 g.addColorStop(0,'rgba(240,160,60,0)');g.addColorStop(1,'rgba(226,105,79,.55)');
 c.fillStyle=g;c.fillRect(0,0,w,h);
}
function update(dt){
 /* near-miss slow motion timescale */
 let ts=1;
 if(G.slowT>0){G.slowT-=dt;ts=0.32+0.68*clamp(1-G.slowT/0.5,0,1);if(G.slowT<0)G.slowT=0;}
 const gdt=dt*ts;
 if(G.spawnT>0&&!(TUT.on&&TUT.freeze)){G.spawnT-=gdt;if(G.spawnT<=0&&G.state==='play')spawnMoving();}
 if(G.moving&&G.state==='play'&&!(TUT.on&&TUT.freeze)){
  G.moving.x+=G.moving.dir*speed()*gdt;
  /* one-way flight: leaves the far edge untapped (bird was airborne) = soft miss -> -1 heart only */
  if((G.moving.dir>0&&G.moving.x>W+50)||(G.moving.dir<0&&G.moving.x+G.moving.w<-50)){timeoutMiss();}
  if(G.moving){
  G.trailT-=gdt;
  const tr=runEq('trails');
  if(G.trailT<=0&&tr!=='none'&&SV.set.fx){G.trailT=0.05;spawnTrail();}
  if(G.moving.golden&&SV.set.fx&&Math.random()<gdt*14){
   part({x:G.moving.x+Math.random()*G.moving.w,y:G.moving.y+Math.random()*G.bh,type:'spark',
    vx:(Math.random()-0.5)*40,vy:-40-Math.random()*40,g:60,life:0.5,size:3.5,col:'#f0c34e'});}
  if(G.fever.on&&SV.set.fx&&Math.random()<gdt*18){
   part({x:G.moving.x+(G.moving.dir>0?0:G.moving.w),y:G.moving.y+G.bh/2,type:'ember',
    vx:-G.moving.dir*(40+Math.random()*50),vy:(Math.random()-0.5)*40,life:0.45,size:3,col:'#f08c3c'});}
  }
  if(G.moving){
   /* SOLID BIRD dead-centre: the block's dig depth past the tower centre. Tapping inside the
      dig zone is the PERFECT landing. Dig too far untapped -> the BIRD (not the block) is
      knocked off: it falls, comes back, you lose a heart — and the block still stacks. */
   const _bb=birdState();
   G.perchHit=0;
   if(_bb.jump<0&&!birdChain()&&G.stack.length){
    const _t=G.stack[G.stack.length-1];
    const _bx=_t.x+_t.w/2;
    const _ed=G.moving.dir>0?G.moving.x+G.moving.w:G.moving.x;
    const _pen=G.moving.dir>0?_ed-_bx:_bx-_ed;
    if(_pen>0){G.perchHit=_pen;
     if(SV.set.fx&&!G.slowFired){G.slowFired=true;G.slowT=Math.max(G.slowT,0.24);} /* the dig goes slow-mo — brace! */
    }
    let _tw=perfectTol()*2+6;
    if(G.moving.spec==='magnet')_tw*=2.2;
    if(_pen>=_tw)collisionDrop();
   }
  }else G.perchHit=0;
 }
 /* fever timer */
 if(G.fever.on&&G.state==='play'){G.fever.t-=gdt;if(G.fever.t<=0)endFever(false);}
 G.camT=camTarget();
 G.camY+=(G.camT-G.camY)*Math.min(1,dt*6);
 if(!isFinite(G.camY))G.camY=G.camT; /* defensive camera recovery */
 updateBird(dt); /* bird companion: idle bob/blink, hop progress, wing + squash decay */
 /* camera bounce on perfect */
 if(G.bounce>0){G.bounce=Math.max(0,G.bounce-dt*3.2);G.camY+=Math.sin((1-G.bounce)*Math.PI*3)*5*G.bounce;}
 for(let i=G.pieces.length-1;i>=0;i--){const p=G.pieces[i];
  p.vy+=1500*gdt;p.y+=p.vy*gdt;p.rot+=p.vr*gdt;
  if(p.y+G.camY>H+180)G.pieces.splice(i,1);}
 for(let i=G.parts.length-1;i>=0;i--){const p=G.parts[i];
  p.t+=gdt;
  if(p.t>=p.life||p.y+G.camY>H+60||p.x<-80||p.x>W+80){G.parts.splice(i,1);continue;}
  p.x+=p.vx*gdt;p.y+=p.vy*gdt;p.vy+=p.g*gdt;p.rot+=p.vr*gdt;}
 if(G.state==='play')spawnAmbient(gdt);
 G.shake*=Math.pow(0.02,dt);if(G.shake<0.3)G.shake=0;
}
function spawnTrail(){
 const m=G.moving;if(!m)return;
 const tx=m.dir>0?m.x+4:m.x+m.w-4,id=runEq('trails');
 if(id==='pencil')part({x:tx,y:m.y+G.bh/2,type:'dash',vx:-m.dir*30,g:0,life:0.5,size:7,col:'rgba(59,50,48,.5)',rot:m.dir>0?0:Math.PI});
 else if(id==='star')part({x:tx,y:m.y+G.bh*(0.2+Math.random()*0.6),type:'star',vx:-m.dir*20,vy:10,g:0,life:0.6,size:4,col:'#f0c34e'});
 else if(id==='bubble')part({x:tx,y:m.y+G.bh*0.5,type:'bubble',vx:-m.dir*15,vy:-30,g:0,life:0.7,size:3+Math.random()*4,col:'rgba(120,160,200,.6)'});
 else if(id==='heartT')part({x:tx,y:m.y+G.bh*(0.3+Math.random()*0.4),type:'heart',vx:-m.dir*25,vy:-15,g:20,life:0.6,size:3.5+Math.random()*2.5,col:'#ef7d9d'});
 else if(id==='confT')part({x:tx,y:m.y+G.bh*(0.2+Math.random()*0.6),type:'conf',vx:-m.dir*30,vy:(Math.random()-0.5)*30,g:80,life:0.6,size:4.5,col:CONF[Math.floor(Math.random()*CONF.length)],vr:6});
 else if(id==='feather')part({x:tx,y:m.y+G.bh*(0.3+Math.random()*0.5),type:'featherp',vx:-m.dir*26,vy:26,g:36,life:0.9,size:5+Math.random()*3,col:['#f7efe0','#f4e6b8','#dcecf7'][Math.floor(Math.random()*3)],vr:2.4});
 else if(id==='note')part({x:tx,y:m.y+G.bh*0.4,type:'notep',vx:-m.dir*22,vy:-46,g:20,life:0.8,size:6,col:'#3b3230',vr:1.2});
}
function spawnAmbient(dt){
 const w=WORLD();if(!w.amb)return;
 const cap=SV.set.fx?14:5;let cnt=0;
 for(const p of G.parts)if(p.amb)cnt++;
 if(cnt>=cap||Math.random()>dt*4)return;
 const x=Math.random()*W,topWorld=-G.camY;
 if(w.amb==='twink')part({x,y:topWorld+Math.random()*H,type:'twink',vy:8,life:6,size:2+Math.random()*3,col:w.id==='candy'?'#ef7d9d':'#f4e9c8',amb:1,ph:Math.random()*6});
 else if(w.amb==='snow')part({x,y:topWorld-10,type:'snow',vx:(Math.random()-0.5)*20,vy:40+Math.random()*30,life:14,size:2+Math.random()*2.5,col:'#fff',amb:1,ph:Math.random()*6});
 else if(w.amb==='petal')part({x,y:topWorld-10,type:'petal',vx:20+Math.random()*20,vy:30,life:12,size:4,col:w.id==='sunset'?'#f5b88a':'#f5b8cf',amb:1,ph:Math.random()*6,vr:2});
 else if(w.amb==='leafp')part({x,y:topWorld-10,type:'leafp',vx:(Math.random()-0.5)*30,vy:35,life:12,size:5,col:'#6fa85c',amb:1,ph:Math.random()*6,vr:2});
 else if(w.amb==='ember')part({x,y:topWorld+H,type:'ember',vx:(Math.random()-0.5)*20,vy:-50-Math.random()*40,life:7,size:2.5,col:'#f08c3c',amb:1});
 else if(w.amb==='cloudp')part({x,y:topWorld-10,type:'cloudp',vx:10+Math.random()*14,vy:6,life:16,size:8+Math.random()*10,col:'rgba(255,255,255,.55)',amb:1});
 else if(w.amb==='bubble')part({x,y:topWorld+H+10,type:'bubble',vx:(Math.random()-0.5)*14,vy:-40-Math.random()*30,life:12,size:2.5+Math.random()*4,col:'rgba(255,255,255,.75)',amb:1,ph:Math.random()*6});
}
function drawPerfectZone(){
 /* the ✕ LANDING MARK painted on the top block + tick marks showing the perfect window */
 if(!G.moving||!G.stack.length)return;
 const top=G.stack[G.stack.length-1],tol=perfectTol();
 const y=top.y+G.camY;
 if(y<-40||y>H+40)return;
 ctx.save();
 const _pulse=TUT.on?0.55+0.35*Math.sin(performance.now()/170):0.55;
 ctx.globalAlpha=_pulse;ctx.strokeStyle='#3b3230';ctx.lineWidth=2;ctx.lineCap='round';
 const cx=top.x+top.w/2;
 /* the ✕ itself */
 ctx.beginPath();ctx.moveTo(cx-5,y-12);ctx.lineTo(cx+5,y-4);ctx.moveTo(cx+5,y-12);ctx.lineTo(cx-5,y-4);ctx.stroke();
 ctx.beginPath();ctx.moveTo(cx,y-7);ctx.lineTo(cx,y-1);ctx.stroke();
 ctx.beginPath();ctx.moveTo(top.x+tol,y-4);ctx.lineTo(top.x+tol,y+3);ctx.stroke();
 ctx.beginPath();ctx.moveTo(top.x+top.w-tol,y-4);ctx.lineTo(top.x+top.w-tol,y+3);ctx.stroke();
 ctx.setLineDash([3,4]);ctx.globalAlpha=0.3;
 ctx.beginPath();ctx.moveTo(top.x+tol,y);ctx.lineTo(top.x+top.w-tol,y);ctx.stroke();
 ctx.setLineDash([]);
 /* matching notch on the moving block (same camera offset as the block itself) */
 const m=G.moving;
 ctx.globalAlpha=0.6;ctx.beginPath();ctx.moveTo(m.x+m.w/2,m.y+m.h+2+G.camY);ctx.lineTo(m.x+m.w/2,m.y+m.h+7+G.camY);ctx.stroke();
 ctx.restore();
}
function drawMovingExtras(){
 const m=G.moving;if(!m)return;
 const cx=m.x+m.w/2,cy=m.y+m.h/2;
 ctx.save();
 if(m.golden){
  ctx.strokeStyle='rgba(201,148,42,.9)';ctx.lineWidth=3;
  blockPath(ctx,m.x,m.y,m.w,m.h,m.seed);ctx.stroke();
  ctx.fillStyle='#fff6d8';star5(ctx,cx,cy,5,2,0.4);ctx.fill();
 }
 if(m.spec){
  ctx.strokeStyle='#3b3230';ctx.lineWidth=2.4;ctx.lineCap='round';
  if(m.spec==='magnet'){
   ctx.beginPath();ctx.arc(cx,cy-1,6,Math.PI,0,false);ctx.stroke();
   ctx.beginPath();ctx.moveTo(cx-6,cy-1);ctx.lineTo(cx-6,cy+6);ctx.moveTo(cx+6,cy-1);ctx.lineTo(cx+6,cy+6);ctx.stroke();
   ctx.fillStyle='#e2694f';ctx.fillRect(cx-8,cy+4,4,4);ctx.fillRect(cx+4,cy+4,4,4);
  }else if(m.spec==='grow'){
   ctx.beginPath();ctx.moveTo(cx-9,cy);ctx.lineTo(cx+9,cy);ctx.stroke();
   ctx.beginPath();ctx.moveTo(cx-9,cy);ctx.lineTo(cx-4,cy-4);ctx.moveTo(cx-9,cy);ctx.lineTo(cx-4,cy+4);ctx.stroke();
   ctx.beginPath();ctx.moveTo(cx+9,cy);ctx.lineTo(cx+4,cy-4);ctx.moveTo(cx+9,cy);ctx.lineTo(cx+4,cy+4);ctx.stroke();
  }else if(m.spec==='star'){
   ctx.fillStyle='#f0c34e';star5(ctx,cx,cy,8,3.4,0.2);ctx.fill();
   ctx.strokeStyle='#3b3230';ctx.lineWidth=1.8;star5(ctx,cx,cy,8,3.4,0.2);ctx.stroke();
  }
 }
 ctx.restore();
}
function renderGame(){
 ctx.setTransform(DPR,0,0,DPR,0,0);
 let sx=0,sy=0;
 if(G.shake>0.5&&SV.set.fx){sx=(Math.random()-0.5)*G.shake;sy=(Math.random()-0.5)*G.shake;}
 ctx.save();ctx.translate(sx,sy);
 /* explicit source rects: every offscreen canvas is blitted 1:1 in logical px — DPR is never applied twice */
 if(bgC&&bgC.width>0)ctx.drawImage(bgC,0,0,bgC.width,bgC.height,0,0,W,H);
 if(tower&&tower.c&&tower.c.width>0&&tower.c.height>0&&isFinite(tower.topY)&&tower.h>0)
  ctx.drawImage(tower.c,0,0,tower.c.width,tower.c.height,0,tower.topY+G.camY,W,tower.h);
 drawPerfectZone();
 for(const p of G.pieces){
  if(!isFinite(p.x)||!isFinite(p.y)||!(p.w>0))continue; /* defensive: skip invalid debris */
  ctx.save();ctx.translate(p.x+p.w/2,p.y+p.h/2+G.camY);ctx.rotate(isFinite(p.rot)?p.rot:0);
  drawBlock(ctx,{x:-p.w/2,y:-p.h/2,w:p.w,h:p.h,seed:p.seed},runEq('skins'),runEq('themes'));ctx.restore();}
 if(G.moving&&isFinite(G.moving.x)&&isFinite(G.moving.y)){
  ctx.save();ctx.translate(0,G.camY); /* moving block lives in world space like the tower */
  drawBlock(ctx,G.moving,runEq('skins'),runEq('themes'));drawMovingExtras();
  ctx.restore();
 }
 drawDropGuides();
 drawBirdOnTop(ctx,G.camY); /* the bird rides the top block */
 drawParts(ctx);
 /* fever warm vignette */
 if(G.fever.on&&SV.set.fx&&feverGlow){
  const a=0.5+0.3*Math.sin(performance.now()/180);
  ctx.globalAlpha=clamp(a,0,0.8);
  ctx.drawImage(feverGlow,0,0,W,H);
  ctx.globalAlpha=1;
 }
 /* near-miss soft edge */
 if(G.slowT>0&&SV.set.fx){
  ctx.globalAlpha=clamp(G.slowT*1.6,0,0.5)*0.4;
  ctx.fillStyle='#3b3230';
  ctx.fillRect(0,0,W,4);ctx.fillRect(0,H-4,W,4);
  ctx.globalAlpha=1;
 }
 ctx.restore();
}
/* menu preview */
const prevCtx=$('#prevCv').getContext('2d');let prevBg=null;
function buildPrevBg(){
 prevBg=document.createElement('canvas');prevBg.width=420;prevBg.height=300;
 const c=prevBg.getContext('2d');c.scale(2,2);WORLD().draw(c,210,150,rng(7));
}
function renderMenuPreview(t){
 const c=prevCtx;c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,210,150);
 if(prevBg)c.drawImage(prevBg,0,0,210,150);
 const k=3+Math.floor(t/1.6)%6;
 let topY=0,topX=105,topW=84;
 for(let i=0;i<k;i++){
  const w=84-i*6,x=105-w/2+Math.sin(i*2.7)*3,y=126-16*(i+1);
  drawBlock(c,{x,y,w,h:15,seed:i*37+3},SV.eq.skins,SV.eq.themes);
  topY=y;topX=x+w/2;topW=w;
 }
 /* the equipped bird perches on top of the menu tower */
 const bsp=byId(BIRDS,SV.eq.birds)||BIRDS[0];
 const bob=Math.sin(t*2.2)*1.4;
 drawBird(c,topX,topY+bob,clamp(topW*0.16,7,12),bsp,{wing:Math.max(0,Math.sin(t*2.2))*0.18,blink:(t%2.8)<0.13,dir:1,hat:SV.eq.hats});
}
let last=0,frameN=0;
function frame(t){
 requestAnimationFrame(frame);
 const dt=Math.min(0.05,(t-last)/1000||0.016);last=t;frameN++;
 const opaque=['menu','shop','worlds','ach','settings','confirm','quests','welcome'].includes(curScreen);
 if(!opaque){if(G.state==='play'||G.state==='over')update(dt);renderGame();}
 if(curScreen==='menu')renderMenuPreview(t/1000);
 if(curScreen==='shop'&&frameN%3===0)animateShopPreviews(t/1000);
 if(curScreen==='worlds'&&frameN%4===0)animateWorldPreviews(t/1000);
 pumpAchPop();
}

/* ================= HUD / UI ================= */
const SCREENS=['menu','pause','result','shop','worlds','ach','settings','daily','confirm','quests','welcome'];
let curScreen='menu';
function go(id){
 SCREENS.forEach(s=>{const el=$('#scr-'+s);if(el)el.classList.toggle('on',s===id);});
 curScreen=id;
 $('#hud').classList.toggle('on',id===null||id==='pause'||id==='result'||id==='daily');
 if(id==='result')G.resultAt=performance.now();
 CG.gstop(); /* any menu/screen is a game break for the SDK */
}
function updateHUD(){$('#hFloor').textContent=G.floor;$('#hScore').textContent='SCORE '+G.score;$('#hCoins').textContent=G.coins;
 const _lv=$('#hLives');if(_lv)_lv.style.display='none'; /* hearts system removed */}
function updateCoinsUI(){$$('.coinVal').forEach(e=>e.textContent=SV.coins);}
function refreshCoins(){$$('.coinIc').forEach(e=>e.innerHTML=coinIcon());}
function setCombo(){
 const wrap=$('#comboWrap'),pill=$('#comboPill'),fill=$('#comboFill');
 if(G.combo>=2){
  wrap.classList.add('on');
  pill.textContent=(G.fever.on?'FEVER ×':'COMBO ×')+G.combo;
  pill.classList.remove('pop');void pill.offsetWidth;pill.classList.add('pop');
  const ms=[5,10,20,50];let next=ms.find(m=>m>G.combo);
  if(!next)next=50+Math.ceil((G.combo-49)/25)*25;
  let prev=0;for(const m of ms.concat([next])){if(m<next&&m<=G.combo)prev=m;}
  fill.style.width=clamp((G.combo-prev)/(next-prev)*100,4,100)+'%';
 }else{wrap.classList.remove('on');wrap.classList.remove('fever');}
}
function updateChalChip(){
 const chip=$('#chalChip');
 if(!G.chal||G.state!=='play'){chip.classList.remove('on');return;}
 if(G.chalDone){chip.classList.add('on','done');chip.innerHTML=ICONS.check+' DONE!';return;}
 const ch=curChal(),p=chalProgress();
 chip.classList.add('on');chip.classList.remove('done');
 chip.textContent='GOAL: '+ch.d+' ('+(ch.t==='acc'?'—':p+'/'+ch.g)+')';
}
function banner(txt){const b=$('#banner');b.textContent=txt;b.classList.remove('on');void b.offsetWidth;b.classList.add('on');}
const toastQ=[];let toastBusy=false;
function toast(html){toastQ.push(html);pumpToast();}
function pumpToast(){if(toastBusy||!toastQ.length)return;toastBusy=true;
 const el=$('#toast');el.innerHTML=toastQ.shift();el.classList.add('on');
 setTimeout(()=>{el.classList.remove('on');setTimeout(()=>{toastBusy=false;pumpToast();},380);},2200);}

/* tutorial */
function tutBubble(html){$('#tutBubble').innerHTML=html;}
function tutShow(step){
 $('#tut').classList.add('on');
 const msgs=[
 '<b>\u{1F44B} Welcome!</b> Every block flies past <b>once</b>, from a random side. Grow the tower under your bird — it all happens with one finger: <b>TAP</b>.<button class="tutNext">GOT IT \u25B6</button>',
 'Your <b>bird</b> never moves — it stands on the <b>\u2715 landing mark</b>, dead-centre on top of the tower. That mark is your bullseye.<button class="tutNext">NEXT \u25B6</button>',
 'Here it comes! A block stacks as long as it <b>touches</b> the block below — even a sliver counts, its width never shrinks. The guides turn <b>green</b> the moment there\u2019s contact: <b>TAP!</b> Red = a total miss, which ends the run.',
 'Now aim for <b>GOLD</b>: stop the \u25CF dot right on the \u2715 = <b>PERFECT</b> snap, +combo. <i>Up to 3 tries — just play!</i>',
 'Last lesson — <b>don\u2019t tap this one.</b> Let the block bump the bird and <b>watch the whole thing</b>. \u{1F604}',
 'Bumped bird = tumbles, bounces, sees stars, flies back — and the block <b>still stacks</b>, no penalty at all! Ready?<button class="tutNext">START! \u25B6</button>'];
 tutBubble(msgs[step]||msgs[0]);
 const h=document.querySelector('.tut-hand');
 if(h)h.classList.toggle('hidden',!(step===0||step===5));
}
function tutApply(){
 const st=TUT.step;
 TUT.freeze=(st<=1); TUT.blockTap=(st===4); TUT.tries=0;
 if(st<=1){G.moving=null;G.spawnT=99;}
 else if(G.state==='play'&&(!G.moving||G.spawnT>1))G.spawnT=0.3;
}
function tutNext(){
 if(!TUT.on)return;
 TUT.step++;
 if(TUT.step>5){tutEnd();return;}
 tutShow(TUT.step);tutApply();
}
function tutEvent(kind){
 if(!TUT.on)return;
 const st=TUT.step;
 if(st===2){
  if(kind==='placed'){tutNext();return;}
  if(kind==='slid'){tutBubble('That\u2019s a total miss \u{1F605} \u2014 the <b>red</b> guides warned you! Any bit of overlap works: <b>green = go</b>.');return;}
 }
 if(st===3){
  if(kind==='perfect'){tutBubble('<b>PERFECT!</b> \u2728 Gold means it snapped flush and your combo\u2019s building.');tutNext();return;}
  TUT.tries++;
  if(TUT.tries>=3)tutNext();
  else tutBubble(kind==='birdback'?'The bird\u2019s fine \u2014 but line up the <b>\u25CF on the \u2715</b> for <b>GOLD</b>!':(kind==='placed'?'Good stack! Now make the guides <b>GOLD</b> \u2014 centre dot ON the \u2715.':'Almost \u2014 wait for <b>gold</b>, then tap!'));
  return;
 }
 if(st===4){
  if(kind==='bird'||kind==='escape'||kind==='birdback'){ /* chain plays out; advance when the bird is back */
   if(kind==='birdback')tutNext();
   else if(kind==='escape')tutBubble('It slipped past the bird this time \u2014 that\u2019s a full miss. Last word…');
   return;
  }
 }
}
function tutEnd(){
 TUT.on=false;TUT.freeze=false;TUT.blockTap=false;SV.tut=1;save();
 $('#tut').classList.remove('on');
 if(G.state==='play'&&!G.moving&&G.spawnT>1)G.spawnT=0.3;
}

/* ================= SCREEN RENDERERS ================= */
function splitTitle(el,txt){
 el.innerHTML='';
 [...txt].forEach((ch,i)=>{const s=document.createElement('span');s.className='t-l';s.textContent=ch;
  s.style.setProperty('--tr',((i%2?1:-1)*(1+i%3)*0.7)+'deg');s.style.animationDelay=(i*0.09)+'s';el.appendChild(s);});
}
function renderMenuBtn(){
 const info=getDailyState();
 $('#btnDaily').querySelector('.badge').style.display=info.claimedToday?'none':'block';
 $('#dailyLbl').textContent=info.claimedToday?'GOT IT':'DAY '+info.disp;
}
function renderMenu(){
 $('#mBest').textContent=SV.bestH;updateCoinsUI();renderMenuBtn();buildPrevBg();
}
let shopCat='skins';
const shopVisible=new Set();
function cardHTML(cat,it){
 const eq=SV.eq[cat]===it.id,own=!!SV.owned[it.id];
 const rchip='<span class="rchip q'+it.q+'">'+RAR[it.q]+'</span>';
 const price=own?'':(it.p<0?'<span class="price">'+ICONS.gift+' DAILY GIFT</span>'
  :(it.p===0?'<span class="price">FREE</span>':'<span class="price">'+coinIcon()+' '+it.p+'</span>'));
 const btn=eq?'<button class="hbtn tiny eqd" disabled>EQUIPPED</button>'
  :own?'<button class="hbtn tiny ibtn" data-eq="'+cat+':'+it.id+'">EQUIP</button>'
  :(it.p<0?'<button class="hbtn tiny" disabled>'+ICONS.lock+' GIFT ONLY</button>'
  :'<div class="ibtns"><button class="hbtn tiny ibtn" data-buy="'+cat+':'+it.id+'">BUY</button>'
   +'<button class="hbtn tiny ibtn" data-try="'+cat+':'+it.id+'">TRY</button></div>');
 return '<div class="item'+(eq?' eq':'')+'" id="card-'+it.id+'">'+rchip
  +(eq?'<div class="eqtag">'+ICONS.check+'</div>':'')
  +'<div class="iprev"><canvas width="240" height="168" data-pv="'+cat+':'+it.id+'"></canvas></div>'
  +'<div class="iname">'+it.n+'</div>'+price+btn+'</div>';
}
function renderShop(){
 const tabs=$('#shopTabs');
 tabs.innerHTML=CATS.map(c=>{
  const own=c.items.filter(i=>SV.owned[i.id]||SV.eq[c.id]===i.id||i.p===0).length;
  return '<button class="tab'+(c.id===shopCat?' on':'')+'" data-tab="'+c.id+'">'+c.label+'<small>'+own+'/'+c.items.length+'</small></button>';
 }).join('');
 const cat=CATS.find(c=>c.id===shopCat);
 $('#shopGrid').innerHTML=cat.items.map(it=>cardHTML(cat.id,it)).join('');
 /* collection bar */
 const ownedAll=CATS.reduce((a,c)=>a+c.items.filter(i=>SV.owned[i.id]||i.p===0).length,0);
 $('#colBar').classList.add('on');
 $('#colTxt').textContent=ownedAll+' / '+TOTAL_ITEMS+' owned';
 $('#colFill').style.width=Math.round(ownedAll/TOTAL_ITEMS*100)+'%';
 updateCoinsUI();
 shopVisible.clear();
 requestAnimationFrame(observeShopPreviews);
}
function refreshShopIfOpen(){if(curScreen==='shop'){renderShop();}}
let shopIO=null;
function observeShopPreviews(){
 if(shopIO)shopIO.disconnect();
 if(!('IntersectionObserver' in window)){
  $$('#shopGrid canvas[data-pv]').forEach(c=>shopVisible.add(c));drawShopPreviews(0);return;
 }
 shopIO=new IntersectionObserver(es=>{es.forEach(en=>{
  if(en.isIntersecting)shopVisible.add(en.target);else shopVisible.delete(en.target);});},
  {root:$('#shopScroll'),threshold:0.05});
 $$('#shopGrid canvas[data-pv]').forEach(c=>shopIO.observe(c));
 drawShopPreviews(0);
}
function drawPreviewBase(cat,it,c,t){
 if(cat==='skins'){
  jline(c,8,68,112,68,rng(9),'rgba(59,50,48,.4)',2);
  drawBlock(c,{x:12,y:40,w:96,h:28,seed:42},it.id,SV.eq.themes);
 }else if(cat==='themes'){
  [[14,54,92],[22,36,76],[30,18,60]].forEach((b,i)=>drawBlock(c,{x:b[0],y:b[1],w:b[2],h:18,seed:40+i},SV.eq.skins,it.id));
 }else if(cat==='bgs'){
  c.fillStyle=it.id==='kraft'?'#ecd9b7':it.id==='bluegrid'?'#eaf1f8':'#f7efe0';c.fillRect(8,8,104,68);
  if(it.id==='grid'||it.id==='bluegrid'){c.strokeStyle=it.id==='bluegrid'?'rgba(90,130,180,.4)':'rgba(59,50,48,.18)';c.lineWidth=1;
   for(let x=16;x<112;x+=14){c.beginPath();c.moveTo(x,8);c.lineTo(x,76);c.stroke();}
   for(let y=16;y<76;y+=14){c.beginPath();c.moveTo(8,y);c.lineTo(112,y);c.stroke();}}
  if(it.id==='dots'){c.fillStyle='rgba(59,50,48,.25)';
   for(let x=14;x<110;x+=12)for(let y=14;y<74;y+=12){c.beginPath();c.arc(x,y,1.4,0,7);c.fill();}}
  if(it.id==='music'){c.strokeStyle='rgba(59,50,48,.22)';c.lineWidth=1.2;
   for(let y=18;y<76;y+=11){c.beginPath();c.moveTo(8,y);c.lineTo(112,y);c.stroke();}}
  if(it.id==='kraft'){c.strokeStyle='rgba(122,90,50,.25)';c.lineWidth=2;
   for(let x=14;x<112;x+=22){c.beginPath();c.moveTo(x,8);c.lineTo(x+8,76);c.stroke();}}
  if(it.id==='plain'){c.strokeStyle='rgba(59,50,48,.3)';c.lineWidth=2;
   c.beginPath();c.moveTo(30,42);c.quadraticCurveTo(50,28,70,44);c.quadraticCurveTo(85,54,95,38);c.stroke();}
  c.strokeStyle='#3b3230';c.lineWidth=3;c.strokeRect(8,8,104,68);
 }else if(cat==='trails'){
  drawBlock(c,{x:44,y:30,w:62,h:24,seed:43},SV.eq.skins,SV.eq.themes);
  if(it.id==='pencil'){c.strokeStyle='rgba(59,50,48,.5)';c.lineWidth=3;c.lineCap='round';
   for(let i=0;i<3;i++){c.beginPath();c.moveTo(36-i*10,36+i*4);c.lineTo(28-i*10,40+i*4);c.stroke();}}
  if(it.id==='star'){c.fillStyle='#f0c34e';
   for(let i=0;i<4;i++){star5(c,34-i*9,42+(i%2)*8,4.5,2,i);c.fill();}}
  if(it.id==='bubble'){c.strokeStyle='rgba(120,160,200,.8)';c.lineWidth=1.8;
   for(let i=0;i<3;i++){c.beginPath();c.arc(36-i*10,44-(i%2)*10,3+i,0,7);c.stroke();}}
  if(it.id==='heartT'){c.fillStyle='#ef7d9d';
   for(let i=0;i<3;i++){c.save();c.translate(34-i*11,42+(i%2)*7);const s=3.6+i;
    c.beginPath();c.moveTo(0,s*0.35);c.bezierCurveTo(-s,-s*0.4,-s*0.35,-s,0,-s*0.35);
    c.bezierCurveTo(s*0.35,-s,s,-s*0.4,0,s*0.35);c.fill();c.restore();}}
  if(it.id==='confT'){const r=rng(6);
   for(let i=0;i<6;i++){c.fillStyle=CONF[i%CONF.length];c.save();
    c.translate(36-i*6,38+r()*14);c.rotate(r()*3);c.fillRect(-3.4,-2.6,6.8,5.2);c.restore();}}
  if(it.id==='feather'){c.fillStyle='#f4e6b8';c.strokeStyle='rgba(59,50,48,.55)';c.lineWidth=1.6;
   for(let i=0;i<3;i++){c.save();c.translate(36-i*10,44-(i%2)*8);c.rotate(0.7);
    c.beginPath();c.ellipse(0,0,3,6,0,0,7);c.fill();c.stroke();c.restore();}}
  if(it.id==='note'){c.fillStyle='#3b3230';c.strokeStyle='#3b3230';c.lineWidth=2.2;
   for(let i=0;i<2;i++){const nx=34-i*12,ny=46-(i%2)*8;
    c.beginPath();c.ellipse(nx-2,ny,3,2.2,-0.4,0,7);c.fill();
    c.beginPath();c.moveTo(nx+0.6,ny-1);c.lineTo(nx+0.6,ny-11);c.stroke();
    c.beginPath();c.moveTo(nx+0.6,ny-11);c.quadraticCurveTo(nx+7,ny-9,nx+6,ny-5);c.stroke();}}
  if(it.id==='none'){c.strokeStyle='rgba(59,50,48,.35)';c.lineWidth=2;
   c.beginPath();c.moveTo(18,34);c.lineTo(34,54);c.moveTo(34,34);c.lineTo(18,54);c.stroke();}
 }else if(cat==='hats'){
  const _bd=byId(BIRDS,SV.eq.birds)||BIRDS[0];
  blockPath(c,44,64,32,10,7);c.fillStyle='#cf9455';c.fill();c.strokeStyle='#3b3230';c.lineWidth=2.4;c.stroke();
  drawBird(c,60,64,17,_bd,{wing:0.12,blink:false,dir:1,hat:it.id});
 }else if(cat==='fxs'){
  const cx=60,cy=42;
  if(it.id==='sparkle'){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;
   c.strokeStyle='#c9942a';c.lineWidth=2.4;c.lineCap='round';
   c.beginPath();c.moveTo(cx+Math.cos(a)*8,cy+Math.sin(a)*8);c.lineTo(cx+Math.cos(a)*20,cy+Math.sin(a)*20);
   c.moveTo(cx+Math.cos(a)*14-3,cy+Math.sin(a)*14);c.lineTo(cx+Math.cos(a)*14+3,cy+Math.sin(a)*14);c.stroke();}}
  if(it.id==='scribble'){c.strokeStyle='#3b3230';c.lineWidth=2.2;c.lineCap='round';
   for(let k=0;k<3;k++){const ox=cx-24+k*24;c.beginPath();c.moveTo(ox,cy);
    c.bezierCurveTo(ox+8,cy-14,ox-8,cy-18,ox+6,cy-26);c.stroke();}}
  if(it.id==='confetti'){const r=rng(4);
   for(let i=0;i<10;i++){c.fillStyle=CONF[i%CONF.length];c.save();
    c.translate(20+r()*80,16+r()*52);c.rotate(r()*3);c.fillRect(-4,-3,8,6);c.restore();}}
  if(it.id==='inksplat'){const r=rng(8);
   for(let i=0;i<6;i++){jcircle(c,26+r()*68,20+r()*44,4+r()*7,r,'rgba(59,50,48,.55)',null,0);}}
  if(it.id==='fireworks'){const cols=['#e2694f','#f0c34e','#7fb3d5'];
   [[36,30],[82,26],[60,54]].forEach((o,k)=>{c.strokeStyle=cols[k];c.lineWidth=2.2;c.lineCap='round';
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;
     c.beginPath();c.moveTo(o[0]+Math.cos(a)*4,o[1]+Math.sin(a)*4);c.lineTo(o[0]+Math.cos(a)*14,o[1]+Math.sin(a)*14);c.stroke();}});}
  if(it.id==='heart'){c.fillStyle='#ef7d9d';
   [[40,36,5],[78,34,6],[56,58,4.4],[86,56,5]].forEach(o=>{c.save();c.translate(o[0],o[1]);const s=o[2];
    c.beginPath();c.moveTo(0,s*0.35);c.bezierCurveTo(-s,-s*0.4,-s*0.35,-s,0,-s*0.35);
    c.bezierCurveTo(s*0.35,-s,s,-s*0.4,0,s*0.35);c.fill();c.restore();});}
 }else if(cat==='coins'){
  drawCoinShape(c,60,42,22,it.id);
 }else if(cat==='birds'){
  /* perch the bird on a little hand-drawn block */
  drawBlock(c,{x:34,y:52,w:52,h:16,seed:77},SV.eq.skins,SV.eq.themes);
  const tt=t||0,blink=(tt%2.6)<0.14,wing=Math.max(0,Math.sin(tt*2.4))*0.22;
  drawBird(c,60,52,15,it,{wing,blink,dir:1,hat:SV.eq.hats});
 }else if(cat==='uis'){
  c.fillStyle=it.pal[0];c.fillRect(16,14,88,56);
  c.strokeStyle='#3b3230';c.lineWidth=2.6;c.strokeRect(16,14,88,56);
  c.fillStyle=it.pal[1];c.fillRect(26,44,30,18);
  c.fillStyle=it.pal[2];c.fillRect(64,24,28,12);
  c.strokeStyle='#3b3230';c.lineWidth=1.8;c.strokeRect(26,44,30,18);c.strokeRect(64,24,28,12);
 }
}
function drawShopPreviews(t){
 shopVisible.forEach(cvs=>{
  if(!cvs.isConnected){shopVisible.delete(cvs);return;}
  const[cat,id]=cvs.dataset.pv.split(':');
  const f=findItem(id);if(!f)return;
  const c=cvs.getContext('2d');c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,120,84);
  c.save();
  /* idle bobbing animation for living previews */
  c.translate(0,Math.sin(t*2.1+(id.length*1.7))*2.2);
  drawPreviewBase(cat,f.it,c,t);
  /* twinkling accents */
  if(f.it.q>=2){const r=rng(Math.floor(t*3)+hashStr(id));
   c.fillStyle='#f0c34e';star5(c,14+r()*92,8+r()*16,3.4,1.4,t%3);c.fill();}
  c.restore();
 });
}
function animateShopPreviews(t){drawShopPreviews(t);}
function buyItem(cat,id){
 const f=findItem(id);if(!f)return;
 const it=f.it;
 if(SV.owned[id]){equipItem(cat,id);return;}
 if(it.p<0){sfx('deny');return;}
 if(SV.coins<it.p){sfx('deny');buzz(60);
  const card=$('#card-'+id);if(card){card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake');}
  toast(ICONS.lock+'<span>Not enough coins — need <b>'+(it.p-SV.coins)+'</b> more!</span>');return;}
 SV.coins-=it.p;SV.owned[id]=1;
 sfx('buy');buzz([15,25,15]);
 questEvent('buy',1);
 toast(ICONS.cart+'<span>Bought <b>'+it.n+'</b>!</span>');
 save();updateCoinsUI();renderShop();checkAch(false);
 const card=$('#card-'+id);if(card)card.classList.add('bought');
}
function equipItem(cat,id){
 SV.eq[cat]=id;sfx('equip');save();
 applyCosmeticSide(cat);
 renderShop();renderMenu();
}
function tryItem(cat,id){
 const f=findItem(id);if(!f||SV.owned[id])return;
 G.trial={cat,id};
 sfx('pop');
 toast(ICONS.spark+'<span><b>'+f.it.n+'</b> will be free in your next run!</span>');
}
function applyCosmeticSide(cat){
 if(cat==='coins')refreshCoins();
 if(cat==='bgs')applyPaper();
 if(cat==='uis')applyUI();
}
function applyPaper(){
 $('#paperFx').className='fx-'+SV.eq.bgs;
 const map={kraft:'kraft',bluegrid:'bluegrid'};
 if(map[SV.eq.bgs])document.documentElement.setAttribute('data-paper',map[SV.eq.bgs]);
 else document.documentElement.removeAttribute('data-paper');
}
function applyUI(){
 if(SV.eq.uis==='cream')document.documentElement.removeAttribute('data-ui');
 else document.documentElement.setAttribute('data-ui',SV.eq.uis);
}

/* ================= WORLDS SCREEN ================= */
function renderWorlds(){
 const grid=$('#worldGrid');
 grid.innerHTML=WORLDS.map(w=>{
  const un=SV.bestH>=w.req,cur=SV.world===w.id;
  return '<div class="wcard'+(un?'':' locked')+(cur?' cur':'')+'" data-w="'+w.id+'">'
   +'<canvas width="320" height="190" data-wc="'+w.id+'"></canvas>'
   +'<div class="wname">'+w.n+'</div>'
   +(un
     ?(cur?'<div class="lockreq" style="color:var(--good)">'+ICONS.check+' BUILDING HERE</div>'
          :'<button class="hbtn tiny ibtn" data-wgo="'+w.id+'">BUILD HERE</button>'
           +'<div class="wms">best here: '+(SV.wbest[w.id]||0)+' floors · milestones '
           +[10,25,50].map(n=>SV.wqrew[w.id+'_'+n]?'✓':'○').join(' ')+'</div>')
     :'<div class="lockreq">'+ICONS.lock+' Reach floor '+w.req+' to unlock</div>')
   +'</div>';
 }).join('');
 updateCoinsUI();
 drawWorldPreviews();
}
function drawWorldCard(cnv,w,t){
 const c=cnv.getContext('2d');
 c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,320,190);
 c.save();
 c.scale(320/210,190/150);
 w.draw(c,210,150,rng(w.id.length*31+5));
 /* mini tower preview with equipped blocks */
 for(let i=0;i<4;i++){
  const bw=70-i*8,bx=105-bw/2+Math.sin(i*2.3)*3,by=132-14*(i+1);
  drawBlock(c,{x:bx,y:by,w:bw,h:13,seed:i*17+3},SV.eq.skins,SV.eq.themes);
 }
 /* ambient hints */
 if(w.amb==='snow')for(let i=0;i<8;i++){c.fillStyle='#fff';c.beginPath();c.arc((i*53+30)%210,20+i*14,1.8,0,7);c.fill();}
 if(w.amb==='twink')for(let i=0;i<6;i++){c.strokeStyle='rgba(244,233,200,.9)';c.lineWidth=1.4;
  const px=(i*71+40)%210,py=14+i*9;c.beginPath();c.moveTo(px-3,py);c.lineTo(px+3,py);c.moveTo(px,py-3);c.lineTo(px,py+3);c.stroke();}
 if(w.amb==='petal')for(let i=0;i<6;i++){c.fillStyle='rgba(245,184,207,.9)';
  c.beginPath();c.ellipse((i*67+25)%210,24+i*12,3.4,2,i,0,7);c.fill();}
 if(w.amb==='ember')for(let i=0;i<7;i++){c.fillStyle=i%2?'#f08c3c':'#f0a03c';
  c.beginPath();c.arc((i*59+30)%210,150-i*18,2,0,7);c.fill();}
 if(w.amb==='bubble')for(let i=0;i<7;i++){c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1.4;
  c.beginPath();c.arc((i*55+26)%210,140-i*17,2.4+i%3,0,7);c.stroke();}
 if(w.amb==='leafp')for(let i=0;i<6;i++){c.fillStyle='rgba(111,168,92,.85)';
  c.beginPath();c.ellipse((i*63+30)%210,20+i*13,4,2,0.6,0,7);c.fill();}
 if(w.amb==='cloudp'){c.fillStyle='rgba(255,255,255,.7)';
  c.beginPath();c.arc(40,40,9,0,7);c.arc(52,43,7,0,7);c.fill();}
 c.restore();
}
function drawWorldPreviews(){$$('#worldGrid canvas[data-wc]').forEach(cnv=>{
 const w=WORLDS.find(x=>x.id===cnv.dataset.wc);if(w)drawWorldCard(cnv,w,0);});}
function animateWorldPreviews(t){
 /* previews are rich static scenes (tower + atmosphere); redraw only when tab regains focus */
}

/* ================= ACHIEVEMENTS SCREEN ================= */
function renderAch(){
 const list=$('#achList');
 const done=ACHS.filter(a=>SV.ach[a.id]).length;
 list.innerHTML='<div class="qsec">COMPLETED '+done+' / '+ACHS.length+'</div>'+ACHS.map(a=>{
  const dn=!!SV.ach[a.id],v=Math.min(achVal(a),a.g);
  return '<div class="achrow'+(dn?' done':'')+'">'
   +'<div class="amedal">'+ICONS.trophy+'</div>'
   +'<div class="ainfo"><div class="aname">'+a.n+'</div><div class="adesc">'+a.d+'</div>'
   +(dn?'':('<div class="aprogress"><i style="width:'+Math.round(v/a.g*100)+'%"></i></div><div class="aptext">'+fmt(v)+' / '+fmt(a.g)+'</div>'))
   +'</div>'
   +'<div class="arew">'+(dn?ICONS.check:coinIcon())+(dn?'':a.r)+'</div></div>';
 }).join('');
 updateCoinsUI();
}

/* ================= QUESTS SCREEN ================= */
function renderQuests(){
 ensureDailyQuest();ensureWeek();
 const box=$('#questScroll');
 const ch=curChal();
 const dq=curDailyQuest();
 const dqPct=Math.round(clamp(SV.quest.daily.prog/dq.g,0,1)*100);
 const rew=dailyQuestRewardInfo();
 const rewTxt=rew.item?coinIcon()+' '+dq.r+' + '+rew.name:coinIcon()+' '+dq.r+' + '+rew.coins;
 let html='';
 html+='<div class="qsec">CHALLENGE RUN</div>';
 html+='<div class="qcard"><div class="qhead">'+ICONS.target+ch.n+'</div>'
  +'<div class="qdesc">'+ch.d+'</div>'
  +'<div class="qfoot"><span class="qrew">'+coinIcon()+' '+ch.r+'</span>'
  +'<button class="hbtn tiny primary ibtn" id="btnChalPlay">'+ICONS.play+' PLAY</button></div></div>';
 html+='<div class="qsec">TODAY\u2019S QUEST</div>';
 html+='<div class="qcard"><div class="qhead">'+ICONS.gift+dq.n+'</div>'
  +'<div class="qdesc">'+dq.d+'</div>'
  +'<div class="qprog"><i style="width:'+dqPct+'%"></i></div>'
  +'<div class="qfoot"><span class="qrew">'+rewTxt+'</span>'
  +(SV.quest.daily.done?'<span class="qdone">'+ICONS.check+' DONE!</span>'
   :'<span>'+fmt(Math.min(SV.quest.daily.prog,dq.g))+' / '+dq.g+'</span>')
  +'</div></div>';
 html+='<div class="qsec">THIS WEEK\u2019S GOALS</div>';
 weekQuests().forEach(q=>{
  const p=Math.min(SV.quest.week.prog[q.t]||0,q.g),dn=!!SV.quest.week.done[q.t];
  html+='<div class="qcard"><div class="qhead">'+(dn?ICONS.check:ICONS.trophy)+q.n+'</div>'
   +'<div class="qdesc">'+q.d+'</div>'
   +'<div class="qprog"><i style="width:'+Math.round(p/q.g*100)+'%"></i></div>'
   +'<div class="qfoot"><span class="qrew">'+coinIcon()+' '+q.r+'</span>'
   +(dn?'<span class="qdone">DONE!</span>':'<span>'+fmt(p)+' / '+fmt(q.g)+'</span>')
   +'</div></div>';
 });
 box.innerHTML=html;
 updateCoinsUI();
 const bp=$('#btnChalPlay');
 if(bp)bp.onclick=clk(()=>{startGame(true);});
}

/* ================= SETTINGS ================= */
function renderSettings(){
 $('#btnSound').textContent=SV.set.sound?'ON':'OFF';
 $('#btnMusic').textContent=SV.set.music?'ON':'OFF';
 $('#btnHapt').textContent=SV.set.haptics?'ON':'OFF';
 $('#btnFx').textContent=SV.set.fx?'ON':'OFF';
 $('#stBlocks').textContent=fmt(SV.blocks);
 $('#stPerf').textContent=fmt(SV.perfects);
 $('#stCombo').textContent=SV.bestCombo;
 $('#stTower').textContent=SV.bestH;
 $('#stScore').textContent=fmt(SV.bestScore);
 $('#stGames').textContent=SV.games;
 $('#stGold').textContent=SV.goldStacked;
 $('#stFever').textContent=SV.feverCount;
 $('#stNear').textContent=SV.nearMisses;
 $('#stDays').textContent=SV.days;
 $('#stCoins').textContent=fmt(SV.coinsEarned);
 updateCoinsUI();
}

/* ================= DAILY SCREEN ================= */
function renderDaily(){
 const st=getDailyState();
 const grid=$('#dailyGrid');
 grid.innerHTML=DAILY.map((rw,i)=>{
  const dayN=i+1;
  const isTodayDisp=st.disp===dayN;
  let cls='dchip';
  if(st.claimedToday){if(dayN<=st.disp)cls+=' got';else cls+=' next';}
  else{if(isTodayDisp)cls+=' today';else if(dayN<st.disp)cls+=' got';else cls+=' next';}
  const val=rw.c?(coinIcon()+'<span>+'+rw.c+'</span>'):(ICONS.gift+'<span>'+itemName(rw.item)+'</span>');
  return '<div class="'+cls+'"><div class="dnum">DAY '+dayN+'</div><div class="dval">'+val+'</div></div>';
 }).join('');
 $('#dailyStreak').textContent=st.claimedToday
  ?'Streak: '+(((SV.daily.day-1)%7)+1)+' day'+((SV.daily.day-1)%7===0?'':'s')+' — come back tomorrow!'
  :'Claim your day '+st.disp+' gift!'+(st.needsShield?' (a shield will protect your streak)':'');
 $('#shieldRow').innerHTML=ICONS.shield+' Streak shields: '+SV.daily.shield+' / 2 <span style="font-weight:normal;font-size:12px">(finish a 7-day streak to earn one — they save a missed day)</span>';
 const btn=$('#btnDailyClaim');
 btn.disabled=st.claimedToday;
 btn.innerHTML=st.claimedToday?ICONS.check+' COME BACK TOMORROW':ICONS.gift+' CLAIM DAY '+st.disp;
 updateCoinsUI();
}

/* ================= INPUT ================= */
let lastTapT=0;
function handleTap(){
 const now=performance.now();
 if(now-lastTapT<110)return; /* anti double-activation */
 lastTapT=now;
 dropBlock();
}
function clk(fn){return function(e){if(e&&e.preventDefault)e.preventDefault();sfx('click');fn();};}
function bindEvents(){
 /* one-tap drop: pointer events only (no touch+mouse double fire) */
 $('#app').addEventListener('pointerdown',e=>{
  unlockAudio();
  if(e.target.closest('button'))return;
  if(curScreen===null&&G.state==='play'){handleTap();}
  else if(curScreen==='result'&&performance.now()-G.resultAt>650){startGame(G.chal?true:false);}
 },{passive:true});
 window.addEventListener('keydown',e=>{
  if(e.repeat)return;
  if(e.code==='Space'||e.code==='Enter'||e.code==='ArrowDown'){
   if(curScreen===null&&G.state==='play'){e.preventDefault();unlockAudio();handleTap();}
   else if(curScreen==='menu'){e.preventDefault();startGame(false);}
   else if(curScreen==='result'&&performance.now()-G.resultAt>650){e.preventDefault();startGame(false);}
  }
  if(e.key==='p'||e.key==='P'||e.key==='Escape'){
   if(G.state==='play')pauseGame();else if(G.state==='pause')resumeGame();
  }
  if(e.key==='r'||e.key==='R'){
   if(curScreen==='result'||G.state==='pause'){startGame(false);}
  }
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.state==='play')pauseGame();});
 window.addEventListener('beforeunload',()=>save());
 window.addEventListener('resize',()=>{clearTimeout(window.__rz);window.__rz=setTimeout(resize,120);});
 window.addEventListener('orientationchange',()=>setTimeout(resize,250));

 $('#btnPlay').onclick=clk(()=>startGame(false));
 $('#btnShop').onclick=clk(()=>{renderShop();go('shop');});
 $('#btnWorlds').onclick=clk(()=>{renderWorlds();go('worlds');});
 $('#btnAch').onclick=clk(()=>{renderAch();go('ach');});
 $('#btnQuests').onclick=clk(()=>{renderQuests();go('quests');});
 $('#btnSettings').onclick=clk(()=>{renderSettings();go('settings');});
 $('#btnDaily').onclick=clk(()=>{renderDaily();go('daily');});
 $$('.backBtn').forEach(b=>b.onclick=clk(()=>{renderMenu();go(b.dataset.go||'menu');}));
 $('#btnPause').onclick=clk(pauseGame);
 $('#btnResume').onclick=clk(resumeGame);
 (function(){const _t=$('#tut');if(!_t)return;
  _t.addEventListener('click',ev=>{
   const b=ev&&ev.target&&ev.target.closest?ev.target.closest('button'):null;
   if(!b)return;
   if(b.id==='tutSkip')tutEnd();
   else if(b.classList.contains('tutNext'))tutNext();
  });})();
 $('#btnRestartP').onclick=clk(()=>startGame(G.chal&&!G.chalDone));
 $('#btnHomeP').onclick=clk(goHome);
 $('#btnPsound').onclick=clk(()=>{SV.set.sound=!SV.set.sound;save();
  $('#btnPsound').textContent='SOUND: '+(SV.set.sound?'ON':'OFF');renderSettings();});
 $('#btnAgain').onclick=clk(()=>{CG.inter(()=>startGame(false));});
 $('#btnDouble').onclick=clk(()=>{ if(G.doubleUsed||G.dblBusy)return; G.dblBusy=true;
  CG.rewarded((ok)=>{G.dblBusy=false;
   if(ok){G.doubleUsed=true;SV.coins+=G.coins;SV.coinsEarned+=G.coins;questEvent('coin',G.coins);
    textPart(W/2,-G.camY+H*0.4,'+'+G.coins+' BONUS!','#c9942a',22);
    for(let i=0;i<6;i++)part({x:W/2,y:-G.camY+H*0.34,type:'coin',vx:(Math.random()-0.5)*260,vy:-240-Math.random()*80,g:520,life:1,size:9,style:runEq('coins')});
    sfx('coin');$('#rC').textContent=G.coins*2;$('#btnDouble').classList.add('hidden');save();}
   else toast(ICONS.bolt+'<span>No ad right now — try later!</span>');});});
 $('#btnHomeR').onclick=clk(goHome);
 $('#btnShopR').onclick=clk(()=>{renderShop();go('shop');});
 $('#btnDailyClaim').onclick=clk(claimDaily);
 $('#btnDailyClose').onclick=clk(()=>{renderMenu();go('menu');});
 $('#btnWelcomeOk').onclick=clk(()=>{
  SV.welcome=1;SV.coins+=100;SV.coinsEarned+=100;save();
  updateCoinsUI();renderMenu();go('menu');
  toast(ICONS.gift+'<span><b>+100 coins!</b> Check the DAILY GIFT every day.</span>');
 });
 $('#btnReset').onclick=clk(()=>go('confirm'));
 $('#btnResetYes').onclick=clk(()=>{try{localStorage.removeItem(KEY);localStorage.removeItem(KEY_OLD);}catch(e){}location.reload();});
 $('#btnResetNo').onclick=clk(()=>{renderSettings();go('settings');});
 $('#btnSound').onclick=clk(()=>{SV.set.sound=!SV.set.sound;if(SV.set.sound)sfx('pop');save();renderSettings();});
 $('#btnMusic').onclick=clk(()=>{SV.set.music=!SV.set.music;if(SV.set.music&&G.state==='play')Music.start();else Music.stop();save();renderSettings();});
 $('#btnHapt').onclick=clk(()=>{SV.set.haptics=!SV.set.haptics;buzz(30);save();renderSettings();});
 $('#btnFx').onclick=clk(()=>{SV.set.fx=!SV.set.fx;save();renderSettings();
  toast(ICONS.spark+'<span>'+(SV.set.fx?'Fancy effects ON':'Reduced effects — smooth & calm')+'</span>');});

 /* shop interactions (delegated) */
 $('#shopTabs').addEventListener('click',e=>{
  const t=e.target.closest('[data-tab]');if(!t)return;sfx('click');
  shopCat=t.dataset.tab;renderShop();});
 $('#shopGrid').addEventListener('click',e=>{
  const buy=e.target.closest('[data-buy]');
  const eq=e.target.closest('[data-eq]');
  const tryB=e.target.closest('[data-try]');
  if(buy){const[cat,id]=buy.dataset.buy.split(':');buyItem(cat,id);}
  else if(eq){const[cat,id]=eq.dataset.eq.split(':');equipItem(cat,id);}
  else if(tryB){const[cat,id]=tryB.dataset.try.split(':');tryItem(cat,id);}
 });
 /* worlds interactions */
 $('#worldGrid').addEventListener('click',e=>{
  const goBtn=e.target.closest('[data-wgo]');
  if(goBtn){sfx('worldgo');SV.world=goBtn.dataset.wgo;save();buildBg();buildPrevBg();
   toast(ICONS.globe+'<span>Now building in <b>'+WORLD().n+'</b>!</span>');
   renderWorlds();return;}
 });
}

/* ================= INIT ================= */
function init(){
 splitTitle($('#titleStack'),'STACK');
 splitTitle($('#titleTower'),'TOWER');
 $$('[data-ic]').forEach(el=>{el.innerHTML=ICONS[el.dataset.ic]||'';});
 applyUI();applyPaper();refreshCoins();updateCoinsUI();
 $('#btnPsound').textContent='SOUND: '+(SV.set.sound?'ON':'OFF');
 ensureDailyQuest();ensureWeek();
 resize();buildFeverGlow();
 renderMenu();renderSettings();
 bindEvents();
 /* day tracking */
 const t=todayStr();
 if(SV.lastDay!==t&&SV.first){SV.lastDay=t;SV.days++;}
 SV.first=1;save();
 if(loadWarn)toast(ICONS.spark+'<span>'+loadWarn+'</span>');
 if(!storageOK)toast(ICONS.lock+'<span>Heads up: this browser blocks saving — progress won\u2019t persist.</span>');
 requestAnimationFrame(t=>{last=t;requestAnimationFrame(frame);
  const b=$('#boot');if(b)b.remove();});
 if(!SV.tut){
  /* FIRST LAUNCH: start directly in the tutorial game (no menu first).
     After the tutorial overlay finishes, play continues seamlessly into the real game. */
  if(!SV.welcome){SV.welcome=1;SV.coins+=100;SV.coinsEarned+=100;save();}
  updateCoinsUI();
  try{startGame(false);}catch(e){go('menu');}
  setTimeout(()=>toast(ICONS.gift+'<span>Welcome! <b>+100 coins</b> gift!</span>'),600);
 }else if(!SV.welcome){go('welcome');}
}
window.__inited=false;
window.addEventListener('error',e=>{
 if(!window.__inited){const bm=$('#bootMsg');if(bm)bm.innerHTML='Oops — the paper tore!<br><small>Please reload the page.</small>';}
});
CG.init();
try{init();window.__inited=true;CG.loadingStop();}catch(err){
 window.__inited=false;
 const bm=$('#bootMsg');
 if(bm)bm.innerHTML='Oops — the paper tore!<br><small>Please reload the page.</small>';
 try{console.error(err);}catch(e){}
}
