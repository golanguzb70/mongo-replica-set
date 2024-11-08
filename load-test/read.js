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
    let res = http.get('http://localhost:3000/api/items');
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    sleep(1);
}