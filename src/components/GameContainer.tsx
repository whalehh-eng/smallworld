import {useEffect,useRef} from 'react';
import {createGame} from '../game/World';
export function GameContainer(){const parent=useRef<HTMLDivElement>(null);useEffect(()=>{const game=createGame(parent.current!);return()=>game.destroy(true)},[]);return <div className="game-canvas" ref={parent} aria-label="生日小镇游戏画面"/>}
