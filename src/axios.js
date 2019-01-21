import axios from 'axios';

export default axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://192.168.5.141:8080',
});
