<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12">
        <h1>Forum</h1>
      </v-col>
    </v-row>
    <v-row justify="center" dense>
      <v-col cols="12" v-for="(item, i) in postingids" :key="i">
        <app-posting :postingid="item"></app-posting>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <app-postingform :parentPosting="0">
          <template #buttonlabel>
            Neuen Beitrag erstellen
          </template>
          <template #dialogtitle>
            Neuer Beitrag
          </template>
        </app-postingform>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Posting from "@/components/Posting.vue";
import PostingForm from "@/components/PostingForm.vue";



function checkHttpStatus(res) {
  if (!res.ok) {
    throw new Error(`HTTP-Status: ${res.status} - ${res.statusText}`);
  }
}

export default {
  data() {
    return {
      postingids: [],
    };
  },
  async created() {
    try {
      // get all toplevel postings
      const res = await fetch(
        `${process.env.VUE_APP_BACKEND}/postings/null/postings`
      );
      checkHttpStatus(res);
      let result = await res.json();
      this.postingids = result.map(result => result.id); 
    } catch (err) {
      // display snackbar with error message
      this.$store.commit("setAlert", { msg: err.message, color: "error" });
    }
  },

  components: {
    "app-posting": Posting,
    "app-postingform": PostingForm,
  },
};
</script>
