<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const nome = ref("");
const email = ref("");
const senha = ref("");
const role = ref("PROFESSOR");

const usuarios = ref([]);

async function carregarUsuarios() {
  const response = await api.get("/usuarios");
  usuarios.value = response.data;
}

async function cadastrarUsuario() {
  if (!nome.value || !email.value) {
    Swal.fire("Atenção", "Preencha nome e email!", "warning");
    return;
  }

  try {
    await api.post("/usuarios", {
      nome: nome.value,
      email: email.value,
      senha: senha.value,
      role: role.value,
    });

    Swal.fire("Sucesso!", "Usuário cadastrado!", "success");

    nome.value = "";
    email.value = "";
    senha.value = "";
    role.value = "PROFESSOR";

    carregarUsuarios();
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao cadastrar usuário", "error");
  }
}

async function deletarUsuario(id) {
  const confirm = await Swal.fire({
    title: "Tem certeza?",
    text: "Isso vai deletar o usuário!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

  try {
    await api.delete(`/usuarios/${id}`);
    Swal.fire("Deletado!", "Usuário removido.", "success");
    carregarUsuarios();
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao deletar", "error");
  }
}

onMounted(() => {
  carregarUsuarios();
});
</script>

<template>
  <div class="card">
    <h2 class="title">Cadastrar Usuário</h2>

    <div style="display: grid; gap: 10px">
      <input class="input" v-model="nome" placeholder="Nome..." />
      <input class="input" v-model="email" placeholder="Email..." />
      <input class="input" v-model="senha" placeholder="Senha (opcional)" type="password" />

      <select class="input" v-model="role">
        <option value="PROFESSOR">PROFESSOR</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <button class="btn btn-blue" @click="cadastrarUsuario">Cadastrar</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px">
    <h2 class="title">Lista de Usuários</h2>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="u in usuarios" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.nome }}</td>
            <td>{{ u.email }}</td>
            <td><b>{{ u.role }}</b></td>
            <td>
              <button class="btn btn-red" @click="deletarUsuario(u.id)">Deletar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>