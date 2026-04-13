# RAWG API CLI Tool

To install dependencies:

```
bun install
```
#### Prior to running, ensure the following command has been run

```
bun link
```
#### This allows you to use the shorthand for the cli, `api-cli` instead of `bun run index.ts` every time.

## CLI Features

The cli comes with multiple quality of life features for interacting with the RAWG api. Here are some examples:
- Multiple options and flags for core api resources, allowing you to spend less time building the complex queries required for filtering
- Flag to toggle between JSON formatting and properly formatted responses
- Local file caching for duplicate queries, speeding up load times and preventing duplicate api calls. 
- Response validation for core resources, ensuring only valid fields are displayed, and descriptions are properly sanitized of html tags.
- CLI code is structured to allow easy expansion if the api was to be updated in the future, making changes easy to make.
- Proper handling for cli commands, minimizing chance of sending improper query to api. 


## CLI Usage
#### Using the cli to interact with the RAWG api is very simple, consisting of one command per request. Each command is broken into the following:
```
api-cli <resource> <action> [query] <flags> <options>
```
#### Here are the actual resources, actions, flags, and options available, which can also be seen by executing `api-cli help` in the cli.
```
RESOURCES & ACTIONS:
help                          No actions, displays this screen to console.

games
search [query]              Search for games
list                        List games

game-details
search <id or slug>         Get details for a specific game by ID or slug

genres | platforms | developers | tags
search <id or slug>         Search by ID ir slug
list                        List all available

GLOBAL OPTIONS:
--page <number>               Page number (default: 1)
--page_size <number>          Results per page (default: 5)
--display_json                Output raw JSON instead of formatted output to console

FILTER FLAGS (games search only):
--genres <g1,g2,...>          Filter by genres
--tags <t1,t2,...>            Filter by tags
--developers <d1,d2,...>      Filter by developers
--release_dates <start,end>   Filter by release date range (YYYY-MM-DD)

EXAMPLES:
Search for a game:
api-cli games search halo

Search with filters:
api-cli games search halo --genres=action,shooter --page=2

Get game details:
api-cli game-details search 3498

List genres:
api-cli genres list

Output raw JSON:
api-cli games search halo --display_json

NOTES:
- Multiple filter values must be comma-separated (no spaces)
- Release dates must include both start and end dates
- Invalid inputs will return descriptive errors
- Responses can be Incredibly Large, please keep that in mind while adjusting page size
```

### CLI Examples
#### For more examples as to how the cli works, please look at `commandTests.md`, which contains examples of every resource and action available for the cli.