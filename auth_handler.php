<?php
session_start();
require 'config.php';

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

    if ($conn->connect_error) {
        $response["error"] = "Connection failed: " . $conn->connect_error;
        echo json_encode($response);
        exit();
    }

    if (isset($_POST["login"])) {
        $email = $_POST["email"];
        $password = $_POST["password"];

        $stmt = $conn->prepare("SELECT id, password, role FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($user_id, $hashed_password, $user_role);
            $stmt->fetch();

            if (password_verify($password, $hashed_password)) {
                $_SESSION["user_id"] = $user_id;
                $_SESSION["email"] = $email;
                $_SESSION["role"] = $user_role;
                $response["redirect"] = ($user_role === "admin") ? "admin_page.php" : "user_page.php";
            } else {
                $response["error"] = "Invalid password.";
            }
        } else {
            $response["error"] = "User not found.";
        }

        $stmt->close();
    }

    if (isset($_POST["register"])) {
        $name = $_POST["name"];
        $email = $_POST["email"];
        $password = password_hash($_POST["password"], PASSWORD_BCRYPT);
        $role = $_POST["role"];

        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $name, $email, $password, $role);

        if ($stmt->execute()) {
            $response["redirect"] = "index.php";
        } else {
            $response["error"] = "Registration failed.";
        }

        $stmt->close();
    }

    $conn->close();
    echo json_encode($response);
}
?>
