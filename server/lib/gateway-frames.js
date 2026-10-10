"use strict";

// Shared gateway wire-frame helpers used by server/hermes-gateway-adapter.js
// and server/demo-gateway-adapter.js. Single source of truth for the frame shape.

const { randomBytes } = require("crypto");

function resOk(id, payload) {
  return { type: "res", id, ok: true, payload: payload ?? {} };
}

function resErr(id, code, message) {
  return { type: "res", id, ok: false, error: { code, message } };
}

function randomId() {
  return randomBytes(8).toString("hex");
}

module.exports = { resOk, resErr, randomId };
