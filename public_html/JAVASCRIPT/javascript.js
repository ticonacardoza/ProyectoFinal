

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
// 2. FUNCIONES GLOBALES REUTILIZABLES
// ==========================================
function iniciarCalculadora() {
    const formulario = document.getElementById("calculadora");
    if (!formulario) return;
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const aporte = parseFloat(document.getElementById("aporte").value);
        const anios = parseInt(document.getElementById("anios").value);
        const resultadoRT = document.getElementById("resultadoRT");

        if (isNaN(aporte) || isNaN(anios) || aporte <= 0 || anios <= 0) {
            resultadoRT.innerHTML = "⚠️ Ingrese valores válidos mayores a 0.";
            resultadoRT.style.color = "#ffcc00";
            return;
        }

        const tasaAnual = 0.06;
        const tasaMensual = tasaAnual / 12;
        const meses = anios * 12;
        const total = aporte * ((Math.pow(1 + tasaMensual, meses) - 1) / tasaMensual);

        resultadoRT.style.color = "#FFD54F";
        resultadoRT.innerHTML = "En <strong>" + anios + "</strong> años podrías ahorrar aproximadamente:<br>" +
            "<strong style='font-size:32px;'>S/ " + total.toLocaleString('es-PE', { maximumFractionDigits: 2 }) + "</strong>";
    });
}

function iniciarFAQ() {
    const preguntas = document.querySelectorAll(".faq-question");
    preguntas.forEach(function (pregunta) {
        pregunta.addEventListener("click", function () {
            const respuesta = this.nextElementSibling;
            document.querySelectorAll(".faq-answer").forEach(function (item) {
                if (item !== respuesta) item.style.display = "none";
            });
            respuesta.style.display = (respuesta.style.display === "block") ? "none" : "block";
        });
    });
}

function iniciarAnimaciones() {
    const elementos = document.querySelectorAll(".beneficio-card, .timeline-item");
    if (elementos.length === 0) return;

    elementos.forEach(function (elemento) {
        elemento.style.opacity = "0";
        elemento.style.transform = "translateY(40px)";
        elemento.style.transition = "all .7s";
    });

    const mostrarElementos = () => {
        elementos.forEach(function (elemento) {
            const posicion = elemento.getBoundingClientRect().top;
            const pantalla = window.innerHeight;
            if (posicion < pantalla - 100) {
                elemento.style.opacity = "1";
                elemento.style.transform = "translateY(0)";
            }
        });
    };

    window.addEventListener("scroll", mostrarElementos);
    mostrarElementos();
}

