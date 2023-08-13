export default (respond) => {
  const parser = new DOMParser();
  const DOM = parser.parseFromString(respond.data.contents, 'text/xml');
  return console.log(DOM);
};
