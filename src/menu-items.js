import { getLocalStorageItem } from './utils/localStorage';
import { defaultMenuItems, adminMenuItems } from './menuConfig';

const dataUser = getLocalStorageItem('dataUser');

let menuItems = defaultMenuItems;

// Set menu items based on user role
if (dataUser && dataUser.role === 'Admin') {
    menuItems = adminMenuItems;
}

console.log(dataUser, "User data:");
console.log(menuItems, "Menu items based on role");

export default menuItems;
