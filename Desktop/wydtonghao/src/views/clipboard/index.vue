<template>
  <div class="app-container">
    
  </div>
</template>

<script>
import axios from 'axios'
export default {
  directives: {},
  data() {
    return {
      activeName: "directly",
      inputData: ""
    };
  },
  created() {
    axios
      .get("api/facilities")
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    // axios
    //   .post("/api/facilities/bath_create")
    //   .then(function(response) {
    //     console.log(response);
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  },
  methods: {}
};
</script>

