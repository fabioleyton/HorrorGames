// Formateo dinámico del número de tarjeta
document.getElementById("card-number").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
});

// Formateo dinámico de MM/AA
document.getElementById("expiry-date").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').substring(0, 5);
});
