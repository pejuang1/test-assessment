'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/composition/store/hooks'
import {
  setDevices,
  setCatalogLoading,
  setCatalogError,
  selectCatalogLoading,
  selectCatalogError,
} from '@/composition/store/slices/device-catalog-slice'
import {
  setCategory,
  setSearch,
  setSortBy,
  selectCategory,
  selectSearch,
  selectSortBy,
  selectFilteredDevices,
} from '@/composition/store/slices/device-filter-slice'
import { setUser, selectUser, selectWalletBalance } from '@/composition/store/slices/user-slice'
import { getUserController } from '@/features/user-profile/controllers/user-controller'
import { getDevicesController } from '@/features/product-catalog/controllers/device-controller'

import { SiteHeader } from '../components/site-header'
import { SiteFooter } from '../components/site-footer'
import { WelcomePanel } from '@/features/user-profile/presentation/components/welcome-panel'
import { FilterToolbar } from '../components/filter-toolbar'
import { DeviceCard } from '../components/device-card'
import { BenefitsSection } from '../components/benefits-section'

export function DiscoverPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const walletBalance = useAppSelector(selectWalletBalance)
  const loading = useAppSelector(selectCatalogLoading)
  const error = useAppSelector(selectCatalogError)
  const category = useAppSelector(selectCategory)
  const search = useAppSelector(selectSearch)
  const sortBy = useAppSelector(selectSortBy)
  const list = useAppSelector(selectFilteredDevices)

  useEffect(() => {
    let alive = true

    async function loadData() {
      try {
        const [u, p] = await Promise.all([
          getUserController(),
          getDevicesController(),
        ])
        if (alive) {
          dispatch(setUser(u))
          dispatch(setDevices(p))
        }
      } catch {
        if (alive) {
          dispatch(setCatalogError('Something went wrong. Please refresh to try again.'))
        }
      } finally {
        if (alive) {
          dispatch(setCatalogLoading(false))
        }
      }
    }

    loadData()

    return () => {
      alive = false
    }
  }, [dispatch])

  return (
    <>
      <SiteHeader />
      <main>
        <WelcomePanel user={user} walletBalance={walletBalance} />

        <section className="collection-heading" id="devices">
          <div className="eyebrow">THE COLLECTION</div>
          <h2>Your next everyday essential.</h2>
          <p>Big ideas. Beautiful screens. Meet your next upgrade.</p>
        </section>

        <FilterToolbar
          currentCategory={category}
          searchQuery={search}
          sortBy={sortBy}
          onCategoryChange={c => dispatch(setCategory(c))}
          onSearchChange={q => dispatch(setSearch(q))}
          onSortChange={s => dispatch(setSortBy(s))}
        />

        {error ? (
          <p role="alert">{error}</p>
        ) : loading ? (
          <div className="loading">
            Getting your next favorites ready<span>…</span>
          </div>
        ) : (
          <>
            <div className="result-count">
              {list.length} devices, endless possibilities
            </div>
            <section className="product-grid" aria-label="Product list">
              {list.map(device => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </section>
            {!list.length && (
              <div className="loading">No devices found. Try another search.</div>
            )}
          </>
        )}

        <BenefitsSection />
      </main>
      <SiteFooter variant="dashboard" />
    </>
  )
}
