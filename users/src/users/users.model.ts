import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Roles} from "../roles/roles.model";

interface UserCreationAttrs {
    email: string;
    password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isActivated: boolean;

    @Column({type: DataType.STRING, allowNull: true})
    activationLink: string;

    @ForeignKey(() => Roles)
    @Column({type: DataType.INTEGER})
    rolesId: number;

    @BelongsTo(() => Roles)
    role: Roles[];

    @Column({type: DataType.INTEGER})
    profileId: number;
}