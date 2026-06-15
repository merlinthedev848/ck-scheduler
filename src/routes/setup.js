const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  if (process.env.SETUP_COMPLETED === 'true') {
    return res.redirect('/');
  }
  res.render('setup/index', { title: 'CK Scheduler Setup Wizard' });
});

router.post('/', async (req, res) => {
  if (process.env.SETUP_COMPLETED === 'true') {
    return res.status(400).json({ error: 'Setup already completed' });
  }

  const {
    db_host, db_port, db_user, db_pass, db_name,
    admin_fname, admin_lname, admin_email, admin_pass,
    business_name
  } = req.body;

  try {
    // 1. Test Database Connection
    const connection = await mysql.createConnection({
      host: db_host,
      port: db_port,
      user: db_user,
      password: db_pass,
      database: db_name
    });
    await connection.end();

    // 2. Generate new .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    
    // Simple helper to replace or add env variables
    const updateEnv = (key, value) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    };

    updateEnv('DB_HOST', db_host);
    updateEnv('DB_PORT', db_port);
    updateEnv('DB_USER', db_user);
    updateEnv('DB_PASSWORD', db_pass);
    updateEnv('DB_NAME', db_name);
    updateEnv('SETUP_COMPLETED', 'true');
    updateEnv('APP_NAME', business_name);

    // Write to .env
    fs.writeFileSync(envPath, envContent.trim());

    // 3. Create temporary Knex instance for Migrations
    const tempKnex = knex({
      client: 'mysql2',
      connection: {
        host: db_host,
        port: db_port,
        user: db_user,
        password: db_pass,
        database: db_name
      },
      migrations: { directory: path.join(process.cwd(), 'database/migrations'), tableName: 'knex_migrations' }
    });

    // 4. Run Migrations
    await tempKnex.migrate.latest();

    // 5. Create Admin User explicitly here instead of seed file
    // Check if admin exists
    const existingAdmin = await tempKnex('users').where({ role: 'admin' }).first();
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(admin_pass, 12);
      const [adminId] = await tempKnex('users').insert({
        first_name: admin_fname,
        last_name:  admin_lname,
        email:      admin_email,
        password:   passwordHash,
        phone:      '07000000000',
        role:       'admin',
        timezone:   'Europe/London',
        language:   'en',
        is_active:  true,
        api_token:  uuidv4().replace(/-/g, '')
      });

      // Default category
      const [catId] = await tempKnex('service_categories').insert({ name: 'General', description: 'General appointment services', icon: 'bi-calendar-check' });
      
      // Default service
      await tempKnex('services').insert({
        name: 'Consultation',
        duration: 60,
        price: 0.00,
        currency: 'GBP',
        description: 'Initial consultation.',
        availabilities_type: 'flexible',
        attendants_number: 1,
        requires_payment: false,
        category_id: catId
      });
    }

    // Cleanup connection
    await tempKnex.destroy();

    res.json({ success: true, message: 'Setup completed successfully!' });

  } catch (err) {
    console.error('Setup Error:', err);
    res.status(500).json({ error: err.message || 'Failed to connect to the database or run migrations.' });
  }
});

module.exports = router;
