<template>
  <el-card class="centerInfo add-member-return-task-wrap">
    <el-form :model="form" v-loading="loading" :rules="rules" ref="form" label-width="120px" class="from-wrap">
      <el-form-item label="回访标题" prop="taskName">
        <el-input v-model="form.taskName" placeholder="请输入回访标题"></el-input>
      </el-form-item>
      {{form.taskDateArray}}
      <el-form-item label="回访时间周期" prop="taskDateArray">
        <el-date-picker v-model="form.taskDateArray" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="changeTaskDate">
        </el-date-picker>
      </el-form-item>
  
      <!-- 回访对象 -->
      <h2>回访对象</h2>
      <el-form-item label="会员分组" prop="storeGroupName">
        <el-input v-model="selectGroupInfo.groupName" placeholder="请选择" :disabled="true"></el-input>
        <el-button type="primary" @click="openSelectGroup">选择分组</el-button>
      </el-form-item>
      <el-form-item label="组织选择" prop="storeGroupDesc">
        <!-- 门店 -->
        {{selectStoreInfo}}
        <el-input v-model="selectStoreInfo.nameArray" :disabled="true" placeholder="请选择"></el-input>
        <el-button type="primary" @click="openStore">选择门店</el-button>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.customConditions.sex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
          <el-radio label="未知">未知</el-radio>
        </el-radio-group>
      </el-form-item>
      {{form.customConditions.levalId}}
      {{form.customConditions.levalName}}
      <el-form-item label="会员等级" prop="levalName">
        <el-select v-model="form.customConditions.levalId" multiple collapse-tags placeholder="请选择" @change="handleSelectLeaval">
          <el-option v-for="item in levalOption" :key="item.key" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄">
        <el-col :span="8">
          <el-input-number size="small" v-model="form.customConditions.age.fromAge"></el-input-number>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input-number size="small" v-model="form.customConditions.age.toAge"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker v-model="form.birthdayDayArray" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd" @change="changeBirthdayDay">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="当前积分">
        <el-col :span="8">
          <el-input v-model="form.customConditions.point.fromPoint" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input v-model="form.customConditions.point.toPoint" placeholder="请输入内容"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="消费类型">
        <el-radio-group v-model="form.consumeType">
          <el-radio :label="0">消费时间段</el-radio>
          <el-radio :label="1">最后一次消费时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消费时间">
        <el-date-picker v-model="form.saleDateArray" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="changeSaleDate">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="累计消费次数" v-if="form.consumeType==0">
        <el-col :span="8">
          <el-input-number size="small" v-model="form.customConditions.sales.fromSaleNumbers"></el-input-number>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input-number size="small" v-model="form.customConditions.sales.toSaleNumbers"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="消费金额">
        <el-col :span="8">
          <el-input v-model="form.customConditions.sales.fromSaleVal" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="8">
          <el-input v-model="form.customConditions.sales.toSaleVal" placeholder="请输入内容"></el-input>
        </el-col>
      </el-form-item>
  
      <div>
  
        <el-button @click="handleBack">返回</el-button>
        <el-button type="primary" @click="submit('form')">确定</el-button>
      </div>
    </el-form>
    <SelectGroup :is-show-dialog.sync="isShowSelectGroup" :select-Group-info.sync="selectGroupInfo" />
    <SelectStore :is-show-dialog.sync="isShowSelectStore" :select-store-info.sync="selectStoreInfo" />
  </el-card>
</template>

