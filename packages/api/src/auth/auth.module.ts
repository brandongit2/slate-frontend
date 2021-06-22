import {Module} from "@nestjs/common"
import {JwtModule} from "@nestjs/jwt"
import {PassportModule} from "@nestjs/passport"
import config from "config"

import {UsersModule} from "@api/src/users/users.module"

import {AuthResolver} from "./auth.resolver"
import {AuthService} from "./auth.service"
import {JwtStrategy} from "./jwt.strategy"

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: config.get(`api.secret`),
      signOptions: {expiresIn: `30d`},
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}