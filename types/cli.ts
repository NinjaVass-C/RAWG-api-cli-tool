export type CommandArgs = {
    resource: string | undefined;
    action: string | undefined;
    query?: string;
    page?: number;
    page_size?: number;
    display_json?: boolean;
    genre?: string[];
    tags?: string[];
    developer?: string[];
    release_date?: string;
};