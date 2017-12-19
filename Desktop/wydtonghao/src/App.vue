<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import axios from "axios";
export default {
  name: "APP",
  data() {
    return {
      userrolemassag: {
        avatar: "",
        english_name: "",
        gender: "0",
        id: "",
        name: "",
        position: ""
      }
    };
  }
  // created() {
  //   this.gituserif();
  // },
  // methods: {
  //   gituserif() {
  //     axios
  //       .get("/api/users/current/")
  //       .then(data => {
  //         this.userrolemassag = data["data"]["user"];
  //         alert(userrolemassag);
  //       })
  //       .catch(e => {
  //         alert(e);
  //       });
  //   }
  // }
};
</script>

<style lang="scss">
@import "~normalize.css/normalize.css"; // normalize.css 样式格式化
@import "./styles/index.scss"; // 全局自定义的css样式
</style>
