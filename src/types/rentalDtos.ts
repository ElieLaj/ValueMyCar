import { IsDate, IsEnum, IsUUID } from "class-validator"
import { Expose, Transform, Type } from "class-transformer"
import { UserPresenter } from "./userDtos"
import { UserCarPresenter } from "./carDtos"

export class RentalToCreate {
  @IsUUID()
  @Expose()
  carId!: string

  @IsDate()
  @Expose()
  @Transform(({ value }) => new Date(value))
  startDate!: Date

  @IsDate()
  @Expose()
  @Transform(({ value }) => new Date(value))
  endDate!: Date
}

export class RentalToModify {
  @IsEnum(["pending", "active", "completed", "cancelled"])
  @Expose()
  status!: "pending" | "active" | "completed" | "cancelled"

  @Expose()
  startDate!: Date

  @Expose()
  endDate!: Date

  @Expose()
  totalPrice!: number
}

export class RentalPresenter {
  @Expose()
  id!: string

  @Expose()
  carId!: string

  @Type(() => UserPresenter)
  @Expose()
  renter!: UserPresenter

  @Type(() => UserPresenter)
  @Expose()
  owner!: UserPresenter

  @Type(() => UserCarPresenter)
  @Expose()
  car!: UserCarPresenter

  @Expose()
  startDate!: Date

  @Expose()
  endDate!: Date

  @Expose()
  totalPrice!: number

  @Expose()
  status!: "pending" | "active" | "completed" | "cancelled"
}

