import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 500 }, // ramp up to 10 users
        { duration: '1m', target: 500 },  // stay at 10 users for 1 minute
        { duration: '30s', target: 0 },  // ramp down to 0 users
    ],
};
export default function () {
    const url = 'http://localhost:3000/api/items';
    const payload = JSON.stringify({
        name: 'Apple',
        description: 'Red Delicious Apples',
        quantity: 11,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
        },
    };

    let res = http.post(url, payload, params);
    check(res, {
        'is status 201': (r) => r.status === 201,
    });

    sleep(1);
}