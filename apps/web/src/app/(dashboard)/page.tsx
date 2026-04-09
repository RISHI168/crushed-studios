// Dashboard page
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { NewProjectModal } from '@/components/dashboard/NewProjectModal'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Projects</h1>
        <NewProjectModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard title="Project 1" status="in-progress" />
        <ProjectCard title="Project 2" status="draft" />
        <ProjectCard title="Project 3" status="completed" />
      </div>
    </div>
  )
}
