<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark" style="background:#fff;padding-top:10px; padding-left:20px;height:50px;">
          <newmemberdate></newmemberdate>
        </div>
      </el-col>
    </el-row>
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import memberDashboard from './admin/MemIndex'
import newmemberdate from './admin/components/Memdate'

export default {
  name: 'dashboard',
  components: { memberDashboard, newmemberdate },
  data() {
    return {
      currentRole: 'memberDashboard'
    }
  }
}
</script>
