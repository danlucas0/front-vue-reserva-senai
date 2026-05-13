<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function logout() {
  localStorage.clear();
  router.push("/login");
}
</script>

<template>
  <div>
    <nav class="navbar">
      <div class="logo">
        SEN<span class="dot">A</span>I Reservas
      </div>

      <div class="links">
        <router-link to="/admin/dashboard">Dashboard</router-link>
        <router-link to="/admin/usuarios">Usuários</router-link>
        <router-link to="/admin/salas">Salas</router-link>
        <router-link to="/admin/reservas">Reservas</router-link>
        <router-link to="/trocar-senha">Senha</router-link>
        <button @click="logout">Sair</button>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.navbar {
  background: white;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 2px solid #ddd;
}

.logo {
  font-weight: bold;
  font-size: 20px;
}

.dot {
  color: orange;
  font-weight: bold;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.links a {
  text-decoration: none;
  font-weight: bold;
  color: #333;
}

.links button {
  border: none;
  background: red;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.container {
  padding: 20px;
}
</style>