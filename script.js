/* ==================================================
   CYBER TETRIS
================================================== */


/* ==================================================
   CONFIGURACIÓN
================================================== */

const FILAS = 20;
const COLUMNAS = 10;


/* ==================================================
   PIEZAS
================================================== */

const PIEZAS = {

    I: [
        [
            [1, 1, 1, 1]
        ],

        [
            [1],
            [1],
            [1],
            [1]
        ]
    ],

    O: [
        [
            [1, 1],
            [1, 1]
        ]
    ],

    T: [
        [
            [0, 1, 0],
            [1, 1, 1]
        ],

        [
            [1, 0],
            [1, 1],
            [1, 0]
        ],

        [
            [1, 1, 1],
            [0, 1, 0]
        ],

        [
            [0, 1],
            [1, 1],
            [0, 1]
        ]
    ],

    S: [
        [
            [0, 1, 1],
            [1, 1, 0]
        ],

        [
            [1, 0],
            [1, 1],
            [0, 1]
        ]
    ],

    Z: [
        [
            [1, 1, 0],
            [0, 1, 1]
        ],

        [
            [0, 1],
            [1, 1],
            [1, 0]
        ]
    ],

    J: [
        [
            [1, 0, 0],
            [1, 1, 1]
        ],

        [
            [1, 1],
            [1, 0],
            [1, 0]
        ],

        [
            [1, 1, 1],
            [0, 0, 1]
        ],

        [
            [0, 1],
            [0, 1],
            [1, 1]
        ]
    ],

    L: [
        [
            [0, 0, 1],
            [1, 1, 1]
        ],

        [
            [1, 0],
            [1, 0],
            [1, 1]
        ],

        [
            [1, 1, 1],
            [1, 0, 0]
        ],

        [
            [1, 1],
            [0, 1],
            [0, 1]
        ]
    ]

};


/* ==================================================
   VARIABLES
================================================== */

let tablero = [];

let piezaActual = null;

let piezaSiguiente = null;

let puntuacion = 0;

let lineasEliminadas = 0;

let nivel = 1;

let juegoActivo = false;

let intervaloCaida = null;

let jugadorActual = "";


/* ==================================================
   ELEMENTOS HTML
================================================== */

const pantallaRegistro =
    document.getElementById("pantalla-registro");

const pantallaJuego =
    document.getElementById("pantalla-juego");

const pantallaRanking =
    document.getElementById("pantalla-ranking");

const formularioRegistro =
    document.getElementById("formulario-registro");

const inputTag =
    document.getElementById("tag");

const errorTag =
    document.getElementById("error-tag");

const tableroHTML =
    document.getElementById("tablero");

const siguientePiezaHTML =
    document.getElementById("siguiente-pieza");

const puntuacionHTML =
    document.getElementById("puntuacion");

const lineasHTML =
    document.getElementById("lineas");

const nivelHTML =
    document.getElementById("nivel");

const tagJugadorHTML =
    document.getElementById("tag-jugador");

const mensajeGameOver =
    document.getElementById("mensaje-game-over");

const puntuacionFinal =
    document.getElementById("puntuacion-final");

const botonRanking =
    document.getElementById("boton-ranking");

const botonNuevaPartida =
    document.getElementById("boton-nueva-partida");

const botonCambiarJugador =
    document.getElementById("boton-cambiar-jugador");

const listaRanking =
    document.getElementById("lista-ranking");

const topGlobal =
    document.getElementById("top-global");


/* ==================================================
   MOSTRAR PANTALLA
================================================== */

function mostrarPantalla(pantalla) {

    document
        .querySelectorAll(".pantalla")
        .forEach((elemento) => {

            elemento.classList.remove("activa");

        });


    pantalla.classList.add("activa");
}


/* ==================================================
   CREAR TABLERO
================================================== */

function crearTablero() {

    tablero = [];

    for (let fila = 0; fila < FILAS; fila++) {

        tablero.push(
            new Array(COLUMNAS).fill(null)
        );

    }
}


/* ==================================================
   CREAR TABLERO HTML
================================================== */

function crearTableroHTML() {

    tableroHTML.innerHTML = "";

    for (let fila = 0; fila < FILAS; fila++) {

        for (
            let columna = 0;
            columna < COLUMNAS;
            columna++
        ) {

            const celda =
                document.createElement("div");

            celda.classList.add("celda");

            tableroHTML.appendChild(celda);
        }
    }
}


