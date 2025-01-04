import axios from "axios";
import { Cookies } from "quasar";
import { LocalStorage } from "quasar";

export function setDarkMode(context, status) {
  context.commit("setDarkMode", Boolean(status));
  Cookies.set("darkMode", Boolean(status));
}

export function isEmpty(context, arg) {
  if (
    arg === null ||
    arg === undefined ||
    arg === "" ||
    (Array.isArray(arg) && arg.length === 0) ||
    (typeof arg === "object" && Object.keys(arg).length === 0)
  )
    return true;

  return false;
}

// Simple Query String builder
export function queryToStr(context, query) {
  return `?${Object.entries(query)
    .map((entry) => `${entry[0]}=${entry[1]}`)
    .join("&")}`;
}

export async function request(context, arg) {
  const { url, method, headers = {}, data, handler, detailed } = arg;

  const config = {
    timeout: process.env.HTTP_REQ_TIMEOUT,
  };

  if (process.env.NGROKTESTING) {
    headers["ngrok-skip-browser-warning"] = true;
  }

  if (headers) config["headers"] = headers;
  const args = [config];

  if (!["get", "delete"].includes(method)) args.unshift(data);

  // `process.env` vars which evaluate to `true` are tree-shaked during build/compilation
  if (process.env.DEV) console.log(`[${method.toUpperCase()}] ${url} :`, data);

  try {
    const response = await axios[method](url, ...args);

    // HTTP payload is automatically parsed by axios into JS object
    // HTTP Status Code 400 and up are error codes
    if (response.status >= 400)
      throw `HTTP Error code received: ${response.status}`;

    if (process.env.DEV) console.log("Response data: ", response.data);

    if (handler.constructor.name === "AsyncFunction") {
      await handler(response.data);
    } else {
      handler(response.data);
    }
    if (detailed) {
      return response.data;
    }
  } catch (err) {
    if (process.env.DEV) console.log(err);
    if (detailed) {
      console.log(err.response);
      if (err.response !== undefined) {
        if (err.response.data.tokenError !== undefined) {
          context.dispatch("logoffUser", true);
          return false;
        }
        let notifPayload = {
          displayNotify: true,
          message: err.response.data.error,
          type: "negative",
        };

        context.commit("setNotification", notifPayload);
        setTimeout(async () => {
          const notifInitPayload = {
            displayNotify: false,
            message: "",
            type: "",
          };
          context.commit("setNotification", notifInitPayload);
        }, 1500);
        return false;
      }
      let notifPayload = {
        displayNotify: true,
        message: `${err}`,
        type: "negative",
      };

      context.commit("setNotification", notifPayload);
      setTimeout(async () => {
        const notifInitPayload = {
          displayNotify: false,
          message: "",
          type: "",
        };
        context.commit("setNotification", notifInitPayload);
      }, 1500);
      return false;
    }
    return false;
  }

  return true;
}

export async function logoffUser(context, payload) {
  if (payload) {
    Cookies.remove("admission-admin-access-token");
  }

  context.commit("logoffUser", payload);
}

export async function setNotification(context, payload) {
  context.commit("setNotification", payload);
}

export async function setCurrentLocation(context, payload) {
  context.commit("setCurrentLocation", payload);
}

export async function initStores(context) {
  if (Cookies.has("darkMode")) {
    context.commit(
      "setDarkMode",
      Cookies.get("darkMode") === "true" ? true : false
    );
  } else {
    Cookies.set("darkMode", false);
    context.commit("setDarkMode", false);
  }
}

export async function setBreadCrumb(context, payload) {
  context.commit("setBreadCrumb", payload);
}

export async function sendDynamicEmail(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/send-dynamic-email`.replace(
        "admission",
        "email"
      ),
      method: "post",
      detailed: true,
      data: payload,
      handler: (data) => {},
    },
    { root: true }
  );
}

export async function sendDynamicSMS(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/send-dynamic-sms.replace(
        "admission",
        "email"
      )`,
      method: "post",
      detailed: true,
      data: payload,
      handler: (data) => {},
    },
    { root: true }
  );
}

export async function setAppLoading(context, payload) {
  context.commit("setAppLoading", payload);
}
