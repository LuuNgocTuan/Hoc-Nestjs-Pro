export function isMongoDuplicateError(error: any): boolean {
    return error?.code === 11000;
}