<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import senaiLogo from "../assets/senai.jpg";

const router = useRouter();
const menuAberto = ref(false);

function toggleMenu() {
  menuAberto.value = !menuAberto.value;
}

function fecharMenu() {
  menuAberto.value = false;
}

function logout() {
  localStorage.clear();
  router.push("/login");
}

function irPara(path) {
  router.push(path);
  fecharMenu();
}
</script>

<template>
  <div>
    <header class="navbar">
      <div class="logo-area" @click="irPara('/admin/dashboard')">
        <img :src="senaiLogo" class="logo-img" />
        <span class="logo-text">Reservas</span>
      </div>

      <button class="hamburguer" @click="toggleMenu">☰</button>

      <nav class="menu-desktop">
        <button @click="irPara('/admin/dashboard')">Dashboard</button>
        <button @click="irPara('/admin/usuarios')">Usuários</button>
        <button @click="irPara('/admin/salas')">Salas</button>
        <button @click="irPara('/admin/reservas')">Reservas</button>
        <button class="logout" @click="logout">Sair</button>
      </nav>
    </header>

    <div v-if="menuAberto" class="menu-mobile">
      <button @click="irPara('/admin/dashboard')">Dashboard</button>
      <button @click="irPara('/admin/usuarios')">Usuários</button>
      <button @click="irPara('/admin/salas')">Salas</button>
      <button @click="irPara('/admin/reservas')">Reservas</button>
      <button class="logout" @click="logout">Sair</button>
    </div>

    <main class="conteudo">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.navbar {
  background: #0072ce;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-img {
  height: 34px;
  border-radius: 6px;
  background: white;
  padding: 3px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
}

.menu-desktop {
  display: flex;
  gap: 10px;
}

.menu-desktop button {
  background: transparent;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 8px;
}

.menu-desktop button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.logout {
  background: rgba(255, 255, 255, 0.2) !important;
}

.hamburguer {
  display: none;
  font-size: 22px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
}

.menu-mobile {
  background: #005fa8;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 8px;
}

.menu-mobile button {
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.menu-mobile button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.conteudo {
  padding: 15px;
}

@media (max-width: 768px) {
  .menu-desktop {
    display: none;
  }

  .hamburguer {
    display: block;
  }

  .logo-text {
    font-size: 16px;
  }
}
</style>