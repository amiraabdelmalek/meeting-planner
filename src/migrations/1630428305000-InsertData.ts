import { MeetingRoomStatus } from '@meeting-room/enum/meeting-room-status.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertData1630428305000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const equipmentData = [
      { name: 'pieuvre', quantity: 4 },
      { name: 'tableau', quantity: 2 },
      { name: 'webcam', quantity: 4 },
      { name: 'écran', quantity: 5 },
    ];

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('equipment')
      .values(equipmentData)
      .execute();

    const meetingTypeData = [
      {
        code: 'VC',
        name: 'visioconférence',
      },
      {
        code: 'SPEC',
        name: "séance de partage et d'études de cas",
      },
      {
        code: 'RS',
        name: 'réunion simple',
      },
      {
        code: 'RC',
        name: 'réunion couplée',
      },
    ];

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('meeting_type')
      .values(meetingTypeData)
      .execute();

    const meetingTypeEquipmentLinks = [
      { meetingTypeCode: 'VC', equipmentName: 'écran' },
      { meetingTypeCode: 'VC', equipmentName: 'pieuvre' },
      { meetingTypeCode: 'VC', equipmentName: 'webcam' },
      { meetingTypeCode: 'SPEC', equipmentName: 'tableau' },
      { meetingTypeCode: 'RC', equipmentName: 'écran' },
      { meetingTypeCode: 'RC', equipmentName: 'pieuvre' },
      { meetingTypeCode: 'RC', equipmentName: 'tableau' },
    ];

    for (const link of meetingTypeEquipmentLinks) {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('meeting_type_equipment')
        .values({
          meeting_type_id: () =>
            `(SELECT id FROM meeting_type WHERE code = '${link.meetingTypeCode}')`,
          equipment_id: () =>
            `(SELECT id FROM equipment WHERE name = '${link.equipmentName}')`,
        })
        .execute();
    }

    const meetingRoomData = [
      {
        name: 'E1001',
        capacity: 23,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E1002',
        capacity: 10,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E1003',
        capacity: 8,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E1004',
        capacity: 4,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E2001',
        capacity: 4,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E2002',
        capacity: 15,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E2003',
        capacity: 7,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E2004',
        capacity: 9,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E3001',
        capacity: 13,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E3002',
        capacity: 8,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E3003',
        capacity: 9,
        status: MeetingRoomStatus.AVAILABLE,
      },
      {
        name: 'E3004',
        capacity: 4,
        status: MeetingRoomStatus.AVAILABLE,
      },
    ];

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('meeting_room')
      .values(meetingRoomData)
      .execute();

    const meetingRoomEquipmentLinks = [
      { meetingRoomName: 'E1002', equipmentName: 'écran' },
      { meetingRoomName: 'E1003', equipmentName: 'pieuvre' },
      { meetingRoomName: 'E1004', equipmentName: 'tableau' },
      { meetingRoomName: 'E2002', equipmentName: 'écran' },
      { meetingRoomName: 'E2002', equipmentName: 'webcam' },
      { meetingRoomName: 'E2004', equipmentName: 'tableau' },
      { meetingRoomName: 'E3001', equipmentName: 'écran' },
      { meetingRoomName: 'E3001', equipmentName: 'webcam' },
      { meetingRoomName: 'E3001', equipmentName: 'pieuvre' },
      { meetingRoomName: 'E3003', equipmentName: 'écran' },
      { meetingRoomName: 'E3003', equipmentName: 'pieuvre' },
    ];

    for (const link of meetingRoomEquipmentLinks) {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('meeting_room_equipment')
        .values({
          meeting_room_id: () =>
            `(SELECT id FROM meeting_room WHERE name = '${link.meetingRoomName}')`,
          equipment_id: () =>
            `(SELECT id FROM equipment WHERE name = '${link.equipmentName}')`,
        })
        .execute();
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('meeting_type_equipment')
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('meeting_room_equipment')
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('meeting_type')
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('meeting_room')
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('equipment')
      .execute();
  }
}
