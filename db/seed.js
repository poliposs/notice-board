// this file resets the database with sample data. Run with: npm run seed
const db = require('./database');

let failed = false;

// wraps db.run so any failed statement is reported instead of silently ignored
function run(sql, params = []) {
  db.run(sql, params, (err) => {
    if (err) {
      failed = true;
      console.error(`Seed error: ${err.message}\n  in: ${sql}`);
    }
  });
}

db.serialize(() => {
  run('DELETE FROM comments');
  run('DELETE FROM notices');
  run('DELETE FROM users');
  run('DELETE FROM sqlite_sequence');  // reset auto-increment IDs

  // NOTE: plain-text passwords are for sample data only; hash them once signup/login uses bcrypt
  const addUser = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  db.run(addUser, ['alice', 'alice@example.com', 'password123', 'user']);
  db.run(addUser, ['bob',   'bob@example.com',   'letmein',     'user']);
  db.run(addUser, ['admin', 'admin@example.com', 'admin123',    'admin']);

  const addNotice = 'INSERT INTO notices (user_id, title, description, category) VALUES (?, ?, ?, ?)';
  run(addNotice, [1, 'Lost cat', 'Grey tabby missing near the park. Answers to Milo.', 'Lost & Found']);
  run(addNotice, [2, 'Bike for sale', 'Blue road bike, good condition, €80.', 'For Sale']);
  run(addNotice, [1, 'Community clean-up', 'Saturday 10am at the library. Gloves provided.', 'Events']);

  run('INSERT INTO comments (notice_id, user_id, body) VALUES (?, ?, ?)',
    [1, 2, 'I think I saw him on Main Street yesterday!']);
});

db.close((err) => {
  if (err) return console.error(err.message);
  if (failed) {
    console.error('Database seeding finished with errors');
    process.exitCode = 1;
  } else {
    console.log('Database seeded');
  }
});
