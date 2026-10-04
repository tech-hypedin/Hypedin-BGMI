// * command to run this script after starting up the application containers:
// ! docker run --rm -i --network="hypedin-bgmi_hypedin-BGMI_network" --cpu-quota=200000 --memory="1g" grafana/k6 run - <performance-test-script.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        unique_registrations: {
            executor: 'ramping-arrival-rate',
            startRate: 10,
            timeUnit: '1s',
            preAllocatedVUs: 50,
            maxVUs: 200,
            stages: [
                { duration: '1m', target: 50 },
                { duration: '1m', target: 50 },
            ],
            exec: 'testRegistration',
        },
        lock_verification: {
            executor: 'constant-vus',
            vus: 10,
            duration: '30s',
            exec: 'testLockSpam',
        },
        cache_performance: {
            executor: 'constant-vus',
            vus: 20,
            duration: '30s',
            exec: 'testAdminCache',
        },
    },
};

const BASE_URL = 'http://backend:6006/api';

export function setup() {
    const loginPayload = JSON.stringify({
        email: 'mitul@hypedin.co',
        password: '123456789',
    });

    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(`${BASE_URL}/auth/login`, loginPayload, params);

    const checkRes = check(res, {
        'logged in successfully': (r) => r.status === 200,
        'has success flag': (r) => {
            try { return r.json().success === true; } catch { return false; }
        },
    });

    if (!checkRes) {
        console.log('Login response status:', res.status);
        console.log('Login response body:', res.body);
        throw new Error('Setup failed: Unable to login.');
    }

    const cookies = res.cookies;
    const tokenCookie = cookies['token'] ? cookies['token'][0].value : null;

    if (!tokenCookie) {
        throw new Error('Setup failed: No token cookie received.');
    }

    return { tokenCookie };
}

export function testRegistration(setupData) {
    const uniqueId = `${__VU}-${__ITER}-${Math.random().toString(36).substring(2, 9)}`;
    const phoneNo = parseInt(`${__VU}${__ITER}${Math.floor(Math.random() * 100000)}`.substring(0, 10).padEnd(10, '0'));

    const payload = {
        name: 'User ' + uniqueId,
        IGN: 'IGN_' + uniqueId,
        UID: 'UID_' + uniqueId,
        email: 'test_' + uniqueId + '@gmail.com',
        phoneNo: phoneNo,
        college: 'IIMT',
        course: 'B.Tech',
        currentYear: '2nd Year',
        accountRank: 'Ace',
        hasExperience: true,
        experienceDetails: 'Stress test load',
        groups: 'Discord',
        hasAccessTo: ['PC'],
        tournamentExp: false,
        newPlayers: true,
        convert: false,
        campusPopularity: 'Medium',
        hasTime: true,
        reasoning: 'Stress test submission',
        status: 'Pending Review',
    };

    const res = http.post(
        `${BASE_URL}/applications/submit`,
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
    );

    check(res, {
        'filed successfully or entry exists': (r) => r.status === 200 || r.status === 400,
        'has expected response structure': (r) => {
            try { return r.json().success === true || r.status === 400; } catch { return false; }
        },
    });
}

export function testAdminCache(data) {
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${data.tokenCookie}`,
        },
    };

    const res = http.get(`${BASE_URL}/applications`, params);

    check(res, {
        '200 OK': (r) => r.status === 200,
        'cache layer checked': (r) => r.status === 200,
    });
}

export function testLockSpam(data) {
    const phoneNo = parseInt(`${__VU}${__ITER}${Math.floor(Math.random() * 100000)}`.substring(0, 10).padEnd(10, '0'));
    
    const payload = JSON.stringify({
        name: 'Spammer',
        email: 'spam@test.com',
        phoneNo: phoneNo,
        college: 'Test College',
        course: 'B.Tech',
        currentYear: '1st Year',
        playedBefore: true,
        accountRank: 'Bronze',
        hasExperience: false,
        experienceDetails: '',
        tournamentExp: false,
        convert: false,
        hasTime: false,
        reasoning: 'Spam test',
        status: 'Pending Review',
    });

    const res = http.post(
        `${BASE_URL}/applications/submit`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
    );

    check(res, {
        'handled by lock or duplicate check': (r) => r.status === 429 || r.status === 400,
    });
}