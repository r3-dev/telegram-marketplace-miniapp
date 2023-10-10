import { Image, TextField } from '@kobalte/core'
import { useNavigate } from '@solidjs/router'
import { useSDK } from '@tma.js/sdk-solid'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import type {
  StoresRecord,
  StoresResponse,
  UsersResponse
} from '@/types/pb-types'

import { usePocketBase } from '@/contexts/pocketbase'
import { Collections } from '@/types/pb-types'

import '@/styles/text-field.css'
import '@/styles/image.css'
import './create-store.css'

export function CreateStore() {
  const [storeName, setStoreName] = createSignal('')
  const [storeDescription, setStoreDescription] = createSignal('')
  const [storeAvatar, setStoreAvatar] = createSignal('')

  const { mainButton, backButton } = useSDK()
  const pb = usePocketBase()
  const navigate = useNavigate()

  async function goToNext() {
    mainButton().showProgress().disable()

    try {
      if (storeName().length === 0) throw new Error('Store name is required')

      const data: StoresRecord = {
        name: storeName(),
        user: (pb.authStore.model as UsersResponse).id,
        description: storeDescription()
      }

      const response = await pb
        .collection(Collections.Stores)
        .create<StoresResponse>(data)
        .catch((err) => {
          throw err
        })

      navigate(`/dashboard/store/${response.id}/create-product`)
    } catch (error) {
      console.error(error)
    } finally {
      mainButton().hideProgress().enable()
    }
  }

  function onBack() {
    navigate('/dashboard')
  }

  onMount(() => {
    mainButton().setText('Next')

    mainButton().on('click', goToNext)
    backButton().on('click', onBack)

    if (!backButton().isVisible) backButton().show()

    if (!mainButton().isEnabled) mainButton().enable()
    if (!mainButton().isProgressVisible) mainButton().hideProgress()
  })

  createEffect(() => {
    if (storeName().length === 0) {
      mainButton().hide().disable()
    } else {
      mainButton().show().enable()
    }
  })

  onCleanup(() => {
    mainButton().off('click', goToNext)
    backButton().off('click', onBack)
  })

  function onImageClick() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.jpg, .jpeg, .png, .webp'
    fileInput.click()

    fileInput.addEventListener('change', () => {
      const file = fileInput.files![0]
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        setStoreAvatar(reader.result as string)
        console.log(reader.result)
      }
      reader.onerror = () => console.log(reader.error)
    })
  }

  return (
    <>
      <div class="flex justify-center">
        <Image.Root
          onClick={onImageClick}
          class="image"
        >
          <Image.Img
            class="image__img"
            src={storeAvatar()}
          />
          <Image.Root class="image">
            <Image.Fallback class="image__fallback">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 0 24 24"
                width="32px"
              >
                <path
                  d="M0 0h24v24H0z"
                  fill="none"
                />
                <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z" />
              </svg>
            </Image.Fallback>
          </Image.Root>
        </Image.Root>
      </div>
      <div class="create-store__form">
        <TextField.Root
          required
          class="text-field"
          value={storeName()}
          onChange={setStoreName}
        >
          <TextField.Label class="text-field__label">Name</TextField.Label>
          <TextField.Input
            class="text-field__input"
            autocomplete="off"
          />
        </TextField.Root>

        <TextField.Root
          required
          class="text-field"
          value={storeDescription()}
          onChange={setStoreDescription}
        >
          <TextField.Label class="text-field__label">
            Description
          </TextField.Label>
          <TextField.TextArea
            autoResize
            class="text-field__input"
          />
        </TextField.Root>
      </div>
    </>
  )
}
