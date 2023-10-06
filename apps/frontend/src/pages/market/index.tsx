import { Image, TextField } from "@kobalte/core"
import "@/styles/text-field.css"
import { usePocketBase } from "@/contexts/pocketbase";
import { For, JSX, Suspense, createMemo, createResource, createSignal, onCleanup, onMount } from "solid-js";
import { Collections, ProductsResponse } from "@/types/pb-types";
import { HiSolidMagnifyingGlass } from "solid-icons/hi";
import "@/styles/image.css"
import './index.css'
import { attachDevtoolsOverlay } from '@solid-devtools/overlay'

type Product = {
  name: string;
  cost: number;
  description: string;
}

const fetchTest = async (page: number) => {
  return (await fetch(`https://fakestoreapi.com/products?limit=${6 * page}`)).json()
}

type DebounceCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait?: number,
) => Scheduled<Args>;

interface Scheduled<Args extends unknown[]> {
  (...args: Args): void;
  clear: VoidFunction;
}

const useDebounce: DebounceCallback = (callback, wait = 1000) => {
  let timeoutId: NodeJS.Timeout;
  const clear = () => clearTimeout(timeoutId);
  const debounced: typeof callback = (...args) => {
    console.log('debounce')
    if (timeoutId) clear();
    timeoutId = setTimeout(() => {
      console.log('fire')
      callback(...args)
    }, wait);
  };
  return Object.assign(debounced, { clear });
};

export function MarketPage() {

  let intersectionObserver: IntersectionObserver | undefined
  let observer: HTMLDivElement | undefined;

  attachDevtoolsOverlay()

  const fetchMarket = async (props: { name: string, page: number }) => (
    // await pb.collection('products').getList(props.page, 30, {
    //   filter: `name~${props.name}`,
    // })

    await pb.collection(Collections.Products).getList<ProductsResponse>(props.page, 30)
  )

  const pb = usePocketBase()

  const [name, setName] = createSignal('')
  const [page, setPage] = createSignal(1)
  //const [products] = createResource(() => ({ name: name(), page: page() }), fetchMarket)
  // const [testProducts, setTestProducts] = createSignal<Product[]>()
  const [testStore] = createResource(page, fetchTest)

  const dataMemo = createMemo(() =>
    testStore()
  )

  const onSearch = (e: string) => {
    setName(e)
  }

  const debounced = useDebounce(onSearch, 600)

  onCleanup(() => {
    debounced.clear()
  })

  //FIX: при подгрузке доп товаров скролл остаётся внизу
  onMount(() => {
    if (!observer) return
    intersectionObserver = new IntersectionObserver(function (entries) {
      // Если intersectionRatio равен 0, цель вне зоны видимости
      // и нам не нужно ничего делать
      if (entries[0].intersectionRatio <= 0 || !dataMemo()) return;

      // loadItems(10);
      console.log('+ page')
      setPage(page() + 1)
    });
    // начать наблюдение
    intersectionObserver.observe(observer);
  })

  // console.dir(products)

  onCleanup(() => {
    if (intersectionObserver)
      intersectionObserver.disconnect()
  });

  return (
    <>
      <div class="flex justify-center items-center relative">
        <HiSolidMagnifyingGlass class="absolute left-3" color="var(--tg-theme-hint-color)" />
        <TextField.Root class="text-field w-screen" onChange={debounced}>
          <TextField.Input class="text-field__input padded_left" placeholder="Поиск"></TextField.Input>
        </TextField.Root>
      </div>

      <div class="flex flex-wrap justify-center gap-3 mt-5 relative">
        <For each={dataMemo()} fallback={<p>Loading...</p>}>{(product, i) => <div class="max-w-[9rem]">
          <Image.Root class="image rounded">
            <Image.Img
              class="image__img"
              src={product.image} />
            <Image.Fallback class="image__fallback">
              {product.title.charAt(0).toUpperCase()}
            </Image.Fallback>
          </Image.Root>
          <div>${product.price}</div>
          <div>{product.title}</div>
        </div>}
        </For>
        <div ref={observer} class="observer"></div>
      </div>
    </>
  )
}
