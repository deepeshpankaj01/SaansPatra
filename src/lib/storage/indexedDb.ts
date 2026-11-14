import { openDB, IDBPDatabase } from 'idb';
import { BriefSnapshot } from '../compare/types';

const DB_NAME = 'saanspatra-db';
const DB_VERSION = 1;
const STORE_NAME = 'snapshots';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> | null {
  if (typeof window === 'undefined') return null;

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt');
        }
      },
    });
  }

  return dbPromise;
}

export async function saveSnapshot(snapshot: BriefSnapshot): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.put(STORE_NAME, snapshot);
}

export async function getAllSnapshots(): Promise<BriefSnapshot[]> {
  const db = await getDb();
  if (!db) return [];
  const list = await db.getAllFromIndex(STORE_NAME, 'createdAt');
  return list.reverse(); // newest first
}

export async function getLatestSnapshot(): Promise<BriefSnapshot | null> {
  const snapshots = await getAllSnapshots();
  return snapshots.length > 0 ? snapshots[0] : null;
}

export async function deleteSnapshot(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(STORE_NAME, id);
}

export async function clearAllSnapshots(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.clear(STORE_NAME);
}
