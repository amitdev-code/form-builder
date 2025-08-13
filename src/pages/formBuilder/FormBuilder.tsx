import React, { Fragment } from 'react';
import { FormBuilderCanvas } from '../../components/FormBuilderComp/Canvas/FormBuilderCanvas';

export const FormBuilder: React.FC = () => {
  return (
   <Fragment>
    <div className='w-full mt-8'>
        <FormBuilderCanvas />
    </div>
   </Fragment>
  );
}; 