export type Auth = {
  token: string | null;
  user: any;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  username: string;
};


export type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

export type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

export type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

export type TodosResponse = {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
};
