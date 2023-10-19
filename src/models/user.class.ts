export class User {
  firstName!: string;
  lastName!: string;
  birthDate!: number;
  adress!: string;
  zipCode!: string;
  city!: string;

  constructor(obj?: any) {
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.birthDate = obj ? obj.birthDate : '';
    this.adress = obj ? obj.adress : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
  }

  public toJson() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      adress: this.adress,
      zipCode: this.zipCode,
      city: this.city,
    };
  }
}
