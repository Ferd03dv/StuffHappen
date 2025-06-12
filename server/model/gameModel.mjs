import dayjs from 'dayjs';

export default function Game(id, data, userId, risultato, carte_vinte) {
  this.id = id;
  this.data = dayjs(data);
  this.userId = userId;
  this.risultato = risultato;
  this.carte_vinte = carte_vinte;
}