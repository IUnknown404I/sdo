import React from 'react';
import { rtkApi } from '../redux/api';
import { useTypedSelector } from '../redux/hooks';

export default (props: { children: JSX.Element | JSX.Element[] }): JSX.Element | JSX.Element[] => {
	const auth = useTypedSelector(state => state.auth.state);
	const { refetch: personalDataRefetch } = rtkApi.usePersonalQuery('', {
		refetchOnMountOrArgChange: true,
		pollingInterval: 5 * 6e4,
	});
	const { refetch: metadataRefetch } = rtkApi.useMetaQuery(undefined, {
		refetchOnMountOrArgChange: true,
		pollingInterval: 5 * 6e4,
	});

	React.useEffect(() => {
		if (auth) {
			personalDataRefetch();
			metadataRefetch();
		}
	}, [auth]);

	return props.children;
};
