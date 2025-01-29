const utils = require("src/util");
import decodeJWT from "jwt-decode";
import { Cookies } from "quasar";

export async function getUsers(context, query = {}) {
  const queryStr = await context.dispatch("helpers/queryToStr", query, {
    root: true,
  });
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/users${queryStr}`,
      method: "get",
      detailed: true,
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      handler: async (data) => {
        if (data.length > 0) {
          const optionData = utils.buildOptionsArray(data, "name", "username");
          const hashMap = utils.buildHashTable(data, "username");
          context.commit("setUsers", {
            rawData: data,
            optionData: optionData,
            hashMap: hashMap,
          });
        }
        // Response data can be modified here before setting it to the store
      },
    },
    { root: true }
  );
}

export async function postUser(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/users`,
      method: "post",
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      detailed: true,
      data: payload,
      handler: async (data) => {},
    },
    { root: true }
  );
}

export async function putUser(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/users/${payload.id}`,
      method: "put",
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      detailed: true,
      data: payload,
      handler: async (data) => {},
    },
    { root: true }
  );
}

export async function resetPasswordUser(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/users/reset-password/${payload.id}`,
      method: "put",
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      detailed: true,
      data: payload,
      handler: async (data) => {},
    },
    { root: true }
  );
}

export async function suspendUser(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/users/suspend/${payload.id}`,
      method: "put",
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      detailed: true,
      data: payload,
      handler: async (data) => {},
    },
    { root: true }
  );
}

export async function authenticate(context, payload) {
  context.commit("helpers/logoffUser", false, { root: true });
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/auth/login`,
      method: "post",
      detailed: true,
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      data: payload,
      handler: (data) => {
        const decodedJWT = decodeJWT(data.userToken);

        decodedJWT.userToken = data;
        Cookies.set("user-access-token", data.userToken);
        context.commit("setUserLoginInfo", decodedJWT);
      },
    },
    { root: true }
  );
}

export async function inauthenticate(context, payload) {
  let status = await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/auth/logout`,
      method: "post",
      detailed: true,
      data: payload,
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      handler: (data) => {},
    },
    { root: true }
  );
  if (status.success) {
    Cookies.remove("user-access-token");
    context.commit("helpers/logoffUser", false, { root: true });
    context.commit("setUserLoginInfo", {});
  }

  return status;
}

export async function setUserCookies(context) {
  const cookieValue = Cookies.get("user-access-token");
  const decodedJWT = decodeJWT(cookieValue);
  decodedJWT.userToken = cookieValue;
  context.commit("setUserLoginInfo", decodedJWT);
}
