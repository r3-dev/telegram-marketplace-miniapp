import { Image, TextField } from '@kobalte/core'
import { HiSolidMagnifyingGlass } from 'solid-icons/hi'
import { createResource, createSignal, For, onCleanup, onMount } from 'solid-js'

import { usePocketBase } from '@/contexts/pocketbase'
import { Collections, ProductsResponse } from '@/types/pb-types'
import { createAggListResult } from '@/utils/createAggListResult'
import { useDebounce } from '@/utils/useDebounce'

import '@/styles/text-field.css'
import '@/styles/image.css'

import { useNavigate } from '@solidjs/router'

import { useMainButton } from '@/utils/useMainButton'
import indexStyles from './index.module.css'

export function MarketPage() {
  let intersectionObserver: IntersectionObserver | undefined
  let observer: HTMLDivElement | undefined

  const pb = usePocketBase()

  const fetchMarket = async (props: { name: string; page: number }) => {
    const options = props.name ? { filter: `name~"${props.name}"` } : undefined
    return pb
      .collection(Collections.Products)
      .getList<ProductsResponse>(props.page, 8, options)
  }

  const [name, setName] = createSignal('')
  const [fetchName, setFetchName] = createSignal('')
  const [page, setPage] = createSignal(1)
  const [products] = createResource(
    () => ({ name: fetchName(), page: page() }),
    fetchMarket
  )
  const aggregatedProducts = createAggListResult(products)
  const navigate = useNavigate()
  const mb = useMainButton(() => navigate('/market/cart'))
  mb.setText('🛒 Cart')

  const onSearch = (e: string) => {
    setPage(1)
    setFetchName(e)
  }

  const debounced = useDebounce(onSearch, 300)

  onMount(() => {
    if (!observer) return
    intersectionObserver = new IntersectionObserver(function (entries) {
      if (
        entries[0].intersectionRatio <= 0 ||
        aggregatedProducts().page >= aggregatedProducts().totalPages
      )
        return
      setPage(page() + 1)
    })
    intersectionObserver.observe(observer)
  })

  onCleanup(() => {
    if (intersectionObserver) intersectionObserver.disconnect()
    debounced.clear()
  })

  const onChange = (e: string) => {
    setName(e)
    debounced(e)
  }

  function handleProductClick(product: ProductsResponse) {
    navigate(`/market/product/${product.id}`)
  }

  return (
    <>
      <div class="flex justify-center items-center relative">
        <HiSolidMagnifyingGlass
          class="absolute left-3"
          color="var(--tg-theme-hint-color)"
        />
        <TextField.Root
          class="text-field w-screen"
          value={name()}
          onChange={onChange}
        >
          <TextField.Input
            class="text-field__input padded_left"
            placeholder="Search"
          ></TextField.Input>
        </TextField.Root>
      </div>

      <div class="flex flex-wrap justify-center mt-5 relative">
        <For
          each={aggregatedProducts().items}
          fallback={<p>Loading...</p>}
        >
          {(product) => (
            <div
              class={`${indexStyles.product} w-[9rem] cursor-pointer p-4`}
              onClick={() => handleProductClick(product)}
            >
              <Image.Root class={indexStyles.image}>
                <Image.Img
                  class="image__img"
                  src={pb.files.getUrl(product, product.images[0], {
                    thumb: '0x128'
                  })}
                />
                <Image.Fallback class="image__fallback">
                  {product.name.charAt(0).toUpperCase()}
                </Image.Fallback>
              </Image.Root>
              <div>${product.price}</div>
              <div>{product.name}</div>
            </div>
          )}
        </For>
        <div
          ref={observer}
          class={indexStyles.observer}
        ></div>
      </div>
    </>
  )
}
