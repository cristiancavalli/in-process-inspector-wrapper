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
const isNumber = require('lodash.isnumber');
const isString = require('lodash.isstring');


class RPCCommand extends EventEmitter {
  static events () {
    return {
      RESOLVED: 'RESOLVED',
      REJECTED: 'REJECTED'
    };
  }

  constructor (messageId, method) {
    super();

    if (!isNumber(messageId)) {
      throw new TypeError([
        'Must supply a valid numeric message id as the only argument when',
        'creating a new instance of the RPCCommand class.'
      ].join(' '));
    } else if (!isString(method)) {
      throw new TypeError('Method must be a string');
    }

    this._isCompleted = false;
    this._isSuccessful = false;
    this._commandMessageId = messageId;
    this._method = method;
    this._rawCommandResultPayload = null;
    this._requestPayload = {id: messageId, method: method};
  }
  setRequestParams(objPayload) {
    this._requestPayload.params = objPayload;
    return this;
  }
  addResolutionListener (callback) {
    super.once(RPCCommand.events().RESOLVED, callback);
    return this;
  }
  addRejectionListener (callback) {
    super.once(RPCCommand.events().REJECTED, callback);
    return this;
  }
  emitResolution () {
    super.emit(RPCCommand.events().RESOLVED, this._rawCommandResultPayload, this);
    return this;
  }
  emitRejection () {
    super.emit(RPCCommand.events().REJECTED, this._rawCommandResultPayload, this);
    return this;
  }
  resolve (payload) {
    process.stdout.write('RESOLVING COMMAND '+this._commandMessageId+'\n')
    return this.setResponsePayload(payload)._setCompleted()._setSuccessful()
      .emitResolution();
  }
  reject (payload) {
    return this.setResponsePayload(payload)._setCompleted().emitRejection();
  }
  isCompleted () {
    return this._isCompleted;
  }
  isSuccessful () {
    return this._isSuccessful;
  }
  _setCompleted () {
    this._isCompleted = true;
    return this;
  }
  _setSuccessful () {
    this._isSuccessful = true;
    return this;
  }
  responsePayload () {
    return this._rawCommandResultPayload;
  }
  setResponsePayload (payload) {
    this._rawCommandResultPayload = payload;
    return this;
  }
  requestPayload () {
    return this._requestPayload;
  }
  messageId () {
    return this._commandMessageId;
  }
  method () {
    return this._method;
  }
  decompose () {
    super
      .removeAllListeners(RPCCommand.events().RESOLVED)
      .removeAllListeners(RPCCommand.events().REJECTED);
    return this;
  }
}

module.exports = RPCCommand;
