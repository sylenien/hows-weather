import { connect } from 'react-redux';
import ResultsComponent from '../components/Results';

const mapStateToProps = ({ weather, appState }) => ({
  weather,
  appState,
});

export default connect(mapStateToProps)(ResultsComponent);
