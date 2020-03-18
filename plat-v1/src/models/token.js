export default {
  state: localStorage.getItem('TOKEN'),
  reducers: {
    set(_, { token, remember = false }) {
      if (remember) {
        localStorage.setItem('TOKEN', token);
      }
      // TODO: axios.defaults.headers.common[] = token
      return token;
    },
    clean() {
      localStorage.removeItem('TOKEN');
      return '';
    },
  },
};
