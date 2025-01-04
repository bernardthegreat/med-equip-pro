export function setProcessors(state, data) {
  state.processors = data.rawData;
  state.processorsOptions = data.optionData;
  state.processorsHashMap = data.hashMap;
}

export function setBillers(state, data) {
  state.billers = data.rawData;
  state.billersOptions = data.optionData;
  state.billersHashMap = data.hashMap;
  state.billersTree = data.tree;
}

export function setApplications(state, data) {
  state.applications = data.rawData;
  state.applicationsOptions = data.optionData;
  state.applicationsHashMap = data.hashMap;
}
