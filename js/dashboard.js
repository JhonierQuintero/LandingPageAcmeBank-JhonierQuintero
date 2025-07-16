function getUsuarioActual() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    return usuarios.find(u => String(u.numeroDeDocumento) === String(usuarioActivo)) || null;
}

function guardarUsuarioActual(usuario) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const idx = usuarios.findIndex(u => String(u.numeroDeDocumento) === String(usuario.numeroDeDocumento));
    if (idx !== -1) {
        usuarios[idx] = usuario;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

// Guarda y actualiza la transacción y el saldo
function guardarTransaccion(transaccion, tipoOperacion) {
    const usuario = getUsuarioActual();
    usuario.transacciones = usuario.transacciones || [];
    usuario.transacciones.unshift(transaccion);
    if (usuario.transacciones.length > 50) usuario.transacciones = usuario.transacciones.slice(0, 50);

    // Actualiza saldo según tipo de operación
    if (tipoOperacion === "consignacion") {
        usuario.saldo = (usuario.saldo || 0) + transaccion.valor;
    } else if (tipoOperacion === "retiro" || tipoOperacion === "servicio") {
        usuario.saldo = (usuario.saldo || 0) - transaccion.valor;
    }
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
    localStorage.removeItem("usuarioActivo");
    window.location.href = "./login.html";
}

// --------- RESUMEN DE CUENTA ----------
function cargarResumen() {
    const usuario = getUsuarioActual();
    if (!usuario) return;
    document.getElementById("resumen-card").innerHTML = `
        <div>
            <p class="saldo"><span style="font-weight:600;">$${usuario.saldo || 0}</span></p>
            <h3 style="color:var(--color-accent);margin-bottom:1rem;"><i class="bx bx-user"></i> ${usuario.nombres} ${usuario.apellidos}</h3>
            <p><strong>Número de cuenta:</strong> ${usuario.numeroCuenta}</p>
            <p><strong>Fecha de creación:</strong> ${usuario.fechaCreacion}</p>
        </div>
    `;
}

// --------- TRANSACCIONES ----------
function cargarTransacciones() {
    const usuario = getUsuarioActual();
    const lista = document.getElementById("transacciones-list");
    lista.innerHTML = "";
    // Ordena por fechaISO si existe, si no por fecha local
    let transacciones = (usuario.transacciones || []).slice();
    transacciones.sort((a, b) => {
        if (a.fechaISO && b.fechaISO) {
            return new Date(b.fechaISO) - new Date(a.fechaISO);
        }
        // fallback: no debería pasar
        return 0;
    });
    transacciones = transacciones.slice(0, 10);
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
    const fechaActual = new Date();
    const transaccion = {
        fecha: fechaActual.toLocaleDateString(),
        fechaISO: fechaActual.toISOString(),
        referencia: "CN" + Math.floor(100000 + Math.random() * 900000),
        tipo: "Consignación",
        concepto: "Consignación por canal electrónico",
        valor: valor
    };
    guardarTransaccion(transaccion, "consignacion");
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
    const fechaActual = new Date();
    const transaccion = {
        fecha: fechaActual.toLocaleDateString(),
        fechaISO: fechaActual.toISOString(),
        referencia: "RT" + Math.floor(100000 + Math.random() * 900000),
        tipo: "Retiro",
        concepto: "Retiro de dinero",
        valor: valor
    };
    guardarTransaccion(transaccion, "retiro");
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
    const fechaActual = new Date();
    const transaccion = {
        fecha: fechaActual.toLocaleDateString(),
        fechaISO: fechaActual.toISOString(),
        referencia: "SV" + Math.floor(100000 + Math.random() * 900000),
        tipo: "Retiro",
        concepto: `Pago de servicio público ${tipo} (${referencia})`,
        valor: valor
    };
    guardarTransaccion(transaccion, "servicio");
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
    // Extrae el año de la fechaISO
    const anios = [...new Set(
        transacciones
            .map(t => t.fechaISO ? new Date(t.fechaISO).getFullYear() : null)
            .filter(anio => anio)
    )];
    anios.forEach(anio => {
        selectAnio.innerHTML += `<option value="${anio}">${anio}</option>`;
    });
    document.getElementById("extracto-list").innerHTML = "";
}

document.getElementById("form-extracto").onsubmit = function(e) {
    e.preventDefault();
    const usuario = getUsuarioActual();
    const anio = Number(document.getElementById("extracto-anio").value);
    const mes = Number(document.getElementById("extracto-mes").value);
    const lista = document.getElementById("extracto-list");
    const transacciones = (usuario.transacciones || []).filter(t => {
        if (!t.fechaISO) return false;
        const fecha = new Date(t.fechaISO);
        return fecha.getFullYear() === anio && (fecha.getMonth() + 1) === mes;
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
            <p>El presente certificado hace constar que 
            <strong>${usuario.nombres} ${usuario.apellidos}</strong>, 
            identificado con <strong>${usuario.tipoDeDocumento} No. ${usuario.numeroDeDocumento}</strong>, es titular de la cuenta bancaria número <strong>${usuario.numeroCuenta}</strong> 
            en AcmeBank, la cual se encuentra activa desde el <strong>${usuario.fechaCreacion}</strong>. El saldo actual de la cuenta es de <strong>$${usuario.saldo || 0}</strong>.
            </p>
            <p>
                Se expide el presente certificado a solicitud del interesado, para los fines que estime convenientes.
            </p>
        </div>
    `;
}

window.addEventListener("DOMContentLoaded", () => {
    showSection('resumen');
});