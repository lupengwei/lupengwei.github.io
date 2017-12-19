<template>
  <div  style="margin-top:80px">
    	<el-row class="btn-group" :gutter="20">

			<el-col :span="6" class='text-center'>
		  	<div class="portrait">
           <img  style="width:180px; heigh:180px; border-radius:50%;" :src="ruleForm.avatar">
        </div>
        <div>
          <h3>{{ruleForm.name}}</h3>
        </div>
        </el-col>
			<el-col :span="8" class='text-center-master'>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="成员名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" prop="english_name">
            <el-input v-model="ruleForm.english_name"></el-input>
          </el-form-item>
           <el-form-item label="职务信息" prop="position">
            <el-input v-model="ruleForm.position"></el-input>
          </el-form-item>
          <el-form-item label="职员性别" prop="type"> 
            <el-radio-group v-model="ruleForm.gender">
              <el-radio-button label="2">女</el-radio-button>
              <el-radio-button label="1">男</el-radio-button>
              <el-radio-button label="0">未知</el-radio-button>
            </el-radio-group>    
          </el-form-item>
          <el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="open2">保存</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
			</el-col>
			<el-col :span="10" class='text-center'>
       
			</el-col>
		</el-row>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      ruleForm: {
        avatar: "",
        english_name: "",
        gender: "0",
        id: "",
        name: "",
        position: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        position: [
          { required: true, message: "请输入职务", trigger: "blur" },
          { min: 1, max: 16, message: "长度在 1 到 16 个字符", trigger: "blur" }
        ],
        english_name: [{ required: true, message: "请保存名字", trigger: "change" }]
      }
    };
  },
  created() {
    this.gituser();
  },
  methods: {
    changeForm() {
      axios
        .put("/api/users/update_current", this.ruleForm)
        .then(data => {
          console.log(data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    gituser() {
      axios
        .get("api/users/current")
        .then(data => {
          this.ruleForm = data["data"]["user"];
          //this.avatar = this.ruleForm[0];
          console.log(this.ruleForm);
        })
        .catch(e => {
          alert(e);
        });
    },
    open2() {
      this.$confirm("此操作将永久修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeForm();
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    }
  }
};
</script>
<style>
.text-center-master {
  background-attachment: fixed;
  /* background-color: #e5e9f2; */
}
.portrait {
  border-radius: 50%;
}
</style>
