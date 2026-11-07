# Dockstack

A daily stacking game in Three.js, live at https://dockstack.vercel.app/ and shared by the owner on X.
It began as calibration 4 in `../x-gaming` (github.com/imDev2023/x-gaming); this repo is now the game's home, and the copy in x-gaming's `calibration/2026-11-06-video2game/game/` is the frozen calibration record.

## Rules

- `sim.js` is the score a server will replay: keep it integer-only and run `node --test .` after any change.
  Load the page with `?debug`, which logs an error if drawing writes into the simulation's state.
- Publish only with `./deploy.sh --prod`, after the tests pass and a local run of `dist/` plays through; `dist/` keeps its Vercel link in `dist/.vercel`.
- Use Vercel for hosting; the owner asked not to use Cloudflare for this game.
- The owner chose no sign-in and no blockchain for now (2026-11-06): anyone can play, and the best score stays in their browser.
- The repo is public: no keys, no paid fal outputs beyond the shipped assets, and no copied text or screenshots of other people's work.
- Generation calls (fal and the like) are paid and need the owner's approval each time.

## Issues

Issues are tracked on github.com/imDev2023/x-gaming, where Dockstack started; the next one is #5, a daily top 10 with no sign-in.

## Multica dashboard

This project is mirrored on the owner's Multica dashboard (workspace Pandora) under the x-gaming project `5e65d424-8653-4e40-8aca-449c8e90891c`.
GitHub Issues on `imDev2023/x-gaming` stay the source of truth; Multica only mirrors them, and each Multica ticket title starts with its issue number.
At the end of every session, after the issues are updated, run the `multica-sync` skill for that project: mirror ticket statuses, add any new tickets, and refresh the project's "Current step" section.
Every Multica write passes `--no-start` and no ticket is ever assigned to an agent, so the sync never starts an agent run.
If the `multica` CLI is not signed in, say so in the session summary and stop anyway; the sync never blocks the work.
