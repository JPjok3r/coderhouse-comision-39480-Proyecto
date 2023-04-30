/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/

/* metodo para la lista de juegos 
crearListaJuegos(){
    this.gameList = [
        new Juego(1, "The last of us: Part I PC", ["Survival", "Zombies", "Accion", "Aventura"], 54.99, 0, 4, "./assets/img/tlou.png"),
        new Juego(2, "Resident Evil 4 Remake", ["Survival", "Zombies", "Accion", "Aventura"], 59.99, 0, 5, "./assets/img/re4r.png"),
        new Juego(3, "Darksiders III", ["RPG", "Accion", "Aventura"], 35.99, 20, 0, "./assets/img/darksiders3.png"),
        new Juego(4, "Grand Theft Auto V", ["Accion", "Aventura"], 29.99, 60, 5, "./assets/img/gtav.png"),
        new Juego(5, "Assassins Creed Valhalla", ["RPG", "Accion", "Aventura"], 49.99, 0, 4, "./assets/img/acv.png"),
        new Juego(6, "FIFA 23", ["Deportes", "Simulacion"], 49.99, 50, 0, "./assets/img/fifa23.png"),
        new Juego(7, "Hogwarts Legacy", ["RPG", "Accion", "Aventura"], 59.99, 0, 0, "./assets/img/legacy.png"),
        new Juego(8, "Sons of the Forest", ["Simulacion", "Indie", "Accion", "Aventura"], 29.99, 10, 3, "./assets/img/sotf.png"),
        new Juego(9, "Forza Horizon 4", ["Carreras", "Autos", "Accion", "Aventura"], 39.99, 15, 4, "./assets/img/forzah.png"),
        new Juego(10, "Rust + DLC", ["MMO", "Indie", "Accion", "Aventura", "RPG"], 107, 30, 0, "./assets/img/rust.png")
    ];
} */

const category = ["Survival", "Zombies", "Accion", "Aventura", "RPG", "MMO", "Indie", "Simulacion", "Carreras", "Estrategia"];

class Juego{
    constructor (id, nombre, categoria, precio, descuento, rate, imgsrc){
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.descuento = descuento;
        this.rate = rate;
        this.imgsrc = imgsrc;
    }
}

class JuegosSupervisor {
    constructor(){
        this.gameList = [];
        this.contenedorJuegos = document.getElementById("contenedorJuegos"); 
    }

    async crearListaJuegos(){
        const res = await fetch('../www.juegos_db.json');
        this.gameList = await res.json();
        this.iniciarDOM();
    }

    limpiarDom(){
        this.contenedorJuegos.innerHTML = '';
    }

    iniciarDOM(showList=this.gameList){
        showList.forEach((juego, index) => {
            this.contenedorJuegos.innerHTML += `
            <div class="col mb-5">
                <div class="card h-100">
                    <!-- Sale badge-->
                    ${juego.descuento !== 0 ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>':''}
                    <!-- Product image-->
                    <img class="card-img-top" src="${juego.imgsrc}" alt="${juego.nombre}" />
                    <!-- Product details-->
                    <div class="card-body p-4">
                        <div class="text-center">
                            <!-- Product name-->
                            <h5 class="fw-bolder">${juego.nombre}</h5>
                            <!-- Product reviews-->
                            ${verificarRate(juego.rate)}
                            <!-- Product price-->
                            ${juego.descuento !== 0 ? '<span class="text-muted text-decoration-line-through">$'+juego.precio+'</span>\n$'+calcularDecuento(juego.precio,juego.descuento).toFixed(2):'$'+juego.precio}
                        </div>
                    </div>
                    <!-- Product actions-->
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#" id="game${juego.id}" onclick="agregarCarrito(${juego.id}, ${index})">Agregar al carrito</a></div>
                    </div>
                </div>
            </div>`;
        });
    }

    obtenerJuego(i){
        return this.gameList[i];
    }
}

class supervisorCarrito{
    constructor(){
        this.cartList = [];
        this.contenedorCarrito = document.getElementById("contenedor_carrito");
    }

    obtenerCartList(){
        return this.cartList;
    }

    agregarJuego(juego){
        this.cartList.push({"juego":juego, "cantidad": 1});
        this.almacenarEnStorage();
        this.mostrarCartDOM({"juego":juego, "cantidad": 1})
        document.getElementById("cartCantElements").innerHTML = this.cartList.length;
    }

