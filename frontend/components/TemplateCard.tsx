import Link from 'next/link';

export function TemplateCard({ template }: { template: any }) {
  const theme = template.occasionType.includes('শোক') ? 'gray' : template.occasionType.includes('নির্বাচনী') ? 'gold' : 'green';
  return <article className="card">
    <div className={`template-preview ${theme}`}><div className="stripe"/><div className="t-title">{template.occasionType}<br/><small>{template.title}</small></div></div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}><div><strong>{template.title}</strong><div className="muted" style={{fontSize:13,marginTop:4}}>{template.layoutConfig.photoSlots?.length || 0} photo slots</div></div><Link href={`/create?template=${template._id}`} className="btn btn-primary">Use</Link></div>
  </article>;
}
