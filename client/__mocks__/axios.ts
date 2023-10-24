const mockAxios = jest.genMockFromModule('axios');

// this is the key to fix the axios.create() undefined error!
(mockAxios as any).create = jest.fn(() => mockAxios);

export default mockAxios;
