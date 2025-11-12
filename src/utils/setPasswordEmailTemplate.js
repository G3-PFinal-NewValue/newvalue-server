export const setPasswordEmailTemplate = (firstName, setupUrl) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Establecer tu contraseña</title>
  <style>
    body {
      background-color: #f4f1e8;
      font-family: 'Visby', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
      color: #333333;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ede3d2;
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .header {
      background-color: #295b6e;
      color: #ffffff;
      text-align: center;
      padding: 24px;
      font-family: 'Opun', system-ui, sans-serif;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.5px;
    }

    .body {
      padding: 32px 24px;
      background-color: #ede3d2;
    }

    .body h2 {
      color: #295b6e;
      font-size: 20px;
      margin-bottom: 16px;
      font-family: 'Opun', system-ui, sans-serif;
    }

    .body p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .button {
      display: inline-block;
      background-color: #ee9271;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 10px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: #fd8c69;
    }

    .footer {
      text-align: center;
      font-size: 13px;
      color: #777;
      background-color: #f4f1e8;
      padding: 16px 24px;
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    .footer a {
      color: #295b6e;
      text-decoration: none;
      font-weight: 600;
    }

    @media (max-width: 600px) {
      .email-container {
        margin: 20px;
      }

      .body {
        padding: 24px 16px;
      }

      .button {
        width: 100%;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Cora Mind</h1>
    </div>
    <div class="body">
      <h2>Hola ${firstName || "usuario"},</h2>
      <p>
        Tu cuenta ha sido creada por un administrador.  
        Antes de iniciar sesión, necesitas establecer una contraseña para acceder a tu perfil.
      </p>

      <p style="text-align:center; margin: 30px 0;">
        <a href="${setupUrl}" class="button" target="_blank">
          Crear mi contraseña
        </a>
      </p>

      <p>
        Este enlace expirará en <strong>24 horas</strong> por motivos de seguridad.  
        Si no solicitaste esta cuenta, puedes ignorar este correo.
      </p>
    </div>
    <div class="footer">
      <p>
        © ${new Date().getFullYear()} Cora Mind —  
        <a href="https://coramind.com">coramind.com</a>
      </p>
    </div>
  </div>
</body>
</html>
`;
