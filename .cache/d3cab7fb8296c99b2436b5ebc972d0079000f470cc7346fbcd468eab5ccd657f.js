{"source":"webpackJsonp([308],{WJAc:function(e,t,a){\"use strict\";t.a=function(e){var t=Base64.encode(i()(e));return a.i(n.a)({url:\"/I_SCRM_INTERFACE_665.action\",method:\"post\",data:t})},t.b=function(e){var t=Base64.encode(i()(e));return a.i(n.a)({url:\"/I_SCRM_INTERFACE_666.action\",method:\"post\",data:t})},t.c=function(e){var t=Base64.encode(i()(e));return a.i(n.a)({url:\"/I_SCRM_INTERFACE_667.action\",method:\"post\",data:t})},t.d=function(e){var t=Base64.encode(i()(e));return a.i(n.a)({url:\"/I_SCRM_INTERFACE_668.action\",method:\"post\",data:t})};var o=a(\"3cXf\"),i=a.n(o),n=a(\"Vo7i\")},X3jx:function(e,t){},heK1:function(e,s,c){\"use strict\";(function(t){var e=c(\"4YfN\"),r=c.n(e),o=c(\"E4LH\"),n=c(\"WJAc\"),a=c(\"lQSI\"),l=c(\"0w2Z\"),i=function(e,t,a){\"\"!=t?c.i(o.e)(t)?a():a(new Error(\"请输入有效数字\")):a()};s.a={data:function(){return{handleTabDialog:!1,storeArr:\"\",tabType:\"门店\",provinceId:\"\",cityId:\"\",areaId:\"\",searchContent:\"\",titleDataStore:[\"未选择门店\",\"已选择门店\"],titleDataGroup:[\"未选择店组\",\"已选择店组\"],titleDataArea:[\"未选择区域\",\"已选择区域\"],dataIndex:[],data2:[],value2:[],optionsProCityAreaPop:[],activeName:\"first\",pageType:\"添加\",clickType:\"默认\",tableDataBrand:[],tableDataStore:[],tableBrandLoading:!1,tableStoreLoading:!1,addLoading:!1,dialogVisible:!1,posLoading:!1,form:{discount:\"\",levelName:\"\",levelId:\"\",storeName:\"\",storeId:\"\"},noRules:{},rules:{storeName:[{required:!0,message:\"请选择门店\",trigger:\"change\"}],levelName:[{required:!0,message:\"请选择等级\",trigger:\"change\"}],discount:[{required:!0,message:\"请输入折扣\",trigger:\"change\"},{validator:i}]},levalOption:[],page:0,count:0,limit:this.GLOBAL.limit}},methods:{handleBrandAdd:function(){this.form={discount:\"\",levelName:\"\",levelId:\"\",storeName:\"\",storeId:\"\"},this.selectLevalInfo(),this.clickType=\"默认\",this.pageType=\"添加\",this.dialogVisible=!0},handleStoreAdd:function(){this.form={discount:\"\",levelName:\"\",levelId:\"\",storeName:\"\",storeId:\"\"},this.selectLevalInfo(),this.clickType=\"门店\",this.pageType=\"添加\",this.storeArr=\"\",this.data2=[],this.value2=[],this.dialogVisible=!0},showTable:function(e,t){var i=this,a={userId:this.userInfo.userCode,page:e,limit:t};this.tableStoreLoading=!0,this.tableBrandLoading=!0,c.i(n.a)(a).then(function(e){var t=JSON.parse(Base64.decode(e.data)),a=[],o=[];\"SUCCESS\"==t.messageType?(t.messageContent.forEach(function(e,t){\"\"!=e.storeName?a.push(r()({},e)):o.push(r()({},e))}),i.clickType=\"门店\",i.tableDataStore=a,i.tableDataBrand=o):i.$message({message:t.messageContent,type:\"warning\"}),i.tableStoreLoading=!1,i.tableBrandLoading=!1}).catch(function(e){i.tableStoreLoading=!1,i.tableBrandLoading=!1})},handleSure:function(e){var a=this,o=this;this.$refs[e].validate(function(e){if(e)if(a.addLoading=!0,\"添加\"==a.pageType){var t=r()({userId:a.userInfo.userCode},a.form);c.i(n.b)(t).then(function(e){var t=JSON.parse(Base64.decode(e.data));\"SUCCESS\"==t.messageType?(o.addLoading=!1,o.dialogVisible=!1,o.showTable(o.page,o.limit),o.$message.success(t.messageContent)):(o.addLoading=!1,o.$message.warning(t.messageContent))}).catch(function(e){o.addLoading=!1,o.dialogVisible=!1})}else if(\"修改\"==a.pageType){t=r()({userId:a.userInfo.userCode},a.form);c.i(n.c)(t).then(function(e){var t=JSON.parse(Base64.decode(e.data));\"SUCCESS\"==t.messageType?(o.addLoading=!1,o.showTable(o.page,o.limit),o.$message.success(t.messageContent),o.dialogVisible=!1):(o.addLoading=!1,o.$message.warning(t.messageContent))}).catch(function(e){o.addLoading=!1})}})},iconShanchu:function(e,t){var a=this,o=this;this.tableLoading=!0,this.$confirm(\"您确定要删除吗, 是否继续?\",\"提示\",{confirmButtonText:\"确定\",cancelButtonText:\"取消\",type:\"warning\"}).then(function(){var e={userId:a.userInfo.userCode,id:t.id};c.i(n.d)(e).then(function(e){var t=JSON.parse(Base64.decode(e.data));\"SUCCESS\"==t.messageType?o.$message.success(t.messageContent):o.$message.error(t.messageContent),o.tableLoading=!1,o.showTable(o.page,o.limit)}).catch(function(e){o.tableLoading=!1})}).catch(function(){o.tableLoading=!1})},iconXiugaiBrand:function(e,t){this.form=t,this.pageType=\"修改\",this.clickType=\"默认\",this.dialogVisible=!0},iconXiugaiStore:function(e,t){var a=this;this.form=t,this.pageType=\"修改\",this.clickType=\"门店\",this.dialogVisible=!0,this.storeArr=this.form.storeName;var o=this.form.storeId.split(\",\"),i=this.form.storeName.split(\",\");this.value2=o,this.data2=[],o.forEach(function(e,t){a.data2.push({storeName:\"\",storeId:e})}),i.forEach(function(e,t){a.data2[t].storeName=e})},iconChakanBrand:function(e,t){this.form=t,this.pageType=\"查看\",this.clickType=\"默认\",this.dialogVisible=!0},selectLevalInfo:function(){var a=this,e={userId:this.userInfo.userCode};c.i(l.d)(e).then(function(e){var t=JSON.parse(Base64.decode(e.data));\"\"!=t&&(a.levalOption=t.data)}).catch(function(e){})},iconChakanStore:function(e,t){this.form=t,this.pageType=\"查看\",this.clickType=\"门店\",this.dialogVisible=!0},levalChange:function(e){var t=this.levalOption[e];this.form.levelName=t.key,this.form.levelId=t.value},storeClick:function(){var a=this;this.handleTabDialog=!0;c.i(l.b)({parentId:\"1\"}).then(function(e){var t=JSON.parse(Base64.decode(e.data));a.optionsProCityAreaPop=[],t.forEach(function(e,t){\"未知\"==e.label?a.optionsProCityAreaPop.push(r()({},e)):a.optionsProCityAreaPop.push(r()({children:[]},e))})}).catch(function(e){})},handleClick:function(e,t){this.tabType=t.target.firstChild.data,this.data2=[],this.value2=[],this.dataIndex=[],this.searchStoreTab()},cascaderSelect:function(e){var o=this;if(1==e.length){var a=e[0],t={parentId:this.optionsProCityAreaPop[a].key};c.i(l.b)(t).then(function(e){var t=JSON.parse(Base64.decode(e.data));o.optionsProCityAreaPop[a].children=[],t.forEach(function(e,t){\"未知\"==e.label?o.optionsProCityAreaPop[a].children.push(r()({},e)):o.optionsProCityAreaPop[a].children.push(r()({children:[]},e))})}).catch(function(e){})}if(2==e.length){var i=e[0],n=e[1],s={parentId:this.optionsProCityAreaPop[i].children[n].key};c.i(l.b)(s).then(function(e){var t=JSON.parse(Base64.decode(e.data)),a=[];o.optionsProCityAreaPop[i].children[n].children=[],t.forEach(function(e,t){a.push(r()({},e))}),o.optionsProCityAreaPop[i].children[n].children=a}).catch(function(e){})}},selectChange:function(e){var o=this;0==e.length&&(this.provinceId=\"\",this.cityId=\"\",this.areaId=\"\");var i=\"\",n=\"\",t=\"\";if(1==e.length){i=e[0],this.provinceId=this.optionsProCityAreaPop[i].key,this.cityId=\"\",this.areaId=\"\";var a={parentId:this.provinceId};c.i(l.b)(a).then(function(e){var t=JSON.parse(Base64.decode(e.data));o.optionsProCityAreaPop[i].children=[],t.forEach(function(e,t){\"未知\"==e.label?o.optionsProCityAreaPop[i].children.push(r()({},e)):o.optionsProCityAreaPop[i].children.push(r()({children:[]},e))})}).catch(function(e){})}if(2==e.length){i=e[0],n=e[1],this.provinceId=this.optionsProCityAreaPop[i].key,this.cityId=this.optionsProCityAreaPop[i].children[n].key,this.areaId=\"\";var s={parentId:this.cityId};c.i(l.b)(s).then(function(e){var t=JSON.parse(Base64.decode(e.data)),a=[];o.optionsProCityAreaPop[i].children[n].children=[],t.forEach(function(e,t){a.push(r()({},e))}),o.optionsProCityAreaPop[i].children[n].children=a}).catch(function(e){})}3==e.length&&(i=e[0],n=e[1],t=e[2],this.provinceId=this.optionsProCityAreaPop[i].key,this.cityId=this.optionsProCityAreaPop[i].children[n].key,this.areaId=this.optionsProCityAreaPop[i].children[n].children[t].key)},enterStore:function(e){this.handleTabDialog=!1},storeArray:function(t){var o=\"\",i=\"\";this.data2.forEach(function(a,e){t.forEach(function(e,t){a.storeId==e&&(o+=a.storeId+\",\",i+=a.storeName+\",\")})}),i=i.substr(0,i.length-1),o=o.substr(0,o.length-1),this.form.storeId=o,this.storeArr=i,this.form.storeName=i},searchStoreTab:function(){var a=this,e={userId:this.userInfo.userCode,searchContent:this.searchContent,provinceId:this.provinceId,cityId:this.cityId,areaId:this.areaId};\"门店\"==this.tabType&&(e.flag=\"1\"),\"店组\"==this.tabType&&(e.flag=\"2\"),\"区域\"==this.tabType&&(e.flag=\"3\"),c.i(l.c)(e).then(function(e){var t=JSON.parse(Base64.decode(e.data));a.data2=[],\"\"!=t&&(\"门店\"==a.tabType&&t.data.forEach(function(e,t){a.data2.push({storeName:e.storeName,storeId:e.storeId})}),\"店组\"==a.tabType&&t.data.forEach(function(e,t){a.data2.push({storeName:e.storeGroupName,storeId:e.storeGroupId})}),\"区域\"==a.tabType&&t.data.forEach(function(e,t){a.data2.push({storeName:e.storeAreaName,storeId:e.storeAreaId})}))}).catch(function(e){}),t(\"#transfer\").show()}},created:function(){this.showTable(this.page,this.limit)},computed:r()({},c.i(a.a)([\"userInfo\"]))}}).call(s,c(\"L7Pj\"))},lT2k:function(e,t,a){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0});var o=a(\"heK1\"),i=a(\"rjyv\");var n=function(e){a(\"X3jx\")},s=a(\"J0+h\")(o.a,i.a,n,\"data-v-d68c59a6\",null);t.default=s.exports},rjyv:function(e,t,a){\"use strict\";var o={render:function(){var a=this,e=a.$createElement,o=a._self._c||e;return o(\"div\",{staticClass:\"container\"},[o(\"el-card\",[o(\"el-main\",[o(\"h4\",[a._v(\"\\n\\t\\t\\t\\t\\t默认配置\\n\\t\\t\\t\\t\\t\"),o(\"el-button\",{staticClass:\"floatRight\",attrs:{type:\"primary\"},on:{click:a.handleBrandAdd}},[a._v(\"添加\")])],1),a._v(\" \"),o(\"el-table\",{directives:[{name:\"loading\",rawName:\"v-loading\",value:a.tableBrandLoading,expression:\"tableBrandLoading\"}],ref:\"tableDataBrand\",attrs:{data:a.tableDataBrand}},[o(\"el-table-column\",{attrs:{prop:\"levelName\",label:\"等级\"}}),a._v(\" \"),o(\"el-table-column\",{attrs:{prop:\"discount\",label:\"折扣（%）\"}}),a._v(\" \"),o(\"el-table-column\",{attrs:{prop:\"action\",label:\"操作\"},scopedSlots:a._u([{key:\"default\",fn:function(t){return[o(\"el-tooltip\",{staticClass:\"item\",attrs:{content:\"查看\",placement:\"top\"}},[o(\"i\",{staticClass:\"iconfont icon-view\",on:{click:function(e){e.preventDefault(),a.iconChakanBrand(t.$index,t.row)}}})]),a._v(\" \"),o(\"el-tooltip\",{staticClass:\"item\",attrs:{content:\"修改\",placement:\"top\"}},[o(\"i\",{staticClass:\"iconfont icon-edit\",on:{click:function(e){e.preventDefault(),a.iconXiugaiBrand(t.$index,t.row)}}})]),a._v(\" \"),o(\"el-tooltip\",{staticClass:\"item\",attrs:{content:\"删除\",placement:\"top\"}},[o(\"i\",{staticClass:\"iconfont icon-delete\",on:{click:function(e){e.preventDefault(),a.iconShanchu(t.$index,t.row)}}})])]}}])})],1),a._v(\" \"),o(\"h4\",{staticClass:\"marginTop10\"},[a._v(\"\\n\\t\\t\\t\\t\\t按门店配置\\n\\t\\t\\t\\t\\t\"),o(\"el-button\",{staticClass:\"floatRight\",attrs:{type:\"primary\"},on:{click:a.handleStoreAdd}},[a._v(\"添加\")])],1),a._v(\" \"),o(\"el-table\",{directives:[{name:\"loading\",rawName:\"v-loading\",value:a.tableStoreLoading,expression:\"tableStoreLoading\"}],ref:\"tableDataStore\",attrs:{data:a.tableDataStore}},[o(\"el-table-column\",{attrs:{prop:\"storeName\",label:\"门店\"}}),a._v(\" \"),o(\"el-table-column\",{attrs:{prop:\"levelName\",label:\"等级\"}}),a._v(\" \"),o(\"el-table-column\",{attrs:{prop:\"discount\",label:\"折扣（%）\"}}),a._v(\" \"),o(\"el-table-column\",{attrs:{prop:\"action\",label:\"操作\"},scopedSlots:a._u([{key:\"default\",fn:function(t){return[o(\"el-tooltip\",{staticClass:\"item\",attrs:{content:\"查看\",placement:\"top\"}},[o(\"i\",{staticClass:\"iconfont icon-view\",on:{click:function(e){e.preventDefault(),a.iconChakanStore(t.$index,t.row)}}})]),a._v(\" \"),o(\"el-tooltip\",{staticClass:\"item\",attrs:{content:\"修改\",placement:\"top\"}},[o(\"i\",{staticClass:\"iconfont icon-edit\",on:{click:function(e){e.preventDefault(),a.iconXiugaiStore(t.$index,t.row)}}})]),a._v(\" \"),o(\"el-tooltip\",{staticClass:\"item\",attrs:{content:\"删除\",placement:\"top\"}},[o(\"i\",{staticClass:\"iconfont icon-delete\",on:{click:function(e){e.preventDefault(),a.iconShanchu(t.$index,t.row)}}})])]}}])})],1),a._v(\" \"),o(\"el-dialog\",{directives:[{name:\"loading\",rawName:\"v-loading\",value:a.addLoading,expression:\"addLoading\"}],attrs:{title:this.pageType,visible:a.dialogVisible,width:\"35%\"},on:{\"update:visible\":function(e){a.dialogVisible=e}}},[o(\"el-form\",{directives:[{name:\"loading\",rawName:\"v-loading\",value:a.posLoading,expression:\"posLoading\"}],ref:\"form\",attrs:{model:a.form,rules:\"查看\"!=this.pageType?a.rules:a.noRules,\"label-width\":\"60px\"}},[\"默认\"!=a.clickType&&\"查看\"!=this.pageType?o(\"el-form-item\",{attrs:{label:\"门店\",prop:\"storeName\"}},[o(\"el-input\",{staticClass:\"dsh-input\",attrs:{placeholder:\"请选择\",readonly:\"readonly\"},model:{value:a.storeArr,callback:function(e){a.storeArr=e},expression:\"storeArr\"}}),a._v(\" \"),o(\"el-button\",{staticClass:\"dsh-input-button\",attrs:{type:\"primary\"},on:{click:a.storeClick}},[a._v(\"选择\")])],1):a._e(),a._v(\" \"),\"默认\"!=a.clickType&&\"查看\"==this.pageType?o(\"el-form-item\",{attrs:{label:\"门店\",prop:\"storeName\"}},[o(\"el-input\",{attrs:{placeholder:\"请输入\",readonly:\"readonly\"},model:{value:a.form.storeName,callback:function(e){a.$set(a.form,\"storeName\",e)},expression:\"form.storeName\"}})],1):a._e(),a._v(\" \"),o(\"el-form-item\",{attrs:{label:\"等级\",prop:\"levelName\"}},[\"查看\"==this.pageType?o(\"el-input\",{attrs:{disabled:\"查看\"==this.pageType,placeholder:\"请输入等级\",value:a.form.levelName}}):o(\"el-select\",{staticClass:\"width100\",attrs:{filterable:\"\",placeholder:\"请选择\"},on:{change:a.levalChange},model:{value:a.form.levelName,callback:function(e){a.$set(a.form,\"levelName\",e)},expression:\"form.levelName\"}},a._l(a.levalOption,function(e){return o(\"el-option\",{key:e.key,attrs:{label:e.key,value:e.index}})}),1)],1),a._v(\" \"),o(\"el-form-item\",{attrs:{label:\"折扣\",prop:\"discount\"}},[o(\"el-input\",{attrs:{placeholder:\"请输入折扣\",disabled:\"查看\"==this.pageType},model:{value:a.form.discount,callback:function(e){a.$set(a.form,\"discount\",e)},expression:\"form.discount\"}})],1)],1),a._v(\" \"),o(\"span\",{staticClass:\"dialog-footer\",attrs:{slot:\"footer\"},slot:\"footer\"},[\"查看\"==a.pageType?o(\"el-button\",{on:{click:function(e){a.dialogVisible=!1}}},[a._v(\"关 闭\")]):a._e(),a._v(\" \"),\"修改\"==a.pageType||\"添加\"==a.pageType?o(\"el-button\",{on:{click:function(e){a.dialogVisible=!1}}},[a._v(\"取 消\")]):a._e(),a._v(\" \"),\"修改\"==a.pageType||\"添加\"==a.pageType?o(\"el-button\",{attrs:{type:\"primary\"},on:{click:function(e){a.handleSure(\"form\")}}},[a._v(\"确 定\")]):a._e()],1)],1),a._v(\" \"),o(\"el-dialog\",{staticClass:\"transfer\",attrs:{title:\"\",visible:a.handleTabDialog},on:{\"update:visible\":function(e){a.handleTabDialog=e}}},[[o(\"el-tabs\",{on:{\"tab-click\":a.handleClick},model:{value:a.activeName,callback:function(e){a.activeName=e},expression:\"activeName\"}},[o(\"el-tab-pane\",{attrs:{label:\"门店\",name:\"first\"}},[o(\"div\",{staticClass:\"search\"},[o(\"el-cascader\",{attrs:{options:a.optionsProCityAreaPop,\"change-on-select\":\"\",clearable:!0},on:{change:a.selectChange}}),a._v(\" \"),o(\"el-input\",{staticClass:\"searchContent\",attrs:{placeholder:\"请输入门店编号或门店名称\"},model:{value:a.searchContent,callback:function(e){a.searchContent=e},expression:\"searchContent\"}}),a._v(\" \"),o(\"el-button\",{attrs:{type:\"primary\",id:\"search\"},on:{click:a.searchStoreTab}},[a._v(\"搜索\")])],1),a._v(\" \"),o(\"el-transfer\",{attrs:{filterable:!1,titles:a.titleDataStore,props:{key:\"storeId\",label:\"storeName\"},data:a.data2},on:{change:a.storeArray},model:{value:a.value2,callback:function(e){a.value2=e},expression:\"value2\"}})],1),a._v(\" \"),o(\"el-tab-pane\",{attrs:{label:\"店组\",name:\"second\"}},[o(\"div\",{staticClass:\"search\"},[o(\"el-cascader\",{attrs:{options:a.optionsProCityAreaPop,\"change-on-select\":\"\",clearable:!0},on:{change:a.selectChange}}),a._v(\" \"),o(\"el-input\",{staticClass:\"searchContent\",attrs:{placeholder:\"请输入店组编号或店组名称\"},model:{value:a.searchContent,callback:function(e){a.searchContent=e},expression:\"searchContent\"}}),a._v(\" \"),o(\"el-button\",{attrs:{type:\"primary\",id:\"search\"},on:{click:a.searchStoreTab}},[a._v(\"搜索\")])],1),a._v(\" \"),o(\"el-transfer\",{attrs:{filterable:!1,titles:a.titleDataGroup,props:{key:\"storeId\",label:\"storeName\"},data:a.data2},on:{change:a.storeArray},model:{value:a.value2,callback:function(e){a.value2=e},expression:\"value2\"}})],1),a._v(\" \"),o(\"el-tab-pane\",{attrs:{label:\"区域\",name:\"third\"}},[o(\"div\",{staticClass:\"search\"},[o(\"el-cascader\",{attrs:{options:a.optionsProCityAreaPop,\"change-on-select\":\"\",clearable:!0},on:{change:a.selectChange}}),a._v(\" \"),o(\"el-input\",{staticClass:\"searchContent\",attrs:{placeholder:\"请输入区域编号或区域名称\"},model:{value:a.searchContent,callback:function(e){a.searchContent=e},expression:\"searchContent\"}}),a._v(\" \"),o(\"el-button\",{attrs:{type:\"primary\",id:\"search\"},on:{click:a.searchStoreTab}},[a._v(\"搜索\")])],1),a._v(\" \"),o(\"el-transfer\",{attrs:{filterable:!1,titles:a.titleDataArea,props:{key:\"storeId\",label:\"storeName\"},data:a.data2},on:{change:a.storeArray},model:{value:a.value2,callback:function(e){a.value2=e},expression:\"value2\"}})],1)],1)],a._v(\" \"),o(\"div\",{staticClass:\"dialog-footer\",attrs:{slot:\"footer\"},slot:\"footer\"},[o(\"el-button\",{on:{click:function(e){a.handleTabDialog=!1}}},[a._v(\"取 消\")]),a._v(\" \"),o(\"el-button\",{attrs:{type:\"primary\"},on:{click:a.enterStore}},[a._v(\"确 定\")])],1)],2)],1)],1)],1)},staticRenderFns:[]};t.a=o}});"}