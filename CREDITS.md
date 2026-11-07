# Credits

Every asset in this game, where it came from, and its terms.
The code is under MIT No Attribution ([LICENSE](LICENSE)) and every asset we made is dedicated to the public domain under CC0 1.0 ([LICENSE-ASSETS](LICENSE-ASSETS)): anyone may use, change and sell them, with no credit required.
The fal calls, with their exact prompts and arguments, are in [fal-log.json](https://github.com/imDev2023/x-gaming/blob/main/calibration/2026-11-06-video2game/fal-log.json) in x-gaming.

## Models

| File | Source | Terms |
| --- | --- | --- |
| `assets/models/crane_01.glb`, `crane_jib_01.glb`, `crane_hook_01.glb`, `boat_01.glb`, `quay_01.glb` | Agent-built in Blender 4.3 through MCP for Blender by [blender/build.py](https://github.com/imDev2023/x-gaming/blob/main/calibration/2026-11-06-video2game/blender/build.py) in x-gaming, exported to `source/models/` and compressed with meshopt by [build.sh](build.sh) | CC0 1.0 |
| `assets/models/kit/*.glb` | The Crate_01 kit from [calibration 3](https://github.com/imDev2023/x-gaming/blob/main/calibration/2026-11-06-kit/README.md) in x-gaming, copied to `source/models/kit/` and compressed with meshopt by [build.sh](build.sh) | CC0 1.0 |

## Images

| File | Source | Terms |
| --- | --- | --- |
| `assets/img/sky.webp` | Generated on fal with `fal-ai/nano-banana-pro/edit` from two frames of the concept video, scaled to 2048 px and converted to WebP | CC0 1.0 for whatever rights we hold; the generating services' own output terms may also apply, and their commercial terms are not yet checked |
| `assets/img/houses.webp` | Generated on fal with `fal-ai/nano-banana-pro/edit` from one frame of the concept video, cut out with `fal-ai/birefnet/v2`, scaled to 1536 px | As above |

## Sound

| File | Source | Terms |
| --- | --- | --- |
| `assets/audio/harbour.mp3`, `crane_motor.mp3`, `release.mp3`, `land_crate.mp3`, `land_deck.mp3`, `tip.mp3`, `splash.mp3`, `horn.mp3` | Generated on fal with `fal-ai/elevenlabs/sound-effects/v2`, downmixed to mono and gain-matched with ffmpeg | CC0 1.0 for whatever rights we hold; the generating services' own output terms may also apply, and their commercial terms are not yet checked |
| `assets/audio/music.mp3` | Generated on fal with `elevenlabs/music/v2.5`, instrumental, with 0.6 s and 1.5 s fades so it loops | As above |

## Page icon and link card

- `icon.svg` was drawn by hand for this game; CC0 1.0.
- `og.jpg`, the picture X shows with a shared link, is a frame of the game itself with the title laid over it; CC0 1.0.

## Code

- [Three.js](https://threejs.org/) r170, MIT, with its GLTFLoader, MeshoptDecoder and post-processing passes: loaded from jsDelivr when the page runs from this folder, and served from the site itself (with its licence) in the build `deploy.sh` publishes.
- `index.html`, `sim.js` and `sim.test.mjs` are ours under MIT No Attribution, started from the [Video2Game](https://github.com/lovisdotio/video-to-game) skill's `templates/game.html`, whose MIT notice is kept in [NOTICE](NOTICE).
- Fonts are the system's own; nothing is downloaded.

## Not shipped

- The concept video ([take1.mp4](https://github.com/imDev2023/x-gaming/blob/main/calibration/2026-11-06-video2game/video/take1.mp4) in x-gaming) was generated with `minimax/h3-max/text-to-video` on fal as the look reference only.
- The Video2Game skill's scripts (MIT) studied the video, recorded the playtests and made the side-by-side pairs.
