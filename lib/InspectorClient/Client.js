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

var prompt = require('prompt');
const first = require('lodash.first');
const EventEmitter = require('events').EventEmitter;
const has = require('lodash.has');
// const WebSocketInterface = require('./messageInterfaces/WebSocketInterface');
const MessageInterface = require('./messageInterfaces/EventEmitterInterface');

class Client extends EventEmitter {
  constructor () {
    super();
    this._messageInterface = MessageInterface;
    MessageInterface.addNewConnectListener(() => {
      console.log('CONNECT WAS FIRED');
      this._enableRuntime()
        .then(() => this._enableDebugger())
        // .then(() => this._setSkipAllPauses())
        .then(() => this._setBreakpoint())
        // .then(() => {
        //   return new Promise((resolve, reject) => {
        //       setTimeout(() => {
        //         console.log('breakpoint calling');
        //         this._testBreakpoint();
        //         resolve(true);
        //       }, 5500);
        //   });
        // })
        .catch((err) => console.error(err));
    })
  }
  _enableRuntime () {
    return new Promise((resolve, reject) => {
      const enable = this._messageInterface.runtime().enableQueue();
      const id = this._messageInterface.newMessageId();
      const cmd = enable.newEnableCommand(id);
      cmd.addResolutionListener((cmd) => resolve(cmd))
        .addRejectionListener((err) => reject(err));
      enable.addCommand(id, cmd);
    });
  }
  _enableDebugger () {
    return new Promise((resolve, reject) => {
      const enable = this._messageInterface.debugger().enableQueue();
      const id = this._messageInterface.newMessageId();
      const cmd = enable.newEnableCommand(id);
      cmd.addResolutionListener((cmd) => resolve(cmd))
        .addRejectionListener((err) => reject(err));
      enable.addCommand(id, cmd);
    });
  }
  _setSkipAllPauses () {
    return new Promise((resolve, reject) => {
      const skipAllPauses = this._messageInterface.debugger().skipAllPauses();
      const id = this._messageInterface.newMessageId();
      // Skip all pauses so as not pause library
      const cmd = skipAllPauses.newCommand(id, true);
      cmd.addResolutionListener((resp, cmd) => {
        process.stdout.write(cmd.requestPayload().method+' resolved!\n');
        resolve(cmd);
      })
      .addRejectionListener((err) => reject(err));
      skipAllPauses.addCommand(id, cmd);
    });
  }
  _setBreakpoint () {
    return new Promise((resolve, reject) => {
        const breakpoint = this._messageInterface.debugger().breakpoint();
        const id = this._messageInterface.newMessageId();
        const cmd = breakpoint.newCommand(id, {
          scriptId: '54',
          lineNumber: 156
        });
        cmd.addResolutionListener(function (resp, cmd) {
          process.stdout.write(cmd.requestPayload().method+' resolved!\n');
          resolve(cmd);
        })
        .addRejectionListener((err) => reject(err))
        .addBreakpointHitListener((thisHit, previousHits) => {
          this._getProperties(thisHit);
          // const execution = this._messageInterface.debugger().execution();
          // const id = this._messageInterface.newMessageId();
          // const cmd = execution.newResumeCommand(id);
          // cmd.addResolutionListener((resp, cmd) => {
          //   process.stdout.write('After debugger pause, execution state has resumed\n');
          //   process.stdout.write(JSON.stringify(cmd, ' ', 2));
          //   process.stdout.write('--\n');
          // });
          // execution.addCommand(id, cmd);
        });
      breakpoint.addCommand(id, cmd);  
    });
  }
  _getProperties (breakpointHit) {
    return new Promise((resolve, reject) => {
      const targetScopes = first(breakpointHit.params.callFrames).scopeChain;
      const localScope = first(targetScopes).object.objectId;
      const closureScope = targetScopes[1].object.objectId;
      const properties = this._messageInterface.runtime().getProperties();
      const lclId = this._messageInterface.newMessageId();
      const clsId = this._messageInterface.newMessageId();
      const lclCmd = properties.newCommand(lclId, localScope, false, false, true);
      const clsCmd = properties.newCommand(clsId, closureScope, false, false, true);
      lclCmd.addResolutionListener((resp) => {
        process.stdout.write('Get properties local\n');
        process.stdout.write(JSON.stringify(resp, ' ', 2));
        process.stdout.write('\n--\n');
        this._awaitPromise(resp.result[0].value.objectId);
      })
      .addRejectionListener((err) => reject(err));
      properties.addCommand(lclId, lclCmd)
    }).catch((err) => console.error('got error', err));
  }
  _awaitPromise (objectId) {
    return new Promise((resolve, reject) => {
      const promise = this._messageInterface.runtime().promise();
      const id = this._messageInterface.newMessageId();
      const cmd = promise.newCommand(id, objectId, true, false);
      cmd
      .addResolutionListener((resp) => {
        process.stdout.write('Await promise results\n');
        process.stdout.write(JSON.stringify(resp, ' ', 2));
        process.stdout.write('\n--\n');
      })
      promise.addCommand(id, cmd)
      // const execution = this._messageInterface.debugger().execution();
      // const idx = this._messageInterface.newMessageId();
      // const cmdx = execution.newResumeCommand(idx);
      // execution.addCommand(idx, cmdx);
    }).catch((e) => console.error(e));
  }
}

function testMe () {
  process.stdout.write('RESOLVING PROMISE\n');
  var x = new Promise(function (resolve, reject) {
    setTimeout(() => resolve({ts: Date.now()}), 2000);
  });
  const a = 1;
  return x;
}

var inst;
var addr = '';

function headless() {
  var cl = new Client();
  MessageInterface.addNewIncomingMessageListener(function (msg) {
    if (has(msg, 'id')) {
      process.stdout.write('Got new response message \n');
      process.stdout.write(JSON.stringify(msg, ' ', 2));
      process.stdout.write('\n--\n\n');
    } else if (msg.method === 'Debugger.scriptParsed') {
      process.stdout.write('Parsed '+msg.params.scriptId+'\n');
      process.stdout.write('  '+msg.params.url+'\n\n--\n');
    } else if (msg.method === 'Debugger.paused') {
      process.stdout.write('Debugger paused at '+Date.now()+'\n');
    } else {
      process.stdout.write('New message '+msg.method+'\n');
      process.stdout.write(JSON.stringify(msg, ' ', 2)+'\n')
    }
  });
  return cl;
}

inst = headless();

setInterval(testMe, 4000)
 

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
//       process.stdout.write('Debugger paused at '+Date.now()+'\n');
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
