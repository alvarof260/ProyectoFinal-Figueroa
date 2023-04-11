//recuperar los localstorage
const carrito = JSON.parse(localStorage.getItem('carrito')) || []
console.log(carrito)
const catalogo = JSON.parse(localStorage.getItem('catalogo'))
console.log(catalogo)

//mostrar los productos filtrado
const contenedorRecommend = document.getElementById('reco') //contenedor para mostrar productos recomendados
const productsRecommend = productosArray.filter(({masVendido})=> masVendido === true)//filtrar del array de los productos los productos mas vendidos
renderizarCard(contenedorRecommend, productsRecommend)

//recuperar etiquetas de html
const searchBar = document.getElementById('sea')
const searchBtn = document.getElementById('btn-search')
const containerCarrito = document.getElementById('render-carrito')
const botonesCarrito = document.querySelectorAll('.box-text__btn')
console.log(botonesCarrito)
const iconShopCart = document.getElementById('shopCart')
const containerShopCart = document.getElementById('shopCartDiv-index')
const iconXMark = document.getElementById('x-mark')
const btnVaciar = document.getElementById('deleteAllIndex')
const countProducts = document.getElementById('count')
const totalPrice = document.getElementById('totalPriceIndex')
const navbar = document.getElementById('nav')

//escuchar eventos
searchBar.addEventListener('input',filterProductSearchBar)
botonesCarrito.forEach(boton=> boton.addEventListener('click',agregarCarrito))
console.log(botonesCarrito)
iconShopCart.addEventListener('click',()=>{
    containerShopCart.classList.add('active')
} )
iconXMark.addEventListener('click', ()=>{
    containerShopCart.classList.remove('active')
})
btnVaciar.addEventListener('click', vaciarCarrito)
window.addEventListener('scroll',()=>{
    window.scrollY > 50 ? navbar.classList.add('navbar-transparent') : navbar.classList.remove('navbar-transparent')
})

//renderizar producto
function renderizarCard(contenedor, arrayConProductos) 
{
    arrayConProductos.forEach(({imagen, nombre, precio, id})=>{
        let cardProducto = document.createElement('div')
        cardProducto.className = 'card'
        cardProducto.innerHTML += `
                <div class=card__box-img>
                    <img class=box-img__image src=src/assets/products/${imagen} alt= >
                </div>
                <div class=card__box-text>
                    <h3 class=box-text__title>${nombre}</h3>
                    <span class=box-text__price>$${precio}</span>
                    <br>
                    <button id=${id} class=box-text__btn>Agregar al carrito</button>
                </div>
            `
        contenedor.appendChild(cardProducto)
    })
}

//busqueda del buscador
function filterProductSearchBar()
{
    let arrrayFiltered = catalogo.filter(({tipo})=>tipo.includes(searchBar.value.toLowerCase()))
    actualizarProductos(arrrayFiltered, container)
}

//agregar al carrito
function agregarCarrito(event){
    let botonID = event.target.id
    let productoBuscado = catalogo.find(({id})=>id === Number(botonID))
    let posicionProducto = carrito.findIndex(({id})=>id === productoBuscado.id)

    if (posicionProducto != -1) {
        carrito[posicionProducto].unidades++
        carrito[posicionProducto].stock = carrito[posicionProducto].stock - 1
        carrito[posicionProducto].subtotal = carrito[posicionProducto].precioUnidad * carrito[posicionProducto].unidades 
        console.log(carrito)
        actualizarCarrito()
        renderizarCarrito(carrito, containerCarrito)
        localStorage.setItem('carrito', JSON.stringify(carrito))
    } else {
        carrito.push({
            id:productoBuscado.id,
            nombre:productoBuscado.nombre,
            imagen:productoBuscado.imagen,
            precioUnidad:productoBuscado.precio,
            subtotal: productoBuscado.precio,
            stock: productoBuscado.stock - 1,
            unidades: 1      
        })
        renderizarCarrito(carrito, containerCarrito)
        localStorage.setItem('carrito', JSON.stringify(carrito))
    }
}

//actualizar carrito
function actualizarCarrito() {
    containerCarrito.innerHTML = ''
}

//renderizar carrito
function renderizarCarrito(arrayOfProduct, container) 
{
    actualizarCarrito()
    totalPrice.innerText = `$${compraTotal(carrito)}`
    countProducts.innerText = contadorProductos(carrito)
    arrayOfProduct.forEach(({imagen, nombre, precioUnidad, unidades}) => {
        let productcard = document.createElement('div')
        productcard.className = 'card--shopcart'
        productcard.innerHTML += `
            <div class=card__box-img--shopcart >
                <img class=box-img__image--shopcart src= src/assets/products/${imagen} alt= >
            </div>
            <div class=card__box-text--shopcart >
                <h3 class=box-text__title--shopcart >${nombre}</h3>
                <span class=box-text__price--shopcart >$${precioUnidad}</span>
                <span class=box-text__unites--shopcart>x ${unidades}</span>
            </div>
        `
        container.appendChild(productcard)
    });
}

//vaciar carrito
function vaciarCarrito() {
    carrito.splice(0, carrito.length)
    actualizarCarrito()
    countProducts.innerText = contadorProductos(carrito)
    totalPrice.innerText = `$${compraTotal(carrito)}`
    localStorage.removeItem('carrito')
}

//contador del carrito
function contadorProductos(array) 
{
    return array.reduce((acumulador, {unidades})=>{return acumulador + unidades},0) 
}

//mostrar el precio total
function compraTotal(array) 
{
    return array.reduce((acumulador, {subtotal})=>{return acumulador + subtotal},0) 
}

renderizarCarrito(carrito, containerCarrito)