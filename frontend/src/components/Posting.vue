<template>
  <v-card class="elevation-0 my-3">
    <v-row>
      <v-col cols="2" sm="1">
        <v-card-text>
          <v-avatar>
            <img :src="posterAvatar" />
          </v-avatar>
        </v-card-text>
      </v-col>
      <v-col cols="10" sm="11">
        <v-card-title>{{ posterFirstname }} {{ posterLastname }}</v-card-title>
        <v-card-subtitle>Geposted am: {{ postingTimestamp }}</v-card-subtitle>
        <v-card-text>{{ postingContent }}</v-card-text>
        <v-card-actions>
          <app-postingform :parentPosting="postingId">
            <template #buttonlabel>Kommentieren</template>
            <template #dialogtitle>Neuer Kommentar</template>
          </app-postingform>
        </v-card-actions>
        <v-col v-for="(item, i) in subpostingids" :key="i">
          <app-posting :postingid="item"></app-posting>
        </v-col>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import PostingForm from "@/components/PostingForm.vue";
import Posting from "@/components/Posting.vue";

function checkHttpStatus(res) {
  if (!res.ok) {
    throw new Error(`HTTP-Status: ${res.status} - ${res.statusText}`);
  }
}

export default {
  data() {
    return {
      posting: {},
      subpostingids: [],
    };
  },
  name: "app-posting",
  props: {
    postingid: Number,
  },
  async created() {
    try {
      // data of this posting
      const res1 = await fetch(
        `${process.env.VUE_APP_BACKEND}/postings/${this.postingid}`
      );
      checkHttpStatus(res1);
      let result = await res1.json();
      this.posting = result[0];

      // get id-list of subpostings
      const res2 = await fetch(
        `${process.env.VUE_APP_BACKEND}/postings/${this.postingid}/postings`
      );
      checkHttpStatus(res2);
      result = await res2.json();
      this.subpostingids = result.map(result => result.id);

    } catch (err) {
      // display snackbar with error message
      this.$store.commit("setAlert", { msg: err.message, color: "error" });
    }
  },
  computed: {
    posterFirstname() {
      return this.posting.firstname;
    },
    posterLastname() {
      return this.posting.lastname;
    },
    posterAvatar() {
      return `${process.env.VUE_APP_BACKEND}/${this.posting.avatar}`;
    },
    postingContent() {
      return this.posting.content;
    },
    postingTimestamp() {
      return this.posting.timestamp;
    },
    postingId() {
      return this.posting.id;
    },
  
  },
  components: {
    "app-postingform": PostingForm,
    "app-posting": Posting,
  },
};
</script>
