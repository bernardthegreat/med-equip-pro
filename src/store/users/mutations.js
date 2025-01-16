export function setUsers(state, data) {
  state.users = data.rawData;
  state.usersOptions = data.optionData;
  state.usersHashMap = data.hashMap;
}
