import * as request from 'supertest';
import app from 'server/server';

describe('Index Route', () => {
    test('GET', () => {
        return request(app).get('/')
            .then((res) => expect(res.status).toBe(200));
    });
});
