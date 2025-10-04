import {
  getAppointments,
  saveAppointment,
  updateAppointment,
  deleteAppointment,
  Appointment,
} from './AppointmentService';
import { supabase } from '../lib/supabase';

// Mock del cliente de Supabase
const mockFns = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  eq: jest.fn(),
  single: jest.fn(),
  order: jest.fn(),
};

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockFns),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  // Asegurar encadenamiento
  Object.values(mockFns).forEach(mockFn => mockFn.mockReturnThis());
});

describe('AppointmentService con Supabase Mock', () => {
  const mockPetId = 'pet-123';
  const mockUserId = 'user-abc';
  const mockAppointment: Appointment = {
    id: 'appt-123',
    pet_id: mockPetId,
    user_id: mockUserId,
    created_at: new Date().toISOString(),
    date: new Date().toISOString(),
    type: 'MedicalVisit',
    notes: 'Chequeo anual',
  };

  it('debe obtener las citas para una mascota', async () => {
    mockFns.order.mockResolvedValueOnce({ data: [mockAppointment], error: null });

    const appointments = await getAppointments(mockPetId);

    expect(supabase.from).toHaveBeenCalledWith('appointments');
    expect(mockFns.select).toHaveBeenCalledWith('*');
    expect(mockFns.eq).toHaveBeenCalledWith('pet_id', mockPetId);
    expect(mockFns.order).toHaveBeenCalledWith('date', { ascending: false });
    expect(appointments).toEqual([mockAppointment]);
  });

  it('debe guardar una nueva cita', async () => {
    const newAppointmentData: Omit<Appointment, 'id' | 'user_id' | 'created_at'> = {
        pet_id: mockPetId,
        date: new Date().toISOString(),
        type: 'Vaccine',
        notes: 'Vacuna de refuerzo',
    };
    mockFns.single.mockResolvedValueOnce({ data: { ...newAppointmentData, id: 'appt-456' }, error: null });

    const result = await saveAppointment(newAppointmentData);

    expect(supabase.from).toHaveBeenCalledWith('appointments');
    expect(mockFns.insert).toHaveBeenCalledWith(newAppointmentData);
    expect(result?.id).toBe('appt-456');
  });

  it('debe actualizar una cita', async () => {
    const updates = { notes: 'El chequeo fue bien' };
    const updatedAppointment = { ...mockAppointment, ...updates };
    mockFns.single.mockResolvedValueOnce({ data: updatedAppointment, error: null });

    const result = await updateAppointment('appt-123', updates);

    expect(supabase.from).toHaveBeenCalledWith('appointments');
    expect(mockFns.update).toHaveBeenCalledWith(updates);
    expect(mockFns.eq).toHaveBeenCalledWith('id', 'appt-123');
    expect(result).toEqual(updatedAppointment);
  });

  it('debe eliminar una cita', async () => {
    mockFns.eq.mockResolvedValueOnce({ error: null });

    const result = await deleteAppointment('appt-123');

    expect(supabase.from).toHaveBeenCalledWith('appointments');
    expect(mockFns.delete).toHaveBeenCalled();
    expect(mockFns.eq).toHaveBeenCalledWith('id', 'appt-123');
    expect(result).toBe(true);
  });
});
