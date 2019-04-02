<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark" style="background:#fff;padding-top:10px; padding-left:20px;height:50px;">
          <plmdate></plmdate>
        </div>
      </el-col>
    </el-row>
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import plmDashboard from './admin/PlmIndex'
import plmdate from './admin/components/Plmdate'

export default {
  name: 'dashboard',
  components: { plmDashboard, plmdate },
  data() {
    return {
      currentRole: 'plmDashboard'
    }
  }
}
</script>
