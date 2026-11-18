import OwnerCabinetLink from './owner-cabinet-link';
import {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowLeft,ArrowUpRight,Download,Box} from 'lucide-react';
import Home from './home';
import ThemeToggle from './theme-toggle';
import Syscore,{metadata as syscoreMetadata} from './projects/syscore/page';
import Game,{metadata as gameMetadata} from './projects/svoya-igra/page';
import Journal,{metadata as journalMetadata} from './projects/electronic-journal/page';
import Chess,{metadata as chessMetadata} from './projects/chess/page';
import snapshot from './snapshot.json';
import articles from './articles.json';
const withArticles=(value:typeof snapshot)=>({...value,posts:[...value.posts,...articles.filter(a=>!value.posts.some((p:any)=>p.id===a.id))] as typeof snapshot.posts});
import {BACKEND} from './config';
import {singular} from './types';
import './globals.css';
type PublicData=typeof snapshot;
const programDetails:Record<string,{file:string;cover:string;alt:string;caption:string}>={
 'program-format-3d-132':{file:'/lessons/programs/format-3d-132-hours.docx',cover:'/lessons/programs/format-3d-cover.png',alt:'Геометрические тела и 3D-печатная деталь на чертёжной сетке',caption:'Иллюстрация программы «Формат 3Д» — геометрия, моделирование и печать.'},
 'program-3d-genius-132':{file:'/lessons/programs/3d-genius-132-hours.docx',cover:'/lessons/programs/3d-genius-cover.png',alt:'Путь от эскиза и CAD-модели к напечатанному прототипу робота',caption:'Иллюстрация программы «3Д-Гений» — путь от идеи к прототипу.'}
};
const path=location.pathname.replace(/\/+$/,'');
const projects:Record<string,{Page:()=>React.ReactNode,metadata:{title:string}}>= {'/projects/chess':{Page:Chess,metadata:chessMetadata},'/projects/syscore':{Page:Syscore,metadata:syscoreMetadata},'/projects/svoya-igra':{Page:Game,metadata:gameMetadata},'/projects/electronic-journal':{Page:Journal,metadata:journalMetadata}};
function PublicPost({data}:{data:PublicData}){
 const id=new URLSearchParams(location.search).get('id')||'';
 const post=data.posts.find((x:any)=>x.id===id) as any;
 const program=programDetails[id];
 const viewer=useRef<HTMLDivElement>(null);
 const [viewerStatus,setViewerStatus]=useState('Подготавливаю просмотр программы…');
 useEffect(()=>{
  const container=viewer.current;
  if(!program||!container)return;
  let cancelled=false;
  const loadScript=(src:string)=>new Promise<void>((resolve,reject)=>{
   const existing=Array.from(document.scripts).find(script=>script.src===src);
   if(existing){
    if(src.includes('docx-preview')&&(window as any).docx?.renderAsync){resolve();return}
    existing.addEventListener('load',()=>resolve(),{once:true});
    existing.addEventListener('error',()=>reject(new Error('Не удалось загрузить просмотрщик')),{once:true});
    return;
   }
   const script=document.createElement('script');
   script.src=src;
   script.async=true;
   script.crossOrigin='anonymous';
   script.onload=()=>resolve();
   script.onerror=()=>reject(new Error('Не удалось загрузить просмотрщик'));
   document.head.append(script);
  });
  const render=async()=>{
   try{
    const scope=window as any;
    if(!scope.JSZip)await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
    if(!scope.docx?.renderAsync)await loadScript('https://cdn.jsdelivr.net/npm/docx-preview@0.4.0/dist/docx-preview.min.js');
    const response=await fetch(program.file);
    if(!response.ok)throw new Error('Файл программы недоступен');
    const documentFile=await response.blob();
    if(cancelled)return;
    await scope.docx.renderAsync(documentFile,container,container,{breakPages:true,ignoreLastRenderedPageBreak:false,renderAltChunks:false});
    if(!cancelled)setViewerStatus('Программа загружена. Листайте документ прямо в этом окне.');
   }catch{
    if(!cancelled)setViewerStatus('Не удалось показать документ. Его можно скачать в формате DOCX ниже.');
   }
  };
  void render();
  return()=>{cancelled=true;container.replaceChildren()};
 },[program?.file]);
 if(!post)return <main className="section"><h1>Публикация не найдена</h1><p>Возможно, она снята с публикации или временно недоступна.</p><a className="button outline" href="/#library">К материалам</a></main>;
 return <><header className="header"><a href="/" className="brand"><Box/><span>МАСТЕРСКАЯ<br/><b>ПЕДАГОГА</b></span></a><OwnerCabinetLink/></header><main className="article section"><a className="text-link" href="/#library"><ArrowLeft size={17}/> К материалам</a><div className="eyebrow article-label">{singular[post.kind]} · {new Date(post.updated_at).toLocaleDateString('ru-RU')}</div><h1>{post.title}</h1><p className="article-summary">{post.summary}</p><div className="tags">{post.tags.split(',').filter(Boolean).map((t:string)=><span key={t}>{t.trim()}</span>)}</div>
 {program&&<figure className="article-cover program-cover"><img src={program.cover} alt={program.alt} width={1536} height={1024}/><figcaption>{program.caption}</figcaption></figure>}
 {post.id==='kompas-3d-pervaya-model'&&<figure className="article-cover"><img src="/articles/kompas-first-part.webp" alt="От плоского эскиза к объёмной модели и готовой синей детали" width={1672} height={941}/><figcaption>Эскиз → объёмная модель → первая деталь. Концептуальная иллюстрация.</figcaption></figure>}
 {post.id==='gost-esdk-chertiezhi'&&<figure className="article-cover"><img src="/materials/gosty/gost-eskd-cover.svg" alt="Технические виды детали с размерами и её объёмная 3D-модель" width="1200" height="600"/><figcaption>Чертёж показывает проекции и размеры детали; 3D-модель помогает увидеть её объёмную форму.</figcaption></figure>}
 <div className="article-body">{post.body}</div>
 {program&&<section className="program-reader" aria-labelledby="program-reader-title"><div className="program-reader-heading"><div><div className="eyebrow">ПРОГРАММА · 132 ЧАСА</div><h2 id="program-reader-title">Просмотр программы</h2></div><p>Документ открывается на этой странице. Прокручивайте окно, чтобы читать следующие страницы.</p></div><div className="program-reader-status" role="status" aria-live="polite">{viewerStatus}</div><div className="program-docx-viewer" ref={viewer}/></section>}
 {post.link&&<a className="button dark" href={post.link} target={post.downloadLabel?undefined:"_blank"} rel={post.downloadLabel?undefined:"noreferrer"} download={post.downloadLabel?true:undefined}>{post.downloadLabel||'Открыть ссылку'} <ArrowUpRight size={18}/></a>}
 {data.files.some((f:any)=>f.post_id===id)&&<section className="files"><h2>Файлы к публикации</h2>{data.files.filter((f:any)=>f.post_id===id).map((f:any)=><a className="file-download" key={f.id} href={BACKEND+'/api/files/'+encodeURIComponent(f.id)}><Download size={20}/><span>{f.name}<small>{(f.size/1024/1024).toFixed(2)} МБ</small></span><ArrowUpRight size={18}/></a>)}</section>}
 </main></>;
}
function App(){const [data,setData]=useState(withArticles(snapshot));useEffect(()=>{const controller=new AbortController();fetch(BACKEND+'/api/public-site',{credentials:'omit',signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Unavailable');return r.json()}).then((value:any)=>{if(value.profile?.name&&Array.isArray(value.posts)&&Array.isArray(value.files))setData(withArticles(value))}).catch(()=>{});return()=>controller.abort()},[]);useEffect(()=>{if(path==='/post'){const p=data.posts.find((x:any)=>x.id===new URLSearchParams(location.search).get('id')) as any;document.title=p?p.title+' | Мастерская педагога':'Публикация | Мастерская педагога'}else document.title=projects[path]?.metadata.title||data.profile.name+' | Мастерская педагога'},[data]);const project=projects[path];const Page=project?.Page;return <>{Page?<Page/>:path==='/post'?<PublicPost data={data}/>:<Home posts={data.posts as any} profile={data.profile} isEditor={false}/>}<ThemeToggle/></>}
createRoot(document.getElementById('root')!).render(<App/>);
