import { Role } from '../entity/Role';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { Account } from '../entity/Account';

const seed = async () => {
  await AppDataSource.initialize();

  const roleRepository = AppDataSource.getRepository(Role);
  const accountRepository = AppDataSource.getRepository(Account);
  const userRepository = AppDataSource.getRepository(User);

  // Ensure roles exist
  const roles = ['Super Admin', 'Admin', 'User'];
  for (const roleName of roles) {
    let role = await roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      role = new Role();
      role.name = roleName;
      await roleRepository.save(role);
    }
  }

  console.log("Roles created!")

  const accounts = ['Super Admin', 'Admin', 'User'];
  for (const accountName of accounts) {
    let account = await accountRepository.findOne({ where: { name: accountName } });
    if (!account) {
      account = new Account();
      account.name = accountName;
      await accountRepository.save(account);
    }
  }

  console.log("Accounts created!")


  // Ensure super admin user exists
  const superAdminRole = await roleRepository.findOne({ where: { name: 'Super Admin' } });
  const superAdminAccount = await accountRepository.findOne({ where: { name: 'Super Admin' } });
  
  if (superAdminRole && superAdminAccount) {
    let superAdmin = await userRepository.findOne({ where: { email: 'admin@wp.com' } });
    
    if (!superAdmin) {
      superAdmin = new User();
      superAdmin.email = 'admin@wp.com';
      superAdmin.password = 'Admin@123';
      superAdmin.first_name = 'Super';
      superAdmin.last_name = 'Admin';
      superAdmin.role = superAdminRole;
      superAdmin.account = superAdminAccount;
      const user = await userRepository.save(superAdmin);
      console.log("New user: ", user)
      console.log('Super Admin created!')
    } else {
      console.log("Super user already exists")
    }
  }

  const userRole = await roleRepository.findOne({ where: { name: 'User' } });
  const userAccount = await accountRepository.findOne({ where: { name: 'User' } });
  
  if (userRole && userAccount) {
    let testUser = await userRepository.findOne({ where: { email: 'user@wp.com' } });
    
    if (!testUser) {
      testUser = new User();
      testUser.email = 'user@wp.com';
      testUser.password = 'Admin@123';
      testUser.first_name = 'Test';
      testUser.last_name = 'User';
      testUser.role = userRole;
      testUser.account = userAccount;
      const user = await userRepository.save(testUser);
      console.log("Test user: ", user)
      console.log('Test User created!')
    } else {
      console.log("Test user already exists")
    }
  }

  await AppDataSource.destroy();
};

seed().catch((error) => console.error('Error during seeding:', error));
