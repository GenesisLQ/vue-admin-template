/**
 * swap array elements
 * @param  {any[]} array
 * @param  {number} from
 * @param  {number} to
 */
export function swap<T>(array: T[], from: number, to: number): T[] {
  if (array.length < 2) {
    return array;
  }
  const targetRow: T = array.splice(from, 1)[0];
  array.splice(to, 0, targetRow);
  return array;
}

/**
 * @param  {string} str original string
 * @param  {string} chars chars to trim, such as '/', 'aa'
 * @returns string
 */
export function trim(str: string, chars: string): string {
  const regExp = `^(${chars})+|(${chars})+$`;
  return str.replace(new RegExp(regExp, 'g'), '');
}
