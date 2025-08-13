import { Icon } from '@iconify/react';
import React, { Fragment } from 'react';

export const CanvasStickeyHeader: React.FC = () => {
    return (
        <Fragment>
            {/* Navigation Strip */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-1 flex items-center justify-between z-30">
                {/* Left Side - Previous Arrow */}
                <button className="rounded-lg transition-colors cursor-pointer">
                    <Icon icon="material-symbols:arrow-back" className="w-5 h-5 text-gray-600" />
                </button>

                {/* Center - Undo/Redo */}
                <div className="flex items-center space-x-2">
                    <button className="rounded-lg transition-colors cursor-pointer">
                        <Icon icon="material-symbols:undo" className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="rounded-lg transition-colors cursor-pointer">
                        <Icon icon="material-symbols:redo" className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Right Side - Next Arrow */}
                <button className="rounded-lg transition-colors cursor-pointer">
                    <Icon icon="material-symbols:arrow-forward" className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </Fragment>
    );
};
