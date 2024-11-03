import axios from 'axios';
import { io } from 'socket.io-client';

const axiosOptions = {
  baseURL: 'http://127.0.0.1:5000/api',
};

const apiInstance = axios.create(axiosOptions);

export const getMessages = limit => apiInstance.get(`/messages?limit=${limit}`);

const socketClient = io('ws://localhost:5000'); // 'connection'

export const createMessage = newMessage => {
  socketClient.emit('NEW_MESSAGE', newMessage);
};

socketClient.on('NEW_MESSAGE_SUCCESS', payload => {
  console.log('payload :>> ', payload);
});

socketClient.on('NEW_MESSAGE_ERROR', payload => {
  console.log('payload :>> ', payload);
});
