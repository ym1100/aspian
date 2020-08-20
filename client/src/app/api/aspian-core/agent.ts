import axios, { AxiosResponse } from 'axios';
//import { history } from '../../layout/App';
import { IPost, IPostsEnvelope } from '../../models/aspian-core/post';
import { IUser, IUserFormValues } from '../../models/aspian-core/user';
import { history } from '../../..';

axios.defaults.baseURL = 'http://localhost:5001/api';

// axios.interceptors.request.use(
//   (config) => {
//     //const token = ;
//     // if (token) config.headers.Authorization = `Bearer ${token}`;
//     // return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === 'Network Error' && !error.response) {
    history.push('/network-rerror');
  }
  const { status, data, config } = error.response;
  if (status === 404) {
    history.push('/notfound');
  }
  if (
    status === 400 &&
    config.method === 'get' &&
    data.errors.hasOwnProperty('id')
  ) {
    history.push('/notfound');
  }
  if (status === 500) {
    history.push('/serve-rerror');
  }
  throw error;
});

const responseBody = (response: AxiosResponse) => response.data;

// Just for development mode
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
};

const Posts = {
  list: (limit?: number, page?: number, filterKey?: string, filterValue?: string, field?: string, order?: string): Promise<IPostsEnvelope> =>
    requests.get(`/v1/posts?limit=${limit}&offset=${page ? page * limit! : 0}&field=${field}&order=${order}&filterKey=${filterKey}&filterValue=${filterValue}`),
  details: (id: string): Promise<IPost> =>
    requests.get(`/v1/posts/details/${id}`),
  create: (post: IPost) => requests.post('/v1/posts/create', post),
  update: (post: IPost) => requests.put(`/v1/posts/edit/${post.id}`, post),
  delete: (id: string) => requests.del(`/posts/delete/${id}`),
};

const User = {
  current: (): Promise<IUser> => requests.get('v1/user'),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post('v1/user/login', user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post('v1/user/register', user),
};

export default {
  Posts,
  User,
};
