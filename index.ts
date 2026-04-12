#! /usr/bin/env bun
import { parseArgs } from 'util';
import {
    validateNumber,
    validateParamDate,
    validateSearchFlagMulti, validateString
} from "./utils/ValidateValues.ts";
import type {CommandArgs} from "./types/cli.ts";
import {buildApiUrl} from "./utils/BuildApiUrl.ts";
import {validateResponses} from "./utils/ValidateResponses.ts";



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
            developers: { type: "string" },
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
    // todo make these take slugs for individual searches.
    switch (resource) {
        case 'games':
            switch (action) {
                case 'search':
                    if (values.genre) {
                        parsed.genres = validateSearchFlagMulti(<string>values.genre)
                    }
                    if (values.tags) {
                        parsed.tags = validateSearchFlagMulti(<string>values.tags)
                    }
                    if (values.developers) {
                        parsed.developers = validateSearchFlagMulti(<string>values.developers)
                    }
                    if (values.release_date) {
                        parsed.release_date = validateParamDate(<string>values.release_date)
                    }
                    if (positionals.join("").length !== 0) {
                        parsed.query = validateString(positionals.join(""), "search");
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
                        parsed.query = validateString(positionals.join(""), "search");
                        break;
                    default:
                        throw new Error(`Unknown or unsupported action: ${action}`);
                }
            break;
        case 'genres':
        case 'platforms':
        case 'developers':
        case 'tags':
                switch (action) {
                    case 'search':
                        parsed.query = validateString(positionals.join(""), "search");
                        break;
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
        parsed.page = validateNumber(<string>values.page, "page");
    } else {
        parsed.page = 1
    }

    if (values.page_size) {
        parsed.page_size = validateNumber(<string>values.page_size, "page_size");
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
    const response = await fetch(url)
    const data: any = await response.json()
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}, error message: ${data.message}`);
    }
    const formattedData = validateResponses(data, args)
    console.log(formattedData)

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