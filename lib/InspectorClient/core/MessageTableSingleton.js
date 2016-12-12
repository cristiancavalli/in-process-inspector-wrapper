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
const has = require('lodash').has;
const MessageIdNotFound = require('./errors/MessageIdNotFound');
const MessageIdAlreadyExists = require('./errors/MessageIdAlreadyExists');

class IdIterator {
  constructor () {
    this._id = 0;
  }
  _incrementId () {
    this._id += 1;
  }
  next () {
    var id = this._id;
    this._incrementId();
    return id;
  }
}

class MessageTable extends EventEmitter {
  static events () {
    return {
      NEW_REQUEST: 'NEW_REQUEST',
      REMOVE_REQUEST: 'REMOVE_REQUEST'
    };
  }
  constructor () {
    super();
    this._iterator = new IdIterator();
    this._table = {};
  }
  newMessageId () {
    return this._iterator.next();
  }
  addNewRequestListener (callback) {
    this.on(MessageTable.events().NEW_REQUEST, callback);
    return this;
  }
  addRemoveRequestListener (callback) {
    this.on(MessageTable.events().REMOVE_REQUEST, callback);
    return this;
  }
  _emitNewRequest (messageId) {
    this.emit(MessageTable.events().NEW_REQUEST,
      this.getRecord(messageId).requestPayload());
    return this;
  }
  _emitRemoveRequest (messageId) {
    this.emit(MessageTable.events().REMOVE_REQUEST,
      this.getRecord(messageId));
    return this;
  }
  checkByMessageId (messageId) {
    return has(this._table, messageId);
  } 
  getRecord (messageId) {
    if (!this.checkByMessageId(messageId)) {
      throw new MessageIdNotFound(messageId);
    }
    return this._table[messageId];
  }
  deleteRecord (messageId) {
    if (!this.checkByMessageId(messageId)) {
      throw new MessageIdNotFound(messageId);
    }
    this._emitRemoveRequest(messageId);
    delete this._table[messageId];
    return this;
  }
  setRecord (messageId, entry) {
    if (this.checkByMessageId(messageId)) {
      throw new MessageIdAlreadyExists(messageId);
    }
    this._table[messageId] = entry;
    this._emitNewRequest(messageId);
    return this;
  }
  getTable () {
    return this._table;
  }
  reset () {
    this._table = {};
  }
}

const singleton = new MessageTable();

module.exports = singleton;
