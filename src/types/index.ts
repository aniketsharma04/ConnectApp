export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    accountId: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export type IContextType = {
    user: IUser;                    // Current user details
    setuser: (user: IUser) => void;  // Function to update user information (lowercase 'u')
    isLoading: boolean;              // Indicates if the user data is loading
    isAuthenticated: boolean;        // Indicates if the user is authenticated
    setisAuthenticated: (auth: boolean) => void;  // Function to set authentication state
    checkAuthUser: () => Promise<boolean>; // Function to check if the user is authenticated
  };
  