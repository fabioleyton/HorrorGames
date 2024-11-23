<?php
// Conexión a la base de datos MySQL
$servername = "localhost";
$username = "root";
$password = "joel231903";
$database = "prueba";

$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    // Buscar el correo en la base de datos
    $sql = "SELECT * FROM usuarios WHERE email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Simulación de recuperación de contraseña (normalmente enviarías un correo aquí)
        echo "Correo encontrado. Se ha enviado un enlace de recuperación a su correo.";
    } else {
        echo "Correo no encontrado";
    }
}

$conn->close();
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <div class="form-container">
        <h2>Forgot Password</h2>
        <form action="forgot-password.php" method="post">
            <div class="input-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <button type="submit" class="btn">Reset Password</button>
        </form>
        <div class="links">
            <a href="login.php">Remember your password? Login</a>
            <a href="register.php">Create an account</a>
        </div>
    </div>
</body>
</html>
