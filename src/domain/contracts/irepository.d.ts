declare interface IRepository<TEntity> {
  get(predicate: (filter: TEntity) => boolean): Promise<Array<TEntity>>;
  insert(entity: TEntity): Promise<TEntity>;
  delete(id: number): Promise<void>;
}
