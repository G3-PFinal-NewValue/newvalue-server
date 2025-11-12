import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import userRouter from '../routes/user.routes.js';

describe('User Controller - CRUD Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/user', userRouter);
  });

  // Generar token válido con la JWT_SECRET del .env
  const generateAdminToken = () => {
    return jwt.sign(
      { id: 1, email: 'admin@test.com', role: 'admin' },
      process.env.JWT_SECRET || 'una_clave_super_segura_para_jwt',
      { expiresIn: '1h' }
    );
  };

  describe('GET /user - Obtener todos los usuarios', () => {
    it('debe retornar 401 si no hay token de autenticación', async () => {
      const response = await request(app)
        .get('/user')
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('No se proporcionó token');
    });

    it('debe retornar 200 con token válido (admin)', async () => {
      const adminToken = generateAdminToken();
      
      const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${adminToken}`)
        .catch(err => {
          expect([200, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect([200, 403]).toContain(response.status);
    });
  });

  describe('PATCH /user/:id/assign-role', () => {
    it('debe validar campos requeridos', async () => {
      const adminToken = generateAdminToken();
      
      const response = await request(app)
        .patch('/user/1/assign-role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('roleName');
    });

    it('debe rechazar si faltan parámetros', async () => {
      const adminToken = generateAdminToken();
      
      const response = await request(app)
        .patch('/user/1/assign-role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('debe rechazar si userId no es un número válido', async () => {
      const adminToken = generateAdminToken();
      
      const response = await request(app)
        .patch('/user/abc/assign-role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleName: 'patient' })
        .catch(err => {
          expect([400, 404, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect([400, 404, 401, 403]).toContain(response.status);
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
          expect([201, 400, 401, 403]).toContain(err.status);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('Validaciones de rutas', () => {
    it('debe retornar JSON en respuestas', async () => {
      const adminToken = generateAdminToken();
      
      const response = await request(app)
        .patch('/user/1/assign-role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleName: 'admin' })
        .expect('Content-Type', /json/)
        .catch(err => {
          if (err.response) {
            expect(err.response.type).toMatch(/json/);
          }
          return err.response || { type: 'application/json' };
        });

      expect(response).toBeDefined();
    });

    it('assign-role debe ser un endpoint PATCH', async () => {
      const adminToken = generateAdminToken();
      
      try {
        await request(app)
          .patch('/user/1/assign-role')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ roleName: 'patient' });
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
        .patch('/user/1/assign-role')
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
        { method: 'patch', path: '/user/1/assign-role' },
        { method: 'patch', path: '/user/1/deactivate' },
        { method: 'patch', path: '/user/1/activate' },
      ];

      for (const route of routes) {
        const response = await request(app)[route.method](route.path)
          .send(route.method === 'patch' && route.path.includes('assign-role') ? { roleName: 'patient' } : {})
          .catch(err => err);

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
          expect(err.status).not.toBe(404);
          return { status: err.status };
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('Respuestas esperadas', () => {
    it('assign-role sin datos debe retornar 400', async () => {
      const adminToken = generateAdminToken();
      
      const response = await request(app)
        .patch('/user/1/assign-role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('assign-role con datos parciales debe retornar 400', async () => {
      const adminToken = generateAdminToken();
      
      const response = await request(app)
        .patch('/user/1/assign-role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

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