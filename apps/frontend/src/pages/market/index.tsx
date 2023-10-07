import { Image, TextField } from "@kobalte/core"
import { usePocketBase } from "@/contexts/pocketbase";
import { For, createResource, createSignal, onCleanup, onMount } from "solid-js";
import { Collections, ProductsResponse } from "@/types/pb-types";
import { HiSolidMagnifyingGlass } from "solid-icons/hi";
import { createAggListResult } from "@/utils/createAggListResult";
import { useDebounce } from "@/utils/useDebounce";
import "@/styles/text-field.css"
import "@/styles/image.css"
import './index.css'

export function MarketPage() {

  let intersectionObserver: IntersectionObserver | undefined
  let observer: HTMLDivElement | undefined;

  const pb = usePocketBase()

  const fetchMarket = async (props: { name: string, page: number }) => {
    const options = props.name ? { filter: `name~"${props.name}"` } : undefined
    return pb.collection(Collections.Products).getList<ProductsResponse>(props.page, 8, options)
  }

  const [name, setName] = createSignal('')
  const [fetchName, setFetchName] = createSignal('')
  const [page, setPage] = createSignal(1)
  const [products] = createResource(() => ({ name: fetchName(), page: page() }), fetchMarket)
  const aggregatedProducts = createAggListResult(products)

  const onSearch = (e: string) => {
    setPage(1)
    setFetchName(e)
  }

  const debounced = useDebounce(onSearch, 300)


  onMount(() => {
    if (!observer) return
    intersectionObserver = new IntersectionObserver(function (entries) {
      if (entries[0].intersectionRatio <= 0 || aggregatedProducts().page >= aggregatedProducts().totalPages) return;
      setPage(page() + 1)
    });
    intersectionObserver.observe(observer);
  })


  onCleanup(() => {
    if (intersectionObserver)
      intersectionObserver.disconnect()
    debounced.clear()
  })

  const onChange = (e: string) => {
    setName(e)
    debounced(e)
  }

  return (
    <>
      <div class="flex justify-center items-center relative">
        <HiSolidMagnifyingGlass class="absolute left-3" color="var(--tg-theme-hint-color)" />
        <TextField.Root class="text-field w-screen" value={name()} onChange={onChange}>
          <TextField.Input class="text-field__input padded_left" placeholder="Поиск"></TextField.Input>
        </TextField.Root>
      </div>

      <div class="flex flex-wrap justify-center gap-3 mt-5 relative">
        <For each={aggregatedProducts().items} fallback={<p>Loading...</p>}>{(product, i) => <div class="w-[9rem]">
          <Image.Root class="image rounded">
            <Image.Img
              class="image__img"
              src={pb.files.getUrl(product, product.images[0], { 'thumb': '0x128', })} />
            <Image.Fallback class="image__fallback">
              {product.name.charAt(0).toUpperCase()}
            </Image.Fallback>
          </Image.Root>
          <div>${product.price}</div>
          <div>{product.name}</div>
        </div>}
        </For>
        <div ref={observer} class="observer"></div>
      </div>
    </>
  )
}
