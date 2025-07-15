function getUsuarioActual() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const idx = localStorage.getItem("usuarioIndex");
    return usuarios[idx] || null;
}

function guardarUsuarioActual(usuario) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const idx = usuarios.findIndex(u => u.numeroCuenta === usuario.numeroCuenta);
    if (idx !== -1) {
        usuarios[idx] = usuario;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

function guardarTransaccion(transaccion) {
    const usuario = getUsuarioActual();
    usuario.transacciones = usuario.transacciones || [];
    usuario.transacciones.unshift(transaccion);
    if (usuario.transacciones.length > 50) usuario.transacciones = usuario.transacciones.slice(0, 50);
    guardarUsuarioActual(usuario);
}

function showSection(section) {
    document.querySelectorAll('.dashboard-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(section + '-section').style.display = 'block';
    if (section === 'resumen') cargarResumen();
    if (section === 'transacciones') cargarTransacciones();
    if (section === 'consignacion') cargarConsignacion();
    if (section === 'retiro') cargarRetiro();
    if (section === 'servicios') cargarServicios();
    if (section === 'extracto') cargarExtracto();
    if (section === 'certificado') cargarCertificado();
}

function cerrarSesion() {
    localStorage.removeItem("usuarioIndex");
    window.location.href = "./login.html";
}

// --------- RESUMEN DE CUENTA ----------
function cargarResumen() {
    const usuario = getUsuarioActual();
    if (!usuario) return;
    document.getElementById("resumen-card").innerHTML = `
        <div>
            <h3 style="color:var(--color-accent);margin-bottom:1rem;"><i class="bx bx-user"></i> ${usuario.nombres} ${usuario.apellidos}</h3>
            <p><strong>Número de cuenta:</strong> ${usuario.numeroCuenta}</p>
            <p><strong>Saldo actual:</strong> <span style="color:#16a34a;font-weight:600;">$${usuario.saldo || 0}</span></p>
            <p><strong>Fecha de creación:</strong> ${usuario.fechaCreacion}</p>
        </div>
    `;
}

// --------- TRANSACCIONES ----------
function cargarTransacciones() {
    const usuario = getUsuarioActual();
    const lista = document.getElementById("transacciones-list");
    lista.innerHTML = "";
    const transacciones = (usuario.transacciones || []).slice(0, 10);
    if (transacciones.length === 0) {
        lista.innerHTML = "<p>No hay transacciones recientes.</p>";
        return;
    }
    let html = `<table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Referencia</th>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Valor</th>
            </tr>
        </thead>
        <tbody>`;
    transacciones.forEach(t => {
        html += `<tr>
            <td>${t.fecha}</td>
            <td>${t.referencia}</td>
            <td>${t.tipo}</td>
            <td>${t.concepto}</td>
            <td style="color:${t.tipo==='Consignación'?'#16a34a':'#dc2626'};font-weight:600;">$${t.valor}</td>
        </tr>`;
    });
    html += `</tbody></table>`;
    lista.innerHTML = html;
}

function imprimir(elementId) {
    const contenido = document.getElementById(elementId).innerHTML;
    const ventana = window.open('', '', 'height=600,width=800');
    ventana.document.write('<html><head><title>Imprimir</title></head><body>');
    ventana.document.write(contenido);
    ventana.document.write('</body></html>');
    ventana.document.close();
    ventana.print();
}

// --------- CONSIGNACIÓN ----------
function cargarConsignacion() {
    const usuario = getUsuarioActual();
    document.getElementById("consignacion-info").innerHTML = `
        <p><strong>Número de cuenta:</strong> ${usuario.numeroCuenta}</p>
        <p><strong>Nombre:</strong> ${usuario.nombres} ${usuario.apellidos}</p>
    `;
    document.getElementById("consignacion-resumen").innerHTML = "";
}

document.getElementById("form-consignacion").onsubmit = function(e) {
    e.preventDefault();
    const usuario = getUsuarioActual();
    const valor = parseFloat(document.getElementById("consignacion-valor").value);
    if (isNaN(valor) || valor <= 0) {
        Swal.fire("Error", "Ingrese una cantidad válida.", "error");
        return;
    }
    usuario.saldo = (usuario.saldo || 0) + valor;
    const transaccion = {
        fecha: new Date().toLocaleDateString(),
        referencia: "CN" + Math.floor(100000 + Math.random() * 900000),
        tipo: "Consignación",
        concepto: "Consignación por canal electrónico",
        valor: valor
    };
    guardarTransaccion(transaccion);
    guardarUsuarioActual(usuario);
    document.getElementById("consignacion-resumen").innerHTML = `
        <div class="card">
            <h3>Resumen de Consignación</h3>
            <p><strong>Fecha:</strong> ${transaccion.fecha}</p>
            <p><strong>Referencia:</strong> ${transaccion.referencia}</p>
            <p><strong>Tipo:</strong> ${transaccion.tipo}</p>
            <p><strong>Concepto:</strong> ${transaccion.concepto}</p>
            <p><strong>Valor:</strong> <span style="color:#16a34a;font-weight:600;">$${transaccion.valor}</span></p>
            <button class="btn" onclick="imprimir('consignacion-resumen')"><i class="bx bx-printer"></i> Imprimir</button>
        </div>
    `;
    cargarResumen();
    Swal.fire("Consignación exitosa", "El saldo ha sido actualizado.", "success");
    this.reset();
};

// --------- RETIRO ----------
function cargarRetiro() {
    const usuario = getUsuarioActual();
    document.getElementById("retiro-info").innerHTML = `
        <p><strong>Número de cuenta:</strong> ${usuario.numeroCuenta}</p>
        <p><strong>Nombre:</strong> ${usuario.nombres} ${usuario.apellidos}</p>
    `;
    document.getElementById("retiro-resumen").innerHTML = "";
}

document.getElementById("form-retiro").onsubmit = function(e) {
    e.preventDefault();
    const usuario = getUsuarioActual();
    const valor = parseFloat(document.getElementById("retiro-valor").value);
    if (isNaN(valor) || valor <= 0) {
        Swal.fire("Error", "Ingrese una cantidad válida.", "error");
        return;
    }
    if ((usuario.saldo || 0) < valor) {
        Swal.fire("Error", "Saldo insuficiente.", "error");
        return;
    }
    usuario.saldo -= valor;
    const transaccion = {
        fecha: new Date().toLocaleDateString(),
        referencia: "RT" + Math.floor(100000 + Math.random() * 900000),
        tipo: "Retiro",
        concepto: "Retiro de dinero",
        valor: valor
    };
    guardarTransaccion(transaccion);
    guardarUsuarioActual(usuario);
    document.getElementById("retiro-resumen").innerHTML = `
        <div class="card">
            <h3>Resumen de Retiro</h3>
            <p><strong>Fecha:</strong> ${transaccion.fecha}</p>
            <p><strong>Referencia:</strong> ${transaccion.referencia}</p>
            <p><strong>Tipo:</strong> ${transaccion.tipo}</p>
            <p><strong>Concepto:</strong> ${transaccion.concepto}</p>
            <p><strong>Valor:</strong> <span style="color:#dc2626;font-weight:600;">$${transaccion.valor}</span></p>
            <button class="btn" onclick="imprimir('retiro-resumen')"><i class="bx bx-printer"></i> Imprimir</button>
        </div>
    `;
    cargarResumen();
    Swal.fire("Retiro exitoso", "El saldo ha sido actualizado.", "success");
    this.reset();
};

// --------- SERVICIOS PÚBLICOS ----------
function cargarServicios() {
    const usuario = getUsuarioActual();
    document.getElementById("servicios-info").innerHTML = `
        <p><strong>Número de cuenta:</strong> ${usuario.numeroCuenta}</p>
        <p><strong>Nombre:</strong> ${usuario.nombres} ${usuario.apellidos}</p>
    `;
    document.getElementById("servicios-resumen").innerHTML = "";
}

document.getElementById("form-servicios").onsubmit = function(e) {
    e.preventDefault();
    const usuario = getUsuarioActual();
    const tipo = document.getElementById("servicio-tipo").value;
    const referencia = document.getElementById("servicio-referencia").value.trim();
    const valor = parseFloat(document.getElementById("servicio-valor").value);
    if (!tipo || !referencia || isNaN(valor) || valor <= 0) {
        Swal.fire("Error", "Complete todos los campos correctamente.", "error");
        return;
    }
    if ((usuario.saldo || 0) < valor) {
        Swal.fire("Error", "Saldo insuficiente.", "error");
        return;
    }
    usuario.saldo -= valor;
    const transaccion = {
        fecha: new Date().toLocaleDateString(),
        referencia: "SV" + Math.floor(100000 + Math.random() * 900000),
        tipo: "Retiro",
        concepto: `Pago de servicio público ${tipo} (${referencia})`,
        valor: valor
    };
    guardarTransaccion(transaccion);
    guardarUsuarioActual(usuario);
    document.getElementById("servicios-resumen").innerHTML = `
        <div class="card">
            <h3>Resumen de Pago</h3>
            <p><strong>Fecha:</strong> ${transaccion.fecha}</p>
            <p><strong>Referencia:</strong> ${transaccion.referencia}</p>
            <p><strong>Tipo:</strong> ${transaccion.tipo}</p>
            <p><strong>Concepto:</strong> ${transaccion.concepto}</p>
            <p><strong>Valor:</strong> <span style="color:#dc2626;font-weight:600;">$${transaccion.valor}</span></p>
            <button class="btn" onclick="imprimir('servicios-resumen')"><i class="bx bx-printer"></i> Imprimir</button>
        </div>
    `;
    cargarResumen();
    Swal.fire("Pago realizado", "El saldo ha sido actualizado.", "success");
    this.reset();
};

// --------- EXTRACTO BANCARIO ----------
function cargarExtracto() {
    const usuario = getUsuarioActual();
    document.getElementById("extracto-info").innerHTML = `
        <p><strong>Número de cuenta:</strong> ${usuario.numeroCuenta}</p>
        <p><strong>Nombre:</strong> ${usuario.nombres} ${usuario.apellidos}</p>
    `;
    // Rellenar años disponibles
    const selectAnio = document.getElementById("extracto-anio");
    selectAnio.innerHTML = `<option value="" disabled selected>Año</option>`;
    const transacciones = usuario.transacciones || [];
    const anios = [...new Set(transacciones.map(t => {
        const partes = t.fecha.split('/');
        return partes.length === 3 ? partes[2] : new Date(t.fecha).getFullYear();
    }))];
    anios.forEach(anio => {
        selectAnio.innerHTML += `<option value="${anio}">${anio}</option>`;
    });
    document.getElementById("extracto-list").innerHTML = "";
}

document.getElementById("form-extracto").onsubmit = function(e) {
    e.preventDefault();
    const usuario = getUsuarioActual();
    const anio = document.getElementById("extracto-anio").value;
    const mes = document.getElementById("extracto-mes").value;
    const lista = document.getElementById("extracto-list");
    const transacciones = (usuario.transacciones || []).filter(t => {
        const partes = t.fecha.split('/');
        return partes.length === 3 && partes[1] == mes && partes[2] == anio;
    });
    if (transacciones.length === 0) {
        lista.innerHTML = "<p>No hay movimientos para ese periodo.</p>";
        return;
    }
    let html = `<table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Referencia</th>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Valor</th>
            </tr>
        </thead>
        <tbody>`;
    transacciones.forEach(t => {
        html += `<tr>
            <td>${t.fecha}</td>
            <td>${t.referencia}</td>
            <td>${t.tipo}</td>
            <td>${t.concepto}</td>
            <td style="color:${t.tipo==='Consignación'?'#16a34a':'#dc2626'};font-weight:600;">$${t.valor}</td>
        </tr>`;
    });
    html += `</tbody></table>
    <button class="btn" onclick="imprimir('extracto-list')"><i class="bx bx-printer"></i> Imprimir</button>`;
    lista.innerHTML = html;
};

// --------- CERTIFICADO BANCARIO ----------
function cargarCertificado() {
    const usuario = getUsuarioActual();
    document.getElementById("certificado-card").innerHTML = `
        <div style="padding:2rem;text-align:center;border:2px solid var(--color-accent);border-radius:1rem;background:#f7faff;">
            <h3 style="color:var(--color-accent);margin-bottom:1rem;"><i class="bx bx-certification"></i> Certificado Bancario</h3>
            <p>El banco AcmeBank certifica que el usuario <strong>${usuario.nombres} ${usuario.apellidos}</strong> identificado con <strong>${usuario.tipoDeDocumento} ${usuario.numeroDeDocumento}</strong> posee una cuenta activa número <strong>${usuario.numeroCuenta}</strong> desde el <strong>${usuario.fechaCreacion}</strong>.</p>
            <p>Saldo actual: <strong>$${usuario.saldo || 0}</strong></p>
            <p>Este certificado se expide a solicitud del interesado.</p>
        </div>
    `;
}

window.addEventListener("DOMContentLoaded", () => {
    showSection('resumen');
});