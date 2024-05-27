
export const paths = {
    auth: {
        login: '/auth/signin',
        logout: '/auth/logout',
        signUp: '/auth/signup',
    },
    courier: {
        refreshToken: '/auth/refresh',
        userDetails: '/courier/users/me',
        users: '/courier/users/',
        offices: '/courier/office/',
        branches: '/courier/branch/',
        contacts: '/courier/contact/',
        roles: '/courier/role/',
        createOrUpdateUser: '/courier/users/user',
        createOrUpdateClient: '/courier/users/client',
        deleteUser: '/courier/users/id',
    }
}