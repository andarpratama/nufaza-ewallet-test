import request from 'supertest';
import app from '../app';
import * as registerService from '../app/register/register.service';

describe('POST /accounts', () => {
  const createUserMock = jest.spyOn(registerService, 'createUser');

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a user successfully', async () => {
    const now = new Date();
    const mockUser = {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      balance: 0,
      createdAt: now,
    };
    createUserMock.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/accounts')
      .send({ name: 'Alice', email: 'alice@example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      balance: mockUser.balance,
      createdAt: now.toISOString(),
    });
    expect(createUserMock).toHaveBeenCalledWith({ name: 'Alice', email: 'alice@example.com' });
  });

  it('should return 400 if validation fails (missing name)', async () => {
    const res = await request(app)
      .post('/accounts')
      .send({ email: 'bob@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.some((e: any) => e.field === 'name')).toBe(true);
    expect(createUserMock).not.toHaveBeenCalled();
  });

  it('should return 400 if validation fails (invalid email)', async () => {
    const res = await request(app)
      .post('/accounts')
      .send({ name: 'Bob', email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'email')).toBe(true);
    expect(createUserMock).not.toHaveBeenCalled();
  });

  it('should return 500 if email already exists', async () => {
    createUserMock.mockRejectedValue(new Error('Email already exists'));

    const res = await request(app)
      .post('/accounts')
      .send({ name: 'Carol', email: 'carol@example.com' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Email already exists');
  });

  it('should return 500 on unexpected error', async () => {
    createUserMock.mockRejectedValue(new Error('Unexpected DB error'));

    const res = await request(app)
      .post('/accounts')
      .send({ name: 'Dave', email: 'dave@example.com' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Unexpected DB error');
  });
});
