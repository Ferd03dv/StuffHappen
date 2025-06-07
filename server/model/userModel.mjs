export default function User(id, username, password, avatar, salt) {
  this.id = id;
  this.username = username;
  this.password = password,
  this.avatar = avatar;
  this.salt = salt;
}