/* ==================================================
   ÍNDICE DE CELDA
================================================== */

function obtenerIndice(fila, columna) {

    return fila * COLUMNAS + columna;
}


/* ==================================================
   DIBUJAR TABLERO
================================================== */

function dibujarTablero() {

    const celdas =
        tableroHTML.querySelectorAll(".celda");


    celdas.forEach((celda) => {

        celda.className = "celda";

    });


    for (let fila = 0; fila < FILAS; fila++) {

        for (
            let columna = 0;
            columna < COLUMNAS;
            columna++
        ) {

            const tipo =
                tablero[fila][columna];

            if (tipo) {

                const celda =
                    celdas[
                        obtenerIndice(fila, columna)
                    ];

                celda.classList.add(tipo);

            }
        }
    }


    if (!piezaActual) return;


    const matriz =
        PIEZAS[
            piezaActual.tipo
        ][
            piezaActual.rotacion
        ];


    for (
        let fila = 0;
        fila < matriz.length;
        fila++
    ) {

        for (
            let columna = 0;
            columna < matriz[fila].length;
            columna++
        ) {

            if (!matriz[fila][columna]) continue;


            const x =
                piezaActual.x + columna;

            const y =
                piezaActual.y + fila;


            if (
                y >= 0 &&
                y < FILAS &&
                x >= 0 &&
                x < COLUMNAS
            ) {

                const celda =
                    celdas[
                        obtenerIndice(y, x)
                    ];

                celda.classList.add(
                    piezaActual.tipo
                );

                celda.classList.add(
                    "activa"
                );
            }
        }
    }
}


/* ==================================================
   PIEZA ALEATORIA
================================================== */

function obtenerPiezaAleatoria() {

    const tipos =
        Object.keys(PIEZAS);

    const indice =
        Math.floor(
            Math.random() * tipos.length
        );

    return tipos[indice];
}


/* ==================================================
   CREAR PIEZA
================================================== */

function crearPieza(tipo) {

    return {

        tipo: tipo,

        rotacion: 0,

        x:
            Math.floor(
                (
                    COLUMNAS -
                    PIEZAS[tipo][0][0].length
                ) / 2
            ),

        y: -1

    };
}


/* ==================================================
   COLISIÓN
================================================== */

function hayColision(
    pieza,
    movimientoX,
    movimientoY,
    rotacion
) {

    const matriz =
        PIEZAS[
            pieza.tipo
        ][
            rotacion
        ];


    for (
        let fila = 0;
        fila < matriz.length;
        fila++
    ) {

        for (
            let columna = 0;
            columna < matriz[fila].length;
            columna++
        ) {

            if (!matriz[fila][columna]) continue;


            const x =
                pieza.x +
                movimientoX +
                columna;

            const y =
                pieza.y +
                movimientoY +
                fila;


            if (
                x < 0 ||
                x >= COLUMNAS
            ) {

                return true;

            }


            if (y >= FILAS) {

                return true;

            }


            if (
                y >= 0 &&
                tablero[y][x]
            ) {

                return true;

            }
        }
    }


    return false;
}


/* ==================================================
   MOVER PIEZA
================================================== */

function moverPieza(
    direccionX,
    direccionY
) {

    if (!juegoActivo) return false;


    if (
        !hayColision(
            piezaActual,
            direccionX,
            direccionY,
            piezaActual.rotacion
        )
    ) {

        piezaActual.x += direccionX;

        piezaActual.y += direccionY;

        dibujarTablero();

        return true;
    }


    return false;
}


/* ==================================================
   ROTAR
================================================== */

function rotarPieza() {

    if (!juegoActivo) return;


    const cantidadRotaciones =
        PIEZAS[
            piezaActual.tipo
        ].length;


    const nuevaRotacion =
        (
            piezaActual.rotacion + 1
        ) % cantidadRotaciones;


    if (
        !hayColision(
            piezaActual,
            0,
            0,
            nuevaRotacion
        )
    ) {

        piezaActual.rotacion =
            nuevaRotacion;

        dibujarTablero();

        return;
    }


    const movimientos = [-1, 1, -2, 2];


    for (
        const movimiento
        of movimientos
    ) {

        if (
            !hayColision(
                piezaActual,
                movimiento,
                0,
                nuevaRotacion
            )
        ) {

            piezaActual.x +=
                movimiento;

            piezaActual.rotacion =
                nuevaRotacion;

            dibujarTablero();

            return;
        }
    }
}


