import Vue from "vue";
import Vuex from "vuex";

import forum from "./modules/forum"
import user from "./modules/user"
import global from "./modules/global"

Vue.use(Vuex);

export default new Vuex.Store({
  
  modules: {
    forum,
    user,
    global
  }
});
