<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-button @click="addTask()" size="small" type="primary" plain>创建新任务</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-table ref="multipleTable" empty-text="暂无数据" v-loading="listLoading" border :data="listData"
            tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column label="id" width="120">
              <template slot-scope="scope">{{ scope.row.urlid }}</template>
            </el-table-column>
            <el-table-column label="标题" width="220">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="网址" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.turl | filterUrl('url')}}</template>
            </el-table-column>
            <el-table-column label="关键字" width="220">
              <template slot-scope="scope">{{ scope.row.turl | filterUrl('keyword')}}</template>
            </el-table-column>
            <el-table-column label="今日分享" width="80">
              <template slot-scope="scope">{{ scope.row.tdclick }}</template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template slot-scope="scope">{{scope.row.online | urlStatusName}}-{{scope.row.free | shareStatusName}}</template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
                <el-button size="mini" @click="open(scope.row)">开通</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button-group>
            <el-button size="small" type="primary" icon="el-icon-remove-outline" @click="operate(0)">停止</el-button>
            <el-button size="small" type="primary" icon="el-icon-caret-right" @click="operate(1)">开始</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="delTip()">删除</el-button>
            </el-button-group>
          </div>
        </div>
      </el-col>
    </el-row>
<el-dialog
  title="龙卷风软件-网址代挂服务"
  :visible.sync="centerDialogVisible"
  width="60%"
  >
  <el-form :model="substituteForm" :label-position="labelPosition">
    
    <el-form-item label="1、请选择代挂流量：" :label-width="formLabelWidth">
      <el-select v-model="substituteForm.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="2、请输入服务时间：" :label-width="formLabelWidth">
      <el-col :span="2">
      <el-input v-model.number="substituteForm.name" autocomplete="off"></el-input>
      </el-col>
      <el-col :span="22">
          <span>天(范围:1-365天)</span>
      </el-col>
    </el-form-item>
    <el-form-item label="3、请选择付费方式：" prop="resource" :label-width="formLabelWidth">
    <el-radio-group v-model="substituteForm.resource">
      <el-radio label="1">一次性付费</el-radio>
      <el-radio label="0">按天付费</el-radio>
    </el-radio-group>
  </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>
<style>
  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  /* .bg-purple {
    background: #d3dce6;
  } */
  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

</style>
<script>
  import {
    getList,
    del,
    operate
  } from '@/api/task'

  export default {
    data() {
      return {
        listLoading: true,
        labelPosition:'left',
        centerDialogVisible:false,
        listData: [],
        multipleSelection: [],
        substituteForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '150px'
      }
    },
    created() {
      this.fetchData()
    },
    filters: {
      urlStatusName: function (value) {
        var name = '';
        switch (value.toString()) {
          case '0':
            name = '离线';
            break;
          case '1':
            name = '在线';
            break;

        }
        return name;
      },
      shareStatusName: function (value) {
        var name = '';
        switch (value.toString()) {
          case '0':
            name = '未分享';
            break;
          case '1':
            name = '分享中';
            break;

        }
        return name;
      },
      filterUrl: function (data, type) {
        data = data.split("|");
        switch (type) {
          case 'url':
            return data[0] || '';
            break;
          case 'keyword':
            return data[1] || '';
            break;
        }
      }
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      fetchData() {
        this.listLoading = false;
        var i = {
          "type": "baidu_speed"
        };
        i = JSON.stringify(i);
        getList(i).then(response => {
          // console.log(response);
          this.listData = response.urls;
          this.listLoading = false
        })
      },
      delTip: function () {
        // console.log(this.multipleSelection);
        var ids = [];
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].urlid);
        }
        if (ids.length < 1) {
          this.$message({
            message: '请选择任务',
            type: 'error',
            duration: 3 * 1000
          })
          return false;
        }
        this.$confirm(
          '删除则不可恢复，确定删除？',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.del(ids);

        }).catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          // });
        });
        console.log(1);

        return;
      },
      del: function (ids) {
        console.log(ids);
        var i = {
          "ids": ids
        }
        i = JSON.stringify(i);
        del(i).then(response => {
          if (response.error > -1) {
            for (var i in ids) {
              // console.log(ids[i])
              for (var j in this.listData) {
                if (ids[i] == this.listData[j].urlid) {
                  this.listData.splice(j, 1);
                  break;
                }
              }
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      addTask: function () {
        this.$router.push('/baidu_task/add')
      },
      operate: function (type) {
        var ids = [];
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].urlid);
        }
        if (ids.length < 1) {
          this.$message({
            message: '请选择任务',
            type: 'error',
            duration: 3 * 1000
          })
          return false;
        }
        var i = {
          "free": type,
          "ids": ids
        }
        i = JSON.stringify(i);
        operate(i).then(response => {
          if (response.error > -1) {
            for (var i in ids) {
              // console.log(ids[i])
              for (var j in this.listData) {
                if (ids[i] == this.listData[j].urlid) {
                  this.listData[j].free = type;
                  break;
                }
              }
            }
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          } else {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      edit(item) {
        this.$router.push({
          path: '/baidu_task/edit/' + item.urlid
        })
      },
      open(item) {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.toggleRowSelection(item,true);
          this.centerDialogVisible = true
      }
    }
  }

</script>
