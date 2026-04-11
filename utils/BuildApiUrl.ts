import type {CommandArgs} from "../types/cli.ts";
import {validateString} from "./ValidateValues.ts";

export function buildApiUrl(args: CommandArgs) {
    const baseUrl = process.env.BASE_URL ?? "";
    const KEY = process.env.API_KEY ?? "";
    if (validateString(baseUrl) === null) {
        throw new Error("Base URL is undefined")
    }
    if (validateString(KEY) === null) {
        throw new Error("API KEY is invalid")
    }
    const url = new URL(baseUrl + '/' + args.resource);
    url.searchParams.append("key", KEY);
    if (args.release_date) {
        url.searchParams.append("dates", args.release_date);
    }
    if (args.developers) {
        const developerString = args.developers.join(",")
        url.searchParams.append("developers", developerString);
    }
    if (args.genres) {
        const genreString = args.genres.join(",");
        console.log(genreString);
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

    return url;
}