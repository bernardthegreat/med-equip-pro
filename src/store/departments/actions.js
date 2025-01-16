const utils = require("src/util");

export async function getDepartments(context, query = {}) {
  const queryStr = await context.dispatch("helpers/queryToStr", query, {
    root: true,
  });
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/departments${queryStr}`,
      method: "get",
      detailed: true,
      headers: {},
      handler: async (data) => {
        if (data.length > 0) {
          const optionData = utils.buildOptionsArray(data, "name", "code");
          const hashMap = utils.buildHashTable(data, "code");
          const filterActive = data.filter(
            (filterActive) => filterActive.active
          );
          const activeHashMap = utils.buildHashTable(filterActive, "code");
          const activeOptionData = utils.buildOptionsArray(
            filterActive,
            "name",
            "code"
          );
          context.commit("setDepartments", {
            rawData: data,
            optionData: optionData,
            hashMap: hashMap,
            activeOptionData: activeOptionData,
            activeHashMap: activeHashMap,
          });
        }
        // Response data can be modified here before setting it to the store
      },
    },
    { root: true }
  );
}

export async function postDepartment(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/departments`,
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

export async function putDepartment(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/departments/${payload.id}`,
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
