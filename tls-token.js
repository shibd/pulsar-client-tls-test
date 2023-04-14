/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const Pulsar = require('pulsar-client');

(async () => {

    Pulsar.Client.setLogHandler((level, file, line, message) => {
        console.log('[%s][%s:%d] %s', Pulsar.LogLevel.toString(level), file, line, message);
    });

    const params = {
        token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5UTTROMEUwTlRSQk5FWTJRemMwTkRrME9FUTVRakV5TnpBek1rSTBNak00TVVSRFJESTVPUSJ9.eyJodHRwczovL3N0cmVhbW5hdGl2ZS5pby91c2VybmFtZSI6InRlc3RAby1zaXhsdS5hdXRoLnRlc3QuY2xvdWQuZ2NwLnN0cmVhbW5hdGl2ZS5kZXYiLCJpc3MiOiJodHRwczovL2F1dGgudGVzdC5jbG91ZC5nY3Auc3RyZWFtbmF0aXZlLmRldi8iLCJzdWIiOiJBc0h6NlExWkM5VXJycndDZHZWdXQwbkZwV1NCblBFaEBjbGllbnRzIiwiYXVkIjoidXJuOnNuOnB1bHNhcjpvLXNpeGx1OmJhb2RpLXRlc3QiLCJpYXQiOjE2ODE0NjMwNDYsImV4cCI6MTY4MjA2Nzg0NiwiYXpwIjoiQXNIejZRMVpDOVVycnJ3Q2R2VnV0MG5GcFdTQm5QRWgiLCJzY29wZSI6ImFkbWluIGFjY2VzcyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbImFkbWluIiwiYWNjZXNzIl19.QYJoR-kUK7rLDZxfuDPpXUFVhpQJHk5VaO4akOuAGS7kZ6ga6ufFZBKBpHf-IJQ8uikC3WUDGVR-Du81_yqftJTOyFWz3nXHDkenOQJQbfpj-e7Fsd35emV-Zttw5co2-hk_OqrFngg6uBaoG9twB3l7upe6eAjt2JZw8Ty2TAAmBRFwN0_ZnNHmBs4gBhQiujeqoQ0lCJKZcJX4eZYDdPOztQFfMEnqMbRgxLGK1TNdax3aF8tSFn0NeZHkiDslXMu7T25IM_LPnL63hWeHDXJY9b22kuTEcn0VhFNvqlXA-o1YlKsj0TTiRBVMN5PEru4jcL_NlBFUzMq-wU28GQ"
    }
    const auth = new Pulsar.AuthenticationToken(params)
    //
    // Create a client
    const client = new Pulsar.Client({
        serviceUrl: 'pulsar+ssl://baodi-test-7407d844-b456-49e1-987c-24f1a5c162cb.usce1-whale.test.g.sn2.dev:6651',
        authentication: auth,
        useTls: true,
        tlsValidateHostname: true,
        // dont allow insecure connection
        tlsAllowInsecureConnection: false,
    });

    const topic = 'test-tls' + Math.round(100000) ;

    // Create a producer
    const producer = await client.createProducer({
        topic: topic,
        sendTimeoutMs: 30000,
        batchingEnabled: true,
    });

    // Create a consumer
    const consumer = await client.subscribe({
        topic: topic,
        subscription: 'sub1',
        subscriptionType: 'Shared',
        ackTimeoutMs: 10000,
    });

    // Send messages
    for (let i = 0; i < 10; i += 1) {
        const msg = `my-message-${i}`;
        producer.send({
            data: Buffer.from(msg),
        });
        console.log(`Sent message: ${msg}`);
    }

    // Receive messages
    for (let i = 0; i < 10; i += 1) {
        const msg = await consumer.receive();
        console.log(msg.getData().toString());
        consumer.acknowledge(msg);
    }

    await client.close();
})();
