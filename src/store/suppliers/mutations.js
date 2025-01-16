export function setSuppliers(state, data) {
  state.suppliers = data.rawData;
  state.suppliersOptions = data.optionData;
  state.suppliersHashMap = data.hashMap;
  state.suppliersActiveOptions = data.activeOptionData;
  state.suppliersActiveHashMap = data.activeHashMap;
}
