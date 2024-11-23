// Obtener productos
fetch('http://localhost:3000/obtener_productos')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud al obtener productos');
    }
    return response.json(); // Convierte la respuesta en JSON
  })
  .then(data => {
    console.log('Productos obtenidos:', data);
    // Aquí puedes realizar acciones con los datos, como mostrarlos en el HTML
    const productContainer = document.querySelector('.product-container');
    data.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.innerHTML = `
        <img src="${product.imagen}" alt="${product.nombre}">
        <h2>${product.nombre}</h2>
        <p>${product.descripcion}</p>
        <a href="#" class="btn-buy">Comprar</a>
      `;
      productContainer.appendChild(productCard);
    });
  })
  .catch(error => {
    console.error('Hubo un problema al obtener los productos:', error);
  });

// Agregar producto
const nuevoProducto = {
  nombre: 'Nuevo Producto',
  descripcion: 'Descripción del nuevo producto',
  precio: 99.99,
  imagen: 'ruta/a/la/imagen.jpg' // Asegúrate de incluir una URL válida
};

fetch('http://localhost:3000/agregar_producto', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(nuevoProducto) // Convertir el objeto a JSON
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud al agregar producto');
    }
    return response.json(); // Convierte la respuesta en JSON
  })
  .then(data => {
    console.log('Producto agregado:', data);
    // Aquí puedes actualizar el UI si lo deseas
  })
  .catch(error => {
    console.error('Hubo un problema al agregar el producto:', error);
  });
