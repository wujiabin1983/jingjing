<template >
  <el-dialog  title="选择组织" :visible.sync="isShowDialog" :before-close="close" @open="open"  width="800">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="门店" name="first">
        <div class="search">
          <el-cascader :options="optionsProCityAreaPop" :clearable="true" change-on-select  @change="selectChange">
          </el-cascader>
          <el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
          <el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
        </div>
        <el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="selectValueList" :props="{key: 'storeId',label: 'storeName'}" :data="allData">
        </el-transfer>
      </el-tab-pane>
      <el-tab-pane label="店组" name="second">
        <div class="search">
          <el-cascader :options="optionsProCityAreaPop" :clearable="true" change-on-select @change="selectChange">
          </el-cascader>
          <el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
          <el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
        </div>
        <el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="selectValueList" :props="{key: 'storeId',label: 'storeName'}" :data="allData">
        </el-transfer>
      </el-tab-pane>
      <el-tab-pane label="区域" name="third">
        <div class="search">
          <el-cascader :options="optionsProCityAreaPop" :clearable="true" change-on-select  @change="selectChange">
          </el-cascader>
          <el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
          <el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
        </div>
        <el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="selectValueList" :props="{key: 'storeId',label: 'storeName'}" :data="allData">
        </el-transfer>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer overHidden">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { selectProCityArea, selectStoreData, selectTabData,selectGroupInfo, selectLevalInfo ,selectUserGroupName} from '@/api/public'
