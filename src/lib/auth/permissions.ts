import { defaultStatements, userAc, adminAc } from 'better-auth/plugins/admin/access';
import { createAccessControl } from 'better-auth/plugins/access';

export const ac = createAccessControl(defaultStatements);

export const user = ac.newRole(userAc.statements);

export const admin = ac.newRole(adminAc.statements);
