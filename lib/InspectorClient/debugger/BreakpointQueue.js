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

const forEach = require('lodash.foreach');
const first = require('lodash.first');
const indexOf = require('lodash.indexof');
const every = require('lodash.every');
const RPCCommandCollection = require('../core/RPCCommandCollection');
const SetBreakpointCommand = require('./commands/SetBreakpointCommand');
const InvalidTypeGivenForCommand = require('../errors/InvalidTypeGivenForCommand');

class BreakpointQueue extends RPCCommandCollection {
  static eventNames () {
    return {
      paused: 'Debugger.paused'
    };
  }

  constructor () {
    super();
  }
  newCommand (messageId, location, condition) {
    return new SetBreakpointCommand(messageId, location, condition);
  }
  addCommand (messageId, entry) {
    if (entry instanceof SetBreakpointCommand) {
      super.addCommand(messageId, entry);
      return this;
    }
    throw new InvalidTypeGivenForCommand(SetBreakpointCommand.name);
  }
  searchForMatchingBreakpoint (msg) {
    if (!msg.params || !msg.params.hitBreakpoints) {
      return;
    }
    const data = RPCCommandCollection.data();
    const hitBreakpoints =  msg.params.hitBreakpoints;
    // TODO: create instanced cache of time-ordered, unremoved breakpoint
    // entries to reduce search-space
    forEach(data.getTable(), (cmd, msgId) => {
      // Only look for breakpoints which have been completed --
      // meaning that the V8 inspector has responded to the initial
      // set request and provided a resolved location which should always
      // be the topmost call frame's location
      if (!cmd.isCompleted() || cmd.method() !== SetBreakpointCommand.method()) {
        return;
      }
      const isInHitPool = indexOf(hitBreakpoints,
        cmd.responsePayload().breakpointId) > -1;
      // If the locations match (this includes a scriptId match) and the one
      // breakpoint location assumption is still valid then this can be the
      // only match to the currently pooled breakpoint
      if (isInHitPool) {
        cmd.setBreakpointHit(msg);
        // Only one breakpoint to resolve, exit early
        if (hitBreakpoints.length === 1) {
          return false;
        }
      }
    });
  }
}

module.exports = BreakpointQueue;
