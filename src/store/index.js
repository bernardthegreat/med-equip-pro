import { store } from "quasar/wrappers";
import { createStore } from "vuex";

// import example from './module-example'
import helpers from "./helpers";
import config from "./config";
import equipments from "./equipments";
import departments from "./departments";
import suppliers from "./suppliers";
import workOrders from "./work-orders";
import users from "./users";
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      // example
      helpers,
      equipments,
      departments,
      suppliers,
      workOrders,
      users,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
