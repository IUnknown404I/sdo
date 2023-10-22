// @ts-nocheck

import React from 'react';
import ScromProvider, { withScorm } from 'react-scorm-provider';
import { checkProductionMode } from '../../../utils/utilityFunctions';


const ScromComponent = () => {
	return <>ScromEmbedded</>;
};

const ScromEnchancedComponent = withScorm()(ScromComponent);

const ScromEmbedded = () => {
	React.useEffect(() => {
		window['API'] = { url: 'http://localhost:4444' };

		return () => (window['API'] = undefined);
	}, []);

	return (
		<>
			<ScromProvider version='1.2' debug={!checkProductionMode()}>
				<ScromEnchancedComponent />
			</ScromProvider>
		</>
	);
};

export default ScromEmbedded;
