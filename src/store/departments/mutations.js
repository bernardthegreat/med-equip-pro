export function setDepartments(state, data) {
  state.departments = data.rawData;
  state.departmentsOptions = data.optionData;
  state.departmentsHashMap = data.hashMap;
  state.departmentsActiveOptions = data.activeOptionData;
  state.departmentsActiveHashMap = data.activeHashMap;
}
