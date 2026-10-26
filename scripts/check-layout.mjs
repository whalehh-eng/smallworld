import assert from 'node:assert/strict';
const {rooms}=await import('../src/game/layout.ts');
let checks=0;
for(const [key,room] of Object.entries(rooms)){
 const walk=(x,y)=>!room.blocks.some(([bx,by,w,h])=>x+7>bx&&x-7<bx+w&&y>by&&y-9<by+h);
 assert(walk(...room.spawn),key+' spawn collides');checks++;
 const grid=4, start=room.spawn.map(v=>Math.round(v/grid)*grid),seen=new Set([start.join(',')]),q=[start];
 for(let n=0;n<q.length;n++){const [x,y]=q[n];for(const [dx,dy] of [[grid,0],[-grid,0],[0,grid],[0,-grid]]){const nx=x+dx,ny=y+dy,k=[nx,ny].join(',');if(nx>=0&&ny>=0&&nx<=768&&ny<=576&&!seen.has(k)&&walk(nx,ny)){seen.add(k);q.push([nx,ny]);}}}
 for(const spot of room.spots){assert(q.some(([x,y])=>Math.hypot(x-spot.x,y-spot.y)<64),key+' unreachable '+spot.label);checks++;if(spot.to){assert(rooms[spot.to].blocks.every(([bx,by,w,h])=>!(spot.spawn[0]+7>bx&&spot.spawn[0]-7<bx+w&&spot.spawn[1]>by&&spot.spawn[1]-9<by+h)),spot.to+' door destination collides');checks++;}}
 console.log(key+': '+seen.size+' reachable floor cells, all interactions reachable');
}
assert.deepEqual(Object.values(rooms).flatMap(r=>r.spots.filter(s=>s.gift).map(s=>s.gift)).sort(),['cake','letter','photos','video']);checks++;
console.log('Passed '+checks+' collision / interaction / spawn checks.');
