import {useLocation} from 'react-router-dom';
import React from 'react';

export default function PageTitle() {
    const location = useLocation();
    let [item, setItem] = React.useState('/projects');
    React.useEffect(() => {
        setItem(location.pathname);
    }, [location]);

    const locations: { path: string; title: string; }[] = [
        {
            path: '/create-project',
            title: 'Create project'
        }
    ];

    const itemIdx = locations.findIndex(e => e.path === item);

    if (itemIdx === -1) {
        return null;
    }

    const items = locations[itemIdx];

    return <div>{items.title}</div>;
}
