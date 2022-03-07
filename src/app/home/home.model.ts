export interface RepoCards {
  title: string;
  description: string;
  nooflike: number;
  department: String;
  category: String;
  subCategory: String;
}

export interface FAQCards {
  category: String;
  subCategory: String;
  department: String;
  query: String;
  solution: String;
  videoUrl: String;
  docUrl: String;
  likes: Number;
  isLiked: boolean;
  id: any;
}

export interface DeptCards {
  deptId: number;
  name: string;
}

export interface UserDetails {
  id: string;
  email: string;
  username: string;
}

export interface CategoryList {
  categoryId: string;
  name: string;
}

export interface SubCategoryList {
  subCategoryId: string;
  name: string;
}
