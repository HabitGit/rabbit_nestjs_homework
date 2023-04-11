import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";

interface RolesCreationAttrs { // Тут указываются поля используемые при добавлении в БД
    value: string;
    description: string;
}

@Table({tableName: 'roles'}) // Создание таблицы
export class Roles extends Model<Roles, RolesCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true}) // Создание колонки.
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    value: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @HasMany(() => User)
    user: User[];
}