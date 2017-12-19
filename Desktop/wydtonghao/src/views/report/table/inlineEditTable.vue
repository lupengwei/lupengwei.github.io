<template>
 <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="搜索职员">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
         <el-button type="primary" icon="edit"  style=" float:right;" @click=" newroleopen">新建角色</el-button>
        <el-table :data='ruleForm' border height="610">
			 <el-table-column align="center"  width="80"label="ID">
				<template scope="scope">
						{{scope.row.id}}
				</template>
			</el-table-column>
			<el-table-column  prop="name" width="120"align="center" label="角色名">
			</el-table-column>			
			<el-table-column  align="center" prop="pName" label="权限">
			</el-table-column> 
            <el-table-column align="center" label="修改权限" width="130">
                <template scope="scope">
                <el-button   type="success"@click="changeperms(scope.row.id,scope.row.name)">修改权限
                </el-button>
                </template>
            </el-table-column>
            <el-table-column width="130" align="center" label="删除角色">
				<template scope="scope">
                    <el-button   type="danger" @click="deldatperms(scope.row.id)" >删除角色
                </el-button>
				</template>
			</el-table-column>
		</el-table>
        
        <el-dialog title="修改该角色权限" :visible.sync="dialogTableVisible1"  width="100%" >
            <h4>权限选择</h4>
                <el-checkbox-group v-model="change.permission_ids">
                    <el-checkbox  style="height:30px; width:160px;"v-for="item in checkList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="updatechange(myid)">确 定</el-button>
            </div>
		</el-dialog>
        <el-dialog title="新建角色" :visible.sync="dialogTableVisible2"  width="100%" >
            <el-form >
                <el-form-item label="角色名称" >
                <el-input v-model="newform.name" auto-complete="true"></el-input>
                </el-form-item>   
            </el-form>
            <h4>权限选择</h4>
                <el-checkbox-group v-model="newform.permission_ids">
                    <el-checkbox  style="height:30px; width:160px;"v-for="item in checkList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="updatenew">确 定</el-button>
            </div>
		</el-dialog>
    </div>
  </div>
</template>
<script>
import axios from "axios";
//import waves from "@/directive/waves/from.js"; // 水波纹指;
export default {
  data() {
    return {
      myid: "",
      ruleForm: [],
      permission: [],
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      newform: {
        name: "",
        permission_ids: []
      },
      change: {
        name: "",
        permission_ids: []
      },
      checkList: [],
      newArray: [],
      from: []
    };
  },
  created() {
    this.gituser();
    this.newrole();
  },
  methods: {
    changeperms(msg, meg) {
      this.dialogTableVisible1 = true;
      this.myid = msg;
      this.change.name = meg;
      //   console.log(meg);
    },
    updatechange(msg) {
      this.$confirm("此操作将永久修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogTableVisible1 = false;
          //   alert(msg);
          axios
            .put("/api/permission_groups/" + msg, this.change)
            .then(data => {
              console.log(data);
              this.gituser();
            })
            .catch(e => {
              console.log(e);
            });
          //   this.newroleapi();

          //   alert(this.ruleForm);
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .catch(() => {
          this.dialogTableVisible1 = false;
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },

    updatenew() {
      this.$confirm("此操作将永久新建, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogTableVisible2 = false;
          this.newroleapi();

          this.$message({
            type: "success",
            message: "新建成功!"
          });
        })
        .catch(() => {
          this.dialogTableVisible2 = false;
          this.$message({
            type: "info",
            message: "已取消新建"
          });
        });
    },
    newroleapi() {
      axios
        .post("/api/permission_groups", this.newform)
        .then(data => {
          //console.log(data);
          this.gituser();
        })
        .catch(e => {
          alert(this.e.messages);
        });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    newroleopen() {
      this.dialogTableVisible2 = true;
    },

    newrole() {
      axios
        .get("/api/permissions")
        .then(data => {
          this.checkList = data["data"]["permissions"];
        })
        .catch(e => {
          alert(e);
        });
    },
    deldatperms(msg) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .delete("/api/permission_groups/" + msg)
            .then(data => {
              this.gituser();
            })
            .catch(e => {
              //   alert(e);
            });

          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    gituser() {
      axios
        .get("/api/permission_groups")
        .then(data => {
          this.ruleForm = data["data"]["permission_groups"];
          this.ruleForm.map(data => {
            let tempStr = "";
            data.permissions.forEach(data1 => {
              tempStr += data1.name;
              tempStr += " *";
            });
            return (data.pName = tempStr);
          });
          //this.avatar = this.ruleForm[0];
          //   console.log(this.ruleForm);
        })
        .catch(e => {
          alert(e);
        });
    },
    open2() {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //   this.changeForm();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleFilter() {
      //   this.listQuery.page = 1
      //   this.getList()
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
