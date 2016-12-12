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
const keys = require('lodash.keys');
const has = require('lodash.has');
const MessageTableSingleton = require('./MessageTableSingleton');
const MessageIdNotFound = require('./errors/MessageIdNotFound');

class RPCCommandCollection extends EventEmitter {
  static events () {
    return {
      NEW_REQUEST: 'NEW_REQUEST',
      REQUEST_REJECTED: 'REQUEST_REJECTED',
      REQUEST_RESOLVED: 'REQUEST_RESOLVED',
    };
  }
  static data () {
    return MessageTableSingleton;
  }

  constructor () {
    super();
  }
  addNewCommandListener (callback) {
    this.on(RPCCommandCollection.events().NEW_REQUEST, callback);
    return this;
  }
  addCommandRejectionListener (callback) {
    this.on(RPCCommandCollection.events().REQUEST_REJECTED, callback);
    return this;
  }
  addCommandResolutionListener (callback) {
    this.on(RPCCommandCollection.events().REQUEST_RESOLVED, callback);
    return this;
  }
  _emitNewCommand (messageId) {
    this.emit(RPCCommandCollection.events().NEW_REQUEST,
      this.getCommand(messageId));
    return this;
  }
  _emitCommandRejection (messageId) {
    this.emit(RPCCommandCollection.events().REQUEST_REJECTED,
      this.getCommand(messageId));
    return this;
  }
  _emitCommandResolution (messageId) {
    this.emit(RPCCommandCollection.events().REQUEST_RESOLVED,
      this.getCommand(messageId));
    return this;
  }
  addCommand (messageId, entry) {
    RPCCommandCollection.data().setRecord(messageId, entry);
    return this._emitNewCommand(messageId);
  }
  newMessageId () {
    return MessageTableSingleton.newMessageId();
  }
  getCommand (messageId) {
    if (!RPCCommandCollection.data().checkByMessageId(messageId)) {
      return null;
    }
    return RPCCommandCollection.data().getRecord(messageId);
  }
  checkForCommand (messageId) {
    return RPCCommandCollection.data().checkByMessageId(messageId);
  }
  resolveCommand (messageId, result) {
    if (!RPCCommandCollection.data().checkByMessageId(messageId)) {
      throw new MessageIdNotFound(messageId);
    }
    this.getCommand(messageId).resolve(result);
    return this._emitCommandResolution(messageId);
  }
  rejectCommand (messageId, result) {
    if (!RPCCommandCollection.data().checkByMessageId(messageId)) {
      throw new MessageIdNotFound(messageId);
    }
    this.getCommand(messageId).reject(result);
    return this._emitCommandRejection(messageId);
  }
  decompose () {
    super
      .removeAllListeners(RPCCommandCollection.events().NEW_REQUEST)
      .removeAllListeners(RPCCommandCollection.events().REQUEST_REJECTED)
      .removeAllListeners(RPCCommandCollection.events().REQUEST_RESOLVED);
    return this;
  }
}

module.exports = RPCCommandCollection;
