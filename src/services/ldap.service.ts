import {BindingScope, injectable} from '@loopback/core';
import {AccountCredentialsBody} from '../bodies';

const ldap = require('ldapjs');
require('dotenv').config();

@injectable({scope: BindingScope.TRANSIENT})
export class LdapService {

  protected readonly adminDN: String | undefined;
  protected readonly adminPassword: String | undefined;
  protected readonly ldapClientOptions: Object;
  protected readonly dn: String | undefined;

  constructor() {
    this.adminDN = process.env.USER_MS_LDAP_ADMIN_DN;
    this.adminPassword = process.env.USER_MS_LDAP_ADMIN_PASSWORD;
    this.ldapClientOptions = {
      url: process.env.USER_MS_LDAP_HOSTS?.split(' '),
      reconnect: true,
    }
    this.dn = process.env.USER_MS_LDAP_BASE_DN;
  }

  async addUser(accountCredentials: AccountCredentialsBody, role: String): Promise<Boolean> {
    return new Promise((resolve) => {
      // Connect to ldap
      const ldapClient = ldap.createClient(this.ldapClientOptions);

      // Login as admin to be able to add a new user
      ldapClient.bind(this.adminDN, this.adminPassword, (err: any) => {
        if (err) {
          resolve(false);
          return;
        }
        const emailParts = accountCredentials.email.split('@');
        const newUser = {
          cn: emailParts[0],
          sn: emailParts[1],
          userPassword: accountCredentials.password,
          objectClass: 'person'
        };
        ldapClient.add(
          `cn=${accountCredentials.email}, ou=${role}, ${this.dn}`,
          newUser,
          (err: any) => {
            resolve(!err);
            return;
          }
        )
      });
    })
  }

  async authenticate(accountCredentials: AccountCredentialsBody, roles: Array<string>): Promise<boolean> {
    // Connect to ldap
    const ldapClient = ldap.createClient(this.ldapClientOptions);

    for (let i = 0; i < roles.length; i++) {
      const isValid = await new Promise((resolve) => {
        ldapClient.bind(
          `cn=${accountCredentials.email}, ou=${roles[i]}, ${this.dn}`,
          accountCredentials.password,
          (err: any) => {
            resolve(!err);
            return;
          }
        )
      });
      if (!isValid) {
        return false;
      }
    }
    return true;
  }
}