/* ==================================================
   FIJAR PIEZA
================================================== */

function fijarPieza() {

    const matriz =
        PIEZAS[
            piezaActual.tipo
        ][
            piezaActual.rotacion
        ];


    for (
        let fila = 0;
        fila < matriz.length;
        fila++
    ) {

        for (
            let columna = 0;
            columna < matriz[fila].length;
            columna++
        ) {

            if (!matriz[fila][columna]) continue;


            const x =
                piezaActual.x + columna;

            const y =
                piezaActual.y + fila;


            if (
                y >= 0 &&
                y < FILAS &&
                x >= 0 &&
                x < COLUMNAS
            ) {

                tablero[y][x] =
                    piezaActual.tipo;

            }
        }
    }
}


/* ==================================================
   ELIMINAR LÍNEAS
================================================== */

function eliminarLineas() {

    let cantidad = 0;


    for (
        let fila = FILAS - 1;
        fila >= 0;
        fila--
    ) {

        const completa =
            tablero[fila].every(
                (celda) =>
                    celda !== null
            );


        if (completa) {

            tablero.splice(fila, 1);

            tablero.unshift(
                new Array(COLUMNAS).fill(null)
            );

            cantidad++;

            fila++;
        }
    }


    if (cantidad === 0) return;


    lineasEliminadas += cantidad;


    const puntosPorLinea = {

        1: 100,
        2: 300,
        3: 500,
        4: 800

    };


    puntuacion +=
        (
            puntosPorLinea[cantidad] ||
            800
        ) * nivel;


    nivel =
        Math.floor(
            lineasEliminadas / 10
        ) + 1;


    actualizarMarcador();

    actualizarVelocidad();
}


/* ==================================================
   SIGUIENTE PIEZA
================================================== */

function siguientePieza() {

    piezaActual =
        crearPieza(
            piezaSiguiente
        );


    piezaSiguiente =
        obtenerPiezaAleatoria();


    mostrarSiguientePieza();


    if (
        hayColision(
            piezaActual,
            0,
            0,
            piezaActual.rotacion
        )
    ) {

        terminarJuego();

        return;
    }


    dibujarTablero();
}


/* ==================================================
   MOSTRAR SIGUIENTE PIEZA
================================================== */

function mostrarSiguientePieza() {

    siguientePiezaHTML.innerHTML = "";


    const matriz =
        PIEZAS[
            piezaSiguiente
        ][0];


    for (
        let fila = 0;
        fila < 4;
        fila++
    ) {

        for (
            let columna = 0;
            columna < 4;
            columna++
        ) {

            const celda =
                document.createElement("div");

            celda.classList.add(
                "pre-celda"
            );


            if (
                matriz[fila] &&
                matriz[fila][columna]
            ) {

                celda.classList.add(
                    piezaSiguiente
                );
            }


            siguientePiezaHTML.appendChild(
                celda
            );
        }
    }
}


/* ==================================================
   CAÍDA
================================================== */

function caida() {

    if (!juegoActivo) return;


    const pudoBajar =
        moverPieza(0, 1);


    if (!pudoBajar) {

        fijarPieza();

        eliminarLineas();

        siguientePieza();
    }
}


/* ==================================================
   CAÍDA INSTANTÁNEA
================================================== */

function caidaInstantanea() {

    if (!juegoActivo) return;


    while (
        moverPieza(0, 1)
    ) {

        puntuacion += 2;
    }


    fijarPieza();

    eliminarLineas();

    siguientePieza();

    actualizarMarcador();
}


/* ==================================================
   MARCADOR
================================================== */

function actualizarMarcador() {

    puntuacionHTML.textContent =
        puntuacion.toLocaleString(
            "es-AR"
        );


    lineasHTML.textContent =
        lineasEliminadas;


    nivelHTML.textContent =
        nivel;
}


/* ==================================================
   VELOCIDAD
================================================== */

function obtenerVelocidad() {

    const velocidad =
        850 -
        (
            (nivel - 1) * 70
        );


    return Math.max(
        velocidad,
        100
    );
}


