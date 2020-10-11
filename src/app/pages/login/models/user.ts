interface IUserInput {
  email?: string;
}

export class User {
  email?: string;
  
  constructor(x: IUserInput) {
    this.email = x.email;
  } 
}