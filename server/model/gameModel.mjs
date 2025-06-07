import dayjs from 'dayjs';

export default function Game(id, data, userId) {
  this.id = id;
  this.data = dayjs(data);
  this.userId = userId;
}