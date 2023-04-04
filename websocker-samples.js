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

const WebSocket = require('ws');

// If set enableTLS to true, your have to set tlsEnabled to true in conf/websocket.conf.
const enableTLS = true;
const token = "Your token, gen by cloud service account";
const topic = `${enableTLS ? 'wss' : 'ws'}://localhost:8080/ws/v2/producer/persistent/public/default/my-topic?token=` + token;
const ws = new WebSocket(topic);

var message = {
    "payload" : new Buffer("Hello World").toString('base64'),
    "properties": {
        "key1" : "value1",
        "key2" : "value2"
    },
    "context" : "1"
};

ws.on('open', function() {
    // Send one message
    ws.send(JSON.stringify(message));
});

ws.on('message', function(message) {
    console.log('received ack: %s', message);
});