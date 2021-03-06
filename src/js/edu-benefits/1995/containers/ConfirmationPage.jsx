import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';
import { focusElement } from '../../../common/utils/helpers';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    focusElement('.edu-page-title');
    scrollToTop();
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const form = this.props.form;
    const response = this.props.form.submission.response;
    const name = form.veteranInformation.data.veteranFullName;
    const benefit = form.benefitSelection.data.benefitsSelected;

    return (
      <div className="edu-benefits-submit-success">
        <h3 className="edu-page-title">Claim received</h3>
        <p>Normally processed within <strong>30 days</strong></p>
        <p>
          VA may contact you for more information or documents.<br/>
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4>Education Benefit Claim <span className="additional">(Form 22-1995)</span></h4>
          <span>for {name.first} {name.middle} {name.last} {name.suffix}</span>

          <ul className="claim-list">
            <li>
              <strong>Benefit claimed</strong><br/>
              {benefit}
            </li>
            <li>
              <strong>Confirmation number</strong><br/>
              <span>{response.confirmation}</span>
            </li>
            <li>
              <strong>Date received</strong><br/>
              <span>{moment(form.submission.date).format('MMM D, YYYY')}</span>
            </li>
            <li>
              <strong>Your claim was sent to</strong><br/>
              <address className="edu-benefits-pre">{response.address}</address>
            </li>
          </ul>
        </div>
        <div className="inset secondary expandable">
          <ExpandingGroup open={this.state.isExpanded} showPlus>
            <div onClick={this.handleClick} className="clickable">
              <b>No documents required at this time</b>
            </div>
            <div>
              <p>In the future, you might need:</p>
              <ul>
                <li>Your reserve kicker</li>
                <li>Documentation of additional contributions that would increase your monthly benefits.</li>
              </ul>
              <p>Documents can be uploaded using the <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/account%252">GI Bill site</a>.</p>
            </div>
          </ExpandingGroup>
        </div>
        <p>Need help? If you have questions, call 1-888-442-4551 (1-888-GI-BILL-1) from 8:00 a.m. - 7:00 p.m. ET Mon - Fri.</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };

