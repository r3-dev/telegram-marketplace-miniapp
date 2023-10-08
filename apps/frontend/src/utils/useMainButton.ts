import { MainButton } from "@tma.js/sdk";
import { useSDK } from "@tma.js/sdk-solid";
import { onCleanup, onMount } from "solid-js";

export function useMainButton(handler: (mb: MainButton) => void) {
    const { mainButton } = useSDK();
    const mb = mainButton();

    const clickHandler = () => {
        handler(mb);
    }

    onMount(() => {
        mb.on('click', clickHandler);
        if (!mb.isVisible) mb.show()
        if (!mb.isEnabled) mb.enable()

        onCleanup(() => {
            mb.disable().hide().off('click', clickHandler);
        });
    });

    return mb
}