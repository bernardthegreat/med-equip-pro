export function setUsers(state, data) {
  state.users = data.rawData;
  state.usersOptions = data.optionData;
  state.usersHashMap = data.hashMap;
}

export function setUserLoginInfo(state, data) {
  state.userLoginInfo = data;
}
