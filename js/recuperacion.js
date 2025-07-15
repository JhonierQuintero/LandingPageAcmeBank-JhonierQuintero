const formRecuperacion = document.getElementById("form-recuperacion");
const formNuevaPassword = document.getElementById("form-nueva-password");
const mensajeExito = document.getElementById("mensaje-exito");
let usuarioRecuperado = null;

// Cancelar y volver al login
document.getElementById("btn-cancelar").onclick = function() {
    window.location.href = "./login.html";
};
document.getElementById("btn-cancelar2").onclick = function() {
    window.location.href = "./login.html";
};

// Verificar datos para recuperación
formRecuperacion.onsubmit = function(e) {
    e.preventDefault();
    const tipoDocumento = document.getElementById("tipo-documento").value;
    const numeroDocumento = document.getElementById("numero-documento").value.trim();
    const correo = document.getElementById("correo").value.trim();

    if (!tipoDocumento || !numeroDocumento || !correo) {
        Swal.fire("Error", "Todos los campos son obligatorios.", "error");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarioRecuperado = usuarios.find(u =>
        u.tipoDeDocumento === tipoDocumento &&
        u.numeroDeDocumento === numeroDocumento &&
        u.correo === correo
    );

    if (!usuarioRecuperado) {
        Swal.fire("Error", "Datos incorrectos. Verifica tu información.", "error");
        return;
    }

    // Mostrar formulario de nueva contraseña
    formRecuperacion.style.display = "none";
    formNuevaPassword.style.display = "block";
};

// Guardar nueva contraseña
formNuevaPassword.onsubmit = function(e) {
    e.preventDefault();
    const nuevaPassword = document.getElementById("nueva-password").value;
    const confirmarPassword = document.getElementById("confirmar-password").value;

    if (!nuevaPassword || !confirmarPassword) {
        Swal.fire("Error", "Debes ingresar y confirmar la nueva contraseña.", "error");
        return;
    }
    if (nuevaPassword.length < 6) {
        Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
        return;
    }
    if (nuevaPassword !== confirmarPassword) {
        Swal.fire("Error", "Las contraseñas no coinciden.", "error");
        return;
    }

    // Actualizar contraseña en localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const idx = usuarios.findIndex(u =>
        u.tipoDeDocumento === usuarioRecuperado.tipoDeDocumento &&
        u.numeroDeDocumento === usuarioRecuperado.numeroDeDocumento &&
        u.correo === usuarioRecuperado.correo
    );
    if (idx !== -1) {
        usuarios[idx].password = nuevaPassword;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        formNuevaPassword.style.display = "none";
        mensajeExito.style.display = "block";
        mensajeExito.innerHTML = `
            <h2>¡Contraseña actualizada!</h2>
            <p>Tu contraseña ha sido cambiada exitosamente.</p>
            <a href="./login.html" class="btn" style="margin-top:1rem;display:inline-block;">Ir al inicio de sesión</a>
        `;
        Swal.fire("Éxito", "Contraseña actualizada correctamente.", "success");
    } else {
        Swal.fire("Error", "No se pudo actualizar la contraseña.", "error");
    }
};