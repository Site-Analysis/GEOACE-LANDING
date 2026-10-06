const canvas=document.getElementById('field'),ctx=canvas.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),slides=[...document.querySelectorAll('.slide')],links=[...document.querySelectorAll('.chapter-nav a')];
let w=1,h=1,t=0,paused=reduce.matches,frame=0,last=0,px=0,py=0,tx=0,ty=0,progress=0,spread=0,scrollPending=false;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));const lerp=(a,b,v)=>a+(b-a)*v;const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
const points=[];
for(let ring=0;ring<53;ring++){const r=.08+ring/53*.92,n=Math.round(40+r*150);for(let j=0;j<n;j++)points.push({r,a:j/n*Math.PI*2,band:Math.min(3,Math.floor(ring/13.25))});}
function size(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);updateScroll();draw(0);}
function updateScroll(){scrollPending=false;const y=scrollY;const mid=slides[1].offsetTop,end=slides[2].offsetTop;progress=y<mid?y/mid:1+(y-mid)/(end-mid);progress=clamp(progress,0,2);document.body.classList.toggle('past-opening',y>mid*.62);const active=progress<.55?0:progress<1.55?1:2;links.forEach((a,i)=>{if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});document.getElementById('progress-bar').style.transform=`scaleX(${clamp(y/(document.documentElement.scrollHeight-h))})`;slides.forEach((s,i)=>{const local=(y-s.offsetTop)/h,c=s.querySelector('.slide-content');if(!reduce.matches){const opacity=i===0?clamp(1-local*1.8):clamp(Math.min((local+1.1)*2.2,(1-local)*2));c.style.opacity=opacity;c.style.transform=`translate3d(0,${clamp(-local,-1,1)*35}px,0) scale(${i===0?1-clamp(local)*.06:1})`;}});if(paused){spread=smooth(progress-1);draw(0);}}
function draw(dt){t+=dt;px+=(tx-px)*.04;py+=(ty-py)*.04;const reveal=smooth(progress),layer=smooth(progress-1);spread+= (layer-spread)*.07;ctx.clearRect(0,0,w,h);const mobile=w<621;
 const layerSlide=slides[2];const visibleSection=progress>1.5?layerSlide:slides[1];
 const mobileY=clamp((visibleSection.offsetTop-scrollY+visibleSection.offsetHeight-245)/h,.50,1.35);
 const cx=lerp(w*.5,mobile?w*.47:w*.73,reveal),cy=lerp(h*.52,mobile?h*mobileY:h*.51,reveal);
 const scale=lerp(Math.max(w*.57,h*.64),mobile?w*.44:Math.min(w*.24,h*.47),reveal);
 const rotation=-.34+Math.sin(t*.14)*.12+px*.13,co=Math.cos(rotation),si=Math.sin(rotation);
 for(const p of points){const a=p.a+t*.035,r=p.r,ripple=Math.sin(a*3+r*7+t*.65)*.085+Math.cos(a*5-r*5-t*.32)*.04,rr=r*(1+ripple),x=Math.cos(a)*rr,z=Math.sin(a)*rr,elev=.27*Math.sin(r*5.4-a*1.5+t*.24)+.1*Math.cos(a*3+r*9),xr=x*co-z*si,zr=x*si+z*co;
 const sx=cx+xr*scale*(1-spread*.13)+px*8,sy=cy+zr*scale*lerp(.77,.48,reveal)-elev*scale*(1-spread*.65)+(p.band-1.5)*spread*.36*scale+py*9;
 const centerDistance=Math.hypot((sx-w*.5)/(w*.32),(sy-h*.46)/(h*.38));const clearCenter=lerp(clamp((centerDistance-.55)*.9,.035,.42),1,reveal);
 const alpha=(.28+(zr+1)*.16+(1-r)*.12)*clearCenter;const accent=p.band===1||Math.sin(a*2+r*10+t*.5)>.72;
 ctx.fillStyle=accent?`rgba(166,78,45,${alpha})`:`rgba(58,64,52,${alpha})`;const dot=Math.max(.7,Math.min(1.4,scale/250))*(.78+(zr+1)*.13);ctx.fillRect(sx,sy,dot,dot);
 }
}
function loop(now){const dt=last?Math.min((now-last)/1000,.04):0;last=now;draw(dt);if(!paused&&!document.hidden)frame=requestAnimationFrame(loop);}
function motionState(){document.body.classList.toggle('motion-paused',paused);document.getElementById('motion-label').textContent=paused?'Motion off':'Motion on';document.getElementById('motion-icon').textContent=paused?'▷':'Ⅱ';document.getElementById('motion').setAttribute('aria-label',paused?'Resume animation':'Pause animation');document.getElementById('motion').setAttribute('aria-pressed',String(paused));}
function start(){cancelAnimationFrame(frame);if(!paused&&!document.hidden){last=0;frame=requestAnimationFrame(loop);}}
// Native scrolling stays intact for touch, trackpad, keyboard and anchor links.
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScroll);}},{passive:true});
addEventListener('resize',size);addEventListener('pointermove',e=>{tx=e.clientX/w-.5;ty=e.clientY/h-.5;},{passive:true});document.addEventListener('pointerleave',()=>{tx=ty=0;});
document.getElementById('motion').addEventListener('click',()=>{paused=!paused;motionState();start();});document.addEventListener('visibilitychange',start);
reduce.addEventListener('change',e=>{if(e.matches){paused=true;motionState();start();}updateScroll();});size();motionState();start();
