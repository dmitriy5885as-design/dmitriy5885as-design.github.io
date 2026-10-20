import {useEffect,useState} from 'react';
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
const path=location.pathname.replace(/\/+$/,'');
const projects:Record<string,{Page:()=>React.ReactNode,metadata:{title:string}}>= {'/projects/chess':{Page:Chess,metadata:chessMetadata},'/projects/syscore':{Page:Syscore,metadata:syscoreMetadata},'/projects/svoya-igra':{Page:Game,metadata:gameMetadata},'/projects/electronic-journal':{Page:Journal,metadata:journalMetadata}};
function PublicPost({data}:{data:PublicData}){const id=new URLSearchParams(location.search).get('id')||'';const post=data.posts.find((x:any)=>x.id===id) as any;if(!post)return <main className="section"><h1>Публикация не найдена</h1><p>Возможно, она снята с публикации или временно недоступна.</p><a className="button outline" href="/#library">К материалам</a></main>;return <><header className="header"><a href="/" className="brand"><Box/><span>МАСТЕРСКАЯ<br/><b>ПЕДАГОГА</b></span></a><a href={BACKEND+'/cabinet'}>Кабинет ↗</a></header><main className="article section"><a className="text-link" href="/#library"><ArrowLeft size={17}/> К материалам</a><div className="eyebrow article-label">{singular[post.kind]} · {new Date(post.updated_at).toLocaleDateString('ru-RU')}</div><h1>{post.title}</h1><p className="article-summary">{post.summary}</p><div className="tags">{post.tags.split(',').filter(Boolean).map((t:string)=><span key={t}>{t.trim()}</span>)}</div><div className="article-body">{post.body}</div>{post.link&&<a className="button dark" href={post.link} target="_blank" rel="noreferrer">Открыть ссылку <ArrowUpRight size={18}/></a>}{data.files.some((f:any)=>f.post_id===id)&&<section className="files"><h2>Файлы к публикации</h2>{data.files.filter((f:any)=>f.post_id===id).map((f:any)=><a className="file-download" key={f.id} href={BACKEND+'/api/files/'+encodeURIComponent(f.id)}><Download size={20}/><span>{f.name}<small>{(f.size/1024/1024).toFixed(2)} МБ</small></span><ArrowUpRight size={18}/></a>)}</section>}</main></>}
function App(){const [data,setData]=useState(withArticles(snapshot));useEffect(()=>{const controller=new AbortController();fetch(BACKEND+'/api/public-site',{credentials:'omit',signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Unavailable');return r.json()}).then((value:any)=>{if(value.profile?.name&&Array.isArray(value.posts)&&Array.isArray(value.files))setData(withArticles(value))}).catch(()=>{});return()=>controller.abort()},[]);useEffect(()=>{if(path==='/post'){const p=data.posts.find((x:any)=>x.id===new URLSearchParams(location.search).get('id')) as any;document.title=p?p.title+' | Мастерская педагога':'Публикация | Мастерская педагога'}else document.title=projects[path]?.metadata.title||data.profile.name+' | Мастерская педагога'},[data]);const project=projects[path];const Page=project?.Page;return <>{Page?<Page/>:path==='/post'?<PublicPost data={data}/>:<Home posts={data.posts as any} profile={data.profile} isEditor={false}/>}<ThemeToggle/></>}
createRoot(document.getElementById('root')!).render(<App/>);
