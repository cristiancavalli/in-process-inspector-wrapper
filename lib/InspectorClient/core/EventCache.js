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
const has = require('lodash.has');

class EventCache extends EventEmitter {
  static events () {
    return {
      NEW_ENTRY: 'NEW_ENTRY',
      DELETED_ENTRY: 'DELETED_ENTRY'
    };
  }

  constructor () {
    super();
    this._data = {};
  }
  _addEntry (id, entry) {
    this._data[id] = entry;
    return this._emitNewEntry(id, entry);
  }
  _removeEntry (id, entry) {
    delete this._data[id];
    return this._emitEntryDeleted(id, entry);
  }
  _getEntry (id) {
    return this._data[id];
  }
  _checkEntry (id) {
    return has(this._data, id);
  }
  _emitNewEntry (id, entry) {
    super.emit(EventCache.events().NEW_ENTRY, id, entry);
    return this;
  }
  _emitEntryDeleted (id, entry) {
    super.emit(EventCache.events().DELETED_ENTRY, id, entry);
    return this;
  }
  _getCache () {
    return this._data;
  }

  addNewEntryListener (callback) {
    super.on(EventCache.events().NEW_ENTRY, callback);
    return this;
  }
  removeNewEntryListener (callback) {
    super.removeListener(EventCache.events().NEW_ENTRY, callback);
    return this;
  }
  addEntryDeletedListener (callback) {
    super.on(EventCache.events().DELETED_ENTRY, callback);
    return this;
  }
  removeEntryDeletedListener (callback) {
    super.removeListener(EventCache.events().DELETED_ENTRY, callback);
    return this;
  }
}

module.exports = EventCache;
