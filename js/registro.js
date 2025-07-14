document.getElementById("btn-cancelar").onclick = function() {
    window.location.href = "./login.html";
};

document.getElementById("form-registro").onsubmit = function(e) {
    e.preventDefault();

    const tipoDocumento = document.getElementById("tipo-documento").value;
    const numeroDocumento = document.getElementById("numero-documento").value.trim();
    const nombres = document.getElementById("nombres").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const genero = document.getElementById("genero").value;
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const ciudad = document.getElementById("ciudad").value.trim();
    const password = document.getElementById("password").value;

    // Validación
    if (!tipoDocumento || !numeroDocumento || !nombres || !apellidos || !genero ||
        !telefono || !correo || !direccion || !ciudad || !password) {
        Swal.fire("Error", "Todos los campos son obligatorios.", "error");
        return;
    }
    if (!/^[0-9]{10}$/.test(telefono)) {
        Swal.fire("Error", "El teléfono debe tener 10 dígitos.", "error");
        return;
    }
    if (password.length < 6) {
        Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
        return;
    }

    // Generar número de cuenta y fecha
    const numeroCuenta = "AC" + Math.floor(100000000 + Math.random() * 900000000);
    const fechaCreacion = new Date().toLocaleDateString();

    // Guardar usuario en localStorage
    const usuario = {
        tipoDeDocumento: tipoDocumento,
        numeroDeDocumento: numeroDocumento,
        nombres,
        apellidos,
        genero,
        telefono,
        correo,
        direccion,
        ciudad,
        password,
        numeroCuenta,
        fechaCreacion
    };
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Mostrar resumen
    document.getElementById("form-registro").style.display = "none";
    document.getElementById("resumen").style.display = "block";
    document.getElementById("resumen").innerHTML = `
        <h2>¡Registro Exitoso!</h2>
        <p><strong>Número de cuenta asignado:</strong> ${numeroCuenta}</p>
        <p><strong>Fecha de creación:</strong> ${fechaCreacion}</p>
        <p><strong>Nombre:</strong> ${nombres} ${apellidos}</p>
        <p><strong>Ciudad:</strong> ${ciudad}</p>
        <a href="./login.html" class="btn" style="margin-top:1rem;display:inline-block;">Ir al inicio de sesión</a>
    `;
    Swal.fire("Registro exitoso", "Tu cuenta ha sido creada correctamente.", "success");
};