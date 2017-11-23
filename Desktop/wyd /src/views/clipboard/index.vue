<template>
  <div class="app-container">
    
  </div>
</template>

<script>
export default {
  directives: {},
  data() {
    return {
      activeName: "directly",
      inputData: "https://github.com/PanJiaChen/vue-element-admin"
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

