<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
// Permitir ciertos encabezados
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db.php'; // Asegúrate de que db.php esté configurado correctamente.

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM productos";
        $result = mysqli_query($conn, $sql);
        $productos = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $productos[] = $row;
        }

        echo json_encode($productos);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (isset($data['nombre'], $data['descripcion'], $data['precio'], $data['imagen'])) {
            $nombre = mysqli_real_escape_string($conn, $data['nombre']);
            $descripcion = mysqli_real_escape_string($conn, $data['descripcion']);
            $precio = mysqli_real_escape_string($conn, $data['precio']);
            $imagen = mysqli_real_escape_string($conn, $data['imagen']);

            $sql = "INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES ('$nombre', '$descripcion', '$precio', '$imagen')";
            if (mysqli_query($conn, $sql)) {
                echo json_encode(['message' => 'Producto agregado correctamente']);
            } else {
                echo json_encode(['message' => 'Error al agregar producto', 'error' => mysqli_error($conn)]);
            }
        } else {
            echo json_encode(['message' => 'Datos incompletos']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (isset($data['id'], $data['nombre'], $data['descripcion'], $data['precio'], $data['imagen'])) {
            $id = mysqli_real_escape_string($conn, $data['id']);
            $nombre = mysqli_real_escape_string($conn, $data['nombre']);
            $descripcion = mysqli_real_escape_string($conn, $data['descripcion']);
            $precio = mysqli_real_escape_string($conn, $data['precio']);
            $imagen = mysqli_real_escape_string($conn, $data['imagen']);

            $sql = "UPDATE productos SET nombre='$nombre', descripcion='$descripcion', precio='$precio', imagen='$imagen' WHERE id='$id'";
            if (mysqli_query($conn, $sql)) {
                echo json_encode(['message' => 'Producto actualizado correctamente']);
            } else {
                echo json_encode(['message' => 'Error al actualizar producto', 'error' => mysqli_error($conn)]);
            }
        } else {
            echo json_encode(['message' => 'Datos incompletos']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $id = mysqli_real_escape_string($conn, $_GET['id']);
            $sql = "DELETE FROM productos WHERE id='$id'";
            if (mysqli_query($conn, $sql)) {
                echo json_encode(['message' => 'Producto eliminado correctamente']);
            } else {
                echo json_encode(['message' => 'Error al eliminar producto', 'error' => mysqli_error($conn)]);
            }
        } else {
            echo json_encode(['message' => 'ID no especificado']);
        }
        break;

    default:
        echo json_encode(['message' => 'Método no permitido']);
        break;
}

mysqli_close($conn);
?>
