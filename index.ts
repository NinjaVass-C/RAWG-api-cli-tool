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
import {printResponse} from "./utils/PrintResponse.ts";
import {checkCache, createCache} from "./cache/Cache.ts";
import {helpMessage} from "./utils/HelpMessage.ts";


function parseCommands(): CommandArgs {
    // buns first two cli arguments are the runtime and file path, so remove them
    const args = Bun.argv.slice(2);
    if (args.length === 1 && args[0] === "help") {
        console.log(helpMessage)
        process.exit(0);
    }
    if (args.length < 2) {
        throw new Error('You must include at least an action and a resource')
    }

    const [resource, action, ...rest] = args;

    // Parse flags using parseArgs
    const { values, positionals } = parseArgs({
        args: rest,
        options: {
            page: { type: "string" },
            page_size: { type: "string" },
            display_json: { type: "boolean" },
            genres: { type: "string" },
            tags: { type: "string" },
            developers: { type: "string" },
            release_dates: { type: "string" },
            id: {type: "string"}
        },
        allowPositionals: true,
        strict: false,
    });

    const parsed: CommandArgs = {
        resource,
        action,
        page: 1,
        page_size: 3,
        display_json: false,
    };
    switch (resource) {
        case 'games':
            switch (action) {
                case 'search':
                    if (values.genres) {
                        parsed.genres = validateSearchFlagMulti(<string>values.genres)
                    }

                    if (values.tags) {
                        if (typeof values.tags !== "string") {
                            throw new Error("Invalid value for tags")
                        }
                        parsed.tags = validateSearchFlagMulti(values.tags)
                    }
                    if (values.developers) {
                        if (typeof values.developers !== "string") {
                            throw new Error("Invalid value for developers")
                        }
                        parsed.developers = validateSearchFlagMulti(values.developers)
                    }
                    if (values.release_dates) {
                        if (typeof values.release_dates !== "string") {
                            throw new Error("Invalid value for release dates")
                        }
                        const dates = validateSearchFlagMulti(values.release_dates);
                        if (!dates || dates.length !== 2) {
                            throw new Error("Api only supports one start-end date pairing at a time")
                        }
                        dates.forEach(date => {validateParamDate(date)})
                        parsed.release_dates = dates
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
        case 'game-details':
                switch (action) {
                    case 'search':
                        parsed.id = validateString(positionals.join(""), "search");
                        parsed.resource = "games"
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
                        parsed.id = validateString(positionals.join(""), "search");
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
    if (values.display_json != null) {
        parsed.display_json = <boolean>values.display_json;
    }
    return parsed;
}

async function fetchData(args: CommandArgs) {
    const url = new URL(buildApiUrl(args))
    const cachedData = await checkCache(url)
    if (cachedData) {
        // this would have been validated before getting cached, so it can be returned like this
        return cachedData;
    }
    const response = await fetch(url)
    const data: any = await response.json()
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}, ${data.detail ? `API Response Message: ${data.detail}` : "Your request to the api was unable to be processed, please ensure you have entered correct values to your command."}`);
    }
    const validData = validateResponses(data, args);
    await createCache(url, validData)
    return validData;
}


async function main() {
    try {
        const args = parseCommands();
        const data = await fetchData(args);
        printResponse(data, args)
    } catch (error: any) {
        console.log("An error has occurred: " + error.message);
    }
}

main();