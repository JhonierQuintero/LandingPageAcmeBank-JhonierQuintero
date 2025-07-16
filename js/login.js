const btnLogin = document.getElementById("btn-login");

btnLogin.addEventListener("click", function(event) {
    event.preventDefault();

        const numeroDeDocumento = document.getElementById("input-numero-documento").value;
        const tipoDeDocumento = document.getElementById("select-tipo-documento").value;
        const password = document.getElementById("input-password").value;
        const data = JSON.parse(localStorage.getItem("usuarios")) || [];

        data.forEach(element => {
            if (element.numeroDeDocumento === numeroDeDocumento && element.tipoDeDocumento === tipoDeDocumento && element.password === password) {
                Swal.fire("Inicio de sesión", "¡Bienvenido!", "success").then(() => {
                    localStorage.setItem("usuarioActivo",element.numeroDeDocumento);
                    window.location.href = "../html/dashboard.html";
                });
            }
        });

    if (!data.some(element => element.numeroDeDocumento === numeroDeDocumento && element.tipoDeDocumento === tipoDeDocumento && element.password === password)) {
        Swal.fire("Error", "Credenciales inválidas, por favor inténtelo de nuevo.", "error");
    }

});
