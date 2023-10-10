import { useParams } from '@solidjs/router'
import { createEffect } from 'solid-js'

import { DashboardStoreLayout } from '@/components/dashboard-store-layout'

export function StoreProductsPage() {
  const params = useParams()

  createEffect(() => {
    //fetch store and products
  })

  return (
    <>
      <DashboardStoreLayout>
        <h1>Store Products</h1>
      </DashboardStoreLayout>
    </>
  )
}
