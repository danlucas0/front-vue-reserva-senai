<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const salas = ref([]);
const reservas = ref([]);

const nomeSala = ref("");
const data = ref("");

async function carregarSalas() {
  const response = await api.get("/salas");
  salas.value = response.data;
}

async function carregarReservas() {
  if (!data.value) {
    reservas.value = [];
    return;
  }

  const response = await api.get(`/reservas/data/${data.value}`);
  reservas.value = response.data;
}

function salaStatus(salaId) {
  const ativas = reservas.value.filter(
    (r) => r.sala?.id === salaId && r.status !== "RECUSADO" && r.status !== "FINALIZADO"
  );

  if (ativas.length === 0) return "DISPONIVEL";

  const temAprovada = ativas.some((r) => r.status === "APROVADO");
  if (temAprovada) return "OCUPADA";

  return "PENDENTE";
}

async function criarSala() {
  if (!nomeSala.value) {
    Swal.fire("Atenção", "Digite o nome da sala!", "warning");
    return;
  }

  try {
    await api.post("/salas", {
      nome: nomeSala.value,
    });

    Swal.fire("Sucesso!", "Sala cadastrada!", "success");
    nomeSala.value = "";

    await carregarSalas();
  } catch (error) {
    Swal.fire("Erro!", "Erro ao criar sala", "error");
  }
}

async function deletarSala(id) {
  const result = await Swal.fire({
    title: "Tem certeza?",
    text: "Isso irá apagar a sala!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/salas/${id}`);
    Swal.fire("Deletado!", "Sala removida!", "success");
    await carregarSalas();
  } catch (error) {
    Swal.fire("Erro!", "Erro ao deletar sala", "error");
  }
}

onMounted(async () => {
  await carregarSalas();
});

watch(data, async () => {
  await carregarReservas();
});
</script>

<template>
  <div class="card">
    <h2 class="title">Salas (Admin)</h2>

    <div class="grid-form">
      <input class="input" placeholder="Nome da sala..." v-model="nomeSala" />
      <button class="btn btn-blue" @click="criarSala">Cadastrar</button>
    </div>

    <div style="margin-top: 20px">
      <label><b>Ver status por data:</b></label>
      <input class="input" type="date" v-model="data" />
    </div>

    <div class="salas-grid">
      <div
        v-for="s in salas"
        :key="s.id"
        class="sala-card"
        :class="{
          green: salaStatus(s.id) === 'DISPONIVEL',
          red: salaStatus(s.id) === 'OCUPADA',
          orange: salaStatus(s.id) === 'PENDENTE'
        }"
      >
        <h3>{{ s.nome }}</h3>

        <p v-if="data">
          <b>Status:</b>
          <span v-if="salaStatus(s.id) === 'DISPONIVEL'">🟢 Disponível</span>
          <span v-if="salaStatus(s.id) === 'OCUPADA'">🔴 Ocupada</span>
          <span v-if="salaStatus(s.id) === 'PENDENTE'">🟠 Pendente</span>
        </p>

        <button class="btn btn-red" @click="deletarSala(s.id)">
          Deletar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0,0,0,0.1);
}

.title {
  font-size: 22px;
  margin-bottom: 15px;
}

.grid-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.btn {
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-blue {
  background: #0072ce;
  color: white;
}

.btn-red {
  background: #e74c3c;
  color: white;
  width: 100%;
  margin-top: 10px;
}

.salas-grid {
  margin-top: 20px;
  display: grid;
  gap: 12px;
}

@media (min-width: 600px) {
  .salas-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1000px) {
  .salas-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.sala-card {
  padding: 15px;
  border-radius: 12px;
  border: 2px solid #eee;
}

.green {
  border-color: #2ecc71;
}

.red {
  border-color: #e74c3c;
}

.orange {
  border-color: #f39c12;
}
</style>