<script setup>
import {detail} from '@/api/course/fee'

const open = ref(false)
const monthDate = ref(null)
const feeData = ref([])

function reset() {
}

function show(teacherId, date) {
  let params = {
    teacherId,
    date
  }
  monthDate.value = new Date(date)
  detail(params).then(rsp => {
    feeData.value = rsp.data.data
  })
  open.value = true
}

defineExpose({
  show
})
</script>

<template>
  <el-dialog title="课时明细" v-model="open" width="1200px" append-to-body @closed="reset" class="feeCalendar">
    <el-calendar v-model="monthDate">
      <template #header="{ date }">
        <span>{{ date }}</span>
      </template>
      <template #date-cell="{ data }" disabled="disabled">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-')[2] }}
          <!--          {{ data.isSelected ? '✔️' : '' }}-->
          <br>
          <br>
          <el-tag class="ml-2" type="success" v-if="data.type == 'current-month' && data.day in feeData">
            {{ feeData[data.day] }}课时
          </el-tag>
        </p>
      </template>
    </el-calendar>
  </el-dialog>
</template>

<style scoped lang="scss">
.is-selected {
  color: #1989fa;
}

</style>

<style lang="scss">
.feeCalendar {
  td.next {
    pointer-events: none;
  }

  td.prev {
    pointer-events: none;
  }
}

</style>
