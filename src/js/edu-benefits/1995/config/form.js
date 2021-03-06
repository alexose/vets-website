import _ from 'lodash/fp';

import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';

import { validateMatch } from '../../../common/schemaform/validation';
import {
  benefitsLabels,
  educationTypeLabels,
  bankAccountChangeLabels,
  preferredContactMethodLabels,
  transformForSubmit,
  enumToNames
} from '../helpers';

import * as bankAccount from '../../../common/schemaform/definitions/bankAccount';
import * as fullName from '../../../common/schemaform/definitions/fullName';
import * as ssn from '../../../common/schemaform/definitions/ssn';
import * as date from '../../../common/schemaform/definitions/date';
import * as dateRange from '../../../common/schemaform/definitions/dateRange';
import * as phone from '../../../common/schemaform/definitions/phone';
import * as address from '../../../common/schemaform/definitions/address';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ServicePeriodView from '../components/ServicePeriodView';

const {
  vaFileNumber,
  benefit,
  toursOfDuty,
  civilianBenefitsAssistance,
  educationObjective,
  nonVaAssistance,
  reasonForChange,
  email,
  bankAccountChange
} = fullSchema1995.properties;

const {
  educationType,
  preferredContactMethod,
  serviceBefore1977,
  school
} = fullSchema1995.definitions;