    almacenarEnStorage(){
        let listaJuegosJSON = JSON.stringify(this.cartList);
        localStorage.setItem("listaJuegos", listaJuegosJSON);
    }

    verificarDatosEnStorage(){
        this.cartList = JSON.parse(localStorage.getItem('listaJuegos')) || [];
        if(this.cartList.length > 0){
            this.iniciarCartDOM();
        }
    }

    limpiarContenedor(){
        this.contenedorCarrito.innerHTML = '';
    }

    limpiarLocalStorage(){
        localStorage.removeItem("listaJuegos");
        this.cartList = [];
    }

    iniciarCartDOM(){
        this.limpiarContenedor();
        this.cartList.forEach(item => {
            this.mostrarCartDOM(item)
        });
        document.getElementById("cartCantElements").innerHTML = this.cartList.length;
    }

    mostrarCartDOM(item){
        this.contenedorCarrito.innerHTML += `
            <div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img src="${item.juego.imgsrc}" class="img-fluid rounded-start cartImage" alt="${item.juego.nombre}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.juego.nombre}</h5>
                            <p class="card-text">Descripcion: ${item.juego.categoria.forEach(val=>{val})}</p>
                            <p class="card-text">Precio: $${calcularDecuento(item.juego.precio,item.juego.descuento).toFixed(2)}</p>
                            <p class="card-text" id="${item.juego.id}">Cantidad  ${item.cantidad}</p>  
                            <button type="button" class="btn btn-primary btn-sm" onclick="verificarCantidad(${item.juego.id}, 'resta')">-</button><button type="button" class="btn btn-primary btn-sm" onclick="verificarCantidad(${item.juego.id}, 'suma')">+</button>
                            <button type="button" class="btn btn-danger btn-sm" onclick="borrarItem(${item.juego.id})"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>`;
        this.actualizarTotal();
    }

    borrarItemCart(id){
        let pos = this.cartList.findIndex(item => item.juego.id == id);
        if(  !(pos == -1)   ){
            this.cartList.splice(pos, 1);
            this.almacenarEnStorage();
            this.iniciarCartDOM();
        }
        
    }

    actualizarLista(listaCartActualizada){
        this.cartList = listaCartActualizada;
        this.almacenarEnStorage();
    }

    actualizarTotal(){
        let total = 0;
        this.cartList.forEach(item => {
            if(item.juego.descuento !== 0){
                total += calcularDecuento(item.juego.precio, item.juego.descuento).toFixed(2) * item.cantidad;
            } else{
                total += item.juego.precio*item.cantidad;
            }
        });
        document.getElementById("totalCart").innerHTML = `Total: $${total.toFixed(2)}`;
    }
}

//Instancias de las clases para controlar Juegos y Carrito
const gamesManager = new JuegosSupervisor();
const cartManager = new supervisorCarrito();

//Inicio y generar DOM
gamesManager.crearListaJuegos();
//Verificar si hay algo en localStorage para el carrito
cartManager.verificarDatosEnStorage();
//Mostramos las categorias para las busquedas
llenarCategorias();
category.forEach((val,index) => {
    const liMenuCat = document.getElementById(`li-${index+1}`);
    liMenuCat.addEventListener('click', () => {
        const res = gamesManager.gameList.filter(juego => juego.categoria.includes(val));
        gamesManager.limpiarDom();
        gamesManager.iniciarDOM(res);
    });
});
document.getElementById("li-todos").addEventListener('click', () => {
    gamesManager.limpiarDom();
    gamesManager.iniciarDOM();
});


