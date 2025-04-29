import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/certificates')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/certificates"!</div>
}
