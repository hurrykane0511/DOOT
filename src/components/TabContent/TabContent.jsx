import React from 'react';
import './tabcontent.css'

const TabContent = ({ tabContent }) => {
    
    return (
        <div className='tab_content w-100 h-100'>
            { tabContent }
        </div>
    );
}

export default TabContent;
