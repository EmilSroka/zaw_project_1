import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const { user: { isLoggedIn }, logoutUser } = useUser();
    const navigate = useNavigate();

    const items =
        isLoggedIn ? [
            {
                label: 'Oś czasu',
                icon: 'pi pi-fw pi-calendar',
                command: () => navigate('/timeline'),
            },
            {
                label: 'Kategorie',
                icon: 'pi pi-fw pi-tags',
                command: () => navigate('/tags'),
            },
            {
                label: 'Zmień hasło',
                icon: 'pi pi-fw pi-pencil',
                command: () => navigate('/change-password'),
            },
            {
                label: 'Drukuj',
                icon: 'pi pi-fw pi-print',
                command: () => navigate('/timeline?print=true'),
            },
            {
                label: 'Wyloguj',
                icon: 'pi pi-fw pi-power-off',
                command: () => { logoutUser(); navigate('/timeline'); },
            },
        ] : [
            {
                label: 'Oś czasu',
                icon: 'pi pi-fw pi-calendar',
                command: () => navigate('/timeline'),
            },
            {
                label: 'Drukuj',
                icon: 'pi pi-fw pi-print',
                command: () => navigate('/timeline?print=true'),
            },
            {
                label: 'Zaloguj',
                icon: 'pi pi-fw pi-user',
                command: () => navigate('/login'),
            },
        ];

    return <div className="hide-for-print"><Menubar model={items} /></div>
}

export default Navbar;
