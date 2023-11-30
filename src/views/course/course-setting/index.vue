<template>
  <div class="app-container">
    <el-form ref="formRef" :model="courseSetting" label-width="120px" v-loading="loading">
      <el-form-item label="每周上课天数" prop="dayOfPerWeek">
        <el-input-number v-model="courseSetting.dayOfPerWeek" :min="1" :max="7"/>
      </el-form-item>

      <el-form-item label="晨读课数(节)" prop="sizeOfMorningEarly">
        <el-input-number v-model="courseSetting.sizeOfMorningEarly" :min="1" :max="2"/>
      </el-form-item>

      <el-form-item label="上午课数(节)" prop="sizeOfMorning">
        <el-input-number v-model="courseSetting.sizeOfMorning" :min="1" :max="7"/>
      </el-form-item>

      <el-form-item label="下午课数(节)" prop="sizeOfAfternoon">
        <el-input-number v-model="courseSetting.sizeOfAfternoon" :min="1" :max="7"/>
      </el-form-item>

      <el-form-item label="晚自习课数(节)" prop="sizeOfNight">
        <el-input-number v-model="courseSetting.sizeOfNight" :min="1" :max="7"/>
      </el-form-item>
    </el-form>

      <el-button type="primary" @click="handleSaveOrUpdate">保 存</el-button>
  </div>
</template>

<script setup name="CourseSetting">
import { current, addCourseSetting, updateCourseSetting } from "@/api/course/course-setting";

const { proxy } = getCurrentInstance();

const loading = ref(false)

const courseSetting = reactive({
  id: '',
  dayOfPerWeek: '',
  sizeOfMorningEarly: '',
  sizeOfMorning: '',
  sizeOfAfternoon: '',
  sizeOfNight: ''
})

function getCurrentSetting() {
  loading.value = true;
  current().then(response => {
    if (response.data) {
      const data = response.data
      courseSetting.id = data.id
      courseSetting.dayOfPerWeek = data.dayOfPerWeek
      courseSetting.sizeOfMorningEarly = data.sizeOfMorningEarly
      courseSetting.sizeOfMorning = data.sizeOfMorning
      courseSetting.sizeOfAfternoon = data.sizeOfAfternoon
      courseSetting.sizeOfNight = data.sizeOfNight
    }
    loading.value = false;
  })
}

function save() {
  addCourseSetting(courseSetting).then(response => {
    proxy.$modal.msgSuccess("保存成功");
  })
}

function update() {
  updateCourseSetting(courseSetting).then(response => {
    proxy.$modal.msgSuccess("保存成功");
  })
}

function handleSaveOrUpdate() {
  loading.value = true
  if (courseSetting.id) {
    update()
  } else {
    save()
  }
  loading.value = false
}

getCurrentSetting()
</script>

<style scoped>

</style>
