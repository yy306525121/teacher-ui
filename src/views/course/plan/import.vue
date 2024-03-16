<template>
  <el-dialog :title="title" v-model="open" width="400px" append-to-body>
    <el-upload
      ref="uploadRef"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url + '?updateSupport=1'"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

      <template #tip>
        <div class="el-upload__tip text-center">
          <div class="el-upload__tip">
<!--            <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据-->
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" :loading="upload.isUploading">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance();

const title = ref('课程导入')
const open = ref(false)
const emit = defineEmits(["ok"]);
const upload = reactive({
  headers: { Authorization: "Bearer " + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + "/course/plan/import",
  isUploading: false
})
const headers = { Authorization: "Bearer " + getToken() }

function show() {
  open.value = true
}

const importTemplate = () =>{
  proxy.download("course/plan/importTemplate", {
  }, `plan_template_${new Date().getTime()}.xlsx`);
}

const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

const handleFileSuccess = (response, file, fileList) => {
  open.value = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  emit('ok')
};

function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}

defineExpose({
  show
})
</script>

<style scoped>

</style>
