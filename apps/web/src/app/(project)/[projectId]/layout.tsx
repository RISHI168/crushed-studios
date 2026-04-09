// Project layout with tabs and navigation
import Link from 'next/link'

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  const tabs = [
    { name: 'Screenplay', href: 'screenplay' },
    { name: 'Console', href: 'console' },
    { name: 'Characters', href: 'characters' },
    { name: 'Continuity', href: 'continuity' },
    { name: 'Review', href: 'review' },
    { name: 'Timeline', href: 'timeline' },
  ]

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-700">
        <div className="flex gap-6 px-6">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={`/project/${params.projectId}/${tab.href}`}
              className="px-4 py-3 border-b-2 border-transparent hover:border-blue-500 transition"
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-6">
        {children}
      </div>
    </div>
  )
}
