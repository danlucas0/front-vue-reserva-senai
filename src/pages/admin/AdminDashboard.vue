<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";

const totalUsuarios = ref(0);
const totalSalas = ref(0);
const totalReservas = ref(0);

async function carregarDashboard() {
  const usuarios = await api.get("/usuarios");
  const salas = await api.get("/salas");
  const reservas = await api.get("/reservas");

  totalUsuarios.value = usuarios.data.length;
  totalSalas.value = salas.data.length;
  totalReservas.value = reservas.data.length;
}

onMounted(() => {
  carregarDashboard();
});
</script>

<template>
  <div style="display: grid; gap: 15px">
    <div class="card">
      <h2 class="title">Dashboard Admin</h2>
      <p>Bem-vindo ao painel do administrador.</p>
    </div>

    <div style="display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
      <div class="card">
        <h3>Usuários</h3>
        <p style="font-size: 22px; font-weight: bold;">{{ totalUsuarios }}</p>
      </div>

      <div class="card">
        <h3>Salas</h3>
        <p style="font-size: 22px; font-weight: bold;">{{ totalSalas }}</p>
      </div>

      <div class="card">
        <h3>Reservas</h3>
        <p style="font-size: 22px; font-weight: bold;">{{ totalReservas }}</p>
      </div>
    </div>
  </div>
</template>