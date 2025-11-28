const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), 'backend/.env.test');
dotenv.config({ path: envPath });

const events = require('events');
events.EventEmitter.defaultMaxListeners = 50;