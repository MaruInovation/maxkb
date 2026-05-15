import { create } from 'zustand';
import type { userStateTypes } from '@/types/user.type';
import { getUserProfile, getProfile } from '@/api/user/user';

export const useUserStore = create<userStateTypes>((set, get) => ({
	userInfo: {
		id: '',
		username: '',
		nick_name: '',
		email: '',
		role: [],
		permissions: [],
	},
	version: '',
	rsaKey: '',
	license_is_valid: false,
	edition: 'CE',
	workspace_list: [],
	workspace_id: '',
	getWorkspaceId: () => {
		return get().workspace_id || localStorage.getItem('workspace_id') || 'default';
	},
	setWorkspaceId: (workspace_id: string) => {
		set({ workspace_id: workspace_id });
		localStorage.setItem('workspace_id', workspace_id);
	},
	profile: async () => {
		const ok = await getUserProfile();
		set({
			userInfo: ok.data,
		});
		const workspace_list =
			ok.data.workspace_list && ok.data.workspace_list.length > 0
				? ok.data.workspace_list
				: [{ id: 'default', name: 'default' }];

		const workspace_id = get().getWorkspaceId();

		if (!workspace_id || !workspace_list.some((w) => w.id == workspace_id)) {
			get().setWorkspaceId(workspace_list[0].id);
		}
		set({ workspace_list: workspace_list });

		// useLocalStorage<string>(localeConfigKey, 'en-US').value =
		//     ok?.data?.language || this.getLanguage()
		// const theme = useThemeStore()
		// theme.setTheme()

		return get().asyncGetProfile();
	},

	asyncGetProfile: async () => {
		return new Promise((resolve, reject) => {
			getProfile()
				.then(async (ok) => {
					set({
						license_is_valid: ok.data.license_is_valid,
						edition: ok.data.edition,
						version: ok.data.version,
						rsaKey: ok.data.rsa,
					});
					// const theme = useThemeStore()
					// if (this.isEE() || this.isPE()) {
					//     await theme.theme()
					// } else {
					//     theme.setTheme()
					//     theme.themeInfo = {
					//         ...defaultPlatformSetting,
					//     }
					// }
					resolve(ok);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
}));
