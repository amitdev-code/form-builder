import React, { Fragment, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setNavigationLayout,
    setBrandLogo,
    setHeaderNavMenu,
    setFooterNavMenu,
    addHeaderNavItem,
    addFooterNavItem,
    removeHeaderNavItem,
    removeFooterNavItem,
    updateHeaderNavItem,
    updateFooterNavItem,
    updateHeaderNavItems,
    updateFooterNavItems,
    setShowWebezeBranding,
    setFontFamily
} from '../../../../store/slices/formBuilderSlice';
import type { RootState } from '../../../../store/store';
import { Icon } from '@iconify/react';
import Select from '../../../ui/general/select/Select';

interface NavigationItem {
    id: string;
    name: string;
    url: string;
}

export const FormSettings: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState('navigation');
    const [uploadError, setUploadError] = useState<string>('');
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();
    const { formSettings } = useSelector((state: RootState) => state.formBuilder);
    const { brandLogo, showWebezeBranding, fontFamily, headerNavMenu, footerNavMenu, headerNavMenuItems, footerNavMenuItems, addedHeaderItems, addedFooterItems } = formSettings.general;
    const navigationLayout = formSettings.navigation.navigationLayout;

    const settingsTabs = [
        { id: 'navigation', label: 'Navigation' },
        { id: 'general', label: 'General' }
    ];

    // Popular Google Fonts - 30 fonts
    const fontFamilyOptions = [
        { value: 'Inter', label: 'Inter' },
        { value: 'Roboto', label: 'Roboto' },
        { value: 'Open Sans', label: 'Open Sans' },
        { value: 'Lato', label: 'Lato' },
        { value: 'Poppins', label: 'Poppins' },
        { value: 'Montserrat', label: 'Montserrat' },
        { value: 'Source Sans Pro', label: 'Source Sans Pro' },
        { value: 'Nunito', label: 'Nunito' },
        { value: 'Ubuntu', label: 'Ubuntu' },
        { value: 'Raleway', label: 'Raleway' },
        { value: 'PT Sans', label: 'PT Sans' },
        { value: 'Noto Sans', label: 'Noto Sans' },
        { value: 'Work Sans', label: 'Work Sans' },
        { value: 'Merriweather', label: 'Merriweather' },
        { value: 'Playfair Display', label: 'Playfair Display' },
        { value: 'Georgia', label: 'Georgia' },
        { value: 'Times New Roman', label: 'Times New Roman' },
        { value: 'Arial', label: 'Arial' },
        { value: 'Helvetica', label: 'Helvetica' },
        { value: 'Verdana', label: 'Verdana' },
        { value: 'Tahoma', label: 'Tahoma' },
        { value: 'Trebuchet MS', label: 'Trebuchet MS' },
        { value: 'Impact', label: 'Impact' },
        { value: 'Comic Sans MS', label: 'Comic Sans MS' },
        { value: 'Courier New', label: 'Courier New' },
        { value: 'Lucida Console', label: 'Lucida Console' },
        { value: 'Palatino', label: 'Palatino' },
        { value: 'Garamond', label: 'Garamond' },
        { value: 'Bookman', label: 'Bookman' },
        { value: 'Avant Garde', label: 'Avant Garde' },
        { value: 'Arial Black', label: 'Arial Black' },
        { value: 'Century Gothic', label: 'Century Gothic' }
    ];

    const layoutOptions = [
        { id: 'bottom', label: 'Bottom Navigation', image: '/images/layouts/btn-layout/btn-layout-1.png' },
        { id: 'floating', label: 'Floating Navigation', image: '/images/layouts/btn-layout/btn-layout-2.png' }
    ];

    const handleLayoutSelect = (layoutId: 'bottom' | 'floating') => {
        dispatch(setNavigationLayout(layoutId));
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setUploadError(''); // Clear previous errors

        if (!file) {
            return;
        }

        // Check file type
        if (file.type !== 'image/png') {
            setUploadError('Please select a PNG image file.');
            return;
        }

        // Check file size (1MB = 1024 * 1024 bytes)
        const maxSize = 1024 * 1024; // 1MB in bytes
        if (file.size > maxSize) {
            setUploadError('File size must be less than 1MB.');
            return;
        }

        // File is valid, create URL and update store
        const imageUrl = URL.createObjectURL(file);
        dispatch(setBrandLogo(imageUrl));
        console.log('Logo uploaded:', file);
        // TODO: Handle logo upload to server
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleHeaderNavToggle = () => {
        const newHeaderNavMenu = !headerNavMenu;
        dispatch(setHeaderNavMenu(newHeaderNavMenu));

        // If turning on and no items exist, add an empty item
        if (newHeaderNavMenu && headerNavMenuItems.length === 0) {
            const emptyItem: NavigationItem = {
                id: Date.now().toString(),
                name: '',
                url: ''
            };
            dispatch(addHeaderNavItem(emptyItem));
        }
    };

    const handleFooterNavToggle = () => {
        const newFooterNavMenu = !footerNavMenu;
        dispatch(setFooterNavMenu(newFooterNavMenu));

        // If turning on and no items exist, add an empty item
        if (newFooterNavMenu && footerNavMenuItems.length === 0) {
            const emptyItem: NavigationItem = {
                id: Date.now().toString(),
                name: '',
                url: ''
            };
            dispatch(addFooterNavItem(emptyItem));
        }
    };

    const updateHeaderNavItemHandler = (itemId: string, field: 'name' | 'url', value: string) => {
        dispatch(updateHeaderNavItem({ id: itemId, [field]: value }));
    };

    const updateFooterNavItemHandler = (itemId: string, field: 'name' | 'url', value: string) => {
        dispatch(updateFooterNavItem({ id: itemId, [field]: value }));
    };

    const getEmptyHeaderItem = () => headerNavMenuItems[0];
    const getEmptyFooterItem = () => footerNavMenuItems[0];

    const addHeaderNavItemHandler = () => {
        // Use the first item (the one that was auto-added when toggle was turned on)
        const firstItem = getEmptyHeaderItem();
        if (firstItem && firstItem.name && firstItem.url) {
            const newItem: NavigationItem = {
                id: Date.now().toString(),
                name: firstItem.name,
                url: firstItem.url
            };
            // Add to existing headerNavItems array
            dispatch(addHeaderNavItem(newItem));
            // Clear the first item
            dispatch(updateHeaderNavItem({ id: firstItem.id, name: '', url: '' }));
        }
    };

    const addFooterNavItemHandler = () => {
        // Use the first item (the one that was auto-added when toggle was turned on)
        const firstItem = getEmptyFooterItem();
        if (firstItem && firstItem.name && firstItem.url) {
            const newItem: NavigationItem = {
                id: Date.now().toString(),
                name: firstItem.name,
                url: firstItem.url
            };
            // Add to existing footerNavItems array
            dispatch(addFooterNavItem(newItem));
            // Clear the first item
            dispatch(updateFooterNavItem({ id: firstItem.id, name: '', url: '' }));
        }
    };

    // Drag and Drop functions for reordering
    const handleDragStart = (e: React.DragEvent, itemId: string) => {
        setDraggedItem(itemId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetItemId: string, isHeader: boolean) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === targetItemId) return;

        const items = isHeader ? headerNavMenuItems : footerNavMenuItems;

        const draggedIndex = items.findIndex(item => item.id === draggedItem);
        const targetIndex = items.findIndex(item => item.id === targetItemId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newItems = [...items];
        const [draggedItemData] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItemData);

        // Update the items in Redux using the new array update actions
        if (isHeader) {
            dispatch(updateHeaderNavItems(newItems));
        } else {
            dispatch(updateFooterNavItems(newItems));
        }
        setDraggedItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    return (
        <Fragment>
            <div className="flex flex-col h-full">
                {/* Tabs */}
                <div className="px-4 py-3">
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-6 min-w-max">
                            {settingsTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={`text-xs font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${selectedTab === tab.id
                                        ? 'text-primary border-primary'
                                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {selectedTab === 'navigation' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {layoutOptions.map((layout) => (
                                    <div key={layout.id}>
                                        <div
                                            className={`group cursor-pointer transition-all duration-200 hover:shadow-md`}
                                            onClick={() => handleLayoutSelect(layout.id as 'bottom' | 'floating')}
                                        >
                                            <div className={`relative bg-white rounded-lg overflow-hidden transition-all duration-200 ${navigationLayout === layout.id
                                                    ? 'border-2 border-primary shadow-md'
                                                    : 'border border-gray-200'
                                                }`}>
                                                <div className="h-20 bg-gray-50 flex items-center justify-center">
                                                    <img
                                                        src={layout.image}
                                                        alt={`Navigation Layout ${layout.id}`}
                                                        className="w-full h-full object-center"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`text-[10px] mt-2 text-center uppercase transition-colors ${navigationLayout === layout.id
                                                ? 'text-primary font-medium'
                                                : 'text-gray-700 group-hover:text-primary'
                                            }`}>
                                            {layout.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTab === 'general' && (
                        <div className="space-y-6">
                            {/* Show Branding Toggle */}
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold text-gray-900 uppercase">Show Branding</h3>
                                <button
                                    onClick={() => dispatch(setShowWebezeBranding(!showWebezeBranding))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showWebezeBranding ? 'bg-primary' : 'bg-gray-200'
                                        }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showWebezeBranding ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </button>
                            </div>

                            {/* Font Family Dropdown */}
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-gray-900 uppercase">Font Family</label>
                                <Select
                                    options={fontFamilyOptions}
                                    value={fontFamily}
                                    onChange={(value: string | number) => dispatch(setFontFamily(value as string))}
                                    placeholder="Select font family"
                                    size="sm"
                                    className="w-full"
                                />
                            </div>

                            {/* HEADER Section */}
                            <div>
                                <div className="w-full h-px bg-gray-200 mb-4"></div>
                                <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase">HEADER AND FOOTER</h3>

                                {/* Brand Logo Upload */}
                                <div className="flex items-center space-x-3 mb-4">
                                    {/* Logo Preview Square */}
                                    <div className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                        {brandLogo != '' ? (
                                            <img
                                                src={brandLogo}
                                                alt="Uploaded Brand Logo"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <>
                                                <img
                                                    src="/images/brandLogo/brandLogo.png"
                                                    alt="Brand Logo"
                                                    className="w-8 h-8 object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const fallback = target.nextElementSibling as HTMLElement;
                                                        if (fallback) fallback.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="w-8 h-8 flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Upload Button */}
                                    <div className="flex-1">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".png,image/png"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                        <button
                                            onClick={handleUploadClick}
                                            className="w-full px-3 py-2 text-[10px] font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors uppercase cursor-pointer"
                                        >
                                            Upload Brand Logo
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {uploadError && (
                                    <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                        {uploadError}
                                    </div>
                                )}

                                {/* File Requirements */}
                                <div className="mt-2 text-xs text-gray-500">
                                    PNG format only, max 1MB
                                </div>
                            </div>

                            {/* Header Navigation Section */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-semibold text-gray-900 uppercase">Show Header Navigation</h3>
                                    <button
                                        onClick={handleHeaderNavToggle}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${headerNavMenu ? 'bg-primary' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${headerNavMenu ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                {headerNavMenu && (
                                    <div className="space-y-3">
                                        {/* Input Form - Only show the first item */}
                                        {headerNavMenuItems.length > 0 && (
                                            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                                                <div className="text-[10px] text-gray-600 font-semibold uppercase">Add New Item</div>

                                                {/* Name Input */}
                                                <div>
                                                    <label className="block text-[10px] text-gray-600 mb-1 font-semibold uppercase">Name</label>
                                                    <input
                                                        type="text"
                                                        value={headerNavMenuItems[0].name}
                                                        onChange={(e) => updateHeaderNavItemHandler(headerNavMenuItems[0].id, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                                        placeholder="Enter navigation name"
                                                    />
                                                </div>

                                                {/* URL Input */}
                                                <div>
                                                    <label className="block text-[10px] text-gray-600 mb-1 font-semibold uppercase">URL</label>
                                                    <input
                                                        type="text"
                                                        value={headerNavMenuItems[0].url}
                                                        onChange={(e) => updateHeaderNavItemHandler(headerNavMenuItems[0].id, 'url', e.target.value)}
                                                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                                        placeholder="Enter navigation URL"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Add Item Button */}
                                        <button
                                            onClick={addHeaderNavItemHandler}
                                            disabled={!getEmptyHeaderItem()?.name || !getEmptyHeaderItem()?.url || headerNavMenuItems.length >= 6}
                                            className="w-full px-3 py-2 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add Item {headerNavMenuItems.length > 1 && `(${headerNavMenuItems.length - 1}/5)`}
                                        </button>

                                        {/* Limit Message */}
                                        {headerNavMenuItems.length >= 6 && (
                                            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                                Maximum 5 items allowed for header navigation
                                            </div>
                                        )}

                                        {/* Added Items List - Show all items except the first (input form) */}
                                        {headerNavMenuItems.length > 1 && (
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-600 font-medium">Added Items:</div>
                                                {headerNavMenuItems.slice(1).map((item) => (
                                                    <div
                                                        key={item.id}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, item.id)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, item.id, true)}
                                                        onDragEnd={handleDragEnd}
                                                        className={`flex items-center justify-between py-1 px-2 rounded-lg transition-colors cursor-move ${draggedItem === item.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs text-gray-400">⋮⋮</span>
                                                            <span className="text-xs text-gray-700">{item.name}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => dispatch(removeHeaderNavItem(item.id))}
                                                            className="text-xs text-red-500 hover:text-red-700 ml-2"
                                                        >
                                                            <Icon icon="fluent:delete-48-filled" className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-gray-200"></div>

                            {/* Footer Navigation Section */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-semibold text-gray-900 uppercase">Show Footer Navigation</h3>
                                    <button
                                        onClick={handleFooterNavToggle}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${footerNavMenu ? 'bg-primary' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${footerNavMenu ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                {footerNavMenu && (
                                    <div className="space-y-3">
                                        {/* Input Form - Only show the first item */}
                                        {footerNavMenuItems.length > 0 && (
                                            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                                                <div className="text-[10px] text-gray-600 font-semibold uppercase">Add New Item</div>

                                                {/* Name Input */}
                                                <div>
                                                    <label className="block text-[10px] text-gray-600 mb-1 font-semibold uppercase">Name</label>
                                                    <input
                                                        type="text"
                                                        value={footerNavMenuItems[0].name}
                                                        onChange={(e) => updateFooterNavItemHandler(footerNavMenuItems[0].id, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                                        placeholder="Enter navigation name"
                                                    />
                                                </div>

                                                {/* URL Input */}
                                                <div>
                                                    <label className="block text-[10px] text-gray-600 mb-1 font-semibold uppercase">URL</label>
                                                    <input
                                                        type="text"
                                                        value={footerNavMenuItems[0].url}
                                                        onChange={(e) => updateFooterNavItemHandler(footerNavMenuItems[0].id, 'url', e.target.value)}
                                                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                                        placeholder="Enter navigation URL"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Add Item Button */}
                                        <button
                                            onClick={addFooterNavItemHandler}
                                            disabled={!getEmptyFooterItem()?.name || !getEmptyFooterItem()?.url || footerNavMenuItems.length >= 4}
                                            className="w-full px-3 py-2 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add Item {footerNavMenuItems.length > 1 && `(${footerNavMenuItems.length - 1}/3)`}
                                        </button>

                                        {/* Limit Message */}
                                        {footerNavMenuItems.length >= 4 && (
                                            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                                Maximum 3 items allowed for footer navigation
                                            </div>
                                        )}

                                        {/* Added Items List - Show all items except the first (input form) */}
                                        {footerNavMenuItems.length > 1 && (
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-600 font-medium">Added Items:</div>
                                                {footerNavMenuItems.slice(1).map((item) => (
                                                    <div
                                                        key={item.id}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, item.id)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, item.id, false)}
                                                        onDragEnd={handleDragEnd}
                                                        className={`flex items-center justify-between py-1 px-2 rounded-lg transition-colors cursor-move ${draggedItem === item.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs text-gray-400">⋮⋮</span>
                                                            <span className="text-xs text-gray-700">{item.name}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => dispatch(removeFooterNavItem(item.id))}
                                                            className="text-xs text-red-500 hover:text-red-700 ml-2"
                                                        >
                                                            <Icon icon="fluent:delete-48-filled" className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
};
