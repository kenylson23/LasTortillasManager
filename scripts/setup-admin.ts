import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { storage } from "../server/storage";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function setupAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await storage.getUserByUsername("admin");
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create default admin user
    const hashedPassword = await hashPassword("admin123");
    const adminUser = await storage.createUser({
      username: "admin",
      email: "admin@lastortilhas.com",
      password: hashedPassword,
      firstName: "Administrador",
      lastName: "Sistema",
      role: "admin"
    });

    console.log("Admin user created successfully:");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("Email: admin@lastortilhas.com");
    console.log("Role: admin");
    console.log("\nPlease change the default password after first login!");
    
  } catch (error) {
    console.error("Error setting up admin user:", error);
  }
}

setupAdmin();