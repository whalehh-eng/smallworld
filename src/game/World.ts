import Phaser from 'phaser';
import {makeMap,character} from './art';
import {bridge,controls,emit,type Room,type Gift} from './bridge';
import {rooms} from './layout';
export class World extends Phaser.Scene {
 room:Room='bedroom';player!:Phaser.GameObjects.Sprite; cursors!:Phaser.Types.Input.Keyboard.CursorKeys;keys!:Record<string,Phaser.Input.Keyboard.Key>;current:(typeof rooms)[Room]['spots'][number]|null=null; lastHint=''; changing=false;frame=0;direction=0; marks:Phaser.GameObjects.GameObject[]=[]; started=false; map!:Phaser.GameObjects.Image; effects:Phaser.GameObjects.GameObject[]=[];
 constructor(){super('world');}
 create(){
  for(const room of ['bedroom','town','cafe'] as Room[])this.textures.addCanvas(room,makeMap(room));
  for(let d=0;d<4;d++)for(let f=0;f<4;f++)this.textures.addCanvas(`hero-${d}-${f}`,character(d,f));
  this.map=this.add.image(0,0,'town').setOrigin(0);this.player=this.add.sprite(384,424,'hero-0-0').setOrigin(.5,1).setScale(1).setDepth(10);
  this.cameras.main.setBounds(0,0,768,576).startFollow(this.player,true,.12,.12);
  this.cursors=this.input.keyboard!.createCursorKeys();this.keys=this.input.keyboard!.addKeys('W,A,S,D') as typeof this.keys;
  this.input.keyboard!.addCapture(['UP','DOWN','LEFT','RIGHT','W','A','S','D']);
  const start=()=>{this.started=true;this.switchRoom('bedroom',[384,424],false);};
  const interact=()=>this.activate();bridge.addEventListener('start',start);bridge.addEventListener('interact',interact);
  this.events.once('shutdown',()=>{bridge.removeEventListener('start',start);bridge.removeEventListener('interact',interact);});
  this.switchRoom('town',[384,365],false);emit('ready',true);
 }
 switchRoom(room:Room,spawn:[number,number],fade=true){
  if(this.changing)return;this.changing=true;emit('hint',null);this.current=null;this.lastHint='';
  const apply=()=>{
   this.room=room;this.map.setTexture(room);this.player.setPosition(...spawn);this.marks.forEach(m=>m.destroy());this.effects.forEach(m=>m.destroy());this.marks=[];this.effects=[];
   for(const s of rooms[room].spots){const mark=this.add.text(s.x,s.y-33,s.to?'⌃':'✦',{fontFamily:'serif',fontSize:'16px',color:'#fff0bd',stroke:'#8c7974',strokeThickness:2}).setOrigin(.5).setDepth(8).setInteractive({useHandCursor:true});mark.on('pointerdown',()=>{if(this.current===s)this.activate();});this.tweens.add({targets:mark,y:mark.y-4,alpha:.65,duration:1400,yoyo:true,repeat:-1});this.marks.push(mark);
    const zone=this.add.zone(s.x,s.y-10,64,65).setDepth(7).setInteractive({useHandCursor:true});zone.on('pointerdown',()=>{if(this.current===s)this.activate();});this.marks.push(zone);
   }
   // Sparse petals and water glints, all drawn on the same pixel grid.
   if(room==='town'){const tail=this.add.rectangle(360,361,10,3,0xc6b79c).setOrigin(1,.5);this.tweens.add({targets:tail,angle:-25,duration:1600,yoyo:true,repeat:-1});this.effects.push(tail);for(let i=0;i<14;i++){const p=this.add.rectangle((i*61)%768,(i*97)%576,3,2,i%2?0xe8c1cb:0xe8d8b4,.7).setDepth(12);this.tweens.add({targets:p,x:p.x+40,y:p.y+85,alpha:0,duration:6500+i*200,repeat:-1,delay:i*300});this.effects.push(p);}for(let i=0;i<8;i++){const p=this.add.rectangle(610+i*17,354+(i%4)*38,12,2,0xd6e5da,.4);this.tweens.add({targets:p,alpha:.1,x:p.x+9,duration:1800+i*110,yoyo:true,repeat:-1});this.effects.push(p);}}
   else {const glow=this.add.ellipse(550,165,135,65,0xffedbd,.09).setDepth(4);this.effects.push(glow);}
   emit('room',rooms[room].name);if(fade)this.cameras.main.fadeIn(420,40,34,43);this.changing=false;
  };
  if(fade){this.cameras.main.fadeOut(260,40,34,43);this.time.delayedCall(270,apply);}else apply();
 }
 activate(){if(controls.paused||this.changing||!this.current)return;const s=this.current;
  if(s.to){this.switchRoom(s.to,s.spawn!);return;}
  this.player.setTexture(`hero-${this.direction}-1`);
  if(s.gift==='video'||s.gift==='letter'){const lid=this.add.rectangle(s.x,s.y-(s.gift==='video'?37:30),s.gift==='video'?32:24,7,s.gift==='video'?0xc7a178:0xc799a1).setDepth(8);this.tweens.add({targets:lid,y:lid.y-10,alpha:0,duration:700,onComplete:()=>lid.destroy()});for(let i=0;i<7;i++){const star=this.add.text(s.x,s.y-28,'✧',{fontSize:'12px',color:'#ffe8ac'}).setDepth(13);this.tweens.add({targets:star,x:s.x+(i-3)*10,y:s.y-60-Math.abs(i-3)*4,alpha:0,duration:900,onComplete:()=>star.destroy()});}}
  controls.paused=true;this.lastHint='';emit('gift',s.gift);emit('hint',null);
 }
 canWalk(x:number,y:number){return !rooms[this.room].blocks.some(([bx,by,w,h])=>x+7>bx&&x-7<bx+w&&y>by&&y-9<by+h);}
 update(time:number,delta:number){
  if(!this.player||!this.started)return;
  if(controls.paused||this.changing){this.player.setTexture(`hero-${this.direction}-0`);return;}
  let dx=Number(this.cursors.right.isDown||this.keys.D.isDown||controls.right)-Number(this.cursors.left.isDown||this.keys.A.isDown||controls.left);
  let dy=Number(this.cursors.down.isDown||this.keys.S.isDown||controls.down)-Number(this.cursors.up.isDown||this.keys.W.isDown||controls.up);
  if(dx||dy){if(Math.abs(dx)>Math.abs(dy))this.direction=dx<0?1:2;else this.direction=dy<0?3:0;const speed=117*Math.min(delta,40)/1000/Math.hypot(dx,dy);dx*=speed;dy*=speed;
   if(this.canWalk(this.player.x+dx,this.player.y))this.player.x+=dx;if(this.canWalk(this.player.x,this.player.y+dy))this.player.y+=dy;this.frame=Math.floor(time/145)%4;
  }else this.frame=0;
  this.player.setTexture(`hero-${this.direction}-${this.frame}`);
  this.current=rooms[this.room].spots.filter(s=>Phaser.Math.Distance.Between(s.x,s.y,this.player.x,this.player.y)<64).sort((a,b)=>Phaser.Math.Distance.Between(a.x,a.y,this.player.x,this.player.y)-Phaser.Math.Distance.Between(b.x,b.y,this.player.x,this.player.y))[0]??null;
  const hint=this.current?.label??'';if(hint!==this.lastHint){this.lastHint=hint;emit('hint',hint||null);}
 }
}
export function createGame(parent:HTMLElement){const ratio=parent.clientWidth/parent.clientHeight;const width=Math.min(768,Math.round(576*ratio)),height=Math.min(576,Math.round(768/ratio));return new Phaser.Game({type:Phaser.AUTO,parent,width,height,backgroundColor:'#a8bd91',pixelArt:true,roundPixels:true,antialias:false,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:World,audio:{noAudio:true},input:{activePointers:3}});}
