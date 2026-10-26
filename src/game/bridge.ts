export type Room = 'bedroom' | 'town' | 'cafe';
export type Gift = 'letter' | 'cake' | 'photos' | 'video';
export const bridge = new EventTarget();
export const controls = { up:false, down:false, left:false, right:false, paused:true };
export function emit(type:string, detail:unknown) { bridge.dispatchEvent(new CustomEvent(type,{detail})); }
