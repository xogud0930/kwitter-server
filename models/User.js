const User = (name, email, userId, pw, pw2) => {
    this.name = name;
    this.email = email;
    this.userId = userId;
    this.password = pw;
    this.passwordCheck = pw2;
}

module.exports = { User }