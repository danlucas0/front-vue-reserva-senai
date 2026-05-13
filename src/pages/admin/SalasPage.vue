<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const nome = ref("");
const salas = ref([]);

async function carregarSalas() {
  const response = await api.get("/salas");
  salas.value = response.data;
}

async function cadastrarSala() {
  if (!nome.value) {
    Swal.fire("Atenção", "Digite o nome da sala!", "warning");
    return;
  }

  try {
    await api.post("/salas", {
      nome: nome.value,
    });

    Swal.fire("Sucesso!", "Sala cadastrada!", "success");
    nome.value = "";
    carregarSalas();
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao cadastrar sala", "error");
  }
}

async function deletarSala(id) {
  const confirm = await Swal.fire({
    title: "Tem certeza?",
    text: "Isso vai deletar a sala!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

  try {
    await api.delete(`/salas/${id}`);
    Swal.fire("Deletado!", "Sala removida.", "success");
    carregarSalas();
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao deletar", "error");
  }
}

onMounted(() => {
  carregarSalas();
});
</script>

<template>
  <div class="card">
    <h2 class="title">Cadastrar Sala</h2>

    <div style="display: grid; gap: 10px">
      <input class="input" v-model="nome" placeholder="Nome da sala..." />
      <button class="btn btn-orange" @click="cadastrarSala">Cadastrar Sala</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px">
    <h2 class="title">Lista de Salas</h2>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="s in salas" :key="s.id">
            <td>{{ s.id }}</td>
            <td>{{ s.nome }}</td>
            <td>
              <button class="btn btn-red" @click="deletarSala(s.id)">Deletar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>