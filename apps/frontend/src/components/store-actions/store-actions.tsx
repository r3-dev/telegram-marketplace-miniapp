import { Button } from '@kobalte/core'

import '@/styles/button.css'

export function StoreActions() {
  return (
    <div class="flex flex-col gap-4">
      <Button.Root class="button">Редактировать</Button.Root>
      <Button.Root class="button">Изменить каталог</Button.Root>
      <Button.Root class="button">Статистика продаж ??????</Button.Root>
      <Button.Root class="button">Удалить</Button.Root>
    </div>
  )
}
