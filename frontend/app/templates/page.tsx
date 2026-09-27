'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { TemplateCard } from '../../components/TemplateCard';

export default function TemplatesPage() { const [templates,setTemplates]=useState<any[]>([]); const [error,setError]=useState(''); useEffect(()=>{api('/templates').then(setTemplates).catch(e=>setError(e.message))},[]); return <main className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Curated library</div><h2>Choose a starting template</h2><p className="muted">Each template is editable and optimized for 1200×1600 output.</p></div></div>{error&&<div className="error">{error}</div>}{templates.length?<div className="grid">{templates.map(t=><TemplateCard key={t._id} template={t}/>)}</div>:<div className="empty">No templates found. Run the backend seed script first.</div>}</div></main> }
