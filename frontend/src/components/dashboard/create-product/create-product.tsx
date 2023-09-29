import { useSDK } from '@twa.js/sdk-solid'
import { usePocketBase } from '../../../contexts/pocketbase'
import { createEffect } from 'solid-js'
import { MainButton } from '@twa.js/sdk'
import { useNavigate } from '@solidjs/router'
import './create-product.css'

export function CreateProductPage() {
  const sdk = useSDK()
  const pb = usePocketBase()
  const navigate = useNavigate()

  createEffect(() => {
    const mainButton = new MainButton(
      sdk.themeParams().buttonColor!,
      true,
      true,
      false,
      "Add product",
      sdk.themeParams().buttonTextColor!
    )

    function goToProductsList() {
      navigate("/products-list")
      mainButton.off("click", goToProductsList)
      mainButton.hide()
    }

    mainButton.on("click", goToProductsList)
    mainButton.show()
  })

  return (
    <div>

    </div>
  )
}
