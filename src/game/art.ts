// Original pixel artwork. All coordinates use a shared 2px pixel grid.
export const P = { grass:'#a8bd91', grassDark:'#8da879', cream:'#f6ecd6', ink:'#655963', wood:'#b98c6a', roof:'#af7984', water:'#9cbfc2' };
export type Art = ReturnType<typeof painter>;
export function painter(w:number,h:number) {
 const canvas=document.createElement('canvas'); canvas.width=w;canvas.height=h;
 const c=canvas.getContext('2d')!; c.imageSmoothingEnabled=false;
 const rect=(x:number,y:number,w:number,h:number,col:string)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
 const line=(x:number,y:number,w:number,col:string)=>rect(x,y,w,2,col);
 return {canvas,c,rect,line};
}
export function tree(a:Art,x:number,y:number,s=1) {
 const {rect:r}=a; r(x+14*s,y+34*s,14*s,12*s,'#90a17b');r(x+18*s,y+20*s,8*s,24*s,'#92795f');r(x+22*s,y+26*s,3*s,15*s,'#b99b76');
 for(const [dx,dy,w,h,col] of [[6,12,32,22,'#718d73'],[0,8,42,19,'#809d7b'],[6,0,30,22,'#93ad87'],[12,-6,20,18,'#a6bb93'],[4,10,12,8,'#a2b78a'],[27,16,10,7,'#6e8b71']] as [number,number,number,number,string][])r(x+dx*s,y+dy*s,w*s,h*s,col);
 r(x+13*s,y+2*s,7*s,3*s,'#bbca9b');r(x+6*s,y+18*s,5*s,3*s,'#b0c394');
}
export function flower(a:Art,x:number,y:number,col='#e9bfca') { a.rect(x+2,y+4,2,5,'#789573');a.rect(x,y,6,4,col);a.rect(x+2,y-2,2,8,col);a.rect(x+2,y+1,2,2,'#f7e6b6'); }
export function pot(a:Art,x:number,y:number) {a.rect(x,y,14,12,'#b78271');a.rect(x-2,y,18,3,'#d3aa8a');a.rect(x+4,y-13,4,14,'#76977b');a.rect(x-2,y-11,8,5,'#8ea685');a.rect(x+7,y-17,9,6,'#a6ba96');}
export function windowArt(a:Art,x:number,y:number,w=38,h=38) {a.rect(x-3,y-3,w+6,h+7,'#9d7c68');a.rect(x,y,w,h,'#c2d6cf');a.rect(x+3,y+3,w-6,h-6,'#b1cbd0');a.rect(x+4,y+4,8,h-8,'#dce7d8');a.rect(x+w/2-1,y,3,h,'#f4e6d0');a.rect(x,y+h/2,w,3,'#f4e6d0');a.rect(x-8,y-5,8,h+12,'#d9b9b1');a.rect(x+w,y-5,8,h+12,'#d9b9b1');a.rect(x-7,y-3,3,h+8,'#ecd2c5');}
export function building(a:Art,x:number,y:number,w:number,h:number,label:string) {
 const r=a.rect;r(x+3,y+h-7,w,14,'#8c9e7d');r(x,y+30,w,h-30,'#d8bf9e');r(x+4,y+38,w-8,h-43,'#eddbc0');
 for(let yy=y+47;yy<y+h-8;yy+=12)r(x+5,yy,w-10,1,'#d9c6a9');
 r(x-8,y+24,w+16,12,'#7c6670');r(x-5,y+8,w+10,20,'#b8838d');r(x+4,y,w-8,14,'#c6969c');
 for(let yy=4;yy<30;yy+=7)for(let xx=-2;xx<w;xx+=14)r(x+xx+(yy%2?4:0),y+yy,12,2,'#d8a8ac');
 r(x+w-28,y-12,13,22,'#a98a7e');r(x+w-31,y-13,19,5,'#c9afa0');
 windowArt(a,x+15,y+49,25,30); windowArt(a,x+w-41,y+49,25,30);
 r(x+w/2-13,y+h-40,26,40,'#8b7466');r(x+w/2-10,y+h-36,20,34,'#a88c74');r(x+w/2+5,y+h-20,3,3,'#ecd5a2');
 r(x+w/2-33,y+37,66,14,'#f5e8cc');a.c.fillStyle='#796273';a.c.font='8px serif';a.c.textAlign='center';a.c.fillText(label,x+w/2,y+47);
 flower(a,x+10,y+h-9);flower(a,x+w-10,y+h-8);pot(a,x+w-17,y+h-10);
}
export function makeMap(room:'bedroom'|'town'|'cafe') {
 const a=painter(768,576),r=a.rect;
 let seed=841;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 if(room==='town') {
  r(0,0,768,576,P.grass);
  for(let i=0;i<3200;i++){const x=rnd()*768,y=rnd()*576;r(x,y,2+rnd()*3,2,i%3?'#b5c59b':'#95ad85');}
  // Curved paths and individually laid stones.
  const path=(x:number,y:number,w:number,h:number)=>{r(x,y,w,h,'#d6c9aa');for(let yy=y+4;yy<y+h-3;yy+=12)for(let xx=x+4;xx<x+w-5;xx+=20){r(xx+(yy%24?3:0),yy,15,8,'#e4d9bd');r(xx+2,yy+7,13,1,'#c5bba2');}};
  path(163,224,50,237);path(180,302,370,49);path(511,223,47,253);path(183,435,350,35);
  // Hand-stepped shoreline.
  r(572,314,196,228,'#b8cba7');r(586,326,182,207,'#d8d3b1');r(599,337,169,185,P.water);r(579,371,189,124,P.water);r(615,321,153,211,P.water);
  for(let i=0;i<65;i++){const x=605+rnd()*154,y=342+rnd()*170;r(x,y,8+rnd()*14,2,i%2?'#c4d8cd':'#83acb2');}
  r(547,406,116,42,'#907763');for(let x=548;x<663;x+=10){r(x,406,8,40,'#c09c78');r(x,410,8,2,'#d8b58b');}r(552,442,6,17,'#796b5b');r(646,442,6,17,'#796b5b');
  building(a,94,92,166,133,'LITTLE HOME');building(a,444,86,170,139,'MOON CAFE');
  // Fences, garden beds, bench, well and picnic rug.
  for(let x=54;x<295;x+=18){r(x,262,6,30,'#dfd5b7');r(x,270,19,4,'#c9b99c');r(x,281,19,4,'#c9b99c');}
  r(297,408,69,8,'#ab8b70');r(297,419,69,8,'#c6a17b');r(303,427,5,12,'#7e7463');r(356,427,5,12,'#7e7463');
  r(66,389,69,47,'#c1a4a3');r(70,393,61,39,'#e2c3bd');for(let xx=72;xx<130;xx+=12)r(xx,394,4,38,'#eedbc8');
  for(let i=0;i<120;i++){let x=rnd()*768,y=rnd()*576;if((x<75||x>660||y>490||y<65)||(x>285&&x<430&&y>115&&y<260))flower(a,x,y,['#e3b4c1','#f0e4ba','#c6bed5'][i%3]);}
  [[5,60],[39,119],[294,39],[365,69],[658,76],[706,126],[11,318],[12,470],[196,490],[301,500],[430,479],[688,250],[350,170],[706,16],[570,24]].forEach(([x,y])=>tree(a,x,y,1.3));
  // Mailbox
  r(278,265,7,38,'#927c69');r(266,249,31,23,'#aa7e8c');r(269,245,25,7,'#c799a1');r(272,254,19,3,'#786776');r(295,243,3,17,'#9b7468');r(298,243,10,7,'#dfbaa9');
  // Chest
  r(405,388,37,25,'#866c60');r(405,380,37,13,'#b7956f');r(409,377,29,5,'#cfb18a');r(409,383,4,28,'#e3c18a');r(434,383,4,28,'#e3c18a');r(420,391,7,9,'#eed398');
  // Cat
  r(365,360,19,9,'#dfd3b9');r(379,352,12,14,'#dfd3b9');r(379,349,4,6,'#c2b39e');r(388,349,3,6,'#c2b39e');r(382,357,2,2,'#71616b');r(389,357,2,2,'#71616b');r(358,359,10,4,'#c6b79c');
 } else {
  r(0,0,768,576,'#655b67');r(79,62,610,452,'#a28576');r(87,70,594,117,'#e5d5ba');r(87,177,594,329,'#c5a181');
  for(let y=183;y<505;y+=18){r(88,y,592,2,'#ad896f');for(let x=90+(y%36?45:0);x<680;x+=90)r(x,y,1,18,'#b58e73');}
  r(87,170,594,10,'#8e7368');r(88,76,592,5,'#f4e7cf');windowArt(a,174,104,58,51);windowArt(a,520,104,58,51);
  // door and entry rug
  r(355,493,58,21,'#817064');r(351,506,66,8,'#e4c9a0');r(340,461,88,28,'#b6b5a0');r(344,465,80,20,'#d6d2b7');
  if(room==='bedroom'){
   r(112,219,101,142,'#8f7365');r(116,220,93,131,'#e8d8bf');r(116,245,93,105,'#c7bdcf');r(121,250,83,90,'#d8cedd');for(let y=255;y<335;y+=15)r(122,y,80,2,'#c1b5cc');r(122,224,79,28,'#f4e9d9');r(125,229,32,18,'#e8ddd0');r(164,229,32,18,'#e8ddd0');
   r(490,220,136,37,'#9c7a64');r(496,223,124,26,'#c5a17b');r(499,257,7,29,'#8c7562');r(610,257,7,29,'#8c7562');r(537,228,28,13,'#efe5d2');r(575,224,16,17,'#a1b2a0');r(561,278,37,25,'#b48d7c');
   r(300,312,174,98,'#b58f94');r(306,318,162,86,'#d5b3b5');r(314,326,146,70,'#e1c8c1');for(let x=318;x<455;x+=15)r(x,332,6,3,'#c8a4ac');
   r(290,101,128,61,'#c0a38b');for(let i=0;i<3;i++){r(299+i*37,111+(i%2)*7,28,36,'#f8edda');r(302+i*37,114+(i%2)*7,22,24,['#a3b8ac','#cab5c6','#d7bd9a'][i]);r(309+i*37,122+(i%2)*7,9,12,'#e4d2b7');}
   r(116,92,35,77,'#987963');for(let j=0;j<3;j++){for(let i=0;i<5;i++)r(120+i*5,98+j*23,4,17,['#ab969b','#a1ad99','#dfc8a0'][i%3]);r(117,117+j*23,33,3,'#b69374');}
   pot(a,635,177);pot(a,253,250);r(443,218,21,39,'#b28e72');r(438,209,31,16,'#edd7a7');r(450,201,6,9,'#f4e3bb');
  } else {
   r(112,201,225,48,'#947361');r(113,201,223,10,'#e1c6a1');for(let x=127;x<330;x+=45){r(x,214,32,25,'#b19074');r(x+12,220,7,3,'#e8ce9f');}r(142,177,30,24,'#7e7776');r(146,180,20,11,'#bdc7be');r(185,187,18,14,'#eee4cc');
   for(const x of [155,515]){r(x,322,90,51,'#98765f');r(x+3,319,84,45,'#cfac83');r(x+9,373,6,17,'#8f7664');r(x+73,373,6,17,'#8f7664');for(const y of [289,388]){r(x+26,y,37,21,'#aa8570');r(x+27,y,35,5,'#c7a387');}r(x+29,328,20,14,'#f4e8ce');r(x+34,330,10,8,'#9f7f6b');}
   r(338,277,90,67,'#b6a1ad');r(343,281,80,58,'#e6d9c9');r(361,294,43,25,'#c18b98');r(361,291,43,9,'#f4e4c8');for(let x=365;x<402;x+=8)r(x,298,4,5,'#f1d4bc');r(367,285,31,9,'#f4dfcc');r(381,275,3,12,'#baab8e');r(379,269,6,7,'#e6b66e');
   pot(a,631,200);pot(a,116,456);r(365,95,56,58,'#8b7466');r(370,100,46,48,'#b8b9a1');a.c.fillStyle='#f4e4c7';a.c.font='10px serif';a.c.textAlign='center';a.c.fillText('TODAY',393,120);a.c.fillText('FOR YOU',393,138);
  }
 }
 return a.canvas;
}
export function character(dir:number,frame:number) {
 const a=painter(32,48),r=a.rect,step=frame===1?-1:frame===3?1:0;
 // Dark contours, independently drawn direction and gait frames, with loose wavy hair.
 r(5,45,23,2,'#6b625d44');
 r(9,35,6,9+step,'#737e81');r(19,35,6,9-step,'#737e81');
 r(8,43+step,8,3,'#4f4745');r(19,43-step,8,3,'#4f4745');r(10,43+step,4,1,'#b19f86');r(21,43-step,4,1,'#b19f86');
 r(7,23,20,15,'#ad9281');r(8,23,18,14,'#edddbf');r(9,35,17,3,'#cfbca1');r(14,28,2,9,'#d0b99e');r(15,30,2,2,'#9a816b');
 r(4,25+step,5,10,'#cfb69c');r(5,25+step,4,8,'#eee0c5');r(26,25-step,4,9,'#e9d8b9');r(5,33+step,4,3,'#e2bba0');r(26,33-step,4,3,'#e2bba0');
 r(7,5,19,21,'#443b3c');r(11,2,12,5,'#443b3c');r(13,0,6,3,'#594743');r(7,7,20,12,'#564543');
 for(const [x,y,w,h,col] of [[4,11,5,13,'#4b3d3d'],[3,21,6,10,'#594641'],[5,30,6,5,'#493c3a'],[26,10,4,13,'#4b3d3d'],[26,23,5,10,'#594641'],[24,32,5,5,'#493c3a'],[5,16,2,7,'#786051'],[27,24,2,5,'#806250'],[8,6,8,2,'#806153'],[18,4,5,2,'#73584e']] as [number,number,number,number,string][])r(x,y,w,h,col);
 if(dir!==3){
  r(10,11,15,13,'#ebc6a6');r(11,12,13,11,'#f2d3b5');r(9,11,3,7,'#5a4741');r(11,8,13,5,'#5a4741');r(12,11,3,4,'#5a4741');r(22,11,3,5,'#5a4741');
  if(dir===0){r(13,16,3,4,'#493f3d');r(21,16,3,4,'#493f3d');r(13,16,1,1,'#fff0d9');r(21,16,1,1,'#fff0d9');r(11,20,3,2,'#dfac99');r(23,20,2,2,'#dfac99');r(17,22,3,1,'#b78177');}
  else {const x=dir===1?11:22;r(x,16,3,4,'#493f3d');r(x,16,1,1,'#fff0d9');r(dir===1?9:24,20,3,2,'#dfa995');r(dir===1?12:22,22,2,1,'#b78177');}
  r(9,24,17,5,'#91a17d');r(10,24,16,2,'#b2bd99');r(20,29,5,7,'#93a17d');r(21,35,4,2,'#b2bd99');
  for(let i=0;i<12;i++)r(10+i,37-i,2,2,'#92745b');r(8,33,10,8,'#7e604b');r(9,33,8,6,'#ae8760');r(11,35,3,2,'#e0bf8b');
 }else{
  r(7,8,20,23,'#54423f');r(8,7,9,3,'#6d5249');r(11,10,2,13,'#6b5148');r(20,7,3,18,'#654d45');r(7,23,4,9,'#614a43');r(12,25,4,8,'#493c3a');r(18,25,4,9,'#614a43');r(23,24,4,8,'#493c3a');r(10,32,14,3,'#a3af90');
 }
 return a.canvas;
}
