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

const EventCache = require('../../core/EventCache');
const isObject = require('lodash.isobject');
const has = require('lodash.has');
const find = require('lodash.find');

class ScriptParsed extends EventCache {
  static eventNames () {
    return {
      parsed: 'Debugger.scriptParsed',
      failedToParse: 'Debugger.scriptFailedToParse'
    }
  }
  static validateEntry (entry) {
    return isObject(entry) && isObject(entry.params) &&
      ((entry.method === ScriptParsed.eventNames().parsed) ||
      (entry.method === ScriptParsed.eventNames().failedToParse));
  }

  constructor () {
    super();
  }

  addEntry (entry) {
    if (!ScriptParsed.validateEntry(entry)) {
      throw new TypeError(
        'Must supply a valid scriptParsed or scriptFailedToParse event');
    }
    super._addEntry(entry.params.scriptId, entry);
    return this;
  }

  getEntry (id) {
    return new Promise((resolve, reject) => {
      if (super._checkEntry(id)) {
        return resolve(super._getEntry(id));
      }
      let listener = (newEntryId, newEntry) => {
        if (id === newEntryId) {
          super.removeNewEntryListener(listener);
          resolve(super._getEntry(newEntryId));
        }
      };
      super.addNewEntryListener(listener);
    });
  }

  getEntryByUrl (url) {
    return new Promise((resolve, reject) => {
      var entry = find(super._getCache(), {params: {url: url}});
      if (entry) {
        return resolve(entry);
      }
      let listener = (newEntryId, newEntry) => {
        if (newEntry.params.url === url) {
          super.removeNewEntryListener(listener);
          resolve(newEntry);
        }
      };
      super.addNewEntryListener(listener);
    });
  }
}

module.exports = ScriptParsed;
