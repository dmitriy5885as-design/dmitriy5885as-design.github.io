'use client';
import {useEffect,useState} from 'react';
import {Sun,Moon} from 'lucide-react';
const KEY='pedagog-theme';
type Theme='light'|'dark';
export default function ThemeToggle(){
 const [theme,setTheme]=useState<Theme>('light');
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const read=():Theme=>{try{const value=localStorage.getItem(KEY);if(value==='light'||value==='dark')return value;}catch{}return media.matches?'dark':'light'};
  const apply=(value:Theme)=>{document.documentElement.dataset.theme=value;document.documentElement.style.colorScheme=value;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',value==='dark'?'#141c19':'#f6f5f0');setTheme(value)};
  const sync=()=>apply(read());
  const storage=(event:StorageEvent)=>{if(event.key===KEY||event.key===null)sync()};
  sync();setReady(true);media.addEventListener('change',sync);window.addEventListener('storage',storage);
  return()=>{media.removeEventListener('change',sync);window.removeEventListener('storage',storage)};
 },[]);
 const toggle=()=>{const value:Theme=theme==='dark'?'light':'dark';document.documentElement.dataset.theme=value;document.documentElement.style.colorScheme=value;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',value==='dark'?'#141c19':'#f6f5f0');setTheme(value);try{localStorage.setItem(KEY,value)}catch{}};
 const label=theme==='dark'?'Включить светлую тему':'Включить тёмную тему';
 return <button type="button" className="theme-toggle" disabled={!ready} onClick={toggle} aria-label={ready?label:'Переключить тему'} title={ready?label:'Переключить тему'}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}<span>{theme==='dark'?'Светлая тема':'Тёмная тема'}</span></button>;
}
