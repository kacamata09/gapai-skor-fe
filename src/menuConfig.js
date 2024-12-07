const defaultMenuItems = {
    items: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    icon: 'feather icon-home',
                    url: '/'
                },
                {
                    id: 'test',
                    title: 'Test',
                    type: 'item',
                    icon: 'feather icon-server',
                    url: '/test'
                },
                {
                    id: 'riwayat_test',
                    title: 'Riwayat Test',
                    type: 'item',
                    icon: 'feather icon-clock',
                    url: '/riwayat_test'
                }
            ]
        }
    ]
};

const adminMenuItems = {
    items: [
        {
            id: 'ui-forms',
            title: 'Admin',
            type: 'group',
            icon: 'icon-group',
            children: [
                {
                    id: 'admin_tests',
                    title: 'Test Management',
                    type: 'item',
                    icon: 'feather icon-file-text',
                    url: '/admin_test'
                }
            ]
        }
    ]
};

export { defaultMenuItems, adminMenuItems };
