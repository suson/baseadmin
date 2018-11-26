<template>
<div class="app-container">
  <el-table
    ref="multipleTable"
    empty-text="暂无数据"
    v-loading="listLoading"
    border
    :data="listData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="50">
    </el-table-column>
    <el-table-column
      label="id"
      width="120">
      <template slot-scope="scope">{{ scope.row.urlid }}</template>
    </el-table-column>
    <el-table-column
      label="标题"
      width="220">
      <template slot-scope="scope">{{ scope.row.name }}</template>
    </el-table-column>
    <el-table-column
      label="网址"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.turl | filterUrl('url')}}</template>
    </el-table-column>
    <el-table-column
      label="关键字"
      width="220">
      <template slot-scope="scope">{{ scope.row.turl | filterUrl('keyword')}}</template>
    </el-table-column>
    <el-table-column
      label="今日分享"
      width="120">
      <template slot-scope="scope">{{ scope.row.tdclick }}</template>
    </el-table-column>
    <el-table-column
      label="状态"
      width="120">
      <template slot-scope="scope">{{scope.row.online | urlStatusName}}-{{scope.row.free | shareStatusName}}</template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="120">
      <template slot-scope="scope"><el-button
          size="mini"
          @click="edit(scope.row)">编辑</el-button></template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
    <el-button @click="operate(0)">停止</el-button>
    <el-button @click="operate(1)">开始</el-button>
    <el-button @click="delTip()">删除</el-button>
  </div>
</div>
</template>

<script>
import { getList,del,operate } from '@/api/task'

export default {
    data() {
        return {
            listLoading:true,
            listData: [],
            multipleSelection: []
        }
    },
    created() {
        this.fetchData()
    },
    filters: {
        urlStatusName: function (value) {
            var name = '';
            switch(value.toString()) {
                case '0':
                name = '离线';
                break;
                case '1':
                name = '在线';
                break;

            }
            return name;
        },
        shareStatusName:function(value) {
            var name = '';
            switch(value.toString()) {
                case '0':
                name = '未分享';
                break;
                case '1':
                name = '分享中';
                break;

            }
            return name;
        },
        filterUrl:function(data,type) {
            data = data.split("|");
            switch(type) {
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
            this.listLoading=false;
            var i = {
                "type":"baidu_speed"
            };
            i = JSON.stringify(i);
            getList(i).then(response => {
                // console.log(response);
                this.listData = response.urls;
                this.listLoading = false
            })
        },
        delTip:function() {
            // console.log(this.multipleSelection);
            var ids=[];
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
            '提示',
            {
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
        del:function(ids){
            console.log(ids);
            var i = {
                "ids":ids
            }
            i = JSON.stringify(i);
            del(i).then(response => {
                if(response.error > -1 ) {
                    for (var i in ids) {
                        // console.log(ids[i])
                        for (var j in this.listData) {
                            if (ids[i] == this.listData[j].urlid) {
                                this.listData.splice(j,1);
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
        operate:function(type) {
            var ids=[];
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
                "free":type,
                "ids":ids
            }
            i = JSON.stringify(i);
            operate(i).then(response => {
                if(response.error > -1 ) {
                    for (var i in ids) {
                        // console.log(ids[i])
                        for (var j in this.listData) {
                            if (ids[i] == this.listData[j].urlid) {
                                this.listData[j].free = type;
                                break;
                            }
                        }
                    }
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
            this.$router.push({path: '/baidu_task/edit/'+item.urlid})
        }
    }
}
</script>