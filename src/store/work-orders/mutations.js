export function setWorkOrders(state, data) {
  state.workOrders = data.rawData;
  state.workOrdersOptions = data.optionData;
  state.workOrdersHashMap = data.hashMap;
  state.workOrdersActiveOptions = data.activeOptionData;
  state.workOrdersActiveHashMap = data.activeHashMap;
}
