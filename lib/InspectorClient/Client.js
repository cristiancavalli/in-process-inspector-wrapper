/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const first = require('lodash.first');
const isFunction  = require('lodash.isfunction');
const EventEmitter = require('events').EventEmitter;
const has = require('lodash.has');
// const WebSocketInterface = require('./messageInterfaces/WebSocketInterface');
const MessageInterface = require('./messageInterfaces/EventEmitterInterface');

class Client extends EventEmitter {
  static events () {
    return {
      READY: 'READY',
      ERROR: 'ERROR'
    };
  }

  constructor () {
    super();
    this._messageInterface = MessageInterface;
    MessageInterface.addNewConnectListener(() => {
      this._enableRuntime()
        .then(() => this._enableDebugger())
        .then(() => this._emitReady())
        .catch((err) => this._emitError(err));
    });
  }

  // READY event interface
  addReadyListener (callback) {
    super.on(Client.events().READY, callback);
    return this;
  }
  removeReadyListener (callback) {
    super.removeListener(Client.events().READY, callback);
    return this;
  }
  _emitReady () {
    super.emit(Client.events().READY, this);
  }
  // ERROR event interface
  addErrorListener (callback) {
    super.on(Client.events().ERROR, callback);
    return this;
  }
  removeErrorListener (callback) {
    super.removeListener(Client.events().ERROR, callback);
    return this;
  }
  _emitError (err) {
    super.emit(Clients.events().ERROR, err);
  }

  _enableRuntime () {
    return new Promise((resolve, reject) => {
      const enable = MessageInterface.runtime().enableQueue();
      const id = MessageInterface.newMessageId();
      const cmd = enable.newEnableCommand(id);
      cmd.addResolutionListener((cmd) => resolve(cmd))
        .addRejectionListener((err) => reject(err));
      enable.addCommand(id, cmd);
    });
  }
  _enableDebugger () {
    return new Promise((resolve, reject) => {
      const enable = MessageInterface.debugger().enableQueue();
      const id = MessageInterface.newMessageId();
      const cmd = enable.newEnableCommand(id);
      cmd.addResolutionListener((cmd) => resolve(cmd))
        .addRejectionListener((err) => reject(err));
      enable.addCommand(id, cmd);
    });
  }
  setBreakpoint (scriptId, lineNumber=0, columnNumber=0, hitCallback) {
    return new Promise((resolve, reject) => {
        const breakpoint = MessageInterface.debugger().breakpoint();
        const id = MessageInterface.newMessageId();
        const cmd = breakpoint.newCommand(id, {
          scriptId: scriptId,
          lineNumber: lineNumber,
          columnNumber: columnNumber
        })
          .addResolutionListener((resp) => resolve(resp))
          .addRejectionListener((err) => reject(err))
          .addBreakpointHitListener((thisHit, allHits) => {
            if (isFunction(hitCallback)) {
              hitCallback(thisHit, allHits);
            }
          });
        breakpoint.addCommand(id, cmd);
    });
  }
  getPropertiesFromBreakpoint (breakpointHit, targetScopeNumber=0) {
    return new Promise((resolve, reject) => {
      const scopes = first(breakpointHit.params.callFrames).scopeChain;
      const targetScopeId = scopes[targetScopeNumber].object.objectId;
      const properties = MessageInterface.runtime().getProperties();
      const id = MessageInterface.newMessageId();
      const cmd = properties.newCommand(id, targetScopeId, false, false, true)
        .addResolutionListener((resp) => resolve(resp))
        .addRejectionListener((err) => reject(err));
      properties.addCommand(id, cmd);
    });
  }
  awaitPromise (objectId) {
    return new Promise((resolve, reject) => {
      const promise = MessageInterface.runtime().promise();
      const id = MessageInterface.newMessageId();
      const cmd = promise.newCommand(id, objectId, true, false)
        .addResolutionListener((resp) => resolve(resp))
        .addRejectionListener((err) => reject(err));
      promise.addCommand(id, cmd);
    });
  }

  messageInterface () {
    return this._messageInterface;
  }
}

module.exports = Client;

// function testMe () {
//   process.stdout.write('RESOLVING PROMISE\n');
//   var x = new Promise(function (resolve, reject) {
//     setTimeout(() => resolve({ts: Date.now()}), 2000);
//   });
//   const a = 1;
//   return x;
// }

// var inst;
// var addr = '';

function headless() {

  MessageInterface.addNewIncomingMessageListener(function (msg) {
    if (has(msg, 'id')) {
      process.stdout.write('Got new response message \n');
      process.stdout.write(JSON.stringify(msg, ' ', 2));
      process.stdout.write('\n--\n\n');
    } else if (msg.method === 'Debugger.scriptParsed') {
      process.stdout.write('Parsed '+msg.params.scriptId+'\n');
      process.stdout.write('  '+msg.params.url+'\n\n--\n');
    } else if (msg.method === 'Debugger.paused') {
      process.stdout.write('--\n');
      process.stdout.write('Debugger paused at '+Date.now()+'\n');
      process.stdout.write('--\n');
    } else {
      process.stdout.write('New message '+msg.method+'\n');
      process.stdout.write(JSON.stringify(msg, ' ', 2)+'\n')
    }
  });
}

// headless();

// inst = headless();

// setInterval(testMe, 4000);
 

// prompt.start();

// prompt.get(['addr'], function (err, result) {
//   if (err) {
//     throw new Error(err.message);
//   }
//   inst = new Client();
//   inst.addNewIncomingMessageListener(function (msg) {
//     if (has(msg, 'id')) {
//       process.stdout.write('Got new response message \n');
//       process.stdout.write(JSON.stringify(msg, ' ', 2));
//       process.stdout.write('\n--\n\n');
//     } else if (msg.method === 'Debugger.scriptParsed') {
//       process.stdout.write('Parsed '+msg.params.scriptId+'\n');
//       process.stdout.write('  '+msg.params.url+'\n\n--\n');
//     } else if (msg.method === 'Debugger.paused') {
//       process.stdout.write('--\n');
//       process.stdout.write('Debugger paused at '+Date.now()+'\n');
//       process.stdout.write('--\n');
//     } else {
//       process.stdout.write('New message '+msg.method+'\n');
//       process.stdout.write(JSON.stringify(msg, ' ', 2)+'\n')
//     }
//   });
// })

// setInterval(() => console.log('-- ping -- '), 7500);
// setTimeout(function() {
//   console.log('initializing client');
//   new Client();
// }, 35000);
