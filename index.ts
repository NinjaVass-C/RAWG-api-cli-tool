#! /usr/bin/env bun
import { parseArgs } from 'util';
import {
    validateNumber,
    validateParamDate,
    validateSearchFlagMulti, validateString
} from "./utils/ValidateValues.ts";
import type {CommandArgs} from "./types/cli.ts";
import {buildApiUrl} from "./utils/BuildApiUrl.ts";



function parseCommands(): CommandArgs {
    // buns first two cli arguments are the runtime and file path, so remove them
    const args = Bun.argv.slice(2);

    if (args.length < 2) {
        throw new Error('You must include at least an action and a resource')
    }

    const [resource, action, ...rest] = args;

    // Parse flags using parseArgs (keep what you already know)
    const { values, positionals } = parseArgs({
        args: rest,
        options: {
            page: { type: "string" },
            page_size: { type: "string" },
            display_json: { type: "boolean" },
            genre: { type: "string" },
            tags: { type: "string" },
            developer: { type: "string" },
            release_date: { type: "string" },
        },
        allowPositionals: true,
        strict: false,
    });

    const parsed: CommandArgs = {
        resource,
        action,
        page: 1,
        page_size: 5
    };

    switch (resource) {
        case 'games':
            switch (action) {
                case 'search':
                    if (values.genre) {
                        const formatted = validateSearchFlagMulti(<string>values.genre)
                        if (formatted === null) {
                            throw new Error(`Invalid genre flag: ${values.genre}`)
                        } else {
                            parsed.genres = formatted
                        }
                    }
                    if (values.tags) {
                        const formatted = validateSearchFlagMulti(<string>values.tags)
                        if (formatted === null) {
                            throw new Error(`Invalid tags flag: ${values.tags}`)
                        } else {
                            parsed.tags = formatted
                        }
                    }
                    if (values.developer) {
                        const formatted = validateSearchFlagMulti(<string>values.developer)
                        if (formatted === null) {
                            throw new Error(`Invalid developer flag: ${values.developer}`)
                        } else {
                            parsed.developers = formatted
                        }
                    }
                    if (values.release_date) {
                        const formatted = validateParamDate(<string>values.release_date)
                        if (formatted === null) {
                            throw new Error(`Invalid release date flag: ${values.release_date}`)
                        } else {
                            parsed.release_date = formatted
                        }
                    }
                    if (positionals.join("").length !== 0) {
                        const formatted = validateString(positionals.join(""));
                        if (formatted === null) {
                            throw new Error(`Invalid search: ${positionals.join("")}`);
                        } else {
                            parsed.query = formatted;
                        }
                    }

                    break;
                case 'list':
                    break;
                default:
                    throw new Error(`Unknown or unsupported action: ${action}`);
            }
            break;
        case 'gamedetails':
                switch (action) {
                    case 'search':
                        const validId = validateNumber(positionals.join(""));
                        if (validId === null) {
                            throw new Error(`Invalid Id: ${positionals.join("")}`);
                        }
                        parsed.query = validId.toString();
                        break;
                    default:
                        throw new Error(`Unknown or unsupported action: ${action}`);
                }
            break;
        // the api only supports listing for these endpoints,
        // so they can be combined to one case.
        case 'genres':
        case 'platforms':
        case 'developers':
        case 'tags':
                switch (action) {
                    case 'list':
                        break;
                    default:
                        throw new Error(`Unknown or unsupported action: ${action}`);
                }
            break;
        default:
            throw new Error(`Unknown or unsupported resource: ${resource}`);
    }


    if (values.page) {
        const validPage = validateNumber(<string>values.page);
        if (validPage === null) {
            throw new Error(`Invalid page: ${values.page}`);
        }
        parsed.page = validPage
    } else {
        parsed.page = 1
    }

    if (values.page_size) {
        const validPageSize = validateNumber(<string>values.page_size);
        if (validPageSize === null) {
            throw new Error(`Invalid page_size: ${values.page_size}`);
        }
        parsed.page_size = validPageSize;
    }

    if (values.format != null) {
        if (typeof values.format === "boolean") {
            parsed.display_json = values.format;
        }
    }
    return parsed;
}

async function fetchData(args: CommandArgs) {
    const url = buildApiUrl(args)
    console.log(url)
    const response = await fetch(url)
    const data: any = await response.json()
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}, error message: ${data.message}`);
    }
    console.log(data)
}




async function main() {
    try {
        const args = await parseCommands();
        console.log(args);
        await fetchData(args);
    } catch (error: any) {
        console.log("An error has occured: " + error.message);
    }
}

main();