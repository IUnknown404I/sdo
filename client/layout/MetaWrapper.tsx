import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTypedSelector } from '../redux/hooks';
import logapp from '../utils/logapp';
import { checkProductionMode } from '../utils/utilityFunctions';

/**
 * @IUnknown404I App Wrapper for sending meta data to the server.
 * @param param children as inner components of the wrapper.
 * @returns App Wrapper with isolated logic (per-pages or router-object change logic).
 */
const MetaWrapper = ({ children }: { children: ReactElement | ReactElement[] }): ReactElement => {
	const router = useRouter();
	const auth = useTypedSelector(state => state.auth.state);
	const sessionState = useTypedSelector(state => state.auth.sessionState);
	const axiosInstance = useTypedSelector(state => state.axiosInstance?.instance);
	const accessTokenDTO = useTypedSelector(state => state.accessToken);

	const sendMetaInformationToServer = () => {
		if (!checkProductionMode() || !auth || accessTokenDTO?.access_token == null) return;
		try {
			logapp.log('[#MetaInfoWrapper]: sending metadata', router.asPath);
			axiosInstance
				.put('users/leave-meta', { lastPage: router.asPath })
				.then(res => logapp.log('[# MetaInfoWrapper]: successfully sent data, got response = ', res))
				.catch(e => logapp.log('[# MetaInfoWrapper]: cant send info, got the err: ', e));
		} catch (e) {}
	};

	React.useEffect(() => {
		if (
			auth &&
			sessionState === 'active' &&
			accessTokenDTO.access_token != null &&
			!!router?.asPath &&
			!router?.asPath?.includes('/[')
		)
			sendMetaInformationToServer();
	}, [router, router.asPath]);

	return <>{children}</>;
};

export default MetaWrapper;
