import type {CommandArgs} from "../types/cli.ts";
import {validateString} from "./ValidateValues.ts";

export function buildApiUrl(args: CommandArgs) {
    const baseUrl = validateString(process.env.BASE_URL, "url");
    const KEY = validateString(process.env.API_KEY, "key");
    const url = new URL(baseUrl + '/' + args.resource + (args.id ? "/" + args.id : ""));
    url.searchParams.append("key", KEY);
    if (args.release_dates) {
        const datesString = args.release_dates.join(",");
        url.searchParams.append("dates", datesString);
    }
    if (args.developers) {
        const developerString = args.developers.join(",")
        url.searchParams.append("developers", developerString);
    }
    if (args.genres) {
        const genreString = args.genres.join(",");
        url.searchParams.append("genres", genreString)
    }
    if (args.tags) {
        const tagString = args.tags.join(",")
        url.searchParams.append("tags", tagString)
    }
    if (args.query) {
        url.searchParams.append("search", args.query);
    }
    url.searchParams.append("page", String(args.page));
    url.searchParams.append("page_size", String(args.page_size));
    console.log(url)
    return url;
}