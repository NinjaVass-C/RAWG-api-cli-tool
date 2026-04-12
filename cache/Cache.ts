const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export async function checkCache (url: URL) {
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(url.href)
    const key = hasher.digest("hex");
    const path = `cache/caches/${key}.json`;
    const cacheFile = Bun.file(path);
    const fileExists = await cacheFile.exists();
    if (fileExists) {
        console.log("Reading cache")
        return await readCache(key);
    } else {
        return undefined;
    }
}

export async function createCache (url: URL, data: any) {
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(url.href)
    const key = hasher.digest("hex");

    const path = `cache/caches/${key}.json`;
    const jsonData = {
        key: key,
        date: new Date(),
        data: data
    }
    await Bun.write(path, JSON.stringify(jsonData));
}

async function readCache(key: string) {
    const path = `cache/caches/${key}.json`;
    const file = Bun.file(path);
    if (!file) {
        throw new Error(`Caching Error: ${key} not found`);
    }
    const cacheInput = await file.text();
    const parsedJson = JSON.parse(cacheInput);
    if (Date.now() > parsedJson.timestamp + SEVEN_DAYS_MS) {
        console.log("Cache expired, deleting cached data");
        await file.delete()
        return [];
    } else {
        console.log("Getting cached data");
        return parsedJson.data
    }
}