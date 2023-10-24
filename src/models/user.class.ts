export class User {
  firstName!: string;
  lastName!: string;
  birthDate!: number | string;
  age!: number | string;
  phone!: number | string;
  email!: string;
  address!: string;
  zipCode!: string;
  city!: string;
  userID!: string;

  constructor(obj?: any) {
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.birthDate = obj ? obj.birthDate : '';
    this.age = '';
    this.phone = obj ? obj.phone : '';
    this.email = obj ? obj.email : '';
    this.address = obj ? obj.address : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
    this.userID = '';
  }

  public toJson() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      age: this.age,
      phone: this.phone,
      email: this.email,
      address: this.address,
      zipCode: this.zipCode,
      city: this.city,
      userID: this.userID,
    };
  }
}
