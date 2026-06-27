/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

// ==========================================
// 1. PROGRAMACIÓN ORIENTADA A OBJETOS
// ==========================================
class Movimiento {
    constructor(tipo, monto, fecha) {
        this.id = Date.now(); 
        this.tipo = tipo; 
        this.monto = parseFloat(monto);
        this.fecha = fecha; 
    }
}

class Usuario {
    constructor(tipoDocumento, numeroDocumento, nombres, apellidos, correo, telefono, direccion, contrasena, movimientos = []) {
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.telefono = telefono;
        this.direccion = direccion;
        this.contrasena = contrasena;
        this.movimientos = movimientos; 
    }
}

function inicializarSistema() {
    let usuarios = JSON.parse(localStorage.getItem('afp_usuarios')) || [];
    const adminExiste = usuarios.some(u => u.numeroDocumento === '12345678');
    
    if (!adminExiste) {
        const mov1 = new Movimiento('Empleador', 1250.00, '2026-02-15'); mov1.id = Date.now() - 4000; 
        const mov2 = new Movimiento('Voluntario', 500.00, '2026-03-20'); mov2.id = Date.now() - 3000;
        const mov3 = new Movimiento('Empleador', 1300.50, '2026-04-15'); mov3.id = Date.now() - 2000;
        const mov4 = new Movimiento('Voluntario', 150.00, '2026-05-10'); mov4.id = Date.now() - 1000;
        const mov5 = new Movimiento('Empleador', 1300.50, '2026-06-15'); mov5.id = Date.now();

        const usuarioAdmin = new Usuario(
            "DNI", "12345678", "Administrador", "Principal", "admin@afpseguro.com", "999999999", "Sede Arequipa", "admin123",
            [mov1, mov2, mov3, mov4, mov5]
        );
        usuarios.push(usuarioAdmin);
        localStorage.setItem('afp_usuarios', JSON.stringify(usuarios));
    }
}

function actualizarUsuarioBD(usuarioActualizado) {
    let usuarios = JSON.parse(localStorage.getItem('afp_usuarios')) || [];
    const index = usuarios.findIndex(u => u.numeroDocumento === usuarioActualizado.numeroDocumento);
    if (index !== -1) {
        usuarios[index] = usuarioActualizado;
        localStorage.setItem('afp_usuarios', JSON.stringify(usuarios));
        localStorage.setItem('afp_sesion_actual', JSON.stringify(usuarioActualizado));
    }
}

