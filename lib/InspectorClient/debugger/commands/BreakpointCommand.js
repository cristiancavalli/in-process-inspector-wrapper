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

const RPCCommand = require('../../core/RPCCommand');

class BreakpointCommand extends RPCCommand {
  static events () {
    return {
      RESOLVED: 'RESOLVED',
      REJECTED: 'REJECTED',
      BREAKPOINT_HIT: 'BREAKPOINT_HIT'
    };
  }
  constructor (messageId, method) {
    super(messageId, method);
    this._breakpointHits = [];
  }
  addBreakpointHitListener (callback) {
    // Use `.on` and not `.once` since a single breakpoint can be
    // hit multiple times
    super.on(BreakpointCommand.events().BREAKPOINT_HIT, callback);
    return this;
  }
  removeBreakpointHitListener (callback) {
    super.removeBreakpointHitListener(BreakpointCommand.events().BREAKPOINT_HIT,
      callback);
    return this;
  }
  _emitBreakpointHit (evtObj) {
    super.emit(BreakpointCommand.events().BREAKPOINT_HIT, evtObj,
      this._breakpointHits);
    return this;
  }
  setBreakpointHit (evtObj) {
    this._breakpointHits.push(evtObj);
    this._emitBreakpointHit(evtObj);
    return this;
  }
  breakpointHits () {
    return this._breakpointHits;
  }
}

module.exports = BreakpointCommand;
