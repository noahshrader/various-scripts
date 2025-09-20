// ES5 shader background build
// Solid background #FBFBF9
var LIGHT_COLORS=["#D2FFFC","#D0E5FF","#FEBCBD","#B8FFD5","#CBCFFF","#FEB8EE","#E0B6FE"];
function hexToVec3(h){h=h.replace('#','');return new THREE.Vector3(parseInt(h.substring(0,2),16)/255,parseInt(h.substring(2,4),16)/255,parseInt(h.substring(4,6),16)/255);}
function pickTwo(){var i=Math.floor(Math.random()*LIGHT_COLORS.length);var j=Math.floor(Math.random()*(LIGHT_COLORS.length-1));if(j>=i){j=j+1;}return [LIGHT_COLORS[i],LIGHT_COLORS[j]];}
var vertexShader=[
"varying vec2 vUv;",
"void main(){",
"  vUv=uv;",
"  gl_Position=vec4(position,1.0);",
"}"
].join("\n");
var fragmentShader=["uniform float uTime;","uniform vec2 uResolution;","uniform vec2 uMouse;","varying vec2 vUv;","uniform float uSeed;","uniform vec3 uBlob1;","uniform vec3 uBlob2;","vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}","vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}","vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}","float snoise(vec2 v){","const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);","vec2 i=floor(v+dot(v,C.yy));","vec2 x0=v-i+dot(i,C.xx);","vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);","vec4 x12=x0.xyxy+C.xxzz;","x12.xy-=i1;","i=mod289(i);","vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));","vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);","m=m*m; m=m*m;","vec3 x=2.0*fract(p*C.www)-1.0;","vec3 h=abs(x)-0.5;","vec3 ox=floor(x+0.5);","vec3 a0=x-ox;","m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);","vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;","return 130.0*dot(m,g);","}","float getBayerFromCoordLevel(vec2 pc){","const int dim=8;","const float B[64]=float[64](","0.0/64.0,32.0/64.0,8.0/64.0,40.0/64.0,2.0/64.0,34.0/64.0,10.0/64.0,42.0/64.0,","48.0/64.0,16.0/64.0,56.0/64.0,24.0/64.0,50.0/64.0,18.0/64.0,58.0/64.0,26.0/64.0,","12.0/64.0,44.0/64.0,4.0/64.0,36.0/64.0,14.0/64.0,46.0/64.0,6.0/64.0,38.0/64.0,","60.0/64.0,28.0/64.0,52.0/64.0,20.0/64.0,62.0/64.0,30.0/64.0,54.0/64.0,22.0/64.0,","3.0/64.0,35.0/64.0,11.0/64.0,43.0/64.0,1.0/64.0,33.0/64.0,9.0/64.0,41.0/64.0,","51.0/64.0,19.0/64.0,59.0/64.0,27.0/64.0,49.0/64.0,17.0/64.0,57.0/64.0,25.0/64.0,","15.0/64.0,47.0/64.0,7.0/64.0,39.0/64.0,13.0/64.0,45.0/64.0,5.0/64.0,37.0/64.0,","63.0/64.0,31.0/64.0,55.0/64.0,23.0/64.0,61.0/64.0,29.0/64.0,53.0/64.0,21.0/64.0);","int x=int(mod(pc.x,float(dim))); int y=int(mod(pc.y,float(dim)));","return B[x+y*dim];","}","void main(){","vec2 uv=vUv;","float mouseInfluence=1.15;","vec2 mouseOffset=(uMouse-uv)*mouseInfluence;","vec2 distortion=mouseOffset*exp(-length(uMouse-uv)*5.0);","distortion=clamp(distortion,-0.1,0.1);","vec2 distortedUV=uv+distortion;","float blob1=snoise(distortedUV*0.6+uTime*0.01+vec2(uSeed))*0.5 + snoise(distortedUV*1.2-uTime*0.015+vec2(uSeed*1.5))*0.25;","float blob2=snoise(distortedUV*0.8-uTime*0.012+vec2(uSeed*2.0))*0.5 + snoise(distortedUV*1.0+uTime*0.008+vec2(uSeed*2.5))*0.25;","float detail=snoise(distortedUV*3.0+uTime*0.007+vec2(uSeed*3.0))*0.15;","float centerDistance=length(uv-0.5)*2.0;","float edgeBias=1.0-smoothstep(0.0,1.0,centerDistance);","blob1=mix(blob1,blob1*0.05,edgeBias);","blob2=mix(blob2,blob2*0.05,edgeBias);","blob1+=detail; blob2+=detail;","float blob1Mask=smoothstep(0.1,0.3,blob1);","float blob2Mask=smoothstep(0.1,0.3,blob2);","vec3 finalColor=vec3(0.984314, 0.984314, 0.976471);","finalColor=mix(finalColor,uBlob1,blob1Mask*0.75);","finalColor=mix(finalColor,uBlob2,blob2Mask*0.75);","float d=getBayerFromCoordLevel(uv*uResolution*0.5);","finalColor += vec3(d*0.02);","gl_FragColor=vec4(finalColor,1.0);","}"].join("\n");
function ShaderBackground(el){
this.targetElement=el;
this.scene=new THREE.Scene();
this.camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
this.renderer=new THREE.WebGLRenderer({ antialias: true, alpha: false });
this.mouse=new THREE.Vector2(0.5,0.5);
this.clock=new THREE.Clock();
this.smoothedMouse=new THREE.Vector2(0.5,0.5);
this.targetMouse=new THREE.Vector2(0.5,0.5);
this.mouseVelocity=new THREE.Vector2(0.0,0.0);
this.init(); this.createMesh(); this.addEventListeners(); this.animate();
}
ShaderBackground.prototype.init=function(){
var b=this.targetElement.getBoundingClientRect();
this.renderer.setSize(b.width,b.height);
this.renderer.setClearColor(0xfbfbf9,1.0);
this.renderer.domElement.style.position='absolute';
this.renderer.domElement.style.top='0';
this.renderer.domElement.style.left='0';
this.renderer.domElement.style.zIndex='-1';
this.renderer.domElement.style.width='100%';
this.renderer.domElement.style.height='100%';
this.targetElement.style.position='relative';
this.targetElement.style.height='100%';
this.targetElement.style.width='100%';
this.targetElement.insertBefore(this.renderer.domElement,this.targetElement.firstChild);
this.onResize();
};
ShaderBackground.prototype.createMesh=function(){
var geometry=new THREE.PlaneGeometry(2,2);
var pair=pickTwo();
var col1=hexToVec3(pair[0]); var col2=hexToVec3(pair[1]);
this.material=new THREE.ShaderMaterial({vertexShader:vertexShader,fragmentShader:fragmentShader,transparent:false,uniforms:{uTime:{value:0},uResolution:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)},uMouse:{value:this.mouse},uSeed:{value:Math.random()*100.0},uBlob1:{value:col1},uBlob2:{value:col2}}});
var mesh=new THREE.Mesh(geometry,this.material); this.scene.add(mesh);
};
ShaderBackground.prototype.addEventListeners=function(){
var self=this; window.addEventListener('resize',function(){self.onResize();},false); window.addEventListener('mousemove',function(e){self.onMouseMove(e);},false);
};
ShaderBackground.prototype.onResize=function(){ if(!this.material||!this.scene.children[0])return; var b=this.targetElement.getBoundingClientRect(); this.renderer.setSize(b.width,b.height,false); this.material.uniforms.uResolution.value.set(b.width,b.height); var mesh=this.scene.children[0]; mesh.scale.x=1; mesh.scale.y=b.height/b.width; };
ShaderBackground.prototype.onMouseMove=function(e){ this.targetMouse.x=e.clientX/window.innerWidth; this.targetMouse.y=1-e.clientY/window.innerHeight; };
ShaderBackground.prototype.animate=function(){ var self=this; requestAnimationFrame(function(){self.animate();}); var smooth=0.05,mom=0.85; this.mouseVelocity.x=(this.targetMouse.x-this.smoothedMouse.x)*smooth; this.mouseVelocity.y=(this.targetMouse.y-this.smoothedMouse.y)*smooth; this.smoothedMouse.x+=this.mouseVelocity.x; this.smoothedMouse.y+=this.mouseVelocity.y; this.mouseVelocity.multiplyScalar(mom); var mesh=this.scene.children[0]; mesh.material.uniforms.uTime.value=this.clock.getElapsedTime(); mesh.material.uniforms.uMouse.value=this.smoothedMouse; this.renderer.render(this.scene,this.camera); };
function initShaderBackgrounds(){ var els=document.getElementsByClassName('patternbg'); for(var i=0;i<els.length;i++){ try{ new ShaderBackground(els[i]); } catch(e){ console.warn(e); } } }
(function(){ if(typeof THREE==='undefined'){ var s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'; s.onload=initShaderBackgrounds; document.head.appendChild(s);} else { initShaderBackgrounds(); } })();