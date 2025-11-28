// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// import CustomerLayout from '@/modules/customer/CustomerLayout.vue'
// import WorkOrderSearch from '@/modules/workorder/WorkOrderSearch.vue'
// import Home from '@/modules/home/home.vue'
import Dashboard from '@/modules/dashboard/dashboard.vue'
import annualBilling from '@/modules/annualbilling/AnnualBilling.vue'
import CustomerLayout from '@/modules/customer/CustomerLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: "/annualbilling",
    name: "AnnualBilling",
    component:annualBilling,
    meta: { title: "Annual Billing" },
  },
  {
  path: "/",
  redirect: "/dashboard"
},
  {
    path: "/dashboard",
    name: "Dashboard",
    component:Dashboard,
    meta: { title: "Dashboard", sidebar: false },
    
  },
  {
    path: '/bfaOrders',
    name: 'WorkOrders',
    component: () => import('@/modules/workorders/WorkOrdersPage.vue'),
    meta: { sidebar: true },
  },
  {
    path: "/bfa/issue",
    name: "IssueBlockFeeAgreement",
    component: CustomerLayout,
    meta: { title: "Issue Block Fee Agreement", sidebar: true },
    props: { nextLayout: "bfa" },
  },
  {
    path: "/bfa/amend",
    name: "AmendBlockFeeAgreement",
    component: CustomerLayout,
    meta: { title: "Amend Block Fee Agreement", sidebar: true },
    props: { nextLayout: "bfa" },
  },
  {
    path: "/bfa/terminate",
    name: "TerminateBlockFeeAgreement",
    component: CustomerLayout,
    meta: { title: "Terminate Block Fee Agreement", sidebar: true },
    props: { nextLayout: "bfa" },
  },
  {
    path: "/bfa/workflow",
    name: "IssueWorkflow",
    meta: { sidebar: true },
    component: () => import("@/modules/stepper/Workflow.vue"),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
