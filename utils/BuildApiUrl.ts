import type {CommandArgs} from "../types/cli.ts";
import {validateString} from "./ValidateValues.ts";

export function buildApiUrl(args: CommandArgs) {
    const baseUrl = validateString(process.env.BASE_URL, "url");
    const KEY = validateString(process.env.API_KEY, "key");
    const url = new URL(baseUrl + '/' + args.resource + (args.id ? "/" + args.id : ""));
    url.searchParams.append("key", KEY);
    // Due to an issue with rawg encoding, passing comma separated filters through
    // params causes api filtering to be inconsistent, so it must be appended to the actual url.
    let commaParams = []
    if (args.release_dates) {
        const datesString = args.release_dates.join(",");
        commaParams.push(`dates=${datesString}`);
    }
    if (args.developers) {
        const developerString = args.developers.join(",")
        commaParams.push(`developers=${developerString}`);
    }
    if (args.genres) {
        const genreString = args.genres.join(",");
        commaParams.push(`genres=${genreString}`);
    }
    if (args.tags) {
        const tagString = args.tags.join(",")
        commaParams.push(`tags=${tagString}`);
    }
    if (args.query) {
        url.searchParams.append("search", args.query);
    }
    // the api db randomly has invalid ids, so find random using pagination
    if (args.action === "random") {
        // 750000 is kind of arbitrary, but was a number that was getting returned by the db,
        // and gives the user a decent number of 'random' games to find.
        const id = String(Math.round(Math.random() * 750000) + 1)
        url.searchParams.append("page", String(id))
        url.searchParams.append("page_size", String(1))
    } else {
        url.searchParams.append("page", String(args.page));
        url.searchParams.append("page_size", String(args.page_size));
    }
    let finalUrl = url.toString();
    if (commaParams.length > 0) {
        finalUrl += `&${commaParams.join("&")}`;
    }
    console.log(finalUrl);
    return finalUrl;
}