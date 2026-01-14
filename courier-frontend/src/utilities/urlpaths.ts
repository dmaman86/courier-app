export const urlPaths = {
  auth: {
    sigin: "/auth/signin",
    signup: "/auth/signup",
  },
  credential: {
    update: "/credential/update-credential",
    logout: "/credential/logout",
    refresh: "/credential/refresh-token",
  },
  user: {
    base: "/user",
    getList: "/user/all",
    getListByRole: "/user/role",
    search: "/user/search",
  },
  role: {
    base: "/user/role",
    getList: "/user/role/all",
  },
  branch: {
    base: "/resource/branch",
    getList: "/resource/branch/all",
    getByOffice: "/resource/branch/office",
    search: "/resource/branch/search",
  },
  office: {
    base: "/resource/office",
    getList: "/resource/office/all",
    createBase: "/resource/office/base",
    search: "/resource/office/search",
  },
  contact: {
    base: "/resource/contact",
    getByPhone: "/resource/contact/phone",
    getByOffice: "/resource/contact/office",
    getByBranch: "/resource/contact/branch",
    enableContact: "/resource/contact/enable",
    search: "/resource/contact/search",
  },
};
