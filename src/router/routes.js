const routes = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        name: "Auth",
        path: "",
        component: () => import("src/pages/AuthPage.vue"),
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Dashboard",
        path: "",
        component: () => import("src/pages/DashboardPage.vue"),
      },
    ],
  },
  {
    path: "/equipments",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Equipments",
        path: "",
        component: () => import("src/pages/EquipmentsPage.vue"),
      },
    ],
  },
  {
    path: "/departments",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Departments",
        path: "",
        component: () => import("src/pages/DepartmentsPage.vue"),
      },
    ],
  },
  {
    path: "/suppliers",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Suppliers",
        path: "",
        component: () => import("src/pages/SuppliersPage.vue"),
      },
    ],
  },
  {
    path: "/users",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Users",
        path: "",
        component: () => import("src/pages/UsersPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
