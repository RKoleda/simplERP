import { readData } from '../utils/fileStorage.js';

export let customers = await readData('./data/customers.json');
