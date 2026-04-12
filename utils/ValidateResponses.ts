import type {CommandArgs} from "../types/cli.ts";
import type {gameResponse, tag, platform, genre, developer} from "../types/responses.ts"
import {
    validateNumber,
    validateOptionalNumber,
    validateOptionalString,
    validateParamDate,
    validateString
} from "./ValidateValues.ts";

export function validateResponses(data: any, args: CommandArgs): gameResponse
| gameResponse[]
| tag[]
| genre[]
| platform[]
| developer[]
| genre
| developer
| platform
| tag {
    switch (args.resource) {
        case "games":
            if (Array.isArray(data.results)) {
                return data.results.map((game: any, index: number): gameResponse => {
                    try {
                        return validateGameResponse(game);
                    } catch (err: any) {
                        throw new Error(`Game at index ${index} invalid: ${err.message}`);
                    }
                });
            }

            return validateGameResponse(data);
        case "tags":
            if (Array.isArray(data.results)) {
                return data.results.map((tags: any, index: number): tag => {
                    try {
                        return validateTagsResponse(tags)
                    } catch (err: any) {
                        throw new Error(`Tags at index ${index} invalid: ${err.message}`);
                    }
                })
            }
            throw new Error("Not supported: looking for one tag")
        case "genres":
            if (Array.isArray(data.results)) {
                return data.results.map((genre: any, index: number): genre => {
                    try {
                        return validateGenreResponse(genre);
                    } catch (err: any) {
                        throw new Error(`Genre at index ${index} invalid: ${err.message}`);
                    }
                })
            }
            return validateGenreResponse(data);
        case "platforms":
            if (Array.isArray(data.results)) {
                return data.results.map((platform: any, index: number): platform => {
                    try {
                        return validatePlatformResponse(platform);
                    } catch (err: any) {
                        throw new Error(`Platform at index ${index} invalid: ${err.message}`);
                    }
                })
            }
            return validatePlatformResponse(data);
        case "developers":
            if (Array.isArray(data.results)) {
                return data.results.map((developer: any, index: number) => {
                    try {
                        return validateDeveloperResponse(developer);
                    } catch (err: any) {
                        throw new Error(`Developer at index ${index} invalid: ${err.message}`);
                    }
                })
            }
            return validateDeveloperResponse(data)
        default:
            throw new Error(`Unsupported resource: ${args.resource}`);
    }
}

function validateGameResponse(data: any): gameResponse {
    return {
        id: validateNumber(data.id, "id"),
        name: validateString(data.name, "name"),
        slug: validateString(data.slug, "slug"),
        released: validateParamDate(data.released),
        rating: validateNumber(data.rating, "rating"),
        metacritic: validateNumber(data.metacritic, "metacritic"),
        // needed to format the platforms from the api to a easier to use format.
        platforms: validateArray(
            data.platforms,
            (p) => ({
                id: validateNumber(p.platform.id, "platform.id"),
                name: validateString(p.platform.name, "platform.name"),
                slug: validateString(p.platform.slug, "platform.slug"),
            }),
            "platforms"
        ),

        genres: validateArray(
            data.genres,
            (g) => ({
                id: validateNumber(g.id, "genre.id"),
                name: validateString(g.name, "genre.name"),
                slug: validateString(g.slug, "genre.slug"),
            }),
            "genres"
        ),

        tags: validateArray(
            data.tags,
            (t) => ({
                id: validateNumber(t.id, "tag.id"),
                name: validateString(t.name, "tag.name"),
                slug: validateString(t.slug, "tag.slug"),
                language: validateOptionalString(t.language, "language"),
                games_count: validateNumber(t.games_count, "games_count"),
            }),
            "tags"
        ),
        description: validateOptionalString(data.description, "description")
    };
}


function validateDeveloperResponse(data: any): developer {
    return {
        id: validateNumber(data.id, "id"),
        name: validateString(data.name, "name"),
        slug: validateString(data.slug, "slug"),
        games_count: validateNumber(data.games_count, "games_count"),
    }
}

function validateTagsResponse(data: any): tag {
    return {
        id: validateNumber(data.id, "id"),
        name: validateString(data.name, "name"),
        slug: validateString(data.slug, "slug"),
        language: validateOptionalString(data.language, "language"),
        description: validateOptionalString(data.description, "description"),
        games_count: validateNumber(data.games_count, "games_count"),
    };
}

function validatePlatformResponse(data: any): platform {
    return {
        id: validateNumber(data.id, "id"),
        name: validateString(data.name, "name"),
        slug: validateString(data.slug, "slug"),
    };
}

function validateGenreResponse(data: any): genre {
    return {
        id: validateNumber(data.id, "id"),
        name: validateString(data.name, "name"),
        slug: validateString(data.slug, "slug"),
        description: validateOptionalString(data.description, "description"),
        games_count: validateOptionalNumber(data.games_count, "games_count"),
    }
}

function validateArray<T>(arr: any, mapper: (item: any, index: number) => T, fieldName: string): T[] {
    if (!Array.isArray(arr)) {
        throw new Error(`Expected ${fieldName} to be an array`);
    }

    return arr.map((item, index) => {
        try {
            return mapper(item, index);
        } catch (err: any) {
            throw new Error(`${fieldName}[${index}] invalid: ${err.message}`);
        }
    });
}