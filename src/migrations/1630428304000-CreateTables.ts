import { MeetingRoomStatus } from '@meeting-room/enum/meeting-room-status.enum';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTables1630428304000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'equipment',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'quantity',
            type: 'integer',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'meeting_type',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'meeting_type_equipment',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'meeting_type_id',
            type: 'uuid',
          },
          {
            name: 'equipment_id',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'meeting_type_equipment',
      new TableForeignKey({
        columnNames: ['meeting_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meeting_type',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'meeting_type_equipment',
      new TableForeignKey({
        columnNames: ['equipment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'equipment',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'meeting_room',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'capacity',
            type: 'integer',
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(MeetingRoomStatus),
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'meeting_room_equipment',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'meeting_room_id',
            type: 'uuid',
          },
          {
            name: 'equipment_id',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'meeting_room_equipment',
      new TableForeignKey({
        columnNames: ['meeting_room_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meeting_room',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'meeting_room_equipment',
      new TableForeignKey({
        columnNames: ['equipment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'equipment',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'reservation',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'start_time',
            type: 'timestamp',
          },
          {
            name: 'end_time',
            type: 'timestamp',
          },
          {
            name: 'capacity',
            type: 'integer',
          },
          {
            name: 'meeting_type_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'meeting_room_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'reservation',
      new TableForeignKey({
        columnNames: ['meeting_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meeting_type',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'reservation',
      new TableForeignKey({
        columnNames: ['meeting_room_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meeting_room',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'reservation_equipment',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'reservation_id',
            type: 'uuid',
          },
          {
            name: 'equipment_id',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'reservation_equipment',
      new TableForeignKey({
        columnNames: ['reservation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'reservation',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'reservation_equipment',
      new TableForeignKey({
        columnNames: ['equipment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'equipment',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'reservation_equipment',
      new TableIndex({
        name: 'idx_reservation_equipment',
        columnNames: ['reservation_id', 'equipment_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const meetingTypeEquipmentTable = await queryRunner.getTable(
      'meeting_type_equipment',
    );
    const foreignKeysMeetingTypeEquipment =
      meetingTypeEquipmentTable.foreignKeys;

    await Promise.all(
      foreignKeysMeetingTypeEquipment.map((fk) =>
        queryRunner.dropForeignKey('meeting_type_equipment', fk),
      ),
    );
    await queryRunner.dropTable('meeting_type_equipment');

    const meetingRoomEquipementTable = await queryRunner.getTable(
      'meeting_room_equipment',
    );
    const foreignKeysMeetingRoomEquipement =
      meetingRoomEquipementTable.foreignKeys;

    await Promise.all(
      foreignKeysMeetingRoomEquipement.map((fk) =>
        queryRunner.dropForeignKey('meeting_room_equipment', fk),
      ),
    );
    await queryRunner.dropTable('meeting_room_equipment');

    const reservationEquipmentTable = await queryRunner.getTable(
      'reservation_equipment',
    );
    const foreignKeysReservationEquipment =
      reservationEquipmentTable.foreignKeys;

    await Promise.all(
      foreignKeysReservationEquipment.map((fk) =>
        queryRunner.dropForeignKey('reservation_equipment', fk),
      ),
    );
    await queryRunner.dropTable('reservation_equipment');

    await queryRunner.dropTable('reservation');
    await queryRunner.dropTable('meeting_room');
    await queryRunner.dropTable('meeting_type');
    await queryRunner.dropTable('equipment');
  }
}
