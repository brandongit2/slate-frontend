import {Test, TestingModule} from "@nestjs/testing"

import {TestDbModule} from "@api/src/testDb.module"

import {UsersService} from "./users.service"

describe(`UsersService`, () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDbModule],
      providers: [UsersService],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it(`should be defined`, () => {
    expect(service).toBeDefined()
  })
})
