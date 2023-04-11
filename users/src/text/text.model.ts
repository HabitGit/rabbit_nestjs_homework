import {Column, DataType, Model, Table} from "sequelize-typescript";


interface TextCreationAttrs {
    uniqueName: string;
    page: string;
    header: string;
    text: string;
    image: string;
}
@Table({tableName: 'texts'})
export class Texts extends Model<Texts, TextCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    uniqueName: string;

    @Column({type: DataType.STRING, allowNull: false})
    page: string;

    @Column({type: DataType.STRING, defaultValue: 'Nothing'})
    header: string;

    @Column({type: DataType.TEXT, defaultValue: 'Nothing'})
    text: string;

    @Column({type: DataType.STRING})
    image: string;
}