import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';

import FingerprintScanner from 'react-native-fingerprint-scanner';
import styles from './FingerprintPopup.component.styles';
import ShakingText from './ShakingText.component';

class BiometricPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined
    };

    this.description = null;
  }

  componentDidMount() {
    if (this.requiresLegacyAuthentication()) {
      this.authLegacy();
    } else {
      this.authCurrent();
    }
  }

  componentWillUnmount = () => {
    FingerprintScanner.release();
  }

  requiresLegacyAuthentication() {
    return Platform.Version < 23;
  }

  authCurrent() {
    FingerprintScanner
      .authenticate({ description: this.props.description || 'Log in with Biometrics' })
      .then(() => {
        this.props.handlePopupDismissedLegacy();
       //Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
       this.props.bioMetricParseResult("100","Authenticated successfully")
      })
      .catch((error) => {
       // Alert.alert('Fingerprint Authentication', error.message);
       this.props.handlePopupDismissedLegacy();
        this.props.bioMetricParseResult("102",error.message)
      });
  }

  authLegacy() {
    FingerprintScanner
      .authenticate({ onAttempt: this.handleAuthenticationAttemptedLegacy })
      .then(() => {
        this.props.handlePopupDismissedLegacy();
       //Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
       this.props.bioMetricParseResult("100","Authenticated successfully")
      })
      .catch((error) => {
        this.setState({ errorMessageLegacy: error.message, biometricLegacy: error.biometric });
        this.description.shake();
        this.props.handlePopupDismissedLegacy();
        this.props.bioMetricParseResult("102",error.message)
      });
  }

  handleAuthenticationAttemptedLegacy = (error) => {
    this.setState({ errorMessageLegacy: error.message });
    this.description.shake();
    this.props.bioMetricParseResult("102",error.message)
  };

  renderLegacy() {
    const { errorMessageLegacy, biometricLegacy } = this.state;
    const { style, handlePopupDismissedLegacy } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>

          <Image
            style={styles.logo}
            source={require('../assets/icons/finger_print.png')}
          />

          <Text style={styles.heading}>
            Biometric{'\n'}Authentication
          </Text>
          <ShakingText
            ref={(instance) => { this.description = instance; }}
            style={styles.description(!!errorMessageLegacy)}>
            {errorMessageLegacy || `Scan your ${biometricLegacy} on the\ndevice scanner to continue`}
          </ShakingText>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissedLegacy}
          >
            <Text style={styles.buttonText}>
              BACK TO MAIN
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }


  render = () => {
    if (this.requiresLegacyAuthentication()) {
      return this.renderLegacy();
    }

    // current API UI provided by native BiometricPrompt
    return null;
  }
}

BiometricPopup.propTypes = {
  description: PropTypes.string,
  handlePopupDismissedLegacy: PropTypes.func,
  // style: ViewPropTypes.style,
};

export default BiometricPopup;