const formConfig = {
  urlPrefix: '/1995/',
  submitUrl: '/v0/education_benefits_claims/1995',
  trackingPrefix: 'edu-1995-',
  transformForSubmit,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    educationType,
    preferredContactMethod,
    serviceBefore1977,
    date: date.schema,
    dateRange: dateRange.schema
  },
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-1995',
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          initialData: {},
          uiSchema: {
            veteranFullName: fullName.uiSchema,
            veteranSocialSecurityNumber: _.assign(ssn.uiSchema, {
              'ui:required': (form) => !form['view:noSSN']
            }),
            'view:noSSN': {
              'ui:title': 'I don’t have a Social Security number',
              'ui:options': {
                hideOnReviewIfFalse: true
              }
            },
            vaFileNumber: {
              'ui:required': (form) => !!form['view:noSSN'],
              'ui:title': 'File number',
              'ui:errorMessages': {
                pattern: 'File number must be 8 digits and (optionally) start with C'
              },
              'ui:options': {
                expandUnder: 'view:noSSN'
              }
            }
          },
          schema: {
            type: 'object',
            required: ['veteranFullName'],
            properties: {
              veteranFullName: fullName.schema,
              veteranSocialSecurityNumber: ssn.schema,
              'view:noSSN': {
                type: 'boolean'
              },
              vaFileNumber
            }
          }
        },
      }
    },
    benefitSelection: {
      title: 'Benefit Selection',
      pages: {
        benefitSelection: {
          title: 'Benefit selection',
          path: 'benefits-eligibility/benefit-selection',
          initialData: {},
          uiSchema: {
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Which benefit are you transfering to a new location?'
            }
          },
          schema: {
            type: 'object',
            required: ['benefit'],
            properties: {
              benefit: _.assign(benefit, {
                enumNames: enumToNames(benefit.enum, benefitsLabels)
              })
            }
          }
        }
      }
    },
    militaryService: {
      title: 'Military History',
      pages: {
        servicePeriods: {
          path: 'military-history/service-periods',
          title: 'Service periods',
          initialData: {
          },
          uiSchema: {
            toursOfDuty: {
              'ui:title': 'Service periods',
              'ui:description': 'Please record any new periods of service since your last application.',
              'ui:options': {
                itemName: 'Service Period',
                viewField: ServicePeriodView,
                hideTitle: true
              },
              items: {
                serviceBranch: {
                  'ui:title': 'Branch of service'
                },
                dateRange: dateRange.uiSchema(
                  'Start of service period',
                  'End of service period',
                  'End of service must be after start of service'
                )
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              toursOfDuty
            }
          }
        },
        militaryHistory: {
          title: 'Military history',
          path: 'military-history/military-service',
          initialData: {},
          uiSchema: {
            'view:hasServiceBefore1978': {
              'ui:title': 'Do you have any periods of service that began before 1978?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:hasServiceBefore1978': {
                type: 'boolean'
              }
            }
          }
        },
        contributions: {
          title: 'Contributions',
          path: 'military-history/contributions',
          initialData: {},
          uiSchema: {

            civilianBenefitsAssistance: {
              'ui:title': 'I am receiving benefits from the U.S. Government as a civilian employee during the same time as I am seeking benefits from VA'
            }
          },
          schema: {
            type: 'object',
            properties: {
              civilianBenefitsAssistance
            }
          }
        }
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        newSchool: {
          path: 'school-selection/new-school',
          title: 'School, university, program, or training facility you want to attend',
          initialData: {
            newSchool: {
              address: {}
            }
          },
          uiSchema: {
            'ui:title': 'School, university, program, or training facility you want to attend',
            educationType: {
              'ui:title': 'Type of education or training'
            },
            newSchool: {
              name: {
                'ui:title': 'Name of school, university, or training facility'
              },
              address: address.uiSchema()
            },
            educationObjective: {
              'ui:title': 'Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)',
              'ui:widget': 'textarea'
            },
            nonVaAssistance: {
              'ui:title': 'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              educationType: _.assign(educationType, {
                enumNames: enumToNames(educationType.enum, educationTypeLabels)
              }),
              newSchool: _.set('properties.address', address.schema(), school),
              educationObjective,
              nonVaAssistance
            }
          }
        },
        oldSchool: {
          path: 'school-selection/old-school',
          title: 'School, university, program, or training facility you last attended',
          initialData: {
            oldSchool: {
              address: {}
            }
          },
          uiSchema: {
            'ui:title': 'School, university, program, or training facility you last attended',
            oldSchool: {
              name: {
                'ui:title': 'Name of school, university, or training facility'
              },
              address: address.uiSchema()
            },
            trainingEndDate: _.merge(date.uiSchema, { 'ui:title': 'When did you stop taking classes or participating in the training program?' }),
            reasonForChange: {
              'ui:title': 'Why did you stop taking classes or participating in the training program?'
            }
          },
          schema: {
            type: 'object',
            properties: {
              oldSchool: _.set('properties.address', address.schema(), school),
              trainingEndDate: date.schema,
              reasonForChange
            }
          }
        }
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: {
          title: 'Contact information',
          path: 'personal-information/contact-information',
          initialData: {},
          uiSchema: {
            preferredContactMethod: {
              'ui:title': 'How would you like to be contacted if VA has questions about your application?',
              'ui:widget': 'radio'
            },
            veteranAddress: address.uiSchema(),
            'view:otherContactInfo': {
              'ui:title': 'Other contact information',
              'ui:description': 'Please enter as much contact information as possible so VA can get in touch with you, if necessary.',
              'ui:validations': [
                validateMatch('email', 'view:confirmEmail')
              ],
              email: {
                'ui:title': 'Email address'
              },
              'view:confirmEmail': {
                'ui:title': 'Re-enter email address',
                'ui:options': {
                  hideOnReview: true
                }
              },
              homePhone: _.assign(phone.uiSchema('Primary telephone number'), {
                'ui:required': (form) => form.preferredContactMethod === 'phone'
              }),
              mobilePhone: phone.uiSchema('Mobile telephone number')
            }
          },
          schema: {
            type: 'object',
            properties: {
              preferredContactMethod: _.assign(preferredContactMethod, {
                enumNames: enumToNames(preferredContactMethod.enum, preferredContactMethodLabels)
              }),
              veteranAddress: address.schema(true),
              'view:otherContactInfo': {
                type: 'object',
                required: ['email', 'view:confirmEmail'],
                properties: {
                  email,
                  'view:confirmEmail': email,
                  homePhone: phone.schema,
                  mobilePhone: phone.schema
                }
              }
            }
          }
        },
        dependents: {
          title: 'Dependents',
          path: 'personal-information/depedents',
          initialData: {},
          depends: {
            militaryHistory: {
              data: {
                'view:hasServiceBefore1978': true
              }
            }
          },
          uiSchema: {
            serviceBefore1977: {
              married: {
                'ui:title': 'Are you currently married?',
                'ui:widget': 'yesNo'
              },
              haveDependents: {
                'ui:title': 'Do you have any children who are under age 18? Or do you have any children who are over age 18 but under 23, not married, and attending school? Or do you have any children of any age who are permanently disabled for mental or physical reasons?',
                'ui:widget': 'yesNo'
              },
              parentDependent: {
                'ui:title': 'Do you have a parent who is dependent on your financial support?',
                'ui:widget': 'yesNo'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              serviceBefore1977
            }
          }
        },
        directDeposit: {
          title: 'Direct deposit',
          path: 'personal-information/direct-deposit',
          initialData: {},
          uiSchema: {
            bankAccountChange: {
              'ui:title': 'Do you want to update, start, or stop using direct deposit?',
              'ui:widget': 'radio'
            },
            bankAccount: bankAccount.uiSchema
          },
          schema: {
            type: 'object',
            properties: {
              bankAccountChange: _.assign(bankAccountChange, {
                enumNames: enumToNames(bankAccountChange.enum, bankAccountChangeLabels)
              }),
              bankAccount: bankAccount.schema
            }
          }
        }
      }
    }
  }
};

export default formConfig;
