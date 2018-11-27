<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <label>简介</label>
          <p>1：百度排名任务是快速提升网站在百度上关键字排名，请添加百度前50名的关键字！提升手机排名请用手机百度功能。</p>
          <p>2：任务总数代表这个任务一共能做多少次，每天次数代表每天可以做的数量。</p>
          <p>3：每天次数建议是关键字指数的十分之一左右，具体多少根据排名高低可以适当加减。<br></p>
          <p>4：百度排名功能需要长期使用才会见效，如果只是偶尔使用效果很小。</p>
          <p><br></p>
          <label>基础设置</label>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="2">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">

          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="任务备注" prop="name">
              <el-input v-model="ruleForm.name" placeholder='备注名称'></el-input>
              <!-- <span class="help-block info">请输入任务的备注名，以便自己识别</span> -->
            </el-form-item>

            <el-form-item label="关键字" prop="keyword">
              <el-input v-model="ruleForm.keyword" placeholder='添加需要刷的关键字'></el-input>
              <!-- <span class="help-block tips">添加需要刷的关键字</span> -->
            </el-form-item>

            <el-form-item label="域名" prop="url">
              <el-input v-model="ruleForm.url" placeholder='例：http://www.baidu.com'></el-input>
              <!-- <span class="help-block">网站域名</span> -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">{{save_tip}}</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
              <el-button @click="goBack()">返回列表</el-button>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
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
    getInfo,
    save
  } from "@/api/task";

  export default {
    created() {
      console.log(this.$route);
      if (this.$route.meta.isEdit) {
        this.ruleForm.urlid = this.$route.params.id;
        this.getInfo(this.ruleForm.urlid);
        this.save_tip = "保存";
      }
    },
    data() {
        var validateUrl = (rule,value,callback) => {
            var urlreg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&amp;]\w+=\w*)*$/;
            if (!urlreg.test(value)) {
                callback(new Error('请输入正确的网址'));
            } else {
                callback();
            }
        }
      return {
        save_tip: "立即创建",
        type: "baidu_speed",
        ruleForm: {
          id: "",
          name: "",
          keyword: "",
          url: "",
          desc: ""
        },
        rules: {
          name: [{
              required: true,
              message: "请输入任务备注",
              trigger: "blur"
            },
            {
              min: 3,
              max: 50,
              message: "长度在 3 到 50 个字符",
              trigger: "blur"
            }
          ],
          url:[
            {
              required: true,
              message: "请输入网址",
              trigger: "blur"
            },
            { validator: validateUrl, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.save();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      goBack() {
        window.history.length > 1 ?
          this.$router.go(-1) :
          this.$router.push("/baidu_task/speed");
      },
      getInfo(id) {
        let i = {
          urlid: id
        };
        i = JSON.stringify(i);
        getInfo(i).then(response => {
          // console.log(response);
          this.ruleForm = response.data;
        });
      },
      save() {
        let i = this.ruleForm;
        i.type = this.type;
        i = JSON.stringify(i);
        save(i).then(response => {
          if (response.error > -1) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$router.push("/baidu_task/speed");
          }
        });
      }
    }
  };

</script>
