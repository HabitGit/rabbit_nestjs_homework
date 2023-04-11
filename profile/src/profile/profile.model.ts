import {Column, DataType, Model, Table} from "sequelize-typescript";

interface ProfileCreationAttrs {
    lastName: string;
    firstName: string;
    telNumber: string;
    userId: number;
    avatar: string;
}

@Table({tableName: 'profile'})
export class Profile extends Model<Profile, ProfileCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING})
    lastName: string;

    @Column({type: DataType.STRING})
    firstName: string;

    @Column({type: DataType.STRING})
    telNumber: string;

    @Column({type: DataType.STRING})
    avatar: string;

    @Column({type: DataType.INTEGER})
    userId: number;
}