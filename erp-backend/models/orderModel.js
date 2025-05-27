import { readData } from '../utils/fileStorage.js';

export let orders = await readData('./data/orders.json');
