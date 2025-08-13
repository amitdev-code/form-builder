import React, { Fragment } from 'react';

export const ResultSlide: React.FC = () => {
  return (
    <Fragment>
        <div className="min-h-[525px] max-w-6xl bg-white border border-gray-300 flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Result Slide</h3>
                <p className="text-sm text-gray-500">This is the result slide</p>
            </div>
        </div>
    </Fragment>
  );
};
