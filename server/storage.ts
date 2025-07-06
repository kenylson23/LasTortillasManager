import {
  users,
  menuItems,
  orders,
  orderItems,
  tables,
  staff,
  customers,
  inventory,
  reservations,
  type User,
  type InsertUser,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Table,
  type InsertTable,
  type Staff,
  type InsertStaff,
  type Customer,
  type InsertCustomer,
  type Inventory,
  type InsertInventory,
  type Reservation,
  type InsertReservation,
  type OrderWithDetails,
  type ReservationWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (for PostgreSQL auth)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Menu operations
  getMenuItems(): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;

  // Order operations
  getOrders(): Promise<OrderWithDetails[]>;
  getOrderById(id: number): Promise<OrderWithDetails | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrdersByStatus(status: string): Promise<OrderWithDetails[]>;

  // Table operations
  getTables(): Promise<Table[]>;
  updateTableStatus(id: number, status: string, currentOrderId?: number): Promise<Table>;
  getTableById(id: number): Promise<Table | undefined>;

  // Staff operations
  getStaff(): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staff: Partial<InsertStaff>): Promise<Staff>;
  deleteStaff(id: string): Promise<void>;

  // Customer operations
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;

  // Inventory operations
  getInventory(): Promise<Inventory[]>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory>;
  deleteInventoryItem(id: number): Promise<void>;

  // Reservation operations
  getReservations(): Promise<ReservationWithDetails[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, reservation: Partial<InsertReservation>): Promise<Reservation>;
  deleteReservation(id: number): Promise<void>;

  // Analytics operations
  getDailyStats(): Promise<{
    salesToday: number;
    ordersToday: number;
    averageOrderValue: number;
    tablesOccupied: number;
    totalTables: number;
    activeStaff: number;
    totalStaff: number;
  }>;
  getWeeklySales(): Promise<{ date: string; sales: number }[]>;
  getPopularDishes(): Promise<{ name: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Menu operations
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).orderBy(menuItems.category, menuItems.name);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db.insert(menuItems).values(item).returning();
    return menuItem;
  }

  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [menuItem] = await db
      .update(menuItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return menuItem;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // Order operations
  async getOrders(): Promise<OrderWithDetails[]> {
    return await db.query.orders.findMany({
      with: {
        table: true,
        customer: true,
        staff: true,
        items: {
          with: {
            menuItem: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
    });
  }

  async getOrderById(id: number): Promise<OrderWithDetails | undefined> {
    return await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        table: true,
        customer: true,
        staff: true,
        items: {
          with: {
            menuItem: true,
          },
        },
      },
    });
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(orderItem).returning();
    return item;
  }

  async getOrdersByStatus(status: string): Promise<OrderWithDetails[]> {
    return await db.query.orders.findMany({
      where: eq(orders.status, status),
      with: {
        table: true,
        customer: true,
        staff: true,
        items: {
          with: {
            menuItem: true,
          },
        },
      },
      orderBy: [orders.createdAt],
    });
  }

  // Table operations
  async getTables(): Promise<Table[]> {
    return await db.select().from(tables).orderBy(tables.number);
  }

  async updateTableStatus(id: number, status: string, currentOrderId?: number): Promise<Table> {
    const [table] = await db
      .update(tables)
      .set({ status, currentOrderId, updatedAt: new Date() })
      .where(eq(tables.id, id))
      .returning();
    return table;
  }

  async getTableById(id: number): Promise<Table | undefined> {
    const [table] = await db.select().from(tables).where(eq(tables.id, id));
    return table;
  }

  // Staff operations
  async getStaff(): Promise<Staff[]> {
    return await db.select().from(staff).orderBy(staff.name);
  }

  async createStaff(staffData: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(staffData).returning();
    return newStaff;
  }

  async updateStaff(id: string, staffData: Partial<InsertStaff>): Promise<Staff> {
    const [updatedStaff] = await db
      .update(staff)
      .set({ ...staffData, updatedAt: new Date() })
      .where(eq(staff.id, id))
      .returning();
    return updatedStaff;
  }

  async deleteStaff(id: string): Promise<void> {
    await db.delete(staff).where(eq(staff.id, id));
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(customers.name);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  // Inventory operations
  async getInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory).orderBy(inventory.category, inventory.itemName);
  }

  async createInventoryItem(item: InsertInventory): Promise<Inventory> {
    const [newItem] = await db.insert(inventory).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory> {
    const [updatedItem] = await db
      .update(inventory)
      .set({ ...item, lastUpdated: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<void> {
    await db.delete(inventory).where(eq(inventory.id, id));
  }

  // Reservation operations
  async getReservations(): Promise<ReservationWithDetails[]> {
    return await db.query.reservations.findMany({
      with: {
        customer: true,
        table: true,
      },
      orderBy: [reservations.reservationDate],
    });
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const [newReservation] = await db.insert(reservations).values(reservation).returning();
    return newReservation;
  }

  async updateReservation(id: number, reservation: Partial<InsertReservation>): Promise<Reservation> {
    const [updatedReservation] = await db
      .update(reservations)
      .set({ ...reservation, updatedAt: new Date() })
      .where(eq(reservations.id, id))
      .returning();
    return updatedReservation;
  }

  async deleteReservation(id: number): Promise<void> {
    await db.delete(reservations).where(eq(reservations.id, id));
  }

  // Analytics operations
  async getDailyStats(): Promise<{
    salesToday: number;
    ordersToday: number;
    averageOrderValue: number;
    tablesOccupied: number;
    totalTables: number;
    activeStaff: number;
    totalStaff: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [dailyOrders] = await db
      .select({
        count: sql<number>`count(*)`,
        totalSales: sql<number>`sum(${orders.total})`,
      })
      .from(orders)
      .where(and(
        gte(orders.createdAt, today),
        lte(orders.createdAt, tomorrow)
      ));

    const [tableStats] = await db
      .select({
        total: sql<number>`count(*)`,
        occupied: sql<number>`count(case when ${tables.status} = 'occupied' then 1 end)`,
      })
      .from(tables);

    const [staffStats] = await db
      .select({
        total: sql<number>`count(*)`,
        active: sql<number>`count(case when ${staff.isActive} = true then 1 end)`,
      })
      .from(staff);

    const ordersToday = Number(dailyOrders?.count) || 0;
    const salesToday = Number(dailyOrders?.totalSales) || 0;

    return {
      salesToday,
      ordersToday,
      averageOrderValue: ordersToday > 0 ? salesToday / ordersToday : 0,
      tablesOccupied: Number(tableStats?.occupied) || 0,
      totalTables: Number(tableStats?.total) || 0,
      activeStaff: Number(staffStats?.active) || 0,
      totalStaff: Number(staffStats?.total) || 0,
    };
  }

  async getWeeklySales(): Promise<{ date: string; sales: number }[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklySales = await db
      .select({
        date: sql<string>`date(${orders.createdAt})`,
        sales: sql<number>`sum(${orders.total})`,
      })
      .from(orders)
      .where(gte(orders.createdAt, sevenDaysAgo))
      .groupBy(sql`date(${orders.createdAt})`)
      .orderBy(sql`date(${orders.createdAt})`);

    return weeklySales.map(row => ({
      date: row.date,
      sales: Number(row.sales) || 0,
    }));
  }

  async getPopularDishes(): Promise<{ name: string; count: number }[]> {
    const popularDishes = await db
      .select({
        name: menuItems.name,
        count: sql<number>`sum(${orderItems.quantity})`,
      })
      .from(orderItems)
      .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
      .groupBy(menuItems.name)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(5);

    return popularDishes.map(dish => ({
      name: dish.name || "Unknown",
      count: Number(dish.count) || 0,
    }));
  }
}

export const storage = new DatabaseStorage();
