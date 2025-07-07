let carrito = [];

function mostrarOfertas() {
  const contenedor = document.getElementById("ofertas");
  contenedor.innerHTML = "";
  ofertas.slice(0, 4).forEach(producto => {
    contenedor.innerHTML += crearCard(producto, true);
  });
}

function cargarCategorias() {
  const filtros = document.getElementById("filtros");
  productos.forEach(categoria => {
    filtros.innerHTML += `<button class="btn btn-outline-light" onclick="filtrarCategoria('${categoria.categoria}')">${categoria.categoria}</button>`;
  });
}

function filtrarCategoria(nombre) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  const categoria = productos.find(cat => cat.categoria === nombre);
  categoria.items.forEach(item => {
    contenedor.innerHTML += crearCard(item);
  });
}

function crearCard(producto, esOferta = false) {
  return `
    <div class="col-md-3 mb-3">
      <div class="card text-dark">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
          <h5>${producto.nombre}</h5>
          <p>${producto.descripcion}</p>
          <p><strong>$${producto.precio}</strong></p>
          <input type="number" min="1" max="${producto.stock}" value="1" id="cantidad-${producto.id}" class="form-control mb-2">
          <button class="btn btn-primary w-100" onclick="agregarCarrito(${producto.id}, ${producto.precio}, '${producto.nombre}', ${producto.stock})">Agregar</button>
        </div>
      </div>
    </div>
  `;
}

function agregarCarrito(id, precio, nombre, stock) {
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
  if (cantidad > stock) {
    alert("Cantidad mayor al stock disponible");
    return;
  }
  const existente = carrito.find(p => p.id === id);
  if (existente) {
    if (existente.cantidad + cantidad > stock) {
      alert("No hay suficiente stock");
      return;
    }
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id, nombre, cantidad, precio });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("carrito");
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach(p => {
    total += p.precio * p.cantidad;
    lista.innerHTML += `<li>${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toFixed(2)}</li>`;
  });
  document.getElementById("total").textContent = total.toFixed(2);

  const mensaje = carrito.map(p => `${p.nombre} x${p.cantidad}`).join(", ");
  document.getElementById("whatsapp").href = `https://wa.me/?text=Hola%2C+quiero+comprar%3A+${encodeURIComponent(mensaje)}.+Total%3A+$${total.toFixed(2)}`;
}

document.getElementById("buscador").addEventListener("input", function () {
  const texto = this.value.toLowerCase();
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  productos.forEach(cat => {
    cat.items
      .filter(p => p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto))
      .forEach(p => contenedor.innerHTML += crearCard(p));
  });
});

mostrarOfertas();
cargarCategorias();