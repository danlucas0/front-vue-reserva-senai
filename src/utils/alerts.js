import Swal from "sweetalert2";

export function toastSuccess(msg) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
}

export function toastError(msg) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "error",
    title: msg,
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
  });
}

export async function confirmDelete(msg = "Deseja realmente deletar?") {
  const result = await Swal.fire({
    title: "Confirmação",
    text: msg,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, deletar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
  });

  return result.isConfirmed;
}

export function showBackendError(error, fallback = "Erro inesperado!") {
  if (error.response && error.response.data) {
    const msg = error.response.data.message || JSON.stringify(error.response.data);
    toastError(msg);
    return;
  }

  toastError(fallback);
}