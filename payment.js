const form = document.getElementById("payment-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
        usuario: document.getElementById("usuario").value,
        articulo: document.getElementById("articulo").value,
        tarjeta: document.getElementById("tarjeta").value,
        fecha_pago: new Date().toISOString()
    };

    const response = await fetch("http://localhost:3000/api/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);

    if (result.mensaje) {
        alert(result.mensaje);
    }
});
