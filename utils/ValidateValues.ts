import type {CommandArgs} from "../types/cli.ts";

export function validateNumber(input: string): number | null {
    if (!input) return null;
    const num = Number(input);
    return !isNaN(num) && isFinite(num) && num > 0 ? num : null;
}

export function validateString(input: string): string | null {
    if (!input) return null;
    if (input.trim() === "") return null;
    return input
}

export function validateSearchFlagMulti(input: string): string[] | null {
    if (!input) return null;

    return input.split(",").map(i => i.trim()).filter(Boolean);
}

export function validateParamDate(input: string): string | null {
    if (!input) return null;
    // Regex to make sure date is valid for api call
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(input)) return null;

    const date = new Date(input);

    // Ensure it's a valid calendar date
    if (Number.isNaN(date.getTime())) return null;

    const [y, m, d] = input.split("-").map(Number);
    if (
        date.getUTCFullYear() !== y ||
        date.getUTCMonth() + 1 !== m ||
        date.getUTCDate() !== d
    ) {
        return null;
    }

    return input;
}