const state = {
  postings: null,
};

const getters = {
  getPosterFirstname: state => index => {
    return state.postings[index].firstname;
  },
  getPosterLastname: state => index => {
    return state.postings[index].lastname;
  },
  getPosterAvatar: state => index => {
    return state.postings[index].avatar;
  },
  getPostingTimestamp: state => index => {
    return state.postings[index].posting_timestamp;
  },
  getPostingContent: state => index => {
    return state.postings[index].content;
  },
  getPostingId: state => index => {
    return state.postings[index].id;
  },
  getPostingLevel: state => index => {
    return state.postings[index].level;
  },
  getAllPostings() {
    return state.postings;
  }
};

const mutations = {
  setPostings: (state, postingData) => {
    state.postings = postingData;
  }
};

const actions = {
  getPostingsFromDB({ commit }) {
    fetch("http://localhost:3000/posts")
      .then(res => res.json())
      .then(resbody => {
        console.log(resbody);
        commit("setPostings", resbody);
      })
      .catch(err => console.log(err));
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
