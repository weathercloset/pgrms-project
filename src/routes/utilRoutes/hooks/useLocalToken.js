import { useLocalStorage } from '../../../hooks';

const LOCAL_STORAGE_KEY = 'token';

export default () => useLocalStorage(LOCAL_STORAGE_KEY, '');
