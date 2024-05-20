
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
        roles: '/courier/role/',
        createOrUpdateUser: '/courier/users/user',
        deleteUser: '/courier/users/id',
    }
}