import { jest } from '@jest/globals';
import request from 'supertest';


jest.unstable_mockModule('../middleware/authMiddleware.js', () => ({
  default: (req, res, next) => next()
}));

jest.unstable_mockModule('../middleware/roleMiddleware.js', () => ({
  default: () => (req, res, next) => next()
}));

jest.unstable_mockModule('../middleware/ownerMiddleware.js', () => ({
  default: (req, res, next) => next()
}));


jest.unstable_mockModule('../models/PatientModel.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }
}));


const app = await import('../app.js').then(m => m.default);
const PatientModel = await import('../models/PatientModel.js').then(m => m.default);

describe('Patient Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /patient - getAllPatients', () => {
    test('debe retornar lista de pacientes activos por defecto', async () => {
      const mockPatients = [
        { id: 1, name: 'Juan', status: 'active' },
        { id: 2, name: 'María', status: 'active' }
      ];

      PatientModel.findAll.mockResolvedValue(mockPatients);

      const response = await request(app)
        .get('/patient')
        .expect(200);

      expect(response.body).toEqual(mockPatients);
      expect(PatientModel.findAll).toHaveBeenCalledWith({ where: { status: 'active' } });
    });

    test('debe retornar todos los pacientes incluyendo inactivos', async () => {
      const mockPatients = [
        { id: 1, name: 'Juan', status: 'active' },
        { id: 2, name: 'Pedro', status: 'inactive' }
      ];

      PatientModel.findAll.mockResolvedValue(mockPatients);

      const response = await request(app)
        .get('/patient?includeInactive=true')
        .expect(200);

      expect(response.body).toEqual(mockPatients);
      expect(PatientModel.findAll).toHaveBeenCalledWith({ where: {} });
    });

    test('debe retornar error 400 si falla la consulta', async () => {
      const error = new Error('Database error');
      PatientModel.findAll.mockRejectedValue(error);

      const response = await request(app)
        .get('/patient')
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });

  describe('GET /patient/:id - getPatientById', () => {
    test('debe retornar un paciente por ID', async () => {
      const mockPatient = { id: 1, name: 'Juan', status: 'active' };
      PatientModel.findByPk.mockResolvedValue(mockPatient);

      const response = await request(app)
        .get('/patient/1')
        .expect(200);

      expect(response.body).toEqual(mockPatient);
      expect(PatientModel.findByPk).toHaveBeenCalledWith('1');
    });

    test('debe retornar 404 si paciente no existe', async () => {
      PatientModel.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/patient/999')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Paciente no encontrado');
    });

    test('debe retornar error 400 si falla la consulta', async () => {
      const error = new Error('Database error');
      PatientModel.findByPk.mockRejectedValue(error);

      const response = await request(app)
        .get('/patient/1')
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });


  describe('POST /patient - createPatient', () => {
    test('debe crear un nuevo paciente', async () => {
      const newPatientData = { name: 'Carlos', email: 'carlos@example.com' };
      const mockPatient = { id: 3, ...newPatientData, status: 'active' };

      PatientModel.create.mockResolvedValue(mockPatient);

      const response = await request(app)
        .post('/patient')
        .send(newPatientData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Paciente creado correctamente');
      expect(response.body).toHaveProperty('patient', mockPatient);
      expect(PatientModel.create).toHaveBeenCalledWith({
        ...newPatientData,
        status: 'active'
      });
    });

    test('debe retornar error 400 si faltan datos requeridos', async () => {
      const error = new Error('Validation error');
      PatientModel.create.mockRejectedValue(error);

      const response = await request(app)
        .post('/patient')
        .send({ name: 'Solo nombre' })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation error');
    });

    test('debe retornar error 400 si falla la creación', async () => {
      const error = new Error('Database error');
      PatientModel.create.mockRejectedValue(error);

      const response = await request(app)
        .post('/patient')
        .send({ name: 'Juan', email: 'juan@example.com' })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });

 
  describe('PUT /patient/:id - updatePatient', () => {
    test('debe actualizar un paciente', async () => {
      const updateData = { name: 'Juan Actualizado' };
      const mockUpdatedPatient = { id: 1, ...updateData, status: 'active' };

      PatientModel.update.mockResolvedValue([1]);
      PatientModel.findByPk.mockResolvedValue(mockUpdatedPatient);

      const response = await request(app)
        .put('/patient/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Paciente actualizado');
      expect(response.body).toHaveProperty('patient', mockUpdatedPatient);
    });

    test('debe retornar 404 si paciente no existe', async () => {
      PatientModel.update.mockResolvedValue([0]);

      const response = await request(app)
        .put('/patient/999')
        .send({ name: 'Nuevo nombre' })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Paciente no encontrado');
    });

    test('debe retornar error 400 si falla la actualización', async () => {
      const error = new Error('Database error');
      PatientModel.update.mockRejectedValue(error);

      const response = await request(app)
        .put('/patient/1')
        .send({ name: 'Nuevo nombre' })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });

 
  describe('PATCH /patient/:id/deactivate - deactivatePatient', () => {
    test('debe desactivar un paciente', async () => {
      PatientModel.update.mockResolvedValue([1]);

      const response = await request(app)
        .patch('/patient/1/deactivate')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Cuenta de paciente desactivada correctamente');
      expect(PatientModel.update).toHaveBeenCalledWith(
        { status: 'inactive' },
        { where: { user_id: '1' } }
      );
    });

    test('debe retornar 404 si paciente no existe', async () => {
      PatientModel.update.mockResolvedValue([0]);

      const response = await request(app)
        .patch('/patient/999/deactivate')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Paciente no encontrado');
    });

    test('debe retornar error 400 si falla la desactivación', async () => {
      const error = new Error('Database error');
      PatientModel.update.mockRejectedValue(error);

      const response = await request(app)
        .patch('/patient/1/deactivate')
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });

 
  describe('PATCH /patient/:id/activate - activatePatient', () => {
    test('debe reactivar un paciente', async () => {
      PatientModel.update.mockResolvedValue([1]);

      const response = await request(app)
        .patch('/patient/1/activate')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Cuenta de paciente reactivada correctamente');
      expect(PatientModel.update).toHaveBeenCalledWith(
        { status: 'active' },
        { where: { user_id: '1' } }
      );
    });

    test('debe retornar 404 si paciente no existe', async () => {
      PatientModel.update.mockResolvedValue([0]);

      const response = await request(app)
        .patch('/patient/1/activate')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Paciente no encontrado');
    });

    test('debe retornar error 400 si falla la reactivación', async () => {
      const error = new Error('Database error');
      PatientModel.update.mockRejectedValue(error);

      const response = await request(app)
        .patch('/patient/1/activate')
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });

  describe('DELETE /patient/:id - deletePatient', () => {
    test('debe eliminar (soft delete) un paciente', async () => {
      PatientModel.destroy.mockResolvedValue(1);

      const response = await request(app)
        .delete('/patient/1')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Paciente eliminado (soft delete)');
      expect(PatientModel.destroy).toHaveBeenCalledWith({
        where: { user_id: '1' },
        force: false
      });
    });

    test('debe retornar 404 si paciente no existe', async () => {
      PatientModel.destroy.mockResolvedValue(0);

      const response = await request(app)
        .delete('/patient/999')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Paciente no encontrado');
    });

    test('debe retornar error 400 si falla la eliminación', async () => {
      const error = new Error('Database error');
      PatientModel.destroy.mockRejectedValue(error);

      const response = await request(app)
        .delete('/patient/1')
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });
});
