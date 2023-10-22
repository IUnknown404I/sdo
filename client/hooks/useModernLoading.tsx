import { useMemo, useState } from 'react';
import ModernLoader, { ModernLoaderI } from '../components/utils/loaders/ModernLoader';

/**
 * @IUnknown404I returns related state with state-changer and the Element.
 * @param props all props for the Vortex Loader except 'loading' state.
 * @returns Vortex Loader, loading state and set state method.
 */
const useModernLoading = (
	props: Omit<ModernLoaderI, 'loading'>,
): { Loader: JSX.Element; loading: boolean; setLoading: Function } => {
	const [loading, setLoading] = useState<boolean>(false);

	const Loader: JSX.Element = useMemo(() => {
		return <ModernLoader loading={loading} {...props} />;
	}, [loading]);
	return { Loader, loading, setLoading };
};

export default useModernLoading;
