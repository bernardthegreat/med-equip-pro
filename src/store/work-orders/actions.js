const utils = require("src/util");

export async function getWorkOrders(context, query = {}) {
  const queryStr = await context.dispatch("helpers/queryToStr", query, {
    root: true,
  });
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/work-orders${queryStr}`,
      method: "get",
      detailed: true,
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
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

          context.commit("setWorkOrders", {
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

export async function getWorkOrderDetails(context, query = {}) {
  const queryStr = await context.dispatch("helpers/queryToStr", query, {
    root: true,
  });
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/work-orders/details/${query.workOrderCode}/${query.equipmentCode}${queryStr}`,
      method: "get",
      detailed: true,
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      handler: async (data) => {
        // Response data can be modified here before setting it to the store
      },
    },
    { root: true }
  );
}

export async function getEquipmentHistory(context, query = {}) {
  const queryStr = await context.dispatch("helpers/queryToStr", query, {
    root: true,
  });
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/work-orders/equipment${queryStr}`,
      method: "get",
      detailed: true,
      headers: {
        Authorization: `bearer ${context.rootState.users.userLoginInfo.userToken}`,
      },
      handler: async (data) => {
        // Response data can be modified here before setting it to the store
      },
    },
    { root: true }
  );
}

export async function postWorkOrder(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/work-orders`,
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

export async function putWorkOrder(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/work-orders/${payload.workOrderCode}`,
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
