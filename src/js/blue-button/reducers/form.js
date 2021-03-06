import set from 'lodash/fp/set';
import { mapValues, forEach, reduce } from 'lodash';
import { reportTypes } from '../config';

// map of all reportTypes in form { reportTypeValue: boolean }
const reportTypeValues = reduce(reportTypes, (memo, v) => {
  forEach(v.children, c => {
    memo[c.value] = false; // eslint-disable-line no-param-reassign
  });
  return memo;
}, {});

const initialState = {
  dateOption: null,
  dateRange: {
    start: null,
    end: new Date().toISOString(),
  },
  reportTypes: reportTypeValues,
};

export default function disclaimer(state = initialState, action) {
  switch (action.type) {
    case 'START_DATE_CHANGED':
      return set('dateRange.start', action.date.toISOString(), state);
    case 'END_DATE_CHANGED':
      return set('dateRange.end', action.date.toISOString(), state);
    case 'DATE_OPTION_CHANGED':
      return set('dateOption', action.dateOption, state);
    case 'REPORT_TYPE_TOGGLED':
      return set(`reportTypes.${action.reportType}`, action.checked, state);
    case 'ALL_REPORTS_TOGGLED':
      return set('reportTypes', mapValues(state.reportTypes, () => action.checked), state);
    default:
      return state;
  }
}
