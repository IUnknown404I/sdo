import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import ClassicLoader, { ClassicLoaderI } from '../components/utils/loaders/ClassicLoader';

/**
 * @IUnknown404I Hook for the ClassicLoader initialization.
 * @param props as interface for the <ClassicLoader/> element.
 * @returns Loader element, current boolean state and dispatch state function.
 */
const useLoading = (
	props: ClassicLoaderI,
): { Loader: JSX.Element; state: boolean; setState: Dispatch<SetStateAction<boolean>> } => {
	const [state, setState] = useState<boolean>(false);
	const sxProps = { display: state ? 'inline' : 'none' };

	const Loader: JSX.Element = useMemo(() => {
		return <ClassicLoader sx={sxProps} {...props} />;
	}, [state]);
	return { Loader, state, setState };
};

export default useLoading;
