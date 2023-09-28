import { SDKProvider } from "@twa.js/sdk-solid";
import { DisplayGate } from "../../components/twa-display-gate";
import type { Component, ParentProps } from "solid-js";

export const TwaSolidLayout: Component<ParentProps> = ({ children }) => {
  return (
    <SDKProvider initOptions={{timeout: 3000, debug: true}}> 
      <DisplayGate>
        {children}
      </DisplayGate>
    </SDKProvider>
  );
};
