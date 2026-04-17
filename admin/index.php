<?php
session_start();

// Redirect to dashboard if already logged in
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    
    // Simple password check (admin = password)
    if ($password === 'admin') {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['login_time'] = time();
        header('Location: dashboard.php');
        exit();
    } else {
        $error = 'Ongeldig wachtwoord!';
    }
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baus Admin Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #173f35 0%, #2d6a5f 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
            padding: 3rem 2rem;
        }

        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .login-logo {
            width: 170px;
            max-width: 70%;
            height: auto;
            margin: 0 auto 1rem;
            display: block;
        }

        .login-header h1 {
            color: #173f35;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }

        .login-header p {
            color: #666;
            font-size: 0.9rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            color: #333;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        input[type="password"] {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        input[type="password"]:focus {
            outline: none;
            border-color: #173f35;
        }

        .error-message {
            color: #d32f2f;
            background: #ffebee;
            padding: 0.75rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            display: <?php echo $error ? 'block' : 'none'; ?>;
        }

        button {
            width: 100%;
            padding: 0.75rem;
            background: #173f35;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        button:hover {
            background: #0f2a26;
        }

        button:active {
            transform: scale(0.98);
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <img src="../public/images/logo/baus-logo.png" alt="Baus logo" class="login-logo">
        </div>

        <div class="error-message"><?php echo htmlspecialchars($error); ?></div>

        <form method="POST">
            <div class="form-group">
                <label for="password">Wachtwoord</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Voer wachtwoord in" 
                    autofocus 
                    required
                >
            </div>

            <button type="submit">Inloggen</button>
        </form>
    </div>
</body>
</html>
