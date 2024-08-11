// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const database: Record<string, Map<string, any>> = {};

export class MemoryDataSource {
  static instance: MemoryDataSource | null = null;

  private initializeEntityTable = (entity: string) => {
    database[entity] = database[entity] || new Map();
  };

  async create<T extends { id: string }>(entity: string, data: T): Promise<T> {
    this.initializeEntityTable(entity);

    database[entity].set(data.id, data);

    return data;
  }

  async get<T extends { id: string }>(
    entity: string,
    id: string,
  ): Promise<T | null> {
    this.initializeEntityTable(entity);

    return (database[entity].get(id) as T) || null;
  }

  async list<T>(entity: string): Promise<T[]> {
    this.initializeEntityTable(entity);

    return Array.from(database[entity].values());
  }

  async pagination<T>(
    entity: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ total: number; data: T[] }> {
    this.initializeEntityTable(entity);

    const start = (page - 1) * limit;
    const end = page * limit;

    return {
      total: database[entity].size,
      data: Array.from(database[entity].values()).slice(start, end),
    };
  }

  async update<T extends { id: string }>(entity: string, data: T): Promise<T> {
    this.initializeEntityTable(entity);

    database[entity].set(data.id, data);

    return data;
  }

  async delete<T extends { id: string }>(
    entity: string,
    id: string,
  ): Promise<T | null> {
    this.initializeEntityTable(entity);

    const data = database[entity].get(id);

    if (data) {
      database[entity].delete(id);
    }

    return data || null;
  }

  static getInstance = (): MemoryDataSource => {
    MemoryDataSource.instance =
      MemoryDataSource.instance || new MemoryDataSource();

    return MemoryDataSource.instance;
  };
}
