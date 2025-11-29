import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api/auth-v2';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: `test${Date.now()}@example.com`,
  phone: '+254712345678',
  company: 'Test Company Ltd',
  password: 'TestPass123',
  accountType: 'business',
  agreeToMarketing: true,
};

let authToken = '';
let resetCode = '';

// Test 1: Register new user
async function testRegister() {
  log('\n=== TEST 1: User Registration ===', 'cyan');
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Registration successful', 'green');
      log(`  User ID: ${data.user._id}`, 'blue');
      log(`  Email: ${data.user.email}`, 'blue');
      log(`  Phone: ${data.user.phone}`, 'blue');
      log(`  Token received: ${data.token.substring(0, 20)}...`, 'blue');
      authToken = data.token;
      return true;
    } else {
      log('✗ Registration failed', 'red');
      log(`  Error: ${data.message}`, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Registration error', 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

// Test 2: Login
async function testLogin() {
  log('\n=== TEST 2: User Login ===', 'cyan');
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Login successful', 'green');
      log(`  User: ${data.user.firstName} ${data.user.lastName}`, 'blue');
      log(`  Role: ${data.user.role}`, 'blue');
      log(`  Token received: ${data.token.substring(0, 20)}...`, 'blue');
      authToken = data.token;
      return true;
    } else {
      log('✗ Login failed', 'red');
      log(`  Error: ${data.message}`, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Login error', 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

// Test 3: Get current user
async function testGetCurrentUser() {
  log('\n=== TEST 3: Get Current User ===', 'cyan');
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ User data retrieved', 'green');
      log(`  Name: ${data.user.firstName} ${data.user.lastName}`, 'blue');
      log(`  Email: ${data.user.email}`, 'blue');
      log(`  Phone: ${data.user.phone}`, 'blue');
      log(`  Account Type: ${data.user.accountType}`, 'blue');
      return true;
    } else {
      log('✗ Failed to get user data', 'red');
      log(`  Error: ${data.message}`, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Get user error', 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

// Test 4: Forgot password
async function testForgotPassword() {
  log('\n=== TEST 4: Forgot Password ===', 'cyan');
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Reset code sent', 'green');
      log('  Check your email for the 6-digit code', 'yellow');
      log('  (In testing, the code is saved in the database)', 'yellow');
      return true;
    } else {
      log('✗ Failed to send reset code', 'red');
      log(`  Error: ${data.message}`, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Forgot password error', 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

// Test 5: Invalid login
async function testInvalidLogin() {
  log('\n=== TEST 5: Invalid Login (Wrong Password) ===', 'cyan');
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword123',
      }),
    });

    const data = await response.json();
    
    if (!response.ok && !data.success) {
      log('✓ Invalid login correctly rejected', 'green');
      log(`  Error message: ${data.message}`, 'blue');
      return true;
    } else {
      log('✗ Invalid login was accepted (security issue!)', 'red');
      return false;
    }
  } catch (error) {
    log('✗ Invalid login test error', 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

// Test 6: Duplicate registration
async function testDuplicateRegistration() {
  log('\n=== TEST 6: Duplicate Registration ===', 'cyan');
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    
    if (!response.ok && !data.success) {
      log('✓ Duplicate registration correctly rejected', 'green');
      log(`  Error message: ${data.message}`, 'blue');
      return true;
    } else {
      log('✗ Duplicate registration was accepted (should fail)', 'red');
      return false;
    }
  } catch (error) {
    log('✗ Duplicate registration test error', 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

// Run all tests
async function runTests() {
  log('\n╔════════════════════════════════════════╗', 'cyan');
  log('║  Polyspack Authentication Test Suite  ║', 'cyan');
  log('╚════════════════════════════════════════╝', 'cyan');
  log(`\nAPI URL: ${API_URL}\n`, 'yellow');

  const results = {
    passed: 0,
    failed: 0,
  };

  // Run tests sequentially
  const tests = [
    { name: 'Register', fn: testRegister },
    { name: 'Login', fn: testLogin },
    { name: 'Get Current User', fn: testGetCurrentUser },
    { name: 'Forgot Password', fn: testForgotPassword },
    { name: 'Invalid Login', fn: testInvalidLogin },
    { name: 'Duplicate Registration', fn: testDuplicateRegistration },
  ];

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      results.passed++;
    } else {
      results.failed++;
    }
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  log('\n╔════════════════════════════════════════╗', 'cyan');
  log('║           Test Summary                 ║', 'cyan');
  log('╚════════════════════════════════════════╝', 'cyan');
  log(`\nTotal Tests: ${results.passed + results.failed}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`\nSuccess Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%\n`, 
    results.failed === 0 ? 'green' : 'yellow');
}

// Run the test suite
runTests().catch(error => {
  log('\nFatal error running tests:', 'red');
  log(error.message, 'red');
  process.exit(1);
});
