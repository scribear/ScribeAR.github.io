import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
     set_screenWidth,
     set_screenHeight
} from '../../redux/actions';

const mapStateToProps = (state) => ({
     lockScreen: state.lockScreen
});

const screenWidth = (state) => state.screenWidth;
const screenHeight = (state) => state.screenHeight;

/*
eventListener for scren resize when the setting is off?
update css from this doc? should affect the app itself
componentdidmount vs compoenentdidupdate?
*/

class Sizing extends React.component {
     componentDidMount() {
          const screenWidth = (state) => state.screenWidth;
          const screenHeight = (state) => state.screenHeight;
          dispatch(set_screenWidth(window.innerWidth));
          dispatch(set_screenWidth(window.innerHeight));
     }

     componentDidUpdate(prevProps, prevState, snapshot) {
          if (this.props.lockScreen && !prevProps.lockScreen) {

          }
     }
}

Sizing.propTypes = {
     lockScreen: PropTypes.bool
};

Sizing = connect(mapStateToProps)(Sizing);

export default Sizing
