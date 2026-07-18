import React from 'react'
import ReactDOM from 'react-dom/client'
import { startInstance } from './start'
import { createRouter, RootRoute, Route } from '@tanstack/react-router'
import RootComponent from './routes/__root'
import IndexComponent from './routes/index'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootRoute = new RootRoute({
  component: RootComponent,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
})

const router = startInstance.createRouter({
  routeTree: rootRoute.addChildren([indexRoute]),
})

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      {router.dehydrate()}
    </React.StrictMode>,
  )
}
