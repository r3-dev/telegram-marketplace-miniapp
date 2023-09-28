import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { pb } from "../../services/pocketbase-service";
import type {
  StoresRecord,
  StoresResponse,
  UsersResponse,
} from "../../../pocketbase/pb-types";

export function CreateStorePage() {
  const [titleInput, setTitleInput] = createSignal("");

  async function submitHandler(event: Event) {
    console.log("submitHandler");

    event.preventDefault();

    const enteredTitle = titleInput();

    const data: StoresRecord = {
      name: enteredTitle,
      user: (pb.authStore.model as UsersResponse).id,
    };

    await pb.collection("stores").create<StoresResponse>(data);
  }

  const titleChangeHandler = (event: Event) => {
    setTitleInput((event.target as HTMLInputElement).value);
  };

  return (
    <>
      <h1>Новый Магазин</h1>
      <A href="/">Go back</A>
      <form class="flex flex-col gap-4" onSubmit={submitHandler}>
        <input
          class="bg-transparent"
          type="text"
          value={titleInput()}
          onChange={titleChangeHandler}
          placeholder="Название магазина"
        />
        <input type="text" placeholder="Описание магазина" />
        <input type="file" placeholder="Логотип" />
        <button type="submit">Create store</button>
      </form>
    </>
  );
}
