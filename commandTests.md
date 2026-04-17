API CLI Test Commands

Here are some commands to run in order to test the cli.

```
api-cli games search "elden ring"
api-cli games search "witcher" --genres=action --tags=fantasy --developers=cd-projekt-red --page_size=1
api-cli games search "halo" --release_dates=2020-01-01,2024-01-01
api-cli games list --page=2 --page_size=10
api-cli games search "doom" --display_json
api-cli tags search "multiplayer"
api-cli tags list
api-cli genres search "action"
api-cli genres list
api-cli platforms search "playstation4"
api-cli platforms list
api-cli developers search "nintendo"
api-cli developers list
api-cli game-details get "cyberpunk-2077"
api-cli games search "war" --tags=multiplayer,fun --genres=action,rpg
api-cli games search "star" --tags=multiplayer,space --developers=ubisoft --release_dates=2015-01-01,2023-01-01 --page=1 --page_size=3
api-cli games search "star" --tags=multiplayer,space --release_dates=2015-01-01,2023-01-01 --page=1 --page_size=3
api-cli games random