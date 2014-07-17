
// This is intended to be for testing purposes only. The object
// returned by this module is a mock-database

module.exports = {
  subscribers: [
    {
      email: 'jasson.casey@gmail.com',
      // password is iluvflowg encrypted
      password: '$2a$10$UE4Xn0wCQV4tQypIrRTo1.q/4en6shWn6myN8wHqpUn47qT9Nmd9G',
      reg_date: new Date(),
      reg_ip: '127.0.0.1',
      verification_token: 'c2e6de55-2030-41e0-aa48-6ce5d2314a67',
      status: 'CREATED'                        // CREATED | ACTIVE | RESET | CLOSED,
    }
  ],
  sessions: [
    {
      subscriberId: 1,
      key: 'f151d3c9-2452-41b2-a249-8b8cb2535097',
      timeout: ''
    }
  ]
}

