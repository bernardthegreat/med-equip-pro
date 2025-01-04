import { Dark } from "quasar";
export function setDarkMode(state, data) {
  Dark.set(data);
  state.darkMode = data;
}

export function logoffUser(state, data) {
  state.logoffUser = data;
}

export function setNotification(state, notification) {
  state.notification.displayNotify = notification.displayNotify;
  state.notification.message = notification.message;
  state.notification.type = notification.type;
}

export function setCurrentLocation(state, data) {
  state.currentLocation = data;
}

export function setBreadCrumb(state, data) {
  state.breadCrumb = data;
}

export function setAppLoading(state, data) {
  state.appLoading = data;
}