export default {
  props:{
    isShowDialog:{
      type:Boolean,
      default:true
    },
    selectStoreInfo:{},
  },
  data(){
    return{
      activeName: 'first',
      tabType: '门店',
      allData: [], //搜索门店的值
      selectValueList: [], //选择的值
      titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
      titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
      titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
      optionsProCityArea: [], //主页面省市区数据
      optionsProCityAreaPop: [], //级联选择器省市区数据
      provinceId: '', //弹窗搜索省代码
      cityId: '', //弹窗搜索市代码
      areaId: '', //弹窗搜索区代码
      searchContent: '', //门店名称或编码
    }
  },
  computed:{
    	...mapGetters([
				'userInfo',
			]),
  },
  mounted() {
  },
  methods:{
    close(){
      this.$emit('update:isShowDialog', false)
    },
    open(){
      this.searchStorePop()
    },
    submit(){
      this.$emit('update:isShowDialog', false)
    },
    //点击查询的 选择组织
    searchStorePop() {
      this.handleStoreDialog = true;
      //请求省市区下拉框
      var params = {
        parentId: '1'
      }
      selectProCityArea(params)
        .then((res) => {
          let data = JSON.parse(Base64.decode(res.data));
          //	        		console.log(JSON.stringify(data));
          this.optionsProCityAreaPop=[];
          data.forEach((val, index) => {
            if(val.label == "未知") {
              this.optionsProCityAreaPop.push({
                ...val
              });
            } else {
              this.optionsProCityAreaPop.push({
                children: [],
                ...val
              });
            }
          })
        })
        .catch((err) => {
          // console.log('err');
        })
      this.searchStoreTab();
    },
    //监听tab页
    handleClick(tab, event) {
      this.tabType = event.target.firstChild.data;
      this.allData = [];
      this.selectValueList = [];
      this.dataIndex = [];
      this.searchStoreTab();
    },
    //监听父级选项动态加载省市区数据(弹窗内)
    cascaderSelect(val) {
      if(val.length == 1) {
        let proIndex = val[0];
        let parentId = this.optionsProCityAreaPop[proIndex].key;
        let params = {
          parentId: parentId
        }
        selectProCityArea(params).then((res) => {
          let data = JSON.parse(Base64.decode(res.data));
          this.optionsProCityAreaPop[proIndex].children = [];
          data.forEach((val, index) => {
            if(val.label == "未知") {
              this.optionsProCityAreaPop[proIndex].children.push({
                ...val
              });
            } else {
              this.optionsProCityAreaPop[proIndex].children.push({
                children: [],
                ...val
              });
            }
          })
        })
        .catch((err) => {
          // console.log('err');
        })
      }
      if(val.length == 2) {
        let proIndex = val[0];
        let cityIndex = val[1];
        let parentId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
        let params = {
          parentId: parentId
        }
        selectProCityArea(params)
          .then((res) => {
            let data = JSON.parse(Base64.decode(res.data));
            //					        		console.log(JSON.stringify(data));
            let array = [];
            this.optionsProCityAreaPop[proIndex].children[cityIndex].children = [];
            data.forEach((val, index) => {
              array.push({
                ...val
              });
            })
            this.optionsProCityAreaPop[proIndex].children[cityIndex].children = array;
            //				        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex].children[cityIndex].children))
          })
          .catch((err) => {
            // console.log('err');
          })
      }
    },
    //监听省市区返回值（弹窗）
    selectChange(val) {
      if(val.length == 0) {
        this.provinceId = '';
        this.cityId = '';
        this.areaId = '';
      }
      let proIndex = '';
      let cityIndex = '';
      let areaIndex = '';
      if(val.length == 1) {
        proIndex = val[0];
        this.provinceId = this.optionsProCityAreaPop[proIndex].key;
        this.cityId = '';
        this.areaId = '';
        let params = {
          parentId: this.provinceId
        }
        selectProCityArea(params)
          .then((res) => {
            let data = JSON.parse(Base64.decode(res.data));
            this.optionsProCityAreaPop[proIndex].children = [];
            data.forEach((val, index) => {
              if(val.label == "未知") {
                this.optionsProCityAreaPop[proIndex].children.push({
                  ...val
                });
              } else {
                this.optionsProCityAreaPop[proIndex].children.push({
                  children: [],
                  ...val
                });
              }
            })
          })
          .catch((err) => {
//							console.log(err);
          })
      }
      if(val.length == 2) {
        proIndex = val[0];
        cityIndex = val[1];
        this.provinceId = this.optionsProCityAreaPop[proIndex].key;
        this.cityId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
        this.areaId = '';
        let params = {
          parentId: this.cityId
        }
        selectProCityArea(params)
          .then((res) => {
            let data = JSON.parse(Base64.decode(res.data));
            let array = [];
            this.optionsProCityAreaPop[proIndex].children[cityIndex].children = [];
            data.forEach((val, index) => {
              array.push({
                ...val
              });
            })
            this.optionsProCityAreaPop[proIndex].children[cityIndex].children = array;
          })
          .catch((err) => {
//							console.log(err);
          })
      }
      if(val.length == 3) {
        proIndex = val[0];
        cityIndex = val[1];
        areaIndex = val[2];
        this.provinceId = this.optionsProCityAreaPop[proIndex].key;
        this.cityId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
        this.areaId = this.optionsProCityAreaPop[proIndex].children[cityIndex].children[areaIndex].key;
      }
    },
    //弹窗确认
    enterStore(val) {
      this.handleStoreDialog = false;
    },
    //监听穿梭框事件
    storeArray(val) {
      var idArray = '';
      var nameArray = '';

      this.dataIndex = val;
      this.allData.forEach((data, index) => {
        val.forEach((value, ind) => {
          if(value == data.storeId) {
            idArray += data.storeId + ",";
            nameArray += data.storeName + ",";
          }
        })
      })
      idArray = idArray.substr(0, idArray.length - 1);
      nameArray = nameArray.substr(0, nameArray.length - 1);
      let params = {
        idArray: idArray,
        nameArray: nameArray
      }
      console.log(params)
      
      this.$emit('update:selectStoreInfo',params)
    },
    //门店搜索（tab）
    searchStoreTab() {
      var params = {
        "userId": this.userInfo.userCode,
        "searchContent": this.searchContent,
        "provinceId": this.provinceId,
        "cityId": this.cityId,
        "areaId": this.areaId
      }
      //				console.log(this.tabType);
      if(this.tabType == "门店") {
        params.flag = "1";
      }
      if(this.tabType == "店组") {
        params.flag = "2";
      }
      if(this.tabType == "区域") {
        params.flag = "3";
      }
      //				console.log(params)
      selectTabData(params).then((res) => {
        let data = JSON.parse(Base64.decode(res.data));
        this.allData = [];
        if(data=='') return
        let info = data.data
        if(this.tabType == "门店") {
          info.forEach((val, index) => {
            this.allData.push({
              index: index,
              storeName: val.storeName,
              storeId: val.storeId
            });
          })
        }
        if(this.tabType == "店组") {
          info.forEach((val, index) => {
            this.allData.push({
              index: index,
              storeName: val.storeGroupName,
              storeId: val.storeGroupId
            });
          })
        }
        if(this.tabType == "区域") {
          info.forEach((val, index) => {
            this.allData.push({
              index: index,
              storeName: val.storeAreaName,
              storeId: val.storeAreaId
            });
          })
        }
        //设置默认值
        this.defaultSelectStore()
        
      }).catch((err) => {
        // console.log(err)
      })
    },
    defaultSelectStore(){
      let storeType='门店' //prop
      this.tabType = storeType
      this.selectValueList = []
      if(!this.selectStoreInfo) return
      let idArray = this.selectStoreInfo.idArray.split(',')
      this.selectValueList = idArray
    }
  }
}
</script>
<style lang="scss" scoped>
.activeObj{
  position: absolute;
  left: 300px;
  top: 60px;
  width: 60%;
  height:300px;
  padding-left: 60px;
}
.searchContent {
  width: 160px;
  margin-bottom: 10px;
}
</style>
