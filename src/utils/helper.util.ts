
/**
 * Generates a random username
 * @param length - The length of the username to generate.
 * @returns A randomly generated username.
 */
export const generateUsername = (length = 20) => {
    const numberChars = "0123456789";
    const letterChars = "abcdefghijklmnopqrstuvwxyz";
    const allChars = numberChars + letterChars;
    
    const shuffle = (str: string) => str.split('').sort(() => 0.5 - Math.random()).join('');
  
    const shuffledChars = shuffle(allChars);
  
    const username = shuffledChars.slice(0, length);
  
    return username;
  }
 