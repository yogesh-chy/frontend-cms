export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  total: number;
  available: number;
  price: number;
}

export interface Borrowing {
  id: number;
  studentName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  status: string;
}

export interface Due {
  studentId: number | string;
  remaining: number;
  paid: number;
  phone: string;
}
