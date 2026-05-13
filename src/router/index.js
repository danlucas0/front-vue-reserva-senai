import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "../pages/LoginPage.vue";
import TrocarSenhaPage from "../pages/TrocarSenhaPage.vue";

import AdminLayout from "../layouts/AdminLayout.vue";
import ProfessorLayout from "../layouts/ProfessorLayout.vue";

import AdminDashboard from "../pages/admin/AdminDashboard.vue";
import UsuariosPage from "../pages/admin/UsuariosPage.vue";
import SalasPage from "../pages/admin/SalasPage.vue";
import ReservasPage from "../pages/admin/ReservasPage.vue";

import MinhasReservasPage from "../pages/professor/MinhasReservasPage.vue";
import NovaReservaPage from "../pages/professor/NovaReservaPage.vue";
import SalasDisponiveisPage from "../pages/professor/SalasDisponiveisPage.vue";

const routes = [
  { path: "/", redirect: "/login" },

  { path: "/login", component: LoginPage },

  {
    path: "/trocar-senha",
    component: TrocarSenhaPage,
    meta: { auth: true },
  },

  {
    path: "/admin",
    component: AdminLayout,
    meta: { auth: true, role: "ADMIN" },
    children: [
      { path: "dashboard", component: AdminDashboard },
      { path: "usuarios", component: UsuariosPage },
      { path: "salas", component: SalasPage },
      { path: "reservas", component: ReservasPage },
    ],
  },

  {
    path: "/professor",
    component: ProfessorLayout,
    meta: { auth: true, role: "PROFESSOR" },
    children: [
      { path: "minhas-reservas", component: MinhasReservasPage },
      { path: "nova-reserva", component: NovaReservaPage },
      { path: "salas-disponiveis", component: SalasDisponiveisPage },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (to.meta.auth && !token) {
    return next("/login");
  }

  if (to.meta.role && role !== to.meta.role) {
    return next("/login");
  }

  next();
});

export default router;