<template>
 <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入职员名称">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :data='ruleForm'   border height="610">
      <el-table-column align="center"  width="80"label="ID">
				<template scope="scope">
						{{scope.row.id}}
				</template>
			</el-table-column>
      <el-table-column align="center"  width="120"label="头像">
				<template scope="scope">
					 <img  style="width:80px; heigh:80px; margin:8px; border-radius:5%;" :src="scope.row.avatar">
				</template>
			</el-table-column>
      <el-table-column  prop="position" align="center" label="职位">
			</el-table-column>	 
			<el-table-column  prop="name" width="120"align="center" label="姓名">
			</el-table-column>			
			<!-- <el-table-column  align="center" label="性别">
        <template scope="scope">
					{{scope.row.gender}}
				</template>
			</el-table-column>  -->
       <!-- <el-table-column align="center" prop="peopleRole" label="权限">
			</el-table-column> -->
      <el-table-column align="center" label="设置权限" width="130">
          <template scope="scope">
          <el-button   type="success"@click="changeperms(scope.row.id,scope.row.name,scope.row.avatar)">配置权限
          </el-button>
          </template>
      </el-table-column>
		</el-table> 
    <el-dialog :title="myname+'的角色与权限配置'" :visible.sync="dialogTableVisible"  width="100%" >
        <img  style="width:120px; heigh:120px; margin:8px; border-radius:50%;" :src="touxiang">
        <h3>角色选择</h3>
            <el-checkbox-group v-model="change.permission_group_ids">
                  <el-checkbox  style="height:30px; width:120px;"v-for="item in rolelist" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          <h3>权限选择</h3>
            <el-checkbox-group v-model="change.permission_ids">
                <el-checkbox  style="height:30px; width:120px;"v-for="item in checkList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogTableVisible2 = false">取 消</el-button>
              <el-button type="primary" @click="updatechange(myid)">确 定</el-button>
            </div>
		</el-dialog>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
			    :page-sizes="[60]" :page-size="listQuery.limit" layout=" sizes, prev, pager, next, jumper">
			</el-pagination> 
  </div>
</template>
<script>
import axios from "axios";
//import waves from "@/directive/waves/from.js"; // 水波纹指;
export default {
  data() {
    return {
      myid: "",

      touxiang: "",
      peopleRole: [],
      ruleForm: [],
      rolelist: [],
      permission: [],
      dialogTableVisible: false,
      myname: "",

      newform: {
        name: "",
        permission_ids: []
      },
      change: {
        permission_ids: [],
        permission_group_ids: []
      },
      checkList: [],
      listQuery: {
        page: 1,
        limit: 60,
        total: "",
        totalPage: 1
      }
    };
  },
  created() {
    this.gituser();
    this.newrole();
    this.getrole();
    this.getthispeoplerole();
  },
  methods: {
    getthispeoplerole() {
      axios
        .get("/api/users/" + 1 + "/permissions")
        .then(data => {
          this.peopleRole = data["data"]["permission_groups"]["0"]["name"];
          console.log(this.peopleRole);
        })
        .catch(e => {
          alert(e);
        });
    },
    changeperms(msg, meg, touxiang) {
      this.dialogTableVisible = true;
      this.myid = msg;
      this.myname = meg;
      this.touxiang = touxiang;
      //  console.log(this.myid);
    },
    updatechange(msg) {
      this.$confirm("此操作将永久修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogTableVisible = false;
          axios
            .post("/api/users/" + msg + "/permissions", this.change)
            .then(data => {
              // console.log(data);
              //this.getthispeoplerole(myid);\
            })
            .catch(e => {
              console.log(e);
            });

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
    gituser() {
      axios
        .get("/api/users/")
        .then(data => {
          this.ruleForm = data["data"]["users"];
          this.listQuery.total = data["data"]["meta"]["count"];
          // console.log(this.ruleForm);
        })
        .catch(e => {
          alert(e);
        });
    },
    getrole() {
      axios
        .get("/api/permission_groups")
        .then(data => {
          this.rolelist = data["data"]["permission_groups"];
          // console.log(this.rolelist);
        })
        .catch(e => {
          alert(e);
        });
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
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
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
