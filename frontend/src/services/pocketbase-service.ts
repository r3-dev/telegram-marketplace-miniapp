import WebApp from "@twa-dev/sdk";
import PocketBase from "pocketbase";

export const pb = new PocketBase("http://127.0.0.1:3000");

// Auth with telegram init data
pb.beforeSend = function (url, options) {
  // For list of the possible request options properties check
  // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
  options.headers = Object.assign({}, options.headers, {
    "X-Init-Data": WebApp.initData,
  });

  return { url, options };
};