function actualizarVelocidad() {

    if (!juegoActivo) return;


    clearInterval(
        intervaloCaida
    );


    intervaloCaida =
        setInterval(
            caida,
            obtenerVelocidad()
        );
}


/* ==================================================
   INICIAR JUEGO
================================================== */

function iniciarJuego() {

    clearInterval(
        intervaloCaida
    );


    puntuacion = 0;

    lineasEliminadas = 0;

    nivel = 1;

    juegoActivo = true;


    mensajeGameOver.classList.remove(
        "visible"
    );


    crearTablero();

    crearTableroHTML();


    piezaSiguiente =
        obtenerPiezaAleatoria();


    siguientePieza();


    actualizarMarcador();

    actualizarVelocidad();

    actualizarTopGlobal();


    mostrarPantalla(
        pantallaJuego
    );
}


/* ==================================================
   TERMINAR JUEGO
================================================== */

function terminarJuego() {

    juegoActivo = false;


    clearInterval(
        intervaloCaida
    );


    puntuacionFinal.textContent =
        `${puntuacion.toLocaleString(
            "es-AR"
        )} PUNTOS`;


    mensajeGameOver.classList.add(
        "visible"
    );


    guardarPuntuacion();
}


/* ==================================================
   OBTENER RANKING
================================================== */

function obtenerRanking() {

    const datos =
        localStorage.getItem(
            "cyberTetrisRanking"
        );


    if (!datos) {

        return [];

    }


    try {

        const ranking =
            JSON.parse(datos);


        if (!Array.isArray(ranking)) {

            return [];

        }


        return ranking;

    } catch {

        return [];

    }
}


/* ==================================================
   GUARDAR PUNTUACIÓN
================================================== */

function guardarPuntuacion() {

    const ranking =
        obtenerRanking();


    const jugadorExistente =
        ranking.find(
            (jugador) =>
                jugador.tag === jugadorActual
        );


    if (jugadorExistente) {

        if (
            puntuacion >
            jugadorExistente.puntos
        ) {

            jugadorExistente.puntos =
                puntuacion;
        }

    } else {

        ranking.push({

            tag: jugadorActual,

            puntos: puntuacion

        });

    }


    ranking.sort(
        (a, b) =>
            b.puntos - a.puntos
    );


    localStorage.setItem(
        "cyberTetrisRanking",
        JSON.stringify(ranking)
    );


    /* Actualizar el TOP GLOBAL
       inmediatamente */

    actualizarTopGlobal();
}


/* ==================================================
   TOP GLOBAL
================================================== */

function actualizarTopGlobal() {

    const ranking =
        obtenerRanking();


    topGlobal.innerHTML = "";


    if (ranking.length === 0) {

        topGlobal.innerHTML = `
            <div class="top-global-vacio">
                TODAVÍA NO HAY PUNTUACIONES.
            </div>
        `;

        return;
    }


    const mejoresJugadores =
        ranking.slice(0, 5);


    mejoresJugadores.forEach(
        (jugador, indice) => {

            const fila =
                document.createElement(
                    "div"
                );


            fila.classList.add(
                "top-global-fila"
            );


            const posicion =
                document.createElement(
                    "span"
                );

            posicion.classList.add(
                "top-global-posicion"
            );

            posicion.textContent =
                `#${indice + 1}`;


            const tag =
                document.createElement(
                    "span"
                );

            tag.classList.add(
                "top-global-tag"
            );

            tag.textContent =
                jugador.tag;


            const puntos =
                document.createElement(
                    "span"
                );

            puntos.classList.add(
                "top-global-puntos"
            );

            puntos.textContent =
                jugador.puntos.toLocaleString(
                    "es-AR"
                );


            fila.appendChild(
                posicion
            );

            fila.appendChild(
                tag
            );

            fila.appendChild(
                puntos
            );


            topGlobal.appendChild(
                fila
            );

        }
    );
}


/* ==================================================
   MOSTRAR RANKING COMPLETO
================================================== */

