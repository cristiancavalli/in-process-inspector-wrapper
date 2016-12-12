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

const MessageTableSingleton = require('../core/MessageTableSingleton');
const DebuggerMessageInterface = require('../debugger/DebuggerMessageInterface');
const RuntimeMessageInterface = require('../runtime/RuntimeMessageInterface');
const isNumber = require('lodash.isnumber');
const isString = require('lodash.isstring');
const isEmpty = require('lodash.isempty');
const merge = require('lodash.merge');
const has = require('lodash.has');

function makeLogger () {
  const logLevel = (() => {
    return !isEmpty(process.env.GCLOUD_DEBUG_LOG_LEVEL) ?
      parseInt(process.env.GCLOUD_DEBUG_LOG_LEVEL) :
      5; // DEFAULT TO LOGGING EVERYTING
  })();
  
  return function (input, instLevel=5) {
    if (instLevel >= logLevel) {
      process.stdout.write(input);
      process.stdout.write('\n');
    }
  }
}

class MessageLayer {
  constructor (transportAdapter) {
    MessageTableSingleton.addNewRequestListener((req) => 
      transportAdapter.handleNewOutgoingRequest(req));
    transportAdapter.addNewIncomingMessageListener((msg) =>
      this._attemptMessageResolution(msg));
    this._logger = makeLogger();
    this._transport = transportAdapter;
    this._debugger = DebuggerMessageInterface;
    this._runtime = RuntimeMessageInterface;
    this._methodIntercepts = merge({}, this._debugger.commandMethodIntercepts(),
      this._runtime.commandMethodIntercepts());
  }
  _attemptMessageResolution (msg) {
    if (has(this._methodIntercepts, msg.method)) {
      this._methodIntercepts[msg.method](msg);
    } else if (MessageTableSingleton.checkByMessageId(msg.id)) {
      this._handleDefaultMessageLifecycle(msg);
    } else {
      this._handleUnknownMessage(msg);  
    };
    return this;
  }
  _handleDefaultMessageLifecycle (msg) {
    var entry = MessageTableSingleton.getRecord(msg.id);
    if (has(msg, 'error') && !isEmpty(msg.error)) {
      entry.reject(msg.error);
    } else {
      process.stdout.write('RESOLVING MSG '+msg.id+'\n');
      entry.resolve(msg.result);
    }
    return this;
  }
  _handleUnknownMessage (msg) {
    // this._logger('Got an unknown command: '+msg.method+' id: '+msg.id);
    // this._logger(JSON.stringify(msg, ' ', 4));
    // this._logger('\n--');
    return this;
  }
  transport () {
    return this._transport;
  }
  debugger () {
    return this._debugger;
  }
  runtime () {
    return this._runtime;
  }
  data () {
    return MessageTableSingleton;
  }
  newMessageId () {
    return MessageTableSingleton.newMessageId();
  }
  addNewIncomingMessageListener (fn) {
    this._transport.addNewIncomingMessageListener(fn);
  }
  addNewConnectListener (fn) {
    this._transport.addNewConnectListener(fn);
  }
  removeNewIncomingMessageListener (fn) {
    this._transport.removeNewIncomingMessageListener(fn);
  }
}

module.exports = MessageLayer;
