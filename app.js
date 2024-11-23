let currentSlide = 1;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;

function moveSlide(n) {
    const carouselInner = document.querySelector('.carousel-inner');
    currentSlide += n;

    // Transición suave
    carouselInner.style.transition = 'transform 0.5s ease-in-out';
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Verifica si llegamos al final o principio y ajusta sin que el usuario lo note
    if (currentSlide >= totalSlides - 1) {
        setTimeout(() => {
            carouselInner.style.transition = 'none';
            currentSlide = 1; // Volvemos al primer slide real
            carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
        }, 500);
    }

    if (currentSlide <= 0) {
        setTimeout(() => {
            carouselInner.style.transition = 'none';
            currentSlide = totalSlides - 2; // Volvemos al último slide real
            carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
        }, 500);
    }
}

// Clonar las primeras y últimas imágenes
function cloneSlides() {
    const carouselInner = document.querySelector('.carousel-inner');
    const firstSlide = slides[0].cloneNode(true);
    const lastSlide = slides[totalSlides - 1].cloneNode(true);

    // Añadir los clones
    carouselInner.appendChild(firstSlide);
    carouselInner.insertBefore(lastSlide, slides[0]);
}

// Inicializar carrusel infinito
cloneSlides();

// Cargar productos dinámicamente desde la API de PHP
fetch('api.php?action=productos')
    .then(response => response.json())
    .then(data => {
        const productosDiv = document.getElementById('productos');
        data.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
                <h2>${producto.nombre}</h2>
                <p>${producto.descripcion}</p>
                <p>Precio: $${producto.precio}</p>
                <a href="${producto.url_producto}" target="_blank">Ver Producto</a>
            `;
            productosDiv.appendChild(productoDiv);
        });
    })
    .catch(error => console.log('Error al cargar los productos:', error));

// Redirigir a una sección específica
function redirigirASeccion(seccion) {
    fetch(`api.php?action=seccion&nombre=${seccion}`)
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Sección no encontrada');
            }
        })
        .catch(error => console.log('Error al redirigir:', error));
}