import { jest } from '@jest/globals';
import request from 'supertest';

// Mock de axios (igual que antes)
jest.unstable_mockModule('axios', () => ({
  default: {
    create: jest.fn().mockReturnValue({
      post: jest.fn().mockResolvedValue({ data: {} }),
      get: jest.fn().mockResolvedValue({ data: {} }),
    }),
  },
}));

// Mock de middlewares
jest.unstable_mockModule('../middleware/authMiddleware.js', () => ({
  default: (req, res, next) => next(),
}));
jest.unstable_mockModule('../middleware/roleMiddleware.js', () => ({
  default: () => (req, res, next) => next(),
}));
jest.unstable_mockModule('../middleware/ownerMiddleware.js', () => ({
  default: (req, res, next) => next(),
}));

// Mock de Sequelize models
jest.unstable_mockModule('../models/index.js', () => {
  const patients = []; // array en memoria

  return {
    Patient: {
      findAll: jest.fn((opts) => {
        if (opts?.where?.active === false) return patients.filter(p => !p.active);
        return patients;
      }),
      findByPk: jest.fn((id) => patients.find(p => p.id === Number(id))),
      create: jest.fn((data) => {
        const newPatient = { id: patients.length + 1, ...data };
        patients.push(newPatient);
        return Promise.resolve(newPatient);
      }),
      update: jest.fn((data, opts) => {
        const patient = patients.find(p => p.id === opts.where.id);
        if (!patient) return [0];
        Object.assign(patient, data);
        return [1];
      }),
      destroy: jest.fn((opts) => {
        const index = patients.findIndex(p => p.id === opts.where.id);
        if (index === -1) return 0;
        patients.splice(index, 1);
        return 1;
      }),
    },
  };
});

const app = await import('../app.js').then(m => m.default);

describe('Patient Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /patient devuelve array inicialmente vacío', async () => {
    const response = await request(app).get('/patient');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test('POST /patient crea paciente en mock', async () => {
    const response = await request(app)
      .post('/patient')
      .send({ name: 'Test', email: 'test@example.com' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  test('GET /patient devuelve el paciente creado', async () => {
    await request(app).post('/patient').send({ name: 'Otro', email: 'otro@example.com' });
    const response = await request(app).get('/patient');
    expect(response.body.length).toBe(1);
  });
});
cd