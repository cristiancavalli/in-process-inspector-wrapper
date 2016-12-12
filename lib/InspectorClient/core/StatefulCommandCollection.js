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
const merge = require('lodash').merge;
const RPCCommandCollection = require('./RPCCommandCollection');
const MessageIdNotFound = require('./errors/MessageIdNotFound');

class StatefulCommandCollection extends RPCCommandCollection {
  static events () {
    return merge({UPDATE: 'UPDATE'}, RPCCommandCollection.events());
  }

  constructor () {
    super();

    this._state = null;
  }
  addUpdateListener (callback) {
    super.on(StatefulCommandCollection.events().UPDATE, callback);
    return this;
  }
  _emitUpdate () {
    super.emit(StatefulCommandCollection.events().UPDATE, this.getState());
    return this;
  }
  getState () {
    return this._state;
  }
  _setState (targetState) {
    this._state = targetState;
    return this._emitUpdate();
  }
  resolveCommand (messageId, result) {
    if (!super.checkForCommand(messageId)) {
      throw new MessageIdNotFound(messageId);
    }
    var cmd = super.getCommand(messageId).resolve(result);
    if (cmd.responsePayload() !== this.getState()) {
      this._setState(cmd.responsePayload());
    }
    super._emitCommandResolution(messageId);
    return this;
  }
  decompose () {
    super
      .removeAllListeners(StatefulCommandCollection.events().NEW_REQUEST)
      .removeAllListeners(StatefulCommandCollection.events().REQUEST_REJECTED)
      .removeAllListeners(StatefulCommandCollection.events().REQUEST_RESOLVED)
      .removeAllListeners(StatefulCommandCollection.events().UPDATE);
    return this;
  }
}

module.exports = StatefulCommandCollection;
