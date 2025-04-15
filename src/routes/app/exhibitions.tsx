import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/exhibitions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/exhibitions"!</div>
}
