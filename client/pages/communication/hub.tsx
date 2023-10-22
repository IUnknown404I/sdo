import Head from 'next/head';
import CommunicationHub from '../../components/pages/communication/hub/CommunicationHub';
import { Layout } from '../../layout/Layout';

const CommunicationHubPage = () => {
	return (
		<>
			<Head>
				<title>Мессенджер системы</title>
				<meta name='description' content='Мессенджер системы' />
				<meta name='robots' content='index, follow' />
			</Head>

			<Layout>
				<CommunicationHub />
			</Layout>
		</>
	);
};

export const getServerSideProps = async () => {
	return {
		props: {},
	};
};

export default CommunicationHubPage;
