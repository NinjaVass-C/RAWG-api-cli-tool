export type baseResponse = {
    id: number,
    name: string,
    slug: string
}

export type platform = baseResponse & {
    description?: string,
    year_start?: number,
    year_end?: number,
}

export type tag = baseResponse & {
    language?: string,
    games_count: number
    description?: string,
}

export type genre = baseResponse & {
    description?: string,
    games_count?: number
}

export type gameResponse = baseResponse & {
    platforms: platform[],
    released?: string,
    tags: tag[],
    genres: genre[],
    rating: number
    metacritic?: number
    description?: string
    developers: developer[],
}


export type developer = baseResponse & {
    games_count: number
    description?: string
}

export type apiValidationResponse = gameResponse | gameResponse[] | tag[] | genre[] | platform[] | developer[] | genre | developer | platform | tag