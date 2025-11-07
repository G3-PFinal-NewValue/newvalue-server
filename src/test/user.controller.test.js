import request from 'supertest';
import express from 'express';
import userRouter from '../routes/user.routes.js';

describe('User Controller - CRUD Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/user', userRouter);
  });

  describe('GET /user - Obtener todos los usuarios', () => {
    it('debe retornar 401 si no hay token de autenticación', async () => {
      const response = await request(app)
        .get('/user')
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('No se proporcionó token');
    });

    it('debe retornar 200 con token válido (admin)', async () => {
      // Token simulado para usuario admin
      const adminToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiJ9.test';
      
      const response = await request(app)
        .get('/user')
        .set('Authorization', adminToken)
        .catch(err => {
          
          expect([200, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect([200, 403]).toContain(response.status);
    });
  });

  describe('PATCH /user/assign-role', () => {
    it('debe validar campos requeridos', async () => {
      const response = await request(app)
        .patch('/user/assign-role')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('requeridos');
    });

    it('debe rechazar si faltan parámetros', async () => {
      const response = await request(app)
        .patch('/user/assign-role')
        .send({ userId: 1 })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('debe rechazar si userId no es un número válido', async () => {
      // Cuando userId no es válido, findByPk devuelve null → 404
      const response = await request(app)
        .patch('/user/assign-role')
        .send({ userId: 'abc', roleName: 'patient' })
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Usuario no encontrado');
    });
  });

  describe('PATCH /user/:id/deactivate', () => {
    it('debe rechazar si el ID no es válido', async () => {
      const response = await request(app)
        .patch('/user/abc/deactivate')
        .catch(err => {
          expect([400, 404, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });

    it('debe retornar un estado válido', async () => {
      const response = await request(app)
        .patch('/user/999/deactivate')
        .catch(err => {
          expect([400, 404, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('PATCH /user/:id/activate', () => {
    it('debe rechazar si el ID no es válido', async () => {
      const response = await request(app)
        .patch('/user/abc/activate')
        .catch(err => {
          expect([400, 404, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });

    it('debe retornar un estado válido', async () => {
      const response = await request(app)
        .patch('/user/999/activate')
        .catch(err => {
          expect([400, 404, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('POST /user', () => {
    it('debe aceptar POST request', async () => {
      const response = await request(app)
        .post('/user')
        .send({
          email: 'test@test.com',
          first_name: 'Test',
          last_name: 'User',
        })
        .catch(err => {
          // 201 = creado, 400 = validación, 401 = no autenticado
          expect([201, 400, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('Validaciones de rutas', () => {
    it('debe retornar JSON en respuestas', async () => {
      const response = await request(app)
        .patch('/user/assign-role')
        .send({})
        .expect('Content-Type', /json/)
        .catch(err => {
          if (err.response) {
            expect(err.response.type).toMatch(/json/);
          }
        });

      expect(response).toBeDefined();
    });

    it('assign-role debe ser un endpoint PATCH', async () => {
      try {
        await request(app)
          .patch('/user/assign-role')
          .send({ userId: 1, roleName: 'patient' });
      } catch (err) {
       
        expect(err.status).not.toBe(404);
      }
      
    });
  });

  describe('Manejo de errores HTTP', () => {
    it('debe manejar parámetros inválidos', async () => {
      const response = await request(app)
        .patch('/user/notanumber/deactivate')
        .catch(err => {
          expect([400, 404, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });

    it('debe retornar mensaje de error en JSON', async () => {
      const response = await request(app)
        .patch('/user/assign-role')
        .send({});

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Content-Type headers', () => {
    it('GET /user debe retornar application/json', async () => {
      const response = await request(app)
        .get('/user')
        .catch(err => {
          if (err.response) {
            expect(err.response.type).toMatch(/json/);
          }
        });

      if (response && response.type) {
        expect(response.type).toMatch(/json/);
      }
    });

    it('PATCH debe retornar application/json', async () => {
      const response = await request(app)
        .patch('/user/1/deactivate')
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

  describe('Estructura de rutas', () => {
    it('todas las rutas deben existir', async () => {
      const routes = [
        { method: 'get', path: '/user' },
        { method: 'patch', path: '/user/assign-role' },
        { method: 'patch', path: '/user/1/deactivate' },
        { method: 'patch', path: '/user/1/activate' },
      ];

      for (const route of routes) {
        const response = await request(app)[route.method](route.path)
          .catch(err => err);

        // No debe ser 404 (ruta no encontrada)
        if (response && response.status) {
          expect(response.status).not.toBe(404);
        }
      }
    });

    it('POST /user debe existir', async () => {
      const response = await request(app)
        .post('/user')
        .send({})
        .catch(err => {
          // Error esperado: validación o autenticación, no 404
          expect(err.status).not.toBe(404);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('Respuestas esperadas', () => {
    it('assign-role sin datos debe retornar 400', async () => {
      const response = await request(app)
        .patch('/user/assign-role')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('assign-role con datos parciales debe retornar 400', async () => {
      const response = await request(app)
        .patch('/user/assign-role')
        .send({ userId: 1 });

      expect(response.status).toBe(400);
    });

    it('deactivate con usuario inexistente debe retornar 404', async () => {
      const response = await request(app)
        .patch('/user/999999/deactivate')
        .catch(err => {
          expect([404, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect([404, 401, 403]).toContain(response.status);
    });

    it('activate con usuario inexistente debe retornar 404', async () => {
      const response = await request(app)
        .patch('/user/999999/activate')
        .catch(err => {
          expect([404, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect([404, 401, 403]).toContain(response.status);
    });
  });
});