export default () => {
  const input = document.querySelector('#RssInput');
  input.focus();
  const form = document.querySelector('[name="Rss manager form"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(input.value);
    input.value = '';
  });
};
