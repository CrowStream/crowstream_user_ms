import {AccountMicroService} from './application';
import roles from './constants/roles';
import {adminDN, adminPassword, ldapBaseDN, ldapClientOptions} from './datasources/ldap.datasource';

const ldap = require('ldapjs');

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new AccountMicroService();
  await app.boot();
  await app.migrateSchema({existingSchema});

  // Create ldap organizational units according to existing roles
  await new Promise((resolve, reject) => {
    const ldapClient = ldap.createClient(ldapClientOptions);

    // Connect to LDAP server
    ldapClient.bind(adminDN, adminPassword, async (err: any) => {
      if (err) {
        reject(err);
      }

      // Create the organization unit for each role
      for (let role of Object.values(roles)) {
        const dn = `ou=${role}, ${ldapBaseDN}`;
        const newOrganizationalUnit = {objectClass: 'organizationalUnit'};
        await new Promise((resolve, reject) => {
          ldapClient.add(dn, newOrganizationalUnit, (err: any) => {
            if (err) {
              if (err.lde_message === 'Entry Already Exists') {
                resolve(false);
              }
              reject(err);
            }
            resolve(true);
          });
        });
      }
      resolve(true);
    })
  });

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
