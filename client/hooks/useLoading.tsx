import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import ClassicLoader, { ClassicLoaderI } from '../components/utils/loaders/ClassicLoader';

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
