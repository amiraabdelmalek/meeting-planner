import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsLaterThan<T>(
  property: keyof T,
  validationOptions?: ValidationOptions,
) {
  return function (object: T, propertyName: keyof T) {
    registerDecorator({
      name: 'isLaterThan',
      target: object.constructor,
      propertyName: propertyName as string,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as T)[
            relatedPropertyName as keyof T
          ];

          if (typeof value !== 'string' || typeof relatedValue !== 'string') {
            return false;
          }

          return new Date(value) > new Date(relatedValue);
        },
      },
    });
  };
}

export class CreateReservationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  @IsLaterThan<CreateReservationDto>('startTime', {
    message: 'endTime must be later than startTime',
  })
  endTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  capacity: number;

  @ApiProperty({ description: 'UUID of the meeting type' })
  @IsUUID()
  @IsNotEmpty()
  meetingTypeId: string;
}
