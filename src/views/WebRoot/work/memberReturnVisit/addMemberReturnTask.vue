<template>
  <el-card class="centerInfo add-member-return-task-wrap">
    <el-form :model="form" v-loading="loading" :rules="rules" ref="form" label-width="120px" class="from-wrap">
  
      <el-form-item label="回访标题" prop="taskName">
        <el-input v-model="form.taskName" placeholder="请输入回访标题"></el-input>
      </el-form-item>
      <el-form-item  label="回访时间周期" prop="taskDate">
        <el-date-picker v-model="form.taskDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <!-- 回访对象 -->
      <h2>回访对象</h2>
      <el-form-item label="会员分组" prop="storeGroupName">
        <el-input v-model="form.storeGroupName" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="openSelectGroup">选择分组</el-button>
      </el-form-item>
      <el-form-item label="组织选择" prop="storeGroupDesc">
        <!-- 门店 -->
        {{selectStoreInfo}}
        <el-input v-model="selectStoreInfo.nameArray" :disabled="false" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="openStore">选择门店</el-button>
      </el-form-item>
      <el-form-item label="性别" prop="nodeType">
        <el-radio-group v-model="form.nodeType">
          <el-radio :label="0" >男</el-radio>
          <el-radio :label="1">女</el-radio>
          <el-radio :label="2">未知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="会员等级"  prop="memberLevel">
        <el-select
          v-model="form.memberLevel"
          multiple
          collapse-tags
          placeholder="请选择">
          <el-option
            v-for="item in gradeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄">
        <el-col :span="8">
          <el-input-number size="small" v-model="form.ageBegin"></el-input-number>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input-number size="small" v-model="form.endBegin"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="生日">
        <el-col :span="8">
          <el-input-number size="small" v-model="form.ageBegin"></el-input-number>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input-number size="small" v-model="form.endBegin"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="当前积分">
        <el-col :span="8">
          <el-input v-model="form.integralMin" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input v-model="form.integralMax" placeholder="请输入内容"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="消费类型">
        <el-radio-group v-model="form.consumeType">
          <el-radio :label="0" >消费时间段</el-radio>
          <el-radio :label="1">最后一次消费时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item  label="消费时间">
        <el-date-picker v-model="form.orderDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="累计消费次数" v-if="form.consumeType==0">
        <el-col :span="8">
          <el-input-number size="small" v-model="form.realpayCountMin"></el-input-number>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input-number size="small" v-model="form.realpayCountMax"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="消费金额">
        <el-col :span="8">
          <el-input v-model="form.realpayAmountMin" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input v-model="form.realpayAmountMax" placeholder="请输入内容"></el-input>
        </el-col>
      </el-form-item>

      <div >
  
        <el-button @click="handleBack">返回</el-button>
        <el-button type="primary" @click="submit('form')">确定</el-button>
      </div>
    </el-form>
    <SelectStore :is-show-dialog.sync="isShowStore" :select-store-info.sync="selectStoreInfo" />
  </el-card>
</template>

<script>
import SelectStore from '@/components/common/SelectStore/SelectStore.vue'
  export default {
    components:{
      SelectStore
    },
    computed: {
  
    },
    data() {
      return {
        loading: false,
        isShowSelectGroup:false,
        isShowStore:false,
        selectStoreInfo:{
          idArray:'',
          nameArray:'',
        },
        form: {
          memberLevel:'',
          orderDate:'',
          orderDateBegin:'',
          orderDateEnd:'',
          relationObj:{
            idArray:'',
            nameArray:'',
          }
        },
        rules: {
          name: [{
              required: true,
              trigger: 'blur'
            },
            {
              max: 50,
              message: 'Length should be less 50',
              trigger: 'blur'
            }
          ],
          code: [{
            required: true,
            trigger: 'blur'
          }],
          desc: [{
            max: 140,
            message: 'Length should be less 140',
            trigger: 'blur'
          }]
        },
        gradeOptions:[
          {
            value:'钻石卡',
            label:'钻石卡'
          },
          {
            value:'金卡',
            label:'金卡'
          },
          {
            value:'银卡',
            label:'银卡'
          },
          {
            value:'普卡',
            label:'普卡'
          },
        ]
      }
    },
    mounted() {},
    methods: {
      initForm() {
        this.$refs.form.resetFields()
        this.form = {
          departmentId: null,
          parentId: null,
          name: '',
          code: '',
          desc: ''
        }
      },
      handleBack() {
  
      },
      reset() {
        this.initForm()
      },
      openSelectGroup(){
        this.isShowSelectGroup = true
      },
      openStore(){
        this.isShowStore = true
      },

      submit() {
        this.$refs.form.validate((valid) => {
          if (!valid) return
          this.loading = true;
          this.$Axios.addDepartment(this.form).then((res) => {
            this.loading = false;
            this.$message.success("Add Department Successfully!");
            this.$emit('refresh-page', res.data.nodeId, 'd', res.data.refId)
            this.cancel();
          }).catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
        })
      }
    },
  }
</script>

<style lang="scss" scope>
.line{
  text-align: center;
}
.add-member-return-task-wrap{
  .from-wrap {
    width: 50%;
    margin: 0 auto;
  }
  .item-inline{
    .el-form-item{
      display: inline-block;
      &.ml_20{
        .el-form-item__content{

        }
      }
    }
    .middle-text{
      margin-left:20px !important;
    }
  }
}
  
</style>
