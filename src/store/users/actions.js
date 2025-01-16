const utils = require("src/util");

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
      headers: {},
      handler: async (data) => {
        console.log(data, "data");
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
        // Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
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
        // Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
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
        // Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
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
        // Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      detailed: true,
      data: payload,
      handler: async (data) => {},
    },
    { root: true }
  );
}
