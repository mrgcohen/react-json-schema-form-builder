// @flow

import * as React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import {
  faArrowUp,
  faArrowDown,
  faPencilAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import FBCheckbox from './checkbox/FBCheckbox';
import Collapse from './Collapse/Collapse';
import CardModal from './CardModal';
import CardGeneralParameterInputs from './CardGeneralParameterInputs';
import Add from './Add';
import FontAwesomeIcon from './FontAwesomeIcon';
import Tooltip from './Tooltip';
import type { Parameters, Mods, FormInput } from './types';

const useStyles = createUseStyles({
  cardEntries: {
    'border-bottom': '1px solid gray',
    margin: '.5em 1.5em 0 1.5em',
    '& h5': {
      color: 'black',
      'font-size': '14px',
      'font-weight': 'bold',
    },
    '& .card-entry': {
      display: 'inline-block',
      margin: 0,
      width: '50%',
      'text-align': 'left',
      padding: '0.5em',
    },
    '& input': {
      border: '1px solid gray',
      'border-radius': '4px',
    },
    '& .card-category-options': {
      padding: '.5em',
    },
    '& .card-select': {
      border: '1px solid var(--gray)',
      'border-radius': '4px',
    },
    '& .card-array': {
      '& .fa-plus-square': { display: 'none' },
      '& .section-entries': { '& .fa-plus-square': { display: 'initial' } },
    },
    '& .card-enum': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: 'var(--light-gray)',
      textAlign: 'left',
      padding: '1em',
      '& h3': { fontSize: '16px', margin: '0 0 .5em 0' },
      '& label': { color: 'black', fontSize: '14px' },
      '& .card-enum-header': {
        marginTop: '0.5em',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        '& h5': { width: '50%', fontWeight: 'bold', fontSize: '14px' },
      },
      '& .fa': { cursor: 'pointer' },
    },
  },
  cardInteractions: {
    margin: '.5em 1.5em',
    textAlign: 'left',
    '& .fa': {
      marginRight: '1em',
      borderRadius: '4px',
      padding: '.25em',
      height: '25px',
      width: '25px',
    },
    '& .fa-arrow-up, .fa-arrow-down': { marginRight: '.5em' },
    '& .fa-trash': { border: '1px solid #DE5354', color: '#DE5354' },
    '& .fb-checkbox': { display: 'inline-block' },
    '& .interactions-left, & .interactions-right': {
      display: 'inline-block',
      width: '48%',
      margin: '0 auto',
    },
    '& .interactions-left': { textAlign: 'left' },
    '& .interactions-right': { textAlign: 'right' },
  },
});

export default function Card({
  componentProps,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  TypeSpecificParameters,
  addElem,
  cardOpen,
  setCardOpen,
  allFormInputs,
  mods,
}: {
  componentProps: {
    [string]: string | number | boolean | Array<string | number>,
    path: string,
  },
  onChange: ({ [string]: any }) => void,
  onDelete?: () => void,
  onMoveUp?: () => void,
  onMoveDown?: () => void,
  TypeSpecificParameters: React.AbstractComponent<{
    parameters: Parameters,
    onChange: (newParams: Parameters) => void,
  }>,
  addElem?: (choice: string) => void,
  cardOpen: boolean,
  setCardOpen: (newState: boolean) => void,
  mods?: Mods,
  allFormInputs: { [string]: FormInput },
}) {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Collapse
        isOpen={cardOpen}
        toggleCollapse={() => setCardOpen(!cardOpen)}
        title={
          <React.Fragment>
            <span onClick={() => setCardOpen(!cardOpen)} className='label'>
              {componentProps.title || componentProps.name}{' '}
              {componentProps.parent ? (
                <Tooltip
                  text={`Depends on ${(componentProps.parent: any)}`}
                  id={`${componentProps.path}_parentinfo`}
                  type='alert'
                />
              ) : (
                ''
              )}
              {componentProps.$ref !== undefined ? (
                <Tooltip
                  text={`Is an instance of pre-configured component ${(componentProps.$ref: any)}`}
                  id={`${componentProps.path}_refinfo`}
                  type='alert'
                />
              ) : (
                ''
              )}
            </span>
            <span className='arrows'>
              <span id={`${componentProps.path}_moveupbiginfo`}>
                <FontAwesomeIcon
                  icon={faArrowUp}
                  onClick={() => (onMoveUp ? onMoveUp() : {})}
                />
              </span>
              <UncontrolledTooltip
                placement='top'
                target={`${componentProps.path}_moveupbiginfo`}
              >
                Move form element up
              </UncontrolledTooltip>
              <span id={`${componentProps.path}_movedownbiginfo`}>
                <FontAwesomeIcon
                  icon={faArrowDown}
                  onClick={() => (onMoveDown ? onMoveDown() : {})}
                />
              </span>
              <UncontrolledTooltip
                placement='top'
                target={`${componentProps.path}_movedownbiginfo`}
              >
                Move form element down
              </UncontrolledTooltip>
            </span>
          </React.Fragment>
        }
        className={`card-container ${
          componentProps.dependent ? 'card-dependent' : ''
        } ${componentProps.$ref === undefined ? '' : 'card-reference'}`}
      >
        <div className={classes.cardEntries}>
          <CardGeneralParameterInputs
            parameters={(componentProps: any)}
            onChange={onChange}
            allFormInputs={allFormInputs}
            mods={mods}
          />
        </div>
        <div className={classes.cardInteractions}>
          <span id={`${componentProps.path}_editinfo`}>
            <FontAwesomeIcon
              icon={faPencilAlt}
              onClick={() => setModalOpen(true)}
            />
          </span>
          <UncontrolledTooltip
            placement='top'
            target={`${componentProps.path}_editinfo`}
          >
            Additional configurations for this form element
          </UncontrolledTooltip>
          <span id={`${componentProps.path}_trashinfo`}>
            <FontAwesomeIcon icon={faTrash} onClick={onDelete || (() => {})} />
          </span>
          <UncontrolledTooltip
            placement='top'
            target={`${componentProps.path}_trashinfo`}
          >
            Delete form element
          </UncontrolledTooltip>
          <FBCheckbox
            onChangeValue={() =>
              onChange({
                ...componentProps,
                required: !componentProps.required,
              })
            }
            isChecked={!!componentProps.required}
            label='Required'
            id={`${
              typeof componentProps.path === 'string'
                ? componentProps.path
                : 'card'
            }_required`}
          />
        </div>
        <CardModal
          componentProps={componentProps}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onChange={(newComponentProps: {
            [string]: string | number | boolean | Array<string | number>,
          }) => {
            onChange(newComponentProps);
          }}
          TypeSpecificParameters={TypeSpecificParameters}
        />
      </Collapse>
      {addElem ? (
        <Add
          name={`${componentProps.path}`}
          addElem={(choice: string) => addElem(choice)}
        />
      ) : (
        ''
      )}
    </React.Fragment>
  );
}
