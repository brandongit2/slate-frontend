import {ArgsType, Field, InputType} from "@nestjs/graphql"
import {IsString} from "class-validator"

@ArgsType()
@InputType()
export class SignUpInput {
  @Field({description: `The user's first name.`})
  @IsString()
  firstName!: string

  @Field({description: `The user's last name.`})
  @IsString()
  lastName!: string

  @Field({description: `The user's email address.`})
  @IsString()
  email!: string

  @Field({description: `The user's new password.`})
  @IsString()
  password!: string
}