// ==========================================
// 3. ÚNICO EVENTO DE CARGA DE PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Iniciar scripts globales
    iniciarCalculadora();
    iniciarFAQ();
    iniciarAnimaciones();
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
            alert("Cuenta creada."); window.location.href = "public_html/Html/PrincipalAFP.html";
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
                window.location.href = "public_html/Html/PrincipalAFP.html";
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

        // Tarjetas Generales
        UI_SaldoTotal.textContent = `S/ ${saldoTotal.toFixed(2)}`;
        if (document.getElementById('aportes-empleador')) document.getElementById('aportes-empleador').textContent = `S/ ${sumEmpleador.toFixed(2)}`;
        if (document.getElementById('aportes-voluntarios')) document.getElementById('aportes-voluntarios').textContent = `S/ ${sumVoluntario.toFixed(2)}`;

        // LÓGICA DEL BANNER DE JUBILACIÓN 
        const UIBannerSaldo = document.getElementById('banner-saldo-total');
        const UIBannerTiempo = document.getElementById('banner-tiempo-aportes');
        const UIBannerBarra = document.getElementById('banner-barra-progreso');
        const UIBannerPorcentaje = document.getElementById('banner-porcentaje');

        // Validación estricta: Solo ejecuta si encuentra los 3 elementos clave
        if (UIBannerSaldo && UIBannerBarra && UIBannerPorcentaje) {
            
            UIBannerSaldo.textContent = `S/ ${saldoTotal.toFixed(2)}`;

            const mesesTotales = Math.floor(saldoTotal / 150);
            const aniosEstimados = Math.floor(mesesTotales / 12);
            const mesesRestantes = mesesTotales % 12;

            if (UIBannerTiempo) {
                UIBannerTiempo.textContent = `Equivalente a ${aniosEstimados} años y ${mesesRestantes} meses de aportes continuos.`;
            }

            const metaJubilacion = 70000;
            let porcentajeAvance = (saldoTotal / metaJubilacion) * 100;
            if (porcentajeAvance > 100) porcentajeAvance = 100;


            setTimeout(() => {
                UIBannerBarra.style.width = `${porcentajeAvance}%`;
            }, 200); 
            
            UIBannerPorcentaje.textContent = `Actual: ${Math.floor(porcentajeAvance)}%`;
            
        } else if (document.location.pathname.includes('MiAhorroAFP')) {
            console.warn("Advertencia: No se encontraron los IDs del banner en el HTML.");
        }

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

        // Gráfico Anillo
        const divTarta = document.getElementById('graficoComposicionNativo');
        if (divTarta && saldoTotal > 0) {
            let pctEmpleador = (sumEmpleador / saldoTotal) * 100;
            divTarta.style.background = `conic-gradient(#22c55e 0% ${pctEmpleador}%, #a855f7 ${pctEmpleador}% 100%)`;
        }

        // Gráfico Evolución
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

            ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            for (let i = 0; i <= 4; i++) {
                const valorY = topeY - ((topeY / 4) * i);
                const posLineaY = margenSup + (altoUtil / 4) * i;
                ctx.fillText('S/ ' + Math.round(valorY), margenIzq - 10, posLineaY);
                ctx.beginPath(); ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.moveTo(margenIzq, posLineaY); ctx.lineTo(ancho - margenDer, posLineaY); ctx.stroke();
            }

            ctx.beginPath(); ctx.strokeStyle = '#00b4d8'; ctx.lineWidth = 3;
            montosAcumulados.forEach((monto, index) => {
                const divisorX = montosAcumulados.length > 1 ? (montosAcumulados.length - 1) : 1;
                const x = margenIzq + (index / divisorX) * anchoUtil;
                const y = margenSup + altoUtil - ((monto / topeY) * altoUtil);
                if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            });
            ctx.stroke();

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

    // --- RENTABILIDAD ---
    const UIRentaAportes = document.getElementById('renta-aportes');
    if (sesionActual && UIRentaAportes) {
        let aportesTotales = 0;
        if (sesionActual.movimientos && sesionActual.movimientos.length > 0) {
            sesionActual.movimientos.forEach(mov => { aportesTotales += parseFloat(mov.monto); });
        }

        const tasaRentabilidad = 0.0845;
        const gananciaGenerada = aportesTotales * tasaRentabilidad;
        const saldoConRentabilidad = aportesTotales + gananciaGenerada;

        UIRentaAportes.textContent = `S/ ${aportesTotales.toFixed(2)}`;
        document.getElementById('renta-ganancia').textContent = `+ S/ ${gananciaGenerada.toFixed(2)}`;
        document.getElementById('renta-total').textContent = `S/ ${saldoConRentabilidad.toFixed(2)}`;

        const canvasRentabilidad = document.getElementById('graficoRentabilidadNativo');
        if (canvasRentabilidad && aportesTotales > 0) {
            const ctx = canvasRentabilidad.getContext('2d');
            const ancho = canvasRentabilidad.width;
            const alto = canvasRentabilidad.height;
            const margenInf = 30, margenSup = 20, margenIzq = 60, margenDer = 20;

            const anchoUtil = ancho - margenIzq - margenDer;
            const altoUtil = alto - margenSup - margenInf;
            const maxMonto = saldoConRentabilidad * 1.1; 

            ctx.clearRect(0, 0, ancho, alto);

            ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            for (let i = 0; i <= 4; i++) {
                const valorY = maxMonto - ((maxMonto / 4) * i);
                const posLineaY = margenSup + (altoUtil / 4) * i;
                ctx.fillText('S/ ' + Math.round(valorY), margenIzq - 10, posLineaY);
                ctx.beginPath(); ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.moveTo(margenIzq, posLineaY); ctx.lineTo(ancho - margenDer, posLineaY); ctx.stroke();
            }

            const barras = [
                { nombre: 'Tus Aportes', valor: aportesTotales, color: '#1e3a8a' },
                { nombre: 'Ganancia', valor: gananciaGenerada, color: '#22c55e' }
            ];

            const anchoBarra = 80;
            const espacioEntreBarras = anchoUtil / 3;

            barras.forEach((barra, index) => {
                const x = margenIzq + espacioEntreBarras * (index + 1) - (anchoBarra / 2);
                const alturaBarra = (barra.valor / maxMonto) * altoUtil;
                const y = margenSup + altoUtil - alturaBarra;

                ctx.fillStyle = barra.color;
                ctx.fillRect(x, y, anchoBarra, alturaBarra);

                ctx.fillStyle = '#64748b';
                ctx.textAlign = 'center';
                ctx.fillText(barra.nombre, x + (anchoBarra / 2), alto - margenInf + 15);
                
                ctx.fillStyle = '#0f172a';
                ctx.font = 'bold 12px sans-serif';
                ctx.fillText('S/ ' + Math.round(barra.valor), x + (anchoBarra / 2), y - 10);
            });
        }
    }

    // --- CONFIGURACIÓN ---
    const inputNombres = document.getElementById('conf-nombres');
    if (sesionActual && inputNombres) {
        const inputApellidos = document.getElementById('conf-apellidos');
        const inputCorreo = document.getElementById('conf-correo');
        const inputTelefono = document.getElementById('conf-telefono');
        const inputDireccion = document.getElementById('conf-direccion');
        const inputPassword = document.getElementById('conf-password');

        inputNombres.value = sesionActual.nombres || '';
        if (inputApellidos) inputApellidos.value = sesionActual.apellidos || '';
        if (inputCorreo) inputCorreo.value = sesionActual.correo || '';
        if (inputTelefono) inputTelefono.value = sesionActual.telefono || '';
        if (inputDireccion) inputDireccion.value = sesionActual.direccion || '';

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
            if (!nuevoCorreo.includes('@') || !nuevoCorreo.includes('.com')) { alert("Error: Correo inválido."); return; }
            if (confirm("¿Estás seguro de actualizar tu correo?")) {
                sesionActual.correo = nuevoCorreo;
                actualizarUsuarioBD(sesionActual);
                alert("Correo actualizado correctamente.");
            }
        });

        document.getElementById('btn-guardar-telefono')?.addEventListener('click', (e) => {
            e.preventDefault();
            const nuevoTel = inputTelefono.value.trim();
            if (nuevoTel.length !== 9 || isNaN(nuevoTel)) { alert("Error: Teléfono inválido."); return; }
            if (confirm("¿Estás seguro de actualizar tu celular?")) {
                sesionActual.telefono = nuevoTel;
                actualizarUsuarioBD(sesionActual);
                alert("Teléfono actualizado.");
            }
        });

        document.getElementById('btn-guardar-direccion')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro de actualizar tu dirección?")) {
                sesionActual.direccion = inputDireccion.value.trim();
                actualizarUsuarioBD(sesionActual);
                alert("Dirección actualizada.");
            }
        });

        document.getElementById('btn-guardar-password')?.addEventListener('click', (e) => {
            e.preventDefault();
            const nuevaClave = inputPassword.value;
            if (!nuevaClave) { alert("Escribe una contraseña válida."); return; }
            if (confirm("¿Cambiar contraseña?")) {
                sesionActual.contrasena = nuevaClave;
                actualizarUsuarioBD(sesionActual);
                alert("Contraseña actualizada.");
                inputPassword.value = ''; 
            }
        });
    }

    // --- WIDGETS (Notificaciones, Chat, Correo) ---
    // Notificaciones
    const notifBell = document.querySelector('.notification');
    if (notifBell) {
        const notificacionesData = [
            { tipo: 'pago', icono: 'fa-circle-check', titulo: 'Aporte registrado', detalle: 'Aporte acreditado.', hora: 'Hace 2 horas' },
            { tipo: 'info', icono: 'fa-file-invoice', titulo: 'Estado de cuenta', detalle: 'Ya puedes descargarlo.', hora: 'Hace 1 día' },
            { tipo: 'alerta', icono: 'fa-triangle-exclamation', titulo: 'Actualiza tus datos', detalle: 'Verifica tu correo.', hora: 'Hace 3 días' }
        ];

        const panel = document.createElement('div');
        panel.className = 'notif-panel';
        panel.id = 'notif-panel';
        let itemsHtml = '';
        notificacionesData.forEach(n => {
            itemsHtml += `
                <div class="notif-item">
                    <div class="notif-icon tipo-${n.tipo}"><i class="fas ${n.icono}"></i></div>
                    <div class="notif-texto"><h5>${n.titulo}</h5><p>${n.detalle}</p><span class="notif-hora">${n.hora}</span></div>
                </div>`;
        });
        panel.innerHTML = `<div class="notif-panel-header"><h4>Notificaciones</h4><span id="notif-marcar-leidas">Marcar leídas</span></div><div class="notif-list">${itemsHtml}</div>`;
        notifBell.appendChild(panel);

        notifBell.addEventListener('click', (e) => { e.stopPropagation(); panel.classList.toggle('visible'); });
        document.addEventListener('click', () => panel.classList.remove('visible'));
        const marcarLeidas = panel.querySelector('#notif-marcar-leidas');
        const contador = notifBell.querySelector('.notification-count');
        if (marcarLeidas && contador) marcarLeidas.addEventListener('click', (e) => { e.stopPropagation(); contador.style.display = 'none'; });
    }

    // Chat Irene
    const chatBubble = document.createElement('div');
    chatBubble.className = 'irene-chat-bubble'; chatBubble.innerHTML = '<i class="fas fa-comment-dots"></i>'; document.body.appendChild(chatBubble);
    
    const chatWindow = document.createElement('div');
    chatWindow.className = 'irene-chat-window';
    chatWindow.innerHTML = `
        <div class="irene-chat-header">
            <div class="irene-avatar"><i class="fas fa-headset"></i></div><div class="irene-chat-header-info"><h4>Irene</h4><span>En línea</span></div><i class="fas fa-times irene-chat-close" id="irene-chat-close"></i>
        </div>
        <div class="irene-chat-body" id="irene-chat-body"><div class="irene-msg bot">¡Hola! Soy Irene, tu asistente. ¿En qué ayudo?</div></div>
        <div class="irene-chat-quick"><button class="irene-quick-btn" data-msg="¿Cuál es mi saldo?">Saldo</button><button class="irene-quick-btn" data-msg="Hablar con un asesor">Asesor</button></div>
        <div class="irene-chat-input"><input type="text" id="irene-chat-text" placeholder="Escribe..."><button id="irene-chat-send"><i class="fas fa-paper-plane"></i></button></div>
    `;
    document.body.appendChild(chatWindow);

    const chatBody = chatWindow.querySelector('#irene-chat-body');
    const chatInput = chatWindow.querySelector('#irene-chat-text');

    function agregarMensaje(texto, tipo) {
        const msg = document.createElement('div'); msg.className = `irene-msg ${tipo}`; msg.textContent = texto;
        chatBody.appendChild(msg); chatBody.scrollTop = chatBody.scrollHeight;
    }
    function enviarMensaje(texto) {
        if (!texto.trim()) return;
        agregarMensaje(texto, 'user');
        setTimeout(() => agregarMensaje("Gracias. Un asesor revisará tu consulta.", 'bot'), 600);
    }

    chatBubble.addEventListener('click', () => chatWindow.classList.toggle('visible'));
    chatWindow.querySelector('#irene-chat-close').addEventListener('click', () => chatWindow.classList.remove('visible'));
    chatWindow.querySelector('#irene-chat-send').addEventListener('click', () => { enviarMensaje(chatInput.value); chatInput.value = ''; });
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { enviarMensaje(chatInput.value); chatInput.value = ''; } });
    chatWindow.querySelectorAll('.irene-quick-btn').forEach(b => b.addEventListener('click', () => enviarMensaje(b.getAttribute('data-msg'))));

    // Correo
    const correoOverlay = document.createElement('div');
    correoOverlay.className = 'correo-modal-overlay';
    correoOverlay.innerHTML = `<div class="correo-modal-box"><span class="correo-modal-close" id="correo-modal-close">&times;</span><div class="modal-header"><h2>Envíanos un correo</h2></div><div class="correo-form"><input type="email" id="correo-email" placeholder="Correo"><textarea id="correo-mensaje" placeholder="Mensaje"></textarea><button id="correo-enviar-btn">Enviar</button></div></div>`;
    document.body.appendChild(correoOverlay);

    const cerrarCorreo = () => correoOverlay.classList.remove('visible');
    correoOverlay.querySelector('#correo-modal-close').addEventListener('click', cerrarCorreo);
    correoOverlay.querySelector('#correo-enviar-btn').addEventListener('click', () => { alert("Mensaje enviado!"); cerrarCorreo(); });

    document.querySelectorAll('.support-btn, .supportPrincipal-btn').forEach(btn => {
        const txt = btn.textContent.toLowerCase();
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (txt.includes('irene') || txt.includes('chatea')) chatWindow.classList.add('visible');
            else if (txt.includes('correo')) correoOverlay.classList.add('visible');
        });
    });
    
     
    // ================================
    // CARRUSEL HERO
    // ================================

    const slides = document.querySelector(".slides");
    const dots = document.querySelectorAll(".dot");

    if(slides && dots.length){

        let slideActual = 0;

        const totalSlides = dots.length;

        function mostrarSlide(indice){

            slideActual = indice;
            slides.style.transform =
            `translateX(-${indice*100}%)`;
            dots.forEach(dot=>dot.classList.remove("active"));
            dots[indice].classList.add("active");

        }

        dots.forEach((dot,index)=>{
            dot.addEventListener("click",()=>{
                mostrarSlide(index);
                reiniciar();

            });

        });

        let intervalo = setInterval(siguiente,4000);
        function siguiente(){
            slideActual++;
            if(slideActual>=totalSlides){
                slideActual=0;
            }
            mostrarSlide(slideActual);
        }

        function reiniciar(){
            clearInterval(intervalo);
            intervalo=setInterval(siguiente,4000);
        }

        const hero=document.querySelector(".hero");

        hero.addEventListener("mouseenter",()=>{

            clearInterval(intervalo);
        });

        hero.addEventListener("mouseleave",()=>{

            reiniciar();
        });
    }
}); 