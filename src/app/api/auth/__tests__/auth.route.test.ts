/**
 * @jest-environment node
 */

jest.mock('@/lib/jwt', () => ({
  signToken: jest.fn(async (payload: any) => `token-${payload.sub}`),
  verifyToken: jest.fn(async (token: string) => {
    if (token === 'token-1') {
      return { sub: 1, name: 'Admin', email: 'admin@test.com', role: 'Admin' };
    }
    throw new Error('Invalid token');
  }),
}));

let loginPOST: (request: Request) => Promise<Response>;
let meGET: (request: Request) => Promise<Response>;

beforeAll(async () => {
  const loginModule = await import('@/app/api/auth/login/route');
  const meModule = await import('@/app/api/auth/me/route');

  loginPOST = loginModule.POST;
  meGET = meModule.GET;
});

describe('Auth API routes', () => {
  it('returns 401 for invalid login credentials', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@test.com', password: 'bad' }),
    });

    const response = await loginPOST(request);
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body).toEqual({ message: 'Invalid credentials' });
  });

  it('returns user payload and sets token cookie for valid login', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: '1234' }),
    });

    const response = await loginPOST(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('user');
    expect(body.user).toEqual({ id: 1, name: 'Admin', email: 'admin@test.com', role: 'Admin' });

    const tokenCookie = response.cookies.get('token');
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie?.value).toEqual(expect.any(String));
  });

  it('returns null user when auth cookie is missing', async () => {
    const request = new Request('http://localhost/api/auth/me');
    const response = await meGET(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ user: null });
  });

  it('returns authenticated user when auth cookie is valid', async () => {
    const loginRequest = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: '1234' }),
    });

    const loginResponse = await loginPOST(loginRequest);
    const tokenCookie = loginResponse.cookies.get('token');
    expect(tokenCookie).toBeDefined();

    const meRequest = new Request('http://localhost/api/auth/me', {
      headers: { cookie: `token=${tokenCookie?.value}` },
    });

    const response = await meGET(meRequest);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.user).toEqual(expect.objectContaining({ name: 'Admin', email: 'admin@test.com', role: 'Admin' }));
  });
});
