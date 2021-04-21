import { inject, injectable } from "tsyringe";

import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UsersRepository } from "@modules/accounts/infra/repositories/UsersRepository";
import { UserMap } from "@modules/accounts/mappers/UserMap";

@injectable()
class ProfileUserUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: UsersRepository
  ) {}

  async execute(id: string): Promise<IUserResponseDTO> {
    const user = await this.userRepository.findById(id);
    return UserMap.toDTO(user);
  }
}

export { ProfileUserUseCase };
