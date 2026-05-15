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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },

    { path: "/login", component: LoginPage },
    { path: "/trocar-senha", component: TrocarSenhaPage },

    {
      path: "/admin",
      component: AdminLayout,
      meta: { role: "ADMIN" },
      children: [
        { path: "", redirect: "/admin/dashboard" },
        { path: "dashboard", component: AdminDashboard },
        { path: "usuarios", component: UsuariosPage },
        { path: "salas", component: SalasPage },
        { path: "reservas", component: ReservasPage },
      ],
    },

    {
      path: "/professor",
      component: ProfessorLayout,
      meta: { role: "PROFESSOR" },
      children: [
        { path: "", redirect: "/professor/minhas-reservas" },
        { path: "minhas-reservas", component: MinhasReservasPage },
        { path: "nova-reserva", component: NovaReservaPage },
        { path: "salas", component: SalasDisponiveisPage },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (to.path === "/login") {
    next();
    return;
  }

  if (!token) {
    next("/login");
    return;
  }

  if (to.meta.role && to.meta.role !== role) {
    next("/login");
    return;
  }

  next();
});

export default router;