//recuperar los localstorage
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const favs = JSON.parse(localStorage.getItem("favs")) || [];

fetch("./src/js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    const productosArray = data;
    renderizarCard(productosArray);
    const bottonsCarrito = document.querySelectorAll(".buttons__btn");
    bottonsCarrito.forEach((boton) =>
      boton.addEventListener("click", (event) => {
        agregarCarrito(event, productosArray);
      })
    );
    const bottonsFavs = document.querySelectorAll(".buttons__btn-fav");
    bottonsFavs.forEach((boton) =>
      boton.addEventListener("click", (event) => {
        agregarFavoritos(event, productosArray);
      })
    );
  });

//recuperar etiquetas de html
const searchBar = document.getElementById("sea");
const searchBtn = document.getElementById("btn-search");
const containerCarrito = document.getElementById("render-carrito");
const iconShopCart = document.getElementById("shopCart");
const containerShopCart = document.getElementById("shopCartDiv-index");
const iconXMark = document.getElementById("x-mark");
const btnDeleteAll = document.getElementById("deleteAllIndex");
const countProducts = document.getElementById("count");
const totalPrice = document.getElementById("totalPriceIndex");
const navbar = document.getElementById("nav");
const btnBuy = document.getElementById("buyNow");

//escuchar eventos
searchBar.addEventListener("input", filterProductSearchBar);

iconShopCart.addEventListener("click", () => {
  containerShopCart.classList.add("active");
});
iconXMark.addEventListener("click", () => {
  containerShopCart.classList.remove("active");
});
btnDeleteAll.addEventListener("click", vaciarCarrito);
btnBuy.addEventListener("click", comprar);
window.addEventListener("scroll", () => {
  window.scrollY > 50
    ? navbar.classList.add("navbar-transparent")
    : navbar.classList.remove("navbar-transparent");
});

//renderizar producto
function renderizarCard(array) {
  const contenedorRecommend = document.getElementById("reco");
  const productsRecommend = array.filter(
    ({ masVendido }) => masVendido === true
  );
  productsRecommend.forEach(({ imagen, nombre, precio, id }) => {
    let cardProducto = document.createElement("div");
    cardProducto.className = "card";
    cardProducto.innerHTML += `
                <div class=card__box-img>
                    <img class=box-img__image src=src/assets/products/${imagen} alt= >
                </div>
                <div class=card__box-text>
                    <h3 class=box-text__title>${nombre}</h3>
                    <span class=box-text__price>$${precio}</span>
                    <br>
                    <div class=box-text__buttons>
                        <button class=buttons__btn id=${id}>Agregar al Carrito</button>
                        <button class=buttons__btn-fav data-id=${id}><i data-id=${id} class="fa-regular fa-heart"></i></button>
                    </div>
                </div>
            `;
    contenedorRecommend.appendChild(cardProducto);
  });
}

//busqueda del buscador
function filterProductSearchBar() {
  Swal.fire("no se puede filtrar en esta pagina, ve a categorias para poder hacerlo");
  searchBar.value = ""
}

