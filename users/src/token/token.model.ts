import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";

interface TokensCreationAttrs {
    userId: number;
    refreshToken: string;
}

@Table({tableName: 'tokens'})
export class Tokens extends Model<Tokens, TokensCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true}) // Создание колонки.
    id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    @Column({type: DataType.TEXT, allowNull: false})
    refreshToken: string;
}