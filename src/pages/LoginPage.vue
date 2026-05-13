<script setup>
import { ref } from "vue";
import api from "../api/api";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const email = ref("");
const senha = ref("");

const router = useRouter();

async function login() {
  try {
    const response = await api.post("/auth/login", {
      email: email.value,
      senha: senha.value,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("id", response.data.id);

    Swal.fire("Sucesso!", "Login realizado!", "success");

    if (response.data.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/professor/minhas-reservas");
    }
  } catch (error) {
    Swal.fire("Erro!", "Email ou senha inválidos!", "error");
  }
}
</script>

<template>
  <div class="login-container">
    <div class="card">
      <h1 class="title">SEN<span class="dot">A</span>I Reservas</h1>
      <p class="subtitle">Faça login para acessar o sistema</p>

      <input v-model="email" placeholder="Email" type="email" />
      <input v-model="senha" placeholder="Senha" type="password" />

      <button @click="login">Entrar</button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background: white;
  padding: 30px;
  width: 100%;
  max-width: 360px;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0,0,0,0.1);
  text-align: center;
}

.title {
  font-size: 28px;
  margin-bottom: 5px;
}

.dot {
  color: orange;
}

.subtitle {
  color: gray;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 10px;
  background: #0072ce;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>