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

class EventEmitterAdapter extends EventEmitter {
  static events () {
    return {
      NEW_INCOMING_REQUEST: 'NEW_INCOMING_REQUEST',
      CONNECT: 'CONNECT'
    }
  }
  constructor () {
    super();
    const boundRequestHandler = (msg) => {
      try {
        var msg = this._emitNewIncomingMessage(JSON.parse(msg));
      } catch (e) {
        this._emitError(e);
      }
    }
    process.inspector.Connect(boundRequestHandler);
    // since we are connected automatically, emit
    this._connected = true;    
    this._emitConnect();
  }
  handleNewOutgoingRequest (obj) {
    process.stdout.write('writing to message layer: \n\t'+JSON.stringify(obj));
    process.stdout.write('\n');
    try {
      process.inspector.Dispatch(JSON.stringify(obj));
    } catch (e) {
      this._emitError(e)
    }
  }
  addNewIncomingMessageListener (fn) {
    this.on(EventEmitterAdapter.events().NEW_INCOMING_REQUEST, fn);
    return this;
  }
  removeNewIncomingMessageListener (fn) {
    this.removeListener(EventEmitterAdapter.events().NEW_INCOMING_REQUEST, fn);
    return this;
  }
  _emitNewIncomingMessage (msg) {
    this.emit(EventEmitterAdapter.events().NEW_INCOMING_REQUEST, msg);
  }
  addNewConnectListener (fn) {
    if (this._connected) {
      setImmediate(fn);
      return;
    }
    this.once(EventEmitterAdapter.events().CONNECT, fn);
  }
  _emitConnect () {
    this.emit(EventEmitterAdapter.events().CONNECT);
  }
  _emitError (e) {
    process.stdout.write(e.toString());
    this.emit('error', e);
  }
}

module.exports = EventEmitterAdapter;
