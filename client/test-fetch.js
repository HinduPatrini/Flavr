const axios = require('axios');

axios.get('http://localhost:5000/api/recipes/featured')
  .then(res => {
    console.log('SUCCESS:', res.data ? `Found ${res.data.recipes?.length} recipes` : 'No data');
  })
  .catch(err => {
    console.error('ERROR:', err.message);
    if (err.response) {
      console.error('STATUS:', err.response.status);
      console.error('DATA:', err.response.data);
    }
  });
