export function setEquipments(state, data) {
  state.equipments = data.rawData;
  state.equipmentsOptions = data.optionData;
  state.equipmentsHashMap = data.hashMap;
}
