require('dotenv').config();

export const adminDN = process.env.USER_MS_LDAP_ADMIN_DN;
export const adminPassword = process.env.USER_MS_LDAP_ADMIN_PASSWORD;
export const ldapClientOptions = {
  url: process.env.USER_MS_LDAP_HOSTS?.split(' '),
  reconnect: true,
}
export const ldapBaseDN = process.env.USER_MS_LDAP_BASE_DN;
