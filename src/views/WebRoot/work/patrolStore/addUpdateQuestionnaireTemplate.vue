<template>
  <el-card class="centerInfo add-member-return-task-wrap">
    <h4 class="page-title">
      {{currentId?'编辑':'新增'}}问卷模版
    </h4>
    <el-form :model="form" v-loading="loading" :rules="rules" ref="form" label-width="120px" class="from-wrap">
      <el-form-item label="问卷名称" prop="templateName">
        <el-input v-model="form.templateName" placeholder="请输入问卷名称"></el-input>
      </el-form-item>
      <el-form-item label="问卷说明" prop="templateDesc">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.templateDesc">
        </el-input>
      </el-form-item>
      <el-form-item label="是否需要打分" prop="isEval">
        <el-radio v-model="form.isEval" label="是">是</el-radio>
        <el-radio v-model="form.isEval" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="分值">
        <el-col :span="8">
          <el-input-number size="small" v-model="form.evalVal.lowVal"></el-input-number>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input-number size="small" v-model="form.evalVal.highVal"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="评分标准" prop="evalDesc">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.evalDesc">
        </el-input>
      </el-form-item>
      <div class="return-item-wrap">
        <div class="item" v-for="(item,index) in form.patrolShopTaskTempDtl" :key="index">
          <div class="item-header">
            回访项{{index+1}}
            <el-button type="primary" class="right del-btn" @click="deleteItem(item,index)">删除</el-button>
          </div>
          
          <el-form-item label="回访项" prop="taskName">
            <el-input v-model="item.returnVisitItem" placeholder="请输入回访项"></el-input>
          </el-form-item>
          <el-form-item label="回访话术" prop="taskName">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入回访话术"
              v-model="item.returnVisitItemDesc">
            </el-input>
          </el-form-item>
        </div>
        <div class="add-btn-box">
          <el-button type="primary" @click="addItem">新增回访项</el-button>
        </div>
      </div>
      <div class="btn-box">
        <el-button @click="handleBack">返回</el-button>
        <el-button type="primary" @click="submit('form')">确定</el-button>
      </div>
    </el-form>
    <!-- <SelectGroup :is-show-dialog.sync="isShowSelectGroup" :select-Group-info.sync="selectGroupInfo" />
    <SelectStore :is-show-dialog.sync="isShowSelectStore" :select-store-info.sync="selectStoreInfo" /> -->
  </el-card>
</template>

<script>
import { apiGetQuestionnaireTemplateDetails, apiAddQuestionnaireTemplate ,apiUpdateQuestionnaireTemplate } from '@/api/work/memberReturnVisit.js'
import { mapGetters } from 'vuex'
  export default {
    components: {},
    computed: {
      // 计算属性
      ...mapGetters([
        'userInfo',
      ]),
    },
    data() {
      return {
        loading: false,
        currentId:null,
        form: {
          userId: null, 
          templateName: '',
          templateDesc: "",
          isEval: "",
          evalVal: {
            lowVal:'',
            highVal:''
          },
          evalDesc: "",
          patrolShopTaskTempDtl : [{
            returnVisitItem:'',
            returnVisitItemDesc:'',
          }]
        },
        rules: {
          templateName: [{
            required: true,
            trigger: 'blur'
          }],
          templateDesc: [{
            required: true,
            max: 140,
            message: 'Length should be less 140',
            trigger: 'blur'
          }]
        },
      }
    },
    mounted() {
      this.currentId = this.$route.params.id
      if(this.currentId) {
        this.getDetails()
      }else{
        this.reset()
      }
    },
    methods: {
      initForm() {
        this.$refs.form.resetFields()
        this.form = {
          userId: null, 
          templateName: '',
          templateDesc: "",
          isEval: "",
          evalVal: {
            lowVal:'',
            highVal:''
          },
          evalDesc: "",
          patrolShopTaskTempDtl : [{
            returnVisitItem:'',
            returnVisitItemDesc:'',
          }]
        }
      },
      getDetails(){
        apiGetQuestionnaireTemplateDetails({
          userId: this.userInfo.userCode,
          id: this.currentId
        }).then((res) => {
          let { messageType, messageContent} = JSON.parse(Base64.decode(res.data));
          if (messageType == 'SUCCESS') {
            this.form = messageContent
          } else {
            this.$message({
              message: '系统错误',
              type: 'warning'
            });
          }
          this.loading = false;
        }).catch((err) => {
          this.loading = false;
        });
      },
      addItem(){
        let obj = {
          returnVisitItem: "",
          returnVisitItemDesc: ""
        }
        this.form.patrolShopTaskTempDtl.push(obj)
      },
      deleteItem(item,index){
        this.form.patrolShopTaskTempDtl.splice(index,1);
      },
      handleBack() {
  
      },
      reset() {
        this.initForm()
      },
      submit() {
        this.form.userId = this.userInfo.userCode
        console.log(this.form)
        this.$refs.form.validate((valid) => {
          if (!valid) return
          this.loading = true;
          if(this.currentId) this.update()
          this.add()
        })
      },
      add(){
        apiAddQuestionnaireTemplate(this.form).then((res) => {
          this.loading = false;
          let data = JSON.parse(Base64.decode(res.data));
          if(data.messageType=='SUCCESS') {
            this.$message.success("新增成功");
            this.$router.push('work-memberReturnVisit/questionnaireTemplate')
          } else {
            this.$message({
              message: data.messageContent,
              type: 'warning'
            });
          }
          this.loading = false;
        }).catch((err) => {
          this.loading = false;
          this.$message({
              message: err,
              type: 'warning'
            });
        });
      },
      update(){
        apiUpdateQuestionnaireTemplate(this.form).then((res) => {
          this.loading = false;
          let data = JSON.parse(Base64.decode(res.data));
          if(data.messageType=='SUCCESS') {
            this.$message.success("编辑成功");
            this.$router.push('work-memberReturnVisit/questionnaireTemplate')
          } else {
            this.$message({
              message: data.messageContent,
              type: 'warning'
            });
          }
          this.loading = false;
        }).catch((err) => {
          this.loading = false;
          this.$message({
              message: err,
              type: 'warning'
            });
        });
      }
    },
  }
</script>

<style lang="scss" scope>
.right{
  float: right;
}
.del-btn{
  margin-top: -10px;
}
.add-btn-box{
  text-align: center;
}
  .line {
    text-align: center;
  }
  .page-title{
    padding:20px;
    margin-bottom: 20px;
    border-bottom:1px solid #e5e5e5;
  }
  .add-member-return-task-wrap {
    .from-wrap {
      width: 50%;
      margin: 0 auto;
    }
    .item-inline {
      .el-form-item {
        display: inline-block;
        &.ml_20 {
          .el-form-item__content {}
        }
      }
      .middle-text {
        margin-left: 20px !important;
      }
    }
  }
  .return-item-wrap{
    .item{
      &+.item{
        margin-top:10px;
      }
      .item-header{
        padding:10px;
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 10px;
      }
    }
  }
  .btn-box{
    text-align: center;
    margin-top:40px;
  }
</style>
