import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmOptions: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'formations',
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    synchronize: true
}

export const JWT_SECRET = "sdfjlzk(44uç564(è_ç(uè_ç45654ht(jklzjflkdsuidsdqr_çr(ue5464sqklfds4f5d5s64f52sd"