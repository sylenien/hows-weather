import axios from 'axios';

const monthNames = [
  'Янв.',
  'Фев.',
  'Марта',
  'Апр.',
  'Мая',
  'Июня',
  'Июля',
  'Авг.',
  'Сен.',
  'Окт.',
  'Нояб.',
  'Дек.',
];

const getDate = ({ applicable_date }) => {
  const monthNum = parseInt(applicable_date.slice(-5, -4));
  const month = monthNames[monthNum-1];
  const day = parseInt(applicable_date.slice(-2));
  return `${day} ${month}`
}

export default function setWeather(pos) {
  return function(dispatch) {
    dispatch({ type: 'CHANGE_APP_STATE', payload: 'Ищем город'})
    console.log('hello1');
    axios.get(`http://localhost:8085/api/city?lat=${pos.latitude}&long=${pos.longitude}`)
      .then(r => {
        console.log(r)
        const cityId = r.data[0].woeid;
        dispatch({ type: 'CHANGE_CITY', payload: r.data[0].title })
        dispatch({ type: 'CHANGE_APP_STATE', payload: 'Спрашиваем погоду у местных'})
        axios.get(`http://localhost:8085/api/weather?city=${cityId}`)
          .then(r => {
            const consolidated_weather = r.data;
            const weatherList = consolidated_weather.map(day => {
              day.applicable_date = getDate(day)
              return day;
            }) 
            console.log(consolidated_weather, weatherList);
            dispatch({ type: 'CHANGE_PROGRESS_STATE', payload: false });
            dispatch({ type: 'CHANGE_FINISH_STATE', payload: true });
            dispatch({ type: 'SET_WEATHER', payload: weatherList });
          })
          .catch(e => {
            dispatch({ type: 'CHANGE_PROGRESS_STATE', payload: false });
            dispatch({ type: 'CHANGE_FINISH_STATE', payload: false });
          });
      })
      .catch(e => {
        dispatch({ type: 'CHANGE_PROGRESS_STATE', payload: false });
        dispatch({ type: 'CHANGE_FINISH_STATE', payload: false });
      });
  };
}

// export default function getBreeds() {
//   return function(dispatch, getState) {
//     const { animal } = getState();
//     petfinder.breed.list({ animal }).then(data => {
//       let breeds = [];
//       if (
//         data.petfinder &&
//         data.petfinder.breeds &&
//         Array.isArray(data.petfinder.breeds.breed)
//       ) {
//         breeds = data.petfinder.breeds.breed;
//       }
//       dispatch({ type: "CHANGE_BREEDS", payload: breeds });
//     });
//   };
// }