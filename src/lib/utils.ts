import { cosmiconfig } from 'cosmiconfig';

const explorer = cosmiconfig('');

export async function getConfig() {
  try {
    return await explorer.load('ccbh.json');
  } catch (e) {
    console.log('Error: Failed to load config from ccbh.json');
    process.exit(1);
  }
}
