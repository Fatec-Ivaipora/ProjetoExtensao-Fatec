import './PageHeader.css'

type PageHeaderProps = {
  eyebrow: string
  title: string
  description?: string
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p className="page-header-desc">{description}</p>}
      </div>
    </div>
  )
}
