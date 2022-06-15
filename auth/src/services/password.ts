import { scrypt, randomBytes } from 'crypto'; // scrypt is call-back based function
import { promisify } from 'util'; // this will make scrypt => async & await

const scryptAsync = promisify(scrypt);

export class Password {
  // Note : Static method can be called without creating Object
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
