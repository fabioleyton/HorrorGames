<?php
// Conexión a la base de datos MySQL
$servername = "localhost";
$username = "root";
$password = "joel231903";
$database = "prueba";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Procesar el formulario de registro
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);  // Encriptar la contraseña

    // Insertar los datos en la tabla usuarios
    $sql = "INSERT INTO usuarios (username, email, password) VALUES ('$usuario', '$email', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "Registro exitoso";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <div class="form-container">
        <h2>Create an Account</h2>
        <form action="register.php" method="post">
            <div class="input-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="input-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="input-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Register</button>
        </form>
        <div class="links">
            <a href="login.php">Already have an account? Login</a>
            <a href="forgot-password.php">Forgot password?</a>
        </div>
    </div>
</body>
</html>

