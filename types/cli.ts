export type CommandArgs = {
    resource: string | undefined;
    action: string | undefined;
    query?: string;
    page: number;
    page_size: number;
    display_json?: boolean;
    genres?: string[];
    tags?: string[];
    developers?: string[];
    release_date?: string;
};