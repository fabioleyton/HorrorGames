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
    $usuario = $_POST['username'];
    $password = $_POST['password'];

    // Buscar el usuario en la base de datos
    $sql = "SELECT * FROM usuarios WHERE username='$usuario'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Obtener los datos del usuario
        $row = $result->fetch_assoc();
        // Verificar la contraseña
        if (password_verify($password, $row['password'])) {
            // Redirigir a index.html
            header("Location: index.html");
            exit();  // Asegura que no se ejecute más código
        } else {
            echo "Contraseña incorrecta";
        }
    } else {
        echo "Usuario no encontrado";
    }
}

$conn->close();
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <div class="form-container">
        <h2>Login</h2>
        <form action="login.php" method="post">
            <div class="input-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="input-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Login</button>
        </form>
        <div class="links">
            <a href="register.php">Create an account</a>
            <a href="forgot-password.php">Forgot password?</a>
        </div>
    </div>
</body>
</html>
