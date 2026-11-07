# Credits

Every asset in this game, where it came from, and its terms.
The fal calls, with their exact prompts and arguments, are in [fal-log.json](https://github.com/imDev2023/x-gaming/blob/main/calibration/2026-11-06-video2game/fal-log.json) in x-gaming.

## Models

| File | Source | Terms |
| --- | --- | --- |
| `assets/models/crane_01.glb`, `crane_jib_01.glb`, `crane_hook_01.glb`, `boat_01.glb`, `quay_01.glb` | Agent-built in Blender 4.3 through MCP for Blender by [blender/build.py](https://github.com/imDev2023/x-gaming/blob/main/calibration/2026-11-06-video2game/blender/build.py) in x-gaming, exported to `source/models/` and compressed with meshopt by [build.sh](build.sh) | Ours |
| `assets/models/kit/*.glb` | The Crate_01 kit from [calibration 3](https://github.com/imDev2023/x-gaming/blob/main/calibration/2026-11-06-kit/README.md) in x-gaming, copied to `source/models/kit/` and compressed with meshopt by [build.sh](build.sh) | Ours |

## Images

| File | Source | Terms |
| --- | --- | --- |
| `assets/img/sky.webp` | Generated on fal with `fal-ai/nano-banana-pro/edit` from two frames of the concept video, scaled to 2048 px and converted to WebP | fal's and Google's output terms; commercial use not yet checked |
| `assets/img/houses.webp` | Generated on fal with `fal-ai/nano-banana-pro/edit` from one frame of the concept video, cut out with `fal-ai/birefnet/v2`, scaled to 1536 px | As above |

## Sound

| File | Source | Terms |
| --- | --- | --- |
| `assets/audio/harbour.mp3`, `crane_motor.mp3`, `release.mp3`, `land_crate.mp3`, `land_deck.mp3`, `tip.mp3`, `splash.mp3`, `horn.mp3` | Generated on fal with `fal-ai/elevenlabs/sound-effects/v2`, downmixed to mono and gain-matched with ffmpeg | fal's and ElevenLabs' output terms; commercial use not yet checked |
| `assets/audio/music.mp3` | Generated on fal with `elevenlabs/music/v2.5`, instrumental, with 0.6 s and 1.5 s fades so it loops | As above |

## Page icon and link card

- `icon.svg` was drawn by hand for this game.
- `og.jpg`, the picture X shows with a shared link, is a frame of the game itself with the title laid over it.

## Code

- [Three.js](https://threejs.org/) r170, MIT, with its GLTFLoader, MeshoptDecoder and post-processing passes: loaded from jsDelivr when the page runs from this folder, and served from the site itself (with its licence) in the build `deploy.sh` publishes.
- `index.html`, `sim.js` and `sim.test.mjs` are ours, started from the [Video2Game](https://github.com/lovisdotio/video-to-game) skill's `templates/game.html` (MIT).
- Fonts are the system's own; nothing is downloaded.

## Not shipped

- The concept video ([take1.mp4](https://github.com/imDev2023/x-gaming/blob/main/calibration/2026-11-06-video2game/video/take1.mp4) in x-gaming) was generated with `minimax/h3-max/text-to-video` on fal as the look reference only.
- The Video2Game skill's scripts (MIT) studied the video, recorded the playtests and made the side-by-side pairs.
