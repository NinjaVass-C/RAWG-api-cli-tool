import type { apiValidationResponse, developer, gameResponse, genre, platform, tag } from "../types/responses.ts";
import type { CommandArgs } from "../types/cli.ts";
import { stripHtml } from "./GeneralHelpers.ts";

export function printResponse(data: apiValidationResponse, args: CommandArgs) {
    console.log("\n================ RESPONSE START ================\n");

    console.log(`Display JSON flag: ${args.display_json}\n`);

    if (args.display_json) {
        console.log("--------------- RAW JSON OUTPUT ---------------");
        console.log(JSON.stringify(data, null, 2));
        console.log("------------------------------------------------\n");
    } else {
        console.log(`Page: ${args.page} | Page Size: ${args.page_size}`);
        console.log("-------------------------------------------------------\n");

        switch (args.resource) {
            case "platforms":
                (Array.isArray(data) ? data : [data])
                    .forEach(item => printPlatform(item as platform));
                break;
            case "tags":
                (Array.isArray(data) ? data : [data])
                    .forEach(item => printTag(item as tag));
                break;
            case "genres":
                (Array.isArray(data) ? data : [data])
                    .forEach(item => printGenre(item as genre));
                break;
            case "developers":
                (Array.isArray(data) ? data : [data])
                    .forEach(item => printDeveloper(item as developer));
                break;
            case "games":
            case "game-details":
                (Array.isArray(data) ? data : [data])
                    .forEach(item => printGameResponse(item as gameResponse));
                break;
        }
        console.log("\n-------------------------------------------------------");
    }
    console.log("\n================ RESPONSE END ================\n");
}

function printPlatform(data: platform) {
    console.log("-------------------------");
    console.log(`Platform Name: ${data.name}`);
    console.log(`Platform ID: ${data.id}`);
    console.log(`Platform Slug: ${data.slug}`);
    if (data.description) {
        console.log(`Description: ${stripHtml(data.description)}`);
    }
    if (data.year_start) {
        console.log(`Year Start: ${data.year_start}`);
    }
    if (data.year_end) {
        console.log(`Year End: ${data.year_end}`);
    }
    console.log("-------------------------\n");
}

function printTag(data: tag) {
    // todo make this a setting? (filtered due to high density of russian tags)
    if (data.language !== "eng" && data.language !== undefined) return
    console.log("-------------------------");

    console.log(`Tag Name: ${data.name}`);
    console.log(`Tag ID: ${data.id}`);
    console.log(`Tag Slug: ${data.slug}`);
    console.log(`Games Count: ${data.games_count}`);
    if (data.language) {
        console.log(`Language: ${data.language}`);
    }
    if (data.description) {
        console.log(`Description: ${stripHtml(data.description)}`);
    }
    console.log("-------------------------\n");
}

function printGenre(data: genre) {
    console.log("-------------------------");
    console.log(`Genre Name: ${data.name}`);
    console.log(`Genre ID: ${data.id}`);
    console.log(`Genre Slug: ${data.slug}`);
    if (data.description) {
        console.log(`Description: ${stripHtml(data.description)}`);
    }
    if (data.games_count) {
        console.log(`Games Count: ${data.games_count}`);
    }
    console.log("  -------------------------\n");
}

function printDeveloper(data: developer) {
    console.log("-------------------------");
    console.log(`Developer Name: ${data.name}`);
    console.log(`Developer ID: ${data.id}`);
    console.log(`Developer Slug: ${data.slug}`);
    console.log(`Games Count: ${data.games_count}`);
    if (data.description) {
        console.log(`Description: ${stripHtml(data.description)}`);
    }
    console.log("  -------------------------\n");
}

function printGameResponse(data: gameResponse) {
    console.log("================ GAME =================");
    console.log(`Game Name: ${data.name}`);
    console.log(`Game ID: ${data.id}`);
    console.log(`Game Slug: ${data.slug}`);
    console.log(`Game Release Date: ${data.released}`);
    if (data.rating !== 0.0) {
        console.log(`Rating: ${data.rating}/5`);
    } else {
        console.log("Rating: No rating found");
    }

    if (data.metacritic) {
        console.log(`Metacritic: ${data.metacritic}`);
    }
    if (data.description) {
        console.log(`Description: ${stripHtml(data.description)}`);
    }
    console.log("\nPlatforms:");
    data.platforms.forEach((platform: platform) => printPlatform(platform));
    console.log("\nTags:");
    data.tags.forEach((tag: tag) => printTag(tag));
    console.log("\nGenres:");
    data.genres.forEach((genre: genre) => printGenre(genre));
    console.log("\nDevelopers:");
    if (data.developers?.length !== 0) {
        data.developers.forEach((developer: developer) => printDeveloper(developer));
    } else {
        console.log(" Search game separately to find developers.")
    }
    console.log("\n=======================================\n");
}