const state = {
  jwt: null,
  user: null
};

const getters = {
  getUserFirstname() {
    return state.user.firstname;
  },
  getUserLastname() {
    return state.user.lastname;
  },
  getUserId() {
    return state.user.id;
  },
  getUsername() {
    return state.user.username;
  },
  getUserJWT() {
    return state.jwt;
  },
  getUserAvatar() {
    return state.user.avatar;
  },
  getUserRole() {
    return state.user.role;
  },
  getAuthentificationState() {
    return state.jwt;
  }
};

const mutations = {
  unsetUser(state) {
    state.jwt = null;
    state.user = null;
  },
  setUser(state, userData) {
    state.jwt = userData.jwt;
    state.user = userData.user;
  }
};

const actions = {
  login({ commit }, auth) {
    return fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: auth.username,
        pwd: auth.pwd
      })
    })
      .then((response) => {
        console.log("response:" + response.statusText);
        if (response.status != 200) {
          const error = new Error(response.statusText);
          error.statusCode = response.status;
          throw error;
        } else {
          return response.json();
        }
      })
      .then((resbody) => {
        commit("setUser", resbody);
        commit("setAlert", { msg: "Login successful", color: "success" });
      })
      .catch((err) => {
        commit("setAlert", { msg: err.message, color: "warning" });
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
