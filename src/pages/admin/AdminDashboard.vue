<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const totalUsuarios = ref(0);
const totalSalas = ref(0);
const totalReservasHoje = ref(0);

function hojeFormatado() {
  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth() + 1).padStart(2, "0");
  const dd = String(hoje.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function carregarDashboard() {
  try {
    const resUsuarios = await api.get("/usuarios");
    totalUsuarios.value = resUsuarios.data.length;

    const resSalas = await api.get("/salas");
    totalSalas.value = resSalas.data.length;

    const dataHoje = hojeFormatado();
    const resReservas = await api.get(`/reservas/data/${dataHoje}`);
    totalReservasHoje.value = resReservas.data.length;
  } catch (error) {
    Swal.fire("Erro", "Erro ao carregar dashboard", "error");
  }
}

onMounted(() => {
  carregarDashboard();
});
</script>

<template>
  <div class="page">
    <h2 class="titulo">Dashboard Admin</h2>

    <div class="grid">
      <div class="card">
        <p class="label">Usuários</p>
        <h1>{{ totalUsuarios }}</h1>
      </div>

      <div class="card">
        <p class="label">Salas</p>
        <h1>{{ totalSalas }}</h1>
      </div>

      <div class="card">
        <p class="label">Reservas Hoje</p>
        <h1>{{ totalReservasHoje }}</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 15px;
}

.titulo {
  font-size: 24px;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.card {
  background: white;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
}

.label {
  font-size: 14px;
  color: gray;
}

h1 {
  margin-top: 8px;
  font-size: 32px;
  font-weight: bold;
}
</style>