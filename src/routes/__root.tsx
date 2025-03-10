import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />

      <Outlet />
      <TanStackRouterDevtools />

      <TanstackQueryLayout />
    </>
  ),
})
