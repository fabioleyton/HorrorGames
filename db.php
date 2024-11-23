<?php
$servername = "localhost";
$username = "root"; // Cambia esto si tu usuario de MySQL es diferente
$password = "joel231903"; // Cambia esto si tienes una contraseña para MySQL
$dbname = "prueba";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