function mostrarRanking() {

    const ranking =
        obtenerRanking();


    listaRanking.innerHTML = "";


    if (ranking.length === 0) {

        listaRanking.innerHTML = `
            <div class="ranking-vacio">
                TODAVÍA NO HAY PUNTUACIONES.
            </div>
        `;

        return;
    }


    ranking.forEach(
        (jugador, indice) => {

            const fila =
                document.createElement(
                    "div"
                );


            fila.classList.add(
                "jugador-ranking"
            );


            const posicion =
                document.createElement(
                    "span"
                );

            posicion.classList.add(
                "posicion"
            );

            posicion.textContent =
                `#${indice + 1}`;


            const nombre =
                document.createElement(
                    "span"
                );

            nombre.classList.add(
                "nombre-ranking"
            );

            nombre.textContent =
                jugador.tag;


            const puntos =
                document.createElement(
                    "span"
                );

            puntos.classList.add(
                "puntos-ranking"
            );

            puntos.textContent =
                jugador.puntos.toLocaleString(
                    "es-AR"
                );


            fila.appendChild(
                posicion
            );

            fila.appendChild(
                nombre
            );

            fila.appendChild(
                puntos
            );


            listaRanking.appendChild(
                fila
            );

        }
    );
}


/* ==================================================
   REGISTRO
================================================== */

formularioRegistro.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const tag =
            inputTag.value
                .trim()
                .toUpperCase();


        errorTag.textContent = "";


        if (tag.length < 3) {

            errorTag.textContent =
                "EL TAG DEBE TENER AL MENOS 3 CARACTERES.";

            return;
        }


        if (!/^[A-Z0-9_]+$/.test(tag)) {

            errorTag.textContent =
                "USÁ SOLAMENTE LETRAS, NÚMEROS Y _";

            return;
        }


        jugadorActual = tag;


        localStorage.setItem(
            "cyberTetrisJugador",
            jugadorActual
        );


        tagJugadorHTML.textContent =
            jugadorActual;


        iniciarJuego();

    }
);


/* ==================================================
   BOTÓN RANKING
================================================== */

botonRanking.addEventListener(
    "click",
    function () {

        mostrarRanking();

        mostrarPantalla(
            pantallaRanking
        );

    }
);


/* ==================================================
   NUEVA PARTIDA
================================================== */

botonNuevaPartida.addEventListener(
    "click",
    function () {

        tagJugadorHTML.textContent =
            jugadorActual;

        iniciarJuego();

    }
);


/* ==================================================
   CAMBIAR JUGADOR
================================================== */

botonCambiarJugador.addEventListener(
    "click",
    function () {

        clearInterval(
            intervaloCaida
        );


        juegoActivo = false;


        inputTag.value = "";

        errorTag.textContent = "";


        mostrarPantalla(
            pantallaRegistro
        );


        inputTag.focus();

    }
);


/* ==================================================
   CONTROLES DE TECLADO
================================================== */

document.addEventListener(
    "keydown",
    function (evento) {

        if (!juegoActivo) return;


        switch (evento.code) {

            case "ArrowLeft":

                evento.preventDefault();

                moverPieza(-1, 0);

                break;


            case "ArrowRight":

                evento.preventDefault();

                moverPieza(1, 0);

                break;


            case "ArrowDown":

                evento.preventDefault();

                if (
                    moverPieza(0, 1)
                ) {

                    puntuacion += 1;

                    actualizarMarcador();

                }

                break;


            case "ArrowUp":

                evento.preventDefault();

                rotarPieza();

                break;


            case "Space":

                evento.preventDefault();

                caidaInstantanea();

                break;

        }

    }
);


/* ==================================================
   CONTROLES MÓVILES
================================================== */

document
    .querySelectorAll(
        ".controles-moviles button"
    )
    .forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                function () {

                    if (!juegoActivo) return;


                    const control =
                        boton.dataset.control;


                    switch (control) {

                        case "left":

                            moverPieza(-1, 0);

                            break;


                        case "right":

                            moverPieza(1, 0);

                            break;


                        case "down":

                            if (
                                moverPieza(0, 1)
                            ) {

                                puntuacion += 1;

                                actualizarMarcador();

                            }

                            break;


                        case "rotate":

                            rotarPieza();

                            break;


                        case "drop":

                            caidaInstantanea();

                            break;

                    }

                }
            );

        }
    );


/* ==================================================
   RECUPERAR ÚLTIMO JUGADOR
================================================== */

const jugadorGuardado =
    localStorage.getItem(
        "cyberTetrisJugador"
    );


if (jugadorGuardado) {

    inputTag.value =
        jugadorGuardado;

}


/* ==================================================
   INICIO
================================================== */

mostrarPantalla(
    pantallaRegistro
);

actualizarTopGlobal();