// ==========================================
// 2. TODOS LOS EVENTOS DE LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarSistema();
    const sesionActual = JSON.parse(localStorage.getItem('afp_sesion_actual'));

    // --- VIDEO PROMOCIONAL ---
    const btnCerrarVideo = document.querySelector('.btn-cerrar-promo');
    const overlayVideo = document.querySelector('.promo-overlay');
    const elementoVideo = document.querySelector('.video-wrapper video');
    if (btnCerrarVideo && overlayVideo) {
        btnCerrarVideo.addEventListener('click', () => {
            overlayVideo.style.display = 'none';
            if (elementoVideo) elementoVideo.pause();
        });
    }

    // --- LÓGICA DE REGISTRO ---
    const btnRegistrar = document.querySelector('.btn-register-modal');
    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', (evento) => {
            const tipo = document.getElementById('reg-tipo-doc').value;
            const doc = document.getElementById('reg-num-doc').value.trim();
            const nom = document.getElementById('reg-nombres').value.trim();
            const ape = document.getElementById('reg-apellidos').value.trim();
            const correo = document.getElementById('reg-correo').value.trim();
            const tel = document.getElementById('reg-telefono').value.trim();
            const dir = document.getElementById('reg-direccion').value.trim();
            const pass = document.getElementById('reg-pass').value;

            if (tipo === "DNI" && (doc.length !== 8 || isNaN(doc))) { alert("DNI: 8 dígitos."); evento.preventDefault(); return; }
            if (tel.length !== 9 || isNaN(tel)) { alert("Teléfono: 9 dígitos."); evento.preventDefault(); return; }
            if (!correo.includes('@') || !correo.includes('.com')) { alert("Correo inválido."); evento.preventDefault(); return; }

            let usuarios = JSON.parse(localStorage.getItem('afp_usuarios')) || [];
            if (usuarios.some(u => u.numeroDocumento === doc)) { alert("Usuario ya existe."); evento.preventDefault(); return; }
            
            const nuevoUsuario = new Usuario(tipo, doc, nom, ape, correo, tel, dir, pass, []);
            usuarios.push(nuevoUsuario);
            localStorage.setItem('afp_usuarios', JSON.stringify(usuarios));
            localStorage.setItem('afp_sesion_actual', JSON.stringify(nuevoUsuario));
            alert("Cuenta creada."); window.location.href = "PrincipalAFP.html";
        });
    }

    // --- LÓGICA DE LOGIN ---
    const btnLogin = document.querySelector('.btn-login-modal');
    if (btnLogin) {
        btnLogin.addEventListener('click', (evento) => {
            const doc = document.getElementById('login-num-doc').value.trim();
            const pass = document.getElementById('login-pass').value;
            let usuarios = JSON.parse(localStorage.getItem('afp_usuarios')) || [];
            const user = usuarios.find(u => u.numeroDocumento === doc && u.contrasena === pass);
            if (user) {
                localStorage.setItem('afp_sesion_actual', JSON.stringify(user));
                window.location.href = "PrincipalAFP.html";
            } else {
                alert("Credenciales inválidas."); evento.preventDefault();
            }
        });
    }

    // --- PERFIL DESPLEGABLE (Cabecera) ---
    const contenedorPerfil = document.querySelector('.user-profile');
    if (contenedorPerfil && sesionActual) {
        const saludoUI = document.querySelector('.greeting');
        const dniUI = document.querySelector('.dni');
        if (saludoUI) saludoUI.textContent = `Hola, ${sesionActual.nombres}`;
        if (dniUI) dniUI.textContent = `${sesionActual.tipoDocumento}: ${sesionActual.numeroDocumento}`;

        const ventanaEmergente = document.createElement('div');
        ventanaEmergente.style.cssText = "display:none; position:absolute; top:100%; right:0; background:#fff; width:300px; box-shadow:0px 8px 16px rgba(0,0,0,0.2); border-radius:8px; padding:20px; z-index:1000; margin-top:15px; border:1px solid #e2e8f0; color:#333;";
        ventanaEmergente.innerHTML = `
            <h4 style="margin-bottom: 15px; color: #1e3a8a; border-bottom: 1px solid #eee; padding-bottom: 10px;">Información de la Cuenta</h4>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Nombres:</strong> ${sesionActual.nombres} ${sesionActual.apellidos}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Documento:</strong> ${sesionActual.tipoDocumento} - ${sesionActual.numeroDocumento}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Correo:</strong> ${sesionActual.correo}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Teléfono:</strong> ${sesionActual.telefono}</p>
        `;
        contenedorPerfil.style.position = 'relative';
        contenedorPerfil.appendChild(ventanaEmergente);

        const flechaDesplegable = document.querySelector('.dropdown-arrow');
        contenedorPerfil.addEventListener('click', (evento) => {
            const esVisible = ventanaEmergente.style.display === 'block';
            ventanaEmergente.style.display = esVisible ? 'none' : 'block';
            if (flechaDesplegable) flechaDesplegable.style.transform = esVisible ? 'rotate(0deg)' : 'rotate(180deg)';
            evento.stopPropagation();
        });
        document.addEventListener('click', () => { ventanaEmergente.style.display = 'none'; if (flechaDesplegable) flechaDesplegable.style.transform = 'rotate(0deg)'; });
    }

    // --- GESTIÓN DE MOVIMIENTOS ---
    const tablaMovimientos = document.getElementById('body-movimientos');
    const formMovimiento = document.getElementById('form-agregar-movimiento');
    const selectOrden = document.getElementById('ordenar-movimientos');

    if (sesionActual && tablaMovimientos) {
        if (!sesionActual.movimientos) sesionActual.movimientos = [];
        const renderizarMovimientos = (listaMovimientos) => {
            tablaMovimientos.innerHTML = ''; 
            if (listaMovimientos.length === 0) {
                tablaMovimientos.innerHTML = `<tr><td colspan="3" style="text-align:center;">No hay movimientos.</td></tr>`;
                return;
            }
            listaMovimientos.forEach(mov => {
                const tr = document.createElement('tr');
                const txt = mov.tipo === 'Empleador' ? 'Aporte del empleador' : 'Aporte voluntario';
                tr.innerHTML = `<td><span class="movement-dot in"></span>${txt}</td><td>${mov.fecha}</td><td class="positivo text-right font-semibold">+ S/ ${parseFloat(mov.monto).toFixed(2)}</td>`;
                tablaMovimientos.appendChild(tr);
            });
        };
        renderizarMovimientos(sesionActual.movimientos);

        if (formMovimiento) {
            formMovimiento.addEventListener('submit', (e) => {
                e.preventDefault();
                const tipo = document.getElementById('mov-tipo').value;
                const monto = document.getElementById('mov-monto').value;
                const fecha = document.getElementById('mov-fecha').value;
                if (!monto || monto <= 0 || !fecha) return;
                sesionActual.movimientos.push(new Movimiento(tipo, monto, fecha));
                actualizarUsuarioBD(sesionActual);
                renderizarMovimientos(sesionActual.movimientos);
                formMovimiento.reset();
                if (selectOrden) selectOrden.dispatchEvent(new Event('change'));
            });
        }
        if (selectOrden) {
            selectOrden.addEventListener('change', (e) => {
                let movs = [...sesionActual.movimientos]; 
                switch (e.target.value) {
                    case 'fecha-desc': movs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); break;
                    case 'fecha-asc': movs.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); break;
                    case 'monto-desc': movs.sort((a, b) => b.monto - a.monto); break;
                    case 'monto-asc': movs.sort((a, b) => a.monto - b.monto); break;
                    case 'tipo': movs.sort((a, b) => a.tipo.localeCompare(b.tipo)); break;
                }
                renderizarMovimientos(movs);
            });
        }
    }

    // --- DASHBOARD: SALDOS Y GRÁFICOS NATIVOS ---
    const UI_SaldoTotal = document.getElementById('saldo-total');
    if (sesionActual && UI_SaldoTotal) {
        let sumEmpleador = 0, sumVoluntario = 0;

        if (sesionActual.movimientos && sesionActual.movimientos.length > 0) {
            sesionActual.movimientos.forEach(mov => {
                if (mov.tipo === 'Empleador') sumEmpleador += parseFloat(mov.monto);
                else sumVoluntario += parseFloat(mov.monto);
            });
        }
        const saldoTotal = sumEmpleador + sumVoluntario;

        document.getElementById('saldo-total').textContent = `S/ ${saldoTotal.toFixed(2)}`;
        document.getElementById('aportes-empleador').textContent = `S/ ${sumEmpleador.toFixed(2)}`;
        document.getElementById('aportes-voluntarios').textContent = `S/ ${sumVoluntario.toFixed(2)}`;

        const UI_TablaUltimosMovs = document.getElementById('body-ultimos-movimientos');
        if (UI_TablaUltimosMovs) {
            UI_TablaUltimosMovs.innerHTML = ''; 
            const movsRecientes = [...(sesionActual.movimientos || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 3);
            if (movsRecientes.length === 0) {
                UI_TablaUltimosMovs.innerHTML = `<tr><td colspan="3" style="text-align:center;">No hay movimientos recientes.</td></tr>`;
            } else {
                movsRecientes.forEach(mov => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `<td><span class="movement-dot in"></span>${mov.tipo === 'Empleador' ? 'Aporte empleador' : 'Aporte voluntario'}</td>
                                      <td>${mov.fecha}</td><td class="positivo text-right font-semibold">+ S/ ${parseFloat(mov.monto).toFixed(2)}</td>`;
                    UI_TablaUltimosMovs.appendChild(fila);
                });
            }
        }

        // Gráfico Anillo (CSS)
        const divTarta = document.getElementById('graficoComposicionNativo');
        if (divTarta && saldoTotal > 0) {
            let pctEmpleador = (sumEmpleador / saldoTotal) * 100;
            divTarta.style.background = `conic-gradient(#22c55e 0% ${pctEmpleador}%, #a855f7 ${pctEmpleador}% 100%)`;
        }

        // Gráfico Evolución (Canvas HTML5) con Ejes
        const canvasEvolucion = document.getElementById('graficoEvolucionNativo');
        if (canvasEvolucion && sesionActual.movimientos.length > 0) {
            const ctx = canvasEvolucion.getContext('2d');
            const ancho = canvasEvolucion.width;
            const alto = canvasEvolucion.height;
            const margenIzq = 60, margenInf = 30, margenSup = 20, margenDer = 20;

            const historial = [...sesionActual.movimientos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            let montosAcumulados = [], fechasFormateadas = [], acumulador = 0;
            const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

            historial.forEach(mov => { 
                acumulador += parseFloat(mov.monto); 
                montosAcumulados.push(acumulador);
                const partesFecha = mov.fecha.split('-');
                if(partesFecha.length === 3) {
                    fechasFormateadas.push(nombresMeses[parseInt(partesFecha[1], 10) - 1]);
                } else {
                    fechasFormateadas.push(mov.fecha);
                }
            });

            const maxMonto = Math.max(...montosAcumulados);
            const topeY = maxMonto > 0 ? maxMonto * 1.1 : 1000; 
            const anchoUtil = ancho - margenIzq - margenDer;
            const altoUtil = alto - margenSup - margenInf;

            ctx.clearRect(0, 0, ancho, alto);

            // Dibujar Eje Y
            ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            for (let i = 0; i <= 4; i++) {
                const valorY = topeY - ((topeY / 4) * i);
                const posLineaY = margenSup + (altoUtil / 4) * i;
                ctx.fillText('S/ ' + Math.round(valorY), margenIzq - 10, posLineaY);
                ctx.beginPath(); ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.moveTo(margenIzq, posLineaY); ctx.lineTo(ancho - margenDer, posLineaY); ctx.stroke();
            }

            // Dibujar Línea
            ctx.beginPath(); ctx.strokeStyle = '#00b4d8'; ctx.lineWidth = 3;
            montosAcumulados.forEach((monto, index) => {
                const divisorX = montosAcumulados.length > 1 ? (montosAcumulados.length - 1) : 1;
                const x = margenIzq + (index / divisorX) * anchoUtil;
                const y = margenSup + altoUtil - ((monto / topeY) * altoUtil);
                if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Dibujar Eje X (Puntos y Meses)
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            montosAcumulados.forEach((monto, index) => {
                const divisorX = montosAcumulados.length > 1 ? (montosAcumulados.length - 1) : 1;
                const x = margenIzq + (index / divisorX) * anchoUtil;
                const y = margenSup + altoUtil - ((monto / topeY) * altoUtil);
                ctx.beginPath(); ctx.fillStyle = '#1e3a8a'; ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#64748b'; ctx.fillText(fechasFormateadas[index], x, alto - margenInf + 8);
            });
        }
    }

    // --- CONFIGURACIÓN: AUTOCOMPLETADO Y GUARDADO ---
    const inputNombres = document.getElementById('conf-nombres');
    
    if (sesionActual && inputNombres) {
        const inputApellidos = document.getElementById('conf-apellidos');
        const inputCorreo = document.getElementById('conf-correo');
        const inputTelefono = document.getElementById('conf-telefono');
        const inputDireccion = document.getElementById('conf-direccion');
        const inputPassword = document.getElementById('conf-password');

        // PRE-LLENAR DATOS EN LOS RECUDROS
        inputNombres.value = sesionActual.nombres || '';
        if (inputApellidos) inputApellidos.value = sesionActual.apellidos || '';
        if (inputCorreo) inputCorreo.value = sesionActual.correo || '';
        if (inputTelefono) inputTelefono.value = sesionActual.telefono || '';
        if (inputDireccion) inputDireccion.value = sesionActual.direccion || '';

        // BOTONES INDIVIDUALES
        document.getElementById('btn-guardar-nombres')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro de actualizar tus nombres?")) {
                sesionActual.nombres = inputNombres.value.trim();
                sesionActual.apellidos = inputApellidos.value.trim();
                actualizarUsuarioBD(sesionActual);
                alert("Nombres actualizados correctamente.");
                window.location.reload(); 
            }
        });

        document.getElementById('btn-guardar-correo')?.addEventListener('click', (e) => {
            e.preventDefault();
            const nuevoCorreo = inputCorreo.value.trim();
            if (!nuevoCorreo.includes('@') || !nuevoCorreo.includes('.com')) {
                alert("Error: El correo debe contener '@' y terminar en '.com'."); return;
            }
            if (confirm("¿Estás seguro de actualizar tu correo electrónico?")) {
                sesionActual.correo = nuevoCorreo;
                actualizarUsuarioBD(sesionActual);
                alert("Correo actualizado correctamente.");
            }
        });

        document.getElementById('btn-guardar-telefono')?.addEventListener('click', (e) => {
            e.preventDefault();
            const nuevoTel = inputTelefono.value.trim();
            if (nuevoTel.length !== 9 || isNaN(nuevoTel)) {
                alert("Error: El teléfono debe tener exactamente 9 números."); return;
            }
            if (confirm("¿Estás seguro de actualizar tu número celular?")) {
                sesionActual.telefono = nuevoTel;
                actualizarUsuarioBD(sesionActual);
                alert("Teléfono actualizado correctamente.");
            }
        });

        document.getElementById('btn-guardar-direccion')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro de actualizar tu dirección?")) {
                sesionActual.direccion = inputDireccion.value.trim();
                actualizarUsuarioBD(sesionActual);
                alert("Dirección actualizada correctamente.");
            }
        });

        document.getElementById('btn-guardar-password')?.addEventListener('click', (e) => {
            e.preventDefault();
            const nuevaClave = inputPassword.value;
            if (!nuevaClave) { alert("Por favor, escribe una contraseña válida."); return; }
            if (confirm("¿Estás seguro de cambiar tu contraseña de acceso?")) {
                sesionActual.contrasena = nuevaClave;
                actualizarUsuarioBD(sesionActual);
                alert("Contraseña actualizada con éxito.");
                inputPassword.value = ''; 
            }
        });
    }

}); 