const bcrypt = require('bcryptjs');

async function testBcrypt() {
  try {
    const password = 'Admin@12345';
    
    console.log('Testing bcryptjs...');
    console.log(`bcryptjs version: ${require('bcryptjs/package.json').version}`);
    
    const salt = await bcrypt.genSalt(10);
    console.log(`Salt generated: ${salt}`);
    
    const hash = await bcrypt.hash(password, salt);
    console.log(`Hash: ${hash.slice(0, 20)}...`);
    
    const isMatch = await bcrypt.compare(password, hash);
    console.log(`Comparison result: ${isMatch}`);
    
    if (!isMatch) {
      console.log('\n❌ bcrypt comparison failed');
      console.log('Trying with different salt rounds...');
      
      for (let rounds = 8; rounds <= 12; rounds++) {
        const testSalt = await bcrypt.genSalt(rounds);
        const testHash = await bcrypt.hash(password, testSalt);
        const testMatch = await bcrypt.compare(password, testHash);
        console.log(`Rounds ${rounds}: ${testMatch ? '✅' : '❌'}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBcrypt();
