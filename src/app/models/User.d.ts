import { Novax } from './Novax';

export namespace User {
  export type Model = Novax.definitions['UserModel'];
  export type Input = Novax.definitions['UserInput'];
  export type Minimal = Novax.definitions['UserMinimalModel'];
  export type Permission = Novax.definitions['PermissionModel'];
}
