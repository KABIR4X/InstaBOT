// database.test.js

const { connectToDatabase, closeDatabase } = require('../database');

describe('Database Functionality', () => {
    let db;

    beforeAll(async () => {
        db = await connectToDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    test('should find a user by ID', async () => {
        const userId = '12345';
        const user = await db.collection('users').findOne({ _id: userId });
        expect(user).toBeDefined();
        expect(user._id).toEqual(userId);
    });

    test('should insert a new user', async () => {
        const newUser = { name: 'Test User', email: 'test@example.com' };
        const result = await db.collection('users').insertOne(newUser);
        expect(result.insertedCount).toBe(1);
    });
});