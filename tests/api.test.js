const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../server");

let server;

test.before(() => {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => resolve());
  });
});

test.after(() => {
  if (server) server.close();
});

function apiGet(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      `http://localhost:${server.address().port}${path}`,
      { headers: { Accept: "application/json" } },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );
    req.on("error", reject);
  });
}

function apiPost(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      `http://localhost:${server.address().port}${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );
    req.write(payload);
    req.end();
  });
}

test("GET /api/health returns ok", async () => {
  const res = await apiGet("/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
});

test("GET /api/look returns current room", async () => {
  const res = await apiGet("/api/look");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
  assert.ok(typeof res.body.description === "string");
  assert.ok(Array.isArray(res.body.exits));
});

test("POST /api/move north changes room", async () => {
  const res = await apiPost("/api/move", { direction: "north" });
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
  assert.equal(res.body.description, "你在北边森林");
  assert.deepEqual(res.body.exits, ["south"]);
});

test("POST /api/move with missing direction returns 400", async () => {
  const res = await apiPost("/api/move", {});
  assert.equal(res.status, 400);
  assert.equal(res.body.status, "error");
  assert.equal(res.body.code, "MISSING_DIRECTION");
});

test("POST /api/move invalid direction returns 400", async () => {
  const res = await apiPost("/api/move", { direction: "up" });
  assert.equal(res.status, 400);
  assert.equal(res.body.status, "error");
  assert.equal(res.body.code, "INVALID_DIRECTION");
});

test("POST /api/move blocked direction returns 400", async () => {
  const res = await apiPost("/api/move", { direction: "north" });
  assert.equal(res.status, 400);
  assert.equal(res.body.status, "error");
  assert.equal(res.body.code, "BLOCKED");
});
