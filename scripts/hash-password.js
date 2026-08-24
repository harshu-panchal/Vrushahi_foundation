// One-off local script to generate a bcrypt hash for ADMIN_PASSWORD_HASH.
// Usage: node scripts/hash-password.js "your-chosen-password"

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js "your-chosen-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
// Next.js's .env loader expands $VAR syntax, and bcrypt hashes are full of
// literal `$` characters — escape them so the hash is stored verbatim.
const escapedHash = hash.replace(/\$/g, "\\$");
console.log("\nAdd this to .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${escapedHash}\n`);
