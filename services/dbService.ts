
import { TestTopic } from '../types';

const DB_NAME = 'aiExamPrepDB';
const DB_VERSION = 1;
const STORE_NAME = 'testTopics';

let dbInstance: IDBDatabase | null = null;

const getDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject(new Error('Failed to open IndexedDB. Your browser may be in private mode or does not support it.'));
        };

        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
};


export const getTestTopics = async (): Promise<TestTopic[]> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result || []);
        };

        request.onerror = () => {
            console.error('Error fetching topics:', request.error);
            reject(request.error);
        };
    });
};

export const saveTestTopic = async (topic: TestTopic): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(topic);

        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error('Error saving topic:', request.error);
            reject(request.error);
        };
    });
};

export const deleteTestTopic = async (topicId: string): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(topicId);
        
        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error('Error deleting topic:', request.error);
            reject(request.error);
        };
    });
};

export const clearAllTopics = async (): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error('Error clearing data:', request.error);
            reject(request.error);
        };
    });
};
