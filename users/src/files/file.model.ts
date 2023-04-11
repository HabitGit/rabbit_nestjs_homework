import {Column, DataType,Model, Table} from "sequelize-typescript";


interface FilesCreationAttrs {
    fileName: string;
    essenceTable: string;
    essenceId: number;
}

@Table({tableName: 'files'})
export class Files extends Model<Files, FilesCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true})
    fileName: string;

    @Column({type: DataType.STRING})
    essenceTable: string;

    @Column({type: DataType.INTEGER})
    essenceId: number;
}