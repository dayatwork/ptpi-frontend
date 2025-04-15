import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/seminars')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/seminars"!</div>
}
