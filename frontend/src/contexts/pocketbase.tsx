import PocketBase from "pocketbase";
import { useSDK } from "@twa.js/sdk-solid";
import {
  createContext,
  createEffect,
  useContext,
  type ParentComponent,
} from "solid-js";

const PocketBaseContext = createContext<PocketBase>(undefined, {
  name: "PocketBaseContext",
});

export function usePocketBase() {
  const context = useContext(PocketBaseContext);

  if (context === undefined) {
    throw new Error(
      `${usePocketBase.name} hook was used outside of ${PocketbaseProvider.name}.`
    );
  }

  return context;
}

export const PocketbaseProvider: ParentComponent = (props) => {
  const { initDataRaw } = useSDK();

  const pb = new PocketBase("http://127.0.0.1:3000");

  pb.beforeSend = function (url, options) {
    options.headers = Object.assign({}, options.headers, {
      "X-Init-Data": initDataRaw(),
    });

    return { url, options };
  };

  createEffect(async () => {
    await pb
      .collection("users")
      .authWithPassword("USERNAMELESS", "PASSWORDLESS", {
        headers: {
          "X-Init-Data": initDataRaw(),
        },
      });
  });

  return (
    <PocketBaseContext.Provider value={pb}>
      {props.children}
    </PocketBaseContext.Provider>
  );
};