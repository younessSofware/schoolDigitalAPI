// import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountEntity } from 'src/account/account.entity';
import { AuthService } from 'src/auth/auth.service';

import {
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  FindOperator,
  DataSource,
} from 'typeorm';
import { PaginationQueryDto } from './dtos/pagination.query.dtos';

@Injectable()
export class Helper {
  static dataSource: DataSource;

  constructor(
    private authService: AuthService,
    private dataSource: DataSource,
  ) {
    Helper.dataSource = this.dataSource;
  }

  static async isEntityUnique(entity: any, filter: any): Promise<boolean> {
    if (!Helper.dataSource) {
      throw new Error('DataSource is not initialized.');
    }
    console.log(filter);
    
    const count = await Helper.dataSource.getRepository(entity).count({
      where: filter,
    });
    return count === 0;
  }

  async extractAuthenticatedAccount(token: string): Promise<AccountEntity> {
    try {
      this.authService.verifyToken(token);
      const decodedToken = this.authService.decodeToken(token);
      const account = await Helper.dataSource
        .getRepository(AccountEntity)
        .findOne({
          select: ['id', 'fullname', 'email', 'role'],
          where: { id: decodedToken.sub },
        });
      return account;
    } catch (err) {
      throw new UnauthorizedException('errors.invalid_token');
    }
  }
}

function whereObjectToString(where: FindOptionsWhere<any>): string {
  let whereString = '';
  Object.entries(where).forEach(([key, value], index) => {
    if (value instanceof Object) {
      let nestedString = '';
      Object.entries(value).forEach(([nestedKey, nestedValue], nestedIndex) => {
        nestedString += `\`${key}\`.\`${nestedKey}\` = '${nestedValue}'`;
        if (Object.entries(value).length !== nestedIndex + 1) {
          nestedString += ' AND ';
        }
      });
      whereString += `(${nestedString})`;
    } else {
      whereString += `\`${key}\` = '${value}'`;
    }
    if (Object.entries(where).length !== index + 1) {
      whereString += ' AND ';
    }
  });
  return whereString;
}

export async function pagination2(
  entity: EntityTarget<unknown>,
  entityName: string,
  query: PaginationQueryDto,
  findOptions: FindManyOptions<unknown> = {},
  joinTables: any[] = [],
) {
  // eslint-disable-next-line prefer-const
  let { where, ...options } = findOptions;

  if (!where) where = { ...query.searchQuery };
  if (where && !(where as any).length)
    where = { ...(where as any), ...query.searchQuery };

  const repository = Helper.dataSource.getRepository(entity);
  const queryBuilder = repository.createQueryBuilder(entityName);

  joinTables.forEach((table) => {
    if (table.type == 'inner') {
      queryBuilder.innerJoin(entityName + '.' + table.name, table.alias);
    } else {
      queryBuilder.leftJoin(entityName + '.' + table.name, table.alias);
    }
  });

  if (options.select) {
    // queryBuilder.select(()=>options.select);
  }

  if (query.sort) {
    query.sort = Object.keys(query.sort).reduce(
      (acc, curr) => ({ ...acc, [entityName + '.' + curr]: query.sort[curr] }),
      {},
    );
    // queryBuilder.orderBy(query.sort)
  }

  if (where) {
    const whereString = whereObjectToString(where);
    queryBuilder.where(whereString);
  }

  if (options.loadRelationIds) {
    if (options.relations)
      queryBuilder.loadAllRelationIds({
        relations: options.relations as any[],
      });
    else queryBuilder.loadAllRelationIds();
  }

  const [data, count] = await queryBuilder
    .skip(query.skip)
    .take(query.take)
    .getManyAndCount();
  return { [entityName]: data, count };
}

export async function pagination(
  entity: EntityTarget<unknown>,
  entityName: string,
  query: PaginationQueryDto,
  findOptions: FindManyOptions<unknown> = {},
) {
  // eslint-disable-next-line prefer-const
  let { where, ...options } = findOptions;

  if (!where) where = { ...query.searchQuery };
  if (where && !(where as any).length)
    where = { ...(where as any), ...query.searchQuery };

  const response = await Helper.dataSource.getRepository(entity).findAndCount({
    ...options,
    where,
    skip: query.skip,
    take: query.take,
    order: query.sort,
  });

  return {
    [entityName]: response[0],
    count: response[1],
  };
}

export function randomValue(length: number) {
  return parseInt(
    Math.floor(new Date().valueOf() * Math.random())
      .toString()
      .split('')
      .reverse()
      .join('')
      .slice(0, length),
  );
}

export function randomStringValue(length: number) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function buildSearQueryArr(obj: any) {
  if (!obj || !Object.keys(obj).length) return [];
  return Object.keys(obj).reduce((acc, curr) => {
    const key = curr;
    let value = obj[key];
    if (!(value instanceof FindOperator)) {
      const res = this.buildSearQueryArr(obj[key]).map((el) => [
        `${key}.${el[0]}`,
        el[1],
      ]);
      return [...acc, ...res];
    } else {
      value = `%${value['_value']}`;
    }
    return [...acc, [key, value]];
  }, []);
}
