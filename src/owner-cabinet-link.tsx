import {useEffect,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {BACKEND} from './config';
export default function OwnerCabinetLink(){const [owner,setOwner]=useState(false);useEffect(()=>{const abort=new AbortController();fetch(BACKEND+'/api/editor-status',{credentials:'include',cache:'no-store',signal:abort.signal}).then(r=>r.ok?r.json():null).then(v=>setOwner(v?.isEditor===true)).catch(()=>setOwner(false));return()=>abort.abort()},[]);return owner?<a className="cabinet-link" href={BACKEND+'/cabinet'}>Кабинет <ArrowUpRight size={16}/></a>:null}
