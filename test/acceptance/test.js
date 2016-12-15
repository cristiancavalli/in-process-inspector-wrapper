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

const assert = require('assert');
const resolve = require('path').resolve;
const first = require('lodash.first');
const find = require('lodash.find');
const fixturePath = resolve(__dirname, '../fixtures/promise.js');
const fixture = require(fixturePath);
const Client = require('../../lib/InspectorClient/Client');
const clientInstance = new Client();

function awaitPromiseFromCallSite (properties) {
  var promiseObject = find(properties, {name: 'x'});
  assert(promiseObject.value.subtype === 'promise');
  return clientInstance.awaitPromise(promiseObject.value.objectId)
    .then((promiseValue) => 
      console.log('Successfully awaited promise:\n', promiseValue))
    .catch((err) => console.error(err));
}

function handleBreakpointHit (currentHit, allHits) {
  return clientInstance.getPropertiesFromBreakpoint(currentHit)
    .then((msg) => awaitPromiseFromCallSite(msg.result))
    .catch((err) => console.error('Got error in retrieving properties:\n',
      err));
}

function setBreakpoint (scriptId) {
  return clientInstance.setBreakpoint(scriptId, 22, 0, handleBreakpointHit);
}

clientInstance.addReadyListener(() => {
  const scriptCache = clientInstance.messageInterface().debugger()
    .parsedScriptCache();
  scriptCache.getEntryByUrl(fixturePath)
    .then((msg) => setBreakpoint(msg.params.scriptId))
    // After the breakpoint is set, invoke the fixture to trigger capture
    .then(() => fixture())
    .catch((err) => console.error('Got error:\n', err));
});