<script>
import { apiAddMemberReturnTask, apiUpdateMemberReturnTask, apiGetMemberReturnTaskDetails } from '@/api/work/memberReturnVisit.js'
  import SelectGroup from '@/components/common/SelectGroup/SelectGroup.vue'
  import SelectStore from '@/components/common/SelectStore/SelectStore.vue'
  import {
    selectLevalInfo
  } from '@/api/public'
  import {
    mapGetters
  } from 'vuex'
  import {
    selectGroupAll
  } from '@/api/member/group'
  export default {
    components: {
      SelectGroup,
      SelectStore
    },
    computed: {
      // 计算属性
      ...mapGetters([
        'userInfo',
      ]),
    },
    data() {
      return {
        loading: false,
        isShowSelectGroup: false,
        isShowSelectStore: false,
        selectStoreInfo: {
          idArray: '',
          nameArray: '',
        },
        selectGroupInfo: [],
        form: {
          userId: null, //"当前登录用户账号"
          taskName: '', //"任务名称"
          taskDate: { //"任务时间（json格式）"
            taskDateBegin: '',
            taskDateEnd: ''
          },
          relationObj: { //"门店(json格式)"
            idArray: '',
            nameArray: '',
          },
          memberGroup: { //"任务对象-会员分组(json格式)"
          },
          customConditions: { //"任务对象-自定义条件(json格式)", 
            "sex": "男", //性别
            "levalName": "", //会员等级名称
            "levalId": "", //会员等级ID
            "age": { //年龄
              "fromAge": "", //开始年龄
              "toAge": "" //结束年龄
            },
            "birthdayDay": {
              "fromDate": "", //开始生日日期
              "toDate": "" //结束生日日期
            },
            "point": {
              "fromPoint": "", //开始积分
              "toPoint": "" //结束积分
            },
            "sales": {
              "fromSaleDate": "", //开始消费日期
              "toSaleDate": "", //结束消费日期
              "fromSaleNumbers": "", //开始消费次数
              "toSaleNumbers": "", //结束消费次数
              "fromSaleVal": "", //开始消费金额
              "toSaleVal": "" //结束消费金额
            }
          },
          taskStatus: {
  
          },
          consumeType:0,//消费类型0 消费时间段   1=最后一次消费
          taskDateArray:[],
          birthdayDayArray:[],
          saleDateArray:[],
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
        levalOption: [{
            value: '钻石卡',
            label: '钻石卡'
          },
          {
            value: '金卡',
            label: '金卡'
          },
          {
            value: '银卡',
            label: '银卡'
          },
          {
            value: '普卡',
            label: '普卡'
          },
        ]
      }
    },
    mounted() {
      this.getLevalData()
      this.getDetails()
    },
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
      reset() {
        this.initForm()
      },
      getDetails(){
        apiGetMemberReturnTaskDetails({
          userId: this.userInfo.userCode,
          id: this.currentId
        }).then((res) => {
          let { messageType, messageContent} = JSON.parse(Base64.decode(res.data));
          if (messageType == 'SUCCESS') {
            this.from = messageContent
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
      handleBack() {
  
      },
      
      openSelectGroup() {
        this.isShowSelectGroup = true
      },
      openStore() {
        this.isShowSelectStore = true
      },
      // 所有分组
      getAllGroup(searchContent) {
        let params = {
          "userId": this.userInfo.userCode,
          "page": 0,
          "limit": 10,
          "groupName": searchContent // (可空)
        }
        selectGroupAll(params)
          .then((res) => {
            let data = JSON.parse(Base64.decode(res.data)),
              count = data.count,
              msg = data.data;
            this.count = count;
            this.data = [];
            if (count > 0) {
              msg.map((v, i) => {
                this.$set(v, 'isShowDetail', false)
              })
              this.data = msg;
              this.noData = false;
            } else {
              this.noData = true;
            }
            this.tableLoading = false;
          })
      },
      //任务时间
      changeTaskDate(val) {
        console.log(val)
        this.form.taskDate.taskDateBegin = val[0]
        this.form.taskDate.taskDateEnd = val[1]
      },
      //生日
      changeBirthdayDay(val) {
        console.log(val)
        this.form.customConditions.birthdayDay.fromDate = val[0]
        this.form.customConditions.birthdayDay.toDate = val[1]
      },
      //消费时间
      changeSaleDate(val) {
        console.log(val)
        this.form.customConditions.sales.fromSaleDate = val[0]
        this.form.customConditions.sales.toSaleDate = val[1]
      },
      getLevalData() {
        selectLevalInfo({
          userId: this.userInfo.userCode
        }).then((res) => {
          let data = JSON.parse(Base64.decode(res.data));
          console.log(data.data)
          if (data) {
            this.levalOption = data.data;
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      //选择等级
      handleSelectLeaval(leavalIdArray){
        let nameArray = []
        leavalIdArray.map((v,i)=>{
          let name = this.levalOption.find((n,m)=>{
            return v == n.value
          })
          nameArray.push(name.key)
        })
        this.form.customConditions.levalName = nameArray
      },
      submit() {
        this.form.userId = this.userInfo.userCode
        console.log(this.form)
        this.$refs.form.validate((valid) => {
          if (!valid) return
          this.loading = true;
          if(this.currentId) return this.update()
          this.add()
        })

        // this.form.userId = this.userInfo.userCode
        // console.log(this.form)
        // this.$refs.form.validate((valid) => {
        //   if (!valid) return
        //   this.loading = true;
        //   this.form.memberGroup  = this.selectGroupInfo
        //   this.form.relationObj = this.selectStoreInfo

        // })
      },
      add(){
        apiAddMemberReturnTask(this.form).then((res) => {
          this.loading = false;
          
          let data = JSON.parse(Base64.decode(res.data));
          let result = [];
          if(data.messageType=='SUCCESS') {
            this.$message.success("新增成功");
          // this.$router.push('/work/work-memberReturnVisit')
          } else {
            this.$message({
              message: data.messageContent,
              type: 'warning'
            });
          }
          this.tableLoading = false;
        }).catch((err) => {
          this.loading = false;
          this.$message({
              message: err,
              type: 'warning'
            });
        });
      },
      update(){
        apiUpdateMemberReturnTask(this.form).then((res) => {
          this.loading = false;
          
          let data = JSON.parse(Base64.decode(res.data));
          let result = [];
          if(data.messageType=='SUCCESS') {
            this.$message.success("新增成功");
          this.$router.push('/work/work-memberReturnVisit')
          } else {
            this.$message({
              message: data.messageContent,
              type: 'warning'
            });
          }
          this.tableLoading = false;
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
  .line {
    text-align: center;
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
</style>
