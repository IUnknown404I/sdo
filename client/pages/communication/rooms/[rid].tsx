import { useRouter } from 'next/router';
import RoomPage from '../../../components/pages/communication/rooms/RoomPage';

const ChatRoomPage = () => {
	const router = useRouter();
	return <RoomPage rid={router.query.rid as string} />;
};

// export async function getStaticPaths() {
// 	const rids = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/chats/rids`).then(res => res.data as string[]);
// 	return {
// 		paths: [
// 			...rids.map(rid => ({
// 				params: {
// 					rid,
// 				},
// 			})),
// 		],
// 		fallback: true,
// 	};
// }

// export async function getStaticProps(params: { params: { rid: string } }) {
// 	return {
// 		props: {
// 			rid: params.params.rid,
// 		},
// 		revalidate: 10,
// 	};
// }

export default ChatRoomPage;
