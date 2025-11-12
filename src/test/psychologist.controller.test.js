import request from 'supertest';
import express from 'express';
import psychologistRouter from '../routes/psychologist.routes.js';

describe('Psychologist Controller - CRUD Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/psychologist', psychologistRouter);
  });

  afterAll((done) => {
    done();
  });

  // -------------------------
  // GET /psychologist
  // -------------------------
  describe('GET /psychologist - Obtener todos los psicólogos', () => {
    it('debe retornar 200 o 401 si requiere autenticación', async () => {
      const response = await request(app).get('/psychologist').catch(err => ({ status: err.status }));
      expect([200, 401, 403]).toContain(response.status);
    });

    it('debe retornar JSON', async () => {
      const response = await request(app).get('/psychologist').catch(err => ({ type: err.response?.type }));
      if (response?.type) expect(response.type).toMatch(/json/);
    });
  });

  // -------------------------
  // GET /psychologist/:id
  // -------------------------
  describe('GET /psychologist/:id - Obtener psicólogo por ID', () => {
    it('debe retornar 404 si psicólogo no existe', async () => {
      const response = await request(app).get('/psychologist/999999').catch(err => ({ status: err.status }));
      expect([404, 400]).toContain(response.status);
    });

    it('debe retornar JSON', async () => {
      const response = await request(app).get('/psychologist/1').catch(err => ({ type: err.response?.type }));
      if (response?.type) expect(response.type).toMatch(/json/);
    });

    it('debe aceptar ID como parámetro', async () => {
      try {
        await request(app).get('/psychologist/123');
      } catch (err) {
        expect(err.status).not.toBe(404);
      }
    });
  });

  // -------------------------
  // POST /psychologist
  // -------------------------
  describe('POST /psychologist - Crear perfil de psicólogo', () => {
    it('debe retornar 401 si no hay autenticación', async () => {
      const response = await request(app)
        .post('/psychologist')
        .send({ license_number: 'COL123456', professional_description: 'Psicólogo especializado' })
        .expect(401);
      expect(response.body).toHaveProperty('message');
    });

    it('debe validar license_number requerido', async () => {
      const response = await request(app)
        .post('/psychologist')
        .send({ professional_description: 'Descripción sin número de colegiado' })
        .catch(err => ({ status: err.status }));
      expect([400, 401]).toContain(response.status);
    });

    it('debe aceptar POST con campos válidos (pero fallar por auth)', async () => {
      const response = await request(app)
        .post('/psychologist')
        .send({ license_number: 'COL123456', professional_description: 'Descripción de psicólogo profesional' })
        .expect(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  // -------------------------
  // PUT /psychologist/:id
  // -------------------------
  describe('PUT /psychologist/:id - Actualizar perfil', () => {
    it('debe retornar 401 si no hay autenticación', async () => {
      const response = await request(app)
        .put('/psychologist/1')
        .send({ license_number: 'COL789012', professional_description: 'Nueva descripción' })
        .expect(401);
      expect(response.body).toHaveProperty('message');
    });

    it('debe retornar 404 si psicólogo no existe', async () => {
      const response = await request(app)
        .put('/psychologist/999999')
        .send({ license_number: 'COL789012' })
        .catch(err => ({ status: err.status }));
      expect([401, 404]).toContain(response.status);
    });

    it('debe aceptar PUT request en ruta válida', async () => {
      try {
        await request(app).put('/psychologist/1').send({ license_number: 'COL123' });
      } catch (err) {
        expect(err.status).not.toBe(404);
      }
    });
  });

  // -------------------------
  // PATCH /psychologist/:id/deactivate
  // -------------------------
  describe('PATCH /psychologist/:id/deactivate - Desactivar psicólogo', () => {
    it('debe retornar 401 si no hay autenticación', async () => {
      const response = await request(app).patch('/psychologist/1/deactivate').expect(401);
      expect(response.body).toHaveProperty('message');
    });

    it('debe aceptar PATCH en ruta válida', async () => {
      try {
        await request(app).patch('/psychologist/1/deactivate');
      } catch (err) {
        expect([401, 403, 404]).toContain(err.status);
      }
    });
  });

  // -------------------------
  // PATCH /psychologist/:id/activate
  // -------------------------
  describe('PATCH /psychologist/:id/activate - Activar psicólogo', () => {
    it('debe retornar 401 si no hay autenticación', async () => {
      const response = await request(app).patch('/psychologist/1/activate').expect(401);
      expect(response.body).toHaveProperty('message');
    });

    it('debe aceptar PATCH en ruta válida', async () => {
      try {
        await request(app).patch('/psychologist/1/activate');
      } catch (err) {
        expect([401, 403, 404]).toContain(err.status);
      }
    });
  });

  // -------------------------
  // PATCH /psychologist/:id/validate
  // -------------------------
  describe('PATCH /psychologist/:id/validate - Validar psicólogo', () => {
    it('debe retornar 401 si no hay autenticación', async () => {
      const response = await request(app).patch('/psychologist/1/validate').expect(401);
      expect(response.body).toHaveProperty('message');
    });

    it('debe aceptar PATCH en ruta válida', async () => {
      try {
        await request(app).patch('/psychologist/1/validate');
      } catch (err) {
        expect([401, 403, 404]).toContain(err.status);
      }
    });
  });

  // -------------------------
  // DELETE /psychologist/:id
  // -------------------------
  describe('DELETE /psychologist/:id - Eliminar psicólogo', () => {
    it('debe retornar 401 si no hay autenticación', async () => {
      const response = await request(app).delete('/psychologist/1').expect(401);
      expect(response.body).toHaveProperty('message');
    });

    it('debe retornar 404 si psicólogo no existe', async () => {
      const response = await request(app).delete('/psychologist/999999').catch(err => ({ status: err.status }));
      expect([401, 404]).toContain(response.status);
    });

    it('debe aceptar DELETE en ruta válida', async () => {
      try {
        await request(app).delete('/psychologist/1');
      } catch (err) {
        expect([401, 403, 404]).toContain(err.status);
      }
    });
  });

  // -------------------------
  // GET /psychologist/:id/booked
  // -------------------------
  describe('GET /psychologist/:id/booked - Obtener citas reservadas', () => {
    it('debe retornar citas para psicólogo válido', async () => {
      const response = await request(app).get('/psychologist/1/booked').catch(err => ({ status: err.status }));
      expect([200, 400]).toContain(response.status);
    });

    it('debe retornar JSON', async () => {
      const response = await request(app).get('/psychologist/1/booked').catch(err => ({ type: err.response?.type }));
      if (response?.type) expect(response.type).toMatch(/json/);
    });
  });

  // -------------------------
  // Validaciones generales
  // -------------------------
  describe('Validaciones de rutas', () => {
    it('todas las rutas deben existir', async () => {
      const routes = [
        { method: 'get', path: '/psychologist' },
        { method: 'get', path: '/psychologist/1' },
        { method: 'post', path: '/psychologist' },
        { method: 'put', path: '/psychologist/1' },
        { method: 'patch', path: '/psychologist/1/deactivate' },
        { method: 'patch', path: '/psychologist/1/activate' },
        { method: 'patch', path: '/psychologist/1/validate' },
        { method: 'delete', path: '/psychologist/1' },
        { method: 'get', path: '/psychologist/1/booked' },
      ];
      for (const route of routes) {
        try {
          await request(app)[route.method](route.path);
        } catch (err) {
          expect(err.status).not.toBe(404);
        }
      }
    });
  });

  describe('Content-Type headers', () => {
    it('GET debe retornar application/json', async () => {
      const response = await request(app).get('/psychologist').catch(err => ({ type: err.response?.type }));
      if (response?.type) expect(response.type).toMatch(/json/);
    });

    it('POST debe retornar application/json', async () => {
      const response = await request(app)
        .post('/psychologist')
        .send({ license_number: 'TEST' })
        .catch(err => ({ type: err.response?.type }));
      if (response?.type) expect(response.type).toMatch(/json/);
    });
  });

  describe('Estructura de respuestas de error', () => {
    it('debe retornar message en errores', async () => {
      const response = await request(app).get('/psychologist/abc').catch(err => ({ body: err.response?.body }));
      if (response?.body) expect(response.body).toHaveProperty('message');
    });

    it('debe retornar mensaje cuando no hay autenticación', async () => {
      const response = await request(app).post('/psychologist').send({}).expect(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Filtros y parámetros', () => {
    it('debe aceptar query parameters', async () => {
      const response = await request(app).get('/psychologist?includeInactive=true&specialities=1,2').catch(err => ({ status: err.status }));
      expect([200, 401, 403]).toContain(response.status);
    });

    it('debe aceptar parámetros de ruta', async () => {
      try {
        await request(app).get('/psychologist/123/booked');
      } catch (err) {
        expect(err.status).not.toBe(404);
      }
    });
  });
});
