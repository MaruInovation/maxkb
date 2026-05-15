import type { User } from '@maxkb/types/user.type';

export interface userStateTypes {
	userInfo: User | null;
	version?: string;
	license_is_valid: boolean;
	edition: 'CE' | 'PE' | 'EE';
	workspace_id: string;
	workspace_list: Array<any>;
	rsaKey: string;

	profile: () => Promise<unknown>;
	asyncGetProfile: () => Promise<unknown>;
	getWorkspaceId: () => string;
	setWorkspaceId: (workspace_id: string) => void;
}
