/**
 * Security Verification Script (TODO 8)
 *
 * Tests the CampusConnect API for:
 *   1. Valid registration
 *   2. Duplicate registration rejection
 *   3. Valid login
 *   4. Invalid login (wrong password)
 *   5. Invalid login (non-existent user)
 *   6. Accessing protected route WITH valid token
 *   7. Accessing protected route WITHOUT token
 *   8. Accessing protected route with INVALID token
 *   9. Role-based authorization (student cannot delete users)
 *
 * Run:  node server/tests/security_verification.js
 * Requires the server to be running on localhost:5000
 */

const http = require('http');

const BASE = 'http://localhost:5000';
const TEST_USER = {
  name: 'Test User',
  email: `testuser_${Date.now()}@campus.edu`,
  password: 'SecurePass123',
};

let passed = 0;
let failed = 0;
let authToken = null;

// ── HTTP helper using only Node stdlib ──────────────────────────────────────
function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const payload = body ? JSON.stringify(body) : null;

    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function assert(testName, condition) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

// ── Test Suite ──────────────────────────────────────────────────────────────
async function runTests() {
  console.log('\n══════════════════════════════════════════════════════════');
  console.log('  CampusConnect Security Verification (TODO 8)');
  console.log('══════════════════════════════════════════════════════════\n');

  // ── 1. Valid Registration ──
  console.log('▸ Test 1: Valid Registration');
  const reg = await request('POST', '/api/auth/register', TEST_USER);
  assert('Returns 201 status', reg.status === 201);
  assert('Returns success=true', reg.body.success === true);
  assert('Returns a JWT token', typeof reg.body.token === 'string' && reg.body.token.length > 20);
  assert('Returns user with role "student"', reg.body.user?.role === 'student');
  assert('Password NOT in response', reg.body.user?.password === undefined);
  authToken = reg.body.token;
  console.log('');

  // ── 2. Duplicate Registration Rejection ──
  console.log('▸ Test 2: Duplicate Registration Rejected');
  const dup = await request('POST', '/api/auth/register', TEST_USER);
  assert('Returns 409 status', dup.status === 409);
  assert('Returns success=false', dup.body.success === false);
  assert('Error message mentions duplicate', dup.body.message?.toLowerCase().includes('already'));
  console.log('');

  // ── 3. Valid Login ──
  console.log('▸ Test 3: Valid Login');
  const login = await request('POST', '/api/auth/login', {
    email: TEST_USER.email,
    password: TEST_USER.password,
  });
  assert('Returns 200 status', login.status === 200);
  assert('Returns success=true', login.body.success === true);
  assert('Returns a JWT token', typeof login.body.token === 'string');
  assert('Returns user role', login.body.user?.role === 'student');
  authToken = login.body.token; // refresh token
  console.log('');

  // ── 4. Invalid Login — Wrong Password ──
  console.log('▸ Test 4: Invalid Login (Wrong Password)');
  const badPwd = await request('POST', '/api/auth/login', {
    email: TEST_USER.email,
    password: 'WrongPassword999',
  });
  assert('Returns 401 status', badPwd.status === 401);
  assert('Returns success=false', badPwd.body.success === false);
  assert('Does NOT leak whether email exists', badPwd.body.message?.toLowerCase().includes('invalid'));
  console.log('');

  // ── 5. Invalid Login — Non-existent User ──
  console.log('▸ Test 5: Invalid Login (Non-existent User)');
  const noUser = await request('POST', '/api/auth/login', {
    email: 'nobody_exists@campus.edu',
    password: 'SomePassword1',
  });
  assert('Returns 401 status', noUser.status === 401);
  assert('Same generic message (no user enumeration)', noUser.body.message === badPwd.body.message);
  console.log('');

  // ── 6. Accessing Protected Route WITH Valid Token ──
  console.log('▸ Test 6: Protected Route — Valid Token');
  const validAccess = await request('GET', '/api/users', null, {
    Authorization: `Bearer ${authToken}`,
  });
  assert('Returns 200 status', validAccess.status === 200);
  assert('Returns success=true', validAccess.body.success === true);
  assert('Returns users array', Array.isArray(validAccess.body.users));
  console.log('');

  // ── 7. Accessing Protected Route WITHOUT Token ──
  console.log('▸ Test 7: Protected Route — No Token');
  const noToken = await request('GET', '/api/users');
  assert('Returns 401 status', noToken.status === 401);
  assert('Returns success=false', noToken.body.success === false);
  assert('Error message about token', noToken.body.message?.toLowerCase().includes('token') || noToken.body.message?.toLowerCase().includes('denied'));
  console.log('');

  // ── 8. Accessing Protected Route with INVALID Token ──
  console.log('▸ Test 8: Protected Route — Invalid/Expired Token');
  const badToken = await request('GET', '/api/users', null, {
    Authorization: 'Bearer this.is.a.fake.token.string',
  });
  assert('Returns 401 status', badToken.status === 401);
  assert('Returns success=false', badToken.body.success === false);
  assert('Error message about invalid token', badToken.body.message?.toLowerCase().includes('invalid') || badToken.body.message?.toLowerCase().includes('expired'));
  console.log('');

  // ── 9. Role-Based Authorization — Student Cannot Delete Users ──
  console.log('▸ Test 9: Role Authorization — Student Cannot Delete');
  const deleteAttempt = await request('DELETE', '/api/users/000000000000000000000000', null, {
    Authorization: `Bearer ${authToken}`,
  });
  assert('Returns 403 status (Forbidden)', deleteAttempt.status === 403);
  assert('Returns success=false', deleteAttempt.body.success === false);
  assert('Message mentions role/authorization', deleteAttempt.body.message?.toLowerCase().includes('authorized') || deleteAttempt.body.message?.toLowerCase().includes('denied'));
  console.log('');

  // ── Cleanup: Delete test user via direct DB call is not done here ──
  // (left in DB so manual inspection is possible)

  // ── Summary ──
  console.log('══════════════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('══════════════════════════════════════════════════════════');

  if (failed > 0) {
    console.log('\n  ⚠️  Some tests failed. Review the output above.\n');
    process.exit(1);
  } else {
    console.log('\n  🎉 All security tests passed!\n');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('\n❌ Could not connect to server. Is it running on localhost:5000?\n', err.message);
  process.exit(1);
});
