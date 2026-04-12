API CLI Test Commands (RAWG)

This document contains example commands to test the CLI against the RAWG Video Games Database API.

```
api-cli games search "elden ring"
api-cli games search "witcher" --genres=action --tags=fantasy --developers=cd-projekt-red --page_size=1
api-cli games search "halo" --release_date=2020-01-01,2024-01-01
api-cli games list --page=2 --page_size=10
api-cli games search "doom" --display_json
api-cli tags search "multiplayer"
api-cli tags list
api-cli genres search "action"
api-cli genres list
api-cli platforms search "playstation"
api-cli platforms list
api-cli developers search "nintendo"
api-cli developers list
api-cli game-details search "cyberpunk-2077"
api-cli games search "war" --tags=multiplayer,shooter --genres=action,rpg
api-cli games search "star"--tags=multiplayer,space --developers=ubisoft --release_date=2015-01-01,2023-01-01 --page=1 --page_size=3