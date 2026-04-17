export const helpMessage = `
RAWG API CLI Tool Help

USAGE:
  api-cli <resource> <action> [query] <flags> <options>

RESOURCES & ACTIONS:
help                          No actions, displays this screen to console.

games
search [query]                Search for games using filters and queries
list                          List games and associated resources
random                        Discover a random game 

game-details
get <id or slug>              Retrieve details for a specific game by ID or slug

genres | platforms | developers | tags
search <id or slug>           Search for resource by ID or slug
list                          Browse available resources

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
api-cli games search halo --genres=action --page=2

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
- Responses can be incredibly large, please keep that in mind while adjusting page size`;