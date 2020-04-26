<template>
  <v-app>
    <template v-if="getAuthenticated">
      <v-content>
        <router-view :key="$route.path"></router-view>
        <v-btn @click="exit()">exit</v-btn>
      </v-content>
    </template>
    <template v-else>
      <!-- NOT AUTEHNTICATED -->
      <router-view></router-view>
    </template>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",

  components: {},
  async created() {
    // console.log("created")
    if (this.getAuthenticated) {
      (async () => {
        // await this.initApp(); // es necesario ??
        // console.log("autenticated")
      })();
    } else {
      // This line returns error "Navigation Duplicated"
      // catching the error, it is removed
      this.$router.push({ name: "Login" }).catch(() => {});
      /* eslint-disable no-console */
      console.log("NO autenticated");
      /* eslint-enable no-console */
    }
  },
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters("app", ["getAuthenticated"])
  },
  methods: {
    ...mapActions("app", ["initApp", "logout"]),
    exit() {
      this.logout();
    }
  }
};
</script>
