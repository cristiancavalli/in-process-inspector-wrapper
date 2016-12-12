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

const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');

class WebSocketsAdapter extends EventEmitter {
  static events () {
    return {
      NEW_INCOMING_REQUEST: 'NEW_INCOMING_REQUEST',
      CONNECT: 'CONNECT'
    }
  }
  constructor (addr) {
    super();
    var boundRequestHandler = (msg) => {
      // process.stdout.write(msg);
      try {
        var msg = this._emitNewIncomingMessage(JSON.parse(msg));
      } catch (e) {
        this._emitError(e);
      }
    }
    console.log('connecting to\n', addr)
    this._ws = new WebSocket(addr);
    this._ws.once('open', () => this._emitConnect());
    this._ws.on('message', boundRequestHandler)
    // TODO add attach/detach events
  }
  handleNewOutgoingRequest (obj) {
    process.stdout.write('HANDLING OUTGOING REQUEST\n');
    try {
      process.stdout.write('writing\n');
      process.stdout.write(JSON.stringify(obj));
      process.stdout.write('\n');
      this._ws.send(JSON.stringify(obj));
    } catch (e) {
      this._emitError(e)
    }
  }
  addNewIncomingMessageListener (fn) {
    this.on(WebSocketsAdapter.events().NEW_INCOMING_REQUEST, fn);
    return this;
  }
  removeNewIncomingMessageListener (fn) {
    this.removeListener(WebSocketsAdapter.events().NEW_INCOMING_REQUEST, fn);
    return this;
  }
  _emitNewIncomingMessage (msg) {
    this.emit(WebSocketsAdapter.events().NEW_INCOMING_REQUEST, msg);
  }
  addNewConnectListener (fn) {
    this.on(WebSocketsAdapter.events().CONNECT, fn);
  }
  _emitConnect () {
    this.emit(WebSocketsAdapter.events().CONNECT);
  }
  _emitError (e) {
    process.stdout.write(e.toString());
    this.emit('error', e);
  }
}

module.exports = WebSocketsAdapter;
