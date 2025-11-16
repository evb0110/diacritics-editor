import { openDB } from 'idb'

class IDBInstance {
    private upgradeQueuePromise: Promise<void> = Promise.resolve()

    constructor(public readonly dbName: string) {}

    private async getVersion() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName)
            request.onsuccess = () => {
                const db = request.result
                const version = db.version
                db.close()
                resolve(version)
            }
            request.onerror = () => reject(request.error)
        }).catch(() => 1) as Promise<number>
    }

    private async _openDBRaw(storeName: string) {
        let db: Awaited<ReturnType<typeof openDB>> = await openDB(this.dbName)
        if (db.objectStoreNames.contains(storeName)) {
            db.close()
            db = await openDB(this.dbName)
            return db
        }

        db.close()

        const currentVersion = await this.getVersion()
        const newVersion = currentVersion + 1

        return await openDB(this.dbName, newVersion, {
            upgrade(upgradeDb) {
                if (!upgradeDb.objectStoreNames.contains(storeName)) {
                    upgradeDb.createObjectStore(storeName)
                }
            },
        })
    }

    private async _openDB(storeName: string) {
        this.upgradeQueuePromise = this.upgradeQueuePromise.then(async () => {
            await this._openDBRaw(storeName)
        })
        await this.upgradeQueuePromise

        return await openDB(this.dbName)
    }

    public async set(storeName: string, key: string, value: unknown) {
        const db = await this._openDB(storeName)
        const tx = db.transaction(storeName, 'readwrite')
        await tx.store.put(value, key)
        await tx.done
    }

    public async get(storeName: string, key: string): Promise<unknown> {
        const db = await this._openDB(storeName)
        const tx = db.transaction(storeName, 'readonly')
        const result = await tx.store.get(key)
        await tx.done
        return result
    }
}

const IDBMap = new Map<string, IDBInstance>()

function getDB(dbName: string): IDBInstance {
    if (!IDBMap.has(dbName)) {
        IDBMap.set(dbName, new IDBInstance(dbName))
    }
    return IDBMap.get(dbName)!
}

export class IDB {
    public static async get(dbName: string, storeName: string, key: string): Promise<unknown> {
        try {
            return await getDB(dbName).get(storeName, key)
        }
        catch (error) {
            console.error(`[IDB] Error getting from ${dbName}/${storeName}/${key}:`, error)
            throw error
        }
    }

    public static async set(dbName: string, storeName: string, key: string, value: unknown) {
        try {
            await getDB(dbName).set(storeName, key, value)
        }
        catch (error) {
            console.error(`[IDB] Error setting to ${dbName}/${storeName}/${key}:`, error)
            throw error
        }
    }
}
