export const getUserToken = () => {
    console.log("11111111111111111111", window.localStorage.getItem('cf_sales_token'))
    return(window.localStorage.getItem('cf_sales_token'))
};
export const removeAuth = () => {
    window.localStorage.setItem('cf_sales_token', '')
    window.localStorage.setItem('cf_sales_userName', '')
    window.localStorage.setItem('cf_sales_roles', '')
    return true
};
export const getAuth = () => {
    return(window.localStorage.getItem('cf_sales_token'))
};
export const getUserName = () => {
    console.log("22222222", window.localStorage.getItem('cf_sales_userName'))
    return(window.localStorage.getItem('cf_sales_userName'))
};
export const getUserRole = () => {
    return(window.localStorage.getItem('cf_sales_roles'))
};