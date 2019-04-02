<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="会员等级" show-overflow-tooltip>
      <template slot-scope="scope">
        <el-tag :type="scope.row.cardtype | statusFilter"> {{scope.row.cardtype}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="会员人数" show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.renshu}}人
      </template>
    </el-table-column>
    <el-table-column label="销售收入" show-overflow-tooltip>
      <template slot-scope="scope">
        ¥{{scope.row.shouru}}
      </template>
    </el-table-column>
    <el-table-column label="项献占比"  align="center">
      <template slot-scope="scope">
        {{scope.row.zhanbi}}
      </template>
    </el-table-column>
    <el-table-column label="客单价"  align="center">
      <template slot-scope="scope">
        ¥{{scope.row.kedian}}
      </template>
    </el-table-column>
    <el-table-column label="件单价"  align="center">
      <template slot-scope="scope">
        ¥{{scope.row.jiandian}}
      </template>
    </el-table-column>
    <el-table-column label="连带率"  align="center">
      <template slot-scope="scope">
        {{scope.row.liandai}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/transaction'

export default {
  data() {
    return {
      list: [{
			    "cardtype": "钻石卡",
			    "renshu": "1231",
			    "shouru": "229000",
			    "zhanbi": "15%",
			    "kedian": "2350",
			    "jiandian": "1999",
			    "liandai": "2.1"
			},{
			    "cardtype": "金卡",
			    "renshu": "2741",
			    "shouru": "139712",
			    "zhanbi": "25%",
			    "kedian": "1590",
			    "jiandian": "1299",
			    "liandai": "1.5"
			},{
			    "cardtype": "银卡",
			    "renshu": "5631",
			    "shouru": "338871",
			    "zhanbi": "35%",
			    "kedian": "899",
			    "jiandian": "699",
			    "liandai": "1.5"
			},{
			    "cardtype": "普卡",
			    "renshu": "5432",
			    "shouru": "987265",
			    "zhanbi": "40%",
			    "kedian": "699",
			    "jiandian": "399",
			    "liandai": "1.8"
			}]
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '钻石卡': 'danger',
        '金卡': 'warning',
        '银卡': '',
        '普卡': 'success'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
//    fetchList().then(response => {
//      this.list = response.data.returnMsg.slice(0, 4)
//    })
    }
  }
}
</script>
