export interface ICacheService {
    useCache(): boolean;
    save(path: string, key: string): Promise<void>;
    restore(path: string, primaryKey: string): Promise<void>;
}