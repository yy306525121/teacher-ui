<script setup name="CoursePlan">
import { list as listCoursePlan } from '@/api/course/plan'
import { list as listTeacher } from '@/api/course/teacher'
import { tree } from "@/api/course/class";
import PlanImport from './import.vue'

const {proxy} = getCurrentInstance();
const {plan_query_type} = proxy.useDict("plan_query_type");

const importRef = ref(null)

const loading = ref(false)

const gradeList = ref([])
const teacherList = ref([])
const showSearch = ref(true);


const coursePlanList = ref([])
const props = {
  label: 'name',
  value: 'id',
  children: 'children',
}


const data = reactive({
  queryParams: {
    queryType: '1',
    classInfoId: undefined
  }
})
const {queryParams} = toRefs(data);


function objectSpanMethod({
                            row,
                            column,
                            rowIndex,
                            columnIndex,
                          }) {
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return {
        rowspan: 1,
        colspan: 1
      }
    } else if (rowIndex === 1) {
      return {
        rowspan: 5,
        colspan: 1
      }
    } else if (rowIndex === 6) {
      return {
        rowspan: 4,
        colspan: 1
      }
    } else if (rowIndex === 10) {
      return {
        rowspan: 2,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

function getGradeTree() {
  tree().then(response => {
    gradeList.value = response.data
  })
}

function getAllTeacher() {
  listTeacher().then(rsp => {
    teacherList.value = rsp.data
  })
}

function getList() {
  listCoursePlan(queryParams.value).then(rsp => {
    const dataList = rsp.data
    dataList.forEach(function(item) {

      coursePlanList.value.filter(obj => obj.sort === item.timeSlot.sortInDay).forEach(obj => {
        if (item.dayOfWeek === 1) {
          obj.monday = getCourseStr(item)
        } else if (item.dayOfWeek === 2) {
          obj.tuesday = getCourseStr(item)
        } else if (item.dayOfWeek === 3) {
          obj.wednesday = getCourseStr(item)
        } else if (item.dayOfWeek === 4) {
          obj.thursday = getCourseStr(item)
        } else if (item.dayOfWeek === 5) {
          obj.friday = getCourseStr(item)
        } else if (item.dayOfWeek === 6) {
          obj.saturday = getCourseStr(item)
        } else if (item.dayOfWeek === 7) {
          obj.weekday = getCourseStr(item)
        }
      })

    })
  })
}

function resetCoursePlanList() {
  coursePlanList.value = [
    {duration: '早自习', sort: 1, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '上午', sort: 2, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '上午', sort: 3, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '上午', sort: 4, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '上午', sort: 5, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '上午', sort: 6, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '下午', sort: 7, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '下午', sort: 8, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '下午', sort: 9, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '下午', sort: 10, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '夜自习', sort: 11, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''},
    {duration: '夜自习', sort: 12, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', weekday: ''}
  ]
}

function getCourseStr(item) {
  if (item.courseType.type === 1) {
    // 正常课时
    return [item.subject.name,item.teacher.name]
  } else if (item.courseType.type === 2 || item.courseType.type === 4){
    // 自习课
    return item.teacher.name
  } else if (item.courseType.type === 3) {
    return item.subject.name
  }
}

function handleQuery() {
  resetCoursePlanList()
  getList()
}

function handleImport() {
  importRef.value.show()
}

function resetQuery() {
  proxy.resetForm("queryRef");
  resetCoursePlanList()
}

getGradeTree()
getAllTeacher()
resetCoursePlanList()
</script>

<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="查询方式" prop="classInfoId">
        <el-select v-model="queryParams.queryType" placeholder="请选择" clearable style="width: 200px">
          <el-option
              v-for="dict in plan_query_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年级" prop="classInfoId" v-if="queryParams.queryType === '1'">
        <el-tree-select v-model="queryParams.classInfoId" :data="gradeList" :props="props"
                        :render-after-expand="false" default-expand-all/>
      </el-form-item>
      <el-form-item label="教师" prop="teacherId" v-if="queryParams.queryType === '2'">
        <el-select v-model="queryParams.teacherId" placeholder="请选择" clearable style="width: 200px" filterable>
          <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleImport"
            v-hasPermi="['course:coursePlan:import']"
        >导入
        </el-button>
      </el-col>
    </el-row>

    <plan-import ref="importRef" @ok="getList"/>

    <el-table v-loading="loading" :span-method="objectSpanMethod" :data="coursePlanList" :border="true">
      <el-table-column label="时间" align="center" prop="duration"/>
      <el-table-column label="节次" align="center" prop="sort">
        <template #default="scope">
          第{{scope.row.sort}}节
        </template>
      </el-table-column>
      <el-table-column label="星期一" align="center" prop="monday">
        <template #default="scope">
          <span v-if="Array.isArray(scope.row.monday) && scope.row.monday.length === 2">
            {{scope.row.monday[0]}}
            <br>
            {{scope.row.monday[1]}}
          </span>
          <span v-else>
            {{scope.row.monday}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="星期二" align="center" prop="tuesday">
        <template #default="scope">
          <span v-if="Array.isArray(scope.row.tuesday) && scope.row.tuesday.length === 2">
            {{scope.row.tuesday[0]}}
            <br>
            {{scope.row.tuesday[1]}}
          </span>
          <span v-else>
            {{scope.row.tuesday}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="星期三" align="center" prop="wednesday">
        <template #default="scope">
          <span v-if="Array.isArray(scope.row.wednesday) && scope.row.wednesday.length === 2">
            {{scope.row.wednesday[0]}}
            <br>
            {{scope.row.wednesday[1]}}
          </span>
          <span v-else>
            {{scope.row.wednesday}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="星期四" align="center" prop="thursday">
        <template #default="scope">
          <span v-if="Array.isArray(scope.row.thursday) && scope.row.thursday.length === 2">
            {{scope.row.thursday[0]}}
            <br>
            {{scope.row.thursday[1]}}
          </span>
          <span v-else>
            {{scope.row.thursday}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="星期五" align="center" prop="friday">
        <template #default="scope">
          <span v-if="Array.isArray(scope.row.friday) && scope.row.friday.length === 2">
            {{scope.row.friday[0]}}
            <br>
            {{scope.row.friday[1]}}
          </span>
          <span v-else>
            {{scope.row.friday}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="星期六" align="center" prop="saturday">
        <template #default="scope">
          <span v-if="Array.isArray(scope.row.saturday) && scope.row.saturday.length === 2">
            {{scope.row.saturday[0]}}
            <br>
            {{scope.row.saturday[1]}}
          </span>
          <span v-else>
            {{scope.row.saturday}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="星期日" align="center" prop="weekday">
        <template #default="scope">
          <span v-if="Array.isArray(scope.row.weekday) && scope.row.weekday.length === 2">
            {{scope.row.weekday[0]}}
            <br>
            {{scope.row.weekday[1]}}
          </span>
          <span v-else>
            {{scope.row.weekday}}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">

</style>
