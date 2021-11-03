import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {MenuItem} from '@mui/material';

export default function PageMenu(props: any) {
    const location = useLocation();
    const history = useHistory();
    let [item, setItem] = React.useState('/projects');

    const locations: { path: string; items: { name: string; path: String; }[] }[] = [
        {
            path: '/projects',
            items: [
                {
                    name: 'Create project',
                    path: '/create-project'
                }
            ]
        },
        {
            path: '/issues',
            items: [
                {
                    name: 'Create issue',
                    path: '/create-issue'
                }
            ]
        }
    ]

    React.useEffect(() => {
        setItem(location.pathname);
    }, [location]);

    const itemIdx = locations.findIndex(e => e.path === item);

    if (itemIdx === -1) {
        return null;
    }

    const items = locations[itemIdx].items;

    return (
        <div>
            {items.map(item => (<MenuItem onClick={() => {
                history.push(item.path as string);
                props.close();
            }}>{item.name}</MenuItem>))}
        </div>
    );
}