function agregarCarrito(id,index){
    let listaCarrito = cartManager.obtenerCartList();
    if(listaCarrito.length < 1){
        cartManager.agregarJuego(gamesManager.obtenerJuego(index));
        Toastify({
            text: "Juego añadido a carrito",
            duration: 1000,
            gravity: "top",
            position: "right",
            style: {
                background: "rgb(0,0,9)",
                background: "linear-gradient(90deg, rgba(0,0,9,1) 0%, rgba(198,8,8,1) 50%, rgba(0,0,0,1) 100%)"
            }
            }).showToast();
    } else {
        let controlador = false;
        let agregado = {};
        listaCarrito.forEach(item => {
            if(item.juego.id === id){
                controlador = true;
                agregado = item;
            }
        });
        controlador ? verificarCantidad(agregado.juego.id, "suma"):cartManager.agregarJuego(gamesManager.obtenerJuego(index));
        controlador ? Toastify({
            text: "Aumentando la cantidad del mismo juego",
            duration: 1000,
            gravity: "top",
            position: "right",
            style: {
                background: "rgb(0,0,9)",
                background: "linear-gradient(90deg, rgba(0,0,9,1) 0%, rgba(198,8,8,1) 50%, rgba(0,0,0,1) 100%)"
            }
            }).showToast():
            Toastify({
                text: "Juego añadido a carrito",
                duration: 1000,
                gravity: "top",
                position: "right",
                style: {
                    background: "rgb(0,0,9)",
                    background: "linear-gradient(90deg, rgba(0,0,9,1) 0%, rgba(198,8,8,1) 50%, rgba(0,0,0,1) 100%)"
                }
                }).showToast();
    }
}

function borrarItem(id){
    cartManager.borrarItemCart(id);
}

function calcularDecuento(pre, des){
    return pre * (1-(des/100));
}

//Incrementar o reducir la cantidad de un juego en carrito
function verificarCantidad(id, operacion){
    let listaCarrito = cartManager.obtenerCartList();
    switch(operacion){
        case 'suma':
            listaCarrito.forEach(item => {
                if(item.juego.id === id){
                    item.cantidad++;
                    document.getElementById(`${id}`).innerHTML = `Cantidad: ${item.cantidad}`;
                }
            });
            break;
        case 'resta':
            listaCarrito.forEach(item => {
                if(item.juego.id === id){
                    if(item.cantidad === 1){
                        Swal.fire({
                            title: 'ERROR!!',
                            text: 'No se puede seguir restando la cantidad',
                            icon: 'error',
                            confirmButtonText: '¡Si!'
                        });
                    } else{
                        item.cantidad--;
                        document.getElementById(`${id}`).innerHTML = `Cantidad: ${item.cantidad}`;
                    }
                }
            });
            break;
    }
    cartManager.actualizarLista(listaCarrito);
    cartManager.actualizarTotal();
}

function verificarRate(opRate){
    let res = '';
    switch(opRate) {
        case 1:
            res = `<div class="d-flex justify-content-center small text-warning mb-2">
                        <div class="bi-star-fill"></div>
                    </div>`
            break;
        case 2:
            res = `<div class="d-flex justify-content-center small text-warning mb-2">
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                    </div>`
            break;
        case 3:
            res = `<div class="d-flex justify-content-center small text-warning mb-2">
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                    </div>`
            break;
        case 4:
            res = `<div class="d-flex justify-content-center small text-warning mb-2">
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                    </div>`
            break;
        case 5:
            res = `<div class="d-flex justify-content-center small text-warning mb-2">
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                        <div class="bi-star-fill"></div>
                    </div>`
            break;
        default:
            res = '';
            break;
    }
    return res;
}

function llenarCategorias() {
    let opciones = '';
    category.forEach((val, index) => {
        opciones += `<li><a class="dropdown-item" href="#!" id="li-${index+1}">${val}</a></li>`;
    });
    document.getElementById("categorias").innerHTML += opciones;
}

function generarCodigo() {
    var codigo = [];
    for (var i = 0; i < 3; i++) {
      codigo.push(Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0'));
    }
    return codigo.join('-');
}

const finCompra = document.getElementById("finCompras");
finCompra.addEventListener('click', ()=>{
    let listaCarro = cartManager.obtenerCartList();
    if(listaCarro.length > 0){
        let mensaje = 'Estas son sus claves:<br>';
        listaCarro.forEach(item => {
            for (let i = 0; i < item.cantidad; i++) {
                mensaje += `Cod.: ${item.juego.nombre} -> ${generarCodigo()}<br>`;
            }
        });
        mensaje += 'Puede canjear los codigos en Steam.';
        Swal.fire({
            title: 'Éxito en la compra!!!',
            html: mensaje,
            icon: 'success',
            confirmButtonText: '¡Entendido!'
        });
        cartManager.limpiarContenedor();
        cartManager.limpiarLocalStorage();
        document.getElementById("cartCantElements").innerHTML = 0;
    } else{
        Swal.fire({
            title: 'INFO!!',
            html: 'El carrito está vacío!!',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
    
});