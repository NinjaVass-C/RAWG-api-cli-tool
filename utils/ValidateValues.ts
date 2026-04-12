

export function validateNumber(input: any, fieldName: string): number {
    if (input === null || input === undefined || input === "") {
        throw new Error(`Invalid ${fieldName}: ${input}`);
    }

    const num = Number(input);

    if (isNaN(num) || !isFinite(num) || num < 0) {
        throw new Error(`Invalid ${fieldName}: ${input}`);
    }

    return num;
}
// optional validator for optional fields in response types
export function validateOptionalNumber(value: unknown, fieldName: string): number | undefined {
    if (value === undefined || value === null) return undefined;

    return validateNumber(value, fieldName);
}


export function validateString(input: unknown, fieldName: string): string {
    if (typeof input !== "string" || input.trim() === "") {
        if (fieldName === "key") {
            throw new Error(`Invalid ${fieldName}: HIDDEN FOR SECURITY`);
        } else {
            throw new Error(`Invalid ${fieldName}: ${input}`);
        }
    }

    return input;
}

export function validateOptionalString(value: unknown, fieldName: string): string | undefined {
    if (value === undefined || value === null || value === "") return undefined;

    return validateString(value, fieldName);
}

export function validateSearchFlagMulti(input: string | undefined | null): string[] | undefined {
    if (!input) return undefined;

    const result = input.split(",").map(i => i.trim()).filter(Boolean);

    if (result.length === 0) {
        throw new Error("No valid search flags provided");
    }

    return result;
}

export function validateParamDate(input: string): string {
    // For games that do not have a release date, the api returns null.
    if (input === null) {
        return "To be announced";
    }

    if (!input) {
        throw new Error(`Invalid date: ${input}`);
    }

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(input)) {
        throw new Error(`Invalid date format (expected yyyy-mm-dd): ${input}`);
    }

    const date = new Date(input);

    if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${input}`);
    }

    const [y, m, d] = input.split("-").map(Number);

    if (
        date.getUTCFullYear() !== y ||
        date.getUTCMonth() + 1 !== m ||
        date.getUTCDate() !== d
    ) {
        throw new Error(`Invalid calendar date: ${input}`);
    }

    return input;
}