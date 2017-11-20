import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/home'
import Plan from '@/pages/plan/home'
import PlanSub01 from '@/pages/plan/components/sub01'
import PlanSub02 from '@/pages/plan/components/sub02'
import PlanSub03 from '@/pages/plan/components/sub03'
import PlanSub04 from '@/pages/plan/components/sub04'
import PlanSub05 from '@/pages/plan/components/sub05'
import PlanSub06 from '@/pages/plan/components/sub06'
import PlanSub07 from '@/pages/plan/components/sub07'
import PlanSub08 from '@/pages/plan/components/sub08'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    // 应急预案
    path: '/plan',
    name: 'Plan',
    component: Plan
  }, {
    // 应急预案-01
    path: '/plan/sub01',
    name: 'PlanSub01',
    component: PlanSub01
  }, {
    // 应急预案-02
    path: '/plan/sub02',
    name: 'PlanSub02',
    component: PlanSub02
  }, {
    // 应急预案-03
    path: '/plan/sub03',
    name: 'PlanSub03',
    component: PlanSub03
  }, {
    // 应急预案-04
    path: '/plan/sub04',
    name: 'PlanSub04',
    component: PlanSub04
  }, {
    // 应急预案-05
    path: '/plan/sub05',
    name: 'PlanSub05',
    component: PlanSub05
  }, {
    // 应急预案-06
    path: '/plan/sub06',
    name: 'PlanSub06',
    component: PlanSub06
  }, {
    // 应急预案-07
    path: '/plan/sub07',
    name: 'PlanSub07',
    component: PlanSub07
  }, {
    // 应急预案-08
    path: '/plan/sub08',
    name: 'PlanSub08',
    component: PlanSub08
  }]
})
