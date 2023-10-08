import { useSDK } from "@tma.js/sdk-solid";
import { onCleanup, onMount } from "solid-js";

export function useBackButton(handler: () => void) {
    const { backButton } = useSDK();
    const bb = backButton();

    const clickHandler = () => {
        handler();
        bb.hide()
    }

    onMount(() => {
        bb.on('click', clickHandler);
        if (!bb.isVisible) bb.show()

        onCleanup(() => {
            bb.off('click', clickHandler);
            console.log("cleanup")
        });
    });

    return bb
}