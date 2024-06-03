
export const paths = {
    auth: {
        login: '/auth/signin',
        logout: '/auth/logout',
        signUp: '/auth/signup',
    },
    courier: {
        refreshToken: '/auth/refresh',
        userDetails: '/courier/users/me',
        orders: '/courier/order/',
        users: '/courier/users/',
        offices: '/courier/office/',
        branches: '/courier/branch/',
        contacts: '/courier/contact/',
        roles: '/courier/role/',
        statusOrder: '/courier/status/',
        createOrUpdateUser: '/courier/users/user',
        createOrUpdateClient: '/courier/users/client',
        deleteUser: '/courier/users/id',
    }
}