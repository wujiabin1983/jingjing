<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark" style="background:#fff;padding-top:10px; padding-left:20px;height:50px;">
          <wjbdate></wjbdate>
        </div>
      </el-col>
    </el-row>
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import adminDashboard from './admin'
import wjbdate from './admin/components/Salesdate'

export default {
  name: 'dashboard',
  components: { adminDashboard, wjbdate },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  }
}
</script>
