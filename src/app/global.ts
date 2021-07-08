
export class LoginModel {
  email: string;
  password: string;
  constructor(data?: LoginModel) {
    if (data) {
      this.email = data.email;
      this.password = data.password;
    } else {
      this.email = '';
      this.password = '';
    }

  }
}

export class Banner {
  title: string;
  content: string;
  buttonText: string;
  buttonLink: string;
  images: Array<string> | string;
  constructor(data) {
    if (data) {
      if (data.title) {
        this.title = data.title;
      }
      if (data.content) {
        this.content = data.content;
      }
      if (data.buttonText) {
        this.buttonText = data.buttonText;
      }
      if (data.buttonLink) {
        this.buttonLink = data.buttonLink;
      }
      if (data.images) {
        this.images = data.images;
      }
    }
  }
}

export class AuthModel {
  token: string;
  role?: string;
  username?: string;
  isLogin: boolean;
  profileImage?: string;
  constructor(data: AuthModel) {
    if (data) {
      this.token = data.token;
      this.isLogin = data.isLogin;
      if (data.role) {
        this.role = data.role;
      }
      if (data.username) {
        this.username = data.username;
      }
      if (data.profileImage) {
        this.profileImage = data.profileImage;
      } else {
        this.profileImage = '';
      }
    }
  }
}

// export class AuthModel {
//   token: string;
//   role?: string;
//   username?: string;
//   constructor(
//     token: string,
//     role?: string,
//     username?: string,
//   ) {
//     this.token = token ? token : '';
//     if (role) {
//       this.role = role;
//     }
//     if (username) {
//       this.username = username;
//     }
//   }
// }
