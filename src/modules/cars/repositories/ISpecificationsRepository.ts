interface ICreateSpecificationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create({ name, description }: ICreateSpecificationDTO): void;
}

export { ISpecificationsRepository, ICreateSpecificationDTO };
