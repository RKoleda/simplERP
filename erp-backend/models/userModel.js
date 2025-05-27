import bcrypt from 'bcryptjs';

export class User {
    constructor(email, password){
        this.id = Date.now().toString();
        this.email = email;
        this.passwordHash = bcrypt.hashSync(password, 10);
    }
}