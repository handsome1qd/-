const express = require("express");
const Game = require("./engine/game");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const game = new Game();

// ── Helpers ──────────────────────────────────────────────

function currentRoomState() {
  const room = game.player.currentRoom;
  return {
    roomId: room.description,
    description: room.description,
    exits: Object.keys(room.exits),
  };
}

function errorResponse(code, message) {
  return { status: "error", code, message };
}

// ── Routes ───────────────────────────────────────────────

app.get("/api/look", (_req, res) => {
  const state = currentRoomState();
  res.json({ status: "ok", ...state });
});

app.post("/api/move", (req, res) => {
  const { direction } = req.body || {};

  if (!direction) {
    return res.status(400).json(errorResponse("MISSING_DIRECTION", "缺少方向参数"));
  }

  const validDirs = ["north", "south", "east", "west"];
  if (!validDirs.includes(direction)) {
    return res.status(400).json(errorResponse("INVALID_DIRECTION", "不能往这个方向走！"));
  }

  const nextRoom = game.player.currentRoom.getExit(direction);
  if (!nextRoom) {
    return res.status(400).json(errorResponse("BLOCKED", "不能往这个方向走！"));
  }

  game.player.moveTo(nextRoom);
  const state = currentRoomState();
  res.json({ status: "ok", ...state });
});

// ── Health ───────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ── Start ────────────────────────────────────────────────

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`MUD API server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