//agregar al carrito
function agregarCarrito(event, array) {
  let botonID = event.target.id;
  let productoBuscado = array.find(({ id }) => id === Number(botonID));
  let posicionProducto = carrito.findIndex(
    ({ id }) => id === productoBuscado.id
  );

  Toastify({
    text: "agregaste un producto",
    duration: 1500,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: "alert-add",
  }).showToast();

  if (posicionProducto != -1) {
    carrito[posicionProducto].unidades++;
    carrito[posicionProducto].stock = carrito[posicionProducto].stock - 1;
    carrito[posicionProducto].subtotal =
      carrito[posicionProducto].precioUnidad *
      carrito[posicionProducto].unidades;
    actualizarCarrito();
    renderizarCarrito(carrito, containerCarrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } else {
    carrito.push({
      id: productoBuscado.id,
      nombre: productoBuscado.nombre,
      imagen: productoBuscado.imagen,
      precioUnidad: productoBuscado.precio,
      subtotal: productoBuscado.precio,
      stock: productoBuscado.stock - 1,
      unidades: 1,
    });
    renderizarCarrito(carrito, containerCarrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}

//agregar favoritos
function agregarFavoritos(e, array) {
  let botonID = e.target.attributes["data-id"].value;
  let productoBuscado = array.find(({ id }) => id === Number(botonID));
  let productoPosicion = favs.findIndex(({ id }) => id === productoBuscado.id);
  if (productoPosicion === -1) {
    Toastify({
      text: "agregaste a favoritos",
      duration: 1500,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "alert-favs",
    }).showToast();
    favs.push(productoBuscado);
    localStorage.setItem("favs", JSON.stringify(favs));
  }
}

//actualizar carrito
function actualizarCarrito() {
  containerCarrito.innerHTML = "";
}

//renderizar carrito
function renderizarCarrito(arrayOfProduct, container) {
  actualizarCarrito();
  totalPrice.innerText = `$${compraTotal(carrito)}`;
  countProducts.innerText = contadorProductos(carrito);
  arrayOfProduct.forEach(({ imagen, nombre, precioUnidad, unidades, id }) => {
    let productcard = document.createElement("div");
    productcard.className = "card--shopcart";
    productcard.innerHTML += `
            <div class=card__box-img--shopcart >
                <img class=box-img__image--shopcart src= src/assets/products/${imagen} alt= >
            </div>
            <div class=card__box-text--shopcart >
                <h3 class=box-text__title--shopcart >${nombre}</h3>
                <span class=box-text__price--shopcart >$${precioUnidad}</span>
                <span class=box-text__unites--shopcart>x ${unidades}</span>
                <button class=box-text__btn--shopcart ><i class="fa-regular fa-trash-can"  id=${id}></i></button>
            </div>
        `;
    container.appendChild(productcard);
  });
  const deleteProduct = document.querySelectorAll(".box-text__btn--shopcart");
  deleteProduct.forEach((btn) => btn.addEventListener("click", borrarProducto));
}

//vaciar carrito
function vaciarCarrito() {
  if (carrito.length != 0) {
    Swal.fire({
      title: "Estas seguro?",
      text: `vas a eliminar ${contadorProductos(carrito)} productos`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3772FF",
      cancelButtonColor: "#DF2935",
      confirmButtonText: "Si,quiero vaciar carrito!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "borrado!",
          "se logró borrar todo los productos del carrito",
          "success"
        );
        carrito.splice(0, carrito.length);
        actualizarCarrito();
        countProducts.innerText = contadorProductos(carrito);
        totalPrice.innerText = `$${compraTotal(carrito)}`;
        localStorage.removeItem("carrito");
      }
    });
  } else {
    Swal.fire("No hay nada para borrar en el carrito de compra");
  }
}

//borrar producto en especifico
function borrarProducto(e) {
  Toastify({
    text: "eliminaste un producto",
    duration: 1500,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: "alert-delete",
  }).showToast();
  let botonID = e.target.id;
  let posicionProducto = carrito.findIndex(({ id }) => id === Number(botonID));
  carrito.splice(posicionProducto, 1);
  actualizarCarrito();
  renderizarCarrito(carrito, containerCarrito);
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

//contador del carrito
function contadorProductos(array) {
  return array.reduce((acumulador, { unidades }) => {
    return acumulador + unidades;
  }, 0);
}

//mostrar el precio total
function compraTotal(array) {
  return array.reduce((acumulador, { subtotal }) => {
    return acumulador + subtotal;
  }, 0);
}

//comprar productos del carrito
function comprar() {
  if (carrito.length != 0) {
    Swal.fire({
      title: "Estas seguro?",
      text: `precio final es de ${compraTotal(
        carrito
      )}, es un total de ${contadorProductos(carrito)} productos`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3772FF",
      cancelButtonColor: "#DF2935",
      confirmButtonText: "Si,quiero comprar todo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "compra con exito!",
          "se logró comprar todo los productos del carrito",
          "success"
        );
        carrito.splice(0, carrito.length);
        actualizarCarrito();
        countProducts.innerText = contadorProductos(carrito);
        totalPrice.innerText = `$${compraTotal(carrito)}`;
        localStorage.removeItem("carrito");
      }
    });
  } else {
    Swal.fire("No hay nada para comprar en el carrito de compra");
  }
}

renderizarCarrito(carrito, containerCarrito);

//slider

let countSlider = 1;
setInterval(() => {
  let boton = document.getElementById("r" + countSlider);
  boton.checked = true;
  countSlider++;
  if (countSlider > 3) {
    countSlider = 1;
  }
}, 5000);
