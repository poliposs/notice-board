// this fileresets the database with sample data. Run with: npm run seed
const db = require('./database');

db.serialize(() => {
  db.run('DELETE FROM comments');
  db.run('DELETE FROM notices');
  db.run('DELETE FROM users');
  db.run("DELETE FROM sqlite_sequence");  // reset auto-increment IDs

  const addUser = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.run(addUser, ['alice', 'alice@example.com', 'password123']);
  db.run(addUser, ['bob',   'bob@example.com',   'letmein']);

  const addNotice = 'INSERT INTO notices (user_id, title, description, category) VALUES (?, ?, ?, ?)';
  db.run(addNotice, [1, 'Lost cat', 'Grey tabby missing near the park. Answers to Milo.', 'Lost & Found']);
  db.run(addNotice, [2, 'Bike for sale', 'Blue road bike, good condition, €80.', 'For Sale']);
  db.run(addNotice, [1, 'Community clean-up', 'Saturday 10am at the library. Gloves provided.', 'Events']);

  db.run('INSERT INTO comments (notice_id, user_id, body) VALUES (?, ?, ?)',
    [1, 2, 'I think I saw him on Main Street yesterday!']);
}, );

db.close((err) => {
  if (err) return console.error(err.message);
  console.log('Database seeded');
});