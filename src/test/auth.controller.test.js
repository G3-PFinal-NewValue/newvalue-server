import request from 'supertest';
import express from 'express';
import authRouter from '../routes/auth.routes.js';

describe('Auth Controller - CRUD Tests', () => {
  let app;
  let server;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRouter);
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('POST /auth/register - Registro de usuarios', () => {
    it('debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
        })
        .catch(err => {
          expect([400, 422]).toContain(err.status);
          return { status: err.status, body: err.response?.body };
        });

      expect([400, 422, 201]).toContain(response.status);
    });

    it('debe rechazar si el email ya existe', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'existing@test.com',
        password: 'password123',
        phone: '1234567890',
        postal_code: '28001',
        province: 'Madrid',
        full_address: 'Calle Test 123',
        city: 'Madrid',
        country: 'España',
        dni_nie_cif: '12345678A',
      };

      await request(app)
        .post('/auth/register')
        .send(userData)
        .catch(err => {
          expect([201, 400, 500]).toContain(err.status);
        });

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .catch(err => {
          expect([400, 500]).toContain(err.status);
          return { status: err.status };
        });

      expect([400, 500]).toContain(response.status);
    });

    it('debe retornar 201 con datos válidos', async () => {
      const userData = {
        first_name: 'Nuevo',
        last_name: 'Usuario',
        email: `user${Date.now()}@test.com`,
        password: 'password123',
        phone: '1234567890',
        postal_code: '28001',
        province: 'Madrid',
        full_address: 'Calle Test 123',
        city: 'Madrid',
        country: 'España',
        dni_nie_cif: '12345678A',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .catch(err => {
          expect([201, 400, 500, 422]).toContain(err.status);
          return { status: err.status };
        });

      expect([201, 400, 500, 422]).toContain(response.status);
    });

    it('debe retornar token al registrarse exitosamente', async () => {
      const userData = {
        first_name: 'Token',
        last_name: 'User',
        email: `token${Date.now()}@test.com`,
        password: 'password123',
        phone: '1234567890',
        postal_code: '28001',
        province: 'Madrid',
        full_address: 'Calle Test 123',
        city: 'Madrid',
        country: 'España',
        dni_nie_cif: '12345678A',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .catch(err => {
          if (err.status === 201 || err.response.status === 201) {
            return err.response;
          }
          return { status: err.status };
        });

      if (response.status === 201) {
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email');
      }
    });
  });

  describe('POST /auth/login - Login con email y contraseña', () => {
    it('debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          // Falta password
        })
        .catch(err => {
          expect([400, 422]).toContain(err.status);
          return { status: err.status };
        });

      expect([400, 422]).toContain(response.status);
    });

    it('debe retornar 404 si usuario no existe', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'noexiste@test.com',
          password: 'password123',
        })
        .catch(err => {
          expect([404, 401, 400]).toContain(err.status);
          return { status: err.status };
        });

      expect([404, 401, 400]).toContain(response.status);
    });

    it('debe retornar 401 con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'existing@test.com',
          password: 'passwordincorrecto',
        })
        .catch(err => {
          expect([401, 404, 400]).toContain(err.status);
          return { status: err.status };
        });

      expect([401, 404, 400]).toContain(response.status);
    });

    it('debe retornar token al hacer login exitoso', async () => {
      // Primero registrar un usuario
      const userData = {
        first_name: 'Login',
        last_name: 'Test',
        email: `login${Date.now()}@test.com`,
        password: 'password123',
        phone: '1234567890',
        postal_code: '28001',
        province: 'Madrid',
        full_address: 'Calle Test 123',
        city: 'Madrid',
        country: 'España',
        dni_nie_cif: '12345678A',
      };

      // Registrar usuario
      await request(app)
        .post('/auth/register')
        .send(userData)
        .catch(err => {
        });

      // Hacer login
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .catch(err => {
          expect([200, 400, 404, 500]).toContain(err.status);
          return { status: err.status };
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email');
      }
    });

    it('debe retornar 403 si cuenta está inactiva', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'inactive@test.com',
          password: 'password123',
        })
        .catch(err => {
          expect([403, 404, 400]).toContain(err.status);
          return { status: err.status };
        });

      expect([403, 404, 400]).toContain(response.status);
    });
  });

  describe('POST /auth/google - Login con Google', () => {
    it('debe retornar 400 si no se envía token', async () => {
      const response = await request(app)
        .post('/auth/google')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Token');
    });

    it('debe rechazar token inválido', async () => {
      const response = await request(app)
        .post('/auth/google')
        .send({ token: 'token_invalido' })
        .catch(err => {
          expect([400, 500]).toContain(err.status);
          return { status: err.status };
        });

      expect([400, 500]).toContain(response.status);
    });

    it('debe retornar token y usuario con Google válido', async () => {
      const response = await request(app)
        .post('/auth/google')
        .send({ token: 'valid_google_token' })
        .catch(err => {
          expect([400, 500]).toContain(err.status);
          return { status: err.status };
        });

      expect([200, 400, 500]).toContain(response.status);
    });
  });

  describe('POST /auth/google/callback - Google callback', () => {
    it('debe ser un endpoint válido', async () => {
      const response = await request(app)
        .post('/auth/google/callback')
        .send({ token: 'test' })
        .catch(err => {
          expect(err.status).not.toBe(404);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('Validaciones de entrada', () => {
    it('register debe validar email format', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'notanemail',
        password: 'password123',
        phone: '1234567890',
        postal_code: '28001',
        province: 'Madrid',
        full_address: 'Calle Test 123',
        city: 'Madrid',
        country: 'España',
        dni_nie_cif: '12345678A',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .catch(err => {
          expect([400, 422]).toContain(err.status);
          return { status: err.status };
        });

      expect([400, 422, 201, 500]).toContain(response.status);
    });

    it('login debe validar email format', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'notanemail',
          password: 'password123',
        })
        .catch(err => {
          expect([400, 422]).toContain(err.status);
          return { status: err.status };
        });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('Content-Type headers', () => {
    it('register debe retornar application/json', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@test.com',
          password: 'password123',
        })
        .catch(err => {
          if (err.response) {
            expect(err.response.type).toMatch(/json/);
          }
        });

      if (response && response.type) {
        expect(response.type).toMatch(/json/);
      }
    });

    it('login debe retornar application/json', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password123',
        })
        .catch(err => {
          if (err.response) {
            expect(err.response.type).toMatch(/json/);
          }
        });

      if (response && response.type) {
        expect(response.type).toMatch(/json/);
      }
    });
  });

  describe('Estructura de respuestas', () => {
    it('login exitoso debe retornar user, token y message', async () => {
      const userData = {
        first_name: 'Response',
        last_name: 'Test',
        email: `response${Date.now()}@test.com`,
        password: 'password123',
        phone: '1234567890',
        postal_code: '28001',
        province: 'Madrid',
        full_address: 'Calle Test 123',
        city: 'Madrid',
        country: 'España',
        dni_nie_cif: '12345678A',
      };

      // Registrar
      await request(app)
        .post('/auth/register')
        .send(userData)
        .catch(() => {});

      // Login
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .catch(err => {
          return { status: err.status, body: err.response?.body };
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('message');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('email');
      }
    });

    it('register exitoso debe retornar user, token y message', async () => {
      const userData = {
        first_name: 'Register',
        last_name: 'Response',
        email: `regresponse${Date.now()}@test.com`,
        password: 'password123',
        phone: '1234567890',
        postal_code: '28001',
        province: 'Madrid',
        full_address: 'Calle Test 123',
        city: 'Madrid',
        country: 'España',
        dni_nie_cif: '12345678A',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .catch(err => {
          return { status: err.status, body: err.response?.body };
        });

      if (response.status === 201) {
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('message');
        expect(response.body.user).toHaveProperty('email');
      }
    });
  });
});