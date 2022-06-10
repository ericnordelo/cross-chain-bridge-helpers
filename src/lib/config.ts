import { cosmiconfig } from 'cosmiconfig';

const explorer = cosmiconfig('');

export async function getConfig() {
  try {
    return await explorer.load('ccbh.js');
  } catch (e) {
    console.log('Error: Failed to load config from ccbh.js');
    process.exit(0);
  }
}
