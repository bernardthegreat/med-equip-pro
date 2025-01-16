const utils = require("src/util");

export async function getEquipments(context, query = {}) {
  const queryStr = await context.dispatch("helpers/queryToStr", query, {
    root: true,
  });
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/equipments${queryStr}`,
      method: "get",
      detailed: true,
      headers: {},
      handler: async (data) => {
        if (data.length > 0) {
          const optionData = utils.buildOptionsArray(data, "name", "code");
          const hashMap = utils.buildHashTable(data, "code");
          context.commit("setEquipments", {
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

export async function getEquipmentsDetails(context, query = {}) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/equipments/details/${query.id}`,
      method: "get",
      detailed: true,
      headers: {},
      handler: async (data) => {
        if (data.length > 0) {
          utils.buildOptionsArray(data, "code", "code");
          for (const list of data) {
            list.taskStatus = "";
            list.taskRemarks = "";
          }
        }
        // Response data can be modified here before setting it to the store
      },
    },
    { root: true }
  );
}

export async function postEquipment(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/equipments`,
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

export async function putEquipment(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/equipments/${payload.id}`,
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

export async function putEquipmentDetails(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/equipments/details/${payload.id}`,
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

export async function repairEquipment(context, payload) {
  return await context.dispatch(
    "helpers/request",
    {
      url: `${context.rootState.helpers.apiHost}/work-orders/repair`,